import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Notification } from '../types';

interface NotificationCardProps {
  notification: Notification;
  onPress: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onPress 
}) => {

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else if (diffInHours < 168) { // 7 dias
      const days = Math.floor(diffInHours / 24);
      return `${days}d atrás`;
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={() => onPress(notification)}
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.leftSection}>
          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={2}>
              {notification.title}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {notification.description}
            </Text>
            <Text style={styles.date}>
              {formatDate(notification.createdAt)}
            </Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {notification.imageUrl && (
            <Image 
              source={{ uri: notification.imageUrl }} 
              style={styles.thumbnail}
              resizeMode="cover"
            />
          )}
          
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 18,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginBottom: 8,
  },
});

export default NotificationCard;
