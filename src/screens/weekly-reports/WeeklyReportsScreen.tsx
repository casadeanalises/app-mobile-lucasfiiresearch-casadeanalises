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
import { ReportCard } from './components/ReportCard';
import { Report } from './types';
import { fetchReports } from '../../services/api';

const WeeklyReportsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar relatórios
  const loadReports = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }

    try {
      const result = await fetchReports();
      
      if (result.error) {
        Alert.alert('Erro', result.error);
        setReports([]);
        return;
      }

      if (result.data) {
        setReports(result.data);
      }
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error);
      Alert.alert('Erro', 'Não foi possível carregar os relatórios');
      setReports([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadReports(true);
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
            <Ionicons name="document-text" size={28} color="#8B5CF6" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Relatórios Semanais</Text>
            <Text style={styles.headerSubtitle}>
              Análises detalhadas e relatórios em PDF
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
            tintColor="#8B5CF6"
            colors={['#8B5CF6']}
          />
        }
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
            <Text style={styles.loadingText}>Carregando relatórios...</Text>
          </View>
        ) : reports.length > 0 ? (
          <>
            {/* Lista de Relatórios */}
            <View style={styles.reportsContainer}>
              {reports.map((report, index) => (
                <ReportCard
                  key={report._id || `report-${index}`}
                  report={report}
                  onPress={() => openPDF(report.url)}
                />
              ))}
            </View>
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="document-text-outline" size={64} color="#475569" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum relatório encontrado</Text>
            <Text style={styles.emptySubtitle}>
              Não há relatórios disponíveis no momento
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
    backgroundColor: '#0F172A',
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
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
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
    marginBottom: 24,
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

export default WeeklyReportsScreen;

