import { useEffect, useState } from 'react';

type ServiceStatus = {
  name: string;
  status: 'ok' | 'degraded' | 'down' | 'error' | 'loading';
  httpStatus?: number;
  latencyMs?: number;
  error?: string;
};

type HealthResponse = {
  timestamp: string;
  build: string;
  launchTarget: string;
  overall: 'healthy' | 'degraded';
  services: ServiceStatus[];
};

const STATUS_COLOR: Record<string, string> = {
  ok: '#00e5ff',
  degraded: '#1E90FF',
  down: '#ef4444',
  error: '#ef4444',
  loading: '#64748b',
};

const STATUS_LABEL: Record<string, string> = {
  ok: '✅ OK',
  degraded: '⚠️ Degraded',
  down: '🔴 Down',
  error: '🔴 Error',
  loading: '⏳ Checking…',
};

export default function BuildSession() {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = import.meta.env.VITE_INTERNAL_ADMIN_TOKEN ?? '';
      const res = await fetch('/api/session-health', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: HealthResponse = await res.json();
      setHealth(data);
      setLastChecked(
        new Date().toLocaleTimeString('en-US', { timeZone: 'America/Chicago' }) + ' CDT'
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0e1a',
        color: '#e2e8f0',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        padding: '2rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '2rem' }}>🦀</span>
        <div>
          <h1 style={{ margin: 0, color: '#00e5ff', fontSize: '1.5rem', fontWeight: 700 }}>
            ATHLYNX Build Session
          </h1>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>
            {health?.build ?? 'Series1-Build1-PR1'} · Launch Target:{' '}
            <span style={{ color: '#00e5ff' }}>{health?.launchTarget ?? '2026-07-01'}</span>
          </p>
        </div>
      </div>

      {!loading && health && (
        <div
          style={{
            background: health.overall === 'healthy' ? '#0d2d1a' : '#2d1a0d',
            border: `1px solid ${health.overall === 'healthy' ? '#00e5ff' : '#1E90FF'}`,
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <span style={{ fontSize: '1.5rem' }}>
            {health.overall === 'healthy' ? '🟢' : '🟡'}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem' }}>
              Stack is{' '}
              {health.overall === 'healthy'
                ? 'HEALTHY — Ready to build'
                : 'DEGRADED — Check services below'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
              Last checked: {lastChecked}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p style={{ color: '#64748b', textAlign: 'center', padding: '3rem 0' }}>
          Running health checks…
        </p>
      )}
      {error && (
        <div
          style={{
            color: '#ef4444',
            padding: '1rem',
            border: '1px solid #ef4444',
            borderRadius: '0.5rem',
          }}
        >
          ⚠️ Health check failed: {error}
        </div>
      )}

      {!loading && health && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          {health.services.map((svc) => (
            <div
              key={svc.name}
              style={{
                background: '#111827',
                border: `1px solid ${STATUS_COLOR[svc.status] ?? '#334155'}`,
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem' }}>
                {svc.name}
              </div>
              <div style={{ color: STATUS_COLOR[svc.status], fontWeight: 600, fontSize: '0.9rem' }}>
                {STATUS_LABEL[svc.status] ?? svc.status}
              </div>
              {svc.latencyMs !== undefined && (
                <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {svc.latencyMs}ms
                </div>
              )}
              {svc.error && (
                <div style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                  {svc.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div
        style={{
          background: '#111827',
          border: '1px solid #1e3a5f',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ color: '#00e5ff', marginTop: 0, fontSize: '1rem' }}>📋 Pre-Session Checklist</h2>
        <ul style={{ paddingLeft: '1.25rem', lineHeight: 2, color: '#94a3b8', margin: 0 }}>
          <li>🔋 Low Power Mode <strong style={{ color: '#fff' }}>OFF</strong> (Settings → Battery)</li>
          <li>📱 Background App Refresh for Perplexity <strong style={{ color: '#fff' }}>ON</strong></li>
          <li>🐙 GitHub connector toggled <strong style={{ color: '#fff' }}>ON</strong> in Perplexity</li>
          <li>☁️ Google Drive + Dropbox + OneDrive connectors <strong style={{ color: '#fff' }}>ON</strong></li>
          <li>🔌 Phone plugged in or above 50% battery</li>
        </ul>
      </div>

      <button
        onClick={fetchHealth}
        disabled={loading}
        style={{
          background: '#00e5ff',
          color: '#0a0e1a',
          border: 'none',
          borderRadius: '0.5rem',
          padding: '0.75rem 2rem',
          fontWeight: 700,
          fontSize: '1rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? 'Checking…' : '🔄 Recheck All Systems'}
      </button>
    </div>
  );
}
