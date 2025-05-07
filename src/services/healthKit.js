import { Platform } from 'react-native';
import { mockHRVData, mockHealthKitPermissions, mockHealthKitAuthorization } from '../utils/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    
    // In a real app, this would request permissions from HealthKit API
    // Mock a real permission request with proper delays for UI feedback
    const permissions = mockHealthKitPermissions;
    const isAuthorized = await mockHealthKitAuthorization();
    
    // Store authorization results
    await storeHealthPermissions({
      permissions,
      authorized: isAuthorized,
      lastChecked: new Date().toISOString()
    });
    
    return isAuthorized;
  } catch (error) {
    console.error('Error requesting HealthKit permissions:', error);
    return false;
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
    // For demo, add realistic delay to simulate network request
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get and filter mock data
        const data = mockHRVData(days);
        resolve(data);
      }, 800); // Typical API response time
    });
  } catch (error) {
    console.error('Error fetching HRV data:', error);
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
