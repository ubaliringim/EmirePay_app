import { useState } from 'react';
import { View } from 'react-native';
import { SplashScreen, OnboardingScreen, LoginScreen, SignupScreen, ForgotPasswordScreen } from '../components/auth';
import { useRouter } from 'expo-router';

type AuthStep = 'splash' | 'onboarding' | 'login' | 'signup' | 'forgotPassword';

export default function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('splash');
  const router = useRouter();

  const handleAuthSuccess = () => {
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (step) {
      case 'splash':
        return <SplashScreen onFinish={() => setStep('onboarding')} />;
      case 'onboarding':
        return <OnboardingScreen onComplete={() => setStep('login')} />;
      case 'login':
        return (
          <LoginScreen
            onNavigateToSignup={() => setStep('signup')}
            onNavigateToForgotPassword={() => setStep('forgotPassword')}
            onAuthSuccess={handleAuthSuccess}
          />
        );
      case 'signup':
        return <SignupScreen onNavigateToLogin={() => setStep('login')} onAuthSuccess={handleAuthSuccess} />;
      case 'forgotPassword':
        return <ForgotPasswordScreen onBack={() => setStep('login')} />;
    }
  };

  return <View style={{ flex: 1 }}>{renderStep()}</View>;
}
