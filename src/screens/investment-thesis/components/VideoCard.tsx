import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HomeVideo } from '../../../types/video';

interface VideoCardProps {
  video: HomeVideo;
  onPress: () => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPress }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const thumbnailUrl = video.thumbnail || `https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg`;

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Thumbnail */}
      <View style={styles.thumbnailContainer}>
        <Image
          source={{ uri: thumbnailUrl }}
          style={styles.thumbnail}
          resizeMode="cover"
        />
        
        {/* Botão de play centralizado */}
        <View style={styles.playButtonContainer}>
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </View>

        {/* Data no canto superior direito */}
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{formatDate(video.createdAt)}</Text>
        </View>
      </View>

      {/* Conteúdo do card */}
      <View style={styles.content}>
        {/* Linha decorativa no topo */}
        <View style={styles.decorativeLine} />

        <Text style={styles.title} numberOfLines={2}>
          {video.title}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {video.description || 'Sem descrição disponível'}
        </Text>

        {/* Botão de ação */}
        <TouchableOpacity 
          style={styles.watchButton}
          onPress={onPress}
          activeOpacity={0.7}
        >
          <Ionicons name="play-circle" size={16} color="#F59E0B" />
          <Text style={styles.watchButtonText}>Assistir Vídeo</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  thumbnailContainer: {
    position: 'relative',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  dateContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  dateText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    padding: 16,
  },
  decorativeLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#F59E0B',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  description: {
    fontSize: 14,
    color: '#CBD5E1',
    marginBottom: 16,
    lineHeight: 20,
  },
  watchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    gap: 8,
  },
  watchButtonText: {
    color: '#F59E0B',
    fontSize: 14,
    fontWeight: '600',
  },
});
