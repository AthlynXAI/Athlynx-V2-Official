/**
 * AthlynXAI — Auth Client (Supabase OAuth)
 * Firebase has been fully removed. All social sign-in now goes through
 * Supabase Auth (Google, Apple, Twitter).
 *
 * Exports the same surface that pages imported from the old firebase.ts so
 * no page-level import changes are needed.
 */
import { supabase } from "./supabase";

export const isFirebaseConfigured = true; // Supabase is always configured

// ─── Shared types ──────────────────────────────────────────────────────────

export type FirebaseUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

type AuthResult = { idToken: string; user: FirebaseUser };

// ─── OAuth helpers ─────────────────────────────────────────────────────────

async function signInWithOAuth(
  provider: "google" | "apple" | "twitter"
): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
      scopes: provider === "google" ? "email profile" : undefined,
    },
  });
  if (error) throw error;
  // signInWithOAuth triggers a redirect — result handled in AuthCallback
  return {
    idToken: "",
    user: { uid: "", displayName: null, email: null, photoURL: null },
  };
}

/**
 * Called at /auth/callback to exchange the OAuth code for a session.
 * Returns the session access_token as the "idToken" for syncSupabaseUser.
 */
export async function handleRedirectResult(): Promise<AuthResult | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  const session = data.session;
  const user = session.user;
  return {
    idToken: session.access_token,
    user: {
      uid: user.id,
      displayName:
        user.user_metadata?.full_name ?? user.user_metadata?.name ?? null,
      email: user.email ?? null,
      photoURL: user.user_metadata?.avatar_url ?? null,
    },
  };
}

export async function signInWithGoogle(): Promise<AuthResult> {
  return signInWithOAuth("google");
}

export async function signInWithApple(): Promise<AuthResult> {
  return signInWithOAuth("apple");
}

export async function signInWithFacebook(): Promise<AuthResult> {
  // Facebook not configured in Supabase — fall back to Google
  console.warn("[Auth] Facebook OAuth not configured; using Google");
  return signInWithOAuth("google");
}

export async function signInWithTwitter(): Promise<AuthResult> {
  return signInWithOAuth("twitter");
}

export async function firebaseSignOut(): Promise<void> {
  await supabase.auth.signOut();
}

// ─── Email/password helpers backed by Supabase ────────────────────────────

export async function signInWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function createUserWithEmailAndPassword(
  _auth: unknown,
  email: string,
  password: string
) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

export function onAuthStateChanged(
  _auth: unknown,
  callback: (user: FirebaseUser | null) => void
) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    if (!session) {
      callback(null);
      return;
    }
    const u = session.user;
    callback({
      uid: u.id,
      displayName:
        u.user_metadata?.full_name ?? u.user_metadata?.name ?? null,
      email: u.email ?? null,
      photoURL: u.user_metadata?.avatar_url ?? null,
    });
  });
  return () => data.subscription.unsubscribe();
}

// auth export (pages that reference `auth` directly)
export const auth = supabase.auth;
