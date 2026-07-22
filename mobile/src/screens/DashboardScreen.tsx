import { useCallback, useEffect, useRef } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Snackbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CopilotStep, useCopilot, walkthroughable } from 'react-native-copilot';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { layout } from '../theme/layout';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme } from '../contexts/ThemeContext';
import { useWallet } from '../hooks/useWallet';
import { useMarketPrice } from '../hooks/useMarketPrice';
import { Skeleton } from '../components/Skeleton';
import { useTourStart } from '../hooks/useTourStart';
import { ms, scale, verticalScale } from '../utils/scale';

const WalkthroughableView = walkthroughable(View);

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { balanceBrl, balanceBtc, userName, loading: walletLoading, refresh } = useWallet();
  const { price, loading: priceLoading } = useMarketPrice();
  const { startTour, toastVisible, dismissToast } = useTourStart(isDark, toggleTheme);
  const { visible: tourVisible } = useCopilot();
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (walletLoading) return;
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      startTour();
    }, 800);
    return () => clearTimeout(timer);
  }, [walletLoading]);

  const handleSignOut = useCallback(() => signOut(), [signOut]);
  const handleNavigateTrade = useCallback(() => navigation.navigate('Trade'), [navigation]);
  const handleNavigateHistory = useCallback(() => navigation.navigate('History'), [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[styles.container, layout.isTablet && styles.containerTablet]}
        refreshControl={
          <RefreshControl refreshing={walletLoading} onRefresh={refresh} tintColor={colors.accent} />
        }
        scrollEnabled={!tourVisible}
      >
        <View style={styles.header}>
          <View>
            {walletLoading
              ? <Skeleton width={160} height={22} style={{ marginBottom: 6 }} />
              : <Text style={[styles.greeting, { color: colors.text }]}>Olá, {userName} 👋</Text>
            }
            <Text style={[styles.subGreeting, { color: colors.textSecondary }]}>Bem-vindo de volta</Text>
          </View>
          <View style={styles.headerActions}>
            <IconButton icon="help-circle-outline" iconColor={colors.textSecondary} size={22} onPress={startTour} />
            <IconButton icon={isDark ? 'weather-sunny' : 'weather-night'} iconColor={colors.textSecondary} size={22} onPress={toggleTheme} />
            <IconButton icon="logout" iconColor={colors.textSecondary} size={22} onPress={handleSignOut} />
          </View>
        </View>

        <CopilotStep
          text="Preço atual do Bitcoin atualizado automaticamente."
          order={1}
          name="btcPrice"
        >
          <WalkthroughableView collapsable={false} style={styles.btcPriceCard}>
            <Text style={styles.btcPriceLabel}>Preço do Bitcoin</Text>
            {priceLoading
              ? <Skeleton width={180} height={36} borderRadius={8} style={{ marginTop: 6, backgroundColor: 'rgba(255,255,255,0.3)' }} />
              : <Text style={styles.btcPriceValue}>{price}</Text>
            }
            <Text style={styles.btcPriceTicker}>BTC / BRL</Text>
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          text="Seus saldos em Reais e Bitcoin. Você começa com R$ 10.000 disponíveis para investir. Toque em qualquer cartão para ir à tela de negociação."
          order={2}
          name="wallet"
        >
          <WalkthroughableView collapsable={false}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Sua carteira</Text>
          </WalkthroughableView>
        </CopilotStep>

        <View style={styles.balanceRow}>
          <Pressable
            style={({ pressed }) => [styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleNavigateTrade}
          >
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Reais</Text>
            {walletLoading
              ? <Skeleton width={100} height={22} style={{ marginBottom: 4 }} />
              : <Text style={[styles.balanceValue, { color: colors.text }]}>{balanceBrl}</Text>
            }
            <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}>BRL</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleNavigateTrade}
          >
            <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Bitcoin</Text>
            {walletLoading
              ? <Skeleton width={100} height={22} style={{ marginBottom: 4 }} />
              : <Text style={[styles.balanceValue, { color: colors.text }]}>{balanceBtc}</Text>
            }
            <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}>BTC</Text>
          </Pressable>
        </View>

        <CopilotStep
          text="Compre Bitcoin com seus Reais ou venda seu Bitcoin. O preço é convertido automaticamente pelo valor atual do mercado."
          order={3}
          name="trade"
        >
          <WalkthroughableView collapsable={false} style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              style={({ pressed }) => [styles.actionButtonInner, { opacity: pressed ? 0.7 : 1 }]}
              onPress={handleNavigateTrade}
            >
              <IconButton icon="trending-up" size={28} iconColor="#fff" style={[styles.actionIcon, { backgroundColor: colors.accent }]} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Comprar / Vender</Text>
            </Pressable>
          </WalkthroughableView>
        </CopilotStep>

        <CopilotStep
          text="Acompanhe todas as suas compras e vendas de Bitcoin. Filtre por tipo para encontrar uma transação específica."
          order={4}
          name="history"
        >
          <WalkthroughableView collapsable={false} style={[styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Pressable
              style={({ pressed }) => [styles.actionButtonInner, { opacity: pressed ? 0.7 : 1 }]}
              onPress={handleNavigateHistory}
            >
              <IconButton icon="history" size={28} iconColor={colors.accent} style={[styles.actionIcon, { backgroundColor: colors.card2 }]} />
              <Text style={[styles.actionLabel, { color: colors.text }]}>Histórico</Text>
            </Pressable>
          </WalkthroughableView>
        </CopilotStep>

      </ScrollView>

      <Snackbar
        visible={toastVisible}
        onDismiss={dismissToast}
        duration={3500}
        style={{ backgroundColor: colors.card2 }}
      >
        <Text style={{ color: colors.text }}>O tour funciona apenas no modo claro.</Text>
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: scale(20), flexGrow: 1 },
  containerTablet: { maxWidth: 680, alignSelf: 'center' as const, width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: verticalScale(24) },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: ms(22), fontWeight: '700' },
  subGreeting: { fontSize: ms(13), marginTop: 2 },
  btcPriceCard: { backgroundColor: '#F7931A', borderRadius: ms(16), padding: scale(24), marginBottom: verticalScale(24), alignItems: 'center' },
  btcPriceLabel: { fontSize: ms(13), color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  btcPriceValue: { fontSize: ms(34), fontWeight: '800', color: '#fff', marginTop: verticalScale(6) },
  btcPriceTicker: { fontSize: ms(13), color: 'rgba(255,255,255,0.6)', marginTop: verticalScale(4) },
  sectionTitle: { fontSize: ms(12), fontWeight: '700', marginBottom: verticalScale(12), letterSpacing: 0.8, textTransform: 'uppercase' },
  balanceRow: { flexDirection: 'row', gap: scale(12), marginBottom: verticalScale(28) },
  balanceCard: { flex: 1, borderRadius: ms(16), padding: scale(20), borderWidth: 1 },
  balanceLabel: { fontSize: ms(12), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: verticalScale(8) },
  balanceValue: { fontSize: ms(18), fontWeight: '700', marginBottom: verticalScale(4) },
  balanceCurrency: { fontSize: ms(12) },
  actionButton: { borderRadius: ms(16), borderWidth: 1, marginBottom: verticalScale(12) },
  actionButtonInner: { alignItems: 'center', paddingVertical: verticalScale(16) },
  actionIcon: { margin: 0, marginBottom: verticalScale(8) },
  actionLabel: { fontSize: ms(13), fontWeight: '600', textAlign: 'center' },
});
