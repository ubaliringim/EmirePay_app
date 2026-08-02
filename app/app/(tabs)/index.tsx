import { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { WalletBalanceCard, QuickServicesGrid, RecentTransactions, FundWalletSheet } from '../../components/dashboard';
import { Colors, Spacing } from '../../constants/colors';

export default function DashboardScreen() {
  const [showFundWallet, setShowFundWallet] = useState(false);
  const router = useRouter();

  const handleServicePress = (serviceId: string) => {
    router.push(`/purchase?service=${serviceId}`);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <WalletBalanceCard onFundWallet={() => setShowFundWallet(true)} />

          <QuickServicesGrid onServicePress={handleServicePress} />

          <RecentTransactions
            onViewAll={() => router.push('/transactions')}
            onTransactionPress={(id) => {}}
          />
        </View>

        <FundWalletSheet visible={showFundWallet} onClose={() => setShowFundWallet(false)} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
});
