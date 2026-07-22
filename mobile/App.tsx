import { Platform, StatusBar, View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import { CopilotProvider } from 'react-native-copilot';
import Constants from 'expo-constants';
import { TourTooltip } from './src/components/TourTooltip';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useAppTheme } from './src/contexts/ThemeContext';
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
      <CopilotProvider
        animated
        backdropColor="rgba(0,0,0,0.75)"
        tooltipComponent={TourTooltip}
        stepNumberComponent={() => null}
        verticalOffset={Platform.OS === 'android' && Constants.appOwnership !== 'expo' ? StatusBar.currentHeight ?? 24 : 0}
        labels={{ finish: 'Concluir', next: 'Próximo', skip: 'Pular', previous: 'Anterior' }}
      >
        <View style={{ flex: 1 }}>
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
          <OfflineBanner />
        </View>
      </CopilotProvider>
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
