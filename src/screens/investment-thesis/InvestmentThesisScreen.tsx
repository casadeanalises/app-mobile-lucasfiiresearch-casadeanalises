import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { HomeVideo } from '../../types/video';
import { fetchVideos } from '../../services/api';
import { VideoCard } from './components/VideoCard';
import { VideoModal } from './components/VideoModal';

const InvestmentThesisScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { getToken } = useAuth();
  
  // Estados
  const [videos, setVideos] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<HomeVideo | null>(null);
  const [visibleVideos, setVisibleVideos] = useState(6);

  // Carregar vídeos
  const loadVideos = async (isRefreshing = false) => {
    if (!isRefreshing) {
      setLoading(true);
    }

    const result = await fetchVideos(getToken);

    if (result.error) {
      Alert.alert('Erro', result.error);
      setVideos([]);
    } else if (result.data) {
      setVideos(result.data);
    }

    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    loadVideos();
  }, []);

  // Refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadVideos(true);
  };

  // Filtrar vídeos por busca
  const filteredVideos = useMemo(() => {
    if (!searchTerm) return videos;

    const term = searchTerm.toLowerCase();
    return videos.filter(
      (video) =>
        video.title?.toLowerCase().includes(term) ||
        video.description?.toLowerCase().includes(term)
    );
  }, [videos, searchTerm]);

  // Carregar mais vídeos
  const loadMoreVideos = () => {
    setVisibleVideos(prev => prev + 6);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header com gradiente */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Ionicons name="play-circle" size={28} color="#FFFFFF" />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Teses de Investimento</Text>
            <Text style={styles.headerSubtitle}>
            Aprenda sobre estratégias de investimento, análise de mercado e conceitos fundamentais dos FIIs.
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
            tintColor="#F59E0B"
            colors={['#F59E0B']}
          />
        }
      >
        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="play-circle" size={24} color="#F59E0B" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>{videos.length}</Text>
              <Text style={styles.statLabel}>Vídeos Disponíveis</Text>
            </View>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, styles.statIconGreen]}>
              <Ionicons name="film" size={24} color="#10B981" />
            </View>
            <View style={styles.statTextContainer}>
              <Text style={styles.statValue}>Racional</Text>
              <Text style={styles.statLabel}>da Carteira</Text>
            </View>
          </View>
        </View>

        {/* Campo de busca */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#94A3B8" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar vídeos..."
              placeholderTextColor="#64748B"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            {searchTerm !== '' && (
              <TouchableOpacity 
                onPress={() => setSearchTerm('')}
                style={styles.clearButton}
              >
                <Ionicons name="close-circle" size={20} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Indicador de busca ativa */}
        {searchTerm !== '' && (
          <View style={styles.searchActiveContainer}>
            <Text style={styles.searchActiveText}>
              Filtros ativos: Busca "{searchTerm}"
            </Text>
            <TouchableOpacity 
              onPress={() => setSearchTerm('')}
              style={styles.searchActiveClear}
            >
              <Ionicons name="close" size={16} color="#F59E0B" />
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de vídeos */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#F59E0B" />
            <Text style={styles.loadingText}>Carregando vídeos...</Text>
          </View>
        ) : filteredVideos.length > 0 ? (
          <>
            <View style={styles.videosContainer}>
              {filteredVideos.slice(0, visibleVideos).map((video) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onPress={() => setSelectedVideo(video)}
                />
              ))}
            </View>

            {/* Botão Carregar Mais */}
            {visibleVideos < filteredVideos.length && (
              <TouchableOpacity 
                style={styles.loadMoreButton}
                onPress={loadMoreVideos}
                activeOpacity={0.8}
              >
                <Text style={styles.loadMoreText}>Carregar Mais Vídeos</Text>
                <Ionicons name="chevron-down" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="play-circle-outline" size={64} color="#475569" />
            </View>
            <Text style={styles.emptyTitle}>Nenhum vídeo encontrado</Text>
            <Text style={styles.emptySubtitle}>
              {searchTerm
                ? 'Tente ajustar os filtros de busca'
                : 'Não há vídeos disponíveis no momento'}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Modal do vídeo */}
      <VideoModal
        visible={selectedVideo !== null}
        video={selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  statIconGreen: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  statTextContainer: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
  },
  clearButton: {
    padding: 4,
  },
  searchActiveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignSelf: 'flex-start',
  },
  searchActiveText: {
    fontSize: 14,
    color: '#F59E0B',
    marginRight: 8,
  },
  searchActiveClear: {
    padding: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#94A3B8',
  },
  videosContainer: {
    paddingBottom: 20,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#F59E0B',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 20,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loadMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
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

export default InvestmentThesisScreen;
