import { createExpenseSheetStyles, SHEET_HEIGHT } from '@/assets/styles/expense-sheet.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface AddExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseSheet({ visible, onClose }: AddExpenseSheetProps) {
  const { colors } = useTheme();
  const styles = createExpenseSheetStyles(colors);
  const addExpense = useMutation(api.expenses.add);
  const budgetSetting = useQuery(api.budgets.currentSetting);
  const budgetCategories = budgetSetting?.items?.map((item) => item.category) ?? [];

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState({ visible: false, title: '', message: '' });

  const openAlert = useCallback((title: string, message: string) => {
    setAlertState({ visible: true, title, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((current) => ({ ...current, visible: false }));
  }, []);

  const resetForm = useCallback(() => {
    setCategory('');
    setAmount('');
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

  const handleSubmit = async () => {
    if (!category || !amount || isSaving) return;

    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      openAlert('Invalid amount', 'Please enter a valid amount greater than 0.');
      return;
    }

    try {
      setIsSaving(true);
      await addExpense({ category, amount: parsed });
      close();
    } catch (error: any) {
      const msg = String(error?.message ?? '').toLowerCase();
      if (msg.includes('exceeds')) {
        openAlert('Over Budget', `You don't have enough remaining budget for ${category} to cover this expense.`);
      } else if (msg.includes('no active budget')) {
        openAlert('No Budget Set', `There's no active budget for ${category}. Set one first.`);
      } else {
        openAlert('Unable to save expense', 'Something went wrong. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!visible) return null;

  return (
    <KeyboardAvoidingView
      style={{ ...StyleSheet.absoluteFillObject, zIndex: 100 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Modal visible={alertState.visible} transparent animationType="fade" onRequestClose={closeAlert}>
        <Pressable style={styles.alertOverlay} onPress={closeAlert}>
          <Pressable style={styles.alertCard} onPress={() => {}}>
            <View style={styles.alertIconWrap}>
              <Ionicons name="alert-circle" size={24} color={colors.danger} />
            </View>
            <Text style={styles.alertTitle}>{alertState.title}</Text>
            <Text style={styles.alertMessage}>{alertState.message}</Text>
            <TouchableOpacity style={styles.alertButton} activeOpacity={0.85} onPress={closeAlert}>
              <LinearGradient colors={colors.gradients.primary} style={styles.alertButtonGradient}>
                <Text style={styles.alertButtonText}>Okay</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      <Animated.View style={[styles.backdrop, backdropStyle]}>
        <Pressable style={{ flex: 1 }} onPress={close} />
      </Animated.View>

      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.handle} />

        <View style={styles.header}>
          <Text style={styles.title}>Add Expense</Text>
          <TouchableOpacity style={styles.closeButton} onPress={close}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Category</Text>
        {budgetCategories.length > 0 ? (
          <View style={styles.categoryRow}>
            {budgetCategories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
                onPress={() => setCategory(cat)}
              >
                <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.categoryRow}>
            <Text style={{ color: colors.textMuted, fontSize: 14 }}>No budget categories set. Add a budget first.</Text>
          </View>
        )}

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="₱ 0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <TouchableOpacity
          style={[styles.submitButton, (isSaving || budgetCategories.length === 0) && { opacity: 0.55 }]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={isSaving || budgetCategories.length === 0}
        >
          <LinearGradient colors={colors.gradients.primary} style={styles.submitGradient}>
            <Text style={styles.submitText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
