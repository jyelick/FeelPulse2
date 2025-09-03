import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SettingsScreen = () => {
  const [hasDiagnosis, setHasDiagnosis] = useState<boolean | null>(true);
  const [diagnosisType, setDiagnosisType] = useState<string>('anxiety');
  const [gender, setGender] = useState<string>('');
  const [age, setAge] = useState<string>('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [showDiagnosisOptions, setShowDiagnosisOptions] = useState(false);
  const [showGenderOptions, setShowGenderOptions] = useState(false);
  const [showAgeOptions, setShowAgeOptions] = useState(false);

  const diagnosisOptions = [
    { key: 'depression', label: 'Depression' },
    { key: 'anxiety', label: 'Anxiety' },
    { key: 'bipolar', label: 'Bipolar Disorder' },
    { key: 'other', label: 'Other' },
  ];

  const genderOptions = [
    { key: 'female', label: 'Female' },
    { key: 'male', label: 'Male' },
    { key: 'non-binary', label: 'Non-binary' },
    { key: 'prefer-not-to-say', label: 'Prefer not to say' },
  ];

  const ageOptions = [
    { key: '18-24', label: '18-24' },
    { key: '25-34', label: '25-34' },
    { key: '35-44', label: '35-44' },
    { key: '45-54', label: '45-54' },
    { key: '55-64', label: '55-64' },
    { key: '65+', label: '65+' },
  ];

  const saveSettings = () => {
    Alert.alert('Settings Saved', 'Your preferences have been updated successfully');
  };

  const handleDiagnosisChange = (value: boolean | null) => {
    setHasDiagnosis(value);
    setShowDiagnosisOptions(false);
  };

  const selectDiagnosis = (type: string) => {
    setDiagnosisType(type);
    setShowDiagnosisOptions(false);
  };

  const selectGender = (selectedGender: string) => {
    setGender(selectedGender);
    setShowGenderOptions(false);
  };

  const selectAge = (selectedAge: string) => {
    setAge(selectedAge);
    setShowAgeOptions(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Diagnosis Settings */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Health Information</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <Text style={styles.sectionTitle}>Do you have a mood disorder diagnosis?</Text>
            <View style={styles.diagnosisOptions}>
              <TouchableOpacity
                style={[
                  styles.diagnosisButton,
                  hasDiagnosis === true && styles.selectedDiagnosis
                ]}
                onPress={() => handleDiagnosisChange(true)}
              >
                <Text style={[
                  styles.diagnosisText,
                  hasDiagnosis === true && styles.selectedDiagnosisText
                ]}>
                  Yes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.diagnosisButton,
                  hasDiagnosis === false && styles.selectedDiagnosis
                ]}
                onPress={() => handleDiagnosisChange(false)}
              >
                <Text style={[
                  styles.diagnosisText,
                  hasDiagnosis === false && styles.selectedDiagnosisText
                ]}>
                  No
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.diagnosisButton,
                  hasDiagnosis === null && styles.selectedDiagnosis
                ]}
                onPress={() => handleDiagnosisChange(null)}
              >
                <Text style={[
                  styles.diagnosisText,
                  hasDiagnosis === null && styles.selectedDiagnosisText
                ]}>
                  Prefer not to say
                </Text>
              </TouchableOpacity>
            </View>

            {hasDiagnosis === true && (
              <View style={styles.diagnosisTypeSection}>
                <Text style={styles.sectionTitle}>What is your diagnosis?</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowDiagnosisOptions(!showDiagnosisOptions)}
                >
                  <Text style={styles.dropdownText}>
                    {diagnosisOptions.find(d => d.key === diagnosisType)?.label || 'Select diagnosis'}
                  </Text>
                  <Ionicons 
                    name={showDiagnosisOptions ? 'chevron-up' : 'chevron-down'} 
                    size={20} 
                    color="#757575" 
                  />
                </TouchableOpacity>
                
                {showDiagnosisOptions && (
                  <View style={styles.dropdownOptions}>
                    {diagnosisOptions.map((option) => (
                      <TouchableOpacity
                        key={option.key}
                        style={[
                          styles.dropdownOption,
                          diagnosisType === option.key && styles.selectedOption
                        ]}
                        onPress={() => selectDiagnosis(option.key)}
                      >
                        <Text style={[
                          styles.optionText,
                          diagnosisType === option.key && styles.selectedOptionText
                        ]}>
                          {option.label}
                        </Text>
                        {diagnosisType === option.key && (
                          <Ionicons name="checkmark" size={20} color="#2e7d32" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Gender Selection */}
            <View style={styles.demographicSection}>
              <Text style={styles.sectionTitle}>Gender</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowGenderOptions(!showGenderOptions)}
              >
                <Text style={styles.dropdownText}>
                  {genderOptions.find(g => g.key === gender)?.label || 'Select gender'}
                </Text>
                <Ionicons 
                  name={showGenderOptions ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#757575" 
                />
              </TouchableOpacity>
              
              {showGenderOptions && (
                <View style={styles.dropdownOptions}>
                  {genderOptions.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.dropdownOption,
                        gender === option.key && styles.selectedOption
                      ]}
                      onPress={() => selectGender(option.key)}
                    >
                      <Text style={[
                        styles.optionText,
                        gender === option.key && styles.selectedOptionText
                      ]}>
                        {option.label}
                      </Text>
                      {gender === option.key && (
                        <Ionicons name="checkmark" size={20} color="#2e7d32" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Age Selection */}
            <View style={styles.demographicSection}>
              <Text style={styles.sectionTitle}>Age Range</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowAgeOptions(!showAgeOptions)}
              >
                <Text style={styles.dropdownText}>
                  {ageOptions.find(a => a.key === age)?.label || 'Select age range'}
                </Text>
                <Ionicons 
                  name={showAgeOptions ? 'chevron-up' : 'chevron-down'} 
                  size={20} 
                  color="#757575" 
                />
              </TouchableOpacity>
              
              {showAgeOptions && (
                <View style={styles.dropdownOptions}>
                  {ageOptions.map((option) => (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.dropdownOption,
                        age === option.key && styles.selectedOption
                      ]}
                      onPress={() => selectAge(option.key)}
                    >
                      <Text style={[
                        styles.optionText,
                        age === option.key && styles.selectedOptionText
                      ]}>
                        {option.label}
                      </Text>
                      {age === option.key && (
                        <Ionicons name="checkmark" size={20} color="#2e7d32" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>App Settings</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="notifications" size={24} color="#2e7d32" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Push Notifications</Text>
                  <Text style={styles.settingDescription}>Get reminders to log your mood</Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#e0e0e0', true: '#66bb6a' }}
                thumbColor={notificationsEnabled ? '#2e7d32' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Ionicons name="moon" size={24} color="#2e7d32" />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Dark Mode</Text>
                  <Text style={styles.settingDescription}>Use dark theme for better night viewing</Text>
                </View>
              </View>
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: '#e0e0e0', true: '#66bb6a' }}
                thumbColor={darkModeEnabled ? '#2e7d32' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Data & Privacy */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Data & Privacy</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="download" size={24} color="#2e7d32" />
              <Text style={styles.actionText}>Export My Data</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="shield-checkmark" size={24} color="#2e7d32" />
              <Text style={styles.actionText}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="trash" size={24} color="#f44336" />
              <Text style={[styles.actionText, { color: '#f44336' }]}>Delete All Data</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View style={styles.card}>
          <LinearGradient
            colors={['#2e7d32', '#66bb6a']}
            style={styles.cardHeader}
          >
            <Text style={styles.cardTitle}>Support</Text>
          </LinearGradient>
          <View style={styles.cardBody}>
            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="help-circle" size={24} color="#2e7d32" />
              <Text style={styles.actionText}>Help & FAQ</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="mail" size={24} color="#2e7d32" />
              <Text style={styles.actionText}>Contact Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <Ionicons name="star" size={24} color="#ff9800" />
              <Text style={styles.actionText}>Rate FeelPulse</Text>
              <Ionicons name="chevron-forward" size={20} color="#757575" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity style={styles.saveButton} onPress={saveSettings}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" style={styles.saveIcon} />
          <Text style={styles.saveButtonText}>Save Settings</Text>
        </TouchableOpacity>

        {/* App Version */}
        <View style={styles.versionInfo}>
          <Text style={styles.versionText}>FeelPulse v1.0.0</Text>
          <Text style={styles.versionSubtext}>Made with ❤️ for your wellbeing</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 16,
  },
  diagnosisOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  diagnosisButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: 'transparent',
    alignItems: 'center',
    minWidth: 80,
  },
  selectedDiagnosis: {
    backgroundColor: 'rgba(102, 187, 106, 0.1)',
    borderColor: '#2e7d32',
  },
  diagnosisText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#757575',
  },
  selectedDiagnosisText: {
    color: '#2e7d32',
  },
  diagnosisTypeSection: {
    marginTop: 20,
  },
  demographicSection: {
    marginTop: 20,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownText: {
    fontSize: 16,
    color: '#212121',
  },
  dropdownOptions: {
    marginTop: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedOption: {
    backgroundColor: 'rgba(102, 187, 106, 0.05)',
  },
  optionText: {
    fontSize: 16,
    color: '#212121',
  },
  selectedOptionText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#757575',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionText: {
    fontSize: 16,
    color: '#212121',
    marginLeft: 16,
    flex: 1,
  },
  saveButton: {
    backgroundColor: '#2e7d32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  saveIcon: {
    marginRight: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  versionInfo: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  versionText: {
    fontSize: 14,
    color: '#757575',
    fontWeight: '600',
  },
  versionSubtext: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
});

export default SettingsScreen;