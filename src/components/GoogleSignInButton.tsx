import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onSuccess,
  onError,
}) => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const handleGoogleSignIn = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        onSuccess?.();
      }
    } catch (err: any) {
      console.log('Erro no login Google:', err);
      const errorMessage = err.errors?.[0]?.message || 'Erro no login com Google';
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
