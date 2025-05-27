import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MoodScreen = () => {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');

  const moods = [
    { key: 'sad', emoji: '😢', label: 'Sad', value: 1 },
    { key: 'meh', emoji: '😐', label: 'Meh', value: 2 },
    { key: 'neutral', emoji: '🙂', label: 'Neutral', value: 3 },
    { key: 'happy', emoji: '😄', label: 'Happy', value: 4 },
    { key: 'excited', emoji: '🤩', label: 'Excited', value: 5 },
  ];

  const moodHistory = [
    { date: '2025-05-27', mood: 'happy', notes: 'Great day at work!' },
    { date: '2025-05-26', mood: 'neutral', notes: 'Feeling okay, nothing special.' },
    { date: '2025-05-25', mood: 'sad', notes: 'Stressed about project deadline.' },
    { date: '2025-05-24', mood: 'happy', notes: 'Weekend with friends.' },
    { date: '2025-05-23', mood: 'excited', notes: 'Started a new book!' },
  ];

  const saveMood = () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood', 'Choose how you\'re feeling today');
      return;
    }
    Alert.alert('Mood Saved!', 'Your mood has been recorded successfully');
    setSelectedMood(null);
    setNotes('');
  };

  const getMoodEmoji = (moodKey: string) => {
    const mood = moods.find(m => m.key === moodKey);
    return mood ? mood.emoji : '🙂';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Mood Tracker Chart */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Mood Tracker</Text>
            <View style={styles.viewModeSelector}>
              {(['weekly', 'monthly', 'yearly'] as const).map((mode) => (
                <TouchableOpacity
                  key={mode}
                  style={[
                    styles.viewModeButton,
                    viewMode === mode && styles.activeViewMode
                  ]}
                  onPress={() => setViewMode(mode)}
                >
                  <Text style={[
                    styles.viewModeText,
                    viewMode === mode && styles.activeViewModeText
                  ]}>
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="bar-chart" size={48} color="#2e7d32" />
              <Text style={styles.chartText}>Mood Chart ({viewMode})</Text>
              <Text style={styles.chartSubtext}>
                Track your mood patterns over time with 6-month average
              </Text>
            </View>
          </View>
        </View>

        {/* New Mood Entry */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>How are you feeling today?</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.key}
                  style={[
                    styles.moodOption,
                    selectedMood === mood.key && styles.selectedMood
                  ]}
                  onPress={() => setSelectedMood(mood.key)}
                >
                  <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                  <Text style={styles.moodLabel}>{mood.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TextInput
              style={styles.notesInput}
              placeholder="Add notes about your mood (optional)"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
            
            <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Mood</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mood History */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Your Mood History</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {moodHistory.map((entry, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyDate}>{formatDate(entry.date)}</Text>
                  <Text style={styles.historyEmoji}>{getMoodEmoji(entry.mood)}</Text>
                </View>
                <Text style={styles.historyNotes}>{entry.notes}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    padding: 20,
  },
  viewModeSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 2,
  },
  viewModeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activeViewMode: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  viewModeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  activeViewModeText: {
    color: '#ffffff',
  },
  chartPlaceholder: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
  },
  chartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
    marginTop: 12,
  },
  chartSubtext: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  moodOption: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    minWidth: 60,
  },
  selectedMood: {
    backgroundColor: 'rgba(102, 187, 106, 0.2)',
    borderWidth: 2,
    borderColor: '#2e7d32',
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#f8f9fa',
    fontSize: 16,
    marginBottom: 20,
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    alignSelf: 'flex-end',
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  historyEmoji: {
    fontSize: 24,
  },
  historyNotes: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 20,
  },
});

export default MoodScreen;