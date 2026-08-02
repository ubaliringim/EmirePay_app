import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Smartphone, Wifi, Zap, Tv, GraduationCap, Wallet, Filter, Calendar } from 'lucide-react-native';
import { Card, Badge, BottomSheet } from '../ui';
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

export function TransactionList() {
  const { transactions } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Successful': return 'positive';
      case 'Failed': return 'negative';
      default: return 'warning';
    }
  };

  const filteredTransactions = transactions.filter(t => {
    if (selectedType && t.type !== selectedType) return false;
    if (selectedStatus && t.status !== selectedStatus) return false;
    return true;
  });

  const renderTransaction = ({ item }: { item: typeof transactions[0] }) => {
    const IconComponent = ICON_MAP[item.type] || Wallet;
    const isCredit = item.type === 'Wallet Funding';

    return (
      <TouchableOpacity style={styles.transactionItem} activeOpacity={0.7}>
        <View style={styles.transactionIcon}>
          <IconComponent size={20} color={Colors.ink} />
        </View>
        <View style={styles.transactionInfo}>
          <Text style={styles.transactionType}>{item.type}</Text>
          <Text style={styles.transactionDate}>{formatDate(item.date)}</Text>
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
        <Text style={styles.title}>Transactions</Text>
        <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Filter size={20} color={Colors.ink} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.secondary]} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No transactions found</Text>
          </View>
        }
      />

      <BottomSheet visible={showFilters} onClose={() => setShowFilters(false)} title="Filter Transactions">
        <View style={styles.filterContent}>
          <Text style={styles.filterLabel}>Transaction Type</Text>
          <View style={styles.filterOptions}>
            {['Airtime', 'Data', 'Electricity', 'Cable TV', 'Education PIN', 'Wallet Funding'].map(type => (
              <TouchableOpacity
                key={type}
                style={[styles.filterOption, selectedType === type && styles.filterOptionActive]}
                onPress={() => setSelectedType(selectedType === type ? null : type)}
              >
                <Text style={[styles.filterOptionText, selectedType === type && styles.filterOptionTextActive]}>
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.filterLabel}>Status</Text>
          <View style={styles.filterOptions}>
            {['Successful', 'Pending', 'Failed'].map(status => (
              <TouchableOpacity
                key={status}
                style={[styles.filterOption, selectedStatus === status && styles.filterOptionActive]}
                onPress={() => setSelectedStatus(selectedStatus === status ? null : status)}
              >
                <Text style={[styles.filterOptionText, selectedStatus === status && styles.filterOptionTextActive]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              setSelectedType(null);
              setSelectedStatus(null);
            }}
          >
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.canvas,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.ink,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.canvasSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.canvas,
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginBottom: Spacing.md,
  },
  transactionIcon: {
    width: 44,
    height: 44,
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
  transactionDate: {
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
    marginBottom: Spacing.xs,
  },
  creditAmount: {
    color: Colors.positive,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyText: {
    fontSize: 16,
    color: Colors.mute,
  },
  filterContent: {
    padding: Spacing.xl,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  filterOption: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.canvasSoft,
    borderRadius: Rounded.pill,
  },
  filterOptionActive: {
    backgroundColor: Colors.secondary,
  },
  filterOptionText: {
    fontSize: 14,
    color: Colors.ink,
  },
  filterOptionTextActive: {
    color: Colors.canvas,
    fontWeight: '600',
  },
  clearButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
