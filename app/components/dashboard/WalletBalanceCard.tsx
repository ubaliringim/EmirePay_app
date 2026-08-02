import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Eye, EyeOff, Copy, Check, Plus } from 'lucide-react-native';
import { Card } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../data/mockData';

interface WalletBalanceCardProps {
  onFundWallet: () => void;
}

export function WalletBalanceCard({ onFundWallet }: WalletBalanceCardProps) {
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);
  const { user } = useUserStore();

  const handleCopy = async () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!user) return null;

  return (
    <Card variant="dark" padding="lg" shadow="lift">
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Wallet Balance</Text>
        <TouchableOpacity
          onPress={() => setShowBalance(!showBalance)}
          style={styles.eyeButton}
        >
          {showBalance ? (
            <EyeOff size={18} color={Colors.primary} />
          ) : (
            <Eye size={18} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.balance}>
        {showBalance ? formatCurrency(user.walletBalance) : '₦••••••'}
      </Text>

      <Text style={styles.subtitle}>Available to spend · updated just now</Text>

      <View style={styles.accountContainer}>
        <View style={styles.accountInfo}>
          <Text style={styles.accountLabel}>Your Virtual Account</Text>
          <View style={styles.accountNumberRow}>
            <Text style={styles.accountNumber}>
              {user.virtualAccountNumber}
            </Text>
            <TouchableOpacity style={styles.copyButton} onPress={handleCopy}>
              {copied ? (
                <Check size={15} color={Colors.primary} />
              ) : (
                <Copy size={15} color={Colors.primary} />
              )}
              <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.accountBank}>
            {user.virtualAccountBank} · {user.fullName}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.fundButton} onPress={onFundWallet} activeOpacity={0.85}>
        <Plus size={18} color={Colors.ink} />
        <Text style={styles.fundButtonText}>Fund Wallet</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  balance: {
    fontSize: 40,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.canvas,
    letterSpacing: -1.2,
    lineHeight: 44,
    marginTop: Spacing.sm,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.primaryNeutral,
    marginTop: Spacing.xs,
  },
  accountContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: Spacing.lg,
    borderRadius: Rounded.lg,
    marginTop: Spacing.xl,
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.primaryNeutral,
    marginBottom: Spacing.xs,
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  accountNumber: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.canvas,
    letterSpacing: -0.4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xxs,
    borderRadius: Rounded.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  copyText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryNeutral,
  },
  accountBank: {
    fontSize: 12,
    color: Colors.primaryNeutral,
    marginTop: Spacing.sm,
  },
  fundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.primary,
    borderRadius: Rounded.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.lg,
  },
  fundButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
  },
});
