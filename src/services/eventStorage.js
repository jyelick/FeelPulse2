import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_STORAGE_KEY = 'userStressEvents';

// Save a new stress event
export const saveStressEvent = async (event) => {
  try {
    // Get existing events
    const existingEvents = await getStressEvents();
    
    // Add unique ID and timestamp
    const newEvent = {
      id: Date.now().toString(),
      timestamp: event.timestamp || new Date().toISOString(),
      date: event.date || new Date().toISOString().split('T')[0],
      ...event
    };
    
    // Add new event and sort by date (newest first)
    const updatedEvents = [...existingEvents, newEvent];
    updatedEvents.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Save to AsyncStorage
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    
    console.log('Stress event saved successfully');
    return newEvent;
  } catch (error) {
    console.error('Error saving stress event:', error);
    return null;
  }
};

// Get all stress events or events for specific number of days
export const getStressEvents = async (days = 0) => {
  try {
    const storedData = await AsyncStorage.getItem(EVENTS_STORAGE_KEY);
    
    if (!storedData) {
      return [];
    }
    
    const allEvents = JSON.parse(storedData);
    
    if (days <= 0) {
      // Return all events
      return allEvents;
    }
    
    // Filter events for the specified number of days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= cutoffDate;
    });
  } catch (error) {
    console.error('Error retrieving stress events:', error);
    return [];
  }
};

// Get stress events for a specific date
export const getStressEventsForDate = async (dateStr) => {
  try {
    const allEvents = await getStressEvents();
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.timestamp).toISOString().split('T')[0];
      return eventDate === dateStr;
    });
  } catch (error) {
    console.error('Error getting stress events for date:', error);
    return [];
  }
};

// Update an existing stress event
export const updateStressEvent = async (eventId, updatedData) => {
  try {
    const allEvents = await getStressEvents();
    
    const eventIndex = allEvents.findIndex(event => event.id === eventId);
    if (eventIndex === -1) {
      console.error('Event not found for update');
      return false;
    }
    
    // Update the event
    allEvents[eventIndex] = {
      ...allEvents[eventIndex],
      ...updatedData,
      timestamp: updatedData.timestamp || allEvents[eventIndex].timestamp
    };
    
    // Save updated events
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(allEvents));
    
    return true;
  } catch (error) {
    console.error('Error updating stress event:', error);
    return false;
  }
};

// Delete a stress event
export const deleteStressEvent = async (eventId) => {
  try {
    const allEvents = await getStressEvents();
    
    const updatedEvents = allEvents.filter(event => event.id !== eventId);
    
    await AsyncStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));
    
    return true;
  } catch (error) {
    console.error('Error deleting stress event:', error);
    return false;
  }
};

// Get stress events that occurred within a date range (for correlation analysis)
export const getStressEventsInRange = async (startDate, endDate) => {
  try {
    const allEvents = await getStressEvents();
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return allEvents.filter(event => {
      const eventDate = new Date(event.timestamp);
      return eventDate >= start && eventDate <= end;
    });
  } catch (error) {
    console.error('Error getting stress events in range:', error);
    return [];
  }
};

// Get events with intensity levels (for filtering high stress events)
export const getHighStressEvents = async (minIntensity = 4, days = 0) => {
  try {
    const events = await getStressEvents(days);
    
    return events.filter(event => event.intensity >= minIntensity);
  } catch (error) {
    console.error('Error getting high stress events:', error);
    return [];
  }
};

// Clear all stress events (for data management)
export const clearAllStressEvents = async () => {
  try {
    await AsyncStorage.removeItem(EVENTS_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing stress events:', error);
    return false;
  }
};

// Calculate stress event statistics
export const getStressEventStats = async (days = 30) => {
  try {
    const events = await getStressEvents(days);
    
    if (events.length === 0) {
      return {
        totalEvents: 0,
        averageIntensity: 0,
        highStressEvents: 0,
        mostCommonType: null,
        eventsThisWeek: 0
      };
    }
    
    // Calculate statistics
    const totalEvents = events.length;
    const averageIntensity = events.reduce((sum, event) => sum + event.intensity, 0) / totalEvents;
    const highStressEvents = events.filter(event => event.intensity >= 4).length;
    
    // Most common event type
    const typeCounts = {};
    events.forEach(event => {
      typeCounts[event.type] = (typeCounts[event.type] || 0) + 1;
    });
    const mostCommonType = Object.keys(typeCounts).reduce((a, b) => 
      typeCounts[a] > typeCounts[b] ? a : b, null
    );
    
    // Events this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const eventsThisWeek = events.filter(event => 
      new Date(event.timestamp) >= weekAgo
    ).length;
    
    return {
      totalEvents,
      averageIntensity: Math.round(averageIntensity * 10) / 10,
      highStressEvents,
      mostCommonType,
      eventsThisWeek
    };
  } catch (error) {
    console.error('Error calculating stress event stats:', error);
    return {
      totalEvents: 0,
      averageIntensity: 0,
      highStressEvents: 0,
      mostCommonType: null,
      eventsThisWeek: 0
    };
  }
};