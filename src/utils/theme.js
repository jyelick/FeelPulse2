import { MD3LightTheme, configureFonts } from 'react-native-paper';

// Define custom colors
const customColors = {
  primary: '#2E7D32', // Dark green for primary elements
  primaryContainer: '#B9F6CA', // Light green for containers
  secondary: '#0277BD', // Dark blue for secondary elements
  secondaryContainer: '#B3E5FC', // Light blue for containers
  tertiary: '#6A1B9A', // Purple for tertiary elements
  tertiaryContainer: '#E1BEE7', // Light purple for containers
  error: '#D32F2F', // Red for errors
  errorContainer: '#FFCDD2', // Light red for error containers
  background: '#F5F5F5', // Light grey for background
  surface: '#FFFFFF', // White for surfaces
  surfaceVariant: '#EEEEEE', // Light grey for surface variants
  onPrimary: '#FFFFFF', // White text on primary
  onSecondary: '#FFFFFF', // White text on secondary
  onTertiary: '#FFFFFF', // White text on tertiary
  onBackground: '#212121', // Dark text on background
  onSurface: '#212121', // Dark text on surface
  onSurfaceVariant: '#757575', // Grey text on surface variant
  onError: '#FFFFFF', // White text on error
  outline: '#BDBDBD', // Light grey for outlines
  outlineVariant: '#E0E0E0', // Very light grey for outline variants
};

// Define custom fonts
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

// Create the custom theme
export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    ...customColors,
  },
  fonts: configureFonts({ config: fontConfig }),
  roundness: 8,
  animation: {
    scale: 1.0,
  },
};
