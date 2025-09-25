import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  Dimensions,
  Alert
} from 'react-native';
import { Card, Button, ActivityIndicator, Chip } from 'react-native-paper';
import { VictoryChart, VictoryLine, VictoryArea, VictoryAxis, VictoryTheme, VictoryScatter, VictoryBar } from 'victory-native';
import { theme } from '../utils/theme';
import { getHRVData, calculateHRVTrends, getSleepData, calculateSleepTrends } from '../services/healthKit';
import { getMoodData } from '../services/moodStorage';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 60;

const StatsScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [hrvData, setHrvData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [sleepData, setSleepData] = useState([]);
  const [hrvTrends, setHrvTrends] = useState({ trend: 'neutral', change: 0 });
  const [sleepTrends, setSleepTrends] = useState({ trend: 'neutral', change: 0 });
  const [correlationData, setCorrelationData] = useState([]);

  const loadData = async () => {
    try {
      console.log('Loading stats data...');
      
      // Fetch data from all sources
      const [hrvResults, moodResults, sleepResults, hrvTrendResults, sleepTrendResults] = await Promise.all([
        getHRVData(14),
        getMoodData(14),
        getSleepData(14),
        calculateHRVTrends(14),
        calculateSleepTrends(14)
      ]);

      setHrvData(hrvResults || []);
      setMoodData(moodResults || []);
      setSleepData(sleepResults || []);
      setHrvTrends(hrvTrendResults);
      setSleepTrends(sleepTrendResults);

      // Calculate HRV vs Mood correlation
      const correlation = calculateHRVMoodCorrelation(hrvResults, moodResults);
      setCorrelationData(correlation);

      console.log('Stats data loaded successfully');
    } catch (error) {
      console.error('Error loading stats data:', error);
      Alert.alert('Error', 'Failed to load statistics data. Please try again.');
    }
  };

  const calculateHRVMoodCorrelation = (hrvData, moodData) => {
    if (!hrvData || !moodData || hrvData.length === 0 || moodData.length === 0) {
      return [];
    }

    const correlationMap = new Map();
    
    // Match HRV and mood data by date
    hrvData.forEach(hrv => {
      const matchingMood = moodData.find(mood => 
        new Date(mood.timestamp).toISOString().split('T')[0] === hrv.date
      );
      
      if (matchingMood) {
        correlationMap.set(hrv.date, {
          date: hrv.date,
          hrv: hrv.value,
          mood: matchingMood.mood,
          x: hrv.value,
          y: matchingMood.mood
        });
      }
    });

    return Array.from(correlationMap.values())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await loadData();
      setLoading(false);
    };

    initializeData();
  }, []);

  const formatChartData = (data, valueKey = 'value') => {
    return data.slice(-7).map((item, index) => ({
      x: index + 1,
      y: item[valueKey] || 0,
      label: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  };

  const getTrendColor = (trend) => {
    switch (trend) {
      case 'improving': return '#4CAF50';
      case 'declining': return '#F44336';
      default: return '#FF9800';
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'improving': return '📈';
      case 'declining': return '📉';
      default: return '➡️';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading your health statistics...</Text>
      </View>
    );
  }

  const hrvChartData = formatChartData(hrvData);
  const moodChartData = formatChartData(moodData, 'mood');
  const sleepChartData = formatChartData(sleepData, 'duration_hours');

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Text style={styles.title}>Health Statistics</Text>
      
      {/* HRV Trends */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Heart Rate Variability (HRV)</Text>
            <Chip 
              mode="outlined" 
              textStyle={{ color: getTrendColor(hrvTrends.trend) }}
              style={{ borderColor: getTrendColor(hrvTrends.trend) }}
            >
              {getTrendIcon(hrvTrends.trend)} {hrvTrends.trend}
            </Chip>
          </View>
          
          {hrvChartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
              >
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryLine
                  data={hrvChartData}
                  style={{
                    data: { stroke: theme.colors.primary, strokeWidth: 3 }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
                <VictoryScatter
                  data={hrvChartData}
                  size={4}
                  style={{
                    data: { fill: theme.colors.primary }
                  }}
                />
              </VictoryChart>
              <Text style={styles.chartCaption}>Last 7 days (ms)</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No HRV data available. Connect to Apple Health to see your trends.</Text>
          )}
          
          {hrvTrends.change !== 0 && (
            <Text style={styles.trendText}>
              {hrvTrends.change > 0 ? '↗️' : '↘️'} {Math.abs(hrvTrends.change)}% vs last period
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* Mood Patterns */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Mood Patterns</Text>
          
          {moodChartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
                domain={{ y: [0, 6] }}
              >
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryArea
                  data={moodChartData}
                  style={{
                    data: { 
                      fill: theme.colors.secondary, 
                      fillOpacity: 0.3,
                      stroke: theme.colors.secondary,
                      strokeWidth: 2
                    }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
                <VictoryScatter
                  data={moodChartData}
                  size={4}
                  style={{
                    data: { fill: theme.colors.secondary }
                  }}
                />
              </VictoryChart>
              <Text style={styles.chartCaption}>Last 7 days (1=Very Sad, 5=Very Happy)</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No mood data available. Start tracking your mood to see patterns.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Sleep Quality */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sleep Duration</Text>
            <Chip 
              mode="outlined"
              textStyle={{ color: getTrendColor(sleepTrends.trend) }}
              style={{ borderColor: getTrendColor(sleepTrends.trend) }}
            >
              {getTrendIcon(sleepTrends.trend)} {sleepTrends.trend}
            </Chip>
          </View>
          
          {sleepChartData.length > 0 ? (
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
              >
                <VictoryAxis dependentAxis />
                <VictoryAxis />
                <VictoryBar
                  data={sleepChartData}
                  style={{
                    data: { 
                      fill: ({ datum }) => datum.y >= 7 ? '#4CAF50' : datum.y >= 6 ? '#FF9800' : '#F44336'
                    }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
              <Text style={styles.chartCaption}>Last 7 days (hours)</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No sleep data available. Connect to Apple Health to track sleep.</Text>
          )}
          
          {sleepTrends.averageDuration > 0 && (
            <Text style={styles.trendText}>
              🛏️ Average: {sleepTrends.averageDuration}h per night
            </Text>
          )}
        </Card.Content>
      </Card>

      {/* HRV vs Mood Correlation */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>HRV vs Mood Correlation</Text>
          
          {correlationData.length > 0 ? (
            <View style={styles.chartContainer}>
              <VictoryChart
                theme={VictoryTheme.material}
                width={chartWidth}
                height={200}
                padding={{ left: 50, top: 20, right: 50, bottom: 50 }}
                domain={{ y: [0, 6] }}
              >
                <VictoryAxis dependentAxis label="Mood (1-5)" style={{ axisLabel: { angle: -90, textAnchor: 'middle' } }} />
                <VictoryAxis label="HRV (ms)" />
                <VictoryScatter
                  data={correlationData}
                  size={5}
                  style={{
                    data: { 
                      fill: ({ datum }) => {
                        // Color code by mood: red (low) to green (high)
                        const intensity = (datum.y - 1) / 4; // Normalize to 0-1
                        const red = Math.round(255 * (1 - intensity));
                        const green = Math.round(255 * intensity);
                        return `rgb(${red}, ${green}, 0)`;
                      }
                    }
                  }}
                  animate={{
                    duration: 1000,
                    onLoad: { duration: 500 }
                  }}
                />
              </VictoryChart>
              <Text style={styles.chartCaption}>Each point represents a day with both HRV and mood data</Text>
            </View>
          ) : (
            <Text style={styles.noDataText}>No correlation data available. Need both HRV and mood data for same dates.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Key Insights */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>📊 Key Insights</Text>
          
          <View style={styles.insightContainer}>
            {hrvData.length > 0 && (
              <Text style={styles.insightText}>
                • You have {hrvData.length} days of HRV data
              </Text>
            )}
            
            {moodData.length > 0 && (
              <Text style={styles.insightText}>
                • You have {moodData.length} mood entries
              </Text>
            )}
            
            {sleepData.length > 0 && (
              <Text style={styles.insightText}>
                • You have {sleepData.length} nights of sleep data
              </Text>
            )}
            
            {correlationData.length > 0 && (
              <Text style={styles.insightText}>
                • {correlationData.length} days have both HRV and mood data for correlation analysis
              </Text>
            )}
            
            {hrvData.length === 0 && moodData.length === 0 && sleepData.length === 0 && (
              <Text style={styles.insightText}>
                • Start tracking your mood and connect Apple Health to build your health profile
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: theme.colors.text,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text,
    margin: 20,
    textAlign: 'center',
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 20,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chartCaption: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
  noDataText: {
    fontSize: 14,
    color: theme.colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  trendText: {
    fontSize: 14,
    color: theme.colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  insightContainer: {
    marginTop: 10,
  },
  insightText: {
    fontSize: 14,
    color: theme.colors.text,
    marginBottom: 8,
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default StatsScreen;