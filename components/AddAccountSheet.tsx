import { createAccountSheetStyles, SHEET_HEIGHT } from '@/assets/styles/account-sheet.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const ACCOUNT_TYPES = ['Cash', 'E-Wallet', 'Bank', 'Credit Card', 'Savings'];

interface AddAccountSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddAccountSheet({ visible, onClose }: AddAccountSheetProps) {
  const { colors } = useTheme();
  const styles = createAccountSheetStyles(colors);
  const addAccount = useMutation(api.accounts.add);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [accountName, setAccountName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [balance, setBalance] = useState('');

  const resetForm = useCallback(() => {
    setAccountName('');
    setAccountType('');
    setBalance('');
  }, []);

  const close = useCallback(() => {
    Keyboard.dismiss();
    backdropOpacity.value = withTiming(0, { duration: 250 });
    translateY.value = withTiming(SHEET_HEIGHT, { duration: 300 });
    setTimeout(() => {
      onClose();
      resetForm();
    }, 300);
  }, [onClose, resetForm, backdropOpacity, translateY]);

  useEffect(() => {
    if (visible) {
      backdropOpacity.value = withTiming(1, { duration: 250 });
      translateY.value = withTiming(0, { duration: 300 });
    }
  }, [visible, backdropOpacity, translateY]);

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const handleSubmit = () => {
    if (!accountName || !accountType || !balance) return;
    addAccount({
      accountName,
      accountType,
      balance: parseFloat(balance),
    });
    close();
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={{ ...StyleSheet.absoluteFillObject, zIndex: 100 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Add Account</Text>
          <TouchableOpacity style={styles.closeButton} onPress={close}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Account Name</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. GCash, BDO Savings"
          placeholderTextColor={colors.textMuted}
          value={accountName}
          onChangeText={setAccountName}
        />

        <Text style={styles.label}>Account Type</Text>
        <View style={styles.typeRow}>
          {ACCOUNT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.typeChip, accountType === type && styles.typeChipSelected]}
              onPress={() => setAccountType(type)}
            >
              <Text style={[styles.typeChipText, accountType === type && styles.typeChipTextSelected]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Initial Balance</Text>
        <TextInput
          style={styles.input}
          placeholder="₱ 0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={balance}
          onChangeText={setBalance}
        />

        <TouchableOpacity style={styles.submitButton} activeOpacity={0.8} onPress={handleSubmit}>
          <LinearGradient colors={colors.gradients.primary} style={styles.submitGradient}>
            <Text style={styles.submitText}>Save</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
