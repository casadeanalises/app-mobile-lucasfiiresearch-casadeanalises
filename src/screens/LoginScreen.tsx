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
  Image,
} from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { useSignIn } from '@clerk/clerk-expo';
import Button from '../components/Button';
import Input from '../components/Input';
import GoogleSignInButton from '../components/GoogleSignInButton';

const LoginScreen: React.FC = () => {
  // const navigation = useNavigation();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

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

              {/* <Button
                title="Criar conta"
                onPress={handleSignUp}
                variant="outline"
              /> */}

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
