import { View, StyleSheet } from 'react-native';
import { Colors, Rounded, Spacing } from '../../constants/colors';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'sage' | 'green' | 'dark';
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ children, variant = 'default', padding = 'lg' }: CardProps) {
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

  return (
    <View
      style={[
        styles.card,
        getVariantStyles(),
        { padding: getPaddingStyles() },
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Rounded.xl,
  },
});
