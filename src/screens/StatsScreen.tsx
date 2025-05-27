import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const StatsScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week');

  const insights = [
    'Your HRV tends to be lower on days you report feeling sad or stressed.',
    'You\'ve maintained consistent mood tracking for 5 days - great job!',
    'Your average HRV is gradually improving over the past week.',
    'Mood entries show a positive trend this month.',
    'Your stress levels correlate with sleep quality patterns.',
  ];

  const correlationData = [
    { label: 'HRV & Mood', value: 0.72, description: 'Strong positive correlation' },
    { label: 'Sleep & HRV', value: 0.68, description: 'Moderate positive correlation' },
    { label: 'Exercise & Mood', value: 0.61, description: 'Moderate positive correlation' },
    { label: 'Stress & HRV', value: -0.58, description: 'Moderate negative correlation' },
  ];

  const getCorrelationColor = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 0.7) return '#4caf50';
    if (absValue >= 0.5) return '#ff9800';
    return '#f44336';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Combined Trends Chart */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>HRV & Mood Trends</Text>
            <View style={styles.periodSelector}>
              {(['week', 'month', 'year'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.activePeriod
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text style={[
                    styles.periodText,
                    selectedPeriod === period && styles.activePeriodText
                  ]}>
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.chartPlaceholder}>
              <Ionicons name="analytics" size={48} color="#2e7d32" />
              <Text style={styles.chartText}>Combined Analytics</Text>
              <Text style={styles.chartSubtext}>
                View HRV and mood patterns together with 6-month baseline
              </Text>
            </View>
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Key Metrics</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <Ionicons name="pulse" size={24} color="#2e7d32" />
                <Text style={styles.metricValue}>45.6ms</Text>
                <Text style={styles.metricLabel}>Avg HRV</Text>
                <View style={styles.metricTrend}>
                  <Ionicons name="trending-up" size={16} color="#4caf50" />
                  <Text style={styles.trendText}>+8%</Text>
                </View>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="happy" size={24} color="#2e7d32" />
                <Text style={styles.metricValue}>3.8</Text>
                <Text style={styles.metricLabel}>Avg Mood</Text>
                <View style={styles.metricTrend}>
                  <Ionicons name="trending-up" size={16} color="#4caf50" />
                  <Text style={styles.trendText}>+12%</Text>
                </View>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="shield-checkmark" size={24} color="#2e7d32" />
                <Text style={styles.metricValue}>78%</Text>
                <Text style={styles.metricLabel}>Stress Control</Text>
                <View style={styles.metricTrend}>
                  <Ionicons name="trending-up" size={16} color="#4caf50" />
                  <Text style={styles.trendText}>+5%</Text>
                </View>
              </View>
              <View style={styles.metricItem}>
                <Ionicons name="calendar" size={24} color="#2e7d32" />
                <Text style={styles.metricValue}>15</Text>
                <Text style={styles.metricLabel}>Streak Days</Text>
                <View style={styles.metricTrend}>
                  <Ionicons name="trophy" size={16} color="#ff9800" />
                  <Text style={styles.trendText}>New!</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Correlations */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Data Correlations</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {correlationData.map((item, index) => (
              <View key={index} style={styles.correlationItem}>
                <View style={styles.correlationHeader}>
                  <Text style={styles.correlationLabel}>{item.label}</Text>
                  <Text style={[
                    styles.correlationValue,
                    { color: getCorrelationColor(item.value) }
                  ]}>
                    {item.value > 0 ? '+' : ''}{item.value.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.correlationDescription}>{item.description}</Text>
                <View style={styles.correlationBar}>
                  <View 
                    style={[
                      styles.correlationFill,
                      { 
                        width: `${Math.abs(item.value) * 100}%`,
                        backgroundColor: getCorrelationColor(item.value)
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Insights */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Personal Insights</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {insights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Ionicons name="bulb" size={16} color="#2e7d32" />
                <Text style={styles.insightText}>{insight}</Text>
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
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  activePeriod: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  periodText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '600',
  },
  activePeriodText: {
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 8,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: '#4caf50',
    marginLeft: 4,
    fontWeight: '600',
  },
  correlationItem: {
    marginBottom: 20,
  },
  correlationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  correlationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  correlationValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  correlationDescription: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
  },
  correlationBar: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  correlationFill: {
    height: '100%',
    borderRadius: 3,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  insightText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
});

export default StatsScreen;