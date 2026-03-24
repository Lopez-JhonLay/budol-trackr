import { ThemeProvider } from '@/hooks/useTheme';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const isLoggedIn = false;

  useEffect(() => {
    const inTabsGroup = segments[0] === '(tabs)';

    if (!isLoggedIn && inTabsGroup) {
      router.replace('/LoginScreen');
    } else if (isLoggedIn && !inTabsGroup) {
      router.replace('/(tabs)');
    }
  }, [isLoggedIn, segments]);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ThemeProvider>
  );
}
