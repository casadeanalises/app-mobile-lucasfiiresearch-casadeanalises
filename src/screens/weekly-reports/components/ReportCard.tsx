import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Report } from '../types';

interface ReportCardProps {
  report: Report;
  onPress: () => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({ report, onPress }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* Ícone PDF */}
      <View style={styles.pdfIconContainer}>
        <Ionicons name="document-text" size={32} color="#8B5CF6" />
      </View>

      {/* Conteúdo */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {report.title}
        </Text>
        {report.description && (
          <Text style={styles.description} numberOfLines={2}>
            {report.description}
          </Text>
        )}
        <View style={styles.meta}>
          <Ionicons name="calendar-outline" size={14} color="#64748B" />
          <Text style={styles.date}>
            {formatDate(report.date)}
          </Text>
        </View>
      </View>

      {/* Botão Download */}
      <View style={styles.downloadButton}>
        <Ionicons name="download-outline" size={20} color="#8B5CF6" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  pdfIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  content: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  date: {
    fontSize: 12,
    color: '#64748B',
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
});

