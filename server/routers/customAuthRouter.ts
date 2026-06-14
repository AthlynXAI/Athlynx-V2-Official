/**
 * AthlynX — Custom Auth Router
 * Auth0/Okta PKCE-only authentication. Single auth system.
 *
 * Procedures:
 *  - me               : return current session user (protected)
 *  - logout           : clear session cookie (protected)
 *  - syncUser         : verify Auth0 ID token → upsert user → set session cookie (public)
 *  - login            : email/password sign-in → set session cookie (public)
 *  - register         : email/password sign-up → set session cookie (public)
 *  - savePhone        : save phone number to current user (protected)
 *  - resetPassword    : reset password using email + verification code (public)
 */
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import { verifyToken } from "../_core/auth0Verifier";
import { sdk } from "../_core/sdk";
import { getDb, upsertUser, getUserByOpenId, logActivity } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const customAuthRouter = router({
  // ─── Get current session user ─────────────────────────────────────────────
  me: protectedProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),

  // ─── Logout ───────────────────────────────────────────────────────────────
  logout: protectedProcedure.mutation(async ({ ctx }) => {
    ctx.res.clearCookie(COOKIE_NAME, {
      ...getSessionCookieOptions(ctx.req),
      maxAge: -1,
    });
    return { success: true };
  }),

  // ─── Auth0 social login (Google, Apple, Facebook) ────────────────────────
  // Frontend: Auth0 PKCE redirect → handleRedirectResult() → idToken → call this → session cookie set
  syncUser: publicProcedure
    .input(
      z.object({
        idToken: z.string().min(1),
        name: z.string().optional().default(""),
        email: z.string().optional().default(""),
        picture: z.string().optional(),
        phone: z.string().optional(),
        attribution: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // 1. Verify the Auth0 ID token via JWKS
      const auth0Payload = await verifyToken(input.idToken);
      const uid = auth0Payload.uid;
      const openId = `auth0:${uid}`;

      // 2. Resolve display values — prefer token fields, fall back to input
      const name = auth0Payload.name || input.name || "Athlete";
      const email = auth0Payload.email || input.email || "";
      const loginMethod = auth0Payload.provider ?? "auth0";

      // 3. Check if user already exists
      let existing = await getUserByOpenId(openId);
      const isNewUser = !existing;

      // 4. Set 7-day free trial for new users
      const trialEndsAt = isNewUser ? (() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d;
      })() : undefined;

      // 5. Upsert user record
      await upsertUser({
        openId,
        name,
        email: email || undefined,
        loginMethod,
        lastSignedIn: new Date(),
        ...(input.phone ? { phone: input.phone } : {}),
        ...(trialEndsAt ? { trialEndsAt } : {}),
      });

      // 5. Create session JWT and set cookie
      const sessionToken = await sdk.createSessionToken(openId, {
        name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      // 6. Return the user record
      const user = await getUserByOpenId(openId);

      // Fetch Gravatar avatar for new social login users
      if (isNewUser && email) {
        try {
          const { getGravatarUrl } = await import("../services/gravatar");
          const gravatarUrl = await getGravatarUrl(email);
          if (gravatarUrl) {
            const db2 = await getDb();
            if (db2) await db2.update(users).set({ avatarUrl: gravatarUrl }).where(eq(users.openId, openId));
          }
        } catch (gravatarErr) {
          console.warn("[AUTH] Gravatar fetch failed:", gravatarErr);
        }
      }

      if (isNewUser && user) {
        const completedAt = new Date().toISOString();
        const baseSignupMetadata = {
          method: loginMethod,
          email,
          source: "auth0",
          ...(input.attribution || {}),
          completedAt,
        };
        try {
          await logActivity(user.id, "signup_completed", baseSignupMetadata);
          await logActivity(user.id, "profile_created", baseSignupMetadata);
          await logActivity(user.id, "profile_claim_completed", baseSignupMetadata);
        } catch (err) {
          // Activity logging must never block auth. Log and continue.
          console.error("[activity_log] non-fatal logging failure:", err);
        }
      }

      // Send welcome in-app notification to new user (no banners — messages only)
      if (isNewUser && user) {
        try {
          const { sendWelcomeNotification } = await import("../jobs/platformMessagesJob");
          await sendWelcomeNotification(user.id, name);
        } catch (welcomeNotifErr) {
          console.warn("[AUTH] Welcome notification failed:", welcomeNotifErr);
        }
      }

      // Send welcome email to the new user (social login)
      if (isNewUser && email) {
        try {
          const { sendWelcomeEmail } = await import("../services/aws-ses");
          await sendWelcomeEmail(email, name, user?.id ?? undefined);
          console.log("[AUTH] Welcome email sent to", email);
        } catch (welcomeEmailErr) {
          console.error("[AUTH] Welcome email failed:", welcomeEmailErr);
        }
      }

      // Notify Chad (all 5 emails) when a brand new user signs up via social login
      if (isNewUser) {
        try {
          const { sendOwnerNewUserAlert } = await import("../services/aws-ses");
          const signupTime = new Date().toLocaleString("en-US", {
            timeZone: "America/Chicago",
            dateStyle: "full",
            timeStyle: "short",
          });
          const trialDate = new Date();
          trialDate.setDate(trialDate.getDate() + 7);
          const trialStr = trialDate.toLocaleString("en-US", {
            timeZone: "America/Chicago",
            dateStyle: "full",
            timeStyle: "short",
          });
          await sendOwnerNewUserAlert({
            name,
            email,
            loginMethod,
            signedUpAt: signupTime,
            trialEndsAt: trialStr,
          });
        } catch (notifyErr) {
          console.error("[AUTH] Admin notification email failed:", notifyErr);
        }

        // Auto-enrich CRM with Gemini AI — runs in background, non-blocking
        if (isNewUser) {
          setImmediate(async () => {
            try {
              const OpenAI = (await import("openai")).default;
              const gemini = new OpenAI({
                apiKey: process.env.GEMINI_API_KEY || "",
                baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
              });
              const enrichPrompt = `New AthlynX user signed up: ${name} (${email}) via ${loginMethod}.
Generate a brief CRM profile: estimated sport/role, potential NIL value, and one personalized follow-up action.
Max 3 sentences. Be specific.`;
              const enrichResp = await gemini.chat.completions.create({
                model: "gemini-2.5-flash",
                messages: [{ role: "user", content: enrichPrompt }],
                max_tokens: 150,
              });
              const enrichNote = enrichResp.choices[0]?.message?.content ?? "";
              console.log(`[AUTH] Gemini CRM enrichment for ${email}: ${enrichNote.slice(0, 100)}`);
            } catch (enrichErr) {
              console.warn("[AUTH] Gemini CRM enrichment failed:", enrichErr);
            }
          });
        }
      }

      return { success: true, isNewUser, user };
    }),

  // ─── Email/password login ─────────────────────────────────────────────────
  login: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        password: z.string().min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      const user = rows[0];
      if (!user || !user.passwordHash) {
        throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(input.password, user.passwordHash);
      if (!valid) throw new TRPCError({ code: "UNAUTHORIZED", message: "Invalid email or password" });

      // Refresh lastSignedIn
      await upsertUser({ openId: user.openId!, lastSignedIn: new Date() });

      const sessionToken = await sdk.createSessionToken(user.openId!, {
        name: user.name ?? "Athlete",
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      return { success: true, user };
    }),

  // ─── Email/password registration ──────────────────────────────────────────
  register: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().min(1),
        password: z.string().min(1),
        phone: z.string().optional(),
        attribution: z.record(z.string(), z.unknown()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Check for existing account
      const existing = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (existing.length > 0) {
        throw new TRPCError({ code: "CONFLICT", message: "An account with this email already exists" });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const openId = `email:${Date.now()}:${Math.random().toString(36).slice(2)}`;

      // Set 7-day free trial for new users
      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 7);

      await upsertUser({
        openId,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        lastSignedIn: new Date(),
        trialEndsAt,
        ...(input.phone ? { phone: input.phone } : {}),
      });

      // Store the password hash
      await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.openId, openId));

      const sessionToken = await sdk.createSessionToken(openId, {
        name: input.name,
        expiresInMs: ONE_YEAR_MS,
      });
      const cookieOpts = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, {
        ...cookieOpts,
        maxAge: ONE_YEAR_MS,
      });

      // Fetch Gravatar avatar and save it to the user record
      try {
        const { getGravatarUrl } = await import("../services/gravatar");
        const gravatarUrl = await getGravatarUrl(input.email);
        if (gravatarUrl) {
          await db.update(users).set({ avatarUrl: gravatarUrl }).where(eq(users.openId, openId));
        }
      } catch (gravatarErr) {
        console.warn("[AUTH] Gravatar fetch failed:", gravatarErr);
      }

      const user = await getUserByOpenId(openId);

      if (user) {
        const completedAt = new Date().toISOString();
        const baseSignupMetadata = {
          method: "email/password",
          email: input.email,
          source: "email",
          ...(input.attribution || {}),
          completedAt,
        };
        try {
          await logActivity(user.id, "signup_completed", baseSignupMetadata);
          await logActivity(user.id, "profile_created", baseSignupMetadata);
          await logActivity(user.id, "profile_claim_completed", baseSignupMetadata);
        } catch (err) {
          // Activity logging must never block auth. Log and continue.
          console.error("[activity_log] non-fatal logging failure:", err);
        }
      }

      // Notify Chad (all 5 emails) every time a new user registers
      try {
        const { sendOwnerNewUserAlert } = await import("../services/aws-ses");
        const signupTime = new Date().toLocaleString("en-US", {
          timeZone: "America/Chicago",
          dateStyle: "full",
          timeStyle: "short",
        });
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);
        const trialStr = trialEndDate.toLocaleString("en-US", {
          timeZone: "America/Chicago",
          dateStyle: "full",
          timeStyle: "short",
        });
        await sendOwnerNewUserAlert({
          name: input.name,
          email: input.email,
          loginMethod: "email/password",
          signedUpAt: signupTime,
          trialEndsAt: trialStr,
        });
      } catch (notifyErr) {
        console.error("[AUTH] Admin notification email failed:", notifyErr);
      }

      // Send Welcome Email to the new user
      try {
        const { sendEmail } = await import("../services/email");
        await sendEmail(
          input.email,
          "welcome",
          { name: input.name, email: input.email }
        );
        console.log("[AUTH] Welcome email sent to", input.email);
      } catch (welcomeEmailErr) {
        console.error("[AUTH] Welcome email failed:", welcomeEmailErr);
      }

      // Send welcome in-app notification to new email/password user
      if (user) {
        try {
          const { sendWelcomeNotification } = await import("../jobs/platformMessagesJob");
          await sendWelcomeNotification(user.id, input.name);
        } catch (welcomeNotifErr) {
          console.warn("[AUTH] Welcome notification failed:", welcomeNotifErr);
        }
      }

      // Send Welcome SMS if phone number was provided at registration
      const phoneToSMS = input.phone || user?.phone;
      if (phoneToSMS) {
        try {
          const { sendWelcomeSMS, sendOwnerSignupSMSAlert } = await import("../services/aws-sns");
          await sendWelcomeSMS(phoneToSMS, input.name);
          await sendOwnerSignupSMSAlert({ name: input.name, email: input.email });
          console.log("[AUTH] Welcome SMS sent to", phoneToSMS);
        } catch (smsErr) {
          console.error("[AUTH] Welcome SMS failed:", smsErr);
        }
      }
      // Send push notification to admin devices
      try {
        const { sendPushToAdmins } = await import("../services/push-notifications");
        await sendPushToAdmins({
          title: "🆕 New AthlynX User!",
          body: `${input.name} (${input.email}) just signed up`,
          url: "/admin",
          tag: "new-user",
        });
      } catch (pushErr) {
        console.warn("[AUTH] Push notification failed:", pushErr);
      }
      return { success: true, user };
    }),

  // ─── Save phone number ────────────────────────────────────────────────────
  savePhone: protectedProcedure
    .input(z.object({ phone: z.string().min(7) }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });
      await db
        .update(users)
        .set({ phone: input.phone })
        .where(eq(users.id, ctx.user.id));
      // Always send Welcome SMS when phone is saved (fires on first save after registration)
      try {
        const { sendWelcomeSMS, sendOwnerSignupSMSAlert } = await import("../services/aws-sns");
        await sendWelcomeSMS(input.phone, ctx.user.name ?? "Athlete");
        await sendOwnerSignupSMSAlert({ name: ctx.user.name ?? "Athlete", email: ctx.user.email ?? "" });
        console.log("[AUTH] Welcome SMS sent to", input.phone);
      } catch (smsErr) {
        console.error("[AUTH] Welcome SMS failed:", smsErr);
      }
      return { success: true };
    }),

  // ─── Reset password (email + verification code flow) ─────────────────────
  resetPassword: publicProcedure
    .input(
      z.object({
        email: z.string().min(1),
        code: z.string().min(4),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database temporarily unavailable. Please try again." });

      // Verify the code via the verification service
      const { verifyCode } = await import("../services/verification");
      const result = await verifyCode(input.email, input.code);
      if (!result.valid) {
        throw new TRPCError({ code: "BAD_REQUEST", message: result.error ?? "Invalid or expired verification code" });
      }

      const rows = await db
        .select()
        .from(users)
        .where(eq(users.email, input.email))
        .limit(1);

      if (!rows[0]) throw new TRPCError({ code: "NOT_FOUND", message: "No account found for this email" });

      const passwordHash = await bcrypt.hash(input.newPassword, 12);
      await db
        .update(users)
        .set({ passwordHash })
        .where(eq(users.email, input.email));

      return { success: true };
    }),
});
