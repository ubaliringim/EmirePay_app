import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { ChevronDown, Check, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react-native';
import { Button, Input, Card, BottomSheet } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { NETWORK_PROVIDERS, DATA_PLANS, ELECTRICITY_DISCOS, CABLE_PROVIDERS, CABLE_PACKAGES, EXAM_BODIES } from '../../constants/services';
import { formatCurrency, formatDate } from '../../data/mockData';
import { useUserStore } from '../../store/userStore';

interface PurchaseFormProps {
  serviceType: string;
  onComplete: () => void;
}

const TITLES: Record<string, string> = {
  airtime: 'Buy Airtime',
  data: 'Buy Data',
  electricity: 'Pay Electricity Bill',
  cable: 'Renew Cable TV',
  airtimeToCash: 'Convert Airtime to Cash',
  education: 'Buy Educational PIN',
};

const PAYOUT_OPTIONS = [
  { id: 'zenith', name: 'Zenith Bank •••• 7741' },
  { id: 'gtbank', name: 'GTBank •••• 2093' },
  { id: 'wallet', name: 'Emir Pay Wallet' },
];

const providerName = (id: string) => NETWORK_PROVIDERS.find((n) => n.id === id)?.name || '';
const discoName = (id: string) => ELECTRICITY_DISCOS.find((d) => d.id === id)?.name || '';
const cableName = (id: string) => CABLE_PROVIDERS.find((c) => c.id === id)?.name || '';
const examName = (id: string) => EXAM_BODIES.find((e) => e.id === id)?.name || '';

export function PurchaseForm({ serviceType, onComplete }: PurchaseFormProps) {
  const { user, updateBalance, addTransaction } = useUserStore();
  const [step, setStep] = useState<'form' | 'review' | 'processing' | 'done'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    network: '',
    phone: '',
    amount: '',
    dataPlan: '',
    disco: '',
    meterNumber: '',
    meterType: '',
    cableProvider: '',
    smartCardNumber: '',
    cablePackage: '',
    examBody: '',
    quantity: '1',
    email: '',
    payout: '',
  });

  const [showPicker, setShowPicker] = useState<string | null>(null);

  const updateForm = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setShowPicker(null);
    setError(null);
  };

  const requiredFields = (): { name: string; label: string }[] => {
    switch (serviceType) {
      case 'airtime':
        return [
          { name: 'network', label: 'network provider' },
          { name: 'phone', label: 'phone number' },
          { name: 'amount', label: 'amount' },
        ];
      case 'data':
        return [
          { name: 'network', label: 'network provider' },
          { name: 'phone', label: 'phone number' },
          { name: 'dataPlan', label: 'data plan' },
        ];
      case 'electricity':
        return [
          { name: 'disco', label: 'distribution company' },
          { name: 'meterNumber', label: 'meter number' },
          { name: 'meterType', label: 'meter type' },
          { name: 'amount', label: 'amount' },
        ];
      case 'cable':
        return [
          { name: 'cableProvider', label: 'provider' },
          { name: 'smartCardNumber', label: 'smartcard / IUC number' },
          { name: 'cablePackage', label: 'bouquet' },
        ];
      case 'airtimeToCash':
        return [
          { name: 'network', label: 'network' },
          { name: 'phone', label: 'airtime sender line' },
          { name: 'amount', label: 'airtime value' },
          { name: 'payout', label: 'payout account' },
        ];
      case 'education':
        return [
          { name: 'examBody', label: 'exam body' },
          { name: 'email', label: 'delivery email' },
        ];
      default:
        return [];
    }
  };

  const validateForm = (): string | null => {
    for (const f of requiredFields()) {
      if (!formData[f.name as keyof typeof formData]) {
        return `Please provide ${f.label}.`;
      }
    }
    if (getAmount() <= 0) return 'Enter a valid amount.';
    return null;
  };

  const getAmount = () => {
    switch (serviceType) {
      case 'data': {
        const plan = DATA_PLANS.find((p) => p.id === formData.dataPlan);
        return plan?.price || 0;
      }
      case 'cable': {
        const packages = CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES] || [];
        const pkg = packages.find((p) => p.id === formData.cablePackage);
        return pkg?.price || 0;
      }
      case 'education': {
        const exam = EXAM_BODIES.find((e) => e.id === formData.examBody);
        return (exam?.price || 0) * Math.max(1, parseInt(formData.quantity || '1'));
      }
      default:
        return parseFloat(formData.amount) || 0;
    }
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

  const getSummary = () => {
    switch (serviceType) {
      case 'airtime':
        return `${providerName(formData.network)} Airtime Top-up`;
      case 'data': {
        const plan = DATA_PLANS.find((p) => p.id === formData.dataPlan);
        return `${providerName(formData.network)} ${plan?.size || ''} · ${plan?.duration || ''}`;
      }
      case 'electricity':
        return `${discoName(formData.disco)} · ${formData.meterType === 'postpaid' ? 'Postpaid' : 'Prepaid'}`;
      case 'cable': {
        const packages = CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES] || [];
        const pkg = packages.find((p) => p.id === formData.cablePackage);
        return `${cableName(formData.cableProvider)} ${pkg?.name || ''} renewal`;
      }
      case 'airtimeToCash':
        return `${providerName(formData.network)} airtime converted`;
      case 'education':
        return `${examName(formData.examBody)} ×${formData.quantity || 1}`;
      default:
        return getServiceName();
    }
  };

  const getReviewItems = (): { label: string; value: string }[] => {
    switch (serviceType) {
      case 'airtime':
        return [
          { label: 'Network provider', value: providerName(formData.network) },
          { label: 'Phone number', value: formData.phone },
          { label: 'Amount', value: formatCurrency(getAmount()) },
        ];
      case 'data':
        return [
          { label: 'Network provider', value: providerName(formData.network) },
          { label: 'Phone number', value: formData.phone },
          { label: 'Data plan', value: formData.dataPlan ? `${DATA_PLANS.find((p) => p.id === formData.dataPlan)?.size} · ${DATA_PLANS.find((p) => p.id === formData.dataPlan)?.duration}` : '—' },
        ];
      case 'electricity':
        return [
          { label: 'Distribution company', value: discoName(formData.disco) },
          { label: 'Meter number', value: formData.meterNumber },
          { label: 'Meter type', value: formData.meterType === 'postpaid' ? 'Postpaid' : 'Prepaid' },
          { label: 'Amount', value: formatCurrency(getAmount()) },
        ];
      case 'cable':
        return [
          { label: 'Provider', value: cableName(formData.cableProvider) },
          { label: 'Smartcard / IUC number', value: formData.smartCardNumber },
          { label: 'Bouquet', value: formData.cablePackage ? CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES]?.find((p) => p.id === formData.cablePackage)?.name || '' : '—' },
        ];
      case 'airtimeToCash':
        return [
          { label: 'Network', value: providerName(formData.network) },
          { label: 'Airtime sender line', value: formData.phone },
          { label: 'Airtime value', value: formatCurrency(getAmount()) },
          { label: 'Payout account', value: PAYOUT_OPTIONS.find((p) => p.id === formData.payout)?.name || '—' },
        ];
      case 'education':
        return [
          { label: 'Exam body', value: examName(formData.examBody) },
          { label: 'Quantity', value: formData.quantity || '1' },
          { label: 'Delivery email', value: formData.email },
        ];
      default:
        return [];
    }
  };

  const handleContinue = () => {
    const err = validateForm();
    setError(err);
    if (!err) setStep('review');
  };

  const handleConfirm = async () => {
    const amount = getAmount();

    if (amount > (user?.walletBalance || 0)) {
      setError('Insufficient wallet balance. Fund your wallet to complete this payment.');
      setStep('form');
      return;
    }

    setIsLoading(true);
    setStep('processing');

    await new Promise((resolve) => setTimeout(resolve, 2000));

    updateBalance(amount, 'subtract');
    addTransaction({
      id: `TXN${Date.now()}`,
      type: getServiceName(),
      amount: amount,
      status: 'Successful',
      date: new Date().toISOString(),
      recipient: formData.phone || formData.meterNumber || formData.smartCardNumber || formData.email || formData.payout || '—',
      reference: `REF${Date.now()}`,
    });

    setIsLoading(false);
    setStep('done');
  };

  const renderSelectField = (label: string, pickerKey: string, value: string, placeholder: string) => (
    <TouchableOpacity style={styles.selectField} onPress={() => setShowPicker(pickerKey)}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.selectValue}>
        <Text style={value ? styles.selectValueText : styles.selectPlaceholder}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.mute} />
      </View>
    </TouchableOpacity>
  );

  const renderNetworkField = (label: string) => (
    <View style={styles.selectField}>
      <Text style={styles.selectLabel}>{label}</Text>
      <View style={styles.networkRow}>
        {NETWORK_PROVIDERS.map((network) => {
          const active = formData.network === network.id;
          return (
            <TouchableOpacity
              key={network.id}
              style={[styles.networkTile, active && styles.networkTileActive]}
              onPress={() => updateForm('network', network.id)}
              activeOpacity={0.8}
            >
              {network.logo ? (
                <Image source={network.logo} style={styles.networkLogo} resizeMode="contain" />
              ) : (
                <Text style={styles.networkFallback}>{network.name.charAt(0)}</Text>
              )}
              <Text style={[styles.networkName, active && styles.networkNameActive]}>
                {network.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderAmountField = (label: string, presets: number[]) => (
    <>
      <Input
        label={label}
        placeholder="1000"
        value={formData.amount}
        onChangeText={(v) => updateForm('amount', v)}
        keyboardType="numeric"
      />
      <View style={styles.presets}>
        {presets.map((amt) => {
          const active = formData.amount === String(amt);
          return (
            <TouchableOpacity
              key={amt}
              style={[styles.presetButton, active && styles.presetActive]}
              onPress={() => updateForm('amount', amt.toString())}
            >
              <Text style={[styles.presetText, active && styles.presetTextActive]}>
                {formatCurrency(amt)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );

  const renderFormFields = () => {
    switch (serviceType) {
      case 'airtime':
        return (
          <>
            {renderNetworkField('Network provider')}
            <Input
              label="Phone number"
              placeholder="0803 000 0000"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
            {renderAmountField('Amount', [100, 200, 500, 1000, 2000, 5000])}
          </>
        );

      case 'data':
        return (
          <>
            {renderNetworkField('Network provider')}
            <Input
              label="Phone number"
              placeholder="0803 000 0000"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
            {renderSelectField('Data plan', 'dataPlan', formData.dataPlan ? `${DATA_PLANS.find((p) => p.id === formData.dataPlan)?.size} · ${DATA_PLANS.find((p) => p.id === formData.dataPlan)?.duration}` : '', 'Select data plan')}
          </>
        );

      case 'electricity':
        return (
          <>
            {renderSelectField('Distribution company', 'disco', discoName(formData.disco), 'Select distribution company')}
            <Input
              label="Meter number"
              placeholder="45012299871"
              value={formData.meterNumber}
              onChangeText={(v) => updateForm('meterNumber', v)}
              keyboardType="numeric"
            />
            {renderSelectField('Meter type', 'meterType', formData.meterType ? (formData.meterType === 'postpaid' ? 'Postpaid' : 'Prepaid') : '', 'Select meter type')}
            {renderAmountField('Amount', [1000, 2000, 5000, 10000])}
          </>
        );

      case 'cable':
        return (
          <>
            {renderSelectField('Provider', 'cableProvider', cableName(formData.cableProvider), 'Select provider')}
            <Input
              label="Smartcard / IUC number"
              placeholder="7012994412"
              value={formData.smartCardNumber}
              onChangeText={(v) => updateForm('smartCardNumber', v)}
              keyboardType="numeric"
            />
            {renderSelectField(
              'Bouquet',
              'cablePackage',
              formData.cablePackage
                ? CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES]?.find((p) => p.id === formData.cablePackage)?.name || ''
                : '',
              'Select bouquet'
            )}
          </>
        );

      case 'airtimeToCash':
        return (
          <>
            {renderNetworkField('Network')}
            <Input
              label="Airtime sender line"
              placeholder="0803 000 0000"
              value={formData.phone}
              onChangeText={(v) => updateForm('phone', v)}
              keyboardType="phone-pad"
            />
            {renderAmountField('Airtime value', [1000, 2000, 5000, 10000])}
            {renderSelectField('Payout account', 'payout', PAYOUT_OPTIONS.find((p) => p.id === formData.payout)?.name || '', 'Select payout account')}
          </>
        );

      case 'education':
        return (
          <>
            {renderSelectField('Exam body', 'examBody', examName(formData.examBody), 'Select exam body')}
            <Text style={styles.selectLabel}>Quantity</Text>
            <View style={styles.stepper}>
              <TouchableOpacity
                style={styles.stepperButton}
                onPress={() => updateForm('quantity', String(Math.max(1, (parseInt(formData.quantity) || 1) - 1)))}
              >
                <Text style={styles.stepperButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.stepperValue}>{formData.quantity || '1'}</Text>
              <TouchableOpacity
                style={[styles.stepperButton, styles.stepperButtonActive]}
                onPress={() => updateForm('quantity', String((parseInt(formData.quantity) || 1) + 1))}
              >
                <Text style={styles.stepperButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Input
              label="Delivery email"
              placeholder="you@example.com"
              value={formData.email}
              onChangeText={(v) => updateForm('email', v)}
              keyboardType="email-address"
            />
            {formData.examBody && (
              <Card variant="sage" padding="md" shadow="none">
                <Text style={styles.priceLabel}>Price per PIN</Text>
                <Text style={styles.priceValue}>
                  {formatCurrency(EXAM_BODIES.find((e) => e.id === formData.examBody)?.price || 0)}
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
        items = DATA_PLANS.map((p) => ({ id: p.id, name: `${p.size} · ${p.duration}`, subtitle: formatCurrency(p.price) }));
        break;
      case 'disco':
        items = ELECTRICITY_DISCOS;
        break;
      case 'meterType':
        items = [
          { id: 'prepaid', name: 'Prepaid' },
          { id: 'postpaid', name: 'Postpaid' },
        ];
        break;
      case 'cableProvider':
        items = CABLE_PROVIDERS;
        break;
      case 'cablePackage':
        items = (CABLE_PACKAGES[formData.cableProvider as keyof typeof CABLE_PACKAGES] || []).map((p) => ({
          id: p.id,
          name: p.name,
          subtitle: formatCurrency(p.price),
        }));
        break;
      case 'examBody':
        items = EXAM_BODIES.map((e) => ({ id: e.id, name: e.name, subtitle: formatCurrency(e.price) }));
        break;
      case 'payout':
        items = PAYOUT_OPTIONS;
        break;
    }

    return (
      <BottomSheet
        visible={!!showPicker}
        onClose={() => setShowPicker(null)}
        title="Select Option"
      >
        <ScrollView style={styles.pickerList}>
          {items.map((item) => (
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

  const renderError = () =>
    error ? (
      <View style={styles.errorBox}>
        <AlertCircle size={16} color={Colors.negative} style={{ marginTop: 2 }} />
        <View style={styles.errorContent}>
          <Text style={styles.errorText}>{error}</Text>
          {getAmount() > (user?.walletBalance || 0) && (
            <TouchableOpacity onPress={onComplete}>
              <Text style={styles.errorLink}>Go to dashboard to fund wallet</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ) : null;

  if (step === 'done') {
    const receipt = {
      id: `TXN${Date.now()}`,
      reference: `REF${Date.now()}`,
    };
    return (
      <Card padding="lg">
        <View style={styles.doneHero}>
          <View style={styles.doneIcon}>
            <Check size={28} color={Colors.ink} />
          </View>
          <Text style={styles.doneTitle}>Payment successful</Text>
          <Text style={styles.doneSubtitle}>{getSummary()}</Text>
        </View>
        <View style={styles.receiptList}>
          <DetailRow label="Transaction ID" value={receipt.id} />
          <DetailRow label="Reference" value={receipt.reference} />
          <DetailRow label="Service" value={getServiceName()} />
          <DetailRow label="Recipient" value={formData.phone || formData.meterNumber || formData.smartCardNumber || formData.email || formData.payout || '—'} />
          <DetailRow label="Amount" value={formatCurrency(getAmount())} />
          <DetailRow label="Fee" value={formatCurrency(0)} />
          <DetailRow label="Date" value={formatDate(new Date().toISOString())} />
          <DetailRow label="Status" value="Successful" />
        </View>
        <View style={styles.doneActions}>
          <Button title="Go to Dashboard" variant="outline" onPress={onComplete} fullWidth />
          <Button
            title="Make Another Purchase"
            onPress={() => {
              setFormData({
                network: '', phone: '', amount: '', dataPlan: '', disco: '', meterNumber: '',
                meterType: '', cableProvider: '', smartCardNumber: '', cablePackage: '',
                examBody: '', quantity: '1', email: '', payout: '',
              });
              setError(null);
              setStep('form');
            }}
            fullWidth
          />
        </View>
      </Card>
    );
  }

  if (step === 'processing') {
    return (
      <Card padding="lg">
        <View style={styles.processingContainer}>
          <Loader2 size={36} color={Colors.secondary} style={styles.spinner} />
          <Text style={styles.processingTitle}>Processing your payment…</Text>
          <Text style={styles.processingSubtitle}>Please don&apos;t close this page.</Text>
        </View>
      </Card>
    );
  }

  if (step === 'review') {
    return (
      <Card padding="lg">
        <Text style={styles.cardTitle}>Review & confirm</Text>
        <View style={styles.reviewList}>
          <DetailRow label="Service" value={getServiceName()} />
          {getReviewItems().map((item) => (
            <DetailRow key={item.label} label={item.label} value={item.value} />
          ))}
          <DetailRow label="Fee" value={formatCurrency(0)} />
        </View>
        <View style={styles.totalBar}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(getAmount())}</Text>
        </View>
        <View style={styles.reviewActions}>
          <Button
            title="Edit details"
            variant="outline"
            onPress={() => setStep('form')}
            fullWidth
            icon={<ArrowLeft size={16} color={Colors.ink} />}
          />
          <Button title="Confirm & Pay" onPress={handleConfirm} fullWidth loading={isLoading} />
        </View>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <Text style={styles.cardTitle}>{TITLES[serviceType] || getServiceName()}</Text>
      {renderFormFields()}
      {renderError()}
      {renderPicker()}
      <Button
        title="Review payment"
        onPress={handleContinue}
        fullWidth
        disabled={validateForm() !== null}
      />
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue} numberOfLines={1}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.32,
    marginBottom: Spacing.lg,
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
    borderColor: Colors.border,
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
  networkRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  networkTile: {
    flexGrow: 1,
    flexBasis: '22%',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Rounded.lg,
    backgroundColor: Colors.canvas,
  },
  networkTileActive: {
    borderColor: Colors.ink,
    backgroundColor: Colors.primary,
  },
  networkLogo: {
    width: 44,
    height: 28,
  },
  networkFallback: {
    width: 44,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '800',
    color: Colors.ink,
  },
  networkName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.body,
    textAlign: 'center',
  },
  networkNameActive: {
    color: Colors.ink,
    fontWeight: '700',
  },
  presets: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
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
    fontWeight: '700',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Rounded.lg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: Rounded.sm,
    backgroundColor: Colors.canvasSoft,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepperButtonActive: {
    backgroundColor: Colors.primary,
  },
  stepperButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    lineHeight: 22,
  },
  stepperValue: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.ink,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.body,
  },
  priceValue: {
    fontSize: 20,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    backgroundColor: Colors.negative + '1a',
    borderRadius: Rounded.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorContent: {
    flex: 1,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.negative,
  },
  errorLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.negative,
    textDecorationLine: 'underline',
    marginTop: Spacing.xs,
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
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.canvasSoft,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.body,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.ink,
    flex: 1,
    textAlign: 'right',
    marginLeft: Spacing.lg,
  },
  totalBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.canvasSoft,
    borderRadius: Rounded['2xl'],
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.body,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.4,
  },
  reviewList: {
    marginTop: Spacing.xs,
  },
  reviewActions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
  processingContainer: {
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  spinner: {
    marginBottom: Spacing.lg,
  },
  processingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: Spacing.xs,
  },
  processingSubtitle: {
    fontSize: 14,
    color: Colors.body,
  },
  doneHero: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  doneIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.48,
    marginBottom: Spacing.xs,
  },
  doneSubtitle: {
    fontSize: 14,
    color: Colors.body,
  },
  receiptList: {
    marginTop: Spacing.sm,
  },
  doneActions: {
    gap: Spacing.md,
    marginTop: Spacing.lg,
  },
});
