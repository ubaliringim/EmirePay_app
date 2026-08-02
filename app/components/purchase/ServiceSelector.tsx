import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Smartphone, Wifi, Zap, Tv, Banknote, GraduationCap } from 'lucide-react-native';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { SERVICE_TYPES } from '../../constants/services';

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Banknote,
  GraduationCap,
};

interface ServiceSelectorProps {
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
}

export function ServiceSelector({ selectedService, onServiceSelect }: ServiceSelectorProps) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Service</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.servicesRow}>
          {services.map((service) => {
            const IconComponent = ICON_MAP[service.icon];
            const isSelected = selectedService === service.id;
            
            return (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                onPress={() => onServiceSelect(service.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
                  <IconComponent size={28} color={service.color} />
                </View>
                <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: Spacing.lg,
  },
  servicesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  serviceCard: {
    width: 100,
    alignItems: 'center',
    padding: Spacing.lg,
    backgroundColor: Colors.canvas,
    borderRadius: Rounded.xl,
    borderWidth: 2,
    borderColor: Colors.canvasSoft,
  },
  serviceCardSelected: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.primaryPale,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Rounded.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.ink,
    textAlign: 'center',
  },
  serviceNameSelected: {
    color: Colors.secondary,
  },
});
