import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';

const ProductsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { user } = useUser();

  const handleEtfReportsPress = () => {
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
      // Navegar para a tab do catálogo
      (navigation as any).navigate('MainTabs', { 
        screen: 'Catalog', 
        params: { screen: 'EtfReports' } 
      });
    } else {
      Alert.alert(
        'Plano Necessário',
        'Para acessar os relatórios de ETFs, você precisa do plano Basic, Annual ou ETFs Wallet. Acesse lucasfiiresearch.com.br para adquirir seu plano.',
        [{ text: 'Entendi', style: 'default' }]
      );
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Produtos</Text>
          <Text style={styles.subtitle}>Explore nossos ETFs recomendados</Text>
        </View>

        {/* Card de ETFs com Relatórios */}
        <TouchableOpacity style={styles.card} onPress={handleEtfReportsPress}>
          <View style={[styles.cardGradient, { backgroundColor: '#10B981' }]} />
          <View style={[styles.iconContainer, { backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: '#10B981' }]}>
            <Ionicons name="document-text" size={32} color="#10B981" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>ETFs</Text>
            <Text style={styles.cardDescription}>
              Relatórios em PDFs
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </View>
          <View style={[styles.decorativeLine, { backgroundColor: '#10B981' }]} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
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
    marginBottom: 24,
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
});

export default ProductsScreen;
