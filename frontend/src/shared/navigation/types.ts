/**
 * ============================================================================
 * NAVIGATION TYPES
 * ============================================================================
 * Types pour React Navigation - élimine les erreurs "any"
 */

import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Register: undefined;
  Login: undefined;
  Home: undefined;
  Dashboard: undefined;
};

export type RegisterScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Register'
>;

export type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;

export interface NavigationProps {
  navigation: RegisterScreenNavigationProp | LoginScreenNavigationProp;
}
