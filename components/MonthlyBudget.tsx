import { createHomeStyles } from '@/assets/styles/home.styles';
import { useTheme } from '@/hooks/useTheme';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, View } from 'react-native';

interface MonthlyBudgetProps {
  amount: number;
  period: 'Weekly' | 'Monthly' | null;
  startDate?: string;
  endDate?: string;
  items: Array<{
    id: string;
    category: string;
    amount: number;
  }>;
}

const MonthlyBudget = ({ amount, period, startDate, endDate, items }: MonthlyBudgetProps) => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const budgetSpent = 0;
  const budgetLimit = amount;
  const budgetRemaining = Math.max(budgetLimit - budgetSpent, 0);
  const budgetPercent = budgetLimit > 0 ? Math.min(Math.round((budgetSpent / budgetLimit) * 100), 100) : 0;

  const computedDaysRemaining = (() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const effectiveStart = start.getTime() > today.getTime() ? start : today;
    const diffMs = end.getTime() - effectiveStart.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    return Math.max(days, 0);
  })();

  const hasBudget = budgetLimit > 0;
  const periodLabel = period ?? 'Monthly';

  return (
    <LinearGradient colors={colors.gradients.surface} style={styles.budgetCard}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>{periodLabel} Budget</Text>
        <Text style={styles.budgetPercent}>{budgetPercent}% Used</Text>
      </View>

      <View style={styles.budgetInner}>
        <View style={styles.budgetSpendingRow}>
          <Text style={styles.budgetSpendingLabel}>Spending Limit</Text>
          <Text style={styles.budgetSpendingValue}>
            ₱{budgetSpent.toLocaleString('en-PH', { minimumFractionDigits: 2 })}{' '}
            <Text style={styles.budgetSpendingTotal}>
              of ₱{budgetLimit.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </Text>
          </Text>
        </View>

        {items.length > 0 && (
          <View style={styles.budgetBreakdownList}>
            {items.map((item) => (
              <View key={item.id} style={styles.budgetBreakdownRow}>
                <Text style={styles.budgetBreakdownCategory}>{item.category}</Text>
                <Text style={styles.budgetBreakdownAmount}>
                  ₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.progressBarBg}>
          <LinearGradient
            colors={colors.gradients.success}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${budgetPercent}%` }]}
          />
        </View>

        {hasBudget ? (
          <Text style={styles.budgetRemainingText}>
            You have ₱{budgetRemaining.toLocaleString('en-PH', { minimumFractionDigits: 2 })} remaining for the next{' '}
            {computedDaysRemaining} days.
          </Text>
        ) : (
          <Text style={styles.budgetRemainingText}>No active budget yet. Create one from the Budget sheet.</Text>
        )}
      </View>
    </LinearGradient>
  );
};

export default MonthlyBudget;
