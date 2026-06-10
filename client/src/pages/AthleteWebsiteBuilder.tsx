import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

/**
 * AthlynX ATHLETE WEBSITE BUILDER
 * A DOZIER HOLDINGS GROUP COMPANY
 * 
 * "Build Your Brand, Own Your Future"
 * One Stop Shop For All Your Needs
 */

interface AthleteProfile {
  name: string;
  sport: string;
  position: string;
  school: string;
  graduationYear: string;
  gpa: string;
  height: string;
  weight: string;
  hometown: string;
  bio: string;
  instagram: string;
  twitter: string;
  tiktok: string;
  email: string;
  phone: string;
  highlightVideo: string;
  stats: string;
  achievements: string;
  profileImage: string;
}

const TEMPLATES = [
  {
    id: "recruiting-pro",
    name: "Recruiting Pro",
    description: "Perfect for high school athletes looking to get recruited",
    price: 19.99,
    features: ["Professional layout", "Stats showcase", "Highlight video embed", "Contact form", "Mobile responsive"],
    color: "from-blue-500 to-[#0a1628]",
    preview: "/athlynx-icon.png",
  },
  {
    id: "nil-ready",
    name: "NIL Ready",
    description: "Designed for college athletes monetizing their brand",
    price: 29.99,
    features: ["Brand partnership section", "Social media integration", "NIL deal showcase", "Media kit download", "Analytics dashboard"],
    color: "from-blue-600 to-[#0a1628]",
    popular: true,
    preview: "/athlete-basketball.jpg",
  },
  {
    id: "full-package",
    name: "Full Package",
    description: "Complete solution for serious athletes",
    price: 49.99,
    features: ["Everything in NIL Ready", "Custom domain", "SEO optimization", "Email marketing", "Priority support", "Unlimited updates"],
    color: "from-[#1E90FF] to-[#0a1628]",
    preview: "/athlete-football.jpg",
  },
];

const DEFAULT_PROFILE: AthleteProfile = {
  name: "",
  sport: "Baseball",
  position: "",
  school: "",
  graduationYear: "2026",
  gpa: "",
  height: "",
  weight: "",
  hometown: "",
  bio: "",
  instagram: "",
  twitter: "",
  tiktok: "",
  email: "",
  phone: "",
  highlightVideo: "",
  stats: "",
  achievements: "",
  profileImage: "",
};

