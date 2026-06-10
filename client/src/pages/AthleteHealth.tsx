import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Heart, Activity, Brain, Zap, Shield, Star, MapPin, Calendar, CheckCircle, ArrowRight, Users, Phone, Mail, Award, TrendingUp, Target, Thermometer, Dumbbell, Wind, Moon, Sun, Clock, Trophy } from "lucide-react";

const HEALTH_CATEGORIES = [
  { id: "all", label: "All Services" },
  { id: "doctor", label: "Sports Medicine" },
  { id: "trainer", label: "Personal Trainers" },
  { id: "pt", label: "Physical Therapy" },
  { id: "mental", label: "Mental Health" },
  { id: "nutrition", label: "Nutrition" },
  { id: "recovery", label: "Recovery" }
];

const SERVICES = [
  {
    icon: Activity,
    title: "Sports Medicine Doctors",
    desc: "Board-certified sports medicine physicians for injury diagnosis, treatment, and return-to-play clearance.",
    color: "red",
    category: "doctor"
  },
  {
    icon: Dumbbell,
    title: "Elite Personal Trainers",
    desc: "Strength & conditioning coaches who have trained NFL, NBA, and Olympic athletes. Custom programs for your sport.",
    color: "blue",
    category: "trainer"
  },
  {
    icon: Heart,
    title: "Physical Therapists",
    desc: "Licensed PTs specializing in sports injury rehab. ACL, rotator cuff, concussion protocol, and more.",
    color: "green",
    category: "pt"
  },
  {
    icon: Brain,
    title: "Sports Psychologists",
    desc: "Mental performance coaches and licensed therapists. Anxiety, performance pressure, identity, and transition.",
    color: "purple",
    category: "mental"
  },
  {
    icon: Trophy,
    title: "Sports Nutritionists",
    desc: "Registered dietitians who specialize in athlete fueling. Game-day nutrition, weight management, and supplementation.",
    color: "yellow",
    category: "nutrition"
  },
  {
    icon: Moon,
    title: "Recovery Specialists",
    desc: "Sleep optimization, cryotherapy, massage therapy, and biometric recovery tracking.",
    color: "cyan",
    category: "recovery"
  },
  {
    icon: Thermometer,
    title: "Injury Prevention",
    desc: "Proactive screening and movement analysis to identify injury risks before they become career-ending problems.",
    color: "orange",
    category: "doctor"
  },
  {
    icon: Wind,
    title: "Breathing & Mindfulness",
    desc: "Performance breathing techniques, meditation, and mindfulness training for elite focus under pressure.",
    color: "indigo",
    category: "mental"
  }
];

