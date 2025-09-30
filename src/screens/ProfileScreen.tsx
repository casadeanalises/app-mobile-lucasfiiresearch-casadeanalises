import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser, useAuth } from '@clerk/clerk-expo';
import Button from '../components/Button';

const ProfileScreen: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair da conta');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Text style={styles.title}>Perfil</Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.infoLabel}>Nome:</Text>
          <Text style={styles.infoText}>
            {user?.firstName} {user?.lastName}
          </Text>
          
          <Text style={styles.infoLabel}>Email:</Text>
          <Text style={styles.infoText}>
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Sair da conta"
            onPress={handleSignOut}
            variant="outline"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111548',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  userInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 12,
    marginBottom: 32,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#B0B0B0',
    marginBottom: 8,
    marginTop: 16,
  },
  infoText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actions: {
    gap: 16,
  },
});

export default ProfileScreen;
