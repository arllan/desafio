import { useCallback } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { layout } from '../theme/layout';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../contexts/AuthContext';
import { useAppTheme } from '../contexts/ThemeContext';
import { useWallet } from '../hooks/useWallet';
import { useMarketPrice } from '../hooks/useMarketPrice';
import { Skeleton, SkeletonCard } from '../components/Skeleton';

type Props = NativeStackScreenProps<AppStackParamList, 'Dashboard'>;

export default function DashboardScreen({ navigation }: Props) {
  const { signOut } = useAuth();
  const { colors, isDark, toggleTheme } = useAppTheme();
  const { balanceBrl, balanceBtc, userName, loading: walletLoading, refresh } = useWallet();
  const { price, loading: priceLoading } = useMarketPrice();

  const handleSignOut = useCallback(() => signOut(), [signOut]);
  const handleNavigateTrade = useCallback(() => navigation.navigate('Trade'), [navigation]);
  const handleNavigateHistory = useCallback(() => navigation.navigate('History'), [navigation]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={[styles.container, layout.isTablet && styles.containerTablet]}
        refreshControl={
          <RefreshControl refreshing={walletLoading} onRefresh={refresh} tintColor={colors.accent} />
        }
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
            <IconButton icon={isDark ? 'weather-sunny' : 'weather-night'} iconColor={colors.textSecondary} size={22} onPress={toggleTheme} />
            <IconButton icon="logout" iconColor={colors.textSecondary} size={22} onPress={handleSignOut} />
          </View>
        </View>

        <View style={styles.btcPriceCard}>
          <Text style={styles.btcPriceLabel}>Preço do Bitcoin</Text>
          {priceLoading
            ? <Skeleton width={180} height={36} borderRadius={8} style={{ marginTop: 6, backgroundColor: 'rgba(255,255,255,0.3)' }} />
            : <Text style={styles.btcPriceValue}>{price}</Text>
          }
          <Text style={styles.btcPriceTicker}>BTC / BRL</Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Sua carteira</Text>

        {walletLoading ? (
          <View style={styles.balanceRow}>
            <SkeletonCard style={{ flex: 1 }} />
            <SkeletonCard style={{ flex: 1 }} />
          </View>
        ) : (
          <View style={styles.balanceRow}>
            <Pressable
              style={({ pressed }) => [styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              onPress={handleNavigateTrade}
            >
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Reais</Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>{balanceBrl}</Text>
              <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}>BRL</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.balanceCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              onPress={handleNavigateTrade}
            >
              <Text style={[styles.balanceLabel, { color: colors.textSecondary }]}>Bitcoin</Text>
              <Text style={[styles.balanceValue, { color: colors.text }]}>{balanceBtc}</Text>
              <Text style={[styles.balanceCurrency, { color: colors.textSecondary }]}>BTC</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleNavigateTrade}
          >
            <IconButton icon="trending-up" size={28} iconColor="#fff" style={[styles.actionIcon, { backgroundColor: colors.accent }]} onPress={handleNavigateTrade} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>Comprar / Vender</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.actionButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
            onPress={handleNavigateHistory}
          >
            <IconButton icon="history" size={28} iconColor={colors.accent} style={[styles.actionIcon, { backgroundColor: colors.card2 }]} onPress={handleNavigateHistory} />
            <Text style={[styles.actionLabel, { color: colors.text }]}>Histórico</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flexGrow: 1 },
  containerTablet: { maxWidth: 680, alignSelf: 'center' as const, width: '100%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  greeting: { fontSize: 22, fontWeight: '700' },
  subGreeting: { fontSize: 13, marginTop: 2 },
  btcPriceCard: { backgroundColor: '#F7931A', borderRadius: 16, padding: 24, marginBottom: 24, alignItems: 'center' },
  btcPriceLabel: { fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: '600', letterSpacing: 0.5, textTransform: 'uppercase' },
  btcPriceValue: { fontSize: 36, fontWeight: '800', color: '#fff', marginTop: 6 },
  btcPriceTicker: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 4 },
  sectionTitle: { fontSize: 12, fontWeight: '700', marginBottom: 12, letterSpacing: 0.8, textTransform: 'uppercase' },
  balanceRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  balanceCard: { flex: 1, borderRadius: 16, padding: 20, borderWidth: 1 },
  balanceLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  balanceValue: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  balanceCurrency: { fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, alignItems: 'center', borderRadius: 16, paddingVertical: 16, borderWidth: 1 },
  actionIcon: { margin: 0, marginBottom: 8 },
  actionLabel: { fontSize: 13, fontWeight: '600', textAlign: 'center' },
});
