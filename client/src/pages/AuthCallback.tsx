import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'wouter'
import { handleRedirectResult } from '@/lib/okta'
import { trpc } from '@/lib/trpc'
import { RouteErrorBoundary } from '@/components/GlobalErrorBoundary'

function AuthCallbackInner() {
  const [, setLocation] = useLocation()
  const [status, setStatus] = useState('Signing you in...')
  const ran = useRef(false)

  const syncMutation = trpc.auth.syncUser.useMutation({
    onSuccess: (data: any) => {
      const isNewUser = data?.isNewUser ?? false
      setStatus(isNewUser ? 'Welcome! Setting up your profile...' : 'Welcome back!')
      setTimeout(() => { window.location.href = 'https://athlynx.ai' }, 500)
    },
    onError: (err) => {
      setStatus('Sign-in failed: ' + (err.message || 'Unknown error'))
      setTimeout(() => { setLocation('/signin') }, 2000)
    },
  })

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    async function run() {
      try {
        const result = await handleRedirectResult()

        if (!result || !result.idToken) {
          setStatus('Sign-in failed. Redirecting...')
          setTimeout(() => { setLocation('/signin') }, 1500)
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
        setStatus('Sign-in error. Redirecting...')
        setTimeout(() => { setLocation('/signin') }, 2000)
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
  return <RouteErrorBoundary><AuthCallbackInner /></RouteErrorBoundary>
}
