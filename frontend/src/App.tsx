import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './features/auth/context/AuthContext';
import LoginScreen from './features/auth/screens/LoginScreen';
import RegisterScreen from './features/auth/screens/RegisterScreen';
import LivresListScreen from './features/livres/screens/LivresListScreen';
import LivreDetailScreen from './features/livres/screens/LivreDetailScreen';
import LivreAddScreen from './features/livres/screens/LivreAddScreen';
import PossessionListScreen from './features/livres/screens/PossessionListScreen';
import AdminDashboard from './features/admin/screens/AdminDashboard';

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  LivresList: undefined;
  LivreDetail: { id: number };
  LivreAdd: undefined;
  Possessions: undefined;
  AdminPanel: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/** ✅ Navigation authentifiée */
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

/** ✅ Navigation app (post-login) */
function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LivresList" component={LivresListScreen} />
      <Stack.Screen name="LivreDetail" component={LivreDetailScreen} />
      <Stack.Screen name="LivreAdd" component={LivreAddScreen} />
      <Stack.Screen name="Possessions" component={PossessionListScreen} />
      <Stack.Screen name="AdminPanel" component={AdminDashboard} />
    </Stack.Navigator>
  );
}

/** ✅ Navigation racine (détermine login ou app) */
function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return isAuthenticated ? <AppStack /> : <AuthStack />;
}

/** ✅ App root avec AuthProvider */
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
