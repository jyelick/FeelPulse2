
import { MD3LightTheme, configureFonts } from 'react-native-paper';

const customColors = {
  primary: '#2E7D32',
  primaryContainer: '#A5D6A7',
  secondary: '#1E88E5',
  secondaryContainer: '#90CAF9',
  tertiary: '#FFA726',
  tertiaryContainer: '#FFE0B2',
  error: '#D32F2F',
  errorContainer: '#FFCDD2',
  background: '#F8FAFD',
  surface: '#FFFFFF',
  surfaceVariant: '#EEF2F6',
  onPrimary: '#FFFFFF',
  onSecondary: '#FFFFFF',
  onTertiary: '#000000',
  onBackground: '#1C2025',
  onSurface: '#1C2025',
  onSurfaceVariant: '#44474E',
  onError: '#FFFFFF',
  outline: '#79747E',
  outlineVariant: '#C4C7C5',
  shadow: 'rgba(0, 0, 0, 0.08)',
  elevation: {
    level0: 'transparent',
    level1: 'rgba(0, 0, 0, 0.05)',
    level2: 'rgba(0, 0, 0, 0.08)',
    level3: 'rgba(0, 0, 0, 0.11)',
    level4: 'rgba(0, 0, 0, 0.12)',
    level5: 'rgba(0, 0, 0, 0.14)',
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
  roundness: 16,
  animation: {
    scale: 1.0,
  },
};
