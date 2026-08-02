import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Smartphone, Wifi, Zap, Tv, Repeat, GraduationCap } from 'lucide-react-native';
import { Card } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { SERVICE_TYPES } from '../../constants/services';

const ICON_MAP: Record<string, any> = {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Repeat,
  GraduationCap,
};

interface QuickServicesGridProps {
  onServicePress: (serviceId: string) => void;
}

export function QuickServicesGrid({ onServicePress }: QuickServicesGridProps) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <Card padding="lg">
      <Text style={styles.sectionTitle}>Services</Text>
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
              <View style={[styles.iconContainer, { backgroundColor: service.bg }]}>
                <IconComponent size={20} color={service.color} />
              </View>
              <Text style={styles.serviceName} numberOfLines={2}>
                {service.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.32,
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
    marginBottom: Spacing.sm,
  },
  iconContainer: {
    width: 44,
    height: 44,
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
    lineHeight: 16,
  },
});
