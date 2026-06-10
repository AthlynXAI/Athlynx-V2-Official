import { useMemo, useState } from "react";
import { Link } from "wouter";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, UserCheck, FileCheck, Lock, ClipboardCheck, ArrowRight } from "lucide-react";

type IntakePacket = {
  athlete: {
    legalName: string;
    displayName: string;
    email: string;
    phone: string;
    ageBand: string;
    guardianName: string;
    guardianEmail: string;
  };
  sports: {
    primarySport: string;
    positions: string;
    school: string;
    classYear: string;
    height: string;
    weight: string;
    batsThrows: string;
  };
  media: {
    profilePhotoStatus: string;
    highlightFilmStatus: string;
    statSourceStatus: string;
    storyNotes: string;
  };
  consent: {
    nameImageLikeness: boolean;
    publicProfile: boolean;
    mediaVerification: boolean;
    guardianIfMinor: boolean;
    sensitivePrivate: boolean;
    noPrivateIdentifiers: boolean;
  };
  verificationStatus: string;
};

const defaultPacket: IntakePacket = {
  athlete: {
    legalName: "",
    displayName: "",
    email: "",
    phone: "",
    ageBand: "High school / college / adult",
    guardianName: "",
    guardianEmail: "",
  },
  sports: {
    primarySport: "",
    positions: "",
    school: "",
    classYear: "",
    height: "",
    weight: "",
    batsThrows: "",
  },
  media: {
    profilePhotoStatus: "Needs upload",
    highlightFilmStatus: "Needs upload",
    statSourceStatus: "Verified data needed",
    storyNotes: "",
  },
  consent: {
    nameImageLikeness: false,
    publicProfile: false,
    mediaVerification: false,
    guardianIfMinor: false,
    sensitivePrivate: true,
    noPrivateIdentifiers: true,
  },
  verificationStatus: "Draft intake packet",
};

const textInput = "w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400";
const labelStyle = "mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-cyan-200";
const helpStyle = "mt-2 text-xs leading-relaxed text-white/45";

