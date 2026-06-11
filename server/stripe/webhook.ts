import Stripe from "stripe";
import express from "express";
import type { Application, Request, Response } from "express";
import { eq, sql } from "drizzle-orm";
import { getDb } from "../db";
import { users, creditTransactions, creditPackagePurchases } from "../../drizzle/schema";
import { sendEmail } from "../services/aws-ses";
import {
  applyPlanGrant,
  applyBonusGrant,
  applyPackPurchase,
  applyRefund,
} from "../services/credits";

async function sendPaymentConfirmationEmail(opts: {
  to: string;
  name: string;
  plan: string;
  amount: number;
  sessionId: string;
}): Promise<void> {
  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#0a0f1e;font-family:Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0f1e;padding:40px 20px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#0d1b3e;border-radius:16px;overflow:hidden;border:1px solid #1e3a6e;">
<tr><td style="background:linear-gradient(135deg,#0066ff,#00c2ff);padding:32px;text-align:center;">
  <div style="font-size:36px;font-weight:900;color:#fff;letter-spacing:4px;">AthlynX</div>
  <div style="font-size:12px;color:rgba(255,255,255,0.85);letter-spacing:6px;margin-top:6px;">PAYMENT CONFIRMED</div>
</td></tr>
<tr><td style="padding:36px;">
  <h2 style="color:#fff;font-size:22px;margin:0 0 16px;">You're all set, ${opts.name}! 🏆</h2>
  <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0 0 28px;">
    Your <strong style="color:#00c2ff;">${opts.plan}</strong> subscription is now active.
  </p>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a1628;border-radius:10px;overflow:hidden;margin-bottom:28px;">
    <tr><td style="padding:14px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">PLAN</span>
      <span style="color:#fff;font-size:16px;font-weight:bold;">${opts.plan}</span>
    </td></tr>
    <tr><td style="padding:14px 18px;border-bottom:1px solid #1e3a6e;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">AMOUNT PAID</span>
      <span style="color:#00c2ff;font-size:16px;font-weight:bold;">$${opts.amount.toFixed(2)}</span>
    </td></tr>
    <tr><td style="padding:14px 18px;">
      <span style="color:#94a3b8;font-size:12px;display:block;margin-bottom:2px;">ORDER ID</span>
      <span style="color:#fff;font-size:13px;">${opts.sessionId}</span>
    </td></tr>
  </table>
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center">
      <a href="https://athlynx.ai/feed" style="display:inline-block;background:linear-gradient(135deg,#0066ff,#00c2ff);color:#fff;font-weight:900;font-size:15px;padding:14px 36px;border-radius:50px;text-decoration:none;">GO TO DASHBOARD →</a>
    </td></tr>
  </table>
</td></tr>
<tr><td style="background:#060d1f;padding:20px;text-align:center;border-top:1px solid #1e3a6e;">
  <p style="color:#475569;font-size:12px;margin:0;">A Dozier Holdings Group Company · athlynx.ai</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
  await sendEmail({
    to: opts.to,
    subject: `Payment Confirmed — Your AthlynX ${opts.plan} is Active 🏆`,
    html,
    text: `Payment confirmed! Your AthlynX ${opts.plan} is now active. Amount: $${opts.amount.toFixed(2)}. Order ID: ${opts.sessionId}. Visit https://athlynx.ai`,
  });
}

let _stripe: Stripe | null = null;
function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY ?? "";
    if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
    _stripe = new Stripe(key, { apiVersion: "2026-05-27.dahlia" });
  }
  return _stripe;
}

function isPgUniqueViolation(error: unknown): boolean {
  const err = error as { code?: string; cause?: { code?: string }; message?: string };
  return (
    err?.code === "23505" ||
    err?.cause?.code === "23505" ||
    /duplicate key value violates unique constraint/i.test(String(err?.message ?? error))
  );
}

