import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = () => {
  const [latestHRV, setLatestHRV] = useState<number>(45.6);
  const [stressLevel, setStressLevel] = useState<'low' | 'moderate' | 'high'>('moderate');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [lastSleep] = useState<{ duration: number; quality: number }>({ duration: 8.5, quality: 4 });

  const moods = [
    { key: 'sad', emoji: '😢', label: 'Sad' },
    { key: 'meh', emoji: '😐', label: 'Meh' },
    { key: 'neutral', emoji: '🙂', label: 'Neutral' },
    { key: 'happy', emoji: '😄', label: 'Happy' },
    { key: 'excited', emoji: '🤩', label: 'Excited' },
  ];

  const getStressColor = () => {
    switch (stressLevel) {
      case 'low': return '#4caf50';
      case 'moderate': return '#ff9800';
      case 'high': return '#f44336';
      default: return '#ff9800';
    }
  };

  const saveMood = () => {
    if (!selectedMood) {
      Alert.alert('Please select a mood', 'Choose how you\'re feeling today');
      return;
    }
    Alert.alert('Mood Saved!', 'Your mood has been recorded successfully');
    setSelectedMood(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* HRV Status Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Today's HRV Status</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.hrvContainer}>
              <View style={styles.hrvInfo}>
                <Text style={styles.hrvLabel}>Your latest HRV</Text>
                <View style={styles.hrvValueContainer}>
                  <Text style={styles.hrvValue}>{latestHRV}</Text>
                  <Text style={styles.hrvUnit}>ms</Text>
                </View>
                <View style={styles.stressContainer}>
                  <Text style={styles.stressLabel}>Stress level</Text>
                  <View style={[styles.stressBadge, { backgroundColor: getStressColor() }]}>
                    <Text style={styles.stressText}>
                      {stressLevel.charAt(0).toUpperCase() + stressLevel.slice(1)}
                    </Text>
                  </View>
                </View>
                <View style={styles.recommendation}>
                  <Ionicons name="bulb-outline" size={16} color="#2e7d32" />
                  <Text style={styles.recommendationText}>
                    Consider taking a short break to reduce stress.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Mood Check-in Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Quick Mood Check-in</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <Text style={styles.moodQuestion}>How are you feeling today?</Text>
            <View style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.key}
                  style={[
                    styles.moodEmoji,
                    selectedMood === mood.key && styles.selectedMood
                  ]}
                  onPress={() => setSelectedMood(mood.key)}
                >
                  <Text style={styles.emoji}>{mood.emoji}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={saveMood}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.saveIcon} />
              <Text style={styles.saveButtonText}>Save Mood</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Sleep Summary Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#1a237e', '#3f51b5']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Last Night's Sleep</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.sleepSummary}>
              <View style={styles.sleepInfo}>
                <View style={styles.sleepDuration}>
                  <Text style={styles.sleepValue}>{lastSleep.duration}h</Text>
                  <Text style={styles.sleepLabel}>Duration</Text>
                </View>
                <View style={styles.sleepQuality}>
                  <View style={styles.qualityStars}>
                    {Array.from({ length: 5 }, (_, i) => (
                      <Ionicons
                        key={i}
                        name={i < lastSleep.quality ? "star" : "star-outline"}
                        size={20}
                        color={i < lastSleep.quality ? "#ffc107" : "#e0e0e0"}
                      />
                    ))}
                  </View>
                  <Text style={styles.sleepLabel}>Quality</Text>
                </View>
              </View>
              <View style={styles.sleepRecommendation}>
                <Ionicons name="bulb-outline" size={16} color="#1a237e" />
                <Text style={styles.sleepRecommendationText}>
                  Great sleep! Your HRV should be higher today.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Stats Card */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Today's Summary</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Ionicons name="pulse" size={24} color="#2e7d32" />
                <Text style={styles.statValue}>45.6</Text>
                <Text style={styles.statLabel}>Avg HRV</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="happy" size={24} color="#2e7d32" />
                <Text style={styles.statValue}>😊</Text>
                <Text style={styles.statLabel}>Last Mood</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="trending-up" size={24} color="#2e7d32" />
                <Text style={styles.statValue}>+5ms</Text>
                <Text style={styles.statLabel}>Week Trend</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="shield-checkmark" size={24} color="#2e7d32" />
                <Text style={styles.statValue}>78%</Text>
                <Text style={styles.statLabel}>Wellness</Text>
              </View>
            </View>
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
  hrvContainer: {
    alignItems: 'center',
  },
  hrvInfo: {
    alignItems: 'center',
    width: '100%',
  },
  hrvLabel: {
    fontSize: 14,
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
    marginBottom: 8,
  },
  hrvValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 20,
  },
  hrvValue: {
    fontSize: 42,
    fontWeight: '700',
    color: '#2e7d32',
  },
  hrvUnit: {
    fontSize: 18,
    color: '#757575',
    marginLeft: 4,
  },
  stressContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stressLabel: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  stressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  stressText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 14,
  },
  recommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(102, 187, 106, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
    marginTop: 16,
  },
  recommendationText: {
    marginLeft: 8,
    color: '#212121',
    fontSize: 14,
    flex: 1,
  },
  moodQuestion: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(102, 187, 106, 0.05)',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  moodEmoji: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  selectedMood: {
    backgroundColor: 'rgba(102, 187, 106, 0.2)',
    transform: [{ scale: 1.1 }],
  },
  emoji: {
    fontSize: 32,
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
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  sleepSummary: {
    alignItems: 'center',
  },
  sleepInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  sleepDuration: {
    alignItems: 'center',
  },
  sleepQuality: {
    alignItems: 'center',
  },
  sleepValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1a237e',
    marginBottom: 4,
  },
  sleepLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    fontWeight: '600',
  },
  qualityStars: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  sleepRecommendation: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(63, 81, 181, 0.1)',
    padding: 12,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#1a237e',
  },
  sleepRecommendationText: {
    marginLeft: 8,
    color: '#212121',
    fontSize: 14,
    flex: 1,
  },
});

export default HomeScreen;