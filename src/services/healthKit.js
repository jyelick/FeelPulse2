import { Platform } from 'react-native';
import { mockHRVData, mockHealthKitPermissions, mockHealthKitAuthorization } from '../utils/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HealthKit from 'react-native-health';

/**
 * Enhanced HealthKit Service
 * 
 * This service provides a comprehensive interface for working with 
 * Apple HealthKit data in the app. 
 * 
 * For production, this would be replaced with actual HealthKit integration.
 * For now, we'll use sophisticated mock implementations that mimic real behavior.
 */

// Check if HealthKit is available (iOS only)
export const isHealthKitAvailable = () => {
  return Platform.OS === 'ios';
};

// Get stored health permissions from AsyncStorage
const getStoredHealthPermissions = async () => {
  try {
    const permissions = await AsyncStorage.getItem('healthKitPermissions');
    return permissions ? JSON.parse(permissions) : null;
  } catch (error) {
    console.error('Error retrieving stored health permissions:', error);
    return null;
  }
};

// Store health permissions in AsyncStorage
const storeHealthPermissions = async (permissions) => {
  try {
    await AsyncStorage.setItem('healthKitPermissions', JSON.stringify(permissions));
  } catch (error) {
    console.error('Error storing health permissions:', error);
  }
};

// Request HealthKit permissions with proper error handling
export const requestHealthKitPermissions = async () => {
  console.log('Requesting HealthKit permissions...');
  
  try {
    // First check if already authorized
    const existingPermissions = await getStoredHealthPermissions();
    if (existingPermissions && existingPermissions.authorized) {
      console.log('HealthKit permissions already granted');
      return true;
    }
    
    if (!isHealthKitAvailable()) {
      console.log('HealthKit not available on this platform');
      // Fallback to mock data for non-iOS platforms
      const permissions = mockHealthKitPermissions;
      const isAuthorized = await mockHealthKitAuthorization();
      
      await storeHealthPermissions({
        permissions,
        authorized: isAuthorized,
        lastChecked: new Date().toISOString()
      });
      
      return isAuthorized;
    }
    
    // Define permissions for HRV and Sleep data
    const permissions = {
      permissions: {
        read: [
          HealthKit.Constants.Permissions.HeartRateVariabilitySDNN,
          HealthKit.Constants.Permissions.SleepAnalysis,
          HealthKit.Constants.Permissions.HeartRate,
          HealthKit.Constants.Permissions.RestingHeartRate
        ],
        write: []
      }
    };
    
    // Initialize HealthKit
    await HealthKit.initHealthKit(permissions);
    
    // Check authorization status
    const isAuthorized = await HealthKit.isAuthorizedToRead(HealthKit.Constants.Permissions.HeartRateVariabilitySDNN);
    
    // Store authorization results
    await storeHealthPermissions({
      permissions,
      authorized: isAuthorized,
      lastChecked: new Date().toISOString()
    });
    
    return isAuthorized;
  } catch (error) {
    console.error('Error requesting HealthKit permissions:', error);
    // Fallback to mock data on error
    const permissions = mockHealthKitPermissions;
    const isAuthorized = await mockHealthKitAuthorization();
    
    await storeHealthPermissions({
      permissions,
      authorized: isAuthorized,
      lastChecked: new Date().toISOString()
    });
    
    return isAuthorized;
  }
};

// Check HealthKit connection status with proper caching
export const checkHealthKitStatus = async () => {
  try {
    const status = await getStoredHealthPermissions();
    if (!status) {
      return false;
    }
    
    // If we checked recently, return cached result
    const lastChecked = new Date(status.lastChecked);
    const now = new Date();
    const hoursSinceLastCheck = (now - lastChecked) / (1000 * 60 * 60);
    
    // Recheck permission every 24 hours in case user revoked in settings
    if (hoursSinceLastCheck < 24) {
      return status.authorized;
    }
    
    // Otherwise, check again
    return await requestHealthKitPermissions();
  } catch (error) {
    console.error('Error checking HealthKit status:', error);
    return false;
  }
};

