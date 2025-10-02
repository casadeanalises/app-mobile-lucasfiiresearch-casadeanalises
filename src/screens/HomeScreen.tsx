import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const { user, isLoaded } = useUser();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Atualizar hora a cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Verificar se o usuário tem assinatura
  const getUserSubscription = () => {
    const publicMetadata = user?.publicMetadata as any;
    const subscriptionPlan = publicMetadata?.subscriptionPlan;
    
    if (subscriptionPlan === 'basic' || subscriptionPlan === 'annualbasic' || 
        subscriptionPlan === 'etfs_wallet' || subscriptionPlan === 'lowcost') {
      return {
        hasSubscription: true,
        type: subscriptionPlan,
        displayName: getSubscriptionDisplayName(subscriptionPlan)
      };
    }
    
    return { hasSubscription: false, type: null, displayName: null };
  };

  const getSubscriptionDisplayName = (type: string) => {
    switch (type) {
      case 'basic': return 'Básica (Mensal)';
      case 'annualbasic': return 'Básica (Anual)';
      case 'etfs_wallet': return 'ETFs Wallet';
      case 'lowcost': return 'Low Cost';
      default: return 'Plano Gratuito';
    }
  };

  const formatDate = (date: Date) => {
    const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
    const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 
                   'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName}, ${day} de ${month} de ${year}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const subscription = getUserSubscription();

  // Mostrar loading enquanto o usuário não foi carregado
  if (!isLoaded) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              <Ionicons name="sparkles" size={24} color="#87CEEB" /> 
            </View>
            <View style={styles.greetingContainer}>
              <Text style={[styles.greeting, { color: '#87CEEB' }]}>
                {getGreeting()}, <Text style={[styles.userName, { color: '#87CEEB' }]}>carregando...</Text>!
              </Text>
              <View style={[styles.greetingUnderline, { backgroundColor: '#87CEEB' }]} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
      >

        {/* Card de boas-vindas e plano */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeIconContainer}>
              <Ionicons name="sparkles" size={24} color="#10B981" />
            </View>
            <Text style={styles.welcomeTitle}>
              {getGreeting()}, {user?.username || user?.firstName || user?.fullName || 'Usuário'}!
            </Text>
          </View>

          <Text style={styles.welcomeText}>
            Estamos felizes em tê-lo conosco. Explore nossa plataforma, muitas novidades em breve!
          </Text>

          <View style={styles.dateTimeContainer}>
            <Ionicons name="time-outline" size={20} color="#87CEEB" />
            <Text style={styles.dateTimeText}>{formatDate(currentTime)}</Text>
          </View>
          <Text style={styles.timeText}>{formatTime(currentTime)}</Text>

          <View style={styles.planSection}>
            <View style={[
              styles.planButton,
              { backgroundColor: subscription.hasSubscription ? 'rgba(76, 175, 80, 0.1)' : 'rgba(220, 53, 69, 0.1)' }
            ]}>
              <Ionicons 
                name={subscription.hasSubscription ? "star" : "lock-closed"} 
                size={20} 
                color={subscription.hasSubscription ? "#4CAF50" : "#DC3545"} 
              />
              <Text style={[
                styles.planText,
                { color: subscription.hasSubscription ? "#4CAF50" : "#DC3545" }
              ]}>
                Seu plano atual
              </Text>
              <Text style={[
                styles.planName,
                { color: subscription.hasSubscription ? "#4CAF50" : "#DC3545" }
              ]}>
                {subscription.hasSubscription ? subscription.displayName : 'Não possui um plano ativo'}
              </Text>
              {subscription.hasSubscription && (
                <View style={[
                  styles.planBadge,
                  { backgroundColor: 'rgba(76, 175, 80, 0.2)' }
                ]}>
                  <Text style={styles.planBadgeText}>ATIVO</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Seção de Acesso Rápido */}
        <View style={styles.quickAccessSection}>
          <Text style={styles.sectionTitle}>Acesso Rápido</Text>
          <View style={styles.quickAccessGrid}>
            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => navigation.navigate('Products')}
            >
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(16, 185, 129, 0.2)' }]}>
                <Ionicons name="cube" size={24} color="#10B981" />
              </View>
              <Text style={styles.cardTitle}>Produtos</Text>
              <Text style={styles.cardDescription}>Acesse nossos produtos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => navigation.navigate('Catalog')}
            >
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(79, 70, 229, 0.2)' }]}>
                <Ionicons name="grid" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.cardTitle}>Catálogo</Text>
              <Text style={styles.cardDescription}>Explore nosso conteúdo</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(245, 158, 11, 0.2)' }]}>
                <Ionicons name="person" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.cardTitle}>Perfil</Text>
              <Text style={styles.cardDescription}>Gerencie sua conta</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.quickAccessCard}
              onPress={() => navigation.navigate('Notifications')}
            >
              <View style={[styles.cardIcon, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
                <Ionicons name="notifications" size={24} color="#EF4444" />
              </View>
              <Text style={styles.cardTitle}>Notificações</Text>
              <Text style={styles.cardDescription}>Veja suas atualizações</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111548',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#87CEEB',
    marginBottom: 4,
  },
  userName: {
    color: '#87CEEB',
  },
  greetingUnderline: {
    height: 2,
    backgroundColor: '#DC3545',
    width: 60,
  },
  welcomeCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 24,
    marginBottom: 32,
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  welcomeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: '#94A3B8',
    lineHeight: 24,
    marginBottom: 24,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTimeText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#87CEEB',
  },
  timeText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  planSection: {
    marginTop: 24,
  },
  planButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  planText: {
    fontSize: 12,
    fontWeight: '500',
  },
  planName: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  planBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  quickAccessSection: {
    marginTop: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickAccessGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickAccessCard: {
    width: '47%',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 16,
  },
});

export default HomeScreen;
