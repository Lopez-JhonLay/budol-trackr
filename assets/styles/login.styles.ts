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
    passwordContainer: {
      position: 'relative',
      flexDirection: 'row',
      alignItems: 'center',
      height: 56,
      borderRadius: 12,
      backgroundColor: colors.backgrounds.input,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordInput: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      paddingRight: 40,
      borderWidth: 0,
      height: '100%',
    },
    showPasswordButton: {
      position: 'absolute',
      right: 16,
      top: 0,
      bottom: 0,
      justifyContent: 'center',
    },
    button: {
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: colors.primary,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '600',
    },
    toggleButton: {
      marginTop: 20,
      alignItems: 'center',
    },
    toggleButtonText: {
      color: '#007AFF',
      fontSize: 14,
    },
    errorText: {
      color: '#FF3B30',
      marginBottom: 16,
      textAlign: 'center',
    },
  });

  return styles;
};
