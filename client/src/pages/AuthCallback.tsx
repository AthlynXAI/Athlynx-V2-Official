import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { handleRedirectResult } from '@/lib/auth'
import { trpc } from '@/lib/trpc'
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary'

function AuthCallbackInner() {
  const [, setLocation] = useLocation()
  const [status, setStatus] = useState('Signing you in...')
  const [errorDetail, setErrorDetail] = useState<string | null>(null)
  const ran = useRef(false)

  const syncMutation = trpc.auth.syncUser.useMutation({
    onSuccess: (data: any) => {
      const isNewUser = data?.isNewUser ?? false
      setStatus(isNewUser ? 'Welcome! Setting up your profile...' : 'Welcome back!')
      // New user → /onboarding, returning user → /portal (handled by Welcome.tsx)
      setTimeout(() => { setLocation('/welcome') }, 500)
    },
    onError: (err) => {
      const msg = err.message || 'Unknown error'
      setStatus('Sign-in failed')
      setErrorDetail('Server error: ' + msg)
      setTimeout(() => { setLocation('/signin') }, 6000)
    },
  })

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      try {
        const result = await handleRedirectResult()

        if (!result || !result.idToken) {
          setStatus('Sign-in failed')
          setErrorDetail('No ID token received from Auth0. Please try again.')
          setTimeout(() => { setLocation('/signin') }, 6000)
          return
        }


        setStatus('Completing sign-in...')

        // 1 retry for DB cold-start
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            await syncMutation.mutateAsync({
              idToken: result.idToken,
              name: result.user.displayName ?? '',
              email: result.user.email ?? '',
              picture: result.user.photoURL ?? undefined,
            })
            return
          } catch (err: any) {
            if (attempt < 2) {
              setStatus('Almost there...')
              await new Promise(r => setTimeout(r, 2000))
            } else {
              throw err
            }
          }
        }
      } catch (err: any) {
        console.error('[AuthCallback] Fatal:', err)
        const msg = err?.message || String(err) || 'Unknown error'
        setStatus('Sign-in failed')
        setErrorDetail(msg)
        setTimeout(() => { setLocation('/signin') }, 8000)
      }
    }

    run()
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
      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
        <div style={{
          width: '56px', height: '56px',
          border: '3px solid #00c2ff',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: errorDetail ? 'none' : 'spin 0.8s linear infinite',
          margin: '0 auto 20px',
          opacity: errorDetail ? 0.3 : 1,
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#ffffff', fontWeight: '700', fontSize: '18px', margin: '0 0 8px' }}>
          {status}
        </p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', margin: '0 0 16px' }}>
          Setting up your AthlynXAI account
        </p>
        {errorDetail && (
          <div style={{
            background: 'rgba(255,60,60,0.12)',
            border: '1px solid rgba(255,60,60,0.4)',
            borderRadius: '8px',
            padding: '12px 16px',
            marginTop: '12px',
          }}>
            <p style={{ color: '#ff6b6b', fontSize: '13px', margin: 0, wordBreak: 'break-word', textAlign: 'left' }}>
              <strong>Error:</strong> {errorDetail}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', margin: '8px 0 0', textAlign: 'left' }}>
              Redirecting to sign-in page...
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function AuthCallback() {
  return <RouteErrorBoundary><AuthCallbackInner /></RouteErrorBoundary>
}
