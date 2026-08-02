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
        return { backgroundColor: Colors.primary, textColor: Colors.ink };
      case 'negative':
        return { backgroundColor: Colors.negative + '1f', textColor: Colors.negative };
      case 'warning':
        return { backgroundColor: Colors.warning + '4d', textColor: Colors.ink };
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
    paddingVertical: Spacing.xxs,
    borderRadius: Rounded.pill,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
