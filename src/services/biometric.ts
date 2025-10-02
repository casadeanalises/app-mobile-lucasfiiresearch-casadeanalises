import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
}

export class BiometricService {
  private static readonly BIOMETRIC_KEY = 'biometric_enabled';
  private static readonly CREDENTIALS_KEY = 'saved_credentials';

  /**
   * Verifica se a biometria está disponível no dispositivo
   */
  static async isAvailable(): Promise<boolean> {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Erro ao verificar biometria:', error);
      return false;
    }
  }

  /**
   * Verifica se a biometria está habilitada pelo usuário
   */
  static async isEnabled(): Promise<boolean> {
    try {
      const enabled = await SecureStore.getItemAsync(this.BIOMETRIC_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Erro ao verificar se biometria está habilitada:', error);
      return false;
    }
  }

  /**
   * Habilita a biometria para o usuário
   */
  static async enableBiometric(): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometria não está disponível neste dispositivo'
        };
      }

      // Solicita autenticação biométrica para habilitar
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Confirme sua identidade para habilitar o acesso biométrico',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        await SecureStore.setItemAsync(this.BIOMETRIC_KEY, 'true');
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Autenticação biométrica cancelada'
        };
      }
    } catch (error) {
      console.error('Erro ao habilitar biometria:', error);
      return {
        success: false,
        error: 'Erro ao habilitar biometria'
      };
    }
  }

  /**
   * Desabilita a biometria
   */
  static async disableBiometric(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.BIOMETRIC_KEY);
      await SecureStore.deleteItemAsync(this.CREDENTIALS_KEY);
    } catch (error) {
      console.error('Erro ao desabilitar biometria:', error);
    }
  }

  /**
   * Salva as credenciais do usuário de forma segura
   */
  static async saveCredentials(email: string, password: string): Promise<void> {
    try {
      const credentials = JSON.stringify({ email, password });
      await SecureStore.setItemAsync(this.CREDENTIALS_KEY, credentials);
    } catch (error) {
      console.error('Erro ao salvar credenciais:', error);
    }
  }

  /**
   * Recupera as credenciais salvas
   */
  static async getCredentials(): Promise<{ email: string; password: string } | null> {
    try {
      const credentials = await SecureStore.getItemAsync(this.CREDENTIALS_KEY);
      if (credentials) {
        return JSON.parse(credentials);
      }
      return null;
    } catch (error) {
      console.error('Erro ao recuperar credenciais:', error);
      return null;
    }
  }

  /**
   * Autentica usando biometria
   */
  static async authenticateWithBiometric(): Promise<BiometricAuthResult> {
    try {
      const isEnabled = await this.isEnabled();
      if (!isEnabled) {
        return {
          success: false,
          error: 'Biometria não está habilitada'
        };
      }

      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometria não está disponível'
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Use sua biometria para acessar',
        cancelLabel: 'Cancelar',
        fallbackLabel: 'Usar senha',
      });

      if (result.success) {
        return { success: true };
      } else {
        return {
          success: false,
          error: 'Autenticação biométrica falhou'
        };
      }
    } catch (error) {
      console.error('Erro na autenticação biométrica:', error);
      return {
        success: false,
        error: 'Erro na autenticação biométrica'
      };
    }
  }

  /**
   * Obtém o tipo de biometria disponível
   */
  static async getBiometricType(): Promise<string> {
    try {
      const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
      if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        return 'Reconhecimento Facial';
      } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        return 'Impressão Digital';
      } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        return 'Reconhecimento de Íris';
      }
      return 'Biometria';
    } catch (error) {
      console.error('Erro ao obter tipo de biometria:', error);
      return 'Biometria';
    }
  }

}
