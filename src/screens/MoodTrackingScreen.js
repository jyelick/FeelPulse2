import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Text, Button, Card, Title, Paragraph, Divider, TextInput, Switch, Chip } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import { theme } from '../utils/theme';
import MoodSelector from '../components/MoodSelector';
import { saveMoodEntry, getMoodData } from '../services/moodStorage';

const MoodTrackingScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState(null);
  const [notes, setNotes] = useState('');
  const [hasStressEvent, setHasStressEvent] = useState(false);
  const [markedDates, setMarkedDates] = useState({});
  const [moodHistory, setMoodHistory] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    loadMoodHistory();
  }, []);
  
  const loadMoodHistory = async () => {
    try {
      const moodData = await getMoodData();
      setMoodHistory(moodData);
      
      // Create marked dates for calendar
      const marked = {};
      moodData.forEach(entry => {
        const date = new Date(entry.timestamp).toISOString().split('T')[0];
        marked[date] = { 
          marked: true, 
          dotColor: getMoodColor(entry.mood),
          // Add red dot overlay for stress events
          ...(entry.hasStressEvent && { 
            marked: true,
            dots: [{ color: '#FF0000', selectedDotColor: '#FFFFFF' }]
          })
        };
      });
      setMarkedDates(marked);
    } catch (error) {
      console.error('Error loading mood history:', error);
    }
  };
  
  const getMoodColor = (mood) => {
    switch(mood) {
      case 1: return '#E53935'; // very sad - red
      case 2: return '#FB8C00'; // sad - orange
      case 3: return '#FFD600'; // neutral - yellow
      case 4: return '#7CB342'; // happy - light green
      case 5: return '#00897B'; // very happy - teal
      default: return theme.colors.primary;
    }
  };
  
  const getMoodText = (mood) => {
    switch(mood) {
      case 1: return 'Very Sad';
      case 2: return 'Sad';
      case 3: return 'Neutral';
      case 4: return 'Happy';
      case 5: return 'Very Happy';
      default: return '';
    }
  };
  
  const getMoodEmoji = (mood) => {
    switch(mood) {
      case 1: return '😢';
      case 2: return '😕';
      case 3: return '😐';
      case 4: return '😊';
      case 5: return '😃';
      default: return '';
    }
  };

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (selectedMood === null) return;
    
    setIsSubmitting(true);
    try {
      const entry = {
        timestamp: new Date().toISOString(),
        date: selectedDate,
        mood: selectedMood,
        moodText: getMoodText(selectedMood),
        moodEmoji: getMoodEmoji(selectedMood),
        notes: notes.trim(),
        hasStressEvent: hasStressEvent
      };
      
      await saveMoodEntry(entry);
      
      // Show success feedback with stress event mention
      if (hasStressEvent) {
        Alert.alert(
          'Mood Saved! ⚠️',
          'Your mood has been logged with a stress event marker. This will help track correlations with your HRV and sleep data.',
          [{ text: 'OK' }]
        );
      }
      
      setNotes('');
      setHasStressEvent(false);
      loadMoodHistory(); // Reload to update calendar
    } catch (error) {
      console.error('Error saving mood entry:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getEntryForDate = (date) => {
    return moodHistory.find(entry => {
      const entryDate = new Date(entry.timestamp).toISOString().split('T')[0];
      return entryDate === date;
    });
  };

  const handleDateSelect = (day) => {
    setSelectedDate(day.dateString);
    
    // If there's an entry for this date, display it
    const entry = getEntryForDate(day.dateString);
    if (entry) {
      setSelectedMood(entry.mood);
      setNotes(entry.notes || '');
      setHasStressEvent(entry.hasStressEvent || false);
    } else {
      setSelectedMood(null);
      setNotes('');
      setHasStressEvent(false);
    }
  };

  const isToday = (date) => {
    const today = new Date().toISOString().split('T')[0];
    return date === today;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Track Your Mood</Title>
        
        <Card style={styles.calendarCard}>
          <Card.Content>
            <Calendar
              current={selectedDate}
              minDate={'2020-01-01'}
              maxDate={new Date().toISOString().split('T')[0]}
              onDayPress={handleDateSelect}
              markedDates={{
                ...markedDates,
                [selectedDate]: {
                  ...markedDates[selectedDate],
                  selected: true,
                  selectedColor: theme.colors.primary,
                }
              }}
              theme={{
                selectedDayBackgroundColor: theme.colors.primary,
                todayTextColor: theme.colors.primary,
                arrowColor: theme.colors.primary,
              }}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.moodCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              {isToday(selectedDate) ? 'How are you feeling today?' : `How did you feel on ${new Date(selectedDate).toLocaleDateString()}?`}
            </Title>
            
            <MoodSelector
              selectedMood={selectedMood}
              onSelectMood={handleMoodSelection}
            />
            
            {selectedMood && isToday(selectedDate) && (
              <Card style={styles.stressEventCard}>
                <Card.Content>
                  <View style={styles.stressEventContainer}>
                    <View style={styles.stressEventLabel}>
                      <Text style={styles.stressEventText}>⚠️ Major Stressful Event</Text>
                      <Text style={styles.stressEventSubtext}>
                        Toggle if you experienced a significant stressor today
                      </Text>
                    </View>
                    <Switch
                      value={hasStressEvent}
                      onValueChange={setHasStressEvent}
                      thumbColor={hasStressEvent ? '#FF5722' : '#f4f3f4'}
                      trackColor={{ false: '#767577', true: '#FFB399' }}
                    />
                  </View>
                  {hasStressEvent && (
                    <Chip
                      icon="alert"
                      mode="outlined"
                      textStyle={{ color: '#FF5722' }}
                      style={{ borderColor: '#FF5722', marginTop: 8 }}
                    >
                      Stress event will be shown in health correlations
                    </Chip>
                  )}
                </Card.Content>
              </Card>
            )}
            
            {selectedMood && (
              <View style={styles.notesContainer}>
                <TextInput
                  label="Notes (optional)"
                  value={notes}
                  onChangeText={setNotes}
                  multiline
                  style={styles.notesInput}
                  disabled={!isToday(selectedDate) && getEntryForDate(selectedDate)}
                />
              </View>
            )}
            
            {isToday(selectedDate) && (
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={selectedMood === null || isSubmitting}
                loading={isSubmitting}
                style={styles.submitButton}
              >
                Save Today's Mood
              </Button>
            )}
          </Card.Content>
        </Card>
        
        {moodHistory.length > 0 && (
          <Card style={styles.historyCard}>
            <Card.Content>
              <Title style={styles.cardTitle}>Recent Mood History</Title>
              <Divider style={styles.divider} />
              
              {moodHistory.slice(-5).reverse().map((entry, index) => (
                <View key={index} style={styles.historyItem}>
                  <View style={styles.historyDate}>
                    <Text style={styles.dateText}>
                      {new Date(entry.timestamp).toLocaleDateString()}
                    </Text>
                    {entry.hasStressEvent && (
                      <Text style={styles.stressMarker}>⚠️ Stress Event</Text>
                    )}
                  </View>
                  <View style={styles.historyMood}>
                    <Text style={styles.moodEmoji}>{entry.moodEmoji}</Text>
                    <Text style={styles.moodText}>{entry.moodText}</Text>
                  </View>
                </View>
              ))}
              
              <Paragraph style={styles.historyNote}>
                Track your mood consistently to see patterns over time.
              </Paragraph>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  calendarCard: {
    marginBottom: 16,
    elevation: 2,
  },
  moodCard: {
    marginBottom: 16,
    elevation: 2,
  },
  historyCard: {
    marginBottom: 32,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  notesContainer: {
    marginTop: 24,
  },
  notesInput: {
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  divider: {
    marginBottom: 16,
  },
  historyItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  historyDate: {
    flex: 1,
  },
  dateText: {
    fontSize: 14,
  },
  historyMood: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  moodText: {
    fontSize: 14,
  },
  historyNote: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  stressEventCard: {
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: '#FFF8E1',
    elevation: 1,
  },
  stressEventContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stressEventLabel: {
    flex: 1,
    marginRight: 16,
  },
  stressEventText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FF5722',
    marginBottom: 4,
  },
  stressEventSubtext: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    lineHeight: 16,
  },
  stressMarker: {
    fontSize: 10,
    color: '#FF5722',
    fontWeight: '500',
    marginTop: 2,
  },
});

export default MoodTrackingScreen;
