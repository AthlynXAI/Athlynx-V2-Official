import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UnifiedNav from "@/components/UnifiedNav";
import UnifiedFooter from "@/components/UnifiedFooter";
import {
  School,
  Palette,
  Globe,
  Shield,
  Trophy,
  Users,
  Building,
  CheckCircle,
  Star,
  Zap,
  Database,
  Lock,
  DollarSign,
  BarChart3,
  Settings,
  ArrowRight,
  Layers,
  Heart,
} from "lucide-react";

const schools = [
  { name: "Alabama Crimson Tide", abbr: "UA", color: "#9E1B32", conference: "SEC" },
  { name: "Ohio State Buckeyes", abbr: "OSU", color: "#BB0000", conference: "Big Ten" },
  { name: "Texas Longhorns", abbr: "UT", color: "#BF5700", conference: "SEC" },
  { name: "Michigan Wolverines", abbr: "UM", color: "#00274C", conference: "Big Ten" },
  { name: "Georgia Bulldogs", abbr: "UGA", color: "#BA0C2F", conference: "SEC" },
  { name: "Notre Dame Fighting Irish", abbr: "ND", color: "#0C2340", conference: "ACC" },
];

const licenseTiers = [
  {
    name: "Starter",
    price: "$49,999",
    period: "/ year",
    color: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-500/30",
    badge: "bg-blue-500/20 text-blue-400",
    icon: School,
    features: [
      "Branded school portal (school.athlynx.ai)",
      "Custom colors & logo",
      "Up to 150 athlete accounts",
      "NIL deal tracking",
      "Basic compliance tools",
      "Email support"
    ]
  },
  {
    name: "Athletic Dept",
    price: "$124,999",
    period: "/ year",
    color: "from-cyan-500/20 to-blue-600/20",
    border: "border-cyan-500/30",
    badge: "bg-cyan-500/20 text-cyan-400",
    icon: Trophy,
    popular: true,
    features: [
      "Everything in Starter",
      "Unlimited athlete accounts",
      "NIL Foundation portal",
      "Donor management system",
      "Recruiting dashboard",
      "Transfer portal integration",
      "Priority support",
      "Compliance officer dashboard"
    ]
  },
  {
    name: "Conference",
    price: "$999,999",
    period: "/ year",
    color: "from-blue-500/20 to-blue-600/20",
    border: "border-blue-400/40/30",
    badge: "bg-blue-900/30/20 text-blue-300",
    icon: Trophy,
    features: [
      "Everything in Athletic Dept",
      "All member schools included",
      "Conference-wide branding",
      "Cross-school analytics",
      "Custom API integrations",
      "Dedicated account manager",
      "White-glove onboarding",
      "Custom feature development"
    ]
  }
];

const brandingFeatures = [
  { icon: Palette, title: "Custom Colors & Logo", desc: "Upload your school's official colors, logo, and mascot. Every page reflects your brand identity." },
  { icon: Globe, title: "Custom Subdomain", desc: "Your athletes access the platform at yourschool.athlynx.ai — fully branded, fully yours." },
  { icon: Shield, title: "NCAA Compliance Built-In", desc: "Every NIL deal, disclosure, and transaction automatically checked against NCAA and state rules." },
  { icon: Database, title: "Own Your Data", desc: "All athlete data generated on your portal belongs to your institution. Full export rights, always." },
  { icon: DollarSign, title: "NIL Foundation Tools", desc: "Manage your school's NIL collective — donor portal, fund distribution, deal approvals." },
  { icon: BarChart3, title: "Analytics Dashboard", desc: "Real-time insights on athlete NIL activity, recruiting pipeline, and platform engagement." },
  { icon: Lock, title: "HIPAA & FERPA Compliant", desc: "All health and academic data protected under federal law. SOC 2 Type II certified infrastructure." },
  { icon: Users, title: "Multi-Role Access", desc: "Athletes, coaches, compliance officers, donors, and administrators — each with their own view." },
];

