# 📱 Guia de Deploy Mobile - Lucas FII Research

## 🎯 Como disponibilizar o app para download (sem publicar nas lojas)

### **Opção 1: EAS Build - Distribuição Interna** ⭐ RECOMENDADO

Similar ao Vercel, mas para mobile. Gera um link para download!

#### **Passo 1: Login no Expo**
```bash
npx eas login
```

#### **Passo 2: Configurar o projeto**
```bash
npx eas build:configure
```

#### **Passo 3: Build para Android (APK)**
```bash
npx eas build --profile preview --platform android
```

#### **Passo 4: Build para iOS (desenvolvimento)**
```bash
npx eas build --profile preview --platform ios
```

**Resultado:** 
- ✅ Você recebe um **link de download** que pode compartilhar!
- ✅ O link fica válido por 30 dias (renovável)
- ✅ Funciona em qualquer dispositivo

---

### **Opção 2: TestFlight (iOS) + Google Play Internal Testing (Android)**

#### **Para iOS - TestFlight:**
```bash
# 1. Build de produção
npx eas build --platform ios

# 2. Submit para TestFlight
npx eas submit --platform ios
```

Depois:
1. Acesse [App Store Connect](https://appstoreconnect.apple.com)
2. Vá em "TestFlight"
3. Adicione testers por email
4. Eles recebem convite para instalar

#### **Para Android - Internal Testing:**
```bash
# 1. Build de produção
npx eas build --platform android

# 2. Submit para Play Console
npx eas submit --platform android
```

Depois:
1. Acesse [Google Play Console](https://play.google.com/console)
2. Vá em "Teste interno"
3. Adicione testers
4. Compartilhe o link

---

### **Opção 3: APK Direto (Apenas Android) - Mais Simples**

```bash
# Gerar APK local
npx expo build:android -t apk
```

**Resultado:**
- Gera um arquivo `.apk` que você pode:
  - ✅ Enviar por WhatsApp/Email
  - ✅ Hospedar em Dropbox/Google Drive
  - ✅ Subir em seu servidor

**⚠️ Usuário precisa habilitar "Instalar apps de fontes desconhecidas"**

---

## 🚀 Comandos Rápidos

### Build Preview (Recomendado para testes)
```bash
# Android
npx eas build --profile preview --platform android

# iOS  
npx eas build --profile preview --platform ios

# Ambos
npx eas build --profile preview --platform all
```

### Ver builds anteriores
```bash
npx eas build:list
```

### Cancelar build
```bash
npx eas build:cancel
```

---

## 📊 Comparação das Opções

| Opção | iOS | Android | Facilidade | Link Compartilhável |
|-------|-----|---------|------------|-------------------|
| **EAS Build** | ✅ | ✅ | ⭐⭐⭐⭐⭐ | ✅ Sim |
| **TestFlight** | ✅ | ❌ | ⭐⭐⭐ | ✅ Sim |
| **Play Internal** | ❌ | ✅ | ⭐⭐⭐ | ✅ Sim |
| **APK Direto** | ❌ | ✅ | ⭐⭐⭐⭐ | ⚠️ Manual |

---

## 💡 Recomendação

**Para desenvolvimento/testes rápidos:**
```bash
npx eas build --profile preview --platform android
```
Você recebe um link em 10-15 minutos que pode compartilhar!

**Para beta testing profissional:**
- Use **TestFlight** (iOS) + **Play Internal Testing** (Android)

---

## 🔑 Requisitos

1. **Conta Expo**: [expo.dev](https://expo.dev)
2. **Apple Developer** (para iOS): $99/ano
3. **Google Play Console** (para Android): $25 uma vez

---

## 📝 Notas Importantes

- ✅ EAS Build tem plano gratuito (30 builds/mês)
- ✅ Builds ficam prontos em 10-20 minutos
- ✅ Links de download válidos por 30 dias
- ✅ Pode atualizar sem recriar o link

---

## 🆘 Problemas Comuns

### "Build failed"
```bash
# Limpar cache
npx expo start -c

# Reinstalar dependências
rm -rf node_modules package-lock.json
npm install
```

### "App não instala no iOS"
- Certifique-se que o dispositivo está registrado no Apple Developer
- Use TestFlight para distribuição mais fácil

### "APK muito grande"
```bash
# Build otimizado
npx eas build --profile production --platform android
```
