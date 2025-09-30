import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { HomeVideo } from '../../../types/video';

interface VideoModalProps {
  visible: boolean;
  video: HomeVideo | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ visible, video, onClose }) => {
  if (!video) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data não disponível';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleOpenYouTube = () => {
    if (video.url) {
      Linking.openURL(video.url);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        {/* Backdrop */}
        <TouchableOpacity 
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Modal Content */}
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="play" size={20} color="#A78BFA" />
              </View>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle} numberOfLines={1}>
                  {video.title}
                </Text>
              </View>
            </View>
            
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={24} color="#CBD5E1" />
            </TouchableOpacity>
          </View>

          {/* YouTube Player */}
          <View style={styles.videoPlayerContainer}>
            <WebView
              style={styles.videoPlayer}
              source={{
                uri: `https://www.youtube.com/embed/${video.videoId}?autoplay=0&modestbranding=1&rel=0`,
              }}
              allowsFullscreenVideo={true}
              mediaPlaybackRequiresUserAction={false}
              javaScriptEnabled={true}
              scrollEnabled={false}
            />
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {/* Video Info */}
            <View style={styles.videoInfo}>
              <Text style={styles.videoTitle}>{video.title}</Text>
              <Text style={styles.videoDescription}>
                {video.description || 'Sem descrição disponível'}
              </Text>
            </View>

            {/* Metadata */}
            <View style={styles.metadataContainer}>
              <View style={styles.metadataItem}>
                <Ionicons name="calendar" size={16} color="#60A5FA" />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Data</Text>
                  <Text style={styles.metadataValue}>{formatDate(video.createdAt)}</Text>
                </View>
              </View>

              <View style={styles.metadataItem}>
                <Ionicons name="person" size={16} color="#34D399" />
                <View style={styles.metadataTextContainer}>
                  <Text style={styles.metadataLabel}>Autor</Text>
                  <Text style={styles.metadataValue}>Lucas FII</Text>
                </View>
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity 
              style={styles.youtubeButton}
              onPress={handleOpenYouTube}
              activeOpacity={0.8}
            >
              <Ionicons name="open-outline" size={20} color="#FFFFFF" />
              <Text style={styles.youtubeButtonText}>Abrir no YouTube</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  modalContent: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    maxHeight: '85%',
    width: '100%',
    maxWidth: 500,
    borderWidth: 1,
    borderColor: 'rgba(51, 65, 85, 0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(51, 65, 85, 0.5)',
    backgroundColor: 'rgba(124, 58, 237, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.5)',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(100, 116, 139, 0.5)',
  },
  videoPlayerContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#000',
  },
  videoPlayer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  videoInfo: {
    padding: 20,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    lineHeight: 32,
  },
  videoDescription: {
    fontSize: 16,
    color: '#CBD5E1',
    lineHeight: 24,
  },
  metadataContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metadataItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(51, 65, 85, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(71, 85, 105, 0.5)',
  },
  metadataTextContainer: {
    flex: 1,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 2,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginHorizontal: 20,
    marginBottom: 32,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#FF0000',
    shadowColor: '#FF0000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  youtubeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