function SchoolBrandingInner() {
  const [selectedSchool, setSelectedSchool] = useState(schools[0]);
  const [schoolName, setSchoolName] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950">
      <UnifiedNav />

      {/* Hero */}
      <section className="relative pt-24 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent" />
        <div className="container relative px-4 md:px-6 text-center max-w-5xl mx-auto">
          <Badge className="bg-blue-900/30/20 text-blue-300 border-blue-400/40/30 mb-4">
            <Trophy className="w-3 h-3 mr-1" /> WHITE-LABEL LICENSING
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">
            Your School.
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Your Brand. Your Empire.
            </span>
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-3xl mx-auto">
            License the full AthlynX platform for your institution. Every NCAA school, athletic department,
            and NIL foundation gets a fully branded portal — powered by the most advanced athlete
            management software ever built.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold px-8">
              Get Your School's Portal <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Live Preview */}
      <section className="container px-4 md:px-6 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">See Your School's Portal Live</h2>
          <p className="text-white/50">Select a school to preview how their branded portal looks</p>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-3">
            {schools.map((school) => (
              <button
                key={school.abbr}
                onClick={() => setSelectedSchool(school)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                  selectedSchool.abbr === school.abbr
                    ? "border-cyan-500/50 bg-cyan-500/10"
                    : "border-white/10 bg-white/5 hover:border-white/20"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg"
                  style={{ backgroundColor: school.color }}
                >
                  {school.abbr.charAt(0)}
                </div>
                <div className="text-left">
                  <p className="text-white font-semibold">{school.name}</p>
                  <p className="text-white/50 text-sm">{school.conference} · {school.abbr.toLowerCase()}.athlynx.ai</p>
                </div>
                {selectedSchool.abbr === school.abbr && (
                  <CheckCircle className="w-5 h-5 text-cyan-400 ml-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Portal Preview */}
          <Card className="bg-gray-900 border-white/10 overflow-hidden">
            <div className="h-3" style={{ backgroundColor: selectedSchool.color }} />
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl"
                  style={{ backgroundColor: selectedSchool.color }}
                >
                  {selectedSchool.abbr.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-bold">{selectedSchool.name}</p>
                  <p className="text-white/50 text-xs">{selectedSchool.abbr.toLowerCase()}.athlynx.ai</p>
                </div>
                <Badge className="ml-auto text-xs" style={{ backgroundColor: selectedSchool.color + "33", color: selectedSchool.color }}>
                  POWERED BY AthlynX
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {["NIL Deals", "Athletes", "Funds Raised"].map((stat, i) => (
                  <div key={i} className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-white font-bold text-lg">{["$2.4M", "847", "$890K"][i]}</p>
                    <p className="text-white/50 text-xs">{stat}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                {["NIL Marketplace", "Transfer Portal", "Recruiting Hub", "NIL Foundation"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedSchool.color }} />
                    <span className="text-white/70 text-sm">{item}</span>
                    <ArrowRight className="w-4 h-4 text-white/30 ml-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Branding Features */}
      <section className="container px-4 md:px-6 pb-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-3">Everything Your School Needs</h2>
          <p className="text-white/50 max-w-2xl mx-auto">One platform. Fully branded. Infinitely powerful.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {brandingFeatures.map((feature, i) => (
            <Card key={i} className="bg-white/5 border-white/10 hover:border-cyan-500/30 transition-all">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-white/50 text-sm">{feature.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Licensing Tiers */}
      <section className="container px-4 md:px-6 pb-16">
        <div className="text-center mb-10">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mb-4">
            <DollarSign className="w-3 h-3 mr-1" /> LICENSING TIERS
          </Badge>
          <h2 className="text-3xl font-black text-white mb-3">License the Platform</h2>
          <p className="text-white/50 max-w-2xl mx-auto">
            From individual schools to entire conferences — AthlynX scales with your ambition.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {licenseTiers.map((tier, i) => (
            <Card key={i} className={`bg-gradient-to-br ${tier.color} ${tier.border} border relative`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-cyan-500 text-white border-0 px-4">MOST POPULAR</Badge>
                </div>
              )}
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <tier.icon className="w-6 h-6 text-white" />
                  <Badge className={tier.badge}>{tier.name}</Badge>
                </div>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-white">{tier.price}</span>
                  <span className="text-white/50 mb-1">{tier.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-white/80">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Data Ownership Statement */}
      <section className="container px-4 md:px-6 pb-16">
        <Card className="bg-gradient-to-r from-gray-900 to-gray-800 border-white/10">
          <CardContent className="p-10 text-center">
            <Database className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-3xl font-black text-white mb-4">
              "Own the Data. Own the World."
            </h2>
            <p className="text-white/60 max-w-3xl mx-auto text-lg mb-6">
              Every athlete on your branded AthlynX portal generates valuable data — NIL deal history,
              recruiting activity, performance metrics, and financial transactions. Your institution
              retains full ownership and export rights to all data generated on your portal.
              AthlynX is the vault. You hold the keys.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {[
                { icon: Lock, title: "You Own It", desc: "Full data ownership rights for your institution" },
                { icon: Shield, title: "We Protect It", desc: "Military-grade encryption, HIPAA & FERPA compliant" },
                { icon: Heart, title: "Athletes Control It", desc: "Athletes decide what to share and with whom" }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-bold mb-1">{item.title}</h3>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA */}
      <section className="container px-4 md:px-6 pb-20">
        <div className="text-center">
          <h2 className="text-3xl font-black text-white mb-4">Ready to License AthlynX for Your School?</h2>
          <p className="text-white/50 mb-8">Join the institutions already building the future of college athletics.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Input
              placeholder="Enter your school name..."
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
            />
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold whitespace-nowrap">
              Request Demo
            </Button>
          </div>
        </div>
      </section>

      <UnifiedFooter />
    </div>
  );
}

export default function SchoolBranding() {
  return <RouteErrorBoundary><SchoolBrandingInner /></RouteErrorBoundary>;
}
