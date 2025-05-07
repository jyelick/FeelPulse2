import AsyncStorage from '@react-native-async-storage/async-storage';

// Save a new mood entry
export const saveMoodEntry = async (entry) => {
  try {
    // Get existing entries
    const existingEntries = await getMoodData();
    
    // Check if an entry already exists for this date
    const dateStr = entry.date;
    const existingIndex = existingEntries.findIndex(item => {
      const itemDate = new Date(item.timestamp).toISOString().split('T')[0];
      return itemDate === dateStr;
    });
    
    let updatedEntries;
    
    if (existingIndex >= 0) {
      // Update existing entry
      updatedEntries = [...existingEntries];
      updatedEntries[existingIndex] = entry;
    } else {
      // Add new entry
      updatedEntries = [...existingEntries, entry];
    }
    
    // Sort entries by date (newest first)
    updatedEntries.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Save to AsyncStorage
    await AsyncStorage.setItem('userMoodEntries', JSON.stringify(updatedEntries));
    
    return true;
  } catch (error) {
    console.error('Error saving mood entry:', error);
    return false;
  }
};

// Get all mood data or data for a specific number of days
export const getMoodData = async (days = 0) => {
  try {
    const storedData = await AsyncStorage.getItem('userMoodEntries');
    
    if (!storedData) {
      // If no data exists, return sample data for demonstration
      return generateSampleMoodData(days || 5);
    }
    
    const allEntries = JSON.parse(storedData);
    
    if (days <= 0) {
      // Return all entries
      return allEntries;
    }
    
    // Filter entries for the specified number of days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return allEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate >= cutoffDate;
    });
  } catch (error) {
    console.error('Error retrieving mood data:', error);
    return [];
  }
};

// Get a mood entry for a specific date
export const getMoodEntryForDate = async (dateStr) => {
  try {
    const allEntries = await getMoodData();
    
    return allEntries.find(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === dateStr;
    });
  } catch (error) {
    console.error('Error getting mood entry for date:', error);
    return null;
  }
};

// Delete a mood entry for a specific date
export const deleteMoodEntry = async (dateStr) => {
  try {
    const allEntries = await getMoodData();
    
    const updatedEntries = allEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate !== dateStr;
    });
    
    await AsyncStorage.setItem('userMoodEntries', JSON.stringify(updatedEntries));
    
    return true;
  } catch (error) {
    console.error('Error deleting mood entry:', error);
    return false;
  }
};

// Delete all mood entries
export const clearAllMoodEntries = async () => {
  try {
    await AsyncStorage.removeItem('userMoodEntries');
    return true;
  } catch (error) {
    console.error('Error clearing mood entries:', error);
    return false;
  }
};

// Generate sample mood data for demonstration purposes
const generateSampleMoodData = (days = 5) => {
  const data = [];
  const today = new Date();
  
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate a random mood value between 2 and 5
    // (Slightly biased toward positive moods for demo purposes)
    const mood = Math.floor(Math.random() * 4) + 2;
    
    let moodText, moodEmoji;
    switch(mood) {
      case 1:
        moodText = 'Very Sad';
        moodEmoji = '😢';
        break;
      case 2:
        moodText = 'Sad';
        moodEmoji = '😕';
        break;
      case 3:
        moodText = 'Neutral';
        moodEmoji = '😐';
        break;
      case 4:
        moodText = 'Happy';
        moodEmoji = '😊';
        break;
      case 5:
        moodText = 'Very Happy';
        moodEmoji = '😃';
        break;
    }
    
    data.push({
      timestamp: date.toISOString(),
      date: date.toISOString().split('T')[0],
      mood,
      moodText,
      moodEmoji,
      notes: ''
    });
  }
  
  return data;
};
