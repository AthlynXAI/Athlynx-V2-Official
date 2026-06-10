import { systemRouter } from "./_core/systemRouter";
import { router } from "./_core/trpc";
import { stripeRouter } from "./stripe/stripeRouter";
import { feedRouter } from "./routers/feedRouter";
import { profileRouter } from "./routers/profileRouter";
import { messengerRouter } from "./routers/messengerRouter";
import { nilRouter } from "./routers/nilRouter";
import { trainingRouter } from "./routers/trainingRouter";
import { aiRouter } from "./routers/aiRouter";
import { notificationsRouter } from "./routers/notificationsRouter";
import { messagingRouter } from "./routers/messagingRouter";
import { crmRouter } from "./routers/crmRouter";
import { waitlistRouter } from "./routers/waitlistRouter";
import { verificationRouter } from "./routers/verificationRouter";
import { customAuthRouter } from "./routers/customAuthRouter";
import { adminRouter } from "./routers/adminRouter";
import { feedbackRouter } from "./routers/feedbackRouter";
import { dataRouter } from "./routers/dataRouter";
import { investorRouter } from "./routers/investorRouter";
import { pushRouter } from "./routers/pushRouter";
import { expirationRouter } from "./routers/expirationRouter";
import { socialRouter } from "./routers/socialRouter";
import { concreatorRouter } from "./routers/concreatorRouter";
import { aiCommandRouter } from "./routers/aiCommandRouter";
import { calendarRouter } from "./routers/calendarRouter";
import { storiesRouter } from "./routers/storiesRouter";
import { mediaRouter } from "./routers/mediaRouter";
import { connectionsRouter } from "./routers/connectionsRouter";
import { autoPostRouter } from "./routers/autoPostRouter";
import { licensingRouter } from "./routers/licensingRouter";
import { buildMonitorRouter } from "./routers/buildMonitorRouter";
import { trainerRouter } from "./routers/trainerRouter";
import { recruitingRouter } from "./routers/recruitingRouter";
import { podcastRouter } from "./routers/podcastRouter";
import { streamRouter } from "./routers/streamRouter";
import { founderRouter } from "./routers/founderRouter";
import { brandWallRouter } from "./routers/brandWallRouter";

// Build 4 — Layer Cake, Realty, CRM Hub, Billing (tiered plans + credits)
import { layerCakeRouter } from "./routers/layerCakeRouter";
import { realtyRouter } from "./routers/realtyRouter";
import { crmHubRouter } from "./routers/crmHubRouter";
import { billingRouter } from "./routers/billingRouter";

// Build 5 — Fort Knox: live Rule Book + Q&A listening post
import { rulesRouter } from "./routers/rulesRouter";
import { qaRouter } from "./routers/qaRouter";
import { socialOsRouter } from "./routers/socialOsRouter";

// Build 27.1 — Studio Suite (Lineup, Match Day, Final Score, Caption Engine, One-Tap Publish)
import { studioRouter } from "./routers/studioRouter";

// Build 29 — Unified Communications OS (CRM + Layer Cake command layer)
import { communicationsOsRouter } from "./routers/communicationsOsRouter";

export const appRouter = router({
  system: systemRouter,
  stripe: stripeRouter,
  feed: feedRouter,
  profile: profileRouter,
  messenger: messengerRouter,
  nil: nilRouter,
  training: trainingRouter,
  ai: aiRouter,
  notifications: notificationsRouter,
  messaging: messagingRouter,
  crm: crmRouter,
  waitlist: waitlistRouter,
  verification: verificationRouter,
  auth: customAuthRouter,
  admin: adminRouter,
  feedback: feedbackRouter,
  data: dataRouter,
  investor: investorRouter,
  push: pushRouter,
  expiration: expirationRouter,
  social: socialRouter,
  concreator: concreatorRouter,
  aiCommand: aiCommandRouter,
  calendar: calendarRouter,
  stories: storiesRouter,
  media: mediaRouter,
  connections: connectionsRouter,
  autoPost: autoPostRouter,
  licensing: licensingRouter,
  buildMonitor: buildMonitorRouter,
  trainer: trainerRouter,
  recruiting: recruitingRouter,
  podcast: podcastRouter,
  stream: streamRouter,
  founder: founderRouter,
  brandWall: brandWallRouter,

  // Build 4 — the marketing machine + housing + tiered billing
  layerCake: layerCakeRouter,
  realty: realtyRouter,
  crmHub: crmHubRouter,
  billing: billingRouter,

  // Build 5 — Fort Knox: live Rule Book + Q&A
  rules: rulesRouter,
  qa: qaRouter,
  socialOs: socialOsRouter,

  // Build 27.1 — Studio Suite
  studio: studioRouter,

  // Build 29 — Unified Communications OS
  communicationsOs: communicationsOsRouter,
});

export type AppRouter = typeof appRouter;
