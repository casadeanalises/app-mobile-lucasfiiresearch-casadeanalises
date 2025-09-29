# Lucas Fii Research - App Mobile

Aplicativo mobile do Lucas Fii Research desenvolvido com React Native, Expo e TypeScript, utilizando Clerk para autenticação.

## 🚀 Tecnologias

- **React Native** - Framework para desenvolvimento mobile
- **Expo** - Plataforma para desenvolvimento React Native
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Clerk** - Autenticação e gerenciamento de usuários
- **React Navigation** - Navegação entre telas
- **Expo Secure Store** - Armazenamento seguro de tokens

## 📱 Funcionalidades

- ✅ Autenticação completa (login/cadastro)
- ✅ Interface moderna e responsiva
- ✅ Navegação entre telas
- ✅ Armazenamento seguro de tokens
- ✅ Validação de formulários
- ✅ Tratamento de erros
- ✅ TypeScript com configuração rigorosa

## 🛠️ Configuração do Projeto

### Pré-requisitos

- Node.js (versão 18 ou superior)
- npm ou yarn
- Expo CLI
- Conta no Clerk (https://clerk.com)

### Instalação

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd app-mobile-lucasfiiresearch
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env-example .env
   ```
   
   Edite o arquivo `.env` com suas chaves do Clerk:
   ```env
   EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_sua_chave_aqui
   CLERK_SECRET_KEY=sk_test_sua_chave_secreta_aqui
   ```

4. **Configure o Clerk**
   - Acesse [Clerk Dashboard](https://dashboard.clerk.com)
   - Crie uma nova aplicação
   - Copie as chaves para o arquivo `.env`
   - Configure as URLs de redirecionamento

### Executando o Projeto

```bash
# Desenvolvimento
npm start

# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Button.tsx
│   └── Input.tsx
├── screens/            # Telas da aplicação
│   ├── LoginScreen.tsx
│   ├── SignUpScreen.tsx
│   └── HomeScreen.tsx
├── navigation/         # Configuração de navegação
│   └── AppNavigator.tsx
├── services/          # Serviços e APIs
│   ├── clerk.ts
│   └── tokenCache.ts
├── types/             # Definições de tipos TypeScript
│   └── index.ts
├── utils/             # Utilitários
└── hooks/             # Custom hooks
```

## 🔧 Configurações

### TypeScript
- Configuração rigorosa com `strict: true`
- Path aliases configurados
- Tipos bem definidos para todas as interfaces

### Babel
- Module resolver configurado para path aliases
- Suporte a imports absolutos

### Clerk
- Autenticação completa
- Armazenamento seguro de tokens
- Suporte a login/cadastro

## 📱 Telas

### Login
- Formulário de login com validação
- Integração com Clerk
- Tratamento de erros

### Cadastro
- Formulário de cadastro completo
- Validação de dados
- Verificação de email

### Home
- Tela principal após login
- Informações do usuário
- Botão de logout

## 🎨 Design System

### Cores
- Primária: `#007AFF` (Azul iOS)
- Secundária: `#F2F2F7` (Cinza claro)
- Texto: `#000000` (Preto)
- Texto secundário: `#8E8E93` (Cinza)
- Erro: `#FF3B30` (Vermelho)

### Componentes
- **Button**: Botão customizável com variantes
- **Input**: Campo de entrada com validação
- **Layout**: Estrutura responsiva e acessível

## 🚀 Deploy

### Expo Build
```bash
# Build para produção
expo build:android
expo build:ios
```

### EAS Build (Recomendado)
```bash
# Instalar EAS CLI
npm install -g @expo/eas-cli

# Configurar projeto
eas build:configure

# Build
eas build --platform all
```

## 📝 Scripts Disponíveis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run android` - Executa no Android
- `npm run ios` - Executa no iOS
- `npm run web` - Executa no navegador
- `npm run lint` - Executa o linter
- `npm run type-check` - Verifica tipos TypeScript

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. Verifique se todas as dependências estão instaladas
2. Confirme se as variáveis de ambiente estão configuradas
3. Verifique se o Clerk está configurado corretamente
4. Abra uma issue no repositório

---

Desenvolvido com ❤️ para Lucas Fii Research
