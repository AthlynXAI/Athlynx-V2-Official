/**
 * AthlynXAI — Auth Shim (Auth0/Okta PKCE only)
 *
 * Firebase and Supabase auth have been fully removed.
 * All authentication goes through Auth0 PKCE via okta.ts.
 *
 * This file re-exports everything from okta.ts under the same names
 * so no page-level import changes are needed.
 */

export {
  isFirebaseConfigured,
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  signInWithTwitter,
  loginWithRedirect,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  handleRedirectResult,
  firebaseSignOut,
  onAuthStateChanged,
  auth,
} from "./okta";

export type { FirebaseUser } from "./okta";
