import { createHomeStyles } from '@/assets/styles/home.styles';
import AddBudgetSheet from '@/components/AddBudgetSheet';
import AddExpenseSheet from '@/components/AddExpenseSheet';
import BudgetCard from '@/components/BudgetCard';
import RecentActivity from '@/components/RecentActivity';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { getFormattedDate, getGreeting } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const user = useQuery(api.users.currentUser);
  const budgetSetting = useQuery(api.budgets.currentSetting);
  const [showExpenseSheet, setShowExpenseSheet] = useState(false);
  const [showBudgetSheet, setShowBudgetSheet] = useState(false);
  const [fabOpen, setFabOpen] = useState(false);
  const fabScale = useSharedValue(0);
  const fabRotation = useSharedValue(0);

  const toggleFab = () => {
    const opening = !fabOpen;
    setFabOpen(opening);
    fabScale.value = withTiming(opening ? 1 : 0, { duration: 200 });
    fabRotation.value = withTiming(opening ? 45 : 0, { duration: 200 });
  };

  const closeFab = () => {
    setFabOpen(false);
    fabScale.value = withTiming(0, { duration: 200 });
    fabRotation.value = withTiming(0, { duration: 200 });
  };

  const menuStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
    opacity: fabScale.value,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${fabRotation.value}deg` }],
  }));

  const cycleEndsText = (() => {
    if (!budgetSetting?.endDate) return 'No active budget cycle';
    const endDate = new Date(budgetSetting.endDate);
    return `Cycle ends on ${endDate.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;
  })();

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowExpenseSheet(false);
        setShowBudgetSheet(false);
        closeFab();
      };
    }, []),
  );

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
          <Text style={styles.balanceLabel}>Balance</Text>
          <Text style={styles.balanceAmount}>
            ₱ {(budgetSetting?.amount ?? 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </Text>
          <Text style={styles.balanceMeta}>{cycleEndsText}</Text>
        </LinearGradient>

        <BudgetCard
          amount={budgetSetting?.totalLimit ?? 0}
          spent={budgetSetting?.spent ?? 0}
          period={budgetSetting?.period ?? null}
          startDate={budgetSetting?.startDate}
          endDate={budgetSetting?.endDate}
          items={budgetSetting?.items ?? []}
        />

        <RecentActivity />
      </ScrollView>

      {fabOpen && (
        <Pressable style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={closeFab} />
      )}

      <View style={{ position: 'absolute', bottom: 16, right: 24, alignItems: 'flex-end' }}>
        <Animated.View style={[{ marginBottom: 12 }, menuStyle]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              closeFab();
              setShowBudgetSheet(true);
            }}
          >
            <LinearGradient colors={colors.gradients.primary} style={styles.fabGradient}>
              <Ionicons name="wallet-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.fabText}>Budget</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[{ marginBottom: 12 }, menuStyle]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              closeFab();
              setShowExpenseSheet(true);
            }}
          >
            <LinearGradient colors={colors.gradients.primary} style={styles.fabGradient}>
              <Ionicons name="card-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.fabText}>Expense</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity activeOpacity={0.8} onPress={toggleFab}>
          <LinearGradient
            colors={colors.gradients.primary}
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.View style={iconStyle}>
              <Ionicons name="add" size={28} color="#fff" />
            </Animated.View>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <AddExpenseSheet visible={showExpenseSheet} onClose={() => setShowExpenseSheet(false)} />
      <AddBudgetSheet
        visible={showBudgetSheet}
        onClose={() => setShowBudgetSheet(false)}
        existingBudgetAmount={budgetSetting?.amount ?? 0}
        existingBudgetPeriod={budgetSetting?.period ?? null}
        existingBudgetStartDate={budgetSetting?.startDate}
        existingBudgetEndDate={budgetSetting?.endDate}
      />
    </SafeAreaView>
  );
}
