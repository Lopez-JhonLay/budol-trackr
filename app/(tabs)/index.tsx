import { useTheme } from '@/hooks/useTheme';
import { useAuthActions } from '@convex-dev/auth/react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();

  const { signOut } = useAuthActions();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is your Home Screen content!</Text>
      <TouchableOpacity onPress={() => signOut()}>
        <Text>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
