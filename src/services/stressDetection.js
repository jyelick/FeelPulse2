// This service detects stress patterns based on HRV data
// In a real application, this would use more sophisticated algorithms

// Detect stress from HRV trends
export const detectStressFromHRV = (hrvData) => {
  // Need at least 3 data points for trend analysis
  if (!hrvData || hrvData.length < 3) {
    return false;
  }
  
  // Sort data by date to ensure chronological order
  const sortedData = [...hrvData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Check for decreasing trend
  const isDecreasing = detectDecreasingTrend(sortedData);
  
  // Check for high variability (might indicate acute stress)
  const hasHighVariability = detectHighVariability(sortedData);
  
  // Check for consistently low values
  const hasLowValues = detectConsistentlyLowValues(sortedData);
  
  // If any of these patterns are detected, we might want to alert the user
  return isDecreasing || hasHighVariability || hasLowValues;
};

// Detect a consistently decreasing trend in HRV
const detectDecreasingTrend = (data) => {
  // Get the most recent 3-5 data points
  const recentData = data.slice(-5);
  
  if (recentData.length < 3) return false;
  
  // Calculate a simple linear regression
  const xValues = recentData.map((_, index) => index);
  const yValues = recentData.map(entry => entry.value);
  
  const slope = calculateSlope(xValues, yValues);
  
  // If the slope is negative and significant, it's a decreasing trend
  return slope < -2; // This threshold can be adjusted
};

// Detect unusually high variability between consecutive readings
const detectHighVariability = (data) => {
  if (data.length < 3) return false;
  
  // Calculate percentage changes between consecutive readings
  const changes = [];
  for (let i = 1; i < data.length; i++) {
    const percentChange = Math.abs((data[i].value - data[i-1].value) / data[i-1].value * 100);
    changes.push(percentChange);
  }
  
  // Calculate the average change
  const avgChange = changes.reduce((sum, change) => sum + change, 0) / changes.length;
  
  // If the average change is above a threshold, it indicates high variability
  return avgChange > 25; // This threshold can be adjusted
};

// Detect if HRV values are consistently low
const detectConsistentlyLowValues = (data) => {
  if (data.length < 3) return false;
  
  // This threshold should ideally be personalized, but we'll use a general value
  const lowThreshold = 30; // ms
  
  // Count how many recent values are below the threshold
  const lowValueCount = data.slice(-3).filter(entry => entry.value < lowThreshold).length;
  
  // If most recent values are below threshold, alert the user
  return lowValueCount >= 2;
};

// Helper function to calculate the slope of a linear regression
const calculateSlope = (xValues, yValues) => {
  const n = xValues.length;
  
  // Calculate means
  const xMean = xValues.reduce((sum, x) => sum + x, 0) / n;
  const yMean = yValues.reduce((sum, y) => sum + y, 0) / n;
  
  // Calculate slope
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (xValues[i] - xMean) * (yValues[i] - yMean);
    denominator += Math.pow(xValues[i] - xMean, 2);
  }
  
  if (denominator === 0) return 0;
  
  return numerator / denominator;
};

// Get stress level description based on HRV data
export const getStressLevelDescription = (hrvData) => {
  if (!hrvData || hrvData.length < 3) {
    return 'Insufficient data';
  }
  
  // Sort data by date
  const sortedData = [...hrvData].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // Calculate average HRV
  const sum = sortedData.reduce((total, entry) => total + entry.value, 0);
  const average = sum / sortedData.length;
  
  // Determine stress level based on average HRV and trends
  if (detectDecreasingTrend(sortedData)) {
    return 'Increasing stress detected';
  } else if (detectHighVariability(sortedData)) {
    return 'Fluctuating stress levels';
  } else if (detectConsistentlyLowValues(sortedData)) {
    return 'Consistently high stress';
  } else if (average > 50) {
    return 'Low stress';
  } else if (average > 30) {
    return 'Moderate stress';
  } else {
    return 'High stress';
  }
};
