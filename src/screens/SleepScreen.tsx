import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface SleepEntry {
  id: string;
  date: string;
  bedtime: string;
  wakeTime: string;
  duration: number;
  quality: number;
  notes?: string;
}

const SleepScreen = () => {
  const [bedtime, setBedtime] = useState<string>('22:30');
  const [wakeTime, setWakeTime] = useState<string>('07:00');
  const [quality, setQuality] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');
  const [recentSleep] = useState<SleepEntry[]>([
    {
      id: '1',
      date: 'Today',
      bedtime: '22:45',
      wakeTime: '07:15',
      duration: 8.5,
      quality: 4,
      notes: 'Felt refreshed'
    },
    {
      id: '2',
      date: 'Yesterday',
      bedtime: '23:30',
      wakeTime: '07:00',
      duration: 7.5,
      quality: 3,
      notes: 'Had trouble falling asleep'
    },
    {
      id: '3',
      date: '2 days ago',
      bedtime: '22:15',
      wakeTime: '06:45',
      duration: 8.5,
      quality: 5,
      notes: 'Perfect night'
    }
  ]);

  const qualityLabels = [
    { value: 1, emoji: '😴', label: 'Poor' },
    { value: 2, emoji: '😪', label: 'Fair' },
    { value: 3, emoji: '🙂', label: 'Good' },
    { value: 4, emoji: '😊', label: 'Great' },
    { value: 5, emoji: '😍', label: 'Excellent' },
  ];

  const calculateDuration = (bedtime: string, wakeTime: string): number => {
    const [bedHour, bedMin] = bedtime.split(':').map(Number);
    const [wakeHour, wakeMin] = wakeTime.split(':').map(Number);
    
    let bedTimeMinutes = bedHour * 60 + bedMin;
    let wakeTimeMinutes = wakeHour * 60 + wakeMin;
    
    // Handle next day wake time
    if (wakeTimeMinutes < bedTimeMinutes) {
      wakeTimeMinutes += 24 * 60;
    }
    
    return (wakeTimeMinutes - bedTimeMinutes) / 60;
  };

  const saveSleepEntry = () => {
    if (!bedtime || !wakeTime || quality === 0) {
      Alert.alert('Missing Information', 'Please fill in bedtime, wake time, and quality rating');
      return;
    }

    const duration = calculateDuration(bedtime, wakeTime);
    
    Alert.alert(
      'Sleep Entry Saved!',
      `Duration: ${duration.toFixed(1)} hours\nQuality: ${qualityLabels.find(q => q.value === quality)?.label}`,
      [{ text: 'OK', onPress: () => {
        setBedtime('22:30');
        setWakeTime('07:00');
        setQuality(0);
        setNotes('');
      }}]
    );
  };

  const getQualityColor = (qualityValue: number): string => {
    switch (qualityValue) {
      case 1: return '#f44336';
      case 2: return '#ff9800';
      case 3: return '#ffc107';
      case 4: return '#4caf50';
      case 5: return '#2e7d32';
      default: return '#757575';
    }
  };

  const averageQuality = recentSleep.reduce((sum, entry) => sum + entry.quality, 0) / recentSleep.length;
  const averageDuration = recentSleep.reduce((sum, entry) => sum + entry.duration, 0) / recentSleep.length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Sleep Summary Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#1a237e', '#3f51b5']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Sleep Overview</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Ionicons name="bed-outline" size={24} color="#1a237e" />
                <Text style={styles.summaryValue}>{averageDuration.toFixed(1)}h</Text>
                <Text style={styles.summaryLabel}>Avg Duration</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="star" size={24} color="#1a237e" />
                <Text style={styles.summaryValue}>{averageQuality.toFixed(1)}/5</Text>
                <Text style={styles.summaryLabel}>Avg Quality</Text>
              </View>
              <View style={styles.summaryItem}>
                <Ionicons name="trending-up" size={24} color="#1a237e" />
                <Text style={styles.summaryValue}>+15m</Text>
                <Text style={styles.summaryLabel}>Week Trend</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Log Sleep Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#1a237e', '#3f51b5']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Log Tonight's Sleep</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {/* Time Inputs */}
            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Bedtime</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Ionicons name="time-outline" size={20} color="#1a237e" />
                  <TextInput
                    style={styles.timeText}
                    value={bedtime}
                    onChangeText={setBedtime}
                    placeholder="22:30"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.timeLabel}>Wake Time</Text>
                <TouchableOpacity style={styles.timeButton}>
                  <Ionicons name="sunny-outline" size={20} color="#1a237e" />
                  <TextInput
                    style={styles.timeText}
                    value={wakeTime}
                    onChangeText={setWakeTime}
                    placeholder="07:00"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Duration Display */}
            <View style={styles.durationContainer}>
              <Text style={styles.durationLabel}>Estimated Duration</Text>
              <Text style={styles.durationValue}>
                {calculateDuration(bedtime, wakeTime).toFixed(1)} hours
              </Text>
            </View>

            {/* Quality Rating */}
            <Text style={styles.qualityQuestion}>How was your sleep quality?</Text>
            <View style={styles.qualitySelector}>
              {qualityLabels.map((item) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.qualityOption,
                    quality === item.value && styles.selectedQuality
                  ]}
                  onPress={() => setQuality(item.value)}
                >
                  <Text style={styles.qualityEmoji}>{item.emoji}</Text>
                  <Text style={styles.qualityLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Notes */}
            <Text style={styles.notesLabel}>Sleep Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              value={notes}
              onChangeText={setNotes}
              placeholder="How did you feel? Any disruptions?"
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity style={styles.saveButton} onPress={saveSleepEntry}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Sleep Entry</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Sleep History */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#1a237e', '#3f51b5']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Recent Sleep History</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {recentSleep.map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <View style={styles.historyDate}>
                  <Text style={styles.historyDateText}>{entry.date}</Text>
                  <Text style={styles.historyDuration}>{entry.duration}h</Text>
                </View>
                <View style={styles.historyDetails}>
                  <View style={styles.historyTimes}>
                    <Text style={styles.historyTime}>
                      <Ionicons name="bed-outline" size={14} color="#757575" /> {entry.bedtime}
                    </Text>
                    <Text style={styles.historyTime}>
                      <Ionicons name="sunny-outline" size={14} color="#757575" /> {entry.wakeTime}
                    </Text>
                  </View>
                  <View style={styles.historyQuality}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < entry.quality ? "star" : "star-outline"}
                        size={16}
                        color={i < entry.quality ? getQualityColor(entry.quality) : "#e0e0e0"}
                      />
                    ))}
                  </View>
                </View>
                {entry.notes && (
                  <Text style={styles.historyNotes}>{entry.notes}</Text>
                )}
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
  },
  cardTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  cardBody: {
    padding: 20,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 35, 126, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  timeText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  durationContainer: {
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  durationLabel: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 4,
  },
  durationValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a237e',
  },
  qualityQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 16,
  },
  qualitySelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  qualityOption: {
    alignItems: 'center',
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  selectedQuality: {
    backgroundColor: 'rgba(26, 35, 126, 0.2)',
    transform: [{ scale: 1.1 }],
  },
  qualityEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  qualityLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  notesInput: {
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 16,
    color: '#212121',
    textAlignVertical: 'top',
    marginBottom: 20,
    minHeight: 80,
  },
  saveButton: {
    backgroundColor: '#1a237e',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
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
    backgroundColor: 'rgba(26, 35, 126, 0.05)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1a237e',
  },
  historyDate: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  historyDuration: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a237e',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTimes: {
    flexDirection: 'row',
    gap: 16,
  },
  historyTime: {
    fontSize: 14,
    color: '#757575',
  },
  historyQuality: {
    flexDirection: 'row',
    gap: 2,
  },
  historyNotes: {
    fontSize: 14,
    color: '#757575',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default SleepScreen;