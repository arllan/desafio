import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AppNavigator';
import { useLogin } from '../hooks/useLogin';
import { useAppTheme } from '../contexts/ThemeContext';
import { layout } from '../theme/layout';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { email, setEmail, password, setPassword, loading, errors, submit } = useLogin();
  const { colors } = useAppTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.container}>
          <View style={styles.hero}>
            <Text style={[styles.logo, { color: colors.accent }]}>₿</Text>
            <Text style={[styles.appName, { color: colors.text }]}>BitTrade</Text>
            <Text style={[styles.tagline, { color: colors.textSecondary }]}>Sua plataforma de Bitcoin</Text>
          </View>

          <View style={[styles.form, { maxWidth: layout.formMaxWidth, width: '100%', alignSelf: 'center' }]}>
            <View>
              <TextInput
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ backgroundColor: colors.card }}
                textColor={colors.text}
                error={!!errors.email}
                theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
              />
              <HelperText type="error" visible={!!errors.email}>
                {errors.email}
              </HelperText>
            </View>

            <View>
              <TextInput
                label="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ backgroundColor: colors.card }}
                textColor={colors.text}
                error={!!errors.password}
                theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            </View>

            {errors.general && (
              <HelperText type="error" visible style={styles.generalError}>
                {errors.general}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={submit}
              loading={loading}
              disabled={loading}
              style={[styles.button, { backgroundColor: colors.accent }]}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Entrar
            </Button>

            <Text style={[styles.link, { color: colors.textSecondary }]} onPress={() => navigation.navigate('Register')}>
              Não tem conta?{' '}
              <Text style={{ color: colors.accent, fontWeight: '600' }}>Cadastre-se</Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 64,
    fontWeight: '700',
    lineHeight: 72,
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    marginTop: 8,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    marginTop: 4,
  },
  form: {
    gap: 4,
  },
  generalError: {
    textAlign: 'center',
    fontSize: 13,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 50,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  link: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
});
