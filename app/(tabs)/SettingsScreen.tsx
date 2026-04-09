import { createSettingsStyles } from '@/assets/styles/settings.styles';

import Preferences from '@/components/Preferences';

import { useTheme } from '@/hooks/useTheme';
import { useAuthActions } from '@convex-dev/auth/react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const { colors } = useTheme();
  const { signOut } = useAuthActions();

  const settingsStyles = createSettingsStyles(colors);

  return (
    <LinearGradient colors={colors.gradients.background} style={settingsStyles.container}>
      <SafeAreaView style={settingsStyles.safeArea}>
        {/* HEADER */}
        <View style={settingsStyles.header}>
          <View style={settingsStyles.titleContainer}>
            <LinearGradient colors={colors.gradients.primary} style={settingsStyles.iconContainer}>
              <Ionicons name="settings" size={28} color="#ffffff" />
            </LinearGradient>
            <Text style={settingsStyles.title}>Settings</Text>
          </View>
        </View>

        <ScrollView
          style={settingsStyles.scrollView}
          contentContainerStyle={settingsStyles.content}
          showsVerticalScrollIndicator={false}
        >
          <Preferences />

          {/* SIGN OUT */}
          <LinearGradient colors={colors.gradients.surface} style={settingsStyles.section}>
            <Text style={settingsStyles.sectionTitleDanger}>Account</Text>
            <TouchableOpacity style={settingsStyles.actionButton} onPress={() => signOut()}>
              <View style={settingsStyles.actionLeft}>
                <LinearGradient colors={colors.gradients.danger} style={settingsStyles.actionIcon}>
                  <Ionicons name="log-out-outline" size={18} color="#fff" />
                </LinearGradient>
                <Text style={settingsStyles.actionTextDanger}>Sign Out</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.danger} />
            </TouchableOpacity>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};
export default SettingsScreen;
