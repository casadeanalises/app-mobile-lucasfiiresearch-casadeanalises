# Diagramas Mermaid - App Mobile LucasFiiResearch

## 1. Estrutura Geral do Aplicativo

```mermaid
graph TD
    A[🚀 Início do App] --> B[ClerkProvider]
    B --> C{🔐 Usuário Autenticado?}
    
    C -->|❌ Não| D[📱 Stack Navigator - Auth]
    C -->|✅ Sim| E[📋 Main Tab Navigator]
    
    D --> F[🔑 LoginScreen]
    D --> G[📝 SignUpScreen]
    D --> H[📧 VerifyEmailScreen]
    
    F --> I{✅ Login Bem-sucedido?}
    I -->|✅ Sim| E
    I -->|❌ Não| F
    
    E --> J[🏠 Home Tab]
    E --> K[📚 Catalog Tab]
    E --> L[👤 Profile Tab]
    E --> M[🔔 Notifications Tab]
```

## 2. Navegação Principal (Tab Navigator)

```mermaid
graph TD
    A[📋 Main Tab Navigator] --> B[🏠 Home Screen]
    A --> C[📚 Catalog Stack Navigator]
    A --> D[👤 Profile Screen]
    A --> E[🔔 Notifications Screen]
    
    C --> F[📚 Catalog Home Screen]
    C --> G[🎬 Investment Thesis Screen]
    C --> H[📄 Weekly Reports Screen]
    C --> I[📊 ETF Reports Screen]
    
    style A fill:#4A90E2
    style B fill:#4CAF50
    style C fill:#FF9800
    style D fill:#9C27B0
    style E fill:#F44336
```

## 3. Fluxo do Catálogo e Verificação de Plano

```mermaid
graph TD
    A[📚 CatalogScreen] --> B{🔍 Verificar Plano do Usuário}
    
    B -->|💎 Plano Básico/Anual| C[🎬 Teses de Investimento]
    B -->|💎 Plano Básico/Anual| D[📄 Relatórios Semanais]
    B -->|💎 Plano Básico/Anual/ETFs| E[📊 Relatórios ETFs]
    
    B -->|❌ Sem Plano Válido| F[⚠️ Alert: Plano Necessário]
    
    C --> G[📋 Lista de Vídeos]
    D --> H[📋 Lista de PDFs]
    E --> I[📋 Lista de PDFs ETFs]
    
    G --> J[🎥 VideoModal]
    H --> K[👁️ Visualizar PDF]
    I --> L[👁️ Visualizar PDF]
    
    style B fill:#FFC107
    style F fill:#F44336
    style C fill:#4CAF50
    style D fill:#4CAF50
    style E fill:#4CAF50
```

## 4. Arquitetura de Componentes

```mermaid
graph TD
    A[📱 App.tsx] --> B[🔐 ClerkProvider]
    B --> C[🛡️ SafeAreaProvider]
    C --> D[🧭 AppNavigator]
    
    D --> E{🔐 isSignedIn?}
    E -->|❌ Não| F[🔑 Auth Stack]
    E -->|✅ Sim| G[📋 MainTabs]
    
    F --> H[🔑 LoginScreen]
    F --> I[📝 SignUpScreen]
    F --> J[📧 VerifyEmailScreen]
    
    G --> K[🏠 HomeScreen]
    G --> L[📚 CatalogStackNavigator]
    G --> M[👤 ProfileScreen]
    G --> N[🔔 NotificationsScreen]
    
    L --> O[📚 CatalogScreen]
    L --> P[🎬 InvestmentThesisScreen]
    L --> Q[📄 WeeklyReportsScreen]
    L --> R[📊 EtfReportsScreen]
    
    style A fill:#2196F3
    style B fill:#9C27B0
    style G fill:#4CAF50
    style F fill:#FF9800
```

## 5. Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant 👤 as Usuário
    participant 📱 as App
    participant 🔐 as Clerk
    participant 👆 as BiometricService
    
    👤->>📱: Abre o App
    📱->>🔐: Verifica sessão ativa
    🔐-->>📱: Retorna status de autenticação
    
    alt ❌ Usuário não autenticado
        📱->>👤: Exibe LoginScreen
        👤->>📱: Insere credenciais
        📱->>🔐: Envia credenciais
        🔐-->>📱: Valida credenciais
        
        alt ✅ Login bem-sucedido
            📱->>👆: Salva credenciais para biometria
            📱->>👤: Navega para MainTabs
        else ❌ Login falhou
            📱->>👤: Exibe erro
        end
    else ✅ Usuário autenticado
        📱->>👤: Navega diretamente para MainTabs
    end
```

## 6. Fluxo de Biometria

```mermaid
sequenceDiagram
    participant 👤 as Usuário
    participant 📱 as App
    participant 👆 as BiometricService
    participant 🔐 as Clerk
    
    👤->>📱: Clica em "Autenticação Biométrica"
    📱->>👆: Verifica se biometria está disponível
    👆-->>📱: Retorna disponibilidade
    
    📱->>👆: Solicita autenticação biométrica
    👆->>👤: Exibe prompt biométrico
    👤->>👆: Confirma biometria
    
    alt ✅ Biometria válida
        👆->>📱: Retorna sucesso
        📱->>👆: Busca credenciais salvas
        👆-->>📱: Retorna email/senha
        📱->>🔐: Faz login com credenciais
        🔐-->>📱: Confirma autenticação
        📱->>👤: Navega para MainTabs
    else ❌ Biometria inválida
        👆->>📱: Retorna erro
        📱->>👤: Exibe mensagem de erro
    end
