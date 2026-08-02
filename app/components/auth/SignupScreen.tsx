import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Input } from '../ui';
import { Colors, Spacing } from '../../constants/colors';
import { useUserStore } from '../../store/userStore';
import { AuthCard } from './AuthCard';

interface SignupScreenProps {
  onNavigateToLogin: () => void;
  onAuthSuccess: () => void;
}

export function SignupScreen({ onNavigateToLogin, onAuthSuccess }: SignupScreenProps) {
  const insets = useSafeAreaInsets();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { signup, isLoading } = useUserStore();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = 'Full name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!phone) newErrors.phone = 'Phone number is required';
    else if (!/^0[789][01]\d{8}$/.test(phone)) newErrors.phone = 'Invalid Nigerian phone number';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!acceptTerms) newErrors.terms = 'You must accept the terms and conditions';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (validate()) {
      const success = await signup({ fullName, email, phone, password });
      if (success) onAuthSuccess();
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
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing['3xl'] }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AuthCard
            eyebrow="Sign Up"
            title="Create your account"
            subtitle="It takes under a minute to start paying bills with Emir Pay."
          >
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              error={errors.fullName}
            />
            <Input
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />
            <Input
              label="Phone Number"
              placeholder="e.g. 08012345678"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              error={errors.phone}
            />
            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              showPasswordToggle
              error={errors.password}
            />
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              showPasswordToggle
              error={errors.confirmPassword}
            />

            <TouchableOpacity
              style={styles.termsContainer}
              onPress={() => setAcceptTerms(!acceptTerms)}
            >
              <View style={[styles.checkbox, acceptTerms && styles.checkboxChecked]}>
                {acceptTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                I agree to the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>
            {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

            <Button
              title="Create Account"
              onPress={handleSignup}
              fullWidth
              loading={isLoading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToLogin}>
                <Text style={styles.loginLink}>Log In</Text>
              </TouchableOpacity>
            </View>
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
    marginTop: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.canvas,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.ink,
  },
  checkmark: {
    color: Colors.ink,
    fontSize: 12,
    fontWeight: '700',
  },
  termsText: {
    fontSize: 13,
    color: Colors.body,
    flex: 1,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 12,
    color: Colors.negative,
    marginBottom: Spacing.lg,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: Spacing.xl,
  },
  loginText: {
    fontSize: 14,
    color: Colors.body,
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.secondary,
  },
});
