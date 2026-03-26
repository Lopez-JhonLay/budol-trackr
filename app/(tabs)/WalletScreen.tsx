import { createWalletStyles } from '@/assets/styles/wallet.styles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = createWalletStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
        </View>

        <LinearGradient colors={colors.gradients.surface} style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>Total Net Worth</Text>
          <Text style={styles.netWorthAmount}>₱ 24,500.00</Text>
        </LinearGradient>

        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Accounts</Text>
        </View>

        <LinearGradient colors={colors.gradients.surface} style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIcon}>
              <Ionicons name="cash" size={22} color={colors.success} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Physical Cash</Text>
              <Text style={styles.accountType}>On-hand currency</Text>
            </View>
            <TouchableOpacity style={styles.accountMenu}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.accountDivider} />

          <Text style={styles.accountBalanceLabel}>Balance</Text>
          <Text style={styles.accountBalanceAmount}>₱ 2,199.50</Text>
        </LinearGradient>

        <LinearGradient colors={colors.gradients.surface} style={styles.accountCard}>
          <View style={styles.accountHeader}>
            <View style={styles.accountIcon}>
              <Ionicons name="cash" size={22} color={colors.success} />
            </View>
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>GCash</Text>
              <Text style={styles.accountType}>On-hand currency</Text>
            </View>
            <TouchableOpacity style={styles.accountMenu}>
              <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.accountDivider} />

          <Text style={styles.accountBalanceLabel}>Balance</Text>
          <Text style={styles.accountBalanceAmount}>₱ 5,000.00</Text>
        </LinearGradient>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WalletScreen;
