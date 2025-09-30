import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';

const HomeScreen: React.FC = () => {
  const { user } = useUser();
  const insets = useSafeAreaInsets();
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        {/* Header com ícone e saudação */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="sparkles" size={24} color={subscription.hasSubscription ? '#4CAF50' : '#DC3545'} />
          </View>
          <View style={styles.greetingContainer}>
            <Text style={[styles.greeting, { color: subscription.hasSubscription ? '#4CAF50' : '#87CEEB' }]}>
              {getGreeting()}, <Text style={[styles.userName, { color: subscription.hasSubscription ? '#4CAF50' : '#87CEEB' }]}>{user?.firstName?.toLowerCase() || 'usuário'}!</Text>
            </Text>
            <View style={[styles.greetingUnderline, { backgroundColor: subscription.hasSubscription ? '#4CAF50' : '#DC3545' }]} />
          </View>
        </View>

        {/* Mensagem de boas-vindas */}
        <View style={styles.welcomeSection}>
          <View style={[styles.welcomeLine, { backgroundColor: subscription.hasSubscription ? '#4CAF50' : '#DC3545' }]} />
          <Text style={styles.welcomeText}>
            Estamos felizes em tê-lo conosco. Explore nossa plataforma, muitas novidades em breve!
          </Text>
        </View>

        {/* Data e hora */}
        <View style={styles.dateTimeSection}>
          <View style={[styles.welcomeLine, { backgroundColor: subscription.hasSubscription ? '#4CAF50' : '#DC3545' }]} />
          <View style={styles.dateTimeContainer}>
            <Ionicons name="time-outline" size={20} color={subscription.hasSubscription ? '#4CAF50' : '#DC3545'} />
            <View style={styles.dateTimeText}>
              <Text style={styles.dateText}>{formatDate(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
            </View>
          </View>
        </View>


        {/* Botão do plano de assinatura */}
        <View style={styles.actions}>
          <View style={[
            styles.subscriptionButton,
            !subscription.hasSubscription && styles.subscriptionButtonNoPlan
          ]}>
            <Ionicons 
              name={subscription.hasSubscription ? "star" : "lock-closed"} 
              size={20} 
              color={subscription.hasSubscription ? "#4CAF50" : "#FFFFFF"} 
            />
            <View style={styles.subscriptionButtonContent}>
              <Text style={[
                styles.subscriptionButtonLabel,
                !subscription.hasSubscription && styles.subscriptionButtonLabelNoPlan
              ]}>
                Seu plano atual
              </Text>
              <Text style={[
                styles.subscriptionButtonText,
                !subscription.hasSubscription && styles.subscriptionButtonTextNoPlan
              ]}>
                {subscription.hasSubscription 
                  ? subscription.displayName 
                  : 'Não possui um plano ativo'
                }
              </Text>
            </View>
          </View>
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
  welcomeSection: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  welcomeLine: {
    width: 3,
    backgroundColor: '#DC3545',
    marginRight: 16,
  },
  welcomeText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 24,
  },
  dateTimeSection: {
    flexDirection: 'row',
    marginBottom: 32,
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dateTimeText: {
    marginLeft: 12,
  },
  dateText: {
    fontSize: 14,
    color: '#87CEEB',
    marginBottom: 4,
  },
  timeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actions: {
    gap: 16,
  },
  subscriptionButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  subscriptionButtonNoPlan: {
    backgroundColor: '#DC3545',
    borderColor: '#DC3545',
  },
  subscriptionButtonContent: {
    marginLeft: 8,
    alignItems: 'flex-start',
  },
  subscriptionButtonLabel: {
    fontSize: 12,
    color: '#4CAF50',
    marginBottom: 2,
  },
  subscriptionButtonLabelNoPlan: {
    color: '#FFFFFF',
  },
  subscriptionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  subscriptionButtonTextNoPlan: {
    color: '#FFFFFF',
  },
});

export default HomeScreen;
