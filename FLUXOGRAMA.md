# Fluxograma do App Mobile LucasFiiResearch - Casa de Análises

## Estrutura Geral do Aplicativo

```mermaid
graph TD
    A[Início do App] --> B[ClerkProvider]
    B --> C{Usuário Autenticado?}
    
    C -->|Não| D[Stack Navigator - Auth]
    C -->|Sim| E[Main Tab Navigator]
    
    D --> F[LoginScreen]
    D --> G[SignUpScreen]
    D --> H[VerifyEmailScreen]
    
    F --> I{Login Bem-sucedido?}
    I -->|Sim| E
    I -->|Não| F
    
    E --> J[Home Tab]
    E --> K[Catalog Tab]
    E --> L[Profile Tab]
    E --> M[Notifications Tab]
```

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant U as Usuário
    participant A as App
    participant C as Clerk
    participant B as BiometricService
    
    U->>A: Abre o App
    A->>C: Verifica sessão ativa
    C-->>A: Retorna status de autenticação
    
    alt Usuário não autenticado
        A->>U: Exibe LoginScreen
        U->>A: Insere credenciais
        A->>C: Envia credenciais
        C-->>A: Valida credenciais
        
        alt Login bem-sucedido
            A->>B: Salva credenciais para biometria
            A->>U: Navega para MainTabs
        else Login falhou
            A->>U: Exibe erro
        end
    else Usuário autenticado
        A->>U: Navega diretamente para MainTabs
    end
```

## Navegação Principal (Tab Navigator)

```mermaid
graph TD
    A[Main Tab Navigator] --> B[Home Screen]
    A --> C[Catalog Stack Navigator]
    A --> D[Profile Screen]
    A --> E[Notifications Screen]
    
    C --> F[Catalog Home Screen]
    C --> G[Investment Thesis Screen]
    C --> H[Weekly Reports Screen]
    C --> I[ETF Reports Screen]
```

## Fluxo do Catálogo

```mermaid
graph TD
    A[CatalogScreen] --> B{Verificar Plano do Usuário}
    
    B -->|Plano Básico/Anual| C[Teses de Investimento]
    B -->|Plano Básico/Anual| D[Relatórios Semanais]
    B -->|Plano Básico/Anual/ETFs| E[Relatórios ETFs]
    
    B -->|Sem Plano Válido| F[Alert: Plano Necessário]
    
    C --> G[Lista de Vídeos]
    D --> H[Lista de PDFs]
    E --> I[Lista de PDFs ETFs]
    
    G --> J[VideoModal]
    H --> K[Visualizar PDF]
    I --> L[Visualizar PDF]
