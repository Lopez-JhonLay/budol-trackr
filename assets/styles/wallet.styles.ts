import { ColorScheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createWalletStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: -1,
      color: colors.text,
    },
    netWorthCard: {
      marginHorizontal: 24,
      marginTop: 24,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    netWorthLabel: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    netWorthAmount: {
      fontSize: 40,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -1,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginTop: 20,
    },
    activityTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    activityViewAll: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    accountCard: {
      marginHorizontal: 24,
      marginTop: 20,
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    accountHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    accountIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.bg,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    accountInfo: {
      flex: 1,
    },
    accountName: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
    },
    accountType: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
    accountMenu: {
      padding: 4,
    },
    accountDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    accountBalanceLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textMuted,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 4,
    },
    accountBalanceAmount: {
      fontSize: 28,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    fab: {
      position: 'absolute',
      bottom: 16,
      right: 24,
    },
    fabGradient: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 46,
      paddingVertical: 16,
      borderRadius: 30,
    },
    fabText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '700',
    },
  });