// Get HRV data from HealthKit with proper date filtering
export const getHRVData = async (days = 5) => {
  console.log(`Fetching HRV data for last ${days} days...`);
  
  try {
    if (!isHealthKitAvailable()) {
      console.log('HealthKit not available, using mock data');
      // Fallback to mock data for non-iOS platforms
      return new Promise((resolve) => {
        setTimeout(() => {
          const data = mockHRVData(days);
          resolve(data);
        }, 800);
      });
    }
    
    // Check if user has granted permissions
    const hasPermission = await checkHealthKitStatus();
    if (!hasPermission) {
      console.log('HealthKit permissions not granted, using mock data');
      return mockHRVData(days);
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch HRV data from HealthKit
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: false // Most recent first
    };
    
    const samples = await HealthKit.getSamples(HealthKit.Constants.Permissions.HeartRateVariabilitySDNN, options);
    
    // Transform HealthKit data to our format
    const data = samples.map(sample => ({
      date: new Date(sample.startDate).toISOString().split('T')[0],
      value: Math.round(sample.value * 1000 * 10) / 10, // Convert from seconds to ms and round
      sourceName: sample.sourceName || 'Apple Health'
    }));
    
    // Group by date (take average if multiple readings per day)
    const groupedData = {};
    data.forEach(item => {
      if (groupedData[item.date]) {
        groupedData[item.date].values.push(item.value);
      } else {
        groupedData[item.date] = {
          date: item.date,
          values: [item.value],
          sourceName: item.sourceName
        };
      }
    });
    
    // Calculate averages and format
    const formattedData = Object.values(groupedData).map(group => ({
      date: group.date,
      value: Math.round((group.values.reduce((sum, val) => sum + val, 0) / group.values.length) * 10) / 10,
      sourceName: group.sourceName
    }));
    
    // Sort by date (most recent first)
    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(`Retrieved ${formattedData.length} HRV data points from HealthKit`);
    return formattedData;
    
  } catch (error) {
    console.error('Error fetching HRV data from HealthKit:', error);
    // Fallback to mock data on error
    return mockHRVData(days);
  }
};

// Get the latest HRV reading with error handling
export const getLatestHRV = async () => {
  try {
    const data = await getHRVData(1);
    if (data && data.length > 0) {
      return data[0];
    }
    throw new Error('No HRV data available');
  } catch (error) {
    console.error('Error getting latest HRV:', error);
    return null;
  }
};

// Get Sleep data from HealthKit with proper date filtering
export const getSleepData = async (days = 7) => {
  console.log(`Fetching sleep data for last ${days} days...`);
  
  try {
    if (!isHealthKitAvailable()) {
      console.log('HealthKit not available, using mock data');
      // Fallback to mock sleep data for non-iOS platforms
      return [];
    }
    
    // Check if user has granted permissions
    const hasPermission = await checkHealthKitStatus();
    if (!hasPermission) {
      console.log('HealthKit permissions not granted, using mock data');
      return [];
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch sleep data from HealthKit
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: false // Most recent first
    };
    
    const samples = await HealthKit.getSamples(HealthKit.Constants.Permissions.SleepAnalysis, options);
    
    // Group sleep sessions by date
    const sleepByDate = {};
    
    samples.forEach(sample => {
      const date = new Date(sample.startDate).toISOString().split('T')[0];
      const startTime = new Date(sample.startDate);
      const endTime = new Date(sample.endDate);
      const duration = (endTime - startTime) / (1000 * 60 * 60); // Duration in hours
      
      if (!sleepByDate[date]) {
        sleepByDate[date] = {
          date,
          sessions: [],
          totalDuration: 0
        };
      }
      
      sleepByDate[date].sessions.push({
        startTime: sample.startDate,
        endTime: sample.endDate,
        duration,
        value: sample.value, // Sleep stage (awake, light, deep, REM)
        sourceName: sample.sourceName || 'Apple Health'
      });
      
      sleepByDate[date].totalDuration += duration;
    });
    
    // Format sleep data
    const formattedData = Object.values(sleepByDate).map(dayData => {
      const sessions = dayData.sessions;
      const mainSleep = sessions.reduce((longest, session) => 
        session.duration > longest.duration ? session : longest
      );
      
      return {
        date: dayData.date,
        duration_hours: Math.round(dayData.totalDuration * 10) / 10,
        quality: 4, // Default quality, could be calculated based on sleep stages
        bedtime: new Date(mainSleep.startTime).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        waketime: new Date(mainSleep.endTime).toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        notes: `${sessions.length} sleep session(s)`,
        sourceName: mainSleep.sourceName
      };
    });
    
    // Sort by date (most recent first)
    formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log(`Retrieved ${formattedData.length} sleep data points from HealthKit`);
    return formattedData;
    
  } catch (error) {
    console.error('Error fetching sleep data from HealthKit:', error);
    return [];
  }
};

