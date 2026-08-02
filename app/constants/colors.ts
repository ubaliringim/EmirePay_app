export const Colors = {
  primary: '#CFFFDC',
  secondary: '#2E6F40',
  primaryActive: '#b5f5c8',
  primaryNeutral: '#b8ebcc',
  primaryPale: '#e6f7ec',
  ink: '#0e0f0c',
  inkDeep: '#163300',
  body: '#454745',
  mute: '#868685',
  canvas: '#ffffff',
  canvasSoft: '#e8ebe6',
  border: '#dfe3de',
  positive: '#2ead4b',
  positiveDeep: '#054d28',
  warning: '#ffd11a',
  warningDeep: '#b86700',
  warningContent: '#4a3b1c',
  negative: '#d03238',
  negativeDeep: '#a72027',
  negativeDarkest: '#a7000d',
  negativeBg: '#320707',
  accentOrange: '#ffc091',
  accentCyan: '#38c8ff',
};

export const Spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const Rounded = {
  none: 0,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  pill: 9999,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  lift: {
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 8,
  },
};

export const Fonts = {
  display: 'Archivo_900Black',
  displayBold: 'Archivo_800ExtraBold',
  displaySemibold: 'Archivo_700Bold',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  sansBlack: 'Inter_900Black',
};

export const Typography = {
  displayMega: {
    fontFamily: Fonts.display,
    fontSize: 40,
    lineHeight: 42,
    letterSpacing: -1.2,
  },
  display: {
    fontFamily: Fonts.display,
    fontSize: 32,
    lineHeight: 36,
    letterSpacing: -0.64,
  },
  title: {
    fontFamily: Fonts.display,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.48,
  },
  heading: {
    fontFamily: Fonts.displayBold,
    fontSize: 18,
    lineHeight: 24,
    letterSpacing: -0.36,
  },
  eyebrow: {
    fontFamily: Fonts.sansBold,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
    color: Colors.secondary,
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.body,
  },
  bodySmall: {
    fontFamily: Fonts.sans,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.body,
  },
  label: {
    fontFamily: Fonts.sansSemibold,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.ink,
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.mute,
  },
};
