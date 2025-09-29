import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const createTokenCache = () => {
  return {
    getToken: async (key: string) => {
      try {
        if (Platform.OS === 'web') {
          return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
      } catch (err) {
        return null;
      }
    },
    saveToken: async (key: string, token: string) => {
      try {
        if (Platform.OS === 'web') {
          return localStorage.setItem(key, token);
        }
        return await SecureStore.setItemAsync(key, token);
      } catch (err) {
        return;
      }
    },
  };
};

export const tokenCache = createTokenCache();
