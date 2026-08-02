import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import type { ReactNode } from 'react';
import { Colors, Rounded, Spacing, Shadows } from '../../constants/colors';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'dark' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return { backgroundColor: Colors.primary };
      case 'secondary':
        return { backgroundColor: Colors.secondary };
      case 'dark':
        return { backgroundColor: Colors.ink };
      case 'outline':
        return { backgroundColor: Colors.canvas, borderWidth: 1, borderColor: Colors.ink };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'danger':
        return { backgroundColor: Colors.negative };
      default:
        return { backgroundColor: Colors.primary };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'ghost':
        return Colors.ink;
      case 'secondary':
      case 'danger':
        return Colors.canvas;
      case 'dark':
        return Colors.primary;
      case 'outline':
        return Colors.ink;
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
        (variant === 'primary' || variant === 'dark') && Shadows.card,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, { color: getTextColor() }]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Rounded.lg,
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
