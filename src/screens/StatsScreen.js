import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Card, Title, Paragraph, Button, SegmentedButtons } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../utils/theme';
import HRVGraph from '../components/HRVGraph';
import CombinedTrendsGraph from '../components/CombinedTrendsGraph';
import { getHRVData } from '../services/healthKit';
import { getMoodData } from '../services/moodStorage';

const StatsScreen = () => {
  const [hrvData, setHrvData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('week');
  const [viewType, setViewType] = useState('combined');

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      const hrv = await getHRVData(days);
      setHrvData(hrv);
      
      const mood = await getMoodData(days);
      setMoodData(mood);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAverageHRV = () => {
    if (hrvData.length === 0) return '-';
    const sum = hrvData.reduce((total, entry) => total + entry.value, 0);
    return (sum / hrvData.length).toFixed(1);
  };

  const getAverageMood = () => {
    if (moodData.length === 0) return '-';
    const sum = moodData.reduce((total, entry) => total + entry.mood, 0);
    return (sum / moodData.length).toFixed(1);
  };

  const getMostFrequentMood = () => {
    if (moodData.length === 0) return '-';
    
    // Count occurrences of each mood
    const moodCounts = {};
    moodData.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });
    
    // Find the mood with the highest count
    let maxCount = 0;
    let mostFrequentMood = '';
    
    for (const mood in moodCounts) {
      if (moodCounts[mood] > maxCount) {
        maxCount = moodCounts[mood];
        mostFrequentMood = mood;
      }
    }
    
    // Return the emoji representing the most frequent mood
    switch (parseInt(mostFrequentMood)) {
      case 1: return '😢 Very Sad';
      case 2: return '😕 Sad';
      case 3: return '😐 Neutral';
      case 4: return '😊 Happy';
      case 5: return '😃 Very Happy';
      default: return '-';
    }
  };

  const getTimePeriodText = () => {
    switch (timeRange) {
      case 'week': return 'Past Week';
      case 'month': return 'Past Month';
      case 'quarter': return 'Past 3 Months';
      default: return 'Selected Period';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Health Insights</Title>
        
        <Card style={styles.timeRangeCard}>
          <Card.Content>
            <SegmentedButtons
              value={timeRange}
              onValueChange={setTimeRange}
              buttons={[
                { value: 'week', label: 'Week' },
                { value: 'month', label: 'Month' },
                { value: 'quarter', label: '3 Months' },
              ]}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Summary: {getTimePeriodText()}</Title>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average HRV</Text>
                <Text style={styles.summaryValue}>{getAverageHRV()} ms</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Average Mood</Text>
                <Text style={styles.summaryValue}>{getAverageMood()} / 5</Text>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Data Points</Text>
                <Text style={styles.summaryValue}>HRV: {hrvData.length} | Mood: {moodData.length}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>Most Frequent Mood</Text>
                <Text style={styles.summaryValue}>{getMostFrequentMood()}</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.viewToggleCard}>
          <Card.Content>
            <SegmentedButtons
              value={viewType}
              onValueChange={setViewType}
              buttons={[
                { value: 'combined', label: 'Combined View' },
                { value: 'hrv', label: 'HRV Only' },
                { value: 'mood', label: 'Mood Only' },
              ]}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.graphCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>
              {viewType === 'combined' ? 'HRV & Mood Trends' : 
               viewType === 'hrv' ? 'HRV Trends' : 'Mood Trends'}
            </Title>
            <View style={styles.graphContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text>Loading data...</Text>
                </View>
              ) : (
                viewType === 'combined' ? (
                  <CombinedTrendsGraph 
                    hrvData={hrvData} 
                    moodData={moodData} 
                  />
                ) : viewType === 'hrv' ? (
                  <HRVGraph 
                    data={hrvData} 
                    height={280} 
                  />
                ) : (
                  <CombinedTrendsGraph 
                    moodData={moodData} 
                    showHRV={false} 
                    height={280} 
                  />
                )
              )}
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.insightCard}>
          <Card.Content>
            <Title style={styles.cardTitle}>Key Insights</Title>
            {hrvData.length > 0 && moodData.length > 0 ? (
              <>
                <Paragraph style={styles.insight}>
                  Your HRV shows {hrv_insight_text(hrvData)} over this period.
                </Paragraph>
                <Paragraph style={styles.insight}>
                  Your mood has been predominantly {getMostFrequentMood().split(' ')[1]} during this time.
                </Paragraph>
                <Paragraph style={styles.insight}>
                  {correlation_insight_text(hrvData, moodData)}
                </Paragraph>
              </>
            ) : (
              <Paragraph style={styles.noDataText}>
                Not enough data collected yet. Continue tracking your HRV and mood to see insights.
              </Paragraph>
            )}
          </Card.Content>
        </Card>
        
        <Button
          mode="outlined"
          onPress={() => loadData()}
          style={styles.refreshButton}
        >
          Refresh Data
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

// Helper functions for insights
const hrv_insight_text = (hrvData) => {
  if (hrvData.length < 3) return "insufficient data to determine a trend";
  
  // Compare first and last few days to detect trend
  const firstThree = hrvData.slice(0, 3).reduce((sum, d) => sum + d.value, 0) / 3;
  const lastThree = hrvData.slice(-3).reduce((sum, d) => sum + d.value, 0) / 3;
  
  const difference = ((lastThree - firstThree) / firstThree) * 100;
  
  if (difference > 10) return "an improving trend";
  if (difference < -10) return "a declining trend";
  return "a stable pattern";
};

const correlation_insight_text = (hrvData, moodData) => {
  if (hrvData.length < 5 || moodData.length < 5) return "More data is needed to analyze correlations between HRV and mood.";
  
  // This would normally be more sophisticated, but here's a simple implementation
  return "Keep tracking to see deeper connections between your HRV and mood patterns.";
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
  timeRangeCard: {
    marginBottom: 16,
    elevation: 2,
  },
  summaryCard: {
    marginBottom: 16,
    elevation: 2,
  },
  viewToggleCard: {
    marginBottom: 16,
    elevation: 2,
  },
  graphCard: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  insightCard: {
    marginBottom: 16,
    backgroundColor: theme.colors.secondaryContainer,
    elevation: 2,
    borderRadius: 24,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  cardTitle: {
    fontSize: 18,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '500',
  },
  graphContainer: {
    height: 300,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 280,
  },
  insight: {
    marginBottom: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  noDataText: {
    fontStyle: 'italic',
    textAlign: 'center',
    color: theme.colors.onSurfaceVariant,
  },
  refreshButton: {
    marginBottom: 32,
  },
});

export default StatsScreen;
