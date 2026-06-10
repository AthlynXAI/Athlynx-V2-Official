import type { VercelRequest, VercelResponse } from '@vercel/node';

const CHECKS: Array<{ name: string; url: string; headers: Record<string, string> }> = [
  {
    name: 'GitHub',
    url: 'https://api.github.com/repos/AthlynXAI/Athlynx-V2-Official',
    headers: { 'User-Agent': 'AthlynX-HealthCheck' },
  },
  {
    name: 'Supabase',
    url: `${process.env.VITE_SUPABASE_URL}/rest/v1/`,
    headers: {
      apikey: process.env.VITE_SUPABASE_ANON_KEY ?? '',
      Authorization: `Bearer ${process.env.VITE_SUPABASE_ANON_KEY ?? ''}`,
    },
  },
  {
    name: 'Stripe',
    url: 'https://api.stripe.com/v1/balance',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY ?? ''}`,
    },
  },
  {
    name: 'SendGrid',
    url: 'https://api.sendgrid.com/v3/scopes',
    headers: {
      Authorization: `Bearer ${process.env.SENDGRID_API_KEY ?? ''}`,
    },
  },
  {
    name: 'Cloudflare',
    url: `https://api.cloudflare.com/client/v4/zones?name=athlynx.ai`,
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN ?? ''}`,
    },
  },
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers['authorization'] ?? '';
  const adminToken = process.env.INTERNAL_ADMIN_TOKEN ?? '';
  if (adminToken && authHeader !== `Bearer ${adminToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const results = await Promise.allSettled(
    CHECKS.map(async (check) => {
      const start = Date.now();
      try {
        const r = await fetch(check.url, {
          method: 'GET',
          headers: check.headers,
          signal: AbortSignal.timeout(5000),
        });
        return {
          name: check.name,
          status: r.ok ? 'ok' : 'degraded',
          httpStatus: r.status,
          latencyMs: Date.now() - start,
        };
      } catch (err: unknown) {
        return {
          name: check.name,
          status: 'down',
          error: err instanceof Error ? err.message : String(err),
          latencyMs: Date.now() - start,
        };
      }
    })
  );

  const services = results.map((r) =>
    r.status === 'fulfilled' ? r.value : { name: 'unknown', status: 'error' }
  );

  const allOk = services.every((s) => s.status === 'ok');

  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    timestamp: new Date().toISOString(),
    build: 'Series1-Build1-PR1',
    launchTarget: '2026-07-01',
    overall: allOk ? 'healthy' : 'degraded',
    services,
  });
}
