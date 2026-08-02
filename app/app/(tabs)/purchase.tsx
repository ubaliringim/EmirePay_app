import { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { ServiceSelector, PurchaseForm } from '../../components/purchase';
import { Colors, Spacing } from '../../constants/colors';

export default function PurchaseScreen() {
  const params = useLocalSearchParams<{ service?: string }>();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      const param = Array.isArray(params.service) ? params.service[0] : params.service;
      setSelectedService((prev) => param ?? prev);
    }, [params.service])
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {!selectedService ? (
            <ServiceSelector
              selectedService={selectedService}
              onServiceSelect={setSelectedService}
            />
          ) : (
            <PurchaseForm
              serviceType={selectedService}
              onComplete={() => router.navigate('/')}
            />
          )}
        </View>
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
  },
});
