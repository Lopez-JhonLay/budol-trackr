import { useTheme } from '@/hooks/useTheme';
import { Text, View } from 'react-native';

export default function HomeScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is your Home Screen content!</Text>
    </View>
  );
}
