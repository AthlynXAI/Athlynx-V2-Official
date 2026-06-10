/**
 * AthlynX — Unified Auth Hook
 * Re-exports from the primary hook for backward compatibility.
 * Uses session cookie via trpc.auth.me — no Auth0 dependency.
 */
export { useAuth } from "@/_core/hooks/useAuth";
