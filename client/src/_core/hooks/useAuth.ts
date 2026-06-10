/**
 * AthlynX — Unified Auth Hook
 * Reads the custom session cookie via tRPC auth.me.
 * The session cookie (app_session_id) is set by the server on login.
 */
import { useCallback } from "react";
import { trpc } from "@/lib/trpc";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } = options ?? {};

  const { data: user, isLoading: loading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    staleTime: 30_000,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/signin";
    },
  });

  const logout = useCallback(async () => {
    logoutMutation.mutate();
  }, [logoutMutation]);

  const login = useCallback((returnTo?: string) => {
    const target = returnTo ?? window.location.pathname;
    sessionStorage.setItem("auth_return_to", target);
    window.location.href = "/signin";
  }, []);

  const isAuthenticated = !!user;

  if (
    redirectOnUnauthenticated &&
    !loading &&
    !isAuthenticated &&
    typeof window !== "undefined" &&
    window.location.pathname !== redirectPath
  ) {
    window.location.href = redirectPath;
  }

  return {
    user: user ?? null,
    loading,
    isAuthenticated,
    error: null,
    login,
    logout,
    refresh: async () => {},
    // Legacy compatibility stubs
    getAccessTokenSilently: async () => "",
    getIdTokenClaims: async () => null,
  };
}
