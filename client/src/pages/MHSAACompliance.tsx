/**
 * MHSAA Compliance — Michigan High School Athletic Association
 * AthlynXAI Platform · Compliance OS
 *
 * Covers: MHSAA eligibility rules, NIL restrictions for HS athletes,
 * recruiting compliance, transfer rules, NFHS alignment, and all 50-state
 * high school athletic association compliance framework.
 *
 * Author: Chad A. Dozier Sr. — Founder · CEO · Chairman, AthlynXAI Corporation
 */

import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import {
  Shield, CheckCircle, AlertTriangle, BookOpen, Users,
  GraduationCap, Scale, FileText, Globe, Building, Trophy,
  Lock, Heart, Briefcase, ExternalLink
} from "lucide-react";

// 50-state HSAA registry
const STATE_ASSOCIATIONS = [
  { state: "Alabama", abbr: "AHSAA", name: "Alabama High School Athletic Association", url: "https://ahsaa.com" },
  { state: "Alaska", abbr: "ASAA", name: "Alaska School Activities Association", url: "https://asaa.org" },
  { state: "Arizona", abbr: "AIA", name: "Arizona Interscholastic Association", url: "https://aiaonline.org" },
  { state: "Arkansas", abbr: "AAA", name: "Arkansas Activities Association", url: "https://ahsaa.org" },
  { state: "California", abbr: "CIF", name: "California Interscholastic Federation", url: "https://cifstate.org" },
  { state: "Colorado", abbr: "CHSAA", name: "Colorado High School Activities Association", url: "https://chsaa.org" },
  { state: "Connecticut", abbr: "CIAC", name: "Connecticut Interscholastic Athletic Conference", url: "https://casciac.org" },
  { state: "Delaware", abbr: "DIAA", name: "Delaware Interscholastic Athletic Association", url: "https://diaa.org" },
  { state: "Florida", abbr: "FHSAA", name: "Florida High School Athletic Association", url: "https://fhsaa.com" },
  { state: "Georgia", abbr: "GHSA", name: "Georgia High School Association", url: "https://ghsa.net" },
  { state: "Hawaii", abbr: "HHSAA", name: "Hawaii High School Athletic Association", url: "https://hhsaa.org" },
  { state: "Idaho", abbr: "IHSAA", name: "Idaho High School Activities Association", url: "https://idhsaa.org" },
  { state: "Illinois", abbr: "IHSA", name: "Illinois High School Association", url: "https://ihsa.org" },
  { state: "Indiana", abbr: "IHSAA", name: "Indiana High School Athletic Association", url: "https://ihsaa.org" },
  { state: "Iowa", abbr: "IHSAA", name: "Iowa High School Athletic Association", url: "https://iahsaa.org" },
  { state: "Kansas", abbr: "KSHSAA", name: "Kansas State High School Activities Association", url: "https://kshsaa.org" },
  { state: "Kentucky", abbr: "KHSAA", name: "Kentucky High School Athletic Association", url: "https://khsaa.org" },
  { state: "Louisiana", abbr: "LHSAA", name: "Louisiana High School Athletic Association", url: "https://lhsaa.org" },
  { state: "Maine", abbr: "MPA", name: "Maine Principals' Association", url: "https://mpasports.org" },
  { state: "Maryland", abbr: "MPSSAA", name: "Maryland Public Secondary Schools Athletic Association", url: "https://mpssaa.org" },
  { state: "Massachusetts", abbr: "MIAA", name: "Massachusetts Interscholastic Athletic Association", url: "https://miaa.net" },
  { state: "Michigan", abbr: "MHSAA", name: "Michigan High School Athletic Association", url: "https://mhsaa.com", featured: true },
  { state: "Minnesota", abbr: "MSHSL", name: "Minnesota State High School League", url: "https://mshsl.org" },
  { state: "Mississippi", abbr: "MHSAA", name: "Mississippi High School Activities Association", url: "https://misshsaa.com" },
  { state: "Missouri", abbr: "MSHSAA", name: "Missouri State High School Activities Association", url: "https://mshsaa.org" },
  { state: "Montana", abbr: "MHSA", name: "Montana High School Association", url: "https://mhsa.org" },
  { state: "Nebraska", abbr: "NSAA", name: "Nebraska School Activities Association", url: "https://nsaahome.org" },
  { state: "Nevada", abbr: "NIAA", name: "Nevada Interscholastic Activities Association", url: "https://niaa.com" },
  { state: "New Hampshire", abbr: "NHIAA", name: "New Hampshire Interscholastic Athletic Association", url: "https://nhiaa.org" },
  { state: "New Jersey", abbr: "NJSIAA", name: "New Jersey State Interscholastic Athletic Association", url: "https://njsiaa.org" },
  { state: "New Mexico", abbr: "NMAA", name: "New Mexico Activities Association", url: "https://nmact.org" },
  { state: "New York", abbr: "NYSPHSAA", name: "New York State Public High School Athletic Association", url: "https://nysphsaa.org" },
  { state: "North Carolina", abbr: "NCHSAA", name: "North Carolina High School Athletic Association", url: "https://nchsaa.org" },
  { state: "North Dakota", abbr: "NDHSAA", name: "North Dakota High School Activities Association", url: "https://ndhsaa.com" },
  { state: "Ohio", abbr: "OHSAA", name: "Ohio High School Athletic Association", url: "https://ohsaa.org" },
  { state: "Oklahoma", abbr: "OSSAA", name: "Oklahoma Secondary School Activities Association", url: "https://ossaa.com" },
  { state: "Oregon", abbr: "OSAA", name: "Oregon School Activities Association", url: "https://osaa.org" },
  { state: "Pennsylvania", abbr: "PIAA", name: "Pennsylvania Interscholastic Athletic Association", url: "https://piaa.org" },
  { state: "Rhode Island", abbr: "RIIL", name: "Rhode Island Interscholastic League", url: "https://riil.org" },
  { state: "South Carolina", abbr: "SCHSL", name: "South Carolina High School League", url: "https://schsl.org" },
  { state: "South Dakota", abbr: "SDHSAA", name: "South Dakota High School Activities Association", url: "https://sdhsaa.com" },
  { state: "Tennessee", abbr: "TSSAA", name: "Tennessee Secondary School Athletic Association", url: "https://tssaa.org" },
  { state: "Texas", abbr: "UIL", name: "University Interscholastic League", url: "https://uiltexas.org" },
  { state: "Utah", abbr: "UHSAA", name: "Utah High School Activities Association", url: "https://uhsaa.org" },
  { state: "Vermont", abbr: "VPA", name: "Vermont Principals' Association", url: "https://vpasports.org" },
  { state: "Virginia", abbr: "VHSL", name: "Virginia High School League", url: "https://vhsl.org" },
  { state: "Washington", abbr: "WIAA", name: "Washington Interscholastic Activities Association", url: "https://wiaa.com" },
  { state: "West Virginia", abbr: "WVSSAC", name: "West Virginia Secondary School Activities Commission", url: "https://wvssac.org" },
  { state: "Wisconsin", abbr: "WIAA", name: "Wisconsin Interscholastic Athletic Association", url: "https://wiaawi.org" },
  { state: "Wyoming", abbr: "WHSAA", name: "Wyoming High School Activities Association", url: "https://whsaa.org" },
];

