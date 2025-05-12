
import { MD3LightTheme, configureFonts } from 'react-native-paper';

const customColors = {
  primary: '#4E6AF6', // Modern blue
  primaryContainer: '#EEF0FF',
  secondary: '#8C42F9', // Vibrant purple
  secondaryContainer: '#F4EBFF',
  tertiary: '#FF6B6B', // Coral accent
  tertiaryContainer: '#FFE9E9',
  error: '#FF4B4B',
  errorContainer: '#FFE5E5',
  background: '#FAFBFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F4F6FF',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#FFFFFF',
  onBackground: '#1A1B1F',
  onSurface: '#1A1B1F',
  onSurfaceVariant: '#45464F',
  onError: '#FFFFFF',
  outline: '#79747E',
  outlineVariant: '#E4E6FF',
  shadow: 'rgba(67, 71, 85, 0.13)',
  elevation: {
    level0: 'transparent',
    level1: 'rgba(67, 71, 85, 0.05)',
    level2: 'rgba(67, 71, 85, 0.08)',
    level3: 'rgba(67, 71, 85, 0.11)',
    level4: 'rgba(67, 71, 85, 0.12)',
    level5: 'rgba(67, 71, 85, 0.14)',
  }
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '600',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '200',
    },
  },
};

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 20,
  animation: {
    scale: 1.0,
  },
};
