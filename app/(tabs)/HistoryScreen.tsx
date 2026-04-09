import { createHomeStyles } from '@/assets/styles/home.styles';
import { createSettingsStyles } from '@/assets/styles/settings.styles';
import { api } from '@/convex/_generated/api';
import { useTheme } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from 'convex/react';
import { LinearGradient } from 'expo-linear-gradient';
import { SectionList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CATEGORY_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Food: 'restaurant',
  Transport: 'car',
  Shopping: 'bag',
  Bills: 'receipt',
  Entertainment: 'game-controller',
  Health: 'medkit',
  Other: 'ellipsis-horizontal',
};

const formatTime = (ts: number) => {
  const d = new Date(ts);
  const h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${m} ${ampm}`;
};

const toDateKey = (ts: number) => {
  const d = new Date(ts);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatSectionDate = (dateKey: string) => {
  const d = new Date(dateKey + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (d.getTime() === today.getTime()) return 'Today';
  if (d.getTime() === yesterday.getTime()) return 'Yesterday';
  return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
};

type Transaction = {
  id: string;
  type: 'expense' | 'deposit';
  title: string;
  amount: number;
  createdAt: number;
};

const groupByDate = (items: Transaction[]) => {
  const map = new Map<string, Transaction[]>();
  for (const item of items) {
    const key = toDateKey(item.createdAt);
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(item);
  }
  return Array.from(map.entries()).map(([date, data]) => ({ title: date, data }));
};

const HistoryScreen = () => {
  const { colors } = useTheme();
  const homeStyles = createHomeStyles(colors);
  const settingsStyles = createSettingsStyles(colors);
  const transactions = useQuery(api.transactions.all) ?? [];
  const sections = groupByDate(transactions);

  return (
    <LinearGradient colors={colors.gradients.background} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* HEADER */}
        <View style={settingsStyles.header}>
          <View style={settingsStyles.titleContainer}>
            <LinearGradient colors={colors.gradients.primary} style={settingsStyles.iconContainer}>
              <Ionicons name="time" size={28} color="#ffffff" />
            </LinearGradient>
            <Text style={settingsStyles.title}>History</Text>
          </View>
        </View>

        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, gap: 8 }}
          ListEmptyComponent={
            <Text style={{ color: colors.textMuted, textAlign: 'center', marginTop: 48, fontSize: 14 }}>
              No transactions yet.
            </Text>
          }
          renderSectionHeader={({ section }) => (
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: colors.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              {formatSectionDate(section.title)}
            </Text>
          )}
          renderItem={({ item, index, section }) => {
            const isExpense = item.type === 'expense';
            const icon: keyof typeof Ionicons.glyphMap = isExpense
              ? (CATEGORY_ICONS[item.title] ?? 'ellipsis-horizontal')
              : 'wallet';
            const gradient = isExpense ? 'primary' : 'success';
            const isLast = index === section.data.length - 1;

            return (
              <LinearGradient colors={colors.gradients.surface} style={{ borderRadius: 16, overflow: 'hidden' }}>
                <View style={[homeStyles.activityItem, !isLast && homeStyles.activityItemBorder]}>
                  <LinearGradient colors={colors.gradients[gradient]} style={homeStyles.activityIcon}>
                    <Ionicons name={icon} size={18} color="#fff" />
                  </LinearGradient>
                  <View style={homeStyles.activityInfo}>
                    <Text style={homeStyles.activityItemTitle}>{item.title}</Text>
                    <Text style={homeStyles.activityItemDate}>{formatTime(item.createdAt)}</Text>
                  </View>
                  <Text
                    style={[
                      homeStyles.activityAmount,
                      isExpense ? homeStyles.activityAmountNegative : homeStyles.activityAmountPositive,
                    ]}
                  >
                    {isExpense ? '- ' : '+ '}₱{item.amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </LinearGradient>
            );
          }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HistoryScreen;
