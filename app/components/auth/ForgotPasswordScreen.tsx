import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Key, CheckCircle } from 'lucide-react-native';
import { Button, Input } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors({ email: 'Invalid email format' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateOTP = () => {
    if (!otp || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validatePassword = () => {
    const newErrors: Record<string, string> = {};
    if (!newPassword) newErrors.newPassword = 'Password is required';
    else if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);

    switch (step) {
      case 'email':
        if (validateEmail()) setStep('otp');
        break;
      case 'otp':
        if (validateOTP()) setStep('reset');
        break;
      case 'reset':
        if (validatePassword()) setStep('success');
        break;
    }
  };

  const handleBack = () => {
    switch (step) {
      case 'otp':
        setStep('email');
        break;
      case 'reset':
        setStep('otp');
        break;
      default:
        onBack();
    }
  };

  const renderContent = () => {
    switch (step) {
      case 'email':
        return (
          <>
            <View style={styles.iconContainer}>
              <Mail size={32} color={Colors.ink} />
            </View>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you a code to reset your password.
            </Text>
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              error={errors.email}
            />
          </>
        );
      case 'otp':
        return (
          <>
            <View style={styles.iconContainer}>
              <Key size={32} color={Colors.ink} />
            </View>
            <Text style={styles.title}>Enter OTP</Text>
            <Text style={styles.subtitle}>
              We sent a 6-digit code to {email}. Enter it below.
            </Text>
            <Input
              label="OTP Code"
              placeholder="Enter 6-digit code"
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              error={errors.otp}
            />
          </>
        );
      case 'reset':
        return (
          <>
            <View style={styles.iconContainer}>
              <Key size={32} color={Colors.ink} />
            </View>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Create a new password for your account.
            </Text>
            <Input
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              showPasswordToggle
              error={errors.newPassword}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              error={errors.confirmPassword}
            />
          </>
        );
      case 'success':
        return (
          <>
            <View style={[styles.iconContainer, { backgroundColor: Colors.primaryPale }]}>
              <CheckCircle size={32} color={Colors.positive} />
            </View>
            <Text style={styles.title}>Password Reset!</Text>
            <Text style={styles.subtitle}>
              Your password has been successfully reset. You can now log in with your new password.
            </Text>
            <Button title="Back to Login" onPress={onBack} fullWidth />
          </>
        );
    }
  };

  return (
    <LinearGradient
      colors={[Colors.canvasSoft, Colors.primaryPale]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {step !== 'success' && (
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <ArrowLeft size={24} color={Colors.ink} />
            </TouchableOpacity>
          )}

          <View style={styles.form}>
            {renderContent()}
            {step !== 'success' && (
              <Button
                title={step === 'reset' ? 'Reset Password' : 'Continue'}
                onPress={handleNext}
                fullWidth
                loading={isLoading}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing['3xl'],
    paddingBottom: Spacing['2xl'],
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  form: {
    backgroundColor: Colors.canvas,
    borderRadius: Rounded.xl,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.body,
    textAlign: 'center',
    marginBottom: Spacing['2xl'],
    lineHeight: 20,
  },
});
