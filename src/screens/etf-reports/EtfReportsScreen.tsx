import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Linking,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { EtfReportCard } from './components/EtfReportCard';
import { EtfReport } from './types';
import { fetchEtfReports } from '../../services/api';

const EtfReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [etfReports, setEtfReports] = useState<EtfReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar relatórios de ETFs
  const loadEtfReports = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }

    try {
      const result = await fetchEtfReports();
      
      if (result.error) {
        Alert.alert('Erro', result.error);
        setEtfReports([]);
        return;
      }

      if (result.data) {
        setEtfReports(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar ETFs:', error);
      Alert.alert('Erro', 'Não foi possível carregar os relatórios de ETFs');
      setEtfReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEtfReports();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadEtfReports(true);
  };

  // Abrir PDF
  const openPDF = async (pdfUrl: string) => {
    try {
      // Converter URL do Google Drive para formato de download direto
      let directUrl = pdfUrl;
      
      if (pdfUrl.includes('drive.google.com/file/d/')) {
        // Extrair o ID do arquivo do Google Drive
        const fileId = pdfUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1];
        if (fileId) {
          // Converter para URL de download direto
          directUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
        }
      }
      
      const supported = await Linking.canOpenURL(directUrl);
      
      if (supported) {
        await Linking.openURL(directUrl);
      } else {
        // Fallback: tentar abrir no navegador
        const browserUrl = pdfUrl.includes('drive.google.com') 
          ? pdfUrl.replace('/view', '/preview')
          : pdfUrl;
        
        await Linking.openURL(browserUrl);
      }
    } catch (error) {
      console.error('Erro ao abrir PDF:', error);
      Alert.alert(
        'Erro ao abrir PDF', 
        'Não foi possível abrir o PDF. Tente acessar pelo navegador.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Abrir no navegador', 
            onPress: () => Linking.openURL(pdfUrl)
          }
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Botão Voltar */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="trending-up" size={28} color="#10B981" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>ETFs Relatórios</Text>
            <Text style={styles.headerSubtitle}>
              Relatórios e análises de ETFs em PDF
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#10B981" />
            <Text style={styles.loadingText}>Carregando relatórios de ETFs...</Text>
          </View>
        ) : etfReports.length > 0 ? (
          <>
            {/* Lista de Relatórios de ETFs */}
            <View style={styles.reportsContainer}>
              {etfReports.map((report, index) => (
                <EtfReportCard
                  key={report._id || `etf-report-${index}`}
                  report={report}
                  onPress={() => openPDF(report.fileUrl)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="trending-up-outline" size={64} color="#475569" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum relatório de ETF encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Não há relatórios de ETFs disponíveis no momento
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111548',
  },
  header: {
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)',
    paddingTop: 32,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.5)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  reportsContainer: {
    gap: 16,
    marginTop: 20,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#94A3B8',
    textAlign: 'center',
  },
});

export default EtfReportsScreen;
