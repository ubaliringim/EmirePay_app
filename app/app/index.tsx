import { useState, useEffect } from 'react';
import { View } from 'react-native';
import { SplashScreen, LoginScreen, SignupScreen, ForgotPasswordScreen } from '../components/auth';
import { useRouter } from 'expo-router';
import { firebaseAuth } from '../services/firebase';

type AuthStep = 'splash' | 'login' | 'signup' | 'forgotPassword';

export default function AuthFlow() {
  const [step, setStep] = useState<AuthStep>('splash');
  const router = useRouter();

  useEffect(() => {
    let unsub = () => {};
    try {
      unsub = firebaseAuth.onAuthStateChange((user) => {
        if (user) {
          router.replace('/(tabs)');
        }
      });
    } catch {
      // Native Firebase module unavailable (e.g. Expo Go); stay on auth flow.
    }
    return () => unsub();
  }, [router]);

  const handleAuthSuccess = () => {
    router.replace('/(tabs)');
  };

  const renderStep = () => {
    switch (step) {
      case 'splash':
        return <SplashScreen onFinish={() => setStep('login')} />;
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
