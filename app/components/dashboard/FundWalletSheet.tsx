import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Building2, CreditCard } from 'lucide-react-native';
import { Button, Input, BottomSheet } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { formatCurrency } from '../../data/mockData';

interface FundWalletSheetProps {
  visible: boolean;
  onClose: () => void;
}

type Step = 'options' | 'transfer' | 'paystack' | 'processing' | 'success';

export function FundWalletSheet({ visible, onClose }: FundWalletSheetProps) {
  const [step, setStep] = useState<Step>('options');
  const [amount, setAmount] = useState('');
  const { user, updateBalance, addTransaction } = useUserStore();

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
    setStep('options');
    setAmount('');
    onClose();
  };

  const renderContent = () => {
    switch (step) {
      case 'options':
        return (
          <>
            <Text style={styles.title}>Fund Wallet</Text>
            <Text style={styles.subtitle}>Choose a funding method</Text>
            
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setStep('transfer')}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.primaryPale }]}>
                <Building2 size={24} color={Colors.secondary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Bank Transfer</Text>
                <Text style={styles.optionDesc}>Transfer to your virtual account</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => setStep('paystack')}
            >
              <View style={[styles.optionIcon, { backgroundColor: Colors.primaryPale }]}>
                <CreditCard size={24} color={Colors.secondary} />
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>Pay with Paystack</Text>
                <Text style={styles.optionDesc}>Card or bank transfer</Text>
              </View>
            </TouchableOpacity>
          </>
        );

      case 'transfer':
        return (
          <>
            <Text style={styles.title}>Bank Transfer</Text>
            <Text style={styles.subtitle}>Transfer to this account</Text>
            
            <View style={styles.accountCard}>
              <Text style={styles.accountLabel}>Account Number</Text>
              <Text style={styles.accountValue}>{user?.virtualAccountNumber}</Text>
              
              <Text style={[styles.accountLabel, { marginTop: Spacing.md }]}>Bank Name</Text>
              <Text style={styles.accountValue}>{user?.virtualAccountBank}</Text>
              
              <Text style={[styles.accountLabel, { marginTop: Spacing.md }]}>Account Name</Text>
              <Text style={styles.accountValue}>{user?.fullName}</Text>
            </View>
            
            <Text style={styles.note}>
              Your wallet will be credited automatically after successful transfer.
            </Text>
            
            <Button title="Done" onPress={handleClose} fullWidth />
          </>
        );

      case 'paystack':
        return (
          <>
            <Text style={styles.title}>Pay with Paystack</Text>
            <Text style={styles.subtitle}>Enter amount to fund</Text>
            
            <Input
              label="Amount (₦)"
              placeholder="Minimum ₦100"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            
            <View style={styles.presets}>
              {[500, 1000, 2000, 5000].map((preset) => (
                <TouchableOpacity
                  key={preset}
                  style={styles.presetButton}
                  onPress={() => setAmount(preset.toString())}
                >
                  <Text style={styles.presetText}>{formatCurrency(preset)}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              title="Pay Now"
              onPress={handleFundWithPaystack}
              fullWidth
              disabled={!amount || parseFloat(amount) < 100}
            />
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
              <Text style={styles.successEmoji}>✓</Text>
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
    <BottomSheet visible={visible} onClose={handleClose}>
      <View style={styles.content}>
        {renderContent()}
      </View>
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
    color: Colors.ink,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.body,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.canvasSoft,
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginBottom: Spacing.md,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: Rounded.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: Spacing.xxs,
  },
  optionDesc: {
    fontSize: 14,
    color: Colors.mute,
  },
  accountCard: {
    backgroundColor: Colors.canvasSoft,
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginBottom: Spacing.lg,
  },
  accountLabel: {
    fontSize: 12,
    color: Colors.mute,
    marginBottom: Spacing.xxs,
  },
  accountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
  },
  note: {
    fontSize: 12,
    color: Colors.mute,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 18,
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  presetButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.canvasSoft,
    borderRadius: Rounded.md,
  },
  presetText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
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
    backgroundColor: Colors.primaryPale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  successEmoji: {
    fontSize: 36,
    color: Colors.positive,
    fontWeight: '700',
  },
});
