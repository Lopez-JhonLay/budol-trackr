import { ColorScheme } from '@/hooks/useTheme';
import { StyleSheet } from 'react-native';

export const createHomeStyles = (colors: ColorScheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
    },
    date: {
      fontSize: 14,
      color: colors.textMuted,
      marginBottom: 4,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    greeting: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
    },
    accountDivider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 16,
    },
    balanceCard: {
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
    balanceLabel: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    balanceAmount: {
      fontSize: 40,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -1,
    },
    balanceMeta: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 6,
      fontStyle: 'italic',
    },
    budgetCard: {
      marginHorizontal: 24,
      marginTop: 20,
      borderRadius: 20,
      padding: 24,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    budgetHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    budgetTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: colors.text,
      letterSpacing: -0.5,
    },
    budgetPercent: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.primary,
    },
    budgetInner: {
      backgroundColor: colors.bg,
      borderRadius: 16,
      padding: 20,
    },
    budgetSpendingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
    },
    budgetSpendingLabel: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    budgetSpendingValue: {
      fontSize: 15,
      fontWeight: '800',
      color: colors.text,
    },
    budgetSpendingTotal: {
      fontWeight: '400',
      color: colors.textMuted,
    },
    budgetBreakdownList: {
      marginBottom: 14,
      gap: 10,
    },
    budgetBreakdownRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    budgetBreakdownCategory: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textMuted,
    },
    budgetBreakdownAmount: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    progressBarBg: {
      height: 10,
      borderRadius: 5,
      backgroundColor: colors.border,
      marginBottom: 14,
      overflow: 'hidden',
    },
    progressBarFill: {
      height: '100%',
      borderRadius: 5,
    },
    budgetRemainingText: {
      fontSize: 13,
      fontStyle: 'italic',
      color: colors.textMuted,
    },
    activitySection: {
      marginTop: 20,
    },
    activityHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 24,
      marginBottom: 16,
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
    activityCard: {
      marginHorizontal: 24,
      borderRadius: 20,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 8,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    activityItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 14,
    },
    activityInfo: {
      flex: 1,
    },
    activityItemTitle: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 2,
    },
    activityItemDate: {
      fontSize: 12,
      color: colors.textMuted,
    },
    activityAmount: {
      fontSize: 16,
      fontWeight: '700',
    },
    activityAmountPositive: {
      color: colors.success,
    },
    activityAmountNegative: {
      color: colors.danger,
    },
    body: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    logoutButton: {
      marginTop: 20,
    },
    logoutText: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
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
