import { Platform } from 'react-native';
import { mockHRVData, mockHealthKitPermissions, mockHealthKitAuthorization } from '../utils/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppleHealthKit from 'react-native-health';

/**
 * Enhanced HealthKit Service
 * 
 * This service provides a comprehensive interface for working with 
 * Apple HealthKit data in the app using react-native-health.
 * 
 * IMPORTANT: This requires proper Expo configuration for HealthKit:
 * 1. Add HealthKit capability in app.json/app.config.js
 * 2. Add NSHealthShareUsageDescription and NSHealthUpdateUsageDescription
 * 3. Use expo prebuild and custom dev client (HealthKit won't work in Expo Go)
 * 4. Ensure react-native-health is properly linked
 * 
 * For development without iOS device, falls back to mock data.
 */

// Check if HealthKit is available (iOS only)
export const isHealthKitAvailable = async () => {
  if (Platform.OS !== 'ios') {
    return false;
  }
  
  try {
    // Check if HealthKit is available on device using callback
    return new Promise((resolve) => {
      AppleHealthKit.isAvailable((error, available) => {
        if (error) {
          console.log('HealthKit availability check failed:', error);
          resolve(false);
        } else {
          resolve(available);
        }
      });
    });
  } catch (error) {
    console.log('HealthKit availability check failed:', error);
    return false;
  }
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
    
    const available = await isHealthKitAvailable();
    if (!available) {
      console.log('HealthKit not available on this platform');
      // Only use mock auth for non-iOS platforms, not iOS failures
      if (Platform.OS !== 'ios') {
        const permissions = mockHealthKitPermissions;
        const isAuthorized = await mockHealthKitAuthorization();
        
        await storeHealthPermissions({
          permissions,
          authorized: isAuthorized,
          lastChecked: new Date().toISOString()
        });
        
        return isAuthorized;
      } else {
        // On iOS, if HealthKit unavailable, don't store mock auth
        console.log('HealthKit unavailable on iOS - check if app is running in Expo Go');
        return false;
      }
    }
    
    // Define permissions for HRV and Sleep data
    const permissions = {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.HeartRateVariabilitySDNN,
          AppleHealthKit.Constants.Permissions.SleepAnalysis,
          AppleHealthKit.Constants.Permissions.HeartRate
        ],
        write: []
      }
    };
    
    // Initialize HealthKit with callback
    const initSuccess = await new Promise((resolve) => {
      AppleHealthKit.initHealthKit(permissions, (error) => {
        if (error) {
          console.log('HealthKit initialization error:', error);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    
    if (!initSuccess) {
      console.log('HealthKit initialization failed');
      return false;
    }
    
    // Check actual authorization status after initialization
    const isAuthorized = await new Promise((resolve) => {
      AppleHealthKit.getAuthStatus(permissions, (error, results) => {
        if (error) {
          console.log('Error checking post-init auth status:', error);
          resolve(false);
        } else {
          // Check if we have required permissions granted
          const hrvStatus = results[AppleHealthKit.Constants.Permissions.HeartRateVariabilitySDNN];
          const sleepStatus = results[AppleHealthKit.Constants.Permissions.SleepAnalysis];
          const heartRateStatus = results[AppleHealthKit.Constants.Permissions.HeartRate];
          
          // Check for SHARING_AUTHORIZED status (uppercase constant)
          const hasPermissions = (
            hrvStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED ||
            sleepStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED ||
            heartRateStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED
          );
          resolve(hasPermissions);
        }
      });
    });
    
    // Store authorization results
    await storeHealthPermissions({
      permissions,
      authorized: isAuthorized,
      lastChecked: new Date().toISOString()
    });
    
    return isAuthorized;
  } catch (error) {
    console.error('Error requesting HealthKit permissions:', error);
    // Only use mock auth for non-iOS platforms on error
    if (Platform.OS !== 'ios') {
      const permissions = mockHealthKitPermissions;
      const isAuthorized = await mockHealthKitAuthorization();
      
      await storeHealthPermissions({
        permissions,
        authorized: isAuthorized,
        lastChecked: new Date().toISOString()
      });
      
      return isAuthorized;
    } else {
      // On iOS, if HealthKit fails, don't store mock auth
      console.log('HealthKit error on iOS - may need custom dev client instead of Expo Go');
      return false;
    }
  }
};

// Check HealthKit connection status
export const checkHealthKitStatus = async () => {
  try {
    const available = await isHealthKitAvailable();
    if (!available) {
      return false;
    }
    
    // Check current authorization status from HealthKit directly
    const authStatus = await new Promise((resolve) => {
      const permissions = {
        permissions: {
          read: [
            AppleHealthKit.Constants.Permissions.HeartRateVariabilitySDNN,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.HeartRate
          ],
          write: []
        }
      };
      
      AppleHealthKit.getAuthStatus(permissions, (error, results) => {
        if (error) {
          console.log('Error checking auth status:', error);
          resolve(false);
        } else {
          // Check if we have required permissions granted
          const hrvStatus = results[AppleHealthKit.Constants.Permissions.HeartRateVariabilitySDNN];
          const sleepStatus = results[AppleHealthKit.Constants.Permissions.SleepAnalysis];
          const heartRateStatus = results[AppleHealthKit.Constants.Permissions.HeartRate];
          
          // Check for SHARING_AUTHORIZED status (uppercase constant)
          const hasPermissions = (
            hrvStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED ||
            sleepStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED ||
            heartRateStatus === AppleHealthKit.Constants.AuthorizationStatus.SHARING_AUTHORIZED
          );
          resolve(hasPermissions);
        }
      });
    });
    
    return authStatus;
  } catch (error) {
    console.error('Error checking HealthKit status:', error);
    return false;
  }
};

// Get HRV data from backend API first, then HealthKit as fallback
export const getHRVData = async (days = 5) => {
  // Import API service dynamically
  const { fetchHRVFromAPI } = await import('./apiService');
  
  // Try backend API first
  const apiData = await fetchHRVFromAPI(days);
  if (apiData.length > 0) {
    return apiData;
  }
  console.log(`Fetching HRV data from HealthKit for last ${days} days...`);
  
  try {
    const available = await isHealthKitAvailable();
    if (!available) {
      console.log('HealthKit not available, returning empty data');
      return [];
    }
    
    // Check if user has granted permissions
    const hasPermission = await checkHealthKitStatus();
    if (!hasPermission) {
      console.log('HealthKit permissions not granted, returning empty data');
      return [];
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch HRV data from HealthKit using callback
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: false // Most recent first
    };
    
    const samples = await new Promise((resolve, reject) => {
      AppleHealthKit.getHeartRateVariabilitySamples(options, (error, results) => {
        if (error) {
          console.log('Error fetching HRV data:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    
    // Transform HealthKit data to our format
    const data = samples.map(sample => ({
      date: new Date(sample.startDate).toISOString().split('T')[0],
      value: Math.round(sample.value * 10) / 10, // HRV is already in ms, just round
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
    // Return empty data on error
    return [];
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
    const available = await isHealthKitAvailable();
    if (!available) {
      console.log('HealthKit not available, returning empty data');
      // Return empty data when HealthKit is not available
      return [];
    }
    
    // Check if user has granted permissions
    const hasPermission = await checkHealthKitStatus();
    if (!hasPermission) {
      console.log('HealthKit permissions not granted, returning empty data');
      return [];
    }
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch sleep data from HealthKit using callback
    const options = {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      ascending: false // Most recent first
    };
    
    const samples = await new Promise((resolve, reject) => {
      AppleHealthKit.getSleepSamples(options, (error, results) => {
        if (error) {
          console.log('Error fetching sleep data:', error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
    
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
