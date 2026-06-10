/**
 * ConsentGate — AthlynX HIPAA + Medical Data Waiver Consent
 * ============================================================
 * Required step during onboarding before any platform access.
 * Athletes must scroll through and accept all three documents:
 *   1. HIPAA Notice of Privacy Practices
 *   2. AthlynX Medical Data Waiver
 *   3. AthlynX Athlete Data Rights & GlucoAthlete Device Consent
 *
 * On acceptance: calls auth.saveConsent → records timestamp, IP,
 * signed name, and document version to the users table.
 * GlucoAthlete / Libre Link / biosignal data is BLOCKED until signed.
 *
 * Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved.
 */
import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Shield, FileText, Heart, CheckCircle, AlertTriangle, ChevronDown } from "lucide-react";

const CONSENT_VERSION = "1.0";

interface ConsentGateProps {
  onComplete: () => void;
  userName?: string;
}

type DocId = "hipaa" | "medical" | "athlynx";

const DOCS: { id: DocId; icon: React.ReactNode; title: string; subtitle: string; color: string }[] = [
  {
    id: "hipaa",
    icon: <Shield className="w-5 h-5" />,
    title: "HIPAA Notice of Privacy Practices",
    subtitle: "How we protect your health information",
    color: "blue",
  },
  {
    id: "medical",
    icon: <Heart className="w-5 h-5" />,
    title: "AthlynX Medical Data Waiver",
    subtitle: "Consent to collect sports medical data",
    color: "red",
  },
  {
    id: "athlynx",
    icon: <FileText className="w-5 h-5" />,
    title: "Athlete Data Rights & GlucoAthlete Consent",
    subtitle: "Libre Link, biosignal, and device data",
    color: "cyan",
  },
];

const HIPAA_TEXT = `NOTICE OF PRIVACY PRACTICES — AthlynXAI Platform
Effective Date: January 1, 2026 | Version ${CONSENT_VERSION}

THIS NOTICE DESCRIBES HOW HEALTH INFORMATION ABOUT YOU MAY BE USED AND DISCLOSED AND HOW YOU CAN GET ACCESS TO THIS INFORMATION. PLEASE REVIEW IT CAREFULLY.

1. WHO WE ARE
AthlynXAI ("AthlynX," "we," "us") is the operator of the AthlynXAI OS platform. This Notice applies to all health and medical information we collect, store, or process in connection with your use of the platform, including but not limited to glucose readings, biosignal data, injury history, medical device data, and sports performance health metrics.

2. INFORMATION WE COLLECT
We may collect the following categories of health-related information:
• Glucose readings from Libre 3 Plus, Dexcom, and other CGM devices (GlucoAthlete OS)
• Heart rate, HRV, SpO2, and other wearable biosignal data
• Injury history, rehabilitation records, and sports medical history
• Athletic performance metrics that have health implications
• Emergency contact and medical alert information
• Mental health and wellness check-in data

3. HOW WE USE YOUR HEALTH INFORMATION
We use your health information to:
• Provide you with personalized athletic performance monitoring
• Generate alerts and notifications for health-related events
• Enable your authorized coaches, trainers, and medical staff to monitor your health
• Improve our AI-powered health and performance analytics
• Comply with legal and regulatory requirements

4. HOW WE SHARE YOUR HEALTH INFORMATION
We do NOT sell your health information. We may share it only:
• With your explicitly authorized coaches, trainers, and medical professionals
• With emergency services when there is an imminent threat to your health or safety
• With service providers who process data on our behalf under strict confidentiality agreements
• As required by law, court order, or government regulation

5. YOUR RIGHTS UNDER HIPAA
You have the right to:
• Access and receive a copy of your health information
• Request corrections to your health information
• Request restrictions on how we use your information
• Receive an accounting of disclosures of your health information
• File a complaint if you believe your privacy rights have been violated

6. SECURITY
We use industry-standard encryption, access controls, and security measures to protect your health information. All health data is stored in encrypted form and access is logged and audited.

7. CONTACT
Privacy Officer: privacy@athlynx.ai
AthlynXAI, Inc. | Be The Legacy.`;

