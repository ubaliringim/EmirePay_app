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

interface ServiceSelectorProps {
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
}

export function ServiceSelector({ selectedService, onServiceSelect }: ServiceSelectorProps) {
  const services = Object.values(SERVICE_TYPES);

  return (
    <Card padding="lg">
      <Text style={styles.title}>Choose a Service</Text>
      <View style={styles.grid}>
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
              <IconComponent size={20} color={isSelected ? Colors.ink : service.color} />
              <Text
                style={[styles.serviceName, isSelected && styles.serviceNameSelected]}
                numberOfLines={2}
              >
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
  title: {
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
    gap: Spacing.sm,
  },
  serviceCard: {
    width: '30.9%',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Rounded.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.canvas,
  },
  serviceCardSelected: {
    borderColor: Colors.ink,
    backgroundColor: Colors.primary,
  },
  serviceName: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.body,
    textAlign: 'center',
    lineHeight: 15,
  },
  serviceNameSelected: {
    color: Colors.ink,
    fontWeight: '700',
  },
});
