import React from 'react';
import { StyleSheet, View, Image, Text, Dimensions } from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../utils/theme';

const { width } = Dimensions.get('window');

const OnboardingScreen = () => {
  const navigation = useNavigation();

  return (
    <Onboarding
      onSkip={() => navigation.navigate('Diagnosis')}
      onDone={() => navigation.navigate('Diagnosis')}
      pages={[
        {
          backgroundColor: theme.colors.background,
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="heart-outline" size={150} color={theme.colors.primary} />
            </View>
          ),
          title: 'Welcome to HRV & Mood Tracker',
          subtitle: 'Monitor your heart rate variability and track your mood to better understand your health.',
        },
        {
          backgroundColor: theme.colors.secondaryContainer,
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="pulse" size={150} color={theme.colors.primary} />
            </View>
          ),
          title: 'Track Your HRV',
          subtitle: 'We connect with Apple Health to track your Heart Rate Variability over time.',
        },
        {
          backgroundColor: theme.colors.tertiaryContainer,
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="happy-outline" size={150} color={theme.colors.tertiary} />
            </View>
          ),
          title: 'Monitor Your Mood',
          subtitle: 'Easily log your daily mood with our simple emoji rating system.',
        },
        {
          backgroundColor: theme.colors.surfaceVariant,
          image: (
            <View style={styles.imageContainer}>
              <Ionicons name="notifications-outline" size={150} color={theme.colors.primary} />
            </View>
          ),
          title: 'Get Timely Reminders',
          subtitle: "We'll notify you when it's time to focus on self-care based on your HRV patterns.",
        },
      ]}
      containerStyles={styles.container}
      titleStyles={styles.title}
      subTitleStyles={styles.subtitle}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.8,
    height: width * 0.8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 24,
    color: theme.colors.onBackground,
    textAlign: 'center',
    marginHorizontal: 20,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.onSurfaceVariant,
    textAlign: 'center',
    marginHorizontal: 40,
    marginTop: 10,
  },
});

export default OnboardingScreen;
