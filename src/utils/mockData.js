// This file contains mock data for development and testing purposes

// Generate mock HRV data for the past N days
export const mockHRVData = (days = 30) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Baseline HRV with some random variation
    let value = 50 + Math.random() * 20;
    
    // Add a simulated trend
    // For demo purposes: decreasing trend over the past 5 days
    if (i < 5) {
      value = value - (4 - i) * 5;
    }
    
    // Add some noise
    value = value + (Math.random() * 10 - 5);
    
    // Ensure reasonable values (ms)
    value = Math.max(20, Math.min(100, value));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 10) / 10, // Round to 1 decimal place
      sourceName: 'Apple Health',
    });
  }
  
  return data;
};

// Generate mock Apple HealthKit permissions structure
export const mockHealthKitPermissions = {
  permissions: {
    read: [
      'HeartRate',
      'RestingHeartRate',
      'HeartRateVariabilitySDNN',
      'ActiveEnergyBurned',
      'StepCount',
      'SleepAnalysis'
    ],
    write: []
  }
};

// Mock function to simulate HealthKit authorization result
export const mockHealthKitAuthorization = () => {
  // Return a Promise to simulate the async nature of authorization
  return new Promise((resolve) => {
    // 90% chance of success for demo purposes
    const isAuthorized = Math.random() < 0.9;
    
    // Add a slight delay to simulate real-world behavior
    setTimeout(() => {
      resolve(isAuthorized);
    }, 500);
  });
};
