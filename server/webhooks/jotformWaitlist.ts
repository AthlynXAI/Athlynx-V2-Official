/**
 * JotForm Waitlist Webhook Handler
 *
 * Endpoint: POST /api/webhooks/jotform-waitlist
 *
 * JotForm sends form submissions as application/x-www-form-urlencoded.
 * The field names below match the JotForm "unique name" for each question.
 * Map your JotForm field names to these keys in the JotForm form builder
 * under Settings → Integrations → Webhooks.
 *
 * Expected JotForm field unique names (configure in JotForm):
 *   q1_fullName   → Full Name
 *   q2_email      → Email Address
 *   q3_phone      → Phone Number (optional)
 *   q4_sport      → Sport (optional)
 *   q5_school     → School / University (optional)
 *   q6_role       → Role (athlete | coach | agent | brand | other) — defaults to "athlete"
 *
 * JotForm also sends a rawRequest field with all data as JSON — we parse
 * that as a fallback so the handler works regardless of field naming.
 */

import { type Express, type Request, type Response } from "express";
import { getDb } from "../db";
import { waitlist } from "../../drizzle/schema";

// ─── Field name normalizer ─────────────────────────────────────────────────
// JotForm sends fields as q<n>_<name> OR as pretty names depending on
// the webhook format selected. We try both.
function extractField(body: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const val = body[key];
    if (typeof val === "string" && val.trim()) return val.trim();
  }
  // Try rawRequest JSON fallback
  if (typeof body.rawRequest === "string") {
    try {
      const raw = JSON.parse(body.rawRequest) as Record<string, unknown>;
      for (const key of keys) {
        const val = raw[key];
        if (typeof val === "string" && val.trim()) return val.trim();
      }
    } catch {
      // ignore parse errors
    }
  }
  return "";
}

// ─── Route registration ────────────────────────────────────────────────────
export function registerJotformWaitlistWebhook(app: Express): void {
  // JotForm sends application/x-www-form-urlencoded — express.urlencoded must
  // already be registered before this handler is called (it is in entry.ts).
  app.post("/api/webhooks/jotform-waitlist", async (req: Request, res: Response) => {
    try {
      const body = req.body as Record<string, unknown>;

      // ── Extract fields ──────────────────────────────────────────────────
      const email = extractField(body,
        "q2_email", "email", "Email", "q1_email", "submitterEmail"
      );
      const name = extractField(body,
        "q1_fullName", "q1_name", "fullName", "name", "Name", "q3_name"
      );
      const phone = extractField(body,
        "q3_phone", "phone", "Phone", "q4_phone", "phoneNumber"
      );
      const sport = extractField(body,
        "q4_sport", "sport", "Sport", "q5_sport"
      );
      const school = extractField(body,
        "q5_school", "school", "School", "q6_school", "university"
      );
      const roleRaw = extractField(body,
        "q6_role", "role", "Role", "q7_role", "userType"
      ).toLowerCase();

      // ── Validate required fields ────────────────────────────────────────
      if (!email || !email.includes("@")) {
        console.warn("[JotForm Waitlist] Missing or invalid email — skipping insert", { body });
        // Return 200 so JotForm doesn't retry endlessly
        res.status(200).json({ ok: false, reason: "invalid_email" });
        return;
      }

      // ── Normalise role ──────────────────────────────────────────────────
      const validRoles = ["athlete", "coach", "agent", "brand", "other"] as const;
      type Role = (typeof validRoles)[number];
      const role: Role = (validRoles as readonly string[]).includes(roleRaw)
        ? (roleRaw as Role)
        : "athlete";

      // ── Insert into PlanetScale ─────────────────────────────────────────
      const db = await getDb();
      if (!db) {
        console.error("[JotForm Waitlist] DB unavailable — could not insert signup", { email });
        res.status(200).json({ ok: false, reason: "db_unavailable" });
        return;
      }

      await db.insert(waitlist).values({
        email,
        name:   name   || null,
        phone:  phone  || null,
        sport:  sport  || null,
        school: school || null,
        role,
      }).onConflictDoUpdate({ target: waitlist.email,
        // If the same email submits twice, update their info rather than error
        set: {
          name:   name   || null,
          phone:  phone  || null,
          sport:  sport  || null,
          school: school || null,
          role,
        },
      });

      console.log(`[JotForm Waitlist] ✅ Inserted/updated signup: ${email} (${role})`);
      res.status(200).json({ ok: true, email });
    } catch (err) {
      console.error("[JotForm Waitlist] Unhandled error:", err);
      // Still return 200 — JotForm retries on non-200 and we don't want
      // duplicate inserts if the error was a transient DB blip.
      res.status(200).json({ ok: false, reason: "internal_error" });
    }
  });
}
