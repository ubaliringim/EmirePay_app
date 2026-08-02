import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Copy, Check } from 'lucide-react-native';
import { Card } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../data/mockData';

export function WalletBalanceCard() {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <Card variant="dark" padding="lg">
      <View style={styles.header}>
        <Text style={styles.label}>Wallet Balance</Text>
        <TouchableOpacity
          onPress={() => setShowBalance(!showBalance)}
          style={styles.eyeButton}
        >
          {showBalance ? (
            <Eye size={20} color={Colors.primary} />
          ) : (
            <EyeOff size={20} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.balance}>
        {showBalance ? formatCurrency(user.walletBalance) : '₦••••••'}
      </Text>

      <View style={styles.accountContainer}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Virtual Account</Text>
          <Text style={styles.accountNumber}>
            {user.virtualAccountNumber} • {user.virtualAccountBank}
          </Text>
        </View>
        <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
          {copied ? (
            <Check size={16} color={Colors.primary} />
          ) : (
            <Copy size={16} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  balance: {
    fontSize: 36,
    fontWeight: '900',
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  accountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: Spacing.md,
    borderRadius: Rounded.md,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 12,
    color: Colors.primaryNeutral,
    marginBottom: Spacing.xxs,
  },
  accountNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.canvas,
  },
  copyButton: {
    padding: Spacing.sm,
  },
});
