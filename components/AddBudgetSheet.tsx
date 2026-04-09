import { createBudgetSheetStyles, SHEET_HEIGHT } from '@/assets/styles/budget-sheet.styles';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
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
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];
const PERIOD_OPTIONS = ['Weekly', 'Monthly'] as const;
type BudgetPeriod = (typeof PERIOD_OPTIONS)[number];

interface AddBudgetSheetProps {
  visible: boolean;
  onClose: () => void;
  existingBudgetAmount?: number;
  existingBudgetPeriod?: BudgetPeriod | null;
  existingBudgetStartDate?: string;
  existingBudgetEndDate?: string;
}

export default function AddBudgetSheet({
  visible,
  onClose,
  existingBudgetAmount = 0,
  existingBudgetPeriod = null,
  existingBudgetStartDate,
  existingBudgetEndDate,
}: AddBudgetSheetProps) {
  const { colors } = useTheme();
  const styles = createBudgetSheetStyles(colors);
  const accounts = useQuery(api.accounts.list) ?? [];
  const addBudgetAndDeduct = useMutation(api.budgets.addAndDeduct);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [accountId, setAccountId] = useState<Id<'accounts'> | null>(null);
  const [period, setPeriod] = useState<BudgetPeriod>('Monthly');
  const [showPeriodOptions, setShowPeriodOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [alertState, setAlertState] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const isPeriodLocked = existingBudgetAmount > 0;

  const getDateRange = useCallback((selectedPeriod: BudgetPeriod) => {
    const start = new Date();
    start.setDate(start.getDate() + 1);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    if (selectedPeriod === 'Weekly') {
      end.setDate(start.getDate() + 6);
    } else {
      end.setMonth(start.getMonth() + 1);
      end.setDate(end.getDate());
    }

    const formatter = new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${formatter.format(start)} - ${formatter.format(end)}`;
  }, []);

  const dateRangeLabel = getDateRange(period);

  const lockedRangeLabel = (() => {
    if (!existingBudgetStartDate || !existingBudgetEndDate) return dateRangeLabel;
    const start = new Date(existingBudgetStartDate);
    const end = new Date(existingBudgetEndDate);
    const formatter = new Intl.DateTimeFormat('en-PH', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return `${formatter.format(start)} - ${formatter.format(end)}`;
  })();

  useEffect(() => {
    if (existingBudgetPeriod) {
      setPeriod(existingBudgetPeriod);
    }
  }, [existingBudgetPeriod]);

  const resetForm = useCallback(() => {
    setCategory('');
    setAmount('');
    setAccountId(null);
    setShowPeriodOptions(false);
  }, []);

  const openAlert = useCallback((title: string, message: string) => {
    setAlertState({ visible: true, title, message });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((current) => ({ ...current, visible: false }));
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
    if (!category || !amount || !accountId || isSaving) return;

    const parsedAmount = Number(amount.replace(/,/g, ''));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      openAlert('Invalid amount', 'Please enter a valid budget amount greater than 0.');
      return;
    }

    try {
      setIsSaving(true);

      const start = new Date();
      start.setDate(start.getDate() + 1);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      if (period === 'Weekly') {
        end.setDate(start.getDate() + 6);
      } else {
        end.setMonth(start.getMonth() + 1);
        end.setDate(end.getDate() - 1);
      }

      await addBudgetAndDeduct({
        period,
        category,
        amount: parsedAmount,
        accountId: accountId,
        startDate: existingBudgetStartDate ?? start.toISOString(),
        endDate: existingBudgetEndDate ?? end.toISOString(),
      });

      close();
    } catch (error: any) {
      const errorMessage = String(error?.message ?? '');
      const alertMessage = errorMessage.toLowerCase().includes('insufficient')
        ? 'Insufficient balance'
        : 'Unable to save budget';
      openAlert('Unable to save budget', alertMessage);
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
          <Text style={styles.title}>Set Budget</Text>
          <TouchableOpacity style={styles.closeButton} onPress={close}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Budget Range</Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, isPeriodLocked && styles.dropdownTriggerDisabled]}
            activeOpacity={0.85}
            onPress={() => {
              if (isPeriodLocked) return;
              setShowPeriodOptions((prev) => !prev);
            }}
          >
            <View>
              <Text style={[styles.dropdownValue, isPeriodLocked && styles.dropdownValueDisabled]}>{period}</Text>
              <Text style={styles.rangeText}>{isPeriodLocked ? lockedRangeLabel : dateRangeLabel}</Text>
            </View>
            <Ionicons name={showPeriodOptions ? 'chevron-up' : 'chevron-down'} size={18} color={colors.textMuted} />
          </TouchableOpacity>

          {showPeriodOptions && !isPeriodLocked && (
            <View style={styles.dropdownMenu}>
              {PERIOD_OPTIONS.map((option) => {
                const selected = option === period;
                return (
                  <TouchableOpacity
                    key={option}
                    style={styles.dropdownOption}
                    activeOpacity={0.85}
                    onPress={() => {
                      setPeriod(option);
                      setShowPeriodOptions(false);
                    }}
                  >
                    <Text style={[styles.dropdownOptionText, selected && styles.dropdownOptionTextSelected]}>
                      {option}
                    </Text>
                    {selected && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {isPeriodLocked && <Text style={styles.lockedHint}>Active budgets.</Text>}

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryRow}>
            {CATEGORIES.map((cat) => (
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

          <Text style={styles.label}>Budget Amount</Text>
          <TextInput
            style={styles.input}
            placeholder="₱ 0.00"
            placeholderTextColor={colors.textMuted}
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />

          <Text style={styles.label}>Deduct From Account</Text>
          {accounts.length > 0 ? (
            <View style={styles.accountList}>
              {accounts.map((account) => {
                const selected = account._id === accountId;
                return (
                  <TouchableOpacity
                    key={account._id}
                    style={[styles.accountOption, selected && styles.accountOptionSelected]}
                    onPress={() => setAccountId(account._id)}
                    activeOpacity={0.85}
                  >
                    <View>
                      <Text style={styles.accountName}>{account.accountName}</Text>
                      <Text style={styles.accountType}>{account.accountType}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={styles.accountBalance}>
                        ₱ {account.balance.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                      </Text>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={18} color={colors.primary} style={{ marginLeft: 8 }} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyAccounts}>
              <Text style={styles.emptyAccountsText}>No wallet accounts yet. Add an account in Wallet first.</Text>
            </View>
          )}
        </ScrollView>

        <TouchableOpacity
          style={[styles.submitButton, (accounts.length === 0 || isSaving) && { opacity: 0.55 }]}
          activeOpacity={0.8}
          onPress={handleSubmit}
          disabled={accounts.length === 0 || isSaving}
        >
          <LinearGradient colors={colors.gradients.primary} style={styles.submitGradient}>
            <Text style={styles.submitText}>{isSaving ? 'Saving...' : 'Save Budget'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}
