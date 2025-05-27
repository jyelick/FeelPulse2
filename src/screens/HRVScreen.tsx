import React, { useState } from 'react';
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

const HRVScreen = () => {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [hasHealthKitAccess, setHasHealthKitAccess] = useState(false);

  const hrvInsights = [
    'Your average HRV has increased by 5ms over the past week.',
    'Higher HRV indicates better recovery and lower stress levels.',
    'Try regular deep breathing exercises to improve your HRV.',
    'Consider meditation for 10 minutes daily to boost HRV.',
    'Your HRV is within the healthy range for your age group.',
  ];

  const requestHealthKitAccess = () => {
    Alert.alert(
      'Health Data Access',
      'FeelPulse needs access to your Health app to read HRV data. This helps provide personalized insights.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Allow Access', onPress: () => setHasHealthKitAccess(true) }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* HRV Access Card */}
        {!hasHealthKitAccess && (
          <View style={styles.card}>
            <LinearGradient
              colors={['#2e7d32', '#66bb6a']}
              style={styles.cardHeader}
            >
              <Text style={styles.cardTitle}>Connect to Apple Health</Text>
            </LinearGradient>
            <View style={styles.cardBody}>
              <View style={styles.accessPrompt}>
                <Ionicons name="heart" size={48} color="#2e7d32" />
                <Text style={styles.accessTitle}>Enable Health Data</Text>
                <Text style={styles.accessDescription}>
                  Connect to Apple Health to automatically track your HRV data and get personalized insights.
                </Text>
                <TouchableOpacity style={styles.connectButton} onPress={requestHealthKitAccess}>
                  <Ionicons name="link" size={20} color="#fff" style={styles.connectIcon} />
                  <Text style={styles.connectButtonText}>Connect to Health</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* HRV Tracker Chart */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>HRV Tracker</Text>
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
              <Ionicons name="pulse" size={48} color="#2e7d32" />
              <Text style={styles.chartText}>HRV Chart ({viewMode})</Text>
              <Text style={styles.chartSubtext}>
                Heart rate variability trends with 6-month average
              </Text>
            </View>
          </View>
        </View>

        {/* Current HRV Status */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Current Status</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.statusGrid}>
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>45.6</Text>
                <Text style={styles.statusLabel}>Latest HRV (ms)</Text>
                <View style={styles.statusIndicator}>
                  <Ionicons name="checkmark-circle" size={16} color="#4caf50" />
                  <Text style={styles.statusText}>Normal</Text>
                </View>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>48.2</Text>
                <Text style={styles.statusLabel}>7-Day Average</Text>
                <View style={styles.statusIndicator}>
                  <Ionicons name="trending-up" size={16} color="#2e7d32" />
                  <Text style={styles.statusText}>Improving</Text>
                </View>
              </View>
              <View style={styles.statusItem}>
                <Text style={styles.statusValue}>46.8</Text>
                <Text style={styles.statusLabel}>6-Month Average</Text>
                <View style={styles.statusIndicator}>
                  <Ionicons name="analytics" size={16} color="#757575" />
                  <Text style={styles.statusText}>Baseline</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* HRV Insights */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>HRV Insights</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            {hrvInsights.map((insight, index) => (
              <View key={index} style={styles.insightItem}>
                <Ionicons name="bulb" size={16} color="#2e7d32" />
                <Text style={styles.insightText}>{insight}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Tips for Better HRV */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Tips for Better HRV</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.tipItem}>
              <Ionicons name="leaf" size={24} color="#4caf50" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Deep Breathing</Text>
                <Text style={styles.tipDescription}>Practice 4-7-8 breathing for 5 minutes daily</Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="fitness" size={24} color="#2196f3" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Regular Exercise</Text>
                <Text style={styles.tipDescription}>Moderate cardio improves HRV over time</Text>
              </View>
            </View>
            <View style={styles.tipItem}>
              <Ionicons name="moon" size={24} color="#9c27b0" />
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Quality Sleep</Text>
                <Text style={styles.tipDescription}>7-9 hours of consistent sleep boosts recovery</Text>
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
  accessPrompt: {
    alignItems: 'center',
    padding: 20,
  },
  accessTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  accessDescription: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  connectButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  connectIcon: {
    marginRight: 8,
  },
  connectButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
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
  statusGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statusItem: {
    alignItems: 'center',
    flex: 1,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statusLabel: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    color: '#212121',
    marginLeft: 4,
    fontWeight: '600',
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
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 18,
  },
});

export default HRVScreen;