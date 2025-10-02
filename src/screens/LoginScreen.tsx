import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import Input from '../components/Input';
import { BiometricService } from '../services/biometric';
// import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginScreen: React.FC = () => {
  // const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometria');

  // Verificar biometria ao carregar
  useEffect(() => {
    const checkBiometricStatus = async () => {
      const available = await BiometricService.isAvailable();
      const enabled = await BiometricService.isEnabled();
      const type = await BiometricService.getBiometricType();
      
      setBiometricAvailable(available);
      setBiometricEnabled(enabled);
      setBiometricType(type);
    };

    checkBiometricStatus();
  }, []);

  const handleBiometricLogin = async () => {
    try {
      setLoading(true);
      
      // Verificar se há credenciais salvas primeiro
      const credentials = await BiometricService.getCredentials();
      
      if (!credentials) {
        Alert.alert(
          'Credenciais não encontradas',
          'Faça login manualmente primeiro para salvar suas credenciais.',
          [{ text: 'Entendi', style: 'default' }]
        );
        return;
      }
      
      // Autenticar com biometria
      const biometricResult = await BiometricService.authenticateWithBiometric();
      
      if (biometricResult.success) {
        // Fazer login com as credenciais salvas
        if (!signIn) {
          Alert.alert('Erro', 'Sistema de login não disponível');
          return;
        }
        
        const result = await signIn.create({
          identifier: credentials.email,
          password: credentials.password,
        });

        if (result?.status === 'complete') {
          await setActive({ session: result.createdSessionId });
        } else {
          Alert.alert('Erro', 'Falha na autenticação biométrica');
        }
      } else {
        Alert.alert('Erro', biometricResult.error || 'Falha na autenticação biométrica');
      }
    } catch (error) {
      console.error('Erro no login biométrico:', error);
      Alert.alert('Erro', 'Falha na autenticação biométrica');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email ou Nome de usuário é obrigatório';
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
      // Tentar fazer login com o Clerk
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        
        // Salvar credenciais sempre que o login for bem-sucedido
        // (para permitir uso futuro da biometria)
        await BiometricService.saveCredentials(email, password);
        
        // A navegação será automática devido ao estado isSignedIn no AppNavigator
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

  // const handleSignUp = () => {
  //   navigation.navigate('SignUp' as never);
  // };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.content}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../../assets/logo_2.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <View style={styles.form}>
              <Input
                label="Email ou Nome de usuário"
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu email ou nome de usuário"
                keyboardType="default"
                error={errors.email}
                theme="dark"
              />

              <Input
                label="Senha"
                value={password}
                onChangeText={setPassword}
                placeholder="Digite sua senha"
                secureTextEntry
                error={errors.password}
                theme="dark"
              />

              <Button
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
                disabled={loading}
              />

              {/* Botão de Biometria */}
              {biometricAvailable && biometricEnabled && (
                <TouchableOpacity
                  style={styles.biometricButton}
                  onPress={handleBiometricLogin}
                  disabled={loading}
                >
                  <Ionicons name="finger-print" size={24} color="#3B82F6" />
                  <Text style={styles.biometricButtonText}>
                    Autenticação Biométrica
                  </Text>
                </TouchableOpacity>
              )}

              {/* <Button
                title="Criar conta"
                onPress={handleSignUp}
                variant="outline"
              /> */}

              {/* <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>ou</Text>
                <View style={styles.dividerLine} />
              </View> */}

              {/* <GoogleSignInButton /> */}

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
    backgroundColor: '#060e6f',
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 250,
  },
  form: {
    gap: 16,
  },
  biometricButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 8,
  },
  biometricButtonText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#FFFFFF',
    fontSize: 14,
  },
});

export default LoginScreen;
