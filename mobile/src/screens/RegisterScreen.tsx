import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, HelperText, IconButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/AppNavigator';
import { useRegister } from '../hooks/useRegister';
import { useAppTheme } from '../contexts/ThemeContext';
import { layout } from '../theme/layout';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const {
    name, setName,
    email, setEmail,
    password, setPassword,
    passwordConfirmation, setPasswordConfirmation,
    loading, errors, submit,
  } = useRegister();
  const { colors } = useAppTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <IconButton
            icon="arrow-left"
            iconColor={colors.text}
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={[styles.logo, { color: colors.accent }]}>₿</Text>
          <Text style={[styles.title, { color: colors.text }]}>Criar conta</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Comece a investir em Bitcoin hoje</Text>

          <View style={[styles.form, { maxWidth: layout.formMaxWidth, width: '100%', alignSelf: 'center' }]}>
            <View>
              <TextInput
                label="Nome completo"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                style={{ backgroundColor: colors.card }}
                textColor={colors.text}
                error={!!errors.name}
                theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
              />
              <HelperText type="error" visible={!!errors.name}>
                {errors.name}
              </HelperText>
            </View>

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
                secureTextEntry={!showPassword}
                style={{ backgroundColor: colors.card }}
                textColor={colors.text}
                error={!!errors.password}
                theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
                right={
                  <TextInput.Icon
                    icon={showPassword ? 'eye-off' : 'eye'}
                    onPress={() => setShowPassword(!showPassword)}
                  />
                }
              />
              <HelperText type="error" visible={!!errors.password}>
                {errors.password}
              </HelperText>
            </View>

            <View>
              <TextInput
                label="Confirmar senha"
                value={passwordConfirmation}
                onChangeText={setPasswordConfirmation}
                secureTextEntry={!showConfirmation}
                style={{ backgroundColor: colors.card }}
                textColor={colors.text}
                error={!!errors.passwordConfirmation}
                theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
                right={
                  <TextInput.Icon
                    icon={showConfirmation ? 'eye-off' : 'eye'}
                    onPress={() => setShowConfirmation(!showConfirmation)}
                  />
                }
              />
              <HelperText type="error" visible={!!errors.passwordConfirmation}>
                {errors.passwordConfirmation}
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
              Criar conta
            </Button>

            <Text style={[styles.link, { color: colors.textSecondary }]} onPress={() => navigation.navigate('Login')}>
              Já tem conta?{' '}
              <Text style={{ color: colors.accent, fontWeight: '600' }}>Entrar</Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 16,
    alignItems: 'stretch',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginLeft: -8,
    marginBottom: 8,
  },
  logo: {
    fontSize: 48,
    fontWeight: '700',
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
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