const MHSAA_RULES = [
  {
    icon: Trophy,
    title: "Eligibility Requirements",
    color: "text-[#00c2ff]",
    bg: "bg-[#00c2ff]/10 border-[#00c2ff]/20",
    rules: [
      "Student must be enrolled full-time at the school they represent",
      "Must not have reached age 19 before September 1 of the current school year",
      "Must maintain academic eligibility — passing required courses per semester",
      "Must not have competed more than 8 consecutive semesters after first entering 9th grade",
      "Transfer students subject to MHSAA transfer eligibility rules and waiting periods",
      "AthlynX tracks eligibility windows and alerts athletes and parents of upcoming deadlines",
    ],
  },
  {
    icon: Scale,
    title: "NIL Rules for High School Athletes (Michigan)",
    color: "text-[#0066ff]",
    bg: "bg-[#0066ff]/10 border-[#0066ff]/20",
    rules: [
      "Michigan law (PA 258 of 2022) permits high school athletes to earn NIL compensation",
      "NIL activity must not conflict with MHSAA eligibility rules",
      "Athletes may not use school name, logo, uniform, or facilities in NIL deals without school permission",
      "NIL deals must not be contingent on enrollment at a specific school (no pay-to-play)",
      "AthlynX NIL contracts include MHSAA-compliant language and school notification workflows",
      "All HS NIL earnings are reportable income — IRS 1099-NEC applies at $600+ threshold",
    ],
  },
  {
    icon: Users,
    title: "Recruiting Compliance",
    color: "text-[#22c55e]",
    bg: "bg-[#22c55e]/10 border-[#22c55e]/20",
    rules: [
      "College coaches may not contact HS athletes until permitted contact periods per NCAA rules",
      "MHSAA prohibits high school coaches from directing athletes to specific colleges",
      "Unofficial visits to college campuses are permitted at any time at the athlete's expense",
      "Official paid visits may begin after the athlete's junior year per NCAA rules",
      "AthlynX Recruiting Hub tracks contact period windows and flags compliance violations",
      "All recruiting communications logged and time-stamped in AthlynX compliance vault",
    ],
  },
  {
    icon: FileText,
    title: "Transfer Rules",
    color: "text-[#f59e0b]",
    bg: "bg-[#f59e0b]/10 border-[#f59e0b]/20",
    rules: [
      "Transferring students must sit out one semester unless a hardship waiver is granted",
      "Hardship waivers available for family moves, school closures, and documented hardship cases",
      "Transfers for athletic purposes are subject to enhanced scrutiny and may result in ineligibility",
      "AthlynX Transfer Portal Watch monitors HS transfer activity and compliance status",
      "Parent/guardian must complete MHSAA transfer paperwork within required deadlines",
      "AthlynX notifies athletes of transfer window deadlines and required documentation",
    ],
  },
  {
    icon: Heart,
    title: "Health & Safety Compliance",
    color: "text-[#ef4444]",
    bg: "bg-[#ef4444]/10 border-[#ef4444]/20",
    rules: [
      "MHSAA requires annual physical examination for all student-athletes",
      "Concussion protocols must be followed — return-to-play requires medical clearance",
      "Heat illness prevention protocols required for all fall sports",
      "AthlynX Medical Vault stores HIPAA-aligned health records with parent/guardian consent",
      "Injury tracking and return-to-play timelines managed in AthlynX Medical OS",
      "All health data encrypted AES-256 and accessible only with explicit consent",
    ],
  },
  {
    icon: GraduationCap,
    title: "NFHS Alignment (National Federation of State High School Associations)",
    color: "text-[#a855f7]",
    bg: "bg-[#a855f7]/10 border-[#a855f7]/20",
    rules: [
      "MHSAA is a member of NFHS — all NFHS playing rules apply to Michigan HS sports",
      "NFHS sets rules for 17 sports including football, basketball, baseball, softball, track, soccer",
      "AthlynX platform updated within 30 days of any NFHS rule change",
      "NFHS Coaches Education Program completion tracked in AthlynX Coach Portal",
      "AthlynX supports all 50 state HSAAs — compliance rules auto-applied by athlete's state",
      "State-specific NIL law variations automatically flagged in AthlynX NIL deal workflows",
    ],
  },
];