export function registerStripeWebhook(app: Application) {
  // MUST use raw body parser BEFORE express.json() for webhook signature verification
  // Canonical path: /api/webhooks/stripe (matches Stripe dashboard destination: athlynx-stripe-webhook)
  // Legacy path: /api/stripe/webhook (kept for backward compatibility)
  const rawParser = express.raw({ type: "application/json" });

  async function handleWebhook(req: Request, res: Response) {
      const sig = req.headers["stripe-signature"];
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

      let event: Stripe.Event;

      // ── Step 1: Require a Stripe-Signature header. No bypass. ──
      // (Build 26.2: closed the security hole that returned {verified:true} for any unsigned POST.)
      if (!sig) {
        console.warn("[Stripe Webhook] Rejected — missing stripe-signature header");
        return res.status(400).json({ verified: false, error: "Missing stripe-signature header" });
      }

      // ── Step 2: Require STRIPE_WEBHOOK_SECRET to be configured. No silent accept. ──
      if (!webhookSecret) {
        console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured — rejecting");
        return res.status(503).json({ verified: false, error: "Webhook secret not configured" });
      }

      // ── Step 3: Verify HMAC signature. Hard-fail on bad signature with 400. ──
      try {
        event = getStripe().webhooks.constructEvent(
          req.body,
          sig as string,
          webhookSecret
        );
      } catch (err: any) {
        console.error("[Stripe Webhook] Signature verification failed:", err.message);
        return res.status(400).json({ verified: false, error: "Signature verification failed" });
      }

      console.log(`[Stripe Webhook] Verified event: ${event.type} | ID: ${event.id}`);

      // ── Step 4: Log every verified event to stripe_events_log (idempotent) ──
      try {
        const dbLog = await getDb();
        if (dbLog) {
          await dbLog.execute(sql`
            INSERT INTO stripe_events_log (stripe_event_id, type, livemode, payload)
            VALUES (${event.id}, ${event.type}, ${event.livemode}, ${JSON.stringify(event.data.object)}::jsonb)
            ON CONFLICT (stripe_event_id) DO NOTHING
          `);
        }
      } catch (logErr) {
        console.warn("[Stripe Webhook] stripe_events_log insert failed:", String(logErr));
      }

      try {
        const db = await getDb();
        if (!db) {
          console.warn("[Stripe Webhook] Database not available");
          return res.json({ received: true });
        }

        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            // ─── Build 4 pack purchase path (new metadata schema) ───
            const b4UserId = session.metadata?.athlynx_user_id ? parseInt(session.metadata.athlynx_user_id) : null;
            if (b4UserId && session.metadata?.athlynx_kind === "pack") {
              const credits = parseInt(session.metadata.athlynx_pack_credits ?? "0");
              const bonus = parseInt(session.metadata.athlynx_pack_bonus ?? "0");
              const packKey = session.metadata.athlynx_pack_key ?? "unknown";
              const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : undefined;
              if (credits > 0) {
                await applyPackPurchase({
                  userId: b4UserId,
                  packKey,
                  credits,
                  bonusCredits: bonus,
                  stripePaymentIntentId: paymentIntentId,
                });
                console.log(`[Stripe Webhook] Build4 pack purchase: user=${b4UserId} pack=${packKey} credits=${credits}+${bonus}`);
              }
              // Persist stripe_customer_id if Stripe minted one.
              if (session.customer) {
                await db.update(users).set({ stripeCustomerId: session.customer as string }).where(eq(users.id, b4UserId)).catch(() => undefined);
              }
              // Fall through to legacy path is unnecessary; break.
              res.json({ received: true });
              return;
            }

            const userId = session.metadata?.user_id
              ? parseInt(session.metadata.user_id)
              : null;

            if (userId) {
              const creditsToAdd = session.metadata?.credits
                ? parseInt(session.metadata.credits)
                : 0;
              const packId = session.metadata?.pack_id ?? null;
              const stripeCustomerId = session.customer as string | null;

              // ── 1. Atomic credit add (no race condition) ──
              if (creditsToAdd > 0) {
                // Build 27 production safety: legacy checkout metadata path idempotency guard.
                // Stripe can retry the same checkout.session.completed event; never grant credits twice
                // for the same Checkout Session ID. The transaction plus DB-level unique indexes ensure
                // that concurrent duplicate deliveries roll back cleanly and return 200 to Stripe.
                let balanceAfter = creditsToAdd;
                try {
                  const duplicate = await db.transaction(async (tx: typeof db) => {
                    const [existingCreditTransaction] = await tx
                      .select({ id: creditTransactions.id })
                      .from(creditTransactions)
                      .where(eq(creditTransactions.stripeSessionId, session.id))
                      .limit(1);
                    const [existingPackagePurchase] = await tx
                      .select({ id: creditPackagePurchases.id })
                      .from(creditPackagePurchases)
                      .where(eq(creditPackagePurchases.stripeSessionId, session.id))
                      .limit(1);

                    if (existingCreditTransaction || existingPackagePurchase) {
                      return true;
                    }

                    const [currentUser] = await tx
                      .select({ credits: users.credits })
                      .from(users)
                      .where(eq(users.id, userId))
                      .limit(1);
                    balanceAfter = (currentUser?.credits ?? 0) + creditsToAdd;

                    await tx.update(users).set({
                      credits: sql`${users.credits} + ${creditsToAdd}`,
                      ...(stripeCustomerId ? { stripeCustomerId } : {}),
                    }).where(eq(users.id, userId));

                    if (packId) {
                      await tx.insert(creditPackagePurchases).values({
                        userId,
                        packId,
                        packName: session.metadata?.plan_name ?? packId,
                        credits: creditsToAdd,
                        amountCents: session.amount_total ?? 0,
                        stripeSessionId: session.id,
                        stripeCustomerId: stripeCustomerId ?? undefined,
                      });
                    }

                    await tx.insert(creditTransactions).values({
                      userId,
                      type: "purchase",
                      amount: creditsToAdd,
                      balanceAfter,
                      description: `Purchased ${creditsToAdd} credits`,
                      stripeSessionId: session.id,
                    });

                    return false;
                  });

                  if (duplicate) {
                    console.log(`[Stripe Webhook] [Idempotent Skip] Legacy credit session already processed: ${session.id}`);
                    break;
                  }
                } catch (err) {
                  if (isPgUniqueViolation(err)) {
                    console.log(`[Stripe Webhook] [Idempotent Skip] Unique constraint prevented duplicate legacy credit session: ${session.id}`);
                    break;
                  }
                  throw err;
                }

                console.log(`[Stripe Webhook] Added ${creditsToAdd} credits to user ${userId} (balance: ${balanceAfter})`);
              } else {
                // Subscription purchase — save customer ID, plan ID, and subscription ID
                const updateData: Record<string, unknown> = {};
                if (stripeCustomerId) updateData.stripeCustomerId = stripeCustomerId;
                if (session.metadata?.plan_id) updateData.stripePlanId = session.metadata.plan_id;
                // Also capture subscription ID from the session if available
                if (session.subscription) {
                  updateData.stripeSubscriptionId = session.subscription as string;
                }
                if (Object.keys(updateData).length > 0) {
                  await db.update(users).set(updateData).where(eq(users.id, userId));
                  console.log(`[Stripe Webhook] Subscription activated for user ${userId} — plan: ${session.metadata?.plan_id}, sub: ${session.subscription}`);
                }
              }
            }

            // Send payment confirmation email
            const customerEmail = session.customer_email ?? session.metadata?.customer_email;
            const customerName = session.metadata?.customer_name ?? "Athlete";
            const planName = session.metadata?.plan_name ?? "Pro Plan";
            const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
            if (customerEmail) {
              sendPaymentConfirmationEmail({
                to: customerEmail,
                name: customerName,
                plan: planName,
                amount: amountTotal,
                sessionId: session.id,
              }).catch((e: unknown) => console.warn("[Stripe Webhook] Payment email failed:", String(e)));
            }
            break;
          }

          case "customer.subscription.created":
          case "customer.subscription.updated": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            const planId = (subscription.metadata?.plan_id as string) ?? null;

            // Primary: find user by Stripe customer ID
            let subUserResult = await db
              .select({ id: users.id })
              .from(users)
              .where(eq(users.stripeCustomerId, customerId))
              .limit(1);

            // Fallback: find user by user_id in subscription metadata
            if (subUserResult.length === 0 && subscription.metadata?.user_id) {
              const metaUserId = parseInt(subscription.metadata.user_id);
              if (!isNaN(metaUserId)) {
                subUserResult = await db
                  .select({ id: users.id })
                  .from(users)
                  .where(eq(users.id, metaUserId))
                  .limit(1);
              }
            }

            if (subUserResult.length > 0) {
              await db
                .update(users)
                .set({
                  stripeCustomerId: customerId,
                  stripeSubscriptionId: subscription.id,
                  ...(planId ? { stripePlanId: planId } : {}),
                })
                .where(eq(users.id, subUserResult[0].id));
              console.log(`[Stripe Webhook] Subscription ${event.type} for user ${subUserResult[0].id} — sub: ${subscription.id}, plan: ${planId}`);
            }

            // ──────────────────────────────────────────────────────────
            // Build 4 — Tiered upsert into user_subscriptions + bonus.
            // Runs alongside the legacy users-table update above.
            // ──────────────────────────────────────────────────────────
            const athlynxUserId = subscription.metadata?.athlynx_user_id
              ? Number(subscription.metadata.athlynx_user_id)
              : null;
            const tierKey = (subscription.metadata?.athlynx_tier_key as string) ?? null;
            if (athlynxUserId && tierKey) {
              await db.execute(sql`
                INSERT INTO user_subscriptions (user_id, tier_key, stripe_customer_id, stripe_subscription_id, status,
                                                current_period_start, current_period_end)
                VALUES (${athlynxUserId}, ${tierKey}, ${customerId}, ${subscription.id}, ${subscription.status},
                        ${new Date(((subscription as any).current_period_start ?? 0) * 1000).toISOString()},
                        ${new Date(((subscription as any).current_period_end ?? 0) * 1000).toISOString()})
                ON CONFLICT (stripe_subscription_id) DO UPDATE SET
                  status = EXCLUDED.status,
                  current_period_start = EXCLUDED.current_period_start,
                  current_period_end = EXCLUDED.current_period_end,
                  updated_at = now()
              `);
              // First-cycle welcome bonus — only on initial creation, idempotent by sub id.
              if (event.type === "customer.subscription.created") {
                const tierRows: any = await db.execute(
                  sql`SELECT bonus_credits FROM plan_tiers WHERE key = ${tierKey} LIMIT 1`
                );
                const bonus = Number((tierRows.rows ?? tierRows ?? [])[0]?.bonus_credits ?? 0);
                if (bonus > 0) {
                  await applyBonusGrant({
                    userId: athlynxUserId,
                    tierKey,
                    bonusCredits: bonus,
                    stripeSubscriptionId: subscription.id,
                  });
                }
              }
            }
            break;
          }

          case "customer.subscription.deleted": {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;

            await db
              .update(users)
              .set({ stripeSubscriptionId: null, stripePlanId: null })
              .where(eq(users.stripeCustomerId, customerId));
            break;
          }

          // ────────────────────────────────────────────────────────────────
          // Build 4 — Tiered credit reconciliation
          // Maps Stripe events to the credit ledger via the credits service.
          // ────────────────────────────────────────────────────────────────

          case "invoice.payment_succeeded": {
            const inv = event.data.object as Stripe.Invoice;
            // events_log already written in Step 4 above (idempotent for every verified event)

            const subscriptionId = typeof (inv as any).subscription === "string"
              ? (inv as any).subscription
              : (inv as any).subscription?.id ?? null;
            if (!subscriptionId) {
              // One-off (pack) — handled by checkout.session.completed branch.
              break;
            }
            // Find tier and athlynx user from user_subscriptions.
            const subRows: any = await db.execute(sql`
              SELECT us.user_id, pt.key AS tier_key, pt.monthly_credits, pt.ai_credits_monthly
              FROM user_subscriptions us
              LEFT JOIN plan_tiers pt ON pt.key = us.tier_key
              WHERE us.stripe_subscription_id = ${subscriptionId}
              LIMIT 1
            `);
            const subRow = (subRows.rows ?? subRows ?? [])[0];
            if (!subRow) {
              console.warn(`[Stripe Webhook] invoice.payment_succeeded — no user_subscriptions row for ${subscriptionId}`);
              break;
            }
            const periodStart = new Date((((inv as any).period_start ?? Date.now() / 1000)) * 1000);
            await applyPlanGrant({
              userId: Number(subRow.user_id),
              tierKey: subRow.tier_key,
              monthlyCredits: Number(subRow.monthly_credits ?? 0),
              aiCreditsMonthly: Number(subRow.ai_credits_monthly ?? 0),
              stripeSubscriptionId: subscriptionId,
              stripeInvoiceId: inv.id,
              periodStart,
            });
            console.log(`[Stripe Webhook] Plan credits granted for user ${subRow.user_id} (${subRow.tier_key})`);
            break;
          }

          case "charge.refunded": {
            const charge = event.data.object as Stripe.Charge;
            const userId = Number(charge.metadata?.athlynx_user_id ?? 0);
            const refundedCredits = Number(charge.metadata?.athlynx_pack_credits ?? 0);
            if (userId && refundedCredits > 0) {
              await applyRefund({
                userId,
                amount: -refundedCredits, // refunds reduce the balance back
                reason: `stripe_refund:${charge.id}`,
                stripePaymentIntentId: typeof charge.payment_intent === "string" ? charge.payment_intent : undefined,
              });
            }
            break;
          }

          default:
            console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
        }
      } catch (err) {
        console.error("[Stripe Webhook] Handler error:", err);
      }

      res.json({ received: true });
  }

  // Register both paths — canonical new path first
  // GET guard: return 405 Method Not Allowed for both paths
  app.get("/api/webhooks/stripe", (_req, res) => res.status(405).json({ error: "Method Not Allowed", allowed: ["POST"] }));
  app.get("/api/stripe/webhook", (_req, res) => res.status(405).json({ error: "Method Not Allowed", allowed: ["POST"] }));
  app.post("/api/webhooks/stripe", rawParser, handleWebhook);
  app.post("/api/stripe/webhook", rawParser, handleWebhook);
}
