import { createWalletStyles } from '@/assets/styles/wallet.styles';
import AddAccountSheet from '@/components/AddAccountSheet';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = createWalletStyles(colors);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const accounts = useQuery(api.accounts.list) ?? [];
  const totalNetWorth = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Wallet</Text>
        </View>

        <View style={styles.accountDivider} />

        <LinearGradient colors={colors.gradients.surface} style={styles.netWorthCard}>
          <Text style={styles.netWorthLabel}>Total Net Worth</Text>
          <Text style={styles.netWorthAmount}>
            ₱ {totalNetWorth.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
          </Text>
        </LinearGradient>

        <View style={styles.activityHeader}>
          <Text style={styles.activityTitle}>Accounts</Text>
        </View>

        {accounts.map((account) => (
          <LinearGradient key={account._id} colors={colors.gradients.surface} style={styles.accountCard}>
            <View style={styles.accountHeader}>
              <View style={styles.accountIcon}>
                <Ionicons name="cash" size={22} color={colors.success} />
              </View>
              <View style={styles.accountInfo}>
                <Text style={styles.accountName}>{account.accountName}</Text>
                <Text style={styles.accountType}>{account.accountType}</Text>
              </View>
              <TouchableOpacity style={styles.accountMenu}>
                <Ionicons name="ellipsis-vertical" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={styles.accountDivider} />

            <Text style={styles.accountBalanceLabel}>Balance</Text>
            <Text style={styles.accountBalanceAmount}>
              ₱ {account.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
            </Text>
          </LinearGradient>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setShowAccountSheet(true)}>
        <LinearGradient colors={colors.gradients.primary} style={styles.fabGradient}>
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Account</Text>
        </LinearGradient>
      </TouchableOpacity>

      <AddAccountSheet visible={showAccountSheet} onClose={() => setShowAccountSheet(false)} />
    </SafeAreaView>
  );
};

export default WalletScreen;