function MHSAAComplianceInner() {
  return (
    <div className="min-h-screen bg-[#050d1a] text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0a1628] to-[#050d1a] border-b border-[#0066ff]/20 px-5 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-3">
            <Link href="/legal-hub">
              <span className="text-[#0066ff] text-sm font-bold hover:text-[#00c2ff] transition-colors">Legal Hub</span>
            </Link>
            <span className="text-[#8ba3c7]">/</span>
            <span className="text-[#8ba3c7] text-sm">MHSAA Compliance</span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0066ff]/20 border border-[#0066ff]/30 flex items-center justify-center flex-shrink-0">
              <Shield className="w-7 h-7 text-[#0066ff]" />
            </div>
            <div>
              <h1 className="text-3xl lg:text-5xl font-black text-white tracking-tight">
                MHSAA <span className="text-[#00c2ff]">Compliance</span>
              </h1>
              <p className="text-[#8ba3c7] text-lg mt-2">
                Michigan High School Athletic Association · All 50 State HSAAs · NFHS
              </p>
              <p className="text-[#8ba3c7]/70 text-sm mt-1">
                AthlynX is the only platform built to serve athletes from youth through pro — with full high school athletic association compliance baked in from day one.
              </p>
            </div>
          </div>

          {/* Status badges */}
          <div className="flex flex-wrap gap-3 mt-6">
            {[
              { label: "MHSAA Aligned", color: "#0066ff" },
              { label: "NFHS Compliant", color: "#00c2ff" },
              { label: "All 50 State HSAAs", color: "#22c55e" },
              { label: "NIL HS Law Compliant", color: "#f59e0b" },
              { label: "HIPAA Aligned", color: "#a855f7" },
              { label: "FERPA Compliant", color: "#ef4444" },
            ].map(b => (
              <span key={b.label} className="text-xs font-black px-3 py-1.5 rounded-full border" style={{ color: b.color, borderColor: b.color + "44", backgroundColor: b.color + "15" }}>
                {b.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* MHSAA Rules Grid */}
      <div className="max-w-5xl mx-auto px-5 py-12">
        <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">MHSAA Framework</p>
        <h2 className="text-2xl lg:text-3xl font-black text-white mb-8">
          Michigan High School Athletic Association — Full Compliance Coverage
        </h2>
        <div className="grid md:grid-cols-2 gap-5">
          {MHSAA_RULES.map((section, i) => (
            <div key={i} className={`rounded-2xl border p-5 ${section.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <section.icon className={`w-5 h-5 ${section.color} flex-shrink-0`} />
                <h3 className="text-base font-black text-white">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.rules.map((rule, j) => (
                  <li key={j} className="flex items-start gap-2 text-sm text-[#8ba3c7]">
                    <CheckCircle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${section.color}`} />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* NFHS + All 50 States */}
        <div className="mt-12">
          <p className="text-[#0066ff] text-sm font-black uppercase tracking-[0.3em] mb-3">National Coverage</p>
          <h2 className="text-2xl font-black text-white mb-2">All 50 State High School Athletic Associations</h2>
          <p className="text-[#8ba3c7] mb-6">
            AthlynX compliance rules auto-apply based on the athlete's state of enrollment. Every HSAA in the country is represented in the platform.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {STATE_ASSOCIATIONS.map((assoc) => (
              <div
                key={assoc.abbr + assoc.state}
                className={`rounded-xl border p-2.5 text-center transition-all ${
                  assoc.featured
                    ? "border-[#0066ff]/60 bg-[#0066ff]/10"
                    : "border-white/10 bg-[#0a1628] hover:border-white/20"
                }`}
              >
                <p className={`text-xs font-black ${assoc.featured ? "text-[#00c2ff]" : "text-white"}`}>{assoc.abbr}</p>
                <p className="text-[9px] text-[#8ba3c7] mt-0.5">{assoc.state}</p>
                {assoc.featured && (
                  <span className="text-[8px] font-black text-[#0066ff] bg-[#0066ff]/20 px-1 py-0.5 rounded-full mt-1 inline-block">PRIMARY</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* IRS / Tax section for HS athletes */}
        <div className="mt-12 rounded-2xl border border-[#f59e0b]/30 bg-[#f59e0b]/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Briefcase className="w-6 h-6 text-[#f59e0b]" />
            <h3 className="text-lg font-black text-white">IRS Tax Compliance — High School NIL Athletes</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "All NIL income earned by high school athletes is taxable income under IRS rules",
              "Athletes earning $600+ from a single source receive a 1099-NEC form",
              "Self-employment tax (15.3%) applies to NIL income — athletes should consult a tax advisor",
              "W-9 forms required before first payment on any AthlynX NIL deal",
              "AthlynX generates transaction records for all NIL payments to assist with tax filing",
              "Parents/guardians of minor athletes may need to file on behalf of the athlete",
              "State income tax obligations vary — AthlynX flags state-specific requirements",
              "AthlynX NIL Vault stores all tax documents with AES-256 encryption",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#8ba3c7]">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#f59e0b]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* COPPA / Minor athlete protections */}
        <div className="mt-6 rounded-2xl border border-[#a855f7]/30 bg-[#a855f7]/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-6 h-6 text-[#a855f7]" />
            <h3 className="text-lg font-black text-white">COPPA — Minor Athlete Data Protection</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "COPPA applies to all athletes under age 13 on the AthlynX platform",
              "Parental consent required before any data collection for athletes under 13",
              "Diamond Grind IQ (ages 8-13) is fully COPPA-locked — parent-managed accounts only",
              "No targeted advertising to minors on any AthlynX platform surface",
              "Parental dashboard provides full visibility and control over minor athlete data",
              "Data minimization — only collect what is necessary for the athlete's stage",
              "Right to deletion — parents may request full data deletion at any time",
              "AthlynX does not sell or share minor athlete data with third parties",
            ].map((rule, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-[#8ba3c7]">
                <CheckCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#a855f7]" />
                <span>{rule}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-[#8ba3c7] text-sm mb-4">Questions about MHSAA compliance or high school athlete eligibility?</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/legal-hub">
              <button className="px-6 py-3 rounded-2xl text-sm font-black text-white bg-[#0066ff] hover:bg-[#0055dd] transition-colors">
                Full Legal Hub
              </button>
            </Link>
            <Link href="/hipaa">
              <button className="px-6 py-3 rounded-2xl text-sm font-black text-[#8ba3c7] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                HIPAA Compliance
              </button>
            </Link>
            <Link href="/legal-compliance">
              <button className="px-6 py-3 rounded-2xl text-sm font-black text-[#8ba3c7] bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                NCAA / Federal Compliance
              </button>
            </Link>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 p-4 rounded-xl bg-[#0a1628] border border-white/5">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#8ba3c7]/70 leading-relaxed">
              AthlynX uses MHSAA-aligned language and compliance frameworks. AthlynX is not officially endorsed by or affiliated with MHSAA, NFHS, or any state high school athletic association. Athletes and families should consult their school's athletic director and a qualified sports attorney for official eligibility determinations. This page is for informational purposes only and does not constitute legal advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MHSAACompliance() {
  return (
    <RouteErrorBoundary>
      <MHSAAComplianceInner />
    </RouteErrorBoundary>
  );
}
