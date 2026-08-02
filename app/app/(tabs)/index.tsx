import { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { WalletBalanceCard, QuickServicesGrid, RecentTransactions, FundWalletSheet } from '../../components/dashboard';
import { Colors, Spacing, Rounded } from '../../constants/colors';

export default function DashboardScreen() {
  const [showFundWallet, setShowFundWallet] = useState(false);
  const router = useRouter();

  const handleServicePress = (serviceId: string) => {
    router.push(`/purchase?service=${serviceId}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <WalletBalanceCard />

        <TouchableOpacity
          style={styles.fundButtonWrapper}
          onPress={() => setShowFundWallet(true)}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[Colors.secondary, Colors.inkDeep]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fundButton}
          >
            <View style={styles.fundIcon}>
              <Plus size={20} color={Colors.primary} />
            </View>
            <View style={styles.fundTextContainer}>
              <Text style={styles.fundTitle}>Fund Wallet</Text>
              <Text style={styles.fundSubtitle}>Top up instantly via transfer or card</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <QuickServicesGrid onServicePress={handleServicePress} />

        <RecentTransactions
          onViewAll={() => router.push('/transactions')}
          onTransactionPress={(id) => {}}
        />
      </View>

      <FundWalletSheet visible={showFundWallet} onClose={() => setShowFundWallet(false)} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.canvasSoft,
  },
  content: {
    padding: Spacing.lg,
  },
  fundButtonWrapper: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
    borderRadius: Rounded.xl,
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  fundButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  fundIcon: {
    width: 44,
    height: 44,
    borderRadius: Rounded.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  fundTextContainer: {
    flex: 1,
  },
  fundTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.canvas,
    marginBottom: Spacing.xxs,
  },
  fundSubtitle: {
    fontSize: 13,
    color: Colors.primaryNeutral,
  },
});
