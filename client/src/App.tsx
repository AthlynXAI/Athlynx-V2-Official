import { Toaster } from "@/components/ui/sonner";
import AIWizard from "@/components/AIWizard";
import BetaBanner from "@/components/BetaBanner";
import { TooltipProvider } from "@/components/ui/tooltip";
import SEOManager from "@/components/SEOManager";
import ScrollToTop from "@/components/ScrollToTop";
import CookieConsent from "@/components/CookieConsent";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import AthletePageBackground from "./components/AthletePageBackground";
import { ThemeProvider } from "./contexts/ThemeContext";

// ── Core ──
import Home from "./pages/Home";
import Welcome from "./pages/Welcome";
import Sports from "./pages/Sports";
import AllSportsHub from "./pages/AllSportsHub";
import BrandedProfileBuilder from "./pages/BrandedProfileBuilder";
import AITrainerBuild from "./pages/AITrainerBuild";
import DozierLegacy from "./pages/DozierLegacy";
import CommunitySoon from "./pages/CommunitySoon";
import Demo from "./pages/Demo";
import Platform from "./pages/Platform";
import AthlynXAITrustSearchBlueprint from "./pages/AthlynXAITrustSearchBlueprint";
import Feed from "./pages/Feed";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import Reels from "./pages/Reels";
import AuthCallback from "./pages/AuthCallback";
import Onboarding from "./pages/Onboarding";
import OnboardingWelcome from "./pages/onboarding/Welcome";
import OnboardingSport from "./pages/onboarding/Sport";
import OnboardingPositionClass from "./pages/onboarding/PositionClass";
import OnboardingSchool from "./pages/onboarding/School";
import OnboardingMeasurements from "./pages/onboarding/Measurements";
import OnboardingHeadshot from "./pages/onboarding/Headshot";
import OnboardingHighlight from "./pages/onboarding/Highlight";
import OnboardingStats from "./pages/onboarding/Stats";
import OnboardingSocials from "./pages/onboarding/Socials";
import OnboardingPreview from "./pages/onboarding/Preview";
import OnboardingSigningDay from "./pages/onboarding/SigningDay";
import ForgotPassword from "./pages/ForgotPassword";
import EarlyAccess from "./pages/EarlyAccess";
import SignUp from "./pages/SignUp";
import EarlyAccessUpdated from "./pages/EarlyAccessUpdated";
import Success from "./pages/Success";
import ComingSoon from "./pages/ComingSoon";

// ── Platform Apps ──
import MessengerApp from "./pages/MessengerApp";
import Messages from "./pages/Messages";
import NILPortal from "./pages/NILPortal";
import NILVault from "./pages/NILVault";
import NILMarketplace from "./pages/NILMarketplace";
import NILJobs from "./pages/NILJobs";
import AthleteCalendar from "./pages/AthleteCalendar";
import AthleteDataDashboard from "./pages/AthleteDataDashboard";
import EliteEvents from "./pages/EliteEvents";
import XFactor from "./pages/XFactor";
import NILCalculator from "./pages/NILCalculator";
import TransferPortal from "./pages/TransferPortal";
import TransferPortalFOS from "./pages/TransferPortalFOS";
import TransferPortalIntelligence from "./pages/TransferPortalIntelligence";
import DiamondGrind from "./pages/DiamondGrind";
import DiamondGrindPublic from "./pages/DiamondGrindPublic";
import WarriorsPlaybook from "./pages/WarriorsPlaybook";
import AISales from "./pages/AISales";
import AIRecruiter from "./pages/AIRecruiter";
import AIContent from "./pages/AIContent";
import AITrainingBot from "./pages/AITrainingBot";
import Faith from "./pages/Faith";
import AthleteDashboard from "./pages/AthleteDashboard";
import AthleteNILIntake from "./pages/AthleteNILIntake";
import AthletePlaybook from "./pages/AthletePlaybook";
import BaseballRecruitingPlaybook from "./pages/BaseballRecruitingPlaybook";
import CollegeWorldSeries2026 from "./pages/CollegeWorldSeries2026";
import Brackets from "./pages/Brackets";
import DiamondGrindIQ from "./pages/DiamondGrindIQ";
import AthleteWebsiteBuilder from "./pages/AthleteWebsiteBuilder";
import AthlynXBrowser from "./pages/AthlynXBrowser";
import SocialHub from "./pages/SocialHub";
import StudioSuite from "./pages/StudioSuite";
import SocialCommandCenter from "./pages/SocialCommandCenter";
import MediaOS from "./pages/MediaOS";
import PrivateMediaVaultRules from "./pages/PrivateMediaVaultRules";
import RealAthleteProfileFlow from "./pages/RealAthleteProfileFlow";
import CoachAthleteOnboarding from "./pages/CoachAthleteOnboarding";
import AthlynXAIAppsEcosystem from "./pages/AthlynXAIAppsEcosystem";
import CommsHub from "./pages/CommsHub";
import CommunicationsOS from "./pages/CommunicationsOS";
import LegalHub from "./pages/LegalHub";
import HIPAACompliance from "./pages/HIPAACompliance";
import CompetitionReadiness from "./pages/CompetitionReadiness";
import WizardHub from "./pages/WizardHub";
import CRMDashboard from "./pages/CRMDashboard";
import CRMCommandCenter from "./pages/CRMCommandCenter";
import Contracts from "./pages/Contracts";
import CorporateDocuments from "./pages/CorporateDocuments";
import TeamBots from "./pages/TeamBots";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCRM from "./pages/AdminCRM";
import AdminUsers from "./pages/AdminUsers";
import AdminBroadcast from "./pages/AdminBroadcast";

