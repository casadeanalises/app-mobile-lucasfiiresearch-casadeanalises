import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { CatalogStackParamList } from '../types';

type NavigationProp = StackNavigationProp<CatalogStackParamList, 'CatalogHome'>;

const CatalogScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<NavigationProp>();
  const { user } = useUser();
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);

  // Verificar se o usuário tem assinatura (igual à página inicial)
  const getUserSubscription = () => {
    if (!user) return false;
    
    const publicMetadata = user.publicMetadata as any;
    const subscriptionPlan = publicMetadata?.subscriptionPlan;
    
    return subscriptionPlan === 'basic' || 
           subscriptionPlan === 'annualbasic' || 
           subscriptionPlan === 'etfs_wallet' || 
           subscriptionPlan === 'lowcost';
  };

  // Verificar plano quando o usuário muda
  useEffect(() => {
    const hasPlan = getUserSubscription();
    setHasActivePlan(hasPlan);
  }, [user]);

  
  const catalogItems = [
    {
      id: 'investment-thesis',
      title: 'Teses de Investimento',
      description: 'Aprenda sobre estratégias de investimento e análise de mercado',
      icon: 'play-circle' as const,
      color: '#F59E0B',
      gradient: ['rgba(245, 158, 11, 0.2)', 'rgba(245, 158, 11, 0.1)'],
      onPress: () => {
        // Debug: verificar dados do usuário
        console.log('🔍 Dados do usuário:', JSON.stringify(user?.publicMetadata, null, 2));
        
        // Verificar se tem plano básico ou anual (podem acessar tudo)
        const publicMetadata = user?.publicMetadata as any;
        const subscriptionPlan = publicMetadata?.subscriptionPlan;
        const planType = publicMetadata?.planType;
        
        console.log('📋 subscriptionPlan:', subscriptionPlan);
        console.log('📋 planType:', planType);
        
        const hasBasicOrAnnualPlan = subscriptionPlan === 'basic' || 
                                   subscriptionPlan === 'annualbasic' ||
                                   planType === 'basic' || 
                                   planType === 'annual';
        
        console.log('✅ Tem plano básico/anual:', hasBasicOrAnnualPlan);
        
        if (hasBasicOrAnnualPlan) {
          navigation.navigate('InvestmentThesis');
        } else {
          Alert.alert(
            'Plano Necessário',
            'Para acessar as teses de investimento, você precisa do plano Basic ou Annual. Acesse lucasfiiresearch.com.br para adquirir seu plano.',
            [{ text: 'Entendi', style: 'default' }]
          );
        }
      },
    },
    {
      id: 'weekly-reports',
      title: 'Relatório Semanal',
      description: 'Acesse análises detalhadas e relatórios em PDFs',
      icon: 'document-text' as const,
      color: '#8B5CF6',
      gradient: ['rgba(139, 92, 246, 0.2)', 'rgba(139, 92, 246, 0.1)'],
      onPress: () => {
        // Verificar se tem plano básico ou anual (podem acessar tudo)
        const publicMetadata = user?.publicMetadata as any;
        const subscriptionPlan = publicMetadata?.subscriptionPlan;
        const planType = publicMetadata?.planType;
        
        const hasBasicOrAnnualPlan = subscriptionPlan === 'basic' || 
                                   subscriptionPlan === 'annualbasic' ||
                                   planType === 'basic' || 
                                   planType === 'annual';
        
        if (hasBasicOrAnnualPlan) {
          navigation.navigate('WeeklyReports');
        } else {
          Alert.alert(
            'Plano Necessário',
            'Para acessar os relatórios semanais, você precisa do plano Basic ou Annual. Acesse lucasfiiresearch.com.br para adquirir seu plano.',
            [{ text: 'Entendi', style: 'default' }]
          );
        }
      },
    },
    {
      id: 'etf-reports',
      title: 'ETFs',
      description: 'Relatórios em PDFs - Acesse relatórios e análises de ETFs em PDF',
      icon: 'document-text' as const,
      color: '#10B981',
      gradient: ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0.1)'],
      onPress: () => {
        // Verificar se tem plano básico, anual ou etfs_wallet
        const publicMetadata = user?.publicMetadata as any;
        const subscriptionPlan = publicMetadata?.subscriptionPlan;
        const planType = publicMetadata?.planType;
        
        const hasValidPlan = subscriptionPlan === 'basic' || 
                           subscriptionPlan === 'annualbasic' ||
                           subscriptionPlan === 'etfs_wallet' ||
                           planType === 'basic' || 
                           planType === 'annual' ||
                           planType === 'etfs_wallet';
        
        if (hasValidPlan) {
          navigation.navigate('EtfReports');
        } else {
          Alert.alert(
            'Plano Necessário',
            'Para acessar os relatórios de ETFs, você precisa do plano Basic, Annual ou ETFs Wallet. Acesse lucasfiiresearch.com.br para adquirir seu plano.',
            [{ text: 'Entendi', style: 'default' }]
          );
        }
      },
    },
  ];

  // Mostrar loading enquanto verifica o plano
  if (hasActivePlan === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Verificando seu plano...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Catálogo</Text>
          <Text style={styles.subtitle}>
            Explore nossos conteúdos e recursos
          </Text>
        </View>
        
        {/* Grid de Cards */}
        <View style={styles.gridContainer}>
          {catalogItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={item.onPress}
              activeOpacity={0.8}
            >
              {/* Gradiente de fundo */}
              <View style={[styles.cardGradient, { 
                backgroundColor: item.gradient[0] 
              }]} />
              
              {/* Ícone */}
              <View style={[styles.iconContainer, { 
                backgroundColor: item.gradient[0],
                borderColor: item.color + '40',
              }]}>
                <Ionicons name={item.icon} size={32} color={item.color} />
              </View>

              {/* Conteúdo */}
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
              </View>

              {/* Seta de navegação */}
              <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={item.color} />
              </View>

              {/* Linha decorativa */}
              <View style={[styles.decorativeLine, { backgroundColor: item.color }]} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Placeholder para mais conteúdo */}
        <View style={styles.comingSoon}>
          <View style={styles.comingSoonIcon}>
            <Ionicons name="rocket-outline" size={32} color="#64748B" />
          </View>
          <Text style={styles.comingSoonTitle}>Mais conteúdo em breve!</Text>
          <Text style={styles.comingSoonText}>
            Estamos trabalhando para trazer mais recursos e funcionalidades para você
          </Text>
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
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
  },
  gridContainer: {
    gap: 16,
    marginBottom: 32,
  },
  card: {
    position: 'relative',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    opacity: 0.3,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    margin: 20,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
  },
  arrowContainer: {
    position: 'absolute',
    top: 24,
    right: 20,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  decorativeLine: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
  comingSoon: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  comingSoonIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  comingSoonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111548',
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CatalogScreen;
