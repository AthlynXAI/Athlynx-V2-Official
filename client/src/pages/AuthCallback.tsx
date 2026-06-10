import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { handleRedirectResult } from '@/lib/firebase'
import { trpc } from '@/lib/trpc'
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary'

/**
 * AthlynXAI — Auth Callback Handler
 * Handles both:
 * 1. Supabase OAuth redirect result (after Google/Apple/Twitter sign-in)
 * 2. Server OAuth callback (desktop)
 */
function AuthCallbackInner() {
  const [, setLocation] = useLocation()
  const [status, setStatus] = useState('Signing you in...')

  const syncFirebaseMutation = trpc.auth.syncFirebaseUser.useMutation({
    onSuccess: (data: any) => {
      // Unified handoff: every authenticated path lands on /welcome.
      // /welcome reads identity %, picks the App vs Web door, and routes onward.
      const isNewUser = data?.isNewUser ?? false
      setStatus(isNewUser ? 'Welcome! Setting up your profile...' : 'Welcome back!')
      setTimeout(() => { window.location.href = '/welcome' }, 500)
    },
    onError: (err) => {
      setStatus('Sign-in failed: ' + (err.message || 'Unknown error'))
      setTimeout(() => { setLocation('/signin') }, 2000)
    },
  })

  useEffect(() => {
    // Retry helper — 1 automatic retry with 2s delay for DB cold-starts
    async function doSync(payload: {
      idToken: string
      name: string
      email: string
      picture?: string
      phone?: string
    }, attempt = 1): Promise<void> {
      try {
        await syncFirebaseMutation.mutateAsync(payload)
      } catch (err: any) {
        if (attempt < 2) {
          console.warn(`[AuthCallback] Sync attempt ${attempt} failed — retrying in 2s...`, err?.message)
          setStatus('Almost there...')
          await new Promise(r => setTimeout(r, 2000))
          return doSync(payload, attempt + 1)
        }
        // Both attempts failed — CRITICAL log for Vercel function logs
        console.error(`[AuthCallback] CRITICAL: Both sync attempts failed for email=${payload.email}`, err)
        setStatus('Sign-in error. Redirecting...')
        setTimeout(() => { setLocation('/signin') }, 2000)
      }
    }

    async function handleCallback() {
      try {
        // Try to get Supabase OAuth redirect result
        const result = await handleRedirectResult()
        if (result) {
          setStatus('Completing sign-in...')
          // Extract phone_number from ID token claims if present
          let phone: string | undefined
          try {
            const tokenPayload = JSON.parse(atob(result.idToken.split('.')[1]))
            phone = tokenPayload?.phone_number || tokenPayload?.phone || undefined
          } catch { /* non-critical */ }
          await doSync({
            idToken: result.idToken,
            name: result.user.displayName ?? '',
            email: result.user.email ?? '',
            picture: result.user.photoURL ?? undefined,
            phone,
          })
          return
        }
        // No redirect result — server OAuth already set cookie. Send to /welcome
        // for the unified two-door handoff (Manus spec 01-Welcome-Screen).
        setLocation('/welcome')
      } catch (err: any) {
        if (err?.message?.includes('Redirecting')) return
        setStatus('Sign-in error. Redirecting...')
        setTimeout(() => { setLocation('/signin') }, 2000)
      }
    }
    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: '56px', height: '56px',
          border: '3px solid #00c2ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', margin: '0 0 8px' }}>
          {status}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: 0 }}>
          Setting up your AthlynXAI account
        </p>
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return <RouteErrorBoundary><AuthCallbackInner /></RouteErrorBoundary>;
}
