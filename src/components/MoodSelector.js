import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { theme } from '../utils/theme';

const MoodSelector = ({ selectedMood, onSelectMood }) => {
  const moods = [
    { value: 1, emoji: '😢', label: 'Very Sad' },
    { value: 2, emoji: '😕', label: 'Sad' },
    { value: 3, emoji: '😐', label: 'Neutral' },
    { value: 4, emoji: '😊', label: 'Happy' },
    { value: 5, emoji: '😃', label: 'Very Happy' }
  ];

  const getMoodColor = (mood) => {
    switch(mood) {
      case 1: return '#E53935'; // very sad - red
      case 2: return '#FB8C00'; // sad - orange
      case 3: return '#FFD600'; // neutral - yellow
      case 4: return '#7CB342'; // happy - light green
      case 5: return '#00897B'; // very happy - teal
      default: return theme.colors.surface;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.moodRow}>
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.moodItem,
              selectedMood === mood.value && {
                backgroundColor: getMoodColor(mood.value) + '33', // Add transparency
                borderColor: getMoodColor(mood.value),
              }
            ]}
            onPress={() => onSelectMood(mood.value)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={[
              styles.label,
              selectedMood === mood.value && {
                color: getMoodColor(mood.value),
                fontWeight: 'bold'
              }
            ]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.scaleContainer}>
        <View style={styles.scaleLabels}>
          <Text style={styles.scaleLabel}>Lower Mood</Text>
          <Text style={styles.scaleLabel}>Higher Mood</Text>
        </View>
        <View style={styles.scale}>
          <View style={[styles.scaleSegment, { backgroundColor: '#E53935' }]} />
          <View style={[styles.scaleSegment, { backgroundColor: '#FB8C00' }]} />
          <View style={[styles.scaleSegment, { backgroundColor: '#FFD600' }]} />
          <View style={[styles.scaleSegment, { backgroundColor: '#7CB342' }]} />
          <View style={[styles.scaleSegment, { backgroundColor: '#00897B' }]} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 16,
  },
  moodItem: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.outline,
    width: '18%', // Evenly space 5 items with a little gap
  },
  emoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  scaleContainer: {
    width: '100%',
    marginTop: 8,
  },
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  scaleLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
  },
  scale: {
    flexDirection: 'row',
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  scaleSegment: {
    flex: 1,
  },
});

export default MoodSelector;
