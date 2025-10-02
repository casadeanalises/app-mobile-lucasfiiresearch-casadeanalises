import React from 'react';
import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import { TopNavbar } from '../components/TopNavbar';

export type RootStackParamList = {
  MainTabs: undefined;
  Profile: undefined;
  Notifications: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const withTopNav = (Component: React.ComponentType, showBackButton: boolean = false) => {
  return () => (
    <View style={{ flex: 1 }}>
      <TopNavbar showBackButton={showBackButton} />
      <Component />
    </View>
  );
};

const RootStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="MainTabs" component={withTopNav(MainTabNavigator)} />
      <Stack.Screen name="Profile" component={withTopNav(ProfileScreen, true)} />
      <Stack.Screen name="Notifications" component={withTopNav(NotificationsScreen, true)} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
