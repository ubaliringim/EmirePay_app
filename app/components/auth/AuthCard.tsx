import { View, Text, StyleSheet, Image } from 'react-native';
import type { ReactNode } from 'react';
import { Lock } from 'lucide-react-native';
import { Colors, Spacing, Rounded, Shadows } from '../../constants/colors';

interface AuthCardProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ eyebrow, title, subtitle, children }: AuthCardProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.eyebrow}>{eyebrow}</Text>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.content}>{children}</View>
      </View>
      <View style={styles.footnote}>
        <Lock size={14} color={Colors.secondary} />
        <Text style={styles.footnoteText}>
          Secured connection · Emir Pay never asks for your PIN
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    backgroundColor: Colors.canvas,
    borderRadius: Rounded['2xl'],
    padding: Spacing.xl,
    ...Shadows.lift,
  },
  logo: {
    width: 160,
    height: 48,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    textTransform: 'uppercase',
    color: Colors.secondary,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    fontFamily: 'Archivo_900Black',
    color: Colors.ink,
    letterSpacing: -0.56,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.body,
    textAlign: 'center',
    marginTop: Spacing.sm,
    lineHeight: 20,
  },
  content: {
    marginTop: Spacing.xl,
  },
  footnote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.lg,
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
  },
  footnoteText: {
    fontSize: 12,
    color: Colors.body,
    textAlign: 'center',
  },
});
