import { ColorScheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createLoginStyles = (colors: ColorScheme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 24,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      marginBottom: 8,
      letterSpacing: -1,
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 40,
      color: colors.textMuted,
    },
    form: {
      gap: 16,
    },
    input: {
      height: 56,
      borderRadius: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      borderWidth: 1,
      backgroundColor: colors.backgrounds.input,
      color: colors.text,
      borderColor: colors.border,
    },
    button: {
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: colors.primary,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
  });

  return styles;
};
