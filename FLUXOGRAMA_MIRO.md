# Fluxograma para Miro - App Mobile LucasFiiResearch

## 🎯 Estrutura para o Miro

### **Cores Sugeridas:**
- 🔵 **Azul** (#2196F3): Componentes principais
- 🟢 **Verde** (#4CAF50): Sucesso/Acesso liberado
- 🟠 **Laranja** (#FF9800): Navegação/Catálogo
- 🟣 **Roxo** (#9C27B0): Autenticação
- 🔴 **Vermelho** (#F44336): Erro/Acesso negado
- 🟡 **Amarelo** (#FFC107): Avisos/Limitações

---

## 📱 **LAYOUT PRINCIPAL - 4 SEÇÕES**

### **SEÇÃO 1: AUTENTICAÇÃO (Topo Esquerdo)**
```
🔐 AUTENTICAÇÃO
├── 🚀 App.tsx
├── 🔐 ClerkProvider
├── 🛡️ SafeAreaProvider
└── 🧭 AppNavigator
    ├── ❓ Usuário Autenticado?
    ├── ❌ NÃO → Stack Auth
    │   ├── 🔑 LoginScreen
    │   ├── 📝 SignUpScreen
    │   └── 📧 VerifyEmailScreen
    └── ✅ SIM → MainTabs
```

### **SEÇÃO 2: NAVEGAÇÃO PRINCIPAL (Topo Direito)**
```
📋 MAIN TAB NAVIGATOR
├── 🏠 Home Tab
├── 📚 Catalog Tab
├── 👤 Profile Tab
└── 🔔 Notifications Tab

📚 CATALOG STACK
├── 📚 Catalog Home
├── 🎬 Investment Thesis
├── 📄 Weekly Reports
└── 📊 ETF Reports
```

### **SEÇÃO 3: CONTROLE DE ACESSO (Meio)**
```
💎 VERIFICAÇÃO DE PLANOS
├── 🔍 Verificar publicMetadata
├── 💎 subscriptionPlan
│   ├── basic → ✅ ACESSO TOTAL
│   ├── annualbasic → ✅ ACESSO TOTAL
│   ├── etfs_wallet → ✅ ETFs + BÁSICO
│   ├── lowcost → 🟡 ACESSO LIMITADO
│   └── null/outros → ❌ ACESSO NEGADO
└── 🎯 RESULTADO
    ├── 🎉 Mostrar Conteúdo
    ├── 📊 Mostrar Limitado
    └── ⚠️ Alert: Plano Necessário
```

### **SEÇÃO 4: SERVIÇOS E DADOS (Baixo)**
```
🔧 SERVIÇOS
├── 🌐 API Service
│   ├── 📹 /api/videos
│   ├── 📄 /api/reports/pdfs/
│   ├── 📊 /api/etf-pdfs
│   └── 🔔 /api/notifications
├── 👆 Biometric Service
├── 🔐 Clerk Service
└── 💾 Token Cache

🎣 HOOKS
└── ⏳ useAppLoading
```

---

## 🎨 **ELEMENTOS PARA O MIRO**

### **1. RETÂNGULOS (Processos)**
- **Início**: 🚀 App.tsx
- **Decisão**: ❓ Usuário Autenticado?
- **Processo**: 🔐 LoginScreen, 📚 CatalogScreen
- **Fim**: 🎉 Mostrar Conteúdo

### **2. DIAMANTES (Decisões)**
- ❓ Usuário Autenticado?
- 💎 Qual tipo de plano?
- ✅ Login bem-sucedido?

### **3. CÍRCULOS (Início/Fim)**
- 🚀 Início do App
- 🎉 Acesso Liberado
- ❌ Acesso Negado

### **4. SETAS (Fluxos)**
- **Verde**: Fluxo de sucesso
- **Vermelho**: Fluxo de erro
- **Azul**: Fluxo principal
- **Amarelo**: Fluxo de aviso

---

## 📋 **CHECKLIST PARA MIRO**

### **Fase 1: Estrutura Base**
- [ ] Criar 4 seções principais
- [ ] Adicionar título "App Mobile LucasFiiResearch"
- [ ] Definir cores do tema

### **Fase 2: Autenticação**
- [ ] 🚀 App.tsx (retângulo azul)
- [ ] 🔐 ClerkProvider (retângulo roxo)
- [ ] ❓ Decisão "Usuário Autenticado?" (diamante)
- [ ] 🔑 LoginScreen (retângulo laranja)
- [ ] 📝 SignUpScreen (retângulo laranja)
- [ ] 📧 VerifyEmailScreen (retângulo laranja)

### **Fase 3: Navegação**
- [ ] 📋 Main Tab Navigator (retângulo azul)
- [ ] 🏠 Home Tab (retângulo verde)
- [ ] 📚 Catalog Tab (retângulo laranja)
- [ ] 👤 Profile Tab (retângulo roxo)
- [ ] 🔔 Notifications Tab (retângulo vermelho)

### **Fase 4: Catálogo**
- [ ] 📚 CatalogScreen (retângulo laranja)
- [ ] 🎬 Investment Thesis (retângulo verde)
- [ ] 📄 Weekly Reports (retângulo verde)
- [ ] 📊 ETF Reports (retângulo verde)

### **Fase 5: Controle de Acesso**
- [ ] 💎 Verificação de Planos (diamante amarelo)
- [ ] ✅ Acesso Total (círculo verde)
- [ ] 🟡 Acesso Limitado (círculo amarelo)
- [ ] ❌ Acesso Negado (círculo vermelho)

### **Fase 6: Serviços**
- [ ] 🌐 API Service (retângulo azul)
- [ ] 👆 Biometric Service (retângulo laranja)
- [ ] 🔐 Clerk Service (retângulo roxo)
- [ ] 💾 Token Cache (retângulo cinza)

### **Fase 7: Conexões**
- [ ] Conectar todos os elementos com setas
- [ ] Adicionar labels nas setas
- [ ] Ajustar posicionamento
- [ ] Adicionar legendas

---

## 🎯 **FLUXO PRINCIPAL SIMPLIFICADO**

```
🚀 App.tsx
    ↓
🔐 ClerkProvider
    ↓
🧭 AppNavigator
    ↓
❓ Usuário Autenticado?
    ├── ❌ NÃO → 🔑 LoginScreen
    │       ↓
    │   ✅ Login OK → 📋 MainTabs
    │
    └── ✅ SIM → 📋 MainTabs
            ↓
        🏠 Home | 📚 Catalog | 👤 Profile | 🔔 Notifications
            ↓
        📚 CatalogScreen
            ↓
        💎 Verificar Plano
            ├── ✅ Plano OK → 🎬 Conteúdo
            └── ❌ Sem Plano → ⚠️ Alert
```

---

## 📱 **DETALHES DAS TELAS**

### **Telas de Autenticação**
- **🔑 LoginScreen**: Email/senha + biometria
- **📝 SignUpScreen**: Cadastro de usuário
- **📧 VerifyEmailScreen**: Verificação de email

### **Telas Principais**
- **🏠 HomeScreen**: Dashboard + status do plano
- **📚 CatalogScreen**: Menu de conteúdo
- **👤 ProfileScreen**: Perfil do usuário
- **🔔 NotificationsScreen**: Notificações

### **Telas de Conteúdo**
- **🎬 InvestmentThesisScreen**: Vídeos educativos
- **📄 WeeklyReportsScreen**: PDFs semanais
- **📊 EtfReportsScreen**: PDFs de ETFs

---

## 🔧 **SERVIÇOS E INTEGRAÇÕES**

### **API Endpoints**
- `GET /api/videos` → Lista de vídeos
- `GET /api/reports/pdfs/` → Relatórios semanais
- `GET /api/etf-pdfs` → Relatórios de ETFs
- `GET /api/notifications` → Notificações do usuário

### **Serviços Locais**
- **👆 BiometricService**: Autenticação biométrica
- **🔐 ClerkService**: Gerenciamento de autenticação
- **💾 TokenCache**: Cache de tokens

---

## 💡 **DICAS PARA O MIRO**

1. **Use ícones**: Os emojis ajudam na identificação visual
2. **Agrupe por cores**: Cada seção com uma cor predominante
3. **Conecte logicamente**: As setas devem seguir o fluxo real
4. **Adicione notas**: Explicações em post-its para detalhes
5. **Mantenha hierarquia**: Elementos principais maiores que secundários
6. **Use templates**: Retângulos, diamantes e círculos do Miro
7. **Organize em camadas**: Background, elementos principais, conexões

---

## 🎨 **PALETA DE CORES SUGERIDA**

- **Primária**: #2196F3 (Azul)
- **Sucesso**: #4CAF50 (Verde)
- **Aviso**: #FFC107 (Amarelo)
- **Erro**: #F44336 (Vermelho)
- **Info**: #00BCD4 (Ciano)
- **Secundária**: #9C27B0 (Roxo)
- **Neutra**: #607D8B (Azul Cinza)

Este fluxograma está otimizado para ser facilmente recriado no Miro com elementos visuais claros e uma estrutura lógica bem definida!
