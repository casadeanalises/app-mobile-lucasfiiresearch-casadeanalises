// Tipos de usuário
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos de navegação
export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  VerifyEmail: undefined;
  MainTabs: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Catalog: undefined;
  Profile: undefined;
  Notifications: undefined;
};

export type CatalogStackParamList = {
  CatalogHome: undefined;
  InvestmentThesis: undefined;
  WeeklyReports: undefined;
  EtfReports: undefined;
};

// Tipos de autenticação
export interface AuthState {
  isSignedIn: boolean;
  isLoading: boolean;
  user: User | null;
}

// Tipos de componentes
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

export interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  error?: string | undefined;
  maxLength?: number;
  theme?: 'light' | 'dark';
}

// Tipos de API
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
