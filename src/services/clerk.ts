import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { tokenCache } from './tokenCache';

// Chave pública do Clerk (deve começar com pk_)
const publishableKey = process.env['EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY'];

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env file'
  );
}

export { ClerkProvider, useAuth, useUser, tokenCache };
