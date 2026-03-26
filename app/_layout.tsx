import { ThemeProvider } from '@/hooks/useTheme';
import { ConvexAuthProvider } from '@convex-dev/auth/react';
import { ConvexReactClient, useConvexAuth } from 'convex/react';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { ActivityIndicator } from 'react-native';

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

const secureStorage = {
  getItem: SecureStore.getItemAsync,
  setItem: SecureStore.setItemAsync,
  removeItem: SecureStore.deleteItemAsync,
};

function InitialLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inTabsGroup = segments[0] === '(tabs)';

    if (isAuthenticated && !inTabsGroup) {
      router.replace('/(tabs)');
    } else if (!isAuthenticated && inTabsGroup) {
      router.replace('/LoginScreen');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) return <ActivityIndicator color="#fff" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <ConvexAuthProvider client={convex} storage={secureStorage}>
        <InitialLayout />
      </ConvexAuthProvider>
    </ThemeProvider>
  );
}
