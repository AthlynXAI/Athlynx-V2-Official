/**
 * AthlynX — Unified Auth Hook
 * Reads the custom session cookie via tRPC auth.me.
 * The session cookie (app_session_id) is set by the server on login.
 *
 * Persistent Session Design:
 * - Cookie is set with maxAge = ONE_YEAR_MS (1 year) on every login
 * - staleTime = 5 minutes → auth.me is only re-validated every 5 min
 * - refetchOnWindowFocus = false → switching tabs never triggers re-login
 * - refetchOnMount = false → navigating between pages never re-validates
 * - Users are NEVER asked to re-login unless their 1-year cookie expires
 */
import { useCallback } from "react";
import { trpc } from "@/lib/trpc";

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const { redirectOnUnauthenticated = false, redirectPath = "/signin" } = options ?? {};

  const { data: user, isLoading: loading } = trpc.auth.me.useQuery(undefined, {
    retry: false,
    // 5-minute stale time — session cookie is 1 year, so we only re-validate
    // every 5 minutes. This prevents re-login on every tab switch or page load.
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
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
