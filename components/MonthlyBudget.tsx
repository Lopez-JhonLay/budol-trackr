import { createHomeStyles } from '@/assets/styles/home.styles';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

const BUDGET_LIMIT = 20000;
const BUDGET_SPENT = 12000;
const BUDGET_REMAINING = BUDGET_LIMIT - BUDGET_SPENT;
const BUDGET_PERCENT = Math.round((BUDGET_SPENT / BUDGET_LIMIT) * 100);
const DAYS_REMAINING = 12;

const MonthlyBudget = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>Monthly Budget</Text>
        <Text style={styles.budgetPercent}>{BUDGET_PERCENT}% Used</Text>
      </View>

      <View style={styles.budgetInner}>
        <View style={styles.budgetSpendingRow}>
          <Text style={styles.budgetSpendingLabel}>Spending Limit</Text>
          <Text style={styles.budgetSpendingValue}>
            ₱{BUDGET_SPENT.toLocaleString()}{' '}
            <Text style={styles.budgetSpendingTotal}>of ₱{BUDGET_LIMIT.toLocaleString()}</Text>
          </Text>
        </View>

        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={colors.gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${BUDGET_PERCENT}%` }]}
          />
        </View>

        <Text style={styles.budgetRemainingText}>
          You have ₱{BUDGET_REMAINING.toLocaleString()} remaining for the next {DAYS_REMAINING} days.
        </Text>
      </View>
    </LinearGradient>
  );
};

export default MonthlyBudget;