const PROFESSIONALS = [
  {
    name: "Dr. Kevin Osei, MD",
    title: "Sports Medicine Physician",
    category: "doctor",
    location: "Houston, TX",
    rating: 4.9,
    reviews: 312,
    specialties: ["Orthopedic Injuries", "Concussion Protocol", "Return-to-Play", "Regenerative Medicine"],
    credentials: ["Board Certified", "NFL Team Physician", "AMSSM Member"],
    bio: "Former team physician for two NFL franchises. Specializes in non-surgical treatment of sports injuries and regenerative medicine (PRP, stem cell).",
    featured: true,
    available: true,
    telehealth: true
  },
  {
    name: "Coach Alicia Reeves",
    title: "Elite Strength & Conditioning Coach",
    category: "trainer",
    location: "Atlanta, GA",
    rating: 4.8,
    reviews: 189,
    specialties: ["Speed & Explosiveness", "NFL Combine Prep", "In-Season Training", "Youth Development"],
    credentials: ["CSCS", "NSCA Certified", "Former D1 S&C Coach"],
    bio: "Has trained 23 NFL Draft picks and 14 NBA players. Specializes in combine prep and position-specific athleticism development.",
    featured: true,
    available: true,
    telehealth: false
  },
  {
    name: "Dr. Tamara Wells, DPT",
    title: "Sports Physical Therapist",
    category: "pt",
    location: "Los Angeles, CA",
    rating: 4.9,
    reviews: 241,
    specialties: ["ACL Reconstruction", "Shoulder Rehab", "Concussion Management", "Return-to-Sport Testing"],
    credentials: ["DPT", "OCS", "SCS Certified", "NATA Member"],
    bio: "Doctorate in physical therapy with 12 years of experience treating professional athletes. 97% return-to-sport rate for ACL patients.",
    featured: true,
    available: true,
    telehealth: true
  },
  {
    name: "Dr. Marcus Bell, PhD",
    title: "Sports Psychologist",
    category: "mental",
    location: "Virtual / Nationwide",
    rating: 4.9,
    reviews: 156,
    specialties: ["Performance Anxiety", "Identity & Transition", "Team Dynamics", "Mental Toughness"],
    credentials: ["PhD Psychology", "Licensed Psychologist", "AASP Certified"],
    bio: "Works with athletes at every level from high school to professional. Specializes in helping athletes navigate the mental side of competition, injury, and career transitions.",
    featured: false,
    available: true,
    telehealth: true
  },
  {
    name: "Jasmine Torres, RD",
    title: "Sports Dietitian & Nutritionist",
    category: "nutrition",
    location: "Miami, FL",
    rating: 4.8,
    reviews: 203,
    specialties: ["Game-Day Fueling", "Weight Cutting/Gaining", "Supplement Safety", "NIL Brand Nutrition Deals"],
    credentials: ["RD", "CSSD", "ISSN Certified"],
    bio: "Registered dietitian who has worked with Olympic athletes, NFL players, and college programs. Expert in legal supplementation and NCAA compliance.",
    featured: false,
    available: true,
    telehealth: true
  }
];

const INJURY_PREVENTION = [
  { injury: "ACL Tears", prevention: "Neuromuscular training, landing mechanics, and hip strengthening reduce risk by up to 50%." },
  { injury: "Shoulder Injuries", prevention: "Rotator cuff strengthening, scapular stability, and proper throwing mechanics are essential." },
  { injury: "Concussions", prevention: "Proper tackling technique, neck strengthening, and immediate baseline testing." },
  { injury: "Hamstring Strains", prevention: "Nordic curls, proper warm-up protocols, and sprint mechanics training." },
  { injury: "Stress Fractures", prevention: "Bone density monitoring, calcium/Vitamin D optimization, and load management." },
  { injury: "Ankle Sprains", prevention: "Balance training, ankle strengthening, and proper footwear selection." }
];

const MENTAL_HEALTH_STATS = [
  { stat: "35%", desc: "of elite athletes experience anxiety or depression" },
  { stat: "1 in 5", desc: "college athletes report clinical depression symptoms" },
  { stat: "68%", desc: "of athletes who seek help report improved performance" },
  { stat: "0", desc: "stigma — mental health is physical health" }
];

