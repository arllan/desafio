import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { useTrade } from '../hooks/useTrade';
import { useWallet } from '../hooks/useWallet';
import { useAppTheme } from '../contexts/ThemeContext';
import { layout } from '../theme/layout';

type Props = NativeStackScreenProps<AppStackParamList, 'Trade'>;

export default function TradeScreen(_props: Props) {
  const { colors } = useAppTheme();
  const { balanceBtc, rawBalanceBtc } = useWallet();
  const {
    mode, setMode,
    amount, setAmount,
    preview, btcPrice,
    loading, error, success,
    submit, resetFeedback,
  } = useTrade();

  const isBuy = mode === 'buy';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['bottom']}>
      {loading && (
        <View style={[styles.loadingOverlay, { backgroundColor: `${colors.bg}CC` }]}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            {isBuy ? 'Comprando Bitcoin...' : 'Vendendo Bitcoin...'}
          </Text>
        </View>
      )}

      <View style={[styles.container, layout.isTablet && styles.containerTablet]}>
        <SegmentedButtons
          value={mode}
          onValueChange={(v: string) => setMode(v as 'buy' | 'sell')}
          buttons={[
            {
              value: 'buy',
              label: 'Comprar',
              style: isBuy ? { backgroundColor: colors.buy } : { backgroundColor: 'transparent' },
              labelStyle: { color: isBuy ? '#fff' : colors.textSecondary, fontWeight: '700' },
            },
            {
              value: 'sell',
              label: 'Vender',
              style: !isBuy ? { backgroundColor: colors.sell } : { backgroundColor: 'transparent' },
              labelStyle: { color: !isBuy ? '#fff' : colors.textSecondary, fontWeight: '700' },
            },
          ]}
          style={{ backgroundColor: colors.card, borderRadius: 12 }}
        />

        <View style={[styles.priceRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Cotação atual</Text>
          <Text style={[styles.priceValue, { color: colors.accent }]}>{btcPrice}</Text>
        </View>

        {!isBuy && (
          <View style={[styles.balanceRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View>
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Seu saldo em Bitcoin</Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>{balanceBtc}</Text>
            </View>
            <Pressable
              style={({ pressed }) => [styles.useAllBtn, { backgroundColor: `${colors.sell}20`, borderColor: colors.sell, opacity: pressed ? 0.7 : 1 }]}
              onPress={() => setAmount(rawBalanceBtc)}
            >
              <Text style={[styles.useAllText, { color: colors.sell }]}>Usar tudo</Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.inputCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            label={isBuy ? 'Valor em reais (R$)' : 'Quantidade de BTC'}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={{ backgroundColor: colors.card2 }}
            textColor={colors.text}
            theme={{ colors: { onSurfaceVariant: colors.textSecondary } }}
          />

          {preview !== '' && (
            <View style={[styles.previewBox, { backgroundColor: colors.card2 }]}>
              <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>
                {isBuy ? 'Você vai receber' : 'Você vai receber'}
              </Text>
              <Text style={[styles.previewValue, { color: colors.text }]}>{preview}</Text>
            </View>
          )}
        </View>

        {error !== null && (
          <View style={[styles.feedbackBox, { borderColor: colors.error, backgroundColor: `${colors.error}20` }]}>
            <Text style={{ color: colors.error, textAlign: 'center', fontWeight: '600' }} onPress={resetFeedback}>
              {error} ✕
            </Text>
          </View>
        )}

        {success !== null && (
          <View style={[styles.feedbackBox, { borderColor: colors.success, backgroundColor: `${colors.success}20` }]}>
            <Text style={{ color: colors.success, textAlign: 'center', fontWeight: '600' }} onPress={resetFeedback}>
              {success} ✓
            </Text>
          </View>
        )}

        <Button
          mode="contained"
          onPress={submit}
          loading={loading}
          disabled={loading || amount === ''}
          style={[styles.button, { backgroundColor: isBuy ? colors.buy : colors.sell }]}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
        >
          {isBuy ? 'Comprar Bitcoin' : 'Vender Bitcoin'}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loadingOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    padding: 20,
    gap: 16,
  },
  containerTablet: {
    maxWidth: 600,
    alignSelf: 'center' as const,
    width: '100%',
  },
  priceRow: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  priceLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  balanceRow: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  balanceLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  useAllBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  useAllText: {
    fontSize: 13,
    fontWeight: '700',
  },
  inputCard: {
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
  },
  previewBox: {
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 13,
  },
  previewValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  feedbackBox: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  button: {
    borderRadius: 12,
    marginTop: 'auto',
  },
  buttonContent: {
    height: 52,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});
