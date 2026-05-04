import { Redirect, Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useUser } from '@/context/UserContext';

export default function AdminLayout() {
  const { isAuthenticated, isHydrating, user } = useUser();

  if (isHydrating) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Must be authenticated AND have an admin-level role
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  const isAdmin = user.systemRole === 'admin' || user.systemRole === 'main_admin' || user.systemRole === 'hr';
  if (!isAdmin) {
    return <Redirect href="/(employee)/" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="manage-hr" />
    </Stack>
  );
}
