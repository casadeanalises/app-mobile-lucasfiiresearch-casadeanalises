import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@clerk/clerk-expo';
import { RootStackParamList } from '../types';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import VerifyEmailScreen from '../screens/VerifyEmailScreen';
import HomeScreen from '../screens/HomeScreen';
import LoadingScreen from '../components/LoadingScreen';
import { useAppLoading } from '../hooks/useAppLoading';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const isAppLoading = useAppLoading();

  // Mostrar loading se o app está carregando ou se o Clerk não carregou
  if (isAppLoading || !isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isSignedIn ? (
          // Usuário logado
          <Stack.Screen name="Home" component={HomeScreen} />
        ) : (
          // Usuário não logado
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
