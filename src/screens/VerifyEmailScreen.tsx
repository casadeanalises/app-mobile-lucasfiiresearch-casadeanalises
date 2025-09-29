import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSignUp } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';

const VerifyEmailScreen: React.FC = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ code?: string }>({});

  const validateForm = () => {
    const newErrors: { code?: string } = {};

    if (!code.trim()) {
      newErrors.code = 'Código é obrigatório';
    } else if (code.length < 6) {
      newErrors.code = 'Código deve ter 6 dígitos';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCode = async () => {
    if (!validateForm()) return;

    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // O Clerk redireciona automaticamente para Home
      } else {
        Alert.alert('Erro', 'Código inválido. Verifique se digitou corretamente.');
      }
    } catch (err: any) {
      console.log('Erro detalhado:', err);
      const errorMessage = err.errors?.[0]?.message || 'Erro ao verificar código';
      
      if (errorMessage.includes('not sent') || errorMessage.includes('expired')) {
        Alert.alert('Código Expirado', 'O código expirou ou não foi enviado. Clique em "Reenviar Código" para receber um novo.');
      } else if (errorMessage.includes('invalid') || errorMessage.includes('incorrect')) {
        Alert.alert('Código Inválido', 'O código digitado está incorreto. Verifique se copiou corretamente do email.');
      } else if (errorMessage.includes('too many')) {
        Alert.alert('Muitas Tentativas', 'Muitas tentativas incorretas. Aguarde alguns minutos antes de tentar novamente.');
      } else {
        Alert.alert('Erro', `Erro: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!isLoaded) return;

    try {
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      Alert.alert('Código reenviado', 'Verifique seu email novamente. Pode levar alguns minutos para chegar.');
    } catch (err: any) {
      console.log('Erro ao reenviar:', err);
      Alert.alert('Erro', 'Falha ao reenviar código. Tente novamente em alguns minutos.');
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Verificar Email</Text>
            <Text style={styles.subtitle}>
              Digite o código de 6 dígitos enviado para seu email
            </Text>

            <View style={styles.form}>
              <Input
                label="Código de Verificação"
                value={code}
                onChangeText={setCode}
                placeholder="Digite o código de 6 dígitos"
                keyboardType="numeric"
                error={errors.code}
                maxLength={6}
              />

              <Button
                title="Verificar Código"
                onPress={handleVerifyCode}
                loading={loading}
                disabled={loading}
              />

              <Button
                title="Reenviar Código"
                onPress={handleResendCode}
                variant="outline"
              />

              <Button
                title="Voltar ao Login"
                onPress={handleBackToLogin}
                variant="secondary"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
});

export default VerifyEmailScreen;
