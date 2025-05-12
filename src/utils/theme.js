
import { MD3LightTheme, configureFonts } from 'react-native-paper';

const customColors = {
  primary: '#2E7D32', // Main green
  primaryContainer: '#A5D6A7', // Light green container
  secondary: '#1976D2', // Blue accent
  secondaryContainer: '#BBDEFB', // Light blue container
  tertiary: '#FFA000', // Yellow/orange accent
  tertiaryContainer: '#FFE082', // Light yellow container
  error: '#F44336', // Red for errors
  errorContainer: '#FFCDD2', // Light red container
  background: '#F5F7FA', // Cool neutral background
  surface: '#FFFFFF', // White surface
  surfaceVariant: '#ECEFF1', // Cool grey surface variant
  onPrimary: '#FFFFFF', // White text on primary
  onSecondary: '#FFFFFF', // White text on secondary
  onTertiary: '#000000', // Black text on tertiary
  onBackground: '#263238', // Dark cool grey text
  onSurface: '#263238', // Dark cool grey text
  onSurfaceVariant: '#455A64', // Medium cool grey text
  onError: '#FFFFFF', // White text on error
  outline: '#90A4AE', // Cool grey outline
  outlineVariant: '#CFD8DC', // Light cool grey outline
  shadow: 'rgba(0, 0, 0, 0.1)', // Subtle shadow
};

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'System',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'System',
      fontWeight: '300',
    },
    thin: {
      fontFamily: 'System',
      fontWeight: '100',
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
  roundness: 12,
  animation: {
    scale: 1.0,
  },
};
