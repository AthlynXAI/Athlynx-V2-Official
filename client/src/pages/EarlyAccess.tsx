import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { useState } from 'react'
import { Link, useLocation } from 'wouter'
import { trpc } from '@/lib/trpc'
import {
  isAuthConfigured,
  signInWithGoogle,
  signInWithApple,
  signInWithFacebook,
  signInWithTwitter,
} from '@/lib/auth'

function EarlyAccessInner() {
  const [, setLocation] = useLocation()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const [socialLoading, setSocialLoading] = useState<string | null>(null)

  const savePhoneMutation = trpc.auth.savePhone.useMutation()

  const syncMutation = trpc.auth.syncUser.useMutation({
    onSuccess: () => { window.location.href = '/onboarding' },
    onError: (err) => { setError(err.message || 'Sign-up failed.'); setSocialLoading(null) },
  })

  // Auto-login when account already exists — seamless redirect to portal
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => { window.location.href = '/portal' },
    onError: () => {
      // Password mismatch — send to signin with email pre-filled
      window.location.href = '/signin?email=' + encodeURIComponent(email.trim())
      setLoading(false)
    },
  })

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      // Save phone number if provided — this also triggers the Welcome SMS on the server
      if (phone.trim()) {
        savePhoneMutation.mutate({ phone: phone.trim() })
      }
      // Redirect to onboarding to set up profile
      window.location.href = '/onboarding'
    },
    onError: (err) => {
      const msg = err.message || ''
      if (msg.toLowerCase().includes('already exists')) {
        // Account exists — silently auto-login with same credentials and go to portal
        loginMutation.mutate({ email: email.trim(), password: password.trim() })
      } else {
        setError(msg || 'Registration failed. Please try again.')
        setLoading(false)
      }
    },
  })

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setError('Please fill in all required fields.')
      return
    }
    setLoading(true)
    setError('')
    registerMutation.mutate({
      name: fullName.trim(),
      email: email.trim(),
      password: password.trim(),
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    })
  }

  async function handleGoogleSignUp() {
    return handleSocialSignIn('google')
  }

  async function handleSocialSignIn(provider: string) {
    if (!isAuthConfigured) {
      setError('Social sign-up is temporarily unavailable. Please use email/password.')
      return
    }
    setError('')
    setSocialLoading(provider)
    try {
      let result: { idToken: string; user: any }
      if (provider === 'google') result = await signInWithGoogle()
      else if (provider === 'apple') result = await signInWithApple()
      else if (provider === 'facebook') result = await signInWithFacebook()
      else result = await signInWithTwitter()
      syncMutation.mutate({
        idToken: result.idToken,
        name: result.user.displayName ?? '',
        email: result.user.email ?? '',
        picture: result.user.photoURL ?? undefined,
      })
    } catch (err: any) {
      const msg = err?.message ?? 'Sign-up failed'
      if (msg.includes('popup-closed') || msg.includes('cancelled') || msg.includes('popup_closed')) {
        setSocialLoading(null); return
      }
      setError(msg)
      setSocialLoading(null)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'system-ui, sans-serif', padding: '20px',
      }}>
        <div style={{
          background: 'rgba(0,200,100,0.08)', border: '1px solid rgba(0,200,100,0.3)',
          borderRadius: '16px', padding: '48px 40px', width: '100%', maxWidth: '420px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}></div>
          <h2 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', marginBottom: '12px' }}>
            Welcome to AthlynX!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
            Your account is live. Check your email at <strong style={{ color: '#00c8ff' }}>{email}</strong> for your welcome message.
            Taking you to your portal now...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0f1e 0%, #0d1b3e 50%, #0a1628 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'system-ui, sans-serif', padding: '20px',
    }}>
      <div style={{
        background: 'rgba(13,31,60,1)', border: '1px solid rgba(0,200,255,0.2)',
        borderRadius: '16px', padding: '40px', width: '100%', maxWidth: '440px',
        boxShadow: '0 0 40px rgba(0,150,255,0.1)',
      }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{
            fontSize: '28px', fontWeight: '900',
            background: 'linear-gradient(135deg, #00c8ff, #0066cc)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            marginBottom: '6px',
          }}>
            AthlynXAI
          </div>
          <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 12px' }}>
            Create your free account — 7-day trial
          </p>
          {/* Sign In link — prominent at top */}
          <div style={{
            background: 'rgba(0,194,255,0.08)',
            border: '1px solid rgba(0,194,255,0.3)',
            borderRadius: '10px',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}>
            <span style={{ color: '#94a3b8', fontSize: '14px' }}>Already have an account?</span>
            <span
              onClick={() => setLocation('/signin')}
              style={{
                color: '#00c8ff', cursor: 'pointer', fontWeight: '800',
                fontSize: '14px', textDecoration: 'underline',
              }}
            >
              Sign In →
            </span>
          </div>
        </div>

        {/* Social Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <button
            onClick={handleGoogleSignUp}
            disabled={!!socialLoading || loading}
            style={{
              width: '100%', padding: '11px', background: '#fff', border: 'none',
              borderRadius: '8px', color: '#333', fontSize: '14px', fontWeight: '600',
              cursor: (socialLoading || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              opacity: (socialLoading && socialLoading !== 'google') ? 0.5 : 1,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign up with Google
          </button>

          <button
            onClick={() => handleSocialSignIn('facebook')}
            style={{
              width: '100%', padding: '11px', background: '#1877F2', border: 'none',
              borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Sign up with Facebook
          </button>

          <button
            onClick={() => handleSocialSignIn('twitter')}
            style={{
              width: '100%', padding: '11px', background: '#000',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px',
              color: '#fff', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            }}
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Sign up with X
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '16px 0' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(13,31,60,1)' }} />
          <span style={{ color: '#64748b', fontSize: '12px', padding: '0 12px' }}>or sign up with email</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(13,31,60,1)' }} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.4)',
            borderRadius: '8px', padding: '12px', marginBottom: '16px',
            color: '#fca5a5', fontSize: '14px', textAlign: 'center',
          }}>
            {error}
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Full Name *
            </label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Chad Dozier"
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: 'rgba(13,31,60,1)', border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Email Address *
            </label>
            <input
              type="text"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{
                width: '100%', padding: '11px 14px',
                background: 'rgba(13,31,60,1)', border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Phone Number <span style={{ color: '#64748b', fontWeight: '400', textTransform: 'none' }}>(for SMS updates)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              style={{
                width: '100%', padding: '11px 14px',
                background: 'rgba(13,31,60,1)', border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', marginBottom: '5px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Password *
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              minLength={8}
              style={{
                width: '100%', padding: '11px 14px',
                background: 'rgba(13,31,60,1)', border: '1px solid rgba(0,200,255,0.25)',
                borderRadius: '8px', color: '#fff', fontSize: '14px',
                outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? 'rgba(0,102,204,0.5)' : 'linear-gradient(135deg, #0066cc, #00c8ff)',
              border: 'none', borderRadius: '8px', color: '#fff',
              fontSize: '15px', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              letterSpacing: '0.5px', marginTop: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? (
              <>
                <span className="animate-spin" style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block', flexShrink: 0 }} />
                Creating Account...
              </>
            ) : 'Create Free Account →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '13px', margin: '20px 0 0' }}>
          Already have an account?{' '}
          <span
            onClick={() => setLocation('/signin')}
            style={{ color: '#00c8ff', cursor: 'pointer', fontWeight: '600' }}
          >
            Sign In
          </span>
        </p>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '11px', margin: '12px 0 0', lineHeight: '1.5' }}>
          By signing up you agree to our{' '}
          <Link href="/terms-of-service"><span style={{ color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Terms</span></Link>
          {' '}&amp;{' '}
          <Link href="/privacy-policy"><span style={{ color: '#64748b', cursor: 'pointer', textDecoration: 'underline' }}>Privacy Policy</span></Link>.
          <br />7-day free trial — not charged for 7 days.
        </p>
      </div>
    </div>
  )
}

export default function EarlyAccess() {
  return <RouteErrorBoundary><EarlyAccessInner /></RouteErrorBoundary>;
}