// ── Sport Platforms ──
import GridironNexus from "./pages/GridironNexus";
import PitchPulse from "./pages/PitchPulse";
import CourtKings from "./pages/CourtKings";
import ReelMasters from "./pages/ReelMasters";
import HuntPro from "./pages/HuntPro";
import FairwayElite from "./pages/FairwayElite";
import IceBreakers from "./pages/IceBreakers";
import NetSetters from "./pages/NetSetters";
import TrackElite from "./pages/TrackElite";
import SwimSurge from "./pages/SwimSurge";
import MatWarriors from "./pages/MatWarriors";
import RacketKings from "./pages/RacketKings";
import LacrosseElite from "./pages/LacrosseElite";
import SoftballNation from "./pages/SoftballNation";
import GymnasticsVault from "./pages/GymnasticsVault";
import RugbyElite from "./pages/RugbyElite";
import CricketElite from "./pages/CricketElite";
import CrossCountryElite from "./pages/CrossCountryElite";
import RowingElite from "./pages/RowingElite";
import WaterPoloElite from "./pages/WaterPoloElite";
import FieldHockeyElite from "./pages/FieldHockeyElite";
import CheerElite from "./pages/CheerElite";
import SigningDay from "./pages/SigningDay";
import Training from "./pages/Training";

// ── Commerce & Infrastructure ──
import Marketplace from "./pages/Marketplace";
import Store from "./pages/Store";
import AthleteStore from "./pages/AthleteStore";
import AdminExpiry from "./pages/AdminExpiry";
import LayerCake from "./pages/LayerCake";
import InnovationsPage from "./pages/Innovations";
import RecruitingHub from "./pages/RecruitingHub";
import AgentOwnership from "./pages/AgentOwnership";
import Pricing from "./pages/Pricing";
import PricingTiers from "./pages/PricingTiers";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import PaymentSuccess from "./pages/PaymentSuccess";
import Infrastructure from "./pages/Infrastructure";
import InfrastructureManager from "./pages/InfrastructureManager";
import BitcoinMining from "./pages/BitcoinMining";
import Robotics from "./pages/Robotics";
import TrainerBot from "./pages/TrainerBot";
import AthleteJourney from "./pages/AthleteJourney";
import About from "./pages/About";
import AthleteLeagalHub from "./pages/AthleteLeagalHub";
import AthleteLifeHub from "./pages/AthleteLifeHub";
import AgentFinder from "./pages/AgentFinder";
import AthleteFinancial from "./pages/AthleteFinancial";
import AthleteLegal from "./pages/AthleteLegal";
import AthleteHealth from "./pages/AthleteHealth";
import AthleteCareer from "./pages/AthleteCareer";
import MasterAdmin from "./pages/MasterAdmin";
import EmployeePortal from "./pages/EmployeePortal";
import RobotCompanions from "./pages/RobotCompanions";
import AppStoreSubmission from "./pages/AppStoreSubmission";
import Apps from "./pages/Apps";
import BookingHub from "./pages/BookingHub";
import MobileApp from "./pages/MobileApp";

// ── DHG Corporate ──
import DHG from "./pages/DHG";
import DHGHome from "./pages/DHGHome";
import DHGCorporate from "./pages/DHGCorporate";
import DHGEmpire from "./pages/DHGEmpire";
import EmpireVision from "./pages/EmpireVision";
import Softmor from "./pages/Softmor";
import VCTech from "./pages/VCTech";
import DataCenters from "./pages/DataCenters";
import TheVirt from "./pages/TheVirt";
import Podcast from "./pages/Podcast";
import InvestorDeck from "./pages/InvestorDeck";
import InvestorHub from "./pages/InvestorHub";
import ProTeams from "./pages/ProTeams";
import AthletePublicProfile from "./pages/AthletePublicProfile";
import BrowseAthletes from "./pages/BrowseAthletes";


import Partners from "./pages/Partners";
import PartnerPortal from "./pages/PartnerPortal";
import WhiteLabel from "./pages/WhiteLabel";
import Implementation from "./pages/Implementation";
import Capabilities from "./pages/Capabilities";
import CommunityFeedback from "./pages/CommunityFeedback";

// ── People & Culture ──
import Founders from "./pages/Founders";
import TeamProfilePage from "./pages/TeamProfilePage";
import FounderStory from "./pages/FounderStory";
import FounderDedication from "./pages/FounderDedication";
import FounderProfile from "./pages/FounderProfile";
import Team from "./pages/Team";
import LeadershipPrinciples from "./pages/LeadershipPrinciples";
import Journey from "./pages/Journey";
import Careers from "./pages/Careers";
import BlueCollar from "./pages/BlueCollar";
import Veterans from "./pages/Veterans";
import MilitaryDivision from "./pages/MilitaryDivision";
import DigitalHealth from "./pages/DigitalHealth";
import { AITrainerGate, FuelBotsGate, MedicalGate, MentalHealthGate, MindsetGate, TrainerGate, WellnessGate } from "./pages/HealthFeatureGate";
import SerenityMemorial from "./pages/SerenityMemorial";
import SchoolPage from "./pages/SchoolPage";

// ── Media & Content ──
import Music from "./pages/Music";
import Studio from "./pages/Studio";
import MediaShowcase from "./pages/MediaShowcase";
import Portal from "./pages/Portal";

// ── Legal & Compliance ──
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Rules from "./pages/Rules";
import QA from "./pages/QA";
import SocialOS from "./pages/SocialOS";
import LegalCompliance from "./pages/LegalCompliance";
import SchoolBranding from "./pages/SchoolBranding";

// ── PWA ──
import PWAInstallBanner from "./components/PWAInstallBanner";
import TrialExpired from "./pages/TrialExpired";