```

## Estrutura de Dados e APIs

```mermaid
graph TD
    A[App Mobile] --> B[API Service]
    B --> C[https://lucasfiiresearch.dev.br]
    
    B --> D[fetchVideos - /api/videos]
    B --> E[fetchReports - /api/reports/pdfs/]
    B --> F[fetchEtfReports - /api/etf-pdfs]
    B --> G[fetchNotifications - /api/notifications]
    
    D --> H[HomeVideo[]]
    E --> I[Report[]]
    F --> J[EtfReport[]]
    G --> K[Notification[]]
```

## Fluxo de Verificação de Plano

```mermaid
flowchart TD
    A[Usuário tenta acessar conteúdo] --> B[Verificar publicMetadata do Clerk]
    B --> C{subscriptionPlan}
    
    C -->|basic| D[✅ Acesso Liberado]
    C -->|annualbasic| D
    C -->|etfs_wallet| E[✅ Acesso ETFs + Básico]
    C -->|lowcost| F[✅ Acesso Limitado]
    C -->|null/outros| G[❌ Acesso Negado]
    
    D --> H[Mostrar Conteúdo]
    E --> H
    F --> I[Mostrar Conteúdo Limitado]
    G --> J[Alert: Plano Necessário]
```

## Arquitetura de Componentes

```mermaid
graph TD
    A[App.tsx] --> B[ClerkProvider]
    B --> C[SafeAreaProvider]
    C --> D[AppNavigator]
    
    D --> E{isSignedIn?}
    E -->|Não| F[Auth Stack]
    E -->|Sim| G[MainTabs]
    
    F --> H[LoginScreen]
    F --> I[SignUpScreen]
    F --> J[VerifyEmailScreen]
    
    G --> K[HomeScreen]
    G --> L[CatalogStackNavigator]
    G --> M[ProfileScreen]
    G --> N[NotificationsScreen]
    
    L --> O[CatalogScreen]
    L --> P[InvestmentThesisScreen]
    L --> Q[WeeklyReportsScreen]
    L --> R[EtfReportsScreen]
```

## Serviços e Hooks

```mermaid
graph LR
    A[Services] --> B[API Service]
    A --> C[Biometric Service]
    A --> D[Clerk Service]
    A --> E[Token Cache]
    
    F[Hooks] --> G[useAppLoading]
    
    B --> H[fetchVideos]
    B --> I[fetchReports]
    B --> J[fetchEtfReports]
    B --> K[fetchNotifications]
    
    C --> L[authenticateWithBiometric]
    C --> M[saveCredentials]
    C --> N[getCredentials]
```

## Fluxo de Biometria

```mermaid
sequenceDiagram
    participant U as Usuário
    participant A as App
    participant B as BiometricService
    participant C as Clerk
    
    U->>A: Clica em "Autenticação Biométrica"
    A->>B: Verifica se biometria está disponível
    B-->>A: Retorna disponibilidade
    
    A->>B: Solicita autenticação biométrica
    B->>U: Exibe prompt biométrico
    U->>B: Confirma biometria
    
    alt Biometria válida
        B->>A: Retorna sucesso
        A->>B: Busca credenciais salvas
        B-->>A: Retorna email/senha
        A->>C: Faz login com credenciais
        C-->>A: Confirma autenticação
        A->>U: Navega para MainTabs
    else Biometria inválida
        B->>A: Retorna erro
        A->>U: Exibe mensagem de erro
    end
```

## Lista de Telas e Funcionalidades

### 📱 **Telas de Autenticação**
- **LoginScreen**: Login com email/senha + biometria
- **SignUpScreen**: Cadastro de novos usuários
- **VerifyEmailScreen**: Verificação de email

### 🏠 **Telas Principais**
- **HomeScreen**: Dashboard com saudação e status do plano
- **CatalogScreen**: Menu principal de conteúdo
- **ProfileScreen**: Perfil do usuário
- **NotificationsScreen**: Notificações do usuário

### 📚 **Telas de Conteúdo**
- **InvestmentThesisScreen**: Lista de vídeos educativos
- **WeeklyReportsScreen**: Relatórios semanais em PDF
- **EtfReportsScreen**: Relatórios de ETFs em PDF

### 🎬 **Componentes de Mídia**
- **VideoModal**: Player de vídeos
- **VideoCard**: Card de vídeo individual
- **ReportCard**: Card de relatório PDF
- **EtfReportCard**: Card de relatório ETF

### 🔔 **Componentes de Notificação**
- **NotificationCard**: Card de notificação individual

### 🔧 **Serviços**
- **API Service**: Comunicação com backend
- **Biometric Service**: Autenticação biométrica
- **Clerk Service**: Gerenciamento de autenticação
- **Token Cache**: Cache de tokens de autenticação

### 🎨 **Componentes UI**
- **Button**: Botão customizado
- **Input**: Campo de entrada customizado
- **LoadingScreen**: Tela de carregamento
- **GoogleSignInButton**: Botão de login com Google

## Tecnologias Utilizadas

- **React Native** + **Expo**
- **TypeScript**
- **React Navigation** (Stack + Tab Navigator)
- **Clerk** (Autenticação)
- **Expo Local Authentication** (Biometria)
- **Expo Secure Store** (Armazenamento seguro)
- **Ionicons** (Ícones)
- **Safe Area Context** (Área segura)

## Estrutura de Arquivos

```
src/
├── components/          # Componentes reutilizáveis
├── hooks/              # Hooks customizados
├── navigation/         # Configuração de navegação
├── screens/           # Telas do aplicativo
│   ├── etf-reports/
│   ├── investment-thesis/
│   ├── notifications/
│   └── weekly-reports/
├── services/          # Serviços (API, Biometria, etc.)
└── types/             # Definições de tipos TypeScript
```

Este fluxograma representa a arquitetura completa do aplicativo mobile LucasFiiResearch, mostrando desde a autenticação até o acesso ao conteúdo baseado no plano de assinatura do usuário.
