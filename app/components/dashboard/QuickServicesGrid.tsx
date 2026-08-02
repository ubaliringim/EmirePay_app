import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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

interface QuickServicesGridProps {
  onServicePress: (serviceId: string) => void;
}

export function QuickServicesGrid({ onServicePress }: QuickServicesGridProps) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Services</Text>
      <View style={styles.grid}>
        {services.map((service) => {
          const IconComponent = ICON_MAP[service.icon];
          return (
            <TouchableOpacity
              key={service.id}
              style={styles.serviceItem}
              onPress={() => onServicePress(service.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, { backgroundColor: service.color + '20' }]}>
                <IconComponent size={24} color={service.color} />
              </View>
              <Text style={styles.serviceName} numberOfLines={1}>
                {service.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.ink,
    marginBottom: Spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -Spacing.xs,
  },
  serviceItem: {
    width: '33.333%',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: Rounded.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  serviceName: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.ink,
    textAlign: 'center',
  },
});