```

## 7. Estrutura de Dados e APIs

```mermaid
graph TD
    A[📱 App Mobile] --> B[🌐 API Service]
    B --> C[🔗 https://lucasfiiresearch.dev.br]
    
    B --> D[📹 fetchVideos<br/>/api/videos]
    B --> E[📄 fetchReports<br/>/api/reports/pdfs/]
    B --> F[📊 fetchEtfReports<br/>/api/etf-pdfs]
    B --> G[🔔 fetchNotifications<br/>/api/notifications]
    
    D --> H[🎬 HomeVideo[]]
    E --> I[📄 Report[]]
    F --> J[📊 EtfReport[]]
    G --> K[🔔 Notification[]]
    
    style A fill:#2196F3
    style B fill:#4CAF50
    style C fill:#FF9800
```

## 8. Fluxo de Verificação de Plano

```mermaid
flowchart TD
    A[👤 Usuário tenta acessar conteúdo] --> B[🔍 Verificar publicMetadata do Clerk]
    B --> C{💎 subscriptionPlan}
    
    C -->|basic| D[✅ Acesso Liberado]
    C -->|annualbasic| D
    C -->|etfs_wallet| E[✅ Acesso ETFs + Básico]
    C -->|lowcost| F[✅ Acesso Limitado]
    C -->|null/outros| G[❌ Acesso Negado]
    
    D --> H[🎉 Mostrar Conteúdo]
    E --> H
    F --> I[📊 Mostrar Conteúdo Limitado]
    G --> J[⚠️ Alert: Plano Necessário]
    
    style D fill:#4CAF50
    style E fill:#4CAF50
    style F fill:#FFC107
    style G fill:#F44336
    style H fill:#4CAF50
    style I fill:#FFC107
    style J fill:#F44336
```

## 9. Serviços e Hooks

```mermaid
graph LR
    A[🔧 Services] --> B[🌐 API Service]
    A --> C[👆 Biometric Service]
    A --> D[🔐 Clerk Service]
    A --> E[💾 Token Cache]
    
    F[🎣 Hooks] --> G[⏳ useAppLoading]
    
    B --> H[📹 fetchVideos]
    B --> I[📄 fetchReports]
    B --> J[📊 fetchEtfReports]
    B --> K[🔔 fetchNotifications]
    
    C --> L[👆 authenticateWithBiometric]
    C --> M[💾 saveCredentials]
    C --> N[📤 getCredentials]
    
    style A fill:#2196F3
    style F fill:#9C27B0
    style B fill:#4CAF50
    style C fill:#FF9800
    style D fill:#9C27B0
    style E fill:#607D8B
```

## 10. Estrutura de Arquivos

```mermaid
graph TD
    A[📁 src/] --> B[🧩 components/]
    A --> C[🎣 hooks/]
    A --> D[🧭 navigation/]
    A --> E[📱 screens/]
    A --> F[🔧 services/]
    A --> G[📝 types/]
    
    B --> B1[🔘 Button]
    B --> B2[📝 Input]
    B --> B3[⏳ LoadingScreen]
    B --> B4[🔑 GoogleSignInButton]
    
    E --> E1[📚 etf-reports/]
    E --> E2[🎬 investment-thesis/]
    E --> E3[🔔 notifications/]
    E --> E4[📄 weekly-reports/]
    E --> E5[🔑 LoginScreen]
    E --> E6[📝 SignUpScreen]
    E --> E7[🏠 HomeScreen]
    E --> E8[📚 CatalogScreen]
    E --> E9[👤 ProfileScreen]
    
    F --> F1[🌐 api.ts]
    F --> F2[👆 biometric.ts]
    F --> F3[🔐 clerk.ts]
    F --> F4[💾 tokenCache.ts]
    
    style A fill:#2196F3
    style B fill:#4CAF50
    style C fill:#9C27B0
    style D fill:#FF9800
    style E fill:#F44336
    style F fill:#607D8B
    style G fill:#795548
```

## Como Visualizar os Diagramas

Para visualizar estes diagramas Mermaid, você pode:

1. **GitHub**: Os diagramas serão renderizados automaticamente no GitHub
2. **VS Code**: Instale a extensão "Mermaid Preview"
3. **Online**: Use https://mermaid.live/
4. **Documentação**: Muitas ferramentas de documentação suportam Mermaid

## Tecnologias Utilizadas

- 🚀 **React Native** + **Expo**
- 📝 **TypeScript**
- 🧭 **React Navigation** (Stack + Tab Navigator)
- 🔐 **Clerk** (Autenticação)
- 👆 **Expo Local Authentication** (Biometria)
- 💾 **Expo Secure Store** (Armazenamento seguro)
- 🎨 **Ionicons** (Ícones)
- 🛡️ **Safe Area Context** (Área segura)

## Funcionalidades Principais

- ✅ **Autenticação** com Clerk (email/senha + biometria)
- 💎 **Controle de acesso** baseado em planos de assinatura
- 📚 **Catálogo de conteúdo** (vídeos, relatórios, ETFs)
- 🔔 **Sistema de notificações**
- 👤 **Perfil do usuário**
- 🌐 **Integração com API** do backend
- 📱 **Interface responsiva** e moderna
