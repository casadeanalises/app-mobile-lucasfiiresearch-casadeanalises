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

const SignUpScreen: React.FC = () => {
  const { signUp, setActive, isLoaded } = useSignUp();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    username?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      email?: string;
      password?: string;
      username?: string;
    } = {};

    if (!username.trim()) {
      newErrors.username = 'Username é obrigatório';
    } else if (username.length < 3) {
      newErrors.username = 'Username deve ter pelo menos 3 caracteres';
    }

    if (!email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signUp.create({
        emailAddress: email,
        password,
        username,
        firstName: username, // Usar username como firstName para compatibilidade
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // O Clerk redireciona automaticamente para Home
      } else if (result.status === 'missing_requirements') {
        // Verificação de email necessária
        Alert.alert(
          'Verificação de Email',
          'Enviamos um código de verificação para seu email. Verifique sua caixa de entrada e spam.',
          [
            {
              text: 'OK',
              onPress: () => {
                // Aqui você pode navegar para uma tela de verificação
                Alert.alert('Próximo passo', 'Verifique seu email e volte para fazer login.');
              }
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Falha no cadastro. Tente novamente.');
      }
    } catch (err: any) {
      console.log('Erro detalhado:', err);
      Alert.alert('Erro', err.errors?.[0]?.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
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
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Preencha os dados para criar sua conta
            </Text>

            <View style={styles.form}>
              <Input
                label="Username"
                value={username}
                onChangeText={setUsername}
                placeholder="Digite seu username"
                error={errors.username}
              />

              <Input
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email"
                keyboardType="email-address"
                error={errors.email}
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
                error={errors.password}
              />

              <Button
                title="Criar conta"
                onPress={handleSignUp}
                loading={loading}
                disabled={loading}
              />

              <Button
                title="Já tenho uma conta"
                onPress={handleLogin}
                variant="outline"
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

export default SignUpScreen;
