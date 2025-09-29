import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const handleGoogleSignIn = async () => {
    try {
      // Simular login Google por enquanto
      await new Promise(resolve => setTimeout(resolve, 1000));
      onSuccess?.();
    } catch (err: any) {
      console.log('Erro no login Google:', err);
      const errorMessage = 'Erro no login com Google';
      onError?.(errorMessage);
      Alert.alert('Erro', errorMessage);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleGoogleSignIn}>
      <Text style={styles.buttonText}>Entrar com Google</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D1D6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoogleSignInButton;
