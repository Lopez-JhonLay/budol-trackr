import { createHomeStyles } from '@/assets/styles/home.styles';
import AddExpenseSheet from '@/components/AddExpenseSheet';
import MonthlyBudget from '@/components/MonthlyBudget';
import RecentActivity from '@/components/RecentActivity';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { getFormattedDate, getGreeting } from '@/lib/utils';
import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.date}>{getFormattedDate()}</Text>
          <Text style={styles.greeting}>
            {getGreeting()}, {user?.name ?? 'User'}!
          </Text>
        </View>

        <View style={styles.accountDivider} />

        <LinearGradient colors={colors.gradients.surface} style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Budget</Text>
          <Text style={styles.balanceAmount}>₱ 24,500.00</Text>
        </LinearGradient>

        <MonthlyBudget />

        <RecentActivity />
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setShowExpenseSheet(true)}>
        <LinearGradient colors={colors.gradients.primary} style={styles.fabGradient}>
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Expense</Text>
        </LinearGradient>
      </TouchableOpacity>

      <AddExpenseSheet visible={showExpenseSheet} onClose={() => setShowExpenseSheet(false)} />
    </SafeAreaView>
  );
}
