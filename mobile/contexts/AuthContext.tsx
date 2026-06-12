import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe, loginWithAuth0, logout, User } from "../lib/auth";
// Vexo analytics — lightweight event tracking
async function vexoIdentify(email: string) {
  try {
    await fetch("https://api.vexo.co/v1/identify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ apiKey: "5c0b1865-f655-4664-bc5a-b65786bdee1a", userId: email, traits: { email } }),
    });
  } catch {}
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /** Opens Auth0 Universal Login (PKCE). The ONLY way to sign in or sign up. */
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Hard timeout: never let the splash hang on a slow native call (SecureStore)
  // or unreachable backend. 4s is plenty for first-launch auth bootstrap; if it
  // takes longer the user lands on the welcome screen and can sign in manually.
  async function checkAuth() {
    const timeout = new Promise<null>((resolve) =>
      setTimeout(() => resolve(null), 4000)
    );
    try {
      const me = await Promise.race([getMe(), timeout]);
      setUser(me);
    } catch (err) {
      try { console.warn("[AuthContext] checkAuth failed:", (err as Error)?.message); } catch {}
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn() {
    const { user: u } = await loginWithAuth0();
    setUser(u);
    try { vexoIdentify(u.email); } catch {}
  }

  async function signOut() {
    await logout();
    setUser(null);
  }

  async function refreshUser() {
    const me = await getMe();
    setUser(me);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
