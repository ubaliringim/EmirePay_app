import { View, StyleSheet } from 'react-native';
import { Colors, Rounded, Spacing, Shadows } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'sage' | 'green' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'none' | 'card' | 'lift';
}

export function Card({
  children,
  variant = 'default',
  padding = 'lg',
  shadow = 'card',
}: CardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'sage':
        return { backgroundColor: Colors.canvasSoft };
      case 'green':
        return { backgroundColor: Colors.primaryPale };
      case 'dark':
        return { backgroundColor: Colors.ink };
      default:
        return { backgroundColor: Colors.canvas };
    }
  };

  const getPaddingStyles = () => {
    switch (padding) {
      case 'sm':
        return Spacing.md;
      case 'lg':
        return Spacing['2xl'];
      default:
        return Spacing.xl;
    }
  };

  const getShadow = () => {
    switch (shadow) {
      case 'lift':
        return Shadows.lift;
      case 'none':
        return null;
      default:
        return Shadows.card;
    }
  };

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        { padding: getPaddingStyles() },
        getShadow(),
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Rounded['2xl'],
  },
});
