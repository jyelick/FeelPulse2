import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Button, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getHRVData } from '../services/healthKit';
import HRVGraph from '../components/HRVGraph';
import StressDetectionAlert from '../components/StressDetectionAlert';
import { detectStressFromHRV } from '../services/stressDetection';
import { theme } from '../utils/theme';
import { getMoodData } from '../services/moodStorage';

const HomeScreen = () => {
  const [hrvData, setHrvData] = useState([]);
  const [moodData, setMoodData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isStressed, setIsStressed] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      // Get HRV data
      const hrv = await getHRVData();
      setHrvData(hrv);
      
      // Get mood data
      const mood = await getMoodData();
      setMoodData(mood);
      
      // Detect stress from HRV data
      const stressDetected = detectStressFromHRV(hrv);
      setIsStressed(stressDetected);
      
      // Set a default name if none is available
      setUserName('User');
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadInitialData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
          <Text style={styles.subtitle}>Here's your health overview</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Loading your health data...</Text>
          </View>
        ) : (
          <>
            {isStressed && <StressDetectionAlert />}

            <Card style={styles.card}>
              <Card.Content>
                <Title>Your HRV Trend (Last 5 Days)</Title>
                <View style={styles.graphContainer}>
                  {hrvData.length > 0 ? (
                    <HRVGraph data={hrvData} />
                  ) : (
                    <View style={styles.noDataContainer}>
                      <Text style={styles.noDataText}>No HRV data available</Text>
                      <Text style={styles.noDataDescription}>
                        Connect to Apple Health to see your HRV measurements
                      </Text>
                      <Button 
                        mode="contained" 
                        style={styles.connectButton}
                        onPress={loadInitialData}
                      >
                        Connect to Health
                      </Button>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>

            <Card style={styles.card}>
              <Card.Content>
                <Title>Today's Health Tasks</Title>
                <View style={styles.taskItem}>
                  <Text style={styles.taskText}>Record your mood</Text>
                  <Button 
                    mode="outlined" 
                    onPress={() => {/* Navigate to mood screen */}}
                    style={styles.taskButton}
                  >
                    Do Now
                  </Button>
                </View>
                <View style={styles.taskItem}>
                  <Text style={styles.taskText}>Review your week's trends</Text>
                  <Button 
                    mode="outlined" 
                    onPress={() => {/* Navigate to stats screen */}}
                    style={styles.taskButton}
                  >
                    View
                  </Button>
                </View>
              </Card.Content>
            </Card>

            {moodData.length > 0 && (
              <Card style={styles.card}>
                <Card.Content>
                  <Title>Recent Mood</Title>
                  <View style={styles.recentMoodContainer}>
                    <Text style={styles.moodLabel}>Your last entry:</Text>
                    <Text style={styles.moodValue}>
                      {moodData[moodData.length - 1]?.moodEmoji || '😊'} {' '}
                      {new Date(moodData[moodData.length - 1]?.timestamp || Date.now()).toLocaleDateString()}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            )}

            <Card style={styles.infoCard}>
              <Card.Content>
                <Paragraph style={styles.infoText}>
                  HRV (Heart Rate Variability) is the variation in time between each heartbeat. Higher HRV generally indicates better cardiovascular fitness and resilience to stress.
                </Paragraph>
              </Card.Content>
            </Card>
          </>
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  graphContainer: {
    height: 250,
    marginTop: 8,
  },
  noDataContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
  },
  noDataText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  noDataDescription: {
    textAlign: 'center',
    marginBottom: 16,
    color: theme.colors.onSurfaceVariant,
  },
  connectButton: {
    marginTop: 8,
  },
  taskItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  taskText: {
    fontSize: 16,
  },
  taskButton: {
    marginLeft: 8,
  },
  recentMoodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingVertical: 12,
  },
  moodLabel: {
    fontSize: 16,
    marginRight: 8,
  },
  moodValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 32,
    backgroundColor: theme.colors.secondaryContainer,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.onSecondaryContainer,
  },
});

export default HomeScreen;