// Calculate HRV trends for health insights
export const calculateHRVTrends = async (days = 14) => {
  try {
    const data = await getHRVData(days);
    if (!data || data.length < 2) {
      return { trend: 'neutral', change: 0 };
    }
    
    // Calculate average of first half vs second half to determine trend
    const midpoint = Math.floor(data.length / 2);
    const recentData = data.slice(0, midpoint);
    const olderData = data.slice(midpoint);
    
    const recentAvg = recentData.reduce((sum, item) => sum + item.value, 0) / recentData.length;
    const olderAvg = olderData.reduce((sum, item) => sum + item.value, 0) / olderData.length;
    
    const percentChange = ((recentAvg - olderAvg) / olderAvg) * 100;
    
    let trend = 'neutral';
    if (percentChange > 5) trend = 'improving';
    if (percentChange < -5) trend = 'declining';
    
    return {
      trend,
      change: Math.round(percentChange * 10) / 10, // Round to 1 decimal place
      recentAverage: Math.round(recentAvg * 10) / 10,
      data
    };
  } catch (error) {
    console.error('Error calculating HRV trends:', error);
    return { trend: 'neutral', change: 0 };
  }
};

// Get the latest sleep entry
export const getLatestSleep = async () => {
  try {
    const data = await getSleepData(1);
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error) {
    console.error('Error getting latest sleep:', error);
    return null;
  }
};

// Calculate sleep trends and insights
export const calculateSleepTrends = async (days = 14) => {
  try {
    const data = await getSleepData(days);
    if (!data || data.length < 2) {
      return { trend: 'neutral', change: 0, averageDuration: 0, averageQuality: 0 };
    }
    
    const avgDuration = data.reduce((sum, item) => sum + item.duration_hours, 0) / data.length;
    const avgQuality = data.reduce((sum, item) => sum + item.quality, 0) / data.length;
    
    // Calculate trend based on recent vs older data
    const midpoint = Math.floor(data.length / 2);
    const recentData = data.slice(0, midpoint);
    const olderData = data.slice(midpoint);
    
    const recentAvgDuration = recentData.reduce((sum, item) => sum + item.duration_hours, 0) / recentData.length;
    const olderAvgDuration = olderData.reduce((sum, item) => sum + item.duration_hours, 0) / olderData.length;
    
    const durationChange = ((recentAvgDuration - olderAvgDuration) / olderAvgDuration) * 100;
    
    let trend = 'neutral';
    if (durationChange > 5) trend = 'improving';
    if (durationChange < -5) trend = 'declining';
    
    return {
      trend,
      change: Math.round(durationChange * 10) / 10,
      averageDuration: Math.round(avgDuration * 10) / 10,
      averageQuality: Math.round(avgQuality * 10) / 10,
      data
    };
  } catch (error) {
    console.error('Error calculating sleep trends:', error);
    return { trend: 'neutral', change: 0, averageDuration: 0, averageQuality: 0 };
  }
};
