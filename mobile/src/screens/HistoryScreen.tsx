import { useCallback } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { SegmentedButtons, Text } from 'react-native-paper';
import { Skeleton } from '../components/Skeleton';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParamList } from '../navigation/AppNavigator';
import { useTransactionHistory, type TransactionTypeFilter } from '../hooks/useTransactionHistory';
import TransactionCard from '../components/TransactionCard';
import type { FormattedTransaction } from '../types';
import { useAppTheme } from '../contexts/ThemeContext';

type Props = NativeStackScreenProps<AppStackParamList, 'History'>;

export default function HistoryScreen({ navigation: _navigation }: Props) {
  const { colors } = useAppTheme();
  const { transactions, loading, error, refresh, filters, applyFilters } = useTransactionHistory();

  const handleTypeChange = useCallback((value: string) => {
    applyFilters({ ...filters, type: value as TransactionTypeFilter });
  }, [filters, applyFilters]);

  if (loading && transactions.length === 0) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.bg }]}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }} edges={['bottom']}>

      <View style={[styles.filterBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <SegmentedButtons
          value={filters.type}
          onValueChange={handleTypeChange}
          buttons={[
            {
              value: 'all',
              label: 'Todos',
              style: filters.type === 'all' ? { backgroundColor: colors.accent } : { backgroundColor: 'transparent' },
              labelStyle: { color: filters.type === 'all' ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: 13 },
            },
            {
              value: 'buy',
              label: 'Compras',
              style: filters.type === 'buy' ? { backgroundColor: colors.buy } : { backgroundColor: 'transparent' },
              labelStyle: { color: filters.type === 'buy' ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: 13 },
            },
            {
              value: 'sell',
              label: 'Vendas',
              style: filters.type === 'sell' ? { backgroundColor: colors.sell } : { backgroundColor: 'transparent' },
              labelStyle: { color: filters.type === 'sell' ? '#fff' : colors.textSecondary, fontWeight: '700', fontSize: 13 },
            },
          ]}
          style={{ backgroundColor: colors.card2, borderRadius: 10 }}
        />
      </View>

      {error !== null && (
        <View style={[styles.errorBox, { borderColor: colors.error, backgroundColor: `${colors.error}20` }]}>
          <Text style={{ color: colors.error, textAlign: 'center', fontSize: 13, fontWeight: '600' }}>{error}</Text>
        </View>
      )}

      {loading && transactions.length > 0 && (
        <View style={[styles.loadingOverlay, { backgroundColor: `${colors.bg}BB` }]}>
          <ActivityIndicator size="large" color={colors.accent} />
        </View>
      )}

      <FlatList<FormattedTransaction>
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <TransactionCard item={item} />}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={refresh} tintColor={colors.accent} />
        }
        ListEmptyComponent={
          loading ? (
            <View style={styles.skeletonList}>
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} width="100%" height={76} borderRadius={14} style={{ marginBottom: 10 }} />
              ))}
            </View>
          ) : (
            <View style={[styles.centered, { backgroundColor: colors.bg }]}>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Nenhuma transação</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Nenhum resultado para os filtros aplicados
              </Text>
            </View>
          )
        }
        contentContainerStyle={styles.listContent}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingTop: 60,
  },
  filterBar: {
    padding: 12,
    borderBottomWidth: 1,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonList: {
    padding: 16,
  },
  errorBox: {
    borderBottomWidth: 1,
    padding: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
