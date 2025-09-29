const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Configuração para path aliases
config.resolver.alias = {
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/screens': path.resolve(__dirname, 'src/screens'),
  '@/navigation': path.resolve(__dirname, 'src/navigation'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/types': path.resolve(__dirname, 'src/types'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
};

module.exports = config;