// ── Utility ──
import Notifications from "./pages/Notifications";
import Contact from "./pages/Contact";
import ChadCard from "./pages/ChadCard";
import QuickLinksHub from "./pages/QuickLinksHub";
import ProjectManagement from "./pages/ProjectManagement";
import ProjectChecklist from "./pages/ProjectChecklist";
import ProjectPlaybook from "./pages/ProjectPlaybook";

// ── Partners ──
import ICCUSAPartner from "./pages/ICCUSAPartner";
import LandingPage from "./pages/LandingPage";
import ComponentShowcase from "./pages/ComponentShowcase";

// ── Session 38 New Pages ──
import TokenFactory from "./pages/TokenFactory";
import AuthStrategy from "./pages/AuthStrategy";

// ── Session 32 New Pages ──
import CFactorHub from "./pages/CFactorHub";
import RankingsHub from "./pages/RankingsHub";
import AthleteCard from "./pages/AthleteCard";

// ── Wizards ──
import AgentWizard from "./pages/wizards/AgentWizard";
import CareerWizard from "./pages/wizards/CareerWizard";
import FinancialWizard from "./pages/wizards/FinancialWizard";
import LawyerWizard from "./pages/wizards/LawyerWizard";
import LifeWizard from "./pages/wizards/LifeWizard";
import ScholarshipWizard from "./pages/wizards/ScholarshipWizard";
import ScoutWizard from "./pages/wizards/ScoutWizard";
import TransferWizard from "./pages/wizards/TransferWizard";
import Founder from "./pages/Founder";
import TheFirst from "./pages/TheFirst";
import BuildDecisions from "./pages/BuildDecisions";
import WhatWeStandFor from "./pages/WhatWeStandFor";
import TheCompanyManifesto from "./pages/TheCompanyManifesto";
import MindMap from "./pages/MindMap";
import Quantum from "./pages/Quantum";
import TiersBilling from "./pages/TiersBilling";
import CRMHub from "./pages/CRMHub";
import RealtyBrowse from "./pages/RealtyBrowse";
import RealtyList from "./pages/RealtyList";
import FounderPodcast from "./pages/FounderPodcast";
import AthlynXNetwork from "./pages/AthlynXNetwork";
import BrandWall from "./pages/BrandWall";
import AIScoutingReport from "./pages/AIScoutingReport";
import NotificationCenter from "./pages/NotificationCenter";
import HighlightReelStudio from "./pages/HighlightReelStudio";
import BuildMonitor from "./pages/BuildMonitor";
import ConnectorHealthOS from "./pages/ConnectorHealthOS";
import AthlynXAIOperatingLayer from "./pages/AthlynXAIOperatingLayer";
import SkillAthlynXProductionOS from "./pages/SkillAthlynXProductionOS";
import AthlynXAISeasonEngine from "./pages/AthlynXAISeasonEngine";
// Build 11: Connector OS + Doctrine pages
import ConnectorOSLanding from "./pages/ConnectorOSLanding";
import ConnectorOSThesis from "./pages/ConnectorOSThesis";
import ConnectorOSPricing from "./pages/ConnectorOSPricing";
import ConnectorOSLayerCake from "./pages/ConnectorOSLayerCake";
import DoctrineManifesto from "./pages/DoctrineManifesto";
import DoctrineBrand from "./pages/DoctrineBrand";
import DoctrineSmallCircle from "./pages/DoctrineSmallCircle";
// Build 12: Route audit
import RouteAudit from "./pages/RouteAudit";
// Build 13: Traffic ledger admin view
import OSLedger from "./pages/OSLedger";
import CoachLynx from "./components/CoachLynx";
import AthletePlaybookEpisode1 from "./pages/AthletePlaybookEpisode1";
import GlucoAthleteOS from "./pages/GlucoAthleteOS";
import AthlynxEngine from "./pages/AthlynxEngine";
import GoogleWorkspaceOS from "./pages/GoogleWorkspaceOS";
import WellnessPortal from "./pages/WellnessPortal";
import SEODashboard from "./pages/SEODashboard";
import VendorMarketplace from "./pages/VendorMarketplace";
import BetaSignup from "./pages/BetaSignup";

