/**
 * AthlynXAI — Firebase Auth Client
 * Supports: Google, Apple, Facebook, X/Twitter, Email/Password
 * iOS/Android: uses signInWithRedirect (Safari blocks popups)
 * Desktop: uses signInWithPopup
 */
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  OAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = isFirebaseConfigured
  ? (getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0])
  : null;

export const auth = isFirebaseConfigured && app ? getAuth(app) : null as any;

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");
googleProvider.addScope("profile");

const appleProvider = new OAuthProvider("apple.com");
appleProvider.addScope("email");
appleProvider.addScope("name");

const facebookProvider = new FacebookAuthProvider();
facebookProvider.addScope("email");
facebookProvider.addScope("public_profile");

const twitterProvider = new TwitterAuthProvider();

/** Detect mobile (iOS or Android) — use redirect instead of popup */
function isMobile(): boolean {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

/** Sign in with any provider — always use popup (opens real browser window, avoids disallowed_useragent on mobile) */
async function signInWithProvider(
  provider: GoogleAuthProvider | OAuthProvider | FacebookAuthProvider | TwitterAuthProvider
): Promise<{ idToken: string; user: FirebaseUser }> {
  if (!isFirebaseConfigured || !auth) throw new Error('Firebase is not configured');
  // Always use popup — signInWithRedirect causes Error 403 disallowed_useragent on mobile
  // because it opens in an embedded WebView. Popup opens a real browser window which Google allows.
  const result = await signInWithPopup(auth, provider);
  const idToken = await result.user.getIdToken();
  return { idToken, user: result.user };
}

/**
 * Call this on app load to handle redirect result after mobile sign-in.
 * Returns user data if a redirect just completed, null otherwise.
 */
export async function handleRedirectResult(): Promise<{ idToken: string; user: FirebaseUser } | null> {
  if (!isFirebaseConfigured || !auth) return null;
  try {
    const result = await getRedirectResult(auth);
    if (!result) return null;
    const idToken = await result.user.getIdToken();
    return { idToken, user: result.user };
  } catch (err: any) {
    if (
      err?.code === 'auth/missing-initial-state' ||
      err?.message?.includes('missing initial state') ||
      err?.message?.includes('sessionStorage')
    ) {
      return null;
    }
    throw err;
  }
}

export async function signInWithGoogle(): Promise<{ idToken: string; user: FirebaseUser }> {
  return signInWithProvider(googleProvider);
}

export async function signInWithApple(): Promise<{ idToken: string; user: FirebaseUser }> {
  return signInWithProvider(appleProvider);
}

export async function signInWithFacebook(): Promise<{ idToken: string; user: FirebaseUser }> {
  return signInWithProvider(facebookProvider);
}

export async function signInWithTwitter(): Promise<{ idToken: string; user: FirebaseUser }> {
  return signInWithProvider(twitterProvider);
}

export async function firebaseSignOut(): Promise<void> {
  if (auth) await signOut(auth);
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  type FirebaseUser,
};