const MEDICAL_WAIVER_TEXT = `ATHLYNX MEDICAL DATA WAIVER AND CONSENT
Effective Date: January 1, 2026 | Version ${CONSENT_VERSION}

IMPORTANT: READ THIS ENTIRE DOCUMENT BEFORE SIGNING. BY SIGNING, YOU CONSENT TO THE COLLECTION AND USE OF YOUR SPORTS MEDICAL DATA.

1. PURPOSE
AthlynX collects sports medical data to provide you with personalized athletic performance monitoring, health alerts, and AI-powered coaching insights. This waiver authorizes AthlynX to collect, store, analyze, and use your sports medical data as described herein.

2. DATA COLLECTED
By signing this waiver, you authorize AthlynX to collect:
• Continuous glucose monitoring (CGM) data from connected devices (Libre 3 Plus, Dexcom, etc.)
• Wearable biosignal data (heart rate, HRV, SpO2, sleep, activity, recovery scores)
• Injury history, surgery history, and rehabilitation records
• Medication and supplement information relevant to athletic performance
• Mental health and wellness assessments
• Biomechanical and movement data from connected devices
• Emergency medical information and contacts

3. AUTHORIZED USES
Your medical data may be used for:
• Real-time health monitoring and alert generation
• AI-powered performance and recovery optimization
• Sharing with your authorized medical team, coaches, and trainers
• Anonymized, aggregated research to improve athlete health outcomes
• Compliance with applicable laws and regulations

4. IMPORTANT LIMITATIONS
AthlynX is NOT a medical device and does NOT:
• Provide medical advice, diagnosis, or treatment
• Replace your primary CGM device, meter, or clinician
• Prescribe insulin, medications, or treatment protocols
• Provide emergency medical services
• Substitute for professional medical care

IN A MEDICAL EMERGENCY, CALL 911 IMMEDIATELY.

5. RISKS
You understand that:
• Health monitoring data may be inaccurate or delayed
• AthlynX alerts are informational only and not medical diagnoses
• You should always verify health readings with your primary medical device and clinician
• Technical failures may result in missed alerts or incorrect data

6. CONSENT FOR MINORS
If you are under 18, your parent or legal guardian must also sign this waiver. By proceeding, you represent that you are 18 or older, OR that your parent/guardian has reviewed and consented on your behalf.

7. REVOCATION
You may revoke this consent at any time by contacting privacy@athlynx.ai. Revocation will not affect data already collected but will stop future collection.

8. GOVERNING LAW
This waiver is governed by the laws of the State of Mississippi and applicable federal law, including HIPAA.`;

const ATHLYNX_DATA_TEXT = `ATHLETE DATA RIGHTS, GLUCOATHLETE & DEVICE CONSENT
Effective Date: January 1, 2026 | Version ${CONSENT_VERSION}

1. ATHLYNX DATA RIGHTS AGREEMENT
By creating an AthlynX account and signing this agreement, you grant AthlynX a limited, non-exclusive license to:
• Store and process your athletic performance data on AthlynX servers
• Use your anonymized data to improve AthlynX AI models and platform features
• Display your profile information to other authorized platform users as configured by your privacy settings
• Generate AI-powered insights, recommendations, and alerts based on your data

YOU RETAIN OWNERSHIP OF YOUR DATA. AthlynX does not sell your personal data to third parties.

2. GLUCOATHLETE OS — LIBRE LINK & CGM DEVICE CONSENT
GlucoAthlete OS is AthlynX's glucose monitoring integration layer. By signing this consent, you authorize:
• Connection of your Abbott Libre 3 Plus, LibreView, or LibreLinkUp account to AthlynX
• Connection of Dexcom, Tidepool, Nightscout, Apple Health, or Google Health Connect (when available)
• Read-only access to your continuous glucose monitoring (CGM) data stream
• Storage of glucose readings, trend data, and associated timestamps in your AthlynX Health Vault
• Generation of glucose-based alerts, performance correlations, and fuel recommendations

IMPORTANT: GlucoAthlete OS is an informational monitoring tool ONLY. It does NOT:
• Control insulin pumps or dosing devices
• Provide medical advice or insulin dosing recommendations
• Replace your primary CGM device or clinician
• Constitute a medical device under FDA regulations

3. BIOSIGNAL & WEARABLE DEVICE CONSENT
You authorize AthlynX to connect to and receive data from:
• Apple Watch / Apple Health (HealthKit)
• Garmin, WHOOP, Oura, Fitbit, Polar, and other connected wearables
• Heart rate monitors, GPS devices, and sports performance sensors
• Future AthlynX-developed medical and performance devices

4. ATHLETE RIGHTS WAIVER
You understand and agree that:
• AthlynX may use your athletic performance data (non-personally-identifiable) to improve platform features
• AthlynX may contact you about NIL opportunities, partnerships, and platform features
• You have the right to export and delete your data at any time
• AthlynX will never sell your personal data to third parties without your explicit consent

5. INTELLECTUAL PROPERTY
All AthlynX platform features, AI models, and software are the exclusive intellectual property of Chad A. Dozier Sr. and AthlynXAI, Inc. Your data remains yours.

6. CONTACT
Data Rights: privacy@athlynx.ai | Medical: medical@athlynx.ai
AthlynXAI, Inc. | Be The Legacy. ™`;

