import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CatalogScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={[styles.content, { paddingBottom: insets.bottom + 100 }]}>
        <Text style={styles.title}>Catálogo</Text>
        <Text style={styles.subtitle}>
          Explore nossos produtos e serviços
        </Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Conteúdo do catálogo será implementado aqui
          </Text>
        </View>
      </ScrollView>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#B0B0B0',
    textAlign: 'center',
    marginBottom: 32,
  },
  placeholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default CatalogScreen;
