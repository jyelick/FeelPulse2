# Overview

FeelPulse is a React Native mobile health application designed to track Heart Rate Variability (HRV) data from Apple Health and correlate it with mood patterns. The app provides personalized insights for users with mood disorders through a comprehensive tracking system that monitors stress accumulation and mood trends over time. Key features include HRV data visualization, daily mood logging with emoji-based selection, stress detection algorithms, and personalized onboarding for users with various mood disorders.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React Native with Expo for cross-platform mobile development
- **Navigation**: Stack-based navigation for onboarding flow and tab-based navigation for main app sections
- **UI Components**: React Native Paper for Material Design 3 components with custom theming
- **State Management**: React hooks for local component state management
- **Data Visualization**: Victory Native for charting HRV trends and mood correlations

## Backend Architecture
- **Local Storage**: AsyncStorage for client-side data persistence (user preferences, mood entries, settings)
- **Mock Server**: Node.js HTTP server with in-memory mock data for development
- **Database Schema**: Drizzle ORM with PostgreSQL schema definitions for users, HRV data, mood entries, and sleep data
- **API Integration**: RESTful endpoints for data synchronization and AI-powered insights

## Data Storage Solutions
- **Primary Database**: PostgreSQL with Neon serverless hosting
- **ORM**: Drizzle ORM for type-safe database operations
- **Local Cache**: AsyncStorage for offline functionality and quick data access
- **Health Data**: Apple HealthKit integration for HRV data import (iOS only)

## Authentication and Authorization
- **User Management**: Custom authentication system with password hashing
- **Health Permissions**: Apple HealthKit authorization flow for accessing health data
- **Privacy Controls**: User consent management for diagnosis information and data sharing

## External Dependencies

### Health Data Integration
- **Apple HealthKit**: Primary source for HRV, heart rate, and sleep data through expo-health package
- **Health Permissions**: NSHealthShareUsageDescription and NSHealthUpdateUsageDescription for iOS

### Third-Party Services
- **OpenAI API**: GPT-5 integration for personalized health insights and recommendations
- **Chart Visualization**: Victory Native for interactive data visualization
- **Calendar Component**: react-native-calendars for mood tracking interface

### Development Tools
- **Expo Platform**: Development and deployment framework
- **Metro Bundler**: JavaScript bundler for React Native
- **TypeScript**: Type safety and enhanced developer experience

### UI and UX Libraries
- **React Native Paper**: Material Design 3 component library
- **React Navigation**: Navigation framework with stack and tab navigators
- **Vector Icons**: Expo Vector Icons for consistent iconography
- **Onboarding**: react-native-onboarding-swiper for user introduction flow

### Data Processing
- **Stress Detection**: Custom algorithms for analyzing HRV patterns and detecting stress accumulation
- **Mood Analysis**: Correlation algorithms for identifying patterns between HRV and mood data
- **Trend Analysis**: Statistical functions for detecting significant changes in health metrics