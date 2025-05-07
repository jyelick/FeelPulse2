# HRV & Mood Tracker App

A mobile application designed to track Heart Rate Variability (HRV) data from Apple Health and correlate it with mood patterns. The app features personalized onboarding for users with mood disorders (Depression, Anxiety, Bipolar, and others).

## Project Structure

This React Native application is structured as follows:

### Core Components
- **Navigation**: Tab-based navigation with Home, Mood Tracking, Stats, and Settings tabs
- **Onboarding Flow**: Personalized onboarding experience with diagnosis questions
- **HealthKit Integration**: Connection to Apple Health for HRV data access
- **Mood Tracking**: Simple emoji-based mood selection with notes
- **Visualization**: Charts showing HRV trends and mood correlations

### Key Features
- Track HRV data over time from Apple HealthKit
- Log daily mood with emoji selection and notes
- View correlations between mood and HRV metrics
- Get personalized recommendations based on diagnosis
- Stress detection based on HRV patterns

## Screens

### 1. Onboarding
Introduces the app's key features and collects initial diagnosis information to personalize the experience.

### 2. Diagnosis
Asks users if they have been diagnosed with a mood disorder (specifically Depression, Anxiety, Bipolar, or other disorders) to customize recommendations.

### 3. Home
Shows current HRV status, stress level, and quick mood check-in option.

### 4. Mood Tracking
Calendar view for logging and viewing mood entries over time.

### 5. Stats
Visualizations showing correlations between HRV data and mood patterns.

### 6. Settings
App preferences, HealthKit permissions, and diagnosis information management.

## Technical Stack
- React Native with Expo
- Apple HealthKit integration via expo-health
- AsyncStorage for local data persistence
- Victory Native for data visualization
- React Navigation for screen navigation

## Development Notes

### Current Limitations
The app is currently experiencing dependency conflicts between React v19 and some packages requiring React v18 (particularly victory-native and @shopify/react-native-skia). These conflicts are preventing the app from running properly in the web preview.

To see the app functionality, we've created demonstration files that illustrate the app's core features:
- `public/index.html`: A web-based preview of the app's user interface and functionality
- `server.js`: A simple server to demonstrate API endpoints for the app's data services

### Next Steps
1. Resolve dependency conflicts to enable proper React Native workflow
2. Complete Apple HealthKit integration for authentic HRV data
3. Implement proper app packaging for iOS deployment
4. Add notification system for stress alerts based on HRV patterns
5. Enhance visualization with more detailed correlation analysis