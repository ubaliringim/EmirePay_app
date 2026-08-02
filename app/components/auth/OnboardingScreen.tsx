import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Wallet, Shield, Zap } from 'lucide-react-native';
import { Colors, Spacing, Rounded } from '../../constants/colors';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Send money, pay bills, and purchase airtime in seconds. No delays, no hassle.',
    color: Colors.primary,
  },
  {
    id: '2',
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your money is protected with enterprise-level encryption and security protocols.',
    color: Colors.secondary,
  },
  {
    id: '3',
    icon: Wallet,
    title: 'All-in-One Wallet',
    description: 'Airtime, data, electricity, cable TV, and more — all from one app.',
    color: Colors.ink,
  },
];

interface OnboardingScreenProps {
  onComplete: () => void;
}

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <LinearGradient
      colors={[Colors.canvasSoft, Colors.primaryPale]}
      style={styles.container}
    >
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: slide.color }]}>
          <IconComponent size={48} color={Colors.canvas} />
        </View>
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>
      </View>

      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    padding: Spacing.xl,
    alignItems: 'flex-end',
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.body,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing['2xl'],
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing['2xl'],
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.ink,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  description: {
    fontSize: 16,
    color: Colors.body,
    textAlign: 'center',
    lineHeight: 24,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing['2xl'],
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.mute,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.ink,
  },
  footer: {
    padding: Spacing.xl,
  },
  button: {
    backgroundColor: Colors.ink,
    paddingVertical: Spacing.lg,
    borderRadius: Rounded.xl,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.canvas,
  },
});
