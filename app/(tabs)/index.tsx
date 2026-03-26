import { createHomeStyles } from '@/assets/styles/home.styles';
import MonthlyBudget from '@/components/MonthlyBudget';
import RecentActivity from '@/components/RecentActivity';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { getFormattedDate, getGreeting } from '@/lib/utils';
import { useAuthActions } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);

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
    </SafeAreaView>
  );
}
