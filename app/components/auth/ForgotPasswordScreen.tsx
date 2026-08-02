import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Mail, Key, CheckCircle } from 'lucide-react-native';
import { Button, Input } from '../ui';
import { Colors, Spacing, Rounded } from '../../constants/colors';
import { AuthCard } from './AuthCard';
import { firebaseAuth } from '../../services/firebase';

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

type Step = 'email' | 'otp' | 'reset' | 'success';

const STEP_META: Record<Exclude<Step, 'success'>, { icon: any; eyebrow: string }> = {
  email: { icon: Mail, eyebrow: 'Password' },
  otp: { icon: Key, eyebrow: 'Verify' },
  reset: { icon: Key, eyebrow: 'Reset' },
};

export function ForgotPasswordScreen({ onBack }: ForgotPasswordScreenProps) {
  const insets = useSafeAreaInsets();
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
    try {
      switch (step) {
        case 'email':
          if (validateEmail()) {
            await firebaseAuth.resetPassword(email);
            setStep('success');
          }
          break;
        case 'otp':
          if (validateOTP()) setStep('reset');
          break;
        case 'reset':
          if (validatePassword()) setStep('success');
          break;
      }
    } catch {
      setErrors({
        email: 'Could not send reset email. Check the address and try again.',
      });
    } finally {
      setIsLoading(false);
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
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
          </>
        );
      case 'otp':
        return (
          <>
            <Text style={styles.hint}>
              We sent a 6-digit code to {email}
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
        return null;
    }
  };

  const getTitle = () => {
    switch (step) {
      case 'email': return 'Forgot Password?';
      case 'otp': return 'Enter OTP';
      case 'reset': return 'Reset Password';
      case 'success': return 'Password Reset!';
    }
  };

  const getSubtitle = () => {
    switch (step) {
      case 'email':
        return "Enter your email address and we'll send you a code to reset your password.";
      case 'otp':
        return 'Enter the code we sent to your email.';
      case 'reset':
        return 'Create a new password for your account.';
      case 'success':
        return 'Your password has been successfully reset. You can now log in with your new password.';
    }
  };

  if (step === 'success') {
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
            contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing['3xl'] }]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <AuthCard eyebrow="Done" title={getTitle()} subtitle={getSubtitle()}>
              <View style={styles.successIcon}>
                <CheckCircle size={40} color={Colors.ink} />
              </View>
              <Button title="Back to Login" onPress={onBack} fullWidth />
            </AuthCard>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    );
  }

  const meta = STEP_META[step];

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
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing['3xl'] }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ArrowLeft size={22} color={Colors.ink} />
          </TouchableOpacity>

          <AuthCard eyebrow={meta.eyebrow} title={getTitle()} subtitle={getSubtitle()}>
            <View style={styles.stepIcon}>
              <meta.icon size={32} color={Colors.ink} />
            </View>
            {renderContent()}
            <Button
              title={step === 'reset' ? 'Reset Password' : 'Continue'}
              onPress={handleNext}
              fullWidth
              loading={isLoading}
            />
          </AuthCard>
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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['3xl'],
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.canvas,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    alignSelf: 'flex-start',
  },
  stepIcon: {
    width: 64,
    height: 64,
    borderRadius: Rounded.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  hint: {
    fontSize: 14,
    color: Colors.body,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  successIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
});