const DOC_CONTENT: Record<DocId, string> = {
  hipaa: HIPAA_TEXT,
  medical: MEDICAL_WAIVER_TEXT,
  athlynx: ATHLYNX_DATA_TEXT,
};

export default function ConsentGate({ onComplete, userName = "" }: ConsentGateProps) {
  const [activeDoc, setActiveDoc] = useState<DocId>("hipaa");
  const [scrolled, setScrolled] = useState<Record<DocId, boolean>>({ hipaa: false, medical: false, athlynx: false });
  const [accepted, setAccepted] = useState<Record<DocId, boolean>>({ hipaa: false, medical: false, athlynx: false });
  const [signedName, setSignedName] = useState(userName);
  const [showSignature, setShowSignature] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const saveConsent = trpc.auth.saveConsent.useMutation({
    onSuccess: () => { onComplete(); },
    onError: (err) => { setError(err.message); },
  });

  // Reset scroll detection when switching docs
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [activeDoc]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop <= el.clientHeight + 40;
    if (atBottom && !scrolled[activeDoc]) {
      setScrolled(prev => ({ ...prev, [activeDoc]: true }));
    }
  };

  const handleAccept = (docId: DocId) => {
    setAccepted(prev => ({ ...prev, [docId]: true }));
    // Auto-advance to next doc
    const order: DocId[] = ["hipaa", "medical", "athlynx"];
    const idx = order.indexOf(docId);
    if (idx < order.length - 1) {
      setActiveDoc(order[idx + 1]);
    } else {
      setShowSignature(true);
    }
  };

  const allAccepted = accepted.hipaa && accepted.medical && accepted.athlynx;

  const handleFinalSign = () => {
    if (!signedName.trim()) { setError("Please type your full name to sign."); return; }
    if (!allAccepted) { setError("You must accept all three documents."); return; }
    setError(null);
    saveConsent.mutate({
      hipaaConsent: true,
      medicalWaiver: true,
      athlynxDataWaiver: true,
      consentVersion: CONSENT_VERSION,
      signedName: signedName.trim(),
    });
  };

  const colorMap: Record<string, string> = {
    blue: "text-blue-400 border-blue-500/40 bg-blue-900/20",
    red: "text-red-400 border-red-500/40 bg-red-900/20",
    cyan: "text-cyan-400 border-cyan-500/40 bg-cyan-900/20",
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#050c1a] flex items-center justify-center p-4">
      <div className="bg-[#0d1a3a] border border-blue-700/50 rounded-3xl w-full max-w-2xl max-h-[95vh] flex flex-col shadow-2xl shadow-blue-900/50 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1E90FF] to-[#4169E1] p-5 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-black text-lg leading-tight">Required: Review & Sign</h2>
              <p className="text-blue-100 text-xs">HIPAA + Medical Waiver + Data Rights — required before platform access</p>
            </div>
          </div>
          {/* Progress dots */}
          <div className="flex gap-2 mt-3">
            {DOCS.map((doc) => (
              <button key={doc.id} onClick={() => setActiveDoc(doc.id)}
                className={`flex-1 h-1.5 rounded-full transition-all ${accepted[doc.id] ? "bg-green-400" : activeDoc === doc.id ? "bg-white" : "bg-white/30"}`} />
            ))}
          </div>
        </div>

        {/* Doc tabs */}
        <div className="flex border-b border-blue-900/40 flex-shrink-0 bg-[#0a0f1e]">
          {DOCS.map((doc) => (
            <button key={doc.id} onClick={() => setActiveDoc(doc.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 text-xs font-bold transition-all border-b-2 ${activeDoc === doc.id ? "border-[#1E90FF] text-white" : "border-transparent text-blue-400 hover:text-white"}`}>
              <span className={accepted[doc.id] ? "text-green-400" : ""}>
                {accepted[doc.id] ? <CheckCircle className="w-4 h-4" /> : doc.icon}
              </span>
              <span className="hidden sm:block text-center leading-tight">{doc.title.split(" ").slice(0, 2).join(" ")}</span>
              {accepted[doc.id] && <span className="text-green-400 text-xs">✓ Signed</span>}
            </button>
          ))}
        </div>

        {/* Document content */}
        {!showSignature && (
          <>
            <div className="px-4 pt-3 pb-1 flex-shrink-0">
              <h3 className="text-white font-black text-sm">{DOCS.find(d => d.id === activeDoc)?.title}</h3>
              <p className="text-blue-400 text-xs">{DOCS.find(d => d.id === activeDoc)?.subtitle}</p>
            </div>
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-2 min-h-0"
            >
              <pre className="text-blue-200 text-xs leading-relaxed whitespace-pre-wrap font-sans">
                {DOC_CONTENT[activeDoc]}
              </pre>
              {!scrolled[activeDoc] && (
                <div className="sticky bottom-0 flex items-center justify-center gap-2 py-3 bg-gradient-to-t from-[#0d1a3a] to-transparent">
                  <ChevronDown className="w-4 h-4 text-blue-400 animate-bounce" />
                  <span className="text-blue-400 text-xs">Scroll to bottom to accept</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-blue-900/40 flex-shrink-0">
              {scrolled[activeDoc] && !accepted[activeDoc] ? (
                <button onClick={() => handleAccept(activeDoc)}
                  className="w-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  I Have Read and Accept — {DOCS.find(d => d.id === activeDoc)?.title}
                </button>
              ) : accepted[activeDoc] ? (
                <div className="w-full bg-green-900/30 border border-green-500/40 text-green-400 font-black py-3 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle className="w-5 h-5" /> Accepted ✓
                </div>
              ) : (
                <div className="w-full bg-blue-900/20 border border-blue-700/30 text-blue-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 text-sm">
                  <ChevronDown className="w-4 h-4" /> Scroll through the document to accept
                </div>
              )}
            </div>
          </>
        )}

        {/* Final signature step */}
        {showSignature && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="text-center">
              <div className="text-4xl mb-2">✍️</div>
              <h3 className="text-white font-black text-xl">Final Step: Sign Your Name</h3>
              <p className="text-blue-300 text-sm mt-1">Type your full legal name below to complete your consent. This serves as your digital signature.</p>
            </div>

            {/* Summary of accepted docs */}
            <div className="space-y-2">
              {DOCS.map(doc => (
                <div key={doc.id} className="flex items-center gap-3 bg-green-900/20 border border-green-500/30 rounded-xl p-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <div className="text-white text-sm font-bold">{doc.title}</div>
                    <div className="text-green-400 text-xs">Accepted ✓</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Signature field */}
            <div>
              <label className="block text-blue-300 text-xs font-bold uppercase tracking-widest mb-2">
                Full Legal Name (Digital Signature)
              </label>
              <input
                type="text"
                value={signedName}
                onChange={e => setSignedName(e.target.value)}
                placeholder="Type your full name exactly as it appears on your ID"
                className="w-full bg-[#0a0f1e] border border-blue-700/50 rounded-xl px-4 py-3 text-white placeholder-blue-600 focus:outline-none focus:border-[#1E90FF] text-sm"
              />
            </div>

            <div className="bg-[#0a0f1e] border border-blue-900/40 rounded-xl p-3 text-xs text-blue-400 leading-relaxed">
              By signing, I confirm that I have read, understood, and agreed to the HIPAA Notice of Privacy Practices, AthlynX Medical Data and Athlete Data Rights & GlucoAthlete Device Consent. I understand that this consent is required to use the AthlynX platform and to connect medical devices including Libre 3 Plus and other biosignal devices. My digital signature, IP address, and timestamp will be recorded as legal evidence of this consent.
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-900/20 border border-red-500/30 rounded-xl p-3">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-red-300 text-sm">{error}</span>
              </div>
            )}

            <button
              onClick={handleFinalSign}
              disabled={saveConsent.isPending || !signedName.trim()}
              className="w-full bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white font-black py-4 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
            >
              {saveConsent.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Recording Consent...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Sign & Enter AthlynX
                </>
              )}
            </button>
            <p className="text-center text-blue-500 text-xs">AthlynXAI, Inc. · Be The Legacy. ™ · privacy@athlynx.ai</p>
          </div>
        )}
      </div>
    </div>
  );
}
