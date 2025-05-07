import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Text, Card, List, Button, Divider, Dialog, Portal, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from '../utils/theme';
import { requestHealthKitPermissions, checkHealthKitStatus } from '../services/healthKit';

const SettingsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyReminderEnabled, setDailyReminderEnabled] = useState(true);
  const [healthKitConnected, setHealthKitConnected] = useState(false);
  const [healthKitPermissionsVisible, setHealthKitPermissionsVisible] = useState(false);
  const [resetDialogVisible, setResetDialogVisible] = useState(false);
  const [diagnosisInfo, setDiagnosisInfo] = useState(null);
  const [exportDialogVisible, setExportDialogVisible] = useState(false);
  const [exportEmail, setExportEmail] = useState('');

  useEffect(() => {
    checkHealthConnection();
    loadSettings();
    loadDiagnosisInfo();
  }, []);

  const checkHealthConnection = async () => {
    const status = await checkHealthKitStatus();
    setHealthKitConnected(status);
  };

  const loadSettings = async () => {
    try {
      const settings = await AsyncStorage.getItem('appSettings');
      if (settings) {
        const parsedSettings = JSON.parse(settings);
        setNotificationsEnabled(parsedSettings.notifications ?? true);
        setDailyReminderEnabled(parsedSettings.dailyReminder ?? true);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const loadDiagnosisInfo = async () => {
    try {
      const diagnosis = await AsyncStorage.getItem('userDiagnosis');
      if (diagnosis) {
        setDiagnosisInfo(JSON.parse(diagnosis));
      }
    } catch (error) {
      console.error('Error loading diagnosis info:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const currentSettings = await AsyncStorage.getItem('appSettings');
      const settings = currentSettings ? JSON.parse(currentSettings) : {};
      settings[key] = value;
      await AsyncStorage.setItem('appSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving setting:', error);
    }
  };

  const handleNotificationsToggle = (value) => {
    setNotificationsEnabled(value);
    updateSetting('notifications', value);
  };

  const handleDailyReminderToggle = (value) => {
    setDailyReminderEnabled(value);
    updateSetting('dailyReminder', value);
  };

  const handleConnectHealthKit = async () => {
    const success = await requestHealthKitPermissions();
    setHealthKitConnected(success);
    if (!success) {
      setHealthKitPermissionsVisible(true);
    }
  };

  const handleResetApp = async () => {
    try {
      // Keep health permissions but clear all other data
      await AsyncStorage.multiRemove([
        'hasLaunched',
        'appSettings',
        'userMoodEntries',
        'userDiagnosis'
      ]);
      
      Alert.alert(
        'App Reset Complete',
        'All app data has been reset. The app will now restart.',
        [
          {
            text: 'OK',
            onPress: () => {
              // In a real app, you might use some kind of navigation reset
              // But for this mock, we'll just reload settings
              loadSettings();
              loadDiagnosisInfo();
              setResetDialogVisible(false);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error resetting app:', error);
      Alert.alert('Error', 'Failed to reset app data.');
    }
  };

  const handleExportData = () => {
    if (!exportEmail.trim()) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    
    // In a real app, this would generate and email a report
    Alert.alert(
      'Data Export',
      `In a production app, your health and mood data would be exported to ${exportEmail} as a CSV file.`,
      [
        {
          text: 'OK',
          onPress: () => setExportDialogVisible(false)
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Settings</Text>
        
        <Card style={styles.card}>
          <Card.Content>
            <List.Section>
              <List.Subheader>Health Data</List.Subheader>
              <List.Item
                title="Apple Health Connection"
                description={healthKitConnected ? "Connected" : "Not connected"}
                left={props => <List.Icon {...props} icon="heart-pulse" />}
                right={props => (
                  <Button 
                    mode={healthKitConnected ? "outlined" : "contained"} 
                    onPress={handleConnectHealthKit}
                    style={styles.listButton}
                  >
                    {healthKitConnected ? "Reconnect" : "Connect"}
                  </Button>
                )}
              />
              <Divider />
              
              <List.Subheader>Notifications</List.Subheader>
              <List.Item
                title="Enable Notifications"
                description="Get alerts for stress detection and reminders"
                left={props => <List.Icon {...props} icon="bell" />}
                right={props => (
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={handleNotificationsToggle}
                    color={theme.colors.primary}
                  />
                )}
              />
              <List.Item
                title="Daily Mood Check-in Reminder"
                description="Receive a reminder to log your mood"
                left={props => <List.Icon {...props} icon="emoticon" />}
                right={props => (
                  <Switch
                    value={dailyReminderEnabled}
                    onValueChange={handleDailyReminderToggle}
                    color={theme.colors.primary}
                    disabled={!notificationsEnabled}
                  />
                )}
              />
              <Divider />
              
              <List.Subheader>Data & Privacy</List.Subheader>
              <List.Item
                title="Export Your Data"
                description="Send your data to your email as CSV"
                left={props => <List.Icon {...props} icon="export" />}
                onPress={() => setExportDialogVisible(true)}
              />
              <List.Item
                title="Privacy Policy"
                description="View our privacy policy"
                left={props => <List.Icon {...props} icon="shield-account" />}
                onPress={() => {
                  // In a real app, link to privacy policy
                  Alert.alert('Privacy Policy', 'In a production app, this would link to our privacy policy.');
                }}
              />
              <Divider />
              
              <List.Subheader>Health Information</List.Subheader>
              {diagnosisInfo && (
                <List.Item
                  title="Mood Disorder Diagnosis"
                  description={diagnosisInfo.hasDiagnosis ? diagnosisInfo.diagnosisType.charAt(0).toUpperCase() + diagnosisInfo.diagnosisType.slice(1) : 'None reported'}
                  left={props => <List.Icon {...props} icon="medical-bag" />}
                />
              )}
              <Divider />
              
              <List.Subheader>App</List.Subheader>
              <List.Item
                title="About"
                description="Version 1.0.0"
                left={props => <List.Icon {...props} icon="information" />}
              />
              <List.Item
                title="Reset App Data"
                description="Clear all your data and start fresh"
                left={props => <List.Icon {...props} icon="delete" color={theme.colors.error} />}
                onPress={() => setResetDialogVisible(true)}
              />
            </List.Section>
          </Card.Content>
        </Card>
        
        <Portal>
          <Dialog visible={healthKitPermissionsVisible} onDismiss={() => setHealthKitPermissionsVisible(false)}>
            <Dialog.Title>Health Permissions Required</Dialog.Title>
            <Dialog.Content>
              <Text>
                This app needs permission to read your HRV data from Apple Health.
                Please go to Settings > Privacy > Health > HRV Mood Tracker and enable permissions.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setHealthKitPermissionsVisible(false)}>Cancel</Button>
              <Button onPress={() => {
                setHealthKitPermissionsVisible(false);
                Linking.openURL('app-settings:');
              }}>Open Settings</Button>
            </Dialog.Actions>
          </Dialog>
          
          <Dialog visible={resetDialogVisible} onDismiss={() => setResetDialogVisible(false)}>
            <Dialog.Title>Reset App Data?</Dialog.Title>
            <Dialog.Content>
              <Text>
                This will delete all your mood entries and preferences. This action cannot be undone.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setResetDialogVisible(false)}>Cancel</Button>
              <Button onPress={handleResetApp} textColor={theme.colors.error}>Reset All Data</Button>
            </Dialog.Actions>
          </Dialog>
          
          <Dialog visible={exportDialogVisible} onDismiss={() => setExportDialogVisible(false)}>
            <Dialog.Title>Export Your Data</Dialog.Title>
            <Dialog.Content>
              <Text style={styles.dialogText}>
                Enter your email address to receive a CSV file containing your health and mood data.
              </Text>
              <TextInput
                label="Email Address"
                value={exportEmail}
                onChangeText={setExportEmail}
                keyboardType="email-address"
                style={styles.emailInput}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={() => setExportDialogVisible(false)}>Cancel</Button>
              <Button onPress={handleExportData}>Export</Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  listButton: {
    marginVertical: 4,
  },
  dialogText: {
    marginBottom: 16,
  },
  emailInput: {
    marginTop: 8,
  },
});

export default SettingsScreen;
