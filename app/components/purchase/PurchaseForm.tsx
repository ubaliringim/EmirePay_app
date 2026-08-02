import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import { Button, Input, Card, BottomSheet } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { NETWORK_PROVIDERS, DATA_PLANS, ELECTRICITY_DISCOS, CABLE_PROVIDERS, CABLE_PACKAGES, EXAM_BODIES } from '../../constants/services';
import { formatCurrency } from '../../data/mockData';
import { useUserStore } from '../../store/userStore';

interface PurchaseFormProps {
  serviceType: string;
  onComplete: () => void;
}

export function PurchaseForm({ serviceType, onComplete }: PurchaseFormProps) {
  const { user, updateBalance, addTransaction } = useUserStore();
  const [step, setStep] = useState<'form' | 'review' | 'processing' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: '',
    dataPlan: '',
    disco: '',
    meterNumber: '',
    meterType: 'prepaid',
    cableProvider: '',
    smartCardNumber: '',
    cablePackage: '',
    examBody: '',
    quantity: '1',
  });

  const [showPicker, setShowPicker] = useState<string | null>(null);

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setShowPicker(null);
  };

  const validateForm = () => {
    switch (serviceType) {
      case 'airtime':
        return formData.network && formData.phone && formData.amount;
      case 'data':
        return formData.network && formData.phone && formData.dataPlan;
      case 'electricity':
        return formData.disco && formData.meterNumber && formData.meterType && formData.amount;
      case 'cable':
        return formData.cableProvider && formData.smartCardNumber && formData.cablePackage;
      case 'airtimeToCash':
        return formData.network && formData.phone && formData.amount;
      case 'education':
        return formData.examBody && formData.quantity;
      default:
        return false;
    }
  };

  const getAmount = () => {
    switch (serviceType) {
      case 'data':
        const plan = DATA_PLANS.find(p => p.id === formData.dataPlan);
        return plan?.price || 0;
      case 'cable':
        const packages = CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES] || [];
        const pkg = packages.find(p => p.id === formData.cablePackage);
        return pkg?.price || 0;
      case 'education':
        const exam = EXAM_BODIES.find(e => e.id === formData.examBody);
        return (exam?.price || 0) * parseInt(formData.quantity || '1');
      default:
        return parseFloat(formData.amount) || 0;
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep('review');
    }
  };

  const handleConfirm = async () => {
    const amount = getAmount();
    
    if (amount > (user?.walletBalance || 0)) {
      Alert.alert('Insufficient Balance', 'Please fund your wallet to complete this transaction.');
      return;
    }

    setIsLoading(true);
    setStep('processing');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    updateBalance(amount, 'subtract');
    addTransaction({
      id: `TXN${Date.now()}`,
      type: getServiceName(),
      amount: amount,
      status: 'Successful',
      date: new Date().toISOString(),
      recipient: formData.phone || formData.meterNumber || formData.smartCardNumber || 'N/A',
      reference: `REF${Date.now()}`,
    });
    
    setIsLoading(false);
    setStep('success');
  };

  const getServiceName = () => {
    switch (serviceType) {
      case 'airtime': return 'Airtime';
      case 'data': return 'Data';
      case 'electricity': return 'Electricity';
      case 'cable': return 'Cable TV';
      case 'airtimeToCash': return 'Airtime to Cash';
      case 'education': return 'Education PIN';
      default: return 'Purchase';
    }
  };

  const renderFormFields = () => {
    switch (serviceType) {
      case 'airtime':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('network')}>
              <Text style={styles.selectLabel}>Network Provider</Text>
              <View style={styles.selectValue}>
                <Text style={formData.network ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.network ? NETWORK_PROVIDERS.find(n => n.id === formData.network)?.name : 'Select network'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Phone Number"
              placeholder="e.g. 08012345678"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
            <Input
              label="Amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(v) => updateForm('amount', v)}
              keyboardType="numeric"
            />
            <View style={styles.presets}>
              {[100, 200, 500, 1000].map(amt => (
                <TouchableOpacity
                  key={amt}
                  style={styles.presetButton}
                  onPress={() => updateForm('amount', amt.toString())}
                >
                  <Text style={styles.presetText}>₦{amt}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        );

      case 'data':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('network')}>
              <Text style={styles.selectLabel}>Network Provider</Text>
              <View style={styles.selectValue}>
                <Text style={formData.network ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.network ? NETWORK_PROVIDERS.find(n => n.id === formData.network)?.name : 'Select network'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Phone Number"
              placeholder="e.g. 08012345678"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('dataPlan')}>
              <Text style={styles.selectLabel}>Data Plan</Text>
              <View style={styles.selectValue}>
                <Text style={formData.dataPlan ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.dataPlan ? DATA_PLANS.find(p => p.id === formData.dataPlan)?.size : 'Select plan'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
          </>
        );

      case 'electricity':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('disco')}>
              <Text style={styles.selectLabel}>Electricity Disco</Text>
              <View style={styles.selectValue}>
                <Text style={formData.disco ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.disco ? ELECTRICITY_DISCOS.find(d => d.id === formData.disco)?.name : 'Select disco'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Meter Number"
              placeholder="Enter meter number"
              value={formData.meterNumber}
              onChangeText={(v) => updateForm('meterNumber', v)}
              keyboardType="numeric"
            />
            <View style={styles.meterTypeContainer}>
              <TouchableOpacity
                style={[styles.meterTypeButton, formData.meterType === 'prepaid' && styles.meterTypeActive]}
                onPress={() => updateForm('meterType', 'prepaid')}
              >
                <Text style={[styles.meterTypeText, formData.meterType === 'prepaid' && styles.meterTypeTextActive]}>
                  Prepaid
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.meterTypeButton, formData.meterType === 'postpaid' && styles.meterTypeActive]}
                onPress={() => updateForm('meterType', 'postpaid')}
              >
                <Text style={[styles.meterTypeText, formData.meterType === 'postpaid' && styles.meterTypeTextActive]}>
                  Postpaid
                </Text>
              </TouchableOpacity>
            </View>
            <Input
              label="Amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(v) => updateForm('amount', v)}
              keyboardType="numeric"
            />
          </>
        );

      case 'cable':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('cableProvider')}>
              <Text style={styles.selectLabel}>Cable Provider</Text>
              <View style={styles.selectValue}>
                <Text style={formData.cableProvider ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.cableProvider ? CABLE_PROVIDERS.find(c => c.id === formData.cableProvider)?.name : 'Select provider'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Smart Card/IUC Number"
              placeholder="Enter smart card number"
              value={formData.smartCardNumber}
              onChangeText={(v) => updateForm('smartCardNumber', v)}
              keyboardType="numeric"
            />
            {formData.cableProvider && (
              <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('cablePackage')}>
                <Text style={styles.selectLabel}>Package</Text>
                <View style={styles.selectValue}>
                  <Text style={formData.cablePackage ? styles.selectValueText : styles.selectPlaceholder}>
                    {formData.cablePackage 
                      ? CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES]?.find(p => p.id === formData.cablePackage)?.name 
                      : 'Select package'}
                  </Text>
                  <ChevronDown size={20} color={Colors.mute} />
                </View>
              </TouchableOpacity>
            )}
          </>
        );

      case 'airtimeToCash':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('network')}>
              <Text style={styles.selectLabel}>Network Provider</Text>
              <View style={styles.selectValue}>
                <Text style={formData.network ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.network ? NETWORK_PROVIDERS.find(n => n.id === formData.network)?.name : 'Select network'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Amount"
              placeholder="Enter amount"
              value={formData.amount}
              onChangeText={(v) => updateForm('amount', v)}
              keyboardType="numeric"
            />
            <Input
              label="Phone Number"
              placeholder="Enter phone number"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
          </>
        );

      case 'education':
        return (
          <>
            <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker('examBody')}>
              <Text style={styles.selectLabel}>Exam Body</Text>
              <View style={styles.selectValue}>
                <Text style={formData.examBody ? styles.selectValueText : styles.selectPlaceholder}>
                  {formData.examBody ? EXAM_BODIES.find(e => e.id === formData.examBody)?.name : 'Select exam body'}
                </Text>
                <ChevronDown size={20} color={Colors.mute} />
              </View>
            </TouchableOpacity>
            <Input
              label="Quantity"
              placeholder="Enter quantity"
              value={formData.quantity}
              onChangeText={(v) => updateForm('quantity', v)}
              keyboardType="numeric"
            />
            {formData.examBody && (
              <Card variant="green" padding="md">
                <Text style={styles.priceLabel}>Price per PIN</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(EXAM_BODIES.find(e => e.id === formData.examBody)?.price || 0)}
                </Text>
              </Card>
            )}
          </>
        );
    }
  };

  const renderPicker = () => {
    let items: { id: string; name: string; subtitle?: string }[] = [];

    switch (showPicker) {
      case 'network':
        items = NETWORK_PROVIDERS;
        break;
      case 'dataPlan':
        items = DATA_PLANS.map(p => ({ id: p.id, name: `${p.size} - ${p.duration}`, subtitle: formatCurrency(p.price) }));
        break;
      case 'disco':
        items = ELECTRICITY_DISCOS;
        break;
      case 'cableProvider':
        items = CABLE_PROVIDERS;
        break;
      case 'cablePackage':
        const packages = CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES] || [];
        items = packages.map(p => ({ id: p.id, name: p.name, subtitle: formatCurrency(p.price) }));
        break;
      case 'examBody':
        items = EXAM_BODIES.map(e => ({ id: e.id, name: e.name, subtitle: formatCurrency(e.price) }));
        break;
    }

    return (
      <BottomSheet
        visible={!!showPicker}
        onClose={() => setShowPicker(null)}
        title="Select Option"
      >
        <ScrollView style={styles.pickerList}>
          {items.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.pickerItem}
              onPress={() => updateForm(showPicker!, item.id)}
            >
              <View style={styles.pickerItemContent}>
                <Text style={styles.pickerItemName}>{item.name}</Text>
                {item.subtitle && <Text style={styles.pickerItemSubtitle}>{item.subtitle}</Text>}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BottomSheet>
    );
  };

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIcon}>
          <Check size={48} color={Colors.positive} />
        </View>
        <Text style={styles.successTitle}>Transaction Successful!</Text>
        <Text style={styles.successSubtitle}>
          Your {getServiceName().toLowerCase()} purchase was successful
        </Text>
        <View style={styles.receiptCard}>
          <Text style={styles.receiptLabel}>Amount</Text>
          <Text style={styles.receiptValue}>{formatCurrency(getAmount())}</Text>
        </View>
        <View style={styles.successActions}>
          <Button title="Go to Dashboard" onPress={onComplete} fullWidth />
          <Button title="Make Another Purchase" variant="tertiary" onPress={() => setStep('form')} fullWidth />
        </View>
      </View>
    );
  }

  if (step === 'processing') {
    return (
      <View style={styles.processingContainer}>
        <Text style={styles.processingText}>Processing transaction...</Text>
      </View>
    );
  }

  if (step === 'review') {
    return (
      <View style={styles.reviewContainer}>
        <Text style={styles.reviewTitle}>Review Transaction</Text>
        
        <Card variant="sage" padding="lg">
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Service</Text>
            <Text style={styles.reviewValue}>{getServiceName()}</Text>
          </View>
          <View style={styles.reviewRow}>
            <Text style={styles.reviewLabel}>Amount</Text>
            <Text style={styles.reviewValue}>{formatCurrency(getAmount())}</Text>
          </View>
          {formData.phone && (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Phone</Text>
              <Text style={styles.reviewValue}>{formData.phone}</Text>
            </View>
          )}
          {formData.meterNumber && (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Meter</Text>
              <Text style={styles.reviewValue}>{formData.meterNumber}</Text>
            </View>
          )}
          {formData.smartCardNumber && (
            <View style={styles.reviewRow}>
              <Text style={styles.reviewLabel}>Smart Card</Text>
              <Text style={styles.reviewValue}>{formData.smartCardNumber}</Text>
            </View>
          )}
        </Card>

        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Wallet Balance</Text>
          <Text style={styles.balanceValue}>{formatCurrency(user?.walletBalance || 0)}</Text>
        </View>

        <Button
          title="Confirm & Pay"
          onPress={handleConfirm}
          fullWidth
          loading={isLoading}
        />
        <Button title="Back" variant="tertiary" onPress={() => setStep('form')} fullWidth />
      </View>
    );
  }

  return (
    <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.formTitle}>{getServiceName()}</Text>
      {renderFormFields()}
      {renderPicker()}
      <Button
        title="Continue"
        onPress={handleContinue}
        fullWidth
        disabled={!validateForm()}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.ink,
    marginBottom: Spacing.xl,
  },
  selectField: {
    marginBottom: Spacing.lg,
  },
  selectLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  selectValue: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: Colors.ink,
    borderRadius: Rounded.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  selectValueText: {
    fontSize: 16,
    color: Colors.ink,
  },
  selectPlaceholder: {
    fontSize: 16,
    color: Colors.mute,
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
  meterTypeContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  meterTypeButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Colors.canvasSoft,
    borderRadius: Rounded.md,
  },
  meterTypeActive: {
    backgroundColor: Colors.secondary,
  },
  meterTypeText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  meterTypeTextActive: {
    color: Colors.canvas,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.body,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    color: Colors.ink,
  },
  pickerList: {
    maxHeight: 400,
  },
  pickerItem: {
    padding: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.canvasSoft,
  },
  pickerItemContent: {
    flex: 1,
  },
  pickerItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.ink,
  },
  pickerItemSubtitle: {
    fontSize: 14,
    color: Colors.mute,
    marginTop: Spacing.xxs,
  },
  reviewContainer: {
    flex: 1,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.ink,
    marginBottom: Spacing.xl,
  },
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  reviewLabel: {
    fontSize: 14,
    color: Colors.body,
  },
  reviewValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
  },
  balanceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryPale,
    padding: Spacing.lg,
    borderRadius: Rounded.lg,
    marginBottom: Spacing.xl,
  },
  balanceLabel: {
    fontSize: 14,
    color: Colors.body,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: '900',
    color: Colors.secondary,
  },
  processingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  processingText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.ink,
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryPale,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.ink,
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    fontSize: 14,
    color: Colors.body,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  receiptCard: {
    width: '100%',
    backgroundColor: Colors.canvasSoft,
    padding: Spacing.lg,
    borderRadius: Rounded.lg,
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  receiptLabel: {
    fontSize: 12,
    color: Colors.mute,
    marginBottom: Spacing.xs,
  },
  receiptValue: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.ink,
  },
  successActions: {
    width: '100%',
    gap: Spacing.md,
  },
});
