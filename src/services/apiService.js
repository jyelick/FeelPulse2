// API Service for backend communication
const getBaseUrl = () => {
  if (process.env.REPLIT_DEV_DOMAIN) {
    return `https://${process.env.REPLIT_DEV_DOMAIN}-3001.replit.dev`;
  }
  return 'http://localhost:3001';
};

// Fetch HRV data from backend
export const fetchHRVFromAPI = async (days = 7) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/hrv`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched HRV data from API:', data);
    
    return data.slice(0, days).map(item => ({
      value: item.value,
      date: new Date(item.timestamp).toISOString().split('T')[0],
      timestamp: item.timestamp
    }));
  } catch (error) {
    console.error('Error fetching HRV data from API:', error);
    return [];
  }
};

// Fetch mood data from backend
export const fetchMoodFromAPI = async (days = 14) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/mood`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched mood data from API:', data);
    
    return data.slice(0, days);
  } catch (error) {
    console.error('Error fetching mood data from API:', error);
    return [];
  }
};

// Fetch user settings from backend
export const fetchUserSettingsFromAPI = async (userId = 1) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/settings/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched user settings from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching user settings from API:', error);
    return null;
  }
};

// Fetch stress assessment from backend
export const fetchStressAssessment = async () => {
  try {
    const baseUrl = getBaseUrl();
    const response = await fetch(`${baseUrl}/api/stress/assess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Basic request body for stress assessment
        userId: 1
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Fetched stress assessment from API:', data);
    
    return data;
  } catch (error) {
    console.error('Error fetching stress assessment from API:', error);
    return { level: 'low', recommendations: [] };
  }
};