function AthleteWebsiteBuilderInner() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [profile, setProfile] = useState<AthleteProfile>(DEFAULT_PROFILE);
  const [step, setStep] = useState<"templates" | "profile" | "preview">("templates");

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep("profile");
    toast.success("Great choice! Now let's build your profile.");
  };

  const handleProfileUpdate = (field: keyof AthleteProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  const handlePreview = () => {
    if (!profile.name || !profile.sport) {
      toast.error("Please fill in at least your name and sport");
      return;
    }
    setStep("preview");
    toast.success("Here's your website preview!");
  };

  const handlePublish = () => {
    toast.success(" Your website is being created! You'll receive an email with your link shortly.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-950 to-slate-900 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <div className="bg-gradient-to-r from-blue-700 to-[#0a1628] rounded-xl p-2">
                <span className="text-2xl"></span>
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">AthlynX</h1>
                <p className="text-blue-500 text-xs">WEBSITE BUILDER</p>
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            {step !== "templates" && (
              <Button
                variant="outline"
                onClick={() => setStep(step === "preview" ? "profile" : "templates")}
                className="border-slate-600 text-slate-300"
              >
                ← Back
              </Button>
            )}
            <Link href="/">
              <Button variant="outline" className="border-blue-600 text-blue-500 hover:bg-blue-600/10">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center gap-4 mb-8">
          {["templates", "profile", "preview"].map((s, i) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step === s
                    ? "bg-gradient-to-r from-blue-600 to-[#0a1628] text-white"
                    : i < ["templates", "profile", "preview"].indexOf(step)
                    ? "bg-[#00C2FF] text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {i < ["templates", "profile", "preview"].indexOf(step) ? "" : i + 1}
              </div>
              {i < 2 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    i < ["templates", "profile", "preview"].indexOf(step)
                      ? "bg-[#00C2FF]"
                      : "bg-slate-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-8 text-sm text-slate-400 mb-8">
          <span className={step === "templates" ? "text-blue-500 font-bold" : ""}>Choose Template</span>
          <span className={step === "profile" ? "text-blue-500 font-bold" : ""}>Build Profile</span>
          <span className={step === "preview" ? "text-blue-500 font-bold" : ""}>Preview & Publish</span>
        </div>
      </div>

      {/* Step 1: Templates */}
      {step === "templates" && (
        <section className="pb-20 px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-[#0a1628] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
              STEP 1
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-500 via-[#1E90FF] to-[#0a1628] bg-clip-text text-transparent">
                Choose Your Template
              </span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Select the perfect template to showcase your athletic brand
            </p>
          </div>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {TEMPLATES.map((template) => (
              <Card
                key={template.id}
                className={`relative bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:scale-105 hover:border-blue-600 ${
                  template.popular ? "ring-2 ring-blue-600" : ""
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                {template.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-[#0a1628] text-white text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <div className={`h-40 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-4`}>
                    <span className="text-6xl"></span>
                  </div>
                  <CardTitle className="text-white">{template.name}</CardTitle>
                  <CardDescription className="text-slate-400">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-4">
                    ${template.price}<span className="text-sm text-slate-400">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6">
                    {template.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                        <span className="text-[#00C2FF]"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className={`w-full bg-gradient-to-r ${template.color}`}>
                    Select Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Step 2: Profile Builder */}
      {step === "profile" && (
        <section className="pb-20 px-4">
          <div className="text-center mb-12">
            <div className="inline-block bg-gradient-to-r from-blue-600 to-[#0a1628] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
              STEP 2
            </div>
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-blue-500 via-[#1E90FF] to-[#0a1628] bg-clip-text text-transparent">
                Build Your Profile
              </span>
            </h1>
            <p className="text-slate-300">Fill in your information to create your athlete website</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardContent className="p-8 space-y-8">
                {/* Basic Info */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> Basic Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Full Name *</Label>
                      <Input
                        value={profile.name}
                        onChange={(e) => handleProfileUpdate("name", e.target.value)}
                        placeholder="John Smith"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Sport *</Label>
                      <select
                        value={profile.sport}
                        onChange={(e) => handleProfileUpdate("sport", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                      >
                        <option>Baseball</option>
                        <option>Basketball</option>
                        <option>Football</option>
                        <option>Soccer</option>
                        <option>Volleyball</option>
                        <option>Softball</option>
                        <option>Track & Field</option>
                        <option>Swimming</option>
                        <option>Tennis</option>
                        <option>Golf</option>
                        <option>Hockey</option>
                        <option>Lacrosse</option>
                        <option>Wrestling</option>
                        <option>Gymnastics</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-slate-300">Position</Label>
                      <Input
                        value={profile.position}
                        onChange={(e) => handleProfileUpdate("position", e.target.value)}
                        placeholder="e.g., Pitcher, Point Guard"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">School</Label>
                      <Input
                        value={profile.school}
                        onChange={(e) => handleProfileUpdate("school", e.target.value)}
                        placeholder="Your school name"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Graduation Year</Label>
                      <select
                        value={profile.graduationYear}
                        onChange={(e) => handleProfileUpdate("graduationYear", e.target.value)}
                        className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
                      >
                        {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                          <option key={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-slate-300">GPA</Label>
                      <Input
                        value={profile.gpa}
                        onChange={(e) => handleProfileUpdate("gpa", e.target.value)}
                        placeholder="3.5"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Physical Stats */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> Physical Stats
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Height</Label>
                      <Input
                        value={profile.height}
                        onChange={(e) => handleProfileUpdate("height", e.target.value)}
                        placeholder="6'2&quot;"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Weight</Label>
                      <Input
                        value={profile.weight}
                        onChange={(e) => handleProfileUpdate("weight", e.target.value)}
                        placeholder="185 lbs"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Hometown</Label>
                      <Input
                        value={profile.hometown}
                        onChange={(e) => handleProfileUpdate("hometown", e.target.value)}
                        placeholder="Dallas, TX"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> About You
                  </h3>
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    placeholder="Tell coaches and brands about yourself, your goals, and what makes you unique..."
                    rows={4}
                    className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-3"
                  />
                </div>

                {/* Social Media */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> Social Media
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label className="text-slate-300">Instagram</Label>
                      <Input
                        value={profile.instagram}
                        onChange={(e) => handleProfileUpdate("instagram", e.target.value)}
                        placeholder="@username"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Twitter/X</Label>
                      <Input
                        value={profile.twitter}
                        onChange={(e) => handleProfileUpdate("twitter", e.target.value)}
                        placeholder="@username"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">TikTok</Label>
                      <Input
                        value={profile.tiktok}
                        onChange={(e) => handleProfileUpdate("tiktok", e.target.value)}
                        placeholder="@username"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> Contact Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">Email</Label>
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => handleProfileUpdate("email", e.target.value)}
                        placeholder="athlete@email.com"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div>
                      <Label className="text-slate-300">Phone</Label>
                      <Input
                        value={profile.phone}
                        onChange={(e) => handleProfileUpdate("phone", e.target.value)}
                        placeholder="(555) 123-4567"
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Highlight Video */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span></span> Highlight Video
                  </h3>
                  <Input
                    value={profile.highlightVideo}
                    onChange={(e) => handleProfileUpdate("highlightVideo", e.target.value)}
                    placeholder="YouTube or Hudl link"
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>

                {/* Stats & Achievements */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span></span> Stats
                    </h3>
                    <textarea
                      value={profile.stats}
                      onChange={(e) => handleProfileUpdate("stats", e.target.value)}
                      placeholder="List your key stats (e.g., Batting Avg: .350, ERA: 2.15)"
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-3"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                      <span></span> Achievements
                    </h3>
                    <textarea
                      value={profile.achievements}
                      onChange={(e) => handleProfileUpdate("achievements", e.target.value)}
                      placeholder="List your awards and achievements"
                      rows={4}
                      className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-3"
                    />
                  </div>
                </div>

                <Button
                  onClick={handlePreview}
                  className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-[#0a1628] hover:from-blue-500 hover:to-[#0a1628]"
                >
                  Preview My Website →
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Step 3: Preview */}
      {step === "preview" && (
        <section className="pb-20 px-4">
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-[#00C2FF] to-[#00C2FF] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
              STEP 3
            </div>
            <h1 className="text-4xl font-black mb-4">
              <span className="bg-gradient-to-r from-[#00C2FF] via-emerald-400 to-[#0a1628] bg-clip-text text-transparent">
                Preview Your Website
              </span>
            </h1>
          </div>

          {/* Preview Frame */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-slate-800 rounded-t-xl p-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#1E90FF]" />
                <div className="w-3 h-3 rounded-full bg-[#1E90FF]" />
                <div className="w-3 h-3 rounded-full bg-[#00C2FF]" />
              </div>
              <div className="flex-1 bg-slate-700 rounded-md px-3 py-1 text-sm text-slate-400">
                {profile.name.toLowerCase().replace(/\s+/g, "-") || "athlete"}.athlynx.ai
              </div>
            </div>
            
            {/* Website Preview */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-b-xl overflow-hidden">
              {/* Hero Section */}
              <div className="relative h-64 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
                    {profile.sport === "Baseball" ? "" : 
                     profile.sport === "Basketball" ? "" :
                     profile.sport === "Football" ? "" : ""}
                  </div>
                  <h1 className="text-4xl font-black text-white">{profile.name || "Your Name"}</h1>
                  <p className="text-xl text-white/80">{profile.position} • {profile.sport}</p>
                  <p className="text-white/60">{profile.school} • Class of {profile.graduationYear}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 grid md:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3"> Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-slate-400">Height:</span> <span className="text-white">{profile.height || "N/A"}</span></div>
                      <div><span className="text-slate-400">Weight:</span> <span className="text-white">{profile.weight || "N/A"}</span></div>
                      <div><span className="text-slate-400">GPA:</span> <span className="text-white">{profile.gpa || "N/A"}</span></div>
                      <div><span className="text-slate-400">Hometown:</span> <span className="text-white">{profile.hometown || "N/A"}</span></div>
                    </div>
                  </div>

                  {profile.bio && (
                    <div className="bg-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3"> About Me</h3>
                      <p className="text-slate-300 text-sm">{profile.bio}</p>
                    </div>
                  )}

                  {profile.stats && (
                    <div className="bg-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3"> Performance Stats</h3>
                      <p className="text-slate-300 text-sm whitespace-pre-line">{profile.stats}</p>
                    </div>
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {profile.highlightVideo && (
                    <div className="bg-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3"> Highlight Reel</h3>
                      <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-4xl"></span>
                      </div>
                    </div>
                  )}

                  {profile.achievements && (
                    <div className="bg-slate-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-bold text-white mb-3"> Achievements</h3>
                      <p className="text-slate-300 text-sm whitespace-pre-line">{profile.achievements}</p>
                    </div>
                  )}

                  <div className="bg-slate-700/50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3"> Connect</h3>
                    <div className="flex gap-3">
                      {profile.instagram && (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-[#0a1628] rounded-lg flex items-center justify-center"></div>
                      )}
                      {profile.twitter && (
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center"></div>
                      )}
                      {profile.tiktok && (
                        <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center"></div>
                      )}
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-[#1E90FF]/20 to-blue-500/20 border border-[#1E90FF]/30 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-3"> Contact Me</h3>
                    <p className="text-slate-300 text-sm mb-2">{profile.email || "email@example.com"}</p>
                    <p className="text-slate-300 text-sm">{profile.phone || "(555) 123-4567"}</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-slate-700 p-4 text-center text-slate-500 text-sm">
                Powered by AthlynX • A Dozier Holdings Group Company
              </div>
            </div>

            {/* Publish Button */}
            <div className="mt-8 text-center">
              <Button
                onClick={handlePublish}
                className="px-12 py-6 text-lg font-bold bg-gradient-to-r from-[#00C2FF] to-[#00C2FF] hover:from-[#00C2FF] hover:to-emerald-400"
              >
                 Publish My Website
              </Button>
              <p className="text-slate-400 text-sm mt-4">
                Your website will be live at <span className="text-[#00C2FF]">{profile.name.toLowerCase().replace(/\s+/g, "-") || "athlete"}.athlynx.ai</span>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-700 py-8 text-center">
        <p className="text-slate-500 text-sm">
          A Dozier Holdings Group Company • AthlynXAI
        </p>
        <p className="text-slate-600 text-xs mt-2">
          "Build Your Brand, Own Your Future"
        </p>
      </footer>
    <MobileBottomNav />
    </div>
  );
}

export default function AthleteWebsiteBuilder() {
  return <RouteErrorBoundary><AthleteWebsiteBuilderInner /></RouteErrorBoundary>;
}
