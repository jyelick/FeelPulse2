# FeelPulse - HRV & Mood Tracking App

## Overview

FeelPulse is a React Native mobile application that monitors Heart Rate Variability (HRV) data from Apple HealthKit and correlates it with user mood patterns. The app is designed to help users understand the relationship between their physiological stress indicators and emotional well-being, providing personalized insights for those with mood disorders.

The application tracks HRV over a 5-day rolling window, detects stress accumulation patterns, and prompts users with supportive self-care messages when stress levels appear elevated. It features a simple emoji-based mood tracking system and visualizes correlations between HRV trends and mood data.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 53
- **UI Library**: React Native Paper (Material Design 3) for consistent UI components
- **Navigation**: React Navigation with bottom tab navigator and stack navigator
- **State Management**: Local React state with hooks (useState, useEffect)
- **Charts & Visualization**: Victory Native for data visualization and trend analysis
- **Styling**: Custom theme system with Material Design 3 color tokens

### Mobile Platform Strategy
- **Primary Platform**: iOS (required for Apple HealthKit integration)
- **Cross-platform Support**: Android and web versions supported but with limited health data functionality
- **Device Permissions**: Requires iOS health data permissions for HRV access

### Data Storage Architecture
- **Local Storage**: AsyncStorage for user preferences, mood entries, and app settings
- **Health Data**: Apple HealthKit integration via expo-health for HRV data
- **Data Structure**: JSON-based storage with timestamp-indexed mood and HRV entries

### Health Data Integration
- **Apple HealthKit**: Primary source for HRV (Heart Rate Variability SDNN) data
- **Permissions**: Read access to heart rate variability, sleep analysis, and activity data
- **Mock Implementation**: Development environment uses sophisticated mock data generation
- **Data Validation**: Client-side validation for health data ranges and consistency

### User Experience Flow
- **Onboarding**: Multi-step introduction with personalized diagnosis questions
- **Main Interface**: Tab-based navigation (Home, Mood, Stats, Settings)
- **Mood Tracking**: 5-point emoji scale with optional notes
- **Stress Detection**: Algorithm-based analysis of HRV trends with supportive messaging

### Analytics & Insights
- **Trend Analysis**: 5-day rolling window for HRV pattern detection
- **Correlation Engine**: Mathematical analysis of mood-HRV relationships
- **Visualization**: Combined trend graphs showing both physiological and emotional data
- **Personalization**: Diagnosis-based customization of recommendations and insights

## External Dependencies

### Core React Native Ecosystem
- **React Native**: 0.72.6 - Cross-platform mobile development framework
- **Expo SDK**: 53.0.8 - Development platform and build tools
- **React Navigation**: 7.x - Screen navigation and routing

### UI & Design System
- **React Native Paper**: 5.14.0 - Material Design 3 UI components
- **React Native Vector Icons**: Icon library via @expo/vector-icons
- **Expo Linear Gradient**: Gradient backgrounds and visual effects
- **React Native Onboarding Swiper**: First-time user experience

### Data Visualization
- **Victory Native**: 41.17.1 - Chart library for HRV and mood trend visualization
- **React Native SVG**: Vector graphics support for custom visualizations
- **React Native Calendars**: Calendar component for mood tracking history

### Health & Data Integration
- **Expo Health**: Apple HealthKit integration (currently in development/beta)
- **AsyncStorage**: @react-native-async-storage/async-storage 2.1.2 - Local data persistence

### Development Tools
- **TypeScript**: 5.8.3 - Type safety and development experience
- **Metro**: 0.82.3 - React Native bundler
- **Babel**: Preset configuration for Expo compatibility

### Platform-Specific Requirements
- **iOS**: NSHealthShareUsageDescription and NSHealthUpdateUsageDescription in Info.plist
- **Apple HealthKit**: Required for HRV data access on iOS devices
- **React Native Gesture Handler**: Touch interaction handling
- **React Native Safe Area Context**: Screen layout management

### Future Integration Readiness
- **Drizzle ORM**: Database schema prepared for potential backend expansion
- **Neon Database**: Serverless PostgreSQL integration prepared
- **CSV/JSON Export**: Architecture supports future mood app data imports (Daylio, Bearable, eMoods)