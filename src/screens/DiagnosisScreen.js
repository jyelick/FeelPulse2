import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Button, RadioButton, Checkbox, Card, Title, Paragraph } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../utils/theme';

const DiagnosisScreen = () => {
  const navigation = useNavigation();
  const [diagnosed, setDiagnosed] = useState('no');
  const [diagnosis, setDiagnosis] = useState('');
  const [isConsent, setIsConsent] = useState(false);
  const [isPrivacyConsent, setIsPrivacyConsent] = useState(false);

  const handleSubmit = async () => {
    try {
      // Save diagnosis info to AsyncStorage
      await AsyncStorage.setItem('userDiagnosis', JSON.stringify({
        hasDiagnosis: diagnosed === 'yes',
        diagnosisType: diagnosed === 'yes' ? diagnosis : 'none',
        consentGiven: isConsent,
        privacyConsentGiven: isPrivacyConsent
      }));
      
      // Navigate to main app
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    } catch (error) {
      console.error('Error saving diagnosis info:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Before We Begin</Title>
        <Paragraph style={styles.paragraph}>
          To provide you with the best experience, we'd like to know a bit about your health background.
          This information is kept private and used only to personalize your experience.
        </Paragraph>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.question}>Have you been diagnosed with a mood disorder?</Text>
            <RadioButton.Group onValueChange={value => setDiagnosed(value)} value={diagnosed}>
              <View style={styles.radioOption}>
                <RadioButton value="yes" color={theme.colors.primary} />
                <Text>Yes</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="no" color={theme.colors.primary} />
                <Text>No</Text>
              </View>
              <View style={styles.radioOption}>
                <RadioButton value="prefer_not_to_say" color={theme.colors.primary} />
                <Text>Prefer not to say</Text>
              </View>
            </RadioButton.Group>

            {diagnosed === 'yes' && (
              <>
                <Text style={[styles.question, styles.followupQuestion]}>
                  What is your diagnosis? (This helps us tailor your experience)
                </Text>
                <RadioButton.Group onValueChange={value => setDiagnosis(value)} value={diagnosis}>
                  <View style={styles.radioOption}>
                    <RadioButton value="depression" color={theme.colors.primary} />
                    <Text>Depression</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="anxiety" color={theme.colors.primary} />
                    <Text>Anxiety</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="bipolar" color={theme.colors.primary} />
                    <Text>Bipolar Disorder</Text>
                  </View>
                  <View style={styles.radioOption}>
                    <RadioButton value="other" color={theme.colors.primary} />
                    <Text>Other</Text>
                  </View>
                </RadioButton.Group>
              </>
            )}
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.question}>Consent</Text>
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isConsent ? 'checked' : 'unchecked'}
                onPress={() => setIsConsent(!isConsent)}
                color={theme.colors.primary}
              />
              <Text style={styles.checkboxLabel}>
                I consent to the app accessing my Apple Health data to track my HRV measurements.
              </Text>
            </View>
            
            <View style={styles.checkboxContainer}>
              <Checkbox
                status={isPrivacyConsent ? 'checked' : 'unchecked'}
                onPress={() => setIsPrivacyConsent(!isPrivacyConsent)}
                color={theme.colors.primary}
              />
              <Text style={styles.checkboxLabel}>
                I understand that my data is stored locally on my device and I can delete it at any time.
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!isConsent || !isPrivacyConsent}
          style={styles.button}
        >
          Get Started
        </Button>
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
  paragraph: {
    marginBottom: 24,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    color: theme.colors.onSurface,
  },
  followupQuestion: {
    marginTop: 24,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkboxLabel: {
    flex: 1,
    marginLeft: 8,
  },
  button: {
    marginTop: 24,
    marginBottom: 40,
    paddingVertical: 8,
  },
});

export default DiagnosisScreen;
