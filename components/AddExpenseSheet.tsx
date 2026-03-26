import { createExpenseSheetStyles, SHEET_HEIGHT } from '@/assets/styles/expense-sheet.styles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
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

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Other'];

interface AddExpenseSheetProps {
  visible: boolean;
  onClose: () => void;
}

export default function AddExpenseSheet({ visible, onClose }: AddExpenseSheetProps) {
  const { colors } = useTheme();
  const styles = createExpenseSheetStyles(colors);

  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

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

  const handleSubmit = () => {
    if (!category || !amount) return;
    // TODO: save expense to backend
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
          <Text style={styles.title}>Add Expense</Text>
          <TouchableOpacity style={styles.closeButton} onPress={close}>
            <Ionicons name="close" size={18} color={colors.text} />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Category</Text>
        <View style={styles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[styles.categoryChip, category === cat && styles.categoryChipSelected]}
              onPress={() => setCategory(cat)}
            >
              <Text style={[styles.categoryChipText, category === cat && styles.categoryChipTextSelected]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="₱ 0.00"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
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
