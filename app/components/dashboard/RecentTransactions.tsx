import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Smartphone, Wifi, Zap, Tv, GraduationCap, Wallet, ChevronRight } from 'lucide-react-native';
import { Card, Badge } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { formatCurrency, formatDate } from '../../data/mockData';

const ICON_MAP: Record<string, any> = {
  Airtime: Smartphone,
  Data: Wifi,
  Electricity: Zap,
  'Cable TV': Tv,
  'Education PIN': GraduationCap,
  'Wallet Funding': Wallet,
};

interface RecentTransactionsProps {
  onViewAll: () => void;
  onTransactionPress: (transactionId: string) => void;
}

export function RecentTransactions({ onViewAll, onTransactionPress }: RecentTransactionsProps) {
  const { transactions } = useUserStore();
  const recentTransactions = transactions.slice(0, 5);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Successful':
        return 'positive';
      case 'Failed':
        return 'negative';
      default:
        return 'warning';
    }
  };

  const renderTransaction = ({ item }: { item: typeof recentTransactions[0] }) => {
    const IconComponent = ICON_MAP[item.type] || Wallet;
    const isCredit = item.type === 'Wallet Funding';

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => onTransactionPress(item.id)}
        activeOpacity={0.7}
      >
        <View style={styles.transactionIcon}>
          <IconComponent size={20} color={Colors.ink} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.transactionRecipient} numberOfLines={1}>
            {item.recipient}
          </Text>
        </View>
        <View style={styles.transactionRight}>
          <Text style={[styles.transactionAmount, isCredit && styles.creditAmount]}>
            {isCredit ? '+' : '-'}{formatCurrency(item.amount)}
          </Text>
          <Badge text={item.status} variant={getStatusVariant(item.status) as any} />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color={Colors.secondary} />
        </TouchableOpacity>
      </View>
      <Card padding="sm">
        <FlatList
          data={recentTransactions}
          renderItem={renderTransaction}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: Rounded.md,
    backgroundColor: Colors.canvasSoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionType: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: Spacing.xxs,
  },
  transactionRecipient: {
    fontSize: 12,
    color: Colors.mute,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: Spacing.xxs,
  },
  creditAmount: {
    color: Colors.positive,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.canvasSoft,
  },
});
