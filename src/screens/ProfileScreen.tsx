import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser, useAuth } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import { BiometricService } from '../services/biometric';

const ProfileScreen: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const insets = useSafeAreaInsets();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometria');

  // Verificar status da biometria ao carregar
  useEffect(() => {
    const checkBiometricStatus = async () => {
      const available = await BiometricService.isAvailable();
      const enabled = await BiometricService.isEnabled();
      const type = await BiometricService.getBiometricType();
      
      setBiometricAvailable(available);
      setBiometricEnabled(enabled);
      setBiometricType(type);
    };

    checkBiometricStatus();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erro', 'Falha ao sair da conta');
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (value) {
      // Habilitar biometria
      const result = await BiometricService.enableBiometric();
      if (result.success) {
        setBiometricEnabled(true);
        Alert.alert(
          'Biometria Habilitada',
          `Agora você pode usar ${biometricType.toLowerCase()} para acessar o app mais rapidamente.`
        );
      } else {
        Alert.alert('Erro', result.error || 'Falha ao habilitar biometria');
      }
    } else {
      // Desabilitar biometria
      Alert.alert(
        'Desabilitar Biometria',
        'Tem certeza que deseja desabilitar o acesso biométrico?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Desabilitar',
            style: 'destructive',
            onPress: async () => {
              await BiometricService.disableBiometric();
              setBiometricEnabled(false);
            }
          }
        ]
      );
    }
  };

  const menuItems = [
    {
      id: 'edit-profile',
      title: 'Editar Perfil',
      icon: 'person-outline',
      onPress: () => Alert.alert(
        'Editar Perfil',
        'Para editar seu perfil, acesse o site Lucas FII Research em lucasfiiresearch.com.br',
        [
          { text: 'Entendi', style: 'default' }
        ]
      ),
    },
    {
      id: 'change-password',
      title: 'Alterar Senha',
      icon: 'lock-closed-outline',
      onPress: () => Alert.alert(
        'Alterar Senha',
        'Para alterar sua senha, acesse o site Lucas FII Research em lucasfiiresearch.com.br',
        [
          { text: 'Entendi', style: 'default' }
        ]
      ),
    },
    {
      id: 'notifications',
      title: 'Notificações',
      icon: 'notifications-outline',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento'),
    },
    {
      id: 'biometric',
      title: 'Acesso por Biometria',
      icon: 'finger-print-outline',
      onPress: () => {}, // Será tratado separadamente
      isToggle: true,
    },
    {
      id: 'settings',
      title: 'Configurações',
      icon: 'settings-outline',
      onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento'),
    },
    {
      id: 'about',
      title: 'Sobre o App',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Sobre', 'Versão do App: 1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          {/* <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={40} color="#FFFFFF" />
            </View>
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View> */}
          
          <Text style={styles.userName}>
            {user?.username || user?.firstName || user?.fullName || 'Usuário'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.emailAddresses[0]?.emailAddress}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <View key={item.id}>
              {item.id === 'biometric' ? (
                // Item especial para biometria com switch
                <View style={[styles.menuItem, styles.biometricItem]}>
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                    </View>
                    <View style={styles.biometricTextContainer}>
                      <Text style={styles.menuText}>{item.title}</Text>
                      {biometricAvailable ? (
                        <Text style={styles.biometricSubtext}>
                          {biometricType} disponível
                        </Text>
                      ) : (
                        <Text style={styles.biometricSubtextDisabled}>
                          Não disponível neste dispositivo
                        </Text>
                      )}
                    </View>
                  </View>
                  <Switch
                    value={biometricEnabled}
                    onValueChange={handleBiometricToggle}
                    disabled={!biometricAvailable}
                    trackColor={{ false: '#374151', true: '#3B82F6' }}
                    thumbColor={biometricEnabled ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
              ) : (
                // Itens normais do menu
                <TouchableOpacity
                  style={[
                    styles.menuItem,
                    index === menuItems.length - 1 && styles.lastMenuItem
                  ]}
                  onPress={item.onPress}
                  activeOpacity={0.7}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Ionicons name={item.icon as any} size={20} color="#3B82F6" />
                    </View>
                    <Text style={styles.menuText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              </View>
              <Text style={[styles.menuText, { color: '#EF4444' }]}>Sair da Conta</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1E293B',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#94A3B8',
  },
  menuSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  biometricItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  biometricTextContainer: {
    flex: 1,
  },
  biometricSubtext: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 2,
  },
  biometricSubtextDisabled: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 2,
  },
});

export default ProfileScreen;
