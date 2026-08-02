import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ServiceSelector, PurchaseForm } from '../../components/purchase';
import { Colors, Spacing } from '../../constants/colors';

export default function PurchaseScreen() {
  const params = useLocalSearchParams<{ service?: string }>();
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(params.service || null);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {!selectedService ? (
          <ServiceSelector
            selectedService={selectedService}
            onServiceSelect={setSelectedService}
          />
        ) : (
          <PurchaseForm
            serviceType={selectedService}
            onComplete={() => router.back()}
          />
        )}
      </View>
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
});
