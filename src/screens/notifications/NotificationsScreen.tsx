import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { fetchNotifications } from '../../services/api';
import NotificationCard from './components/NotificationCard';
import { Notification } from './types';

const NotificationsScreen: React.FC = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    if (!user?.id) {
      setError('Usuário não encontrado');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = await fetchNotifications(user.id);
      if (result.data) {
        setNotifications(result.data);
      } else if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Erro ao carregar notificações. Tente novamente.');
      console.error('Erro ao carregar notificações:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  }, [loadNotifications]);

  const handleNotificationPress = async (notification: Notification) => {
    try {
      // Abrir link
      if (notification.link) {
        const supported = await Linking.canOpenURL(notification.link);
        if (supported) {
          await Linking.openURL(notification.link);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o link');
        }
      }
    } catch (error) {
      console.error('Erro ao abrir notificação:', error);
      Alert.alert('Erro', 'Não foi possível abrir a notificação');
    }
  };


  return (
    <SafeAreaView style={styles.container}>

      {/* Aviso do WhatsApp */}
      <View style={styles.whatsappBanner}>
        <View style={styles.whatsappIconContainer}>
          <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
        </View>
        <View style={styles.whatsappContent}>
          <Text style={styles.whatsappTitle}>Notificações em Tempo Real</Text>
          <Text style={styles.whatsappText}>
            Para receber notificações em tempo real, entre em nossa comunidade no WhatsApp.
            Estas notificações serão apagadas automaticamente.
          </Text>
          <TouchableOpacity 
            style={styles.whatsappButton}
            onPress={() => Linking.openURL('https://chat.whatsapp.com/H9Rj2n2O7hmKsiiI5dpDcV')}
          >
            <Text style={styles.whatsappButtonText}>Entrar no Grupo</Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Carregando notificações...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={50} color="#EF4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadNotifications}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={60} color="#94A3B8" />
          <Text style={styles.emptyText}>Nenhuma notificação disponível</Text>
          <Text style={styles.emptySubtext}>
            Você será notificado quando houver novidades
          </Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <NotificationCard
              notification={item}
              onPress={handleNotificationPress}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#3B82F6"
            />
          }
          showsVerticalScrollIndicator={false}
          bounces={true}
          bouncesZoom={true}
          alwaysBounceVertical={true}
          scrollEventThrottle={16}
          removeClippedSubviews={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  whatsappBanner: {
    backgroundColor: '#1E293B',
    margin: 16,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  whatsappIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 211, 102, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  whatsappContent: {
    flex: 1,
  },
  whatsappTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  whatsappText: {
    fontSize: 14,
    color: '#94A3B8',
    lineHeight: 20,
    marginBottom: 16,
  },
  whatsappButton: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 8,
  },
  whatsappButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#111548',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#94A3B8',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  listContent: {
    padding: 20,
    paddingBottom: 150,
    flexGrow: 1,
  },
});

export default NotificationsScreen;
