/**
 * AthlynX — Facebook-style Mobile Bottom Nav
 * 6 items: Home | Reels | Athletes | NIL | Notifications | Profile (with real photo)
 * Profile photo shows the user avatar — social-style navigation
 */
import { Link, useLocation } from 'wouter'
import { useAuth } from '@/_core/hooks/useAuth'

export default function MobileBottomNav() {
  const [location] = useLocation()
  const { user } = useAuth()

  // NIL doctrine: no colored initials default. Silhouette fallback for missing photo.
  const SilhouetteSvg = (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" style={{ width: '60%', height: '60%', color: '#94a3b8' }}>
      <path d="M12 12c2.7 0 4.9-2.2 4.9-4.9S14.7 2.2 12 2.2 7.1 4.4 7.1 7.1 9.3 12 12 12zm0 2.2c-3.3 0-9.8 1.7-9.8 4.9v2.7h19.6v-2.7c0-3.3-6.5-4.9-9.8-4.9z"/>
    </svg>
  )

  const isActive = (href: string) => location === href || location.startsWith(href + '/')

  return (
    <nav
      className="lg:hidden fixed left-0 right-0 z-50 shadow-[0_-24px_80px_rgba(0,0,0,0.62)] backdrop-blur-2xl"
      style={{
        bottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'linear-gradient(180deg, rgba(0,0,0,0.98), rgba(10,22,40,0.98))',
        borderTop: '1px solid rgba(30,144,255,0.28)',
        paddingBottom: '8px',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
      }}
    >
      <div className="flex items-center justify-around py-2 px-2">

        {/* Home */}
        <Link href="/feed" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ color: isActive('/feed') ? '#1E90FF' : '#9aa8c7' }}>
          {isActive('/feed') ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
          )}
          <span style={{ fontSize: '10px', fontWeight: isActive('/feed') ? '700' : '500' }}>Home</span>
        </Link>

        {/* Reels */}
        <Link href="/reels" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ color: isActive('/reels') ? '#1E90FF' : '#9aa8c7' }}>
          {isActive('/reels') ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
          )}
          <span style={{ fontSize: '10px', fontWeight: isActive('/reels') ? '700' : '500' }}>Reels</span>
        </Link>

        {/* Athletes / Friends */}
        <Link href="/browse-athletes" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ color: isActive('/browse-athletes') ? '#1E90FF' : '#9aa8c7' }}>
          {isActive('/browse-athletes') ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          )}
          <span style={{ fontSize: '10px', fontWeight: isActive('/browse-athletes') ? '700' : '500' }}>Athletes</span>
        </Link>

        {/* NIL Portal */}
        <Link href="/nil-portal" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ color: isActive('/nil-portal') ? '#1E90FF' : '#9aa8c7' }}>
          {isActive('/nil-portal') ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          )}
          <span style={{ fontSize: '10px', fontWeight: isActive('/nil-portal') ? '700' : '500' }}>NIL</span>
        </Link>

        {/* Notifications */}
        <Link href="/notifications" className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl" style={{ color: isActive('/notifications') ? '#1E90FF' : '#9aa8c7' }}>
          {isActive('/notifications') ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
          )}
          <span style={{ fontSize: '10px', fontWeight: isActive('/notifications') ? '700' : '500' }}>Alerts</span>
        </Link>

        {/* Profile — real photo like Facebook */}
        <Link
          href={user ? '/profile' : '/signin'}
          className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl"
          style={{ color: isActive('/profile') ? '#1E90FF' : '#9aa8c7' }}
        >
          <div
            className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center"
            style={{
              border: isActive('/profile') ? '2px solid #1E90FF' : '2px solid #9aa8c7',
              background: 'linear-gradient(135deg,#000000,#0a1628)',
              flexShrink: 0,
            }}
            title={user?.avatarUrl ? user.name || 'Profile' : 'Identity pending'}
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || 'Profile'}
                className="w-full h-full object-cover"
              />
            ) : SilhouetteSvg}
          </div>
          <span style={{ fontSize: '10px', fontWeight: isActive('/profile') ? '700' : '500' }}>
            {user ? 'Profile' : 'Sign In'}
          </span>
        </Link>

      </div>

      {/* Sign In strip for guests */}
      {!user && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '6px 16px',
            background: 'rgba(0,100,200,0.15)',
            borderTop: '1px solid rgba(30,58,110,0.5)',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Already a member?</span>
          <Link
            href="/signin"
            style={{
              background: 'linear-gradient(135deg, #1E90FF, #0080FF)',
              color: '#fff',
              fontSize: '12px',
              fontWeight: '700',
              padding: '5px 14px',
              borderRadius: '8px',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
        </div>
      )}
    </nav>
  )
}
