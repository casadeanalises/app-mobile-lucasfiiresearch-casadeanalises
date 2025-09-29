import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import Button from '../components/Button';
import LoadingScreen from '../components/LoadingScreen';

const HomeScreen: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [showLoading, setShowLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair da conta');
    }
  };

  const handleShowLoading = () => {
    setShowLoading(true);
    setTimeout(() => {
      setShowLoading(false);
    }, 3000);
  };

  if (showLoading) {
    return <LoadingScreen />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Bem-vindo!</Text>
        <Text style={styles.subtitle}>
          Olá, {user?.firstName || 'Usuário'}!
        </Text>
        
        <View style={styles.userInfo}>
          <Text style={styles.infoText}>
            Email: {user?.emailAddresses[0]?.emailAddress}
          </Text>
          <Text style={styles.infoText}>
            Nome: {user?.firstName} {user?.lastName}
          </Text>
        </View>

        <View style={styles.actions}>
          <Button
            title="Testar Loading"
            onPress={handleShowLoading}
            variant="primary"
          />
          
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
    backgroundColor: '#FFFFFF',
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
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  userInfo: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 32,
  },
  infoText: {
    fontSize: 16,
    color: '#000000',
    marginBottom: 8,
  },
  actions: {
    gap: 16,
  },
});

export default HomeScreen;
