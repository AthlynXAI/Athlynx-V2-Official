import { useEffect, useState } from 'react'
import { useLocation } from 'wouter'
import { supabase } from '@/lib/supabaseAuth'
import { trpc } from '@/lib/trpc'
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary'

/**
 * AthlynXAI — Auth Callback Handler
 * Handles Supabase OAuth redirect result (Twitter).
 * After Supabase verifies the OAuth token, we sync the user to our DB
 * and set our own session cookie via syncSupabaseUser.
 */
function AuthCallbackInner() {
  const [, setLocation] = useLocation()
  const [status, setStatus] = useState('Signing you in...')

  const syncSupabaseMutation = trpc.auth.syncSupabaseUser.useMutation({
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
    async function handleCallback() {
      try {
        // Supabase handles the OAuth code exchange automatically via detectSessionInUrl
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error('[AuthCallback] Supabase session error:', error)
          setStatus('Sign-in error. Redirecting...')
          setTimeout(() => { setLocation('/signin') }, 2000)
          return
        }

        if (!data.session) {
          // No session — might be a direct navigation, send to welcome
          setLocation('/welcome')
          return
        }

        const { session } = data
        const user = session.user
        const meta = user.user_metadata ?? {}

        setStatus('Completing sign-in...')

        // Sync to AthlynX DB and set session cookie
        await syncSupabaseMutation.mutateAsync({
          accessToken: session.access_token,
          name: meta.full_name ?? meta.name ?? '',
          email: user.email ?? '',
          picture: meta.avatar_url ?? meta.picture ?? undefined,
        })
      } catch (err: any) {
        if (err?.message?.includes('Redirecting')) return
        console.error('[AuthCallback] Unexpected error:', err)
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