function Router() {
  return (
    <Switch>
      {/* ── Core ── */}
      <Route path="/" component={Home} />
      <Route path="/sports" component={Sports} />
      <Route path="/all-sports-hub" component={AllSportsHub} />
      <Route path="/sports/:slug" component={AllSportsHub} />
      <Route path="/branded-profile" component={BrandedProfileBuilder} />
      <Route path="/branded-profile-builder" component={BrandedProfileBuilder} />
      <Route path="/top-5-schools" component={BrandedProfileBuilder} />
      <Route path="/ai-trainer/build" component={AITrainerBuild} />
      <Route path="/ai-trainer-build" component={AITrainerBuild} />
      <Route path="/build-my-brand" component={AITrainerBuild} />
      <Route path="/demo" component={Demo} />
      <Route path="/how-it-works" component={Demo} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/trial-expired" component={TrialExpired} />
      <Route path="/signup" component={SignUp} />
      <Route path="/early-access" component={EarlyAccess} />
      <Route path="/early-access-v2" component={EarlyAccessUpdated} />
      <Route path="/signin" component={SignIn} />
      <Route path="/sign-in" component={SignIn} />
      <Route path="/login" component={SignIn} />
      <Route path="/auth/login" component={SignIn} />
      <Route path="/auth/signin" component={SignIn} />
      <Route path="/callback" component={AuthCallback} />
      <Route path="/auth/callback" component={AuthCallback} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/onboarding/welcome" component={OnboardingWelcome} />
      <Route path="/onboarding/sport" component={OnboardingSport} />
      <Route path="/onboarding/position-class" component={OnboardingPositionClass} />
      <Route path="/onboarding/school" component={OnboardingSchool} />
      <Route path="/onboarding/measurements" component={OnboardingMeasurements} />
      <Route path="/onboarding/headshot" component={OnboardingHeadshot} />
      <Route path="/onboarding/highlight" component={OnboardingHighlight} />
      <Route path="/onboarding/stats" component={OnboardingStats} />
      <Route path="/onboarding/socials" component={OnboardingSocials} />
      <Route path="/onboarding/preview" component={OnboardingPreview} />
      <Route path="/onboarding/signing-day" component={OnboardingSigningDay} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/success" component={Success} />
      <Route path="/feed" component={Feed} />
      <Route path="/trust-search-blueprint" component={AthlynXAITrustSearchBlueprint} />
      <Route path="/the-company" component={TheCompanyManifesto} />
      <Route path="/different-by-design" component={TheCompanyManifesto} />
      <Route path="/athlynxai-intelligence" component={AthlynXAITrustSearchBlueprint} />
      <Route path="/reels" component={Reels} />
      <Route path="/highlights" component={Reels} />
      <Route path="/profile/:id?" component={Profile} />

      {/* ── Platform Apps ── */}
      <Route path="/messenger" component={MessengerApp} />
      <Route path="/nil-messenger" component={MessengerApp} />
      <Route path="/messages" component={Messages} />
      <Route path="/nil-portal" component={NILPortal} />
      <Route path="/nil-vault" component={NILVault} />
      <Route path="/nil-marketplace" component={NILMarketplace} />
      <Route path="/nil-jobs" component={NILJobs} />
      <Route path="/athlete-calendar" component={AthleteCalendar} />
      <Route path="/calendar" component={AthleteCalendar} />
      <Route path="/elite-events" component={EliteEvents} />
      <Route path="/events" component={EliteEvents} />
      <Route path="/x-factor" component={XFactor} />
      <Route path="/xfactor" component={XFactor} />
      <Route path="/nil-calculator" component={NILCalculator} />
      <Route path="/transfer-portal" component={TransferPortalFOS} />
      <Route path="/transfer-portal-fos" component={TransferPortalFOS} />
      <Route path="/transfer-portal-v2" component={TransferPortal} />
      <Route path="/transfer-intelligence" component={TransferPortalIntelligence} />
      <Route path="/diamond-grind" component={DiamondGrind} />
      <Route path="/baseball" component={DiamondGrindPublic} />
      <Route path="/warriors-playbook" component={WarriorsPlaybook} />
      <Route path="/playbook" component={WarriorsPlaybook} />
      <Route path="/ai-sales" component={AISales} />
      <Route path="/ai-recruiter" component={AIRecruiter} />
      <Route path="/ai-content" component={AIContent} />
      <Route path="/ai-training-bot" component={AITrainingBot} />
      <Route path="/faith" component={Faith} />
      <Route path="/athlete-dashboard" component={AthleteDashboard} />
      <Route path="/athlete-nil-intake" component={AthleteNILIntake} />
      <Route path="/nil-intake" component={AthleteNILIntake} />
      <Route path="/profile-intake" component={AthleteNILIntake} />
      <Route path="/start-profile" component={AthleteNILIntake} />
      <Route path="/data-dashboard" component={AthleteDataDashboard} />
      <Route path="/athlete-data" component={AthleteDataDashboard} />
      <Route path="/athlete-playbook" component={AthletePlaybook} />
      <Route path="/playbooks/baseball-recruiting" component={BaseballRecruitingPlaybook} />
      <Route path="/baseball-recruiting-playbook" component={BaseballRecruitingPlaybook} />
      <Route path="/athlete-website-builder" component={AthleteWebsiteBuilder} />
      <Route path="/athlynx-browser" component={AthlynXBrowser} />
      <Route path="/social-hub" component={SocialHub} />
      <Route path="/studio" component={StudioSuite} />
      <Route path="/social-command" component={SocialCommandCenter} />
      <Route path="/social-command-center" component={SocialCommandCenter} />
      <Route path="/media-os" component={MediaOS} />
      <Route path="/media-vault-rules" component={PrivateMediaVaultRules} />
      <Route path="/private-media-vault" component={PrivateMediaVaultRules} />
      <Route path="/vault-rules" component={PrivateMediaVaultRules} />
      <Route path="/real-athlete-profile-flow" component={RealAthleteProfileFlow} />
      <Route path="/nil-profile-flow" component={RealAthleteProfileFlow} />
      <Route path="/athlete-profile-flow" component={RealAthleteProfileFlow} />
      <Route path="/coach-onboarding" component={CoachAthleteOnboarding} />
      <Route path="/athlete-coach-onboarding" component={CoachAthleteOnboarding} />
      <Route path="/coach-setup" component={CoachAthleteOnboarding} />
      <Route path="/athlynxai-apps" component={AthlynXAIAppsEcosystem} />
      <Route path="/apps-ecosystem" component={AthlynXAIAppsEcosystem} />
      <Route path="/app-ecosystem" component={AthlynXAIAppsEcosystem} />
      <Route path="/athlynxai-os" component={AthlynXAIOperatingLayer} />
      <Route path="/connector-health" component={ConnectorHealthOS} />
      <Route path="/connector-health-os" component={ConnectorHealthOS} />
      <Route path="/admin/connector-health" component={ConnectorHealthOS} />
      <Route path="/autonomous-connector-sweep" component={ConnectorHealthOS} />
      <Route path="/runner" component={AthlynXAIOperatingLayer} />
      <Route path="/runner-os" component={AthlynXAIOperatingLayer} />
      <Route path="/runner-h" component={AthlynXAIOperatingLayer} />
      <Route path="/supahuman" component={AthlynXAIOperatingLayer} />
      <Route path="/superhuman" component={AthlynXAIOperatingLayer} />
      <Route path="/email-os" component={AthlynXAIOperatingLayer} />
      <Route path="/skills/athlynxai-production-os-workflow" component={SkillAthlynXProductionOS} />
      <Route path="/season-engine" component={AthlynXAISeasonEngine} />
      <Route path="/athlynxai-season-engine" component={AthlynXAISeasonEngine} />
      <Route path="/athletic-journey-crm" component={AthlynXAISeasonEngine} />
      <Route path="/growth-crm" component={AthlynXAISeasonEngine} />
      <Route path="/road-to-omaha" component={Brackets} />
      <Route path="/college-world-series" component={CollegeWorldSeries2026} />
      <Route path="/college-world-series-2026" component={CollegeWorldSeries2026} />
      <Route path="/brackets" component={Brackets} />
      <Route path="/brackets/mcws" component={Brackets} />
      <Route path="/brackets/wcws" component={Brackets} />
      <Route path="/mcws" component={Brackets} />
      <Route path="/wcws" component={Brackets} />
      <Route path="/diamond-grind-iq" component={DiamondGrindIQ} />
      <Route path="/dg-iq" component={DiamondGrindIQ} />
      <Route path="/youth-iq" component={DiamondGrindIQ} />
      <Route path="/battery" component={DiamondGrindIQ} />
      <Route path="/ncaa-baseball-regionals" component={CollegeWorldSeries2026} />
      <Route path="/baseball-regionals" component={CollegeWorldSeries2026} />
      <Route path="/road-to-omaha-2026" component={CollegeWorldSeries2026} />
      <Route path="/diamond-grind/road-to-omaha" component={AthlynXAISeasonEngine} />
      <Route path="/all-sports-season-hubs" component={AthlynXAISeasonEngine} />
      <Route path="/elite-athlete-pipeline" component={AthlynXAISeasonEngine} />
      <Route path="/recruiting-profile-crm" component={AthlynXAISeasonEngine} />
      <Route path="/axn-streaming" component={AthlynXAIOperatingLayer} />
      <Route path="/podcast-social-engine" component={AthlynXAIOperatingLayer} />
      <Route path="/media-tokenization" component={AthlynXAIOperatingLayer} />
      <Route path="/axn-os" component={AthlynXAIOperatingLayer} />
      <Route path="/podcast-os" component={AthlynXAIOperatingLayer} />
      <Route path="/the-athletes-playbook/episode-1" component={AthletePlaybookEpisode1} />
      <Route path="/the-athletes-playbook/season-1-episode-1-video-2" component={AthletePlaybookEpisode1} />
      <Route path="/athlete-playbook/episode-1" component={AthletePlaybookEpisode1} />
      <Route path="/athlete-playbook/season-1-episode-1-video-2" component={AthletePlaybookEpisode1} />
      <Route path="/podcast/episode-1" component={AthletePlaybookEpisode1} />
      <Route path="/memorial-day-launch" component={AthletePlaybookEpisode1} />
      <Route path="/comms-hub" component={CommsHub} />
      <Route path="/legal-hub" component={LegalHub} />
      <Route path="/athlete-legal-hub" component={AthleteLeagalHub} />
      <Route path="/athlete-life" component={AthleteLifeHub} />
      <Route path="/life-hub" component={AthleteLifeHub} />
      <Route path="/athlete-life-hub" component={AthleteLifeHub} />
      <Route path="/agent-finder" component={AgentFinder} />
      <Route path="/agents" component={AgentFinder} />
      <Route path="/athlete-financial" component={AthleteFinancial} />
      <Route path="/financial" component={AthleteFinancial} />
      <Route path="/athlete-legal" component={AthleteLegal} />
      <Route path="/legal" component={AthleteLegal} />
      <Route path="/athlete-health" component={AthleteHealth} />
      <Route path="/glucoathlete" component={GlucoAthleteOS} />
      <Route path="/gluco-athlete" component={GlucoAthleteOS} />
      <Route path="/glucoathlete-os" component={GlucoAthleteOS} />
      <Route path="/digital-health/glucoathlete" component={GlucoAthleteOS} />
      <Route path="/athlete-career" component={AthleteCareer} />
      <Route path="/career" component={AthleteCareer} />
      <Route path="/athlete-journey" component={AthleteJourney} />
      <Route path="/about" component={About} />
      <Route path="/master-admin" component={MasterAdmin} />
      <Route path="/employee-portal" component={EmployeePortal} />
      <Route path="/team-portal" component={EmployeePortal} />
      <Route path="/hipaa" component={HIPAACompliance} />
      <Route path="/competition-readiness" component={CompetitionReadiness} />
      <Route path="/openai-nebius" component={CompetitionReadiness} />
      <Route path="/wizard-hub" component={WizardHub} />
      <Route path="/crm" component={CRMDashboard} />
      <Route path="/crm-command" component={CRMCommandCenter} />
      <Route path="/communications-os" component={CommunicationsOS} />
      <Route path="/comms-os" component={CommunicationsOS} />
      <Route path="/crm/communications" component={CommunicationsOS} />
      <Route path="/contracts" component={Contracts} />
      <Route path="/corporate-documents" component={CorporateDocuments} />
      <Route path="/fuel-bots" component={FuelBotsGate} />
      <Route path="/team-bots" component={TeamBots} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/crm" component={AdminCRM} />
      <Route path="/admin-crm" component={AdminCRM} />
      <Route path="/admin/users" component={AdminUsers} />
      <Route path="/admin/broadcast" component={AdminBroadcast} />

      {/* ── Sport Platforms ── */}
      <Route path="/gridiron-nexus" component={GridironNexus} />
      <Route path="/football" component={GridironNexus} />
      <Route path="/pitch-pulse" component={PitchPulse} />
      <Route path="/soccer" component={PitchPulse} />
      <Route path="/court-kings" component={CourtKings} />
      <Route path="/basketball" component={CourtKings} />
      <Route path="/reel-masters" component={ReelMasters} />
      <Route path="/fishing" component={ReelMasters} />
      <Route path="/hunt-pro" component={HuntPro} />
      <Route path="/hunting" component={HuntPro} />
      <Route path="/fairway-elite" component={FairwayElite} />
      <Route path="/golf" component={FairwayElite} />
      <Route path="/signing-day" component={SigningDay} />
      <Route path="/training" component={Training} />
      <Route path="/gym" component={Training} />
      <Route path="/ice-breakers" component={IceBreakers} />
      <Route path="/hockey" component={IceBreakers} />
      <Route path="/net-setters" component={NetSetters} />
      <Route path="/volleyball" component={NetSetters} />
      <Route path="/track-elite" component={TrackElite} />
      <Route path="/track" component={TrackElite} />
      <Route path="/track-field" component={TrackElite} />
      <Route path="/track-and-field" component={TrackElite} />
      <Route path="/swim-surge" component={SwimSurge} />
      <Route path="/swimming" component={SwimSurge} />
      <Route path="/mat-warriors" component={MatWarriors} />
      <Route path="/wrestling" component={MatWarriors} />
      <Route path="/racket-kings" component={RacketKings} />
      <Route path="/tennis" component={RacketKings} />
      <Route path="/lacrosse-elite" component={LacrosseElite} />
      <Route path="/lacrosse" component={LacrosseElite} />
      <Route path="/softball-nation" component={SoftballNation} />
      <Route path="/softball" component={SoftballNation} />
      <Route path="/gymnastics-vault" component={GymnasticsVault} />
      <Route path="/gymnastics" component={GymnasticsVault} />
      <Route path="/rugby-elite" component={RugbyElite} />
      <Route path="/rugby" component={RugbyElite} />
      <Route path="/cricket-elite" component={CricketElite} />
      <Route path="/cricket" component={CricketElite} />
      <Route path="/cross-country-elite" component={CrossCountryElite} />
      <Route path="/cross-country" component={CrossCountryElite} />
      <Route path="/rowing-elite" component={RowingElite} />
      <Route path="/rowing" component={RowingElite} />
      <Route path="/water-polo-elite" component={WaterPoloElite} />
      <Route path="/water-polo" component={WaterPoloElite} />
      <Route path="/field-hockey-elite" component={FieldHockeyElite} />
      <Route path="/field-hockey" component={FieldHockeyElite} />
      <Route path="/cheer-elite" component={CheerElite} />
      <Route path="/cheer" component={CheerElite} />
      <Route path="/cheerleading" component={CheerElite} />

      {/* ── Commerce & Infrastructure ── */}
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/store" component={Store} />
      <Route path="/shop" component={Store} />
      <Route path="/athlete-store" component={AthleteStore} />
      <Route path="/gear" component={AthleteStore} />
      <Route path="/admin/expiry" component={AdminExpiry} />
      <Route path="/admin/subscriptions" component={AdminExpiry} />
      <Route path="/layer-cake" component={LayerCake} />
      <Route path="/innovations" component={InnovationsPage} />
      <Route path="/firsts" component={InnovationsPage} />
      <Route path="/layer-cake/comms" component={CommunicationsOS} />
      <Route path="/stack" component={LayerCake} />
      <Route path="/architecture" component={LayerCake} />
      <Route path="/recruiting-hub" component={RecruitingHub} />
      <Route path="/recruiting" component={RecruitingHub} />
      <Route path="/offers" component={RecruitingHub} />
      <Route path="/agent-ownership" component={AgentOwnership} />
      <Route path="/security" component={AgentOwnership} />
      <Route path="/ip-ownership" component={AgentOwnership} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/pricing-tiers" component={PricingTiers} />
      <Route path="/billing" component={Billing} />
      <Route path="/settings" component={Settings} />
      <Route path="/payment-success" component={PaymentSuccess} />
      <Route path="/infrastructure" component={Infrastructure} />
      <Route path="/infrastructure-manager" component={InfrastructureManager} />
      <Route path="/bitcoin-mining" component={BitcoinMining} />
      <Route path="/robotics" component={Robotics} />
      <Route path="/trainerbot" component={TrainerBot} />
      <Route path="/trainer-bot" component={TrainerBot} />
      <Route path="/robot-companions" component={RobotCompanions} />
      <Route path="/download" component={AppStoreSubmission} />
      <Route path="/app-store" component={AppStoreSubmission} />
      <Route path="/apps" component={Apps} />
      <Route path="/book" component={BookingHub} />
      <Route path="/booking" component={BookingHub} />
      <Route path="/schedule" component={BookingHub} />
      <Route path="/mobile-app" component={MobileApp} />

      {/* ── DHG Corporate ── */}
      <Route path="/dhg" component={DHGCorporate} />
      <Route path="/dhg-corporate" component={DHG} />
      <Route path="/dhg-home" component={DHGHome} />
      <Route path="/dhg-empire" component={DHGEmpire} />
      <Route path="/empire-vision" component={EmpireVision} />
      <Route path="/dozier-holdings" component={DHGCorporate} />
      <Route path="/softmor" component={Softmor} />
      <Route path="/vc-tech" component={VCTech} />
      <Route path="/data-centers" component={DataCenters} />
      <Route path="/the-virt" component={TheVirt} />
      <Route path="/investor-hub" component={InvestorHub} />
      <Route path="/investor-deck" component={InvestorDeck} />
      <Route path="/pro-teams" component={ProTeams} />
      <Route path="/athlete/:id" component={AthletePublicProfile} />
      <Route path="/browse-athletes" component={BrowseAthletes} />
      <Route path="/discover" component={BrowseAthletes} />
      <Route path="/partners" component={Partners} />
      <Route path="/partner-portal" component={PartnerPortal} />
      <Route path="/icc-usa" component={ICCUSAPartner} />
      <Route path="/icc" component={ICCUSAPartner} />
      <Route path="/white-label" component={WhiteLabel} />
      <Route path="/implementation" component={Implementation} />
      <Route path="/capabilities" component={Capabilities} />
      <Route path="/community-feedback" component={CommunityFeedback} />
      <Route path="/community" component={CommunitySoon} />
      <Route path="/platform" component={Platform} />

      {/* ── People & Culture ── */}
      <Route path="/founders" component={Founders} />
      <Route path="/founder-story" component={FounderStory} />
      <Route path="/founder-dedication" component={FounderDedication} />
      <Route path="/founder/chad-dozier" component={FounderProfile} />
      <Route path="/me" component={FounderProfile} />
      <Route path="/team" component={Team} />
      <Route path="/team/:slug" component={TeamProfilePage} />
      <Route path="/leadership-principles" component={LeadershipPrinciples} />
      <Route path="/journey" component={Journey} />
      <Route path="/careers" component={Careers} />
      <Route path="/jobs" component={Careers} />
      <Route path="/blue-collar" component={BlueCollar} />
      <Route path="/veterans" component={Veterans} />
      <Route path="/military-division" component={MilitaryDivision} />
      <Route path="/operation-warrior-pipeline" component={MilitaryDivision} />
      <Route path="/digital-health" component={DigitalHealth} />
      <Route path="/medical" component={MedicalGate} />
      <Route path="/health" component={MedicalGate} />
      <Route path="/mental-health" component={MentalHealthGate} />
      <Route path="/wellness" component={WellnessGate} />
      <Route path="/mindset" component={MindsetGate} />
      <Route path="/serenity-memorial" component={SerenityMemorial} />
      <Route path="/school" component={SchoolPage} />

      {/* ── Media & Content ── */}
      <Route path="/podcast" component={Podcast} />
      <Route path="/music" component={Music} />
      <Route path="/studio" component={Studio} />
      <Route path="/media-showcase" component={MediaShowcase} />
      <Route path="/portal" component={Portal} />

      {/* ── Legal ── */}
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/rules" component={Rules} />
      <Route path="/qa" component={QA} />
      <Route path="/portal/social-os" component={SocialOS} />
      <Route path="/social-os" component={SocialOS} />
      <Route path="/legal-compliance" component={LegalCompliance} />

      {/* ── School Branding & Licensing ── */}
      <Route path="/school-branding" component={SchoolBranding} />
      <Route path="/school-licensing" component={SchoolBranding} />
      <Route path="/nil-foundation" component={SchoolBranding} />

      {/* ── Utility ── */}
      {/* Alias routes to fix broken links across the platform */}
      <Route path="/home" component={Home} />
      <Route path="/our-story" component={About} />
      <Route path="/ai-trainer" component={AITrainerGate} />
      <Route path="/trainer" component={TrainerGate} />
      <Route path="/bots" component={TeamBots} />
      <Route path="/analytics" component={AthleteDataDashboard} />
      <Route path="/portal-news" component={NILPortal} />
      <Route path="/notifications" component={Notifications} />
      <Route path="/contact" component={Contact} />
      <Route path="/card" component={ChadCard} />
      <Route path="/dot-card" component={ChadCard} />
      <Route path="/dotcard" component={ChadCard} />
      <Route path="/dot-code" component={ChadCard} />
      <Route path="/chad" component={ChadCard} />
      <Route path="/quick-links" component={QuickLinksHub} />
      <Route path="/project-management" component={ProjectManagement} />
      <Route path="/project-checklist" component={ProjectChecklist} />
      <Route path="/project-playbook" component={ProjectPlaybook} />

      {/* ── Wizards ── */}
      <Route path="/wizards" component={WizardHub} />
      <Route path="/ai-wizards" component={WizardHub} />
      <Route path="/wizards/agent" component={AgentWizard} />
      <Route path="/wizards/career" component={CareerWizard} />
      <Route path="/wizards/financial" component={FinancialWizard} />
      <Route path="/wizards/lawyer" component={LawyerWizard} />
      <Route path="/wizards/life" component={LifeWizard} />
      <Route path="/wizards/scholarship" component={ScholarshipWizard} />
      <Route path="/wizards/scout" component={ScoutWizard} />
      <Route path="/wizards/transfer" component={TransferWizard} />

      {/* ── Build 3: Founder, Podcast, Network, Brand Wall ── */}
      <Route path="/founder" component={Founder} />
      <Route path="/the-first" component={TheFirst} />
      <Route path="/build-decisions" component={BuildDecisions} />
      <Route path="/what-we-stand-for" component={WhatWeStandFor} />
      <Route path="/values" component={WhatWeStandFor} />
      <Route path="/manifesto" component={WhatWeStandFor} />
      {/* Build 4 — Mind Map, Quantum, Tiered Billing, CRM Hub, Realty */}
      <Route path="/mind-map" component={MindMap} />
      <Route path="/quantum" component={Quantum} />
      <Route path="/tiers" component={TiersBilling} />
      <Route path="/crm-hub" component={CRMHub} />
      <Route path="/realty" component={RealtyBrowse} />
      <Route path="/realty/list" component={RealtyList} />
      <Route path="/founder/podcast" component={FounderPodcast} />
      <Route path="/network" component={AthlynXNetwork} />
      <Route path="/athlynx-network" component={AthlynXNetwork} />
      <Route path="/brand-wall" component={BrandWall} />
      <Route path="/endorsement-board" component={BrandWall} />

      {/* ── Session 32: C-Factor Hub, Rankings, AthleteCard ── */}
      <Route path="/cfactor" component={CFactorHub} />
      <Route path="/c-factor" component={CFactorHub} />
      <Route path="/command-center" component={CFactorHub} />
      <Route path="/athlete-command-center" component={CFactorHub} />
      <Route path="/rankings-hub" component={RankingsHub} />
      <Route path="/rankings" component={RankingsHub} />
      <Route path="/mock-draft" component={RankingsHub} />
      <Route path="/top-25" component={RankingsHub} />
      <Route path="/live-events" component={RankingsHub} />
      <Route path="/prospect-finder" component={RankingsHub} />
      <Route path="/card/:id" component={AthleteCard} />
      <Route path="/athlete-card/:id" component={AthleteCard} />

      {/* ── 404 ── */}
      {/* ── Founder's Legacy ── */}
      <Route path="/legacy" component={DozierLegacy} />
      <Route path="/dozier-legacy" component={DozierLegacy} />

      <Route path="/landing" component={LandingPage} />
      <Route path="/components" component={ComponentShowcase} />
      {/* ── Session 38 ── */}
      <Route path="/token-factory" component={TokenFactory} />
      <Route path="/credits" component={TokenFactory} />
      <Route path="/ai-credits" component={TokenFactory} />
      <Route path="/auth-strategy" component={AuthStrategy} />
      {/* S39 — New Features */}
      <Route path="/ai-scouting-report" component={AIScoutingReport} />
      <Route path="/scouting-report" component={AIScoutingReport} />
      <Route path="/notification-center" component={NotificationCenter} />
      <Route path="/notifications" component={NotificationCenter} />
      <Route path="/highlight-reel-studio" component={HighlightReelStudio} />
      <Route path="/reel-studio" component={HighlightReelStudio} />
      <Route path="/admin/build-monitor" component={BuildMonitor} />
      <Route path="/build-monitor" component={BuildMonitor} />
      {/* Build 11: Connector OS landing + sub-pages */}
      <Route path="/os" component={ConnectorOSLanding} />
      <Route path="/connector-os" component={ConnectorOSLanding} />
      <Route path="/connector-os/thesis" component={ConnectorOSThesis} />
      <Route path="/connector-os/pricing" component={ConnectorOSPricing} />
      <Route path="/connector-os/layer-cake" component={ConnectorOSLayerCake} />
      {/* Build 11: Doctrine */}
      <Route path="/doctrine" component={DoctrineManifesto} />
      <Route path="/doctrine/manifesto" component={DoctrineManifesto} />
      <Route path="/doctrine/brand" component={DoctrineBrand} />
      <Route path="/doctrine/small-circle" component={DoctrineSmallCircle} />
      {/* Build 12: Live route audit */}
      <Route path="/audit" component={RouteAudit} />
      <Route path="/admin/audit" component={RouteAudit} />
      {/* Build 13: Traffic ledger admin */}
      <Route path="/os/ledger" component={OSLedger} />
      <Route path="/admin/ledger" component={OSLedger} />
      {/* AI Engine — Nebius H200 */}
      <Route path="/athlynx-engine" component={AthlynxEngine} />
      <Route path="/ai-engine" component={AthlynxEngine} />
      <Route path="/nebius" component={AthlynxEngine} />
      <Route path="/engine" component={AthlynxEngine} />
      {/* Google Workspace OS */}
      <Route path="/google-workspace" component={GoogleWorkspaceOS} />
      <Route path="/workspace" component={GoogleWorkspaceOS} />
      <Route path="/gws" component={GoogleWorkspaceOS} />
      <Route path="/gemini" component={GoogleWorkspaceOS} />
      {/* SEO Command Center */}
      <Route path="/seo" component={SEODashboard} />
      <Route path="/seo-dashboard" component={SEODashboard} />
      {/* Commerce / Vendor Marketplace */}
      <Route path="/commerce" component={VendorMarketplace} />
      <Route path="/vendor-marketplace" component={VendorMarketplace} />
      {/* Wellness Portal */}
      <Route path="/wellness-portal" component={WellnessPortal} />
      {/* Founder Podcast canonical route */}
      <Route path="/founder-podcast" component={FounderPodcast} />
      {/* Booking Hub canonical route */}
      <Route path="/booking-hub" component={BookingHub} />
      {/* GlucoAthlete OS canonical route */}
      <Route path="/gluco-athlete-os" component={GlucoAthleteOS} />
      {/* Beta Signup — User Acquisition */}
      <Route path="/beta" component={BetaSignup} />
      <Route path="/join" component={BetaSignup} />
      <Route path="/get-started" component={BetaSignup} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          {/* Sitewide athlete backdrop — Chad Dozier doctrine: athletes ARE the
              platform. Picks the right image per route, fades to true black,
              z-index 0 so foreground content sits cleanly on top. */}
          <AthletePageBackground />
          <div className="relative z-10">
            <BetaBanner />
            <SEOManager />
            <ScrollToTop />
            <Router />
            <PWAInstallBanner />
            <AIWizard />
            <CoachLynx />
            <CookieConsent />
            <Toaster />
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