export default function AthleteNILIntake() {
  const [packet, setPacket] = useState<IntakePacket>(defaultPacket);
  const [showPacket, setShowPacket] = useState(false);

  const requiredConsentComplete = useMemo(() => {
    return packet.consent.nameImageLikeness && packet.consent.publicProfile && packet.consent.mediaVerification && packet.consent.sensitivePrivate && packet.consent.noPrivateIdentifiers;
  }, [packet.consent]);

  const update = (section: keyof IntakePacket, key: string, value: string | boolean) => {
    setPacket((current) => ({
      ...current,
      [section]: {
        ...(current[section] as Record<string, unknown>),
        [key]: value,
      },
    }));
  };

  const packetText = JSON.stringify({
    ...packet,
    verificationStatus: requiredConsentComplete ? "Ready for secure review" : "Consent required before review",
    generatedBy: "AthlynXAI OS v1 Athlete NIL Intake",
    storageRule: "Client-side review packet only until secure database and media storage proof pass.",
  }, null, 2);

  const copyPacket = async () => {
    await navigator.clipboard.writeText(packetText);
    setShowPacket(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-blue-950 to-slate-950 text-white">
      <UnifiedNav />
      <main className="px-4 pb-16 pt-24 md:px-6">
        <section className="mx-auto max-w-6xl">
          <div className="mb-8 rounded-[2rem] border border-cyan-400/20 bg-white/[0.04] p-6 shadow-2xl shadow-cyan-950/30 md:p-10">
            <Badge className="mb-4 border-cyan-400/30 bg-cyan-400/10 text-cyan-200">
              <Shield className="mr-2 h-3.5 w-3.5" /> Real NIL intake. Consent first.
            </Badge>
            <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
              Build the athlete NIL record before the world sees the profile.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-relaxed text-white/70 md:text-lg">
              This intake page captures the athlete’s name, image, likeness, sport identity, media source status, consent, guardian review when needed, and verification state. It does not fake a submission. Until the secure database and media-vault proof pass, it prepares a client-side review packet only.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/athlynxai-os">
                <Button className="bg-cyan-400 text-slate-950 hover:bg-cyan-300">Open AthlynXAI OS</Button>
              </Link>
              <Link href="/founder/chad-dozier">
                <Button variant="outline" className="border-cyan-400/40 text-cyan-200 hover:bg-cyan-400/10">View proof profile</Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <UserCheck className="h-6 w-6 text-cyan-300" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Athlete identity</h2>
                    <p className="text-sm text-white/55">Name, contact lane, age band, and guardian review when required.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Legal name" value={packet.athlete.legalName} onChange={(v) => update("athlete", "legalName", v)} />
                  <Field label="Public display name" value={packet.athlete.displayName} onChange={(v) => update("athlete", "displayName", v)} />
                  <Field label="Athlete email" value={packet.athlete.email} onChange={(v) => update("athlete", "email", v)} />
                  <Field label="Phone" value={packet.athlete.phone} onChange={(v) => update("athlete", "phone", v)} />
                  <Field label="Age band" value={packet.athlete.ageBand} onChange={(v) => update("athlete", "ageBand", v)} />
                  <Field label="Guardian name if minor" value={packet.athlete.guardianName} onChange={(v) => update("athlete", "guardianName", v)} />
                  <Field label="Guardian email if minor" value={packet.athlete.guardianEmail} onChange={(v) => update("athlete", "guardianEmail", v)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-cyan-400/20 bg-cyan-400/[0.06]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-5 flex items-center gap-3">
                  <Lock className="h-6 w-6 text-cyan-300" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Privacy gate</h2>
                    <p className="text-sm text-white/55">Public profile only after consent and verification.</p>
                  </div>
                </div>
                <ConsentRow label="Athlete authorizes Name, Image, and Likeness intake review." checked={packet.consent.nameImageLikeness} onChange={(v) => update("consent", "nameImageLikeness", v)} />
                <ConsentRow label="Athlete authorizes approved public profile display after review." checked={packet.consent.publicProfile} onChange={(v) => update("consent", "publicProfile", v)} />
                <ConsentRow label="Athlete authorizes media source verification before publishing." checked={packet.consent.mediaVerification} onChange={(v) => update("consent", "mediaVerification", v)} />
                <ConsentRow label="Guardian review is required if athlete is a minor." checked={packet.consent.guardianIfMinor} onChange={(v) => update("consent", "guardianIfMinor", v)} />
                <ConsentRow label="Sensitive topics stay private unless the athlete approves public use." checked={packet.consent.sensitivePrivate} onChange={(v) => update("consent", "sensitivePrivate", v)} />
                <ConsentRow label="No serial numbers, device identifiers, account details, or private IDs belong in the public profile." checked={packet.consent.noPrivateIdentifiers} onChange={(v) => update("consent", "noPrivateIdentifiers", v)} />
                <div className={`mt-5 rounded-xl border px-4 py-3 text-sm font-bold ${requiredConsentComplete ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-100" : "border-blue-400/40 bg-blue-400/10 text-sky-100"}`}>
                  {requiredConsentComplete ? "Consent gate ready for secure review." : "Consent gate incomplete. Do not publish."}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-cyan-300" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Sport profile</h2>
                    <p className="text-sm text-white/55">Sport, position, school, measurables, and source status.</p>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Primary sport" value={packet.sports.primarySport} onChange={(v) => update("sports", "primarySport", v)} />
                  <Field label="Positions" value={packet.sports.positions} onChange={(v) => update("sports", "positions", v)} />
                  <Field label="School / club / team" value={packet.sports.school} onChange={(v) => update("sports", "school", v)} />
                  <Field label="Class year" value={packet.sports.classYear} onChange={(v) => update("sports", "classYear", v)} />
                  <Field label="Height" value={packet.sports.height} onChange={(v) => update("sports", "height", v)} />
                  <Field label="Weight" value={packet.sports.weight} onChange={(v) => update("sports", "weight", v)} />
                  <Field label="Bats / throws or sport-specific notes" value={packet.sports.batsThrows} onChange={(v) => update("sports", "batsThrows", v)} />
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.04]">
              <CardContent className="p-6 md:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <ClipboardCheck className="h-6 w-6 text-cyan-300" />
                  <div>
                    <h2 className="text-2xl font-black text-white">Media and proof</h2>
                    <p className="text-sm text-white/55">Source media status and story notes before public use.</p>
                  </div>
                </div>
                <div className="grid gap-4">
                  <SelectField label="Profile photo status" value={packet.media.profilePhotoStatus} options={["Needs upload", "Uploaded pending review", "Approved for public profile", "Private only"]} onChange={(v) => update("media", "profilePhotoStatus", v)} />
                  <SelectField label="Highlight film status" value={packet.media.highlightFilmStatus} options={["Needs upload", "Uploaded pending review", "Approved for public profile", "Private only"]} onChange={(v) => update("media", "highlightFilmStatus", v)} />
                  <SelectField label="Stat source status" value={packet.media.statSourceStatus} options={["Verified data needed", "Coach verified", "School verified", "Public source verified", "Private only"]} onChange={(v) => update("media", "statSourceStatus", v)} />
                  <div>
                    <label className={labelStyle}>Story notes</label>
                    <textarea className={`${textInput} min-h-32`} value={packet.media.storyNotes} onChange={(e) => update("media", "storyNotes", e.target.value)} placeholder="What should Coach know before building the profile? Keep sensitive details private unless approved." />
                    <p className={helpStyle}>Do not enter medical records, private identifiers, serial numbers, or account details here.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-5 border-cyan-400/20 bg-slate-950/70">
            <CardContent className="p-6 md:p-8">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-black text-white">Prepare intake packet</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-white/60">
                    This creates a review packet in the browser for owner, athlete, or guardian approval. Secure server submission will be enabled only after database and media storage proof pass.
                  </p>
                </div>
                <Button onClick={copyPacket} className="bg-cyan-400 px-6 font-black text-slate-950 hover:bg-cyan-300">
                  Copy review packet <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
              {showPacket && (
                <pre className="mt-6 max-h-96 overflow-auto rounded-2xl border border-white/10 bg-black/40 p-4 text-xs leading-relaxed text-cyan-100">
                  {packetText}
                </pre>
              )}
            </CardContent>
          </Card>
        </section>
      </main>
      <UnifiedFooter />
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <input className={textInput} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <select className={textInput} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </div>
  );
}

function ConsentRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 bg-slate-950/50 p-3 text-sm leading-relaxed text-white/75">
      <input className="mt-1 h-4 w-4 accent-cyan-400" type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