function AthleteHealthInner() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState<"professionals" | "services" | "resources">("professionals");

  const filteredPros = PROFESSIONALS.filter(p =>
    activeCategory === "all" || p.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-full px-4 py-2">
            <Heart className="w-4 h-4 text-red-400" />
            <span className="text-red-300 text-sm font-semibold">AthlynX HEALTH HUB</span>
          </div>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-center mb-3">
          Your Body. <span className="bg-gradient-to-r from-red-400 to-rose-400 bg-clip-text text-transparent">Your Career.</span>
        </h1>
        <p className="text-slate-300 text-center text-lg max-w-2xl mx-auto mb-8">
          Sports medicine doctors, elite trainers, physical therapists, sports psychologists, and nutritionists — everything your body and mind need to perform at the highest level and stay there.
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
          {[
            { value: "1,200+", label: "Health Professionals" },
            { value: "All 50", label: "States + Telehealth" },
            { value: "97%", label: "Return-to-Sport Rate" },
            { value: "Free", label: "Initial Consultation" }
          ].map((s, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black text-red-400">{s.value}</div>
              <div className="text-xs text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center mb-6">
          {(["professionals", "services", "resources"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-sm font-semibold capitalize transition-all ${activeTab === tab ? "bg-red-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        {activeTab === "professionals" && (
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {HEALTH_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${activeCategory === cat.id ? "bg-red-600 text-white" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

        {/* Professionals Tab */}
        {activeTab === "professionals" && (
          <div className="space-y-5">
            {filteredPros.map((pro, i) => (
              <div key={i} className={`bg-white/5 border rounded-2xl p-6 hover:bg-white/10 transition-all ${pro.featured ? "border-red-400/40" : "border-white/10"}`}>
                {pro.featured && (
                  <div className="flex items-center gap-1 text-xs text-blue-300 font-semibold mb-3">
                    <Star className="w-3 h-3 fill-[#1E90FF]" />
                    FEATURED PROFESSIONAL
                  </div>
                )}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">{pro.name}</h3>
                    <p className="text-red-400 text-sm font-semibold">{pro.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400 text-xs">{pro.location}</span>
                      </div>
                      {pro.telehealth && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">Telehealth Available</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${pro.available ? "bg-green-500/20 text-green-400" : "bg-slate-500/20 text-slate-400"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${pro.available ? "bg-green-400" : "bg-slate-400"}`} />
                      {pro.available ? "Available" : "Busy"}
                    </div>
                    <div className="flex items-center gap-1 mt-1 justify-end">
                      <Star className="w-3 h-3 text-blue-300 fill-[#1E90FF]" />
                      <span className="text-white text-sm font-bold">{pro.rating}</span>
                      <span className="text-slate-400 text-xs">({pro.reviews})</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mb-3">
                  {pro.credentials.map((c, j) => (
                    <span key={j} className="flex items-center gap-1 text-xs bg-red-500/20 text-red-300 border border-red-400/30 px-2 py-0.5 rounded-full">
                      <Award className="w-2.5 h-2.5" />{c}
                    </span>
                  ))}
                </div>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{pro.bio}</p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {pro.specialties.map((s, j) => <span key={j} className="text-xs bg-white/10 text-slate-300 px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white text-sm font-bold py-2.5 rounded-xl transition-all">
                    <Calendar className="w-4 h-4" />
                    Book Appointment
                  </button>
                  <button className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-all">
                    <Mail className="w-4 h-4" />
                    Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SERVICES.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all cursor-pointer">
                  <Icon className="w-8 h-8 text-red-400 mb-3" />
                  <h3 className="text-white font-bold mb-2">{svc.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="space-y-8">
            {/* Mental Health Stats */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-2 flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-400" />
                Mental Health Is Performance
              </h2>
              <p className="text-slate-400 text-sm mb-4">The stigma is gone. The data is clear. Mental health directly impacts on-field performance.</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MENTAL_HEALTH_STATS.map((s, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black text-purple-400 mb-1">{s.stat}</div>
                    <div className="text-slate-400 text-xs leading-relaxed">{s.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Injury Prevention */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-400" />
                Injury Prevention Guide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INJURY_PREVENTION.map((item, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4">
                    <h3 className="text-white font-bold text-sm mb-1">{item.injury}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{item.prevention}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-red-900/50 to-rose-900/50 border border-red-400/20 rounded-2xl p-6 sm:p-8 text-center">
          <Heart className="w-10 h-10 text-red-400 mx-auto mb-3" />
          <h3 className="text-xl font-black text-white mb-2">Are You a Sports Health Professional?</h3>
          <p className="text-slate-400 text-sm mb-4 max-w-xl mx-auto">
            Join the AthlynX Health Network and connect with athletes at every level. Offer telehealth consultations, in-person appointments, and digital programs.
          </p>
          <button className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm">
            Apply to Join the Network
          </button>
        </div>
      </div>
    <MobileBottomNav />
    </div>
  );
}

export default function AthleteHealth() {
  return <RouteErrorBoundary><AthleteHealthInner /></RouteErrorBoundary>;
}
