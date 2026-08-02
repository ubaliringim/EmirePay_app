import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors, Rounded, Spacing } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: Colors.primary };
      case 'secondary':
        return { backgroundColor: Colors.secondary };
      case 'tertiary':
        return { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.ink };
      case 'danger':
        return { backgroundColor: Colors.negative };
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return Colors.ink;
      case 'secondary':
        return Colors.canvas;
      case 'tertiary':
        return Colors.ink;
      case 'danger':
        return Colors.canvas;
      default:
        return Colors.ink;
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.lg };
      case 'lg':
        return { paddingVertical: Spacing.lg, paddingHorizontal: Spacing['2xl'] };
      default:
        return { paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Rounded.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
});
