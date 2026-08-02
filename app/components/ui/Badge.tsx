import { View, Text, StyleSheet } from 'react-native';
import { Colors, Rounded, Spacing } from '../../constants/colors';

interface BadgeProps {
  text: string;
  variant?: 'positive' | 'negative' | 'warning' | 'neutral';
}

export function Badge({ text, variant = 'neutral' }: BadgeProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'positive':
        return { backgroundColor: Colors.primaryPale, textColor: Colors.positiveDeep };
      case 'negative':
        return { backgroundColor: Colors.negativeBg, textColor: Colors.canvas };
      case 'warning':
        return { backgroundColor: Colors.warning, textColor: Colors.warningContent };
      default:
        return { backgroundColor: Colors.canvasSoft, textColor: Colors.body };
    }
  };

  const styles = getVariantStyles();

  return (
    <View style={[badgeStyles.badge, { backgroundColor: styles.backgroundColor }]}>
      <Text style={[badgeStyles.text, { color: styles.textColor }]}>{text}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: Rounded.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
