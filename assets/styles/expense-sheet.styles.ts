import { ColorScheme } from '@/hooks/useTheme';
import { Dimensions, StyleSheet } from 'react-native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;

export const createExpenseSheetStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    sheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      height: SHEET_HEIGHT,
      backgroundColor: colors.surface,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 32,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      alignSelf: 'center',
      marginBottom: 16,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    closeButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.bg,
      justifyContent: 'center',
      alignItems: 'center',
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
      marginBottom: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: colors.backgrounds.input,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
    },
    categoryRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 20,
    },
    categoryChip: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 20,
      backgroundColor: colors.bg,
      borderWidth: 1,
      borderColor: colors.border,
    },
    categoryChipSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryChipText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    categoryChipTextSelected: {
      color: '#FFFFFF',
    },
    submitButton: {
      borderRadius: 16,
      overflow: 'hidden',
      marginTop: 8,
    },
    submitGradient: {
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    submitText: {
      fontSize: 16,
      fontWeight: '700',
      color: '#FFFFFF',
    },
    alertOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    alertCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      width: '100%',
      alignItems: 'center',
    },
    alertIconWrap: {
      marginBottom: 12,
    },
    alertTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    alertMessage: {
      fontSize: 14,
      color: colors.textMuted,
      textAlign: 'center',
      marginBottom: 20,
    },
    alertButton: {
      borderRadius: 14,
      overflow: 'hidden',
      width: '100%',
    },
    alertButtonGradient: {
      paddingVertical: 14,
      alignItems: 'center',
    },
    alertButtonText: {
      fontSize: 15,
      fontWeight: '700',
      color: '#FFFFFF',
    },
  });
