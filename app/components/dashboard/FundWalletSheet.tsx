import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Landmark, CreditCard, Copy, Check } from 'lucide-react-native';
import * as Clipboard from 'expo-clipboard';
import { Button, Input, BottomSheet } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../data/mockData';

interface FundWalletSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Method = 'transfer' | 'paystack';
type Step = 'form' | 'processing' | 'success';

export function FundWalletSheet({ visible, onClose }: FundWalletSheetProps) {
  const [method, setMethod] = useState<Method>('transfer');
  const [step, setStep] = useState<Step>('form');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const { user, updateBalance, addTransaction } = useUserStore();

  const handleCopy = async () => {
    if (user?.virtualAccountNumber) {
      await Clipboard.setStringAsync(user.virtualAccountNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFundWithPaystack = async () => {
    if (!amount || parseFloat(amount) < 100) return;

    setStep('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));

    const fundAmount = parseFloat(amount);
    updateBalance(fundAmount, 'add');
    addTransaction({
      id: `TXN${Date.now()}`,
      type: 'Wallet Funding',
      amount: fundAmount,
      status: 'Successful',
      date: new Date().toISOString(),
      recipient: 'Paystack',
      reference: `REF${Date.now()}`,
    });

    setStep('success');
  };

  const handleClose = () => {
    setStep('form');
    setAmount('');
    setMethod('transfer');
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'form':
        return (
          <>
            <View style={styles.segmented}>
              <TouchableOpacity
                style={[styles.segment, method === 'transfer' && styles.segmentActive]}
                onPress={() => setMethod('transfer')}
              >
                <Landmark size={16} color={method === 'transfer' ? Colors.ink : Colors.body} />
                <Text style={[styles.segmentText, method === 'transfer' && styles.segmentTextActive]}>
                  Bank transfer
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segment, method === 'paystack' && styles.segmentActive]}
                onPress={() => setMethod('paystack')}
              >
                <CreditCard size={16} color={method === 'paystack' ? Colors.ink : Colors.body} />
                <Text style={[styles.segmentText, method === 'paystack' && styles.segmentTextActive]}>
                  Paystack
                </Text>
              </TouchableOpacity>
            </View>

            {method === 'transfer' ? (
              <>
                <Text style={styles.note}>
                  Transfer any amount to your dedicated Emir Pay account. Funds reflect in seconds.
                </Text>
                <View style={styles.accountCard}>
                  <View style={styles.accountHeader}>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountLabel}>Account Number</Text>
                      <Text style={styles.accountValue}>{user?.virtualAccountNumber}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.copyButton}
                      onPress={handleCopy}
                    >
                      {copied ? (
                        <Check size={14} color={Colors.positive} />
                      ) : (
                        <Copy size={14} color={Colors.ink} />
                      )}
                      <Text style={styles.copyText}>{copied ? 'Copied' : 'Copy'}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.divider} />
                  <View style={styles.accountRow}>
                    <Text style={styles.accountRowLabel}>Bank</Text>
                    <Text style={styles.accountRowValue}>{user?.virtualAccountBank}</Text>
                  </View>
                  <View style={styles.accountRow}>
                    <Text style={styles.accountRowLabel}>Account Name</Text>
                    <Text style={styles.accountRowValue}>{user?.fullName}</Text>
                  </View>
                </View>
                <Button title="Done" onPress={handleClose} fullWidth />
              </>
            ) : (
              <>
                <Input
                  label="Amount to Fund"
                  placeholder="5000"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
                <View style={styles.presets}>
                  {[1000, 2000, 5000, 10000].map((preset) => (
                    <TouchableOpacity
                      key={preset}
                      style={[styles.presetButton, amount === String(preset) && styles.presetActive]}
                      onPress={() => setAmount(preset.toString())}
                    >
                      <Text style={[styles.presetText, amount === String(preset) && styles.presetTextActive]}>
                        {formatCurrency(preset)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.minNote}>Minimum ₦100. Card is charged securely by Paystack.</Text>
                <Button
                  title="Pay Now"
                  onPress={handleFundWithPaystack}
                  fullWidth
                  disabled={!amount || parseFloat(amount) < 100}
                />
              </>
            )}
          </>
        );

      case 'processing':
        return (
          <View style={styles.processingContainer}>
            <Text style={styles.title}>Processing Payment...</Text>
            <Text style={styles.subtitle}>Please wait</Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.successContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successCheck}>✓</Text>
            </View>
            <Text style={styles.title}>Funding Successful!</Text>
            <Text style={styles.subtitle}>
              Your wallet has been credited with {formatCurrency(parseFloat(amount))}
            </Text>
            <Button title="Done" onPress={handleClose} fullWidth />
          </View>
        );
    }
  };

  return (
    <BottomSheet visible={visible} onClose={handleClose} title="Fund your wallet">
      <View style={styles.content}>{renderContent()}</View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: Spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.48,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.body,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  segmented: {
    flexDirection: 'row',
    backgroundColor: Colors.canvasSoft,
    borderRadius: Rounded.md,
    padding: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: Rounded.sm,
  },
  segmentActive: {
    backgroundColor: Colors.canvas,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.body,
  },
  segmentTextActive: {
    color: Colors.ink,
  },
  note: {
    fontSize: 14,
    color: Colors.body,
    marginBottom: Spacing.lg,
    lineHeight: 20,
  },
  accountCard: {
    backgroundColor: Colors.canvasSoft,
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginBottom: Spacing.xl,
  },
  accountHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accountInfo: {
    flex: 1,
  },
  accountLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.mute,
    marginBottom: Spacing.xs,
  },
  accountValue: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.4,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Rounded.md,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.canvas,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  accountRowLabel: {
    fontSize: 14,
    color: Colors.body,
  },
  accountRowValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  presetButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Rounded.pill,
  },
  presetActive: {
    borderColor: Colors.ink,
    backgroundColor: Colors.primary,
  },
  presetText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.ink,
  },
  presetTextActive: {
    color: Colors.ink,
  },
  minNote: {
    fontSize: 12,
    color: Colors.mute,
    marginBottom: Spacing.xl,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  successCheck: {
    fontSize: 36,
    color: Colors.ink,
    fontWeight: '700',
  },
});
