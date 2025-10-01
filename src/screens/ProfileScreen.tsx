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
  Image,
  Modal,
  Linking,
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
  const [showUserProfile, setShowUserProfile] = useState(false);

  // Verificar status da biometria
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


  const handleEditPhoto = () => {
    Alert.alert(
      'Editar Foto',
      'Para editar sua foto de perfil, acesse o site Lucas FII Research',
      [
        {
          text: 'Abrir no Site',
          onPress: () => {
            Linking.openURL('https://lucasfiiresearch.com.br');
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ]
    );
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
      onPress: () => setShowUserProfile(true),
    },
    // {
    //   id: 'change-password',
    //   title: 'Alterar Senha',
    //   icon: 'lock-closed-outline',
    //   onPress: () => setShowUserProfile(true),
    // },
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
      onPress: () => {}, 
      isToggle: true,
    },
    // {
    //   id: 'settings',
    //   title: 'Configurações',
    //   icon: 'settings-outline',
    //   onPress: () => Alert.alert('Em breve', 'Funcionalidade em desenvolvimento'),
    // },
    {
      id: 'about',
      title: 'Sobre o App',
      icon: 'information-circle-outline',
      onPress: () => Alert.alert('Sobre', 'Versão do App: 1.0.0'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meu Perfil</Text>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <TouchableOpacity style={styles.avatar} onPress={handleEditPhoto}>
            {user?.imageUrl ? (
              <Image source={{ uri: user.imageUrl }} style={styles.avatarImage} />
            ) : (
              <Ionicons name="person" size={40} color="#FFFFFF" />
            )}
          </TouchableOpacity>
          
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

      {/* Modal para gerenciar conta */}
      <Modal
        visible={showUserProfile}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowUserProfile(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Gerenciar Conta</Text>
            <TouchableOpacity
              onPress={() => setShowUserProfile(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Editar Perfil</Text>
              <Text style={styles.modalSectionDescription}>
                Para editar seu perfil, alterar foto, nome e informações pessoais
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowUserProfile(false);
                  Linking.openURL('https://lucasfiiresearch.com.br');
                }}
              >
                <Ionicons name="person-outline" size={20} color="#3B82F6" />
                <Text style={styles.modalButtonText}>Abrir no Site</Text>
                <Ionicons name="open-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Segurança</Text>
              <Text style={styles.modalSectionDescription}>
                Para alterar senha, gerenciar autenticação e configurações de segurança
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowUserProfile(false);
                  Linking.openURL('https://lucasfiiresearch.com.br');
                }}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color="#3B82F6" />
                <Text style={styles.modalButtonText}>Abrir no Site</Text>
                <Ionicons name="open-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Conta Conectada</Text>
              <Text style={styles.modalSectionDescription}>
                Para gerenciar conta do Google
              </Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  setShowUserProfile(false);
                  Linking.openURL('https://lucasfiiresearch.com.br');
                }}
              >
                <Ionicons name="link-outline" size={20} color="#3B82F6" />
                <Text style={styles.modalButtonText}>Abrir no Site</Text>
                <Ionicons name="open-outline" size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 50,
  },
  header: {
    paddingTop: 40,
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
    marginBottom: 30,
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
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
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
    marginBottom: 16,
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
    marginBottom: 30,
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
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSection: {
    marginTop: 24,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  modalSectionDescription: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 16,
    lineHeight: 20,
  },
  modalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  modalButtonText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
    fontWeight: '500',
  },
});

export default ProfileScreen;
