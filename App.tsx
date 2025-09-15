import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from './src/screens/HomeScreen';
import MoodScreen from './src/screens/MoodScreen';
import SleepScreen from './src/screens/SleepScreen';
import HRVScreen from './src/screens/HRVScreen';
import StatsScreen from './src/screens/StatsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const theme = {
  primary: '#2e7d32',
  primaryLight: '#66bb6a',
  background: '#f8f9fa',
  surface: '#ffffff',
  text: '#212121',
  textSecondary: '#757575',
};

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.primary} />
      <Tab.Navigator
        id={undefined}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            switch (route.name) {
              case 'Home':
                iconName = focused ? 'home' : 'home-outline';
                break;
              case 'Mood':
                iconName = focused ? 'happy' : 'happy-outline';
                break;
              case 'Sleep':
                iconName = focused ? 'bed' : 'bed-outline';
                break;
              case 'HRV':
                iconName = focused ? 'pulse' : 'pulse-outline';
                break;
              case 'Stats':
                iconName = focused ? 'bar-chart' : 'bar-chart-outline';
                break;
              case 'Settings':
                iconName = focused ? 'settings' : 'settings-outline';
                break;
              default:
                iconName = 'home-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: theme.primary,
          tabBarInactiveTintColor: theme.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.surface,
            borderTopColor: '#e0e0e0',
            paddingBottom: Platform.OS === 'ios' ? 25 : 8,
            height: Platform.OS === 'ios' ? 90 : 65,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 8,
          },
          headerStyle: {
            backgroundColor: theme.primary,
            shadowColor: 'transparent',
            elevation: 0,
          },
          headerTintColor: '#ffffff',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 20,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
        })}
      >
        <Tab.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ title: 'FeelPulse' }}
        />
        <Tab.Screen 
          name="Mood" 
          component={MoodScreen}
          options={{ title: 'Mood Tracker' }}
        />
        <Tab.Screen 
          name="Sleep" 
          component={SleepScreen}
          options={{ title: 'Sleep Tracker' }}
        />
        <Tab.Screen 
          name="HRV" 
          component={HRVScreen}
          options={{ title: 'HRV Monitor' }}
        />
        <Tab.Screen 
          name="Stats" 
          component={StatsScreen}
          options={{ title: 'Analytics' }}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: 'Settings' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}