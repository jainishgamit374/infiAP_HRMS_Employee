import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useUser } from '@/context/UserContext';

export default function SharedLayout() {
  const { isAuthenticated, isHydrating } = useUser();

  if (isHydrating) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="company-overview" />
      <Stack.Screen name="directory" />
      <Stack.Screen name="documents" />
      <Stack.Screen name="news-events" />
      <Stack.Screen name="org-structure" />
    </Stack>
  );
}
