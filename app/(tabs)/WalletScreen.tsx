import { createWalletStyles } from '@/assets/styles/wallet.styles';
import AddAccountSheet from '@/components/AddAccountSheet';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const WalletScreen = () => {
  const { colors } = useTheme();
  const styles = createWalletStyles(colors);
  const [showAccountSheet, setShowAccountSheet] = useState(false);
  const [editAccount, setEditAccount] = useState<Doc<'accounts'> | null>(null);
  const [menuAccountId, setMenuAccountId] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuRefs = useRef<Record<string, View | null>>({});
  const accounts = useQuery(api.accounts.list) ?? [];
  const totalNetWorth = accounts.reduce((sum, a) => sum + a.balance, 0);
  const removeAccount = useMutation(api.accounts.remove);

  const openMenu = (accountId: string) => {
    const ref = menuRefs.current[accountId];
    if (ref) {
      ref.measureInWindow((x, y, width, height) => {
        setMenuPosition({ top: y + height, right: 24 });
        setMenuAccountId(accountId);
      });
    }
  };

  const handleEdit = () => {
    const account = accounts.find((a) => a._id === menuAccountId);
    setMenuAccountId(null);
    if (account) {
      setEditAccount(account);
      setShowAccountSheet(true);
    }
  };

  const handleRemove = () => {
    if (menuAccountId) {
      removeAccount({ id: menuAccountId as any });
    }
    setMenuAccountId(null);
  };

  const handleCloseSheet = () => {
    setShowAccountSheet(false);
    setEditAccount(null);
  };

  useFocusEffect(
    useCallback(() => {
      return () => {
        setShowAccountSheet(false);
        setEditAccount(null);
        setMenuAccountId(null);
      };
    }, []),
  );

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
              <TouchableOpacity
                style={styles.accountMenu}
                onPress={() => openMenu(account._id)}
                ref={(ref) => {
                  menuRefs.current[account._id] = ref;
                }}
              >
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

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.8}
        onPress={() => {
          setEditAccount(null);
          setShowAccountSheet(true);
        }}
      >
        <LinearGradient colors={colors.gradients.primary} style={styles.fabGradient}>
          <Ionicons name="add" size={20} color="#fff" style={{ marginRight: 6 }} />
          <Text style={styles.fabText}>Account</Text>
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={!!menuAccountId} transparent animationType="fade" onRequestClose={() => setMenuAccountId(null)}>
        <Pressable style={{ flex: 1 }} onPress={() => setMenuAccountId(null)}>
          <View
            style={{
              position: 'absolute',
              top: menuPosition.top,
              right: menuPosition.right,
              backgroundColor: colors.surface,
              borderRadius: 12,
              paddingVertical: 4,
              minWidth: 150,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={handleEdit}
            >
              <Ionicons name="create-outline" size={18} color={colors.text} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 15, color: colors.text, fontWeight: '500' }}>Edit</Text>
            </TouchableOpacity>
            <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 12 }} />
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 }}
              onPress={handleRemove}
            >
              <Ionicons name="trash-outline" size={18} color={colors.danger} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 15, color: colors.danger, fontWeight: '500' }}>Remove</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <AddAccountSheet visible={showAccountSheet} onClose={handleCloseSheet} editAccount={editAccount} />
    </SafeAreaView>
  );
};

export default WalletScreen;
