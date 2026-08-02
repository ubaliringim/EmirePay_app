import { View, Text, StyleSheet } from 'react-native';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { Colors, Rounded, Spacing } from '../../constants/colors';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning';
}

export function Toast({ message, type = 'success' }: ToastProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} color={Colors.positive} />;
      case 'error':
        return <XCircle size={20} color={Colors.negative} />;
      case 'warning':
        return <AlertCircle size={20} color={Colors.warningDeep} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return Colors.primaryPale;
      case 'error':
        return Colors.negativeBg;
      case 'warning':
        return Colors.warning;
    }
  };

  return (
    <View style={[styles.toast, { backgroundColor: getBackgroundColor() }]}>
      {getIcon()}
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Rounded.xl,
    marginHorizontal: Spacing.lg,
    gap: Spacing.sm,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: Colors.ink,
  },
});
