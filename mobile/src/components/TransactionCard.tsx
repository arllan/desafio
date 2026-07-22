import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import type { FormattedTransaction } from '../types';
import { useAppTheme } from '../contexts/ThemeContext';

interface Props {
  item: FormattedTransaction;
}

function TransactionCard({ item }: Props) {
  const { colors } = useAppTheme();
  const isBuy = item.type === 'buy';

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.left}>
        <View style={[styles.iconBox, { backgroundColor: isBuy ? `${colors.error}20` : `${colors.success}20` }]}>
          <Text style={styles.icon}>{isBuy ? '↑' : '↓'}</Text>
        </View>
        <View>
          <Text style={[styles.typeLabel, { color: colors.text }]}>{item.typeLabel}</Text>
          <Text style={[styles.date, { color: colors.textSecondary }]}>{item.date}</Text>
        </View>
      </View>

      <View style={styles.right}>
        <Text style={[styles.amountBrl, { color: isBuy ? colors.error : colors.success }]}>
          {isBuy ? `- ${item.amountBrl}` : `+ ${item.amountBrl}`}
        </Text>
        <Text style={[styles.amountBtc, { color: colors.textSecondary }]}>{item.amountBtc}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  date: {
    fontSize: 12,
    marginTop: 2,
  },
  right: {
    alignItems: 'flex-end',
  },
  amountBrl: {
    fontSize: 16,
    fontWeight: '700',
  },
  amountBtc: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default memo(TransactionCard);
