import { createHomeStyles } from '@/assets/styles/home.styles';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, TouchableOpacity, View } from 'react-native';

const MOCK_ACTIVITIES = [
  {
    id: '1',
    title: 'Grocery Market',
    date: 'Oct 24, 2023 • 2:30 PM',
    amount: -1250,
    icon: 'cart' as const,
    gradient: 'primary' as const,
  },
  {
    id: '2',
    title: 'Salary Deposit',
    date: 'Oct 23, 2023 • 9:00 AM',
    amount: 45000,
    icon: 'cash' as const,
    gradient: 'success' as const,
  },
  {
    id: '3',
    title: 'Starbucks Coffee',
    date: 'Oct 22, 2023 • 10:15 AM',
    amount: -245,
    icon: 'cafe' as const,
    gradient: 'warning' as const,
  },
];

const RecentActivity = () => {
  const { colors } = useTheme();
  const styles = createHomeStyles(colors);

  return (
    <View style={styles.activitySection}>
      <View style={styles.activityHeader}>
        <Text style={styles.activityTitle}>Recent Activity</Text>
        <TouchableOpacity>
          <Text style={styles.activityViewAll}>View All</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient colors={colors.gradients.surface} style={styles.activityCard}>
        {MOCK_ACTIVITIES.map((item, index) => (
          <View
            key={item.id}
            style={[styles.activityItem, index < MOCK_ACTIVITIES.length - 1 && styles.activityItemBorder]}
          >
            <LinearGradient colors={colors.gradients[item.gradient]} style={styles.activityIcon}>
              <Ionicons name={item.icon} size={18} color="#fff" />
            </LinearGradient>

            <View style={styles.activityInfo}>
              <Text style={styles.activityItemTitle}>{item.title}</Text>
              <Text style={styles.activityItemDate}>{item.date}</Text>
            </View>

            <Text style={[styles.activityAmount, item.amount > 0 ? styles.activityAmountPositive : styles.activityAmountNegative]}>
              {item.amount > 0 ? '+ ' : '- '}₱{Math.abs(item.amount).toLocaleString()}.00
            </Text>
          </View>
        ))}
      </LinearGradient>
    </View>
  );
};

export default RecentActivity;
