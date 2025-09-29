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
import { useSignIn } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginScreen: React.FC = () => {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginType, setLoginType] = useState<'email' | 'username'>('email');

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = loginType === 'email' ? 'Email é obrigatório' : 'Username é obrigatório';
    } else if (loginType === 'email' && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password.trim()) {
      newErrors.password = 'Senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    if (!isLoaded) return;

    setLoading(true);
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        // O Clerk redireciona automaticamente para Home
      } else {
        Alert.alert('Erro', 'Falha no login. Tente novamente.');
      }
    } catch (err: any) {
      console.log('Erro detalhado:', err);
      Alert.alert('Erro', err.errors?.[0]?.message || 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp' as never);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <Text style={styles.title}>Bem-vindo de volta!</Text>
            <Text style={styles.subtitle}>
              Faça login para acessar sua conta
            </Text>

            <View style={styles.form}>
              <View style={styles.loginTypeContainer}>
                <Button
                  title="Email"
                  onPress={() => setLoginType('email')}
                  variant={loginType === 'email' ? 'primary' : 'outline'}
                  size="small"
                />
                <Button
                  title="Username"
                  onPress={() => setLoginType('username')}
                  variant={loginType === 'username' ? 'primary' : 'outline'}
                  size="small"
                />
              </View>

              <Input
                label={loginType === 'email' ? 'Email' : 'Username'}
                value={email}
                onChangeText={setEmail}
                placeholder={loginType === 'email' ? 'Digite seu email' : 'Digite seu username'}
                keyboardType={loginType === 'email' ? 'email-address' : 'default'}
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
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />

              <Button
                title="Criar conta"
                onPress={handleSignUp}
                variant="outline"
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View>

              <GoogleSignInButton />
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
  loginTypeContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#D1D1D6',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#8E8E93',
    fontSize: 14,
  },
});

export default LoginScreen;
