import { View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useAppTheme } from './src/contexts/ThemeContext';
import { WalletProvider } from './src/contexts/WalletContext';
import RootNavigator from './src/navigation/AppNavigator';
import { OfflineBanner } from './src/components/OfflineBanner';

function ThemedApp() {
  const { colors, isDark } = useAppTheme();

  const paperTheme = {
    ...(isDark ? MD3DarkTheme : MD3LightTheme),
    colors: {
      ...(isDark ? MD3DarkTheme.colors : MD3LightTheme.colors),
      primary: colors.accent,
      background: colors.bg,
      surface: colors.card,
      surfaceVariant: colors.card2,
      outline: colors.border,
    },
  };

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{ flex: 1 }}>
        <AuthProvider>
          <WalletProvider>
            <RootNavigator />
          </WalletProvider>
        </AuthProvider>
        <OfflineBanner />
      </View>
    </PaperProvider>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  );
}
