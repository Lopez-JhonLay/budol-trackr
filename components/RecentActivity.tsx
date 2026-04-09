import { createHomeStyles } from '@/assets/styles/home.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Food: 'restaurant',
  Transport: 'car',
  Shopping: 'bag',
  Bills: 'receipt',
  Entertainment: 'game-controller',
  Health: 'medkit',
  Other: 'ellipsis-horizontal',
};

const formatTime12h = (ts: number) => {
  const d = new Date(ts);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()} • ${displayH}:${m} ${ampm}`;
};

const RecentActivity = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);
  const transactions = useQuery(api.transactions.recent) ?? [];
  const router = useRouter();

  return (
    <View style={styles.activitySection}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/HistoryScreen')}>
          <Text style={styles.activityViewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={colors.gradients.surface} style={styles.activityCard}>
        {transactions.length === 0 ? (
          <Text style={{ color: colors.textMuted, fontSize: 14, textAlign: 'center', paddingVertical: 16 }}>
            No recent activity yet.
          </Text>
        ) : (
          transactions.map((item, index) => {
            const isExpense = item.type === 'expense';
            const icon: keyof typeof Ionicons.glyphMap = isExpense
              ? (CATEGORY_ICONS[item.title] ?? 'ellipsis-horizontal')
              : 'wallet';
            const gradient = isExpense ? 'primary' : 'success';

            return (
              <View
                key={item.id}
                style={[styles.activityItem, index < transactions.length - 1 && styles.activityItemBorder]}
              >
                <LinearGradient colors={colors.gradients[gradient]} style={styles.activityIcon}>
                  <Ionicons name={icon} size={18} color="#fff" />
                </LinearGradient>

                <View style={styles.activityInfo}>
                  <Text style={styles.activityItemTitle}>{item.title}</Text>
                  <Text style={styles.activityItemDate}>{formatTime12h(item.createdAt)}</Text>
                </View>

                <Text
                  style={[
                    styles.activityAmount,
                    isExpense ? styles.activityAmountNegative : styles.activityAmountPositive,
                  ]}
                >
                  {isExpense ? '- ' : '+ '}₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                </Text>
              </View>
            );
          })
        )}
      </LinearGradient>
    </View>
  );
};

export default RecentActivity;
