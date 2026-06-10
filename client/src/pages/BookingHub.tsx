/**
 * AthlynX — Booking Hub
 * Personal booking for Chad A. Dozier + AthlynXAI Corporation organizational scheduling.
 * Uses Google Calendar appointment scheduling (embedded iframe) + direct booking links.
 */
import PlatformLayout from "@/components/PlatformLayout";
import { useState } from "react";
import { Link } from "wouter";

const BOOKING_TYPES = [
  {
    id: "chad-personal",
    title: "Chad A. Dozier",
    subtitle: "Founder · CEO · Chairman — AthlynXAI Corporation",
    emoji: "",
    color: "from-blue-600 to-[#0a1628]",
    badge: "PERSONAL",
    badgeColor: "bg-blue-600",
    description: "Schedule a 1-on-1 with Chad directly. Available for investor meetings, NIL consultations, partnership discussions, and athlete coaching sessions.",
    slots: [
      { label: "30-Min Intro Call", duration: "30 min", icon: "" },
      { label: "1-Hour Strategy Session", duration: "60 min", icon: "" },
      { label: "Investor Meeting", duration: "60 min", icon: "" },
      { label: "NIL Consultation", duration: "45 min", icon: "" },
    ],
    calendarUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1234?gv=true",
    email: "contact@athlynx.ai",
    phone: "Book a call",
  },
  {
    id: "org-booking",
    title: "AthlynXAI Corporation",
    subtitle: "Team Meetings · Partner Demos · Athlete Onboarding",
    emoji: "",
    color: "from-[#1E90FF] to-[#0a1628]",
    badge: "ORGANIZATION",
    badgeColor: "bg-[#1E90FF]",
    description: "Book time with the AthlynXAI team for platform demos, enterprise onboarding, partnership discussions, and team collaboration sessions.",
    slots: [
      { label: "Platform Demo", duration: "30 min", icon: "" },
      { label: "Enterprise Onboarding", duration: "60 min", icon: "" },
      { label: "Partner Discussion", duration: "45 min", icon: "" },
      { label: "Team Collaboration", duration: "60 min", icon: "" },
    ],
    calendarUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ5678?gv=true",
    email: "contact@athlynx.ai",
    phone: "Book a call",
  },
];

export default function BookingHub() {
  const [activeBooking, setActiveBooking] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<typeof BOOKING_TYPES[0] | null>(null);

  const handleBook = (booking: typeof BOOKING_TYPES[0]) => {
    setSelectedType(booking);
    setActiveBooking(booking.id);
    // Open Google Calendar booking in new tab as primary method
    window.open(booking.calendarUrl, "_blank");
  };

  return (
    <PlatformLayout title="Book a Meeting">
      <div className="max-w-4xl mx-auto px-2 py-4 space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-br from-[#0d1b3e] to-[#1a3a8f] rounded-2xl border border-blue-800 p-6 text-center">
          <div className="text-4xl mb-3"></div>
          <h1 className="text-2xl font-black text-white mb-2">Schedule a Meeting</h1>
          <p className="text-blue-300 text-sm max-w-lg mx-auto">
            Book time directly with Chad or the AthlynXAI team. All meetings are confirmed instantly via Google Calendar.
          </p>
          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-blue-400">
            <span className="flex items-center gap-1"> Instant confirmation</span>
            <span className="flex items-center gap-1"> Calendar invite sent</span>
            <span className="flex items-center gap-1"> Secure & private</span>
          </div>
        </div>

        {/* Booking Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BOOKING_TYPES.map(booking => (
            <div key={booking.id} className="bg-[#0d1b3e] rounded-2xl border border-blue-800 overflow-hidden hover:border-blue-600 transition-all">
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${booking.color} p-5`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full text-white ${booking.badgeColor}`}>
                    {booking.badge}
                  </span>
                  <span className="text-2xl">{booking.emoji}</span>
                </div>
                <h2 className="text-white font-black text-lg">{booking.title}</h2>
                <p className="text-white/80 text-xs mt-0.5">{booking.subtitle}</p>
              </div>

              {/* Card Body */}
              <div className="p-5">
                <p className="text-blue-300 text-sm mb-4 leading-relaxed">{booking.description}</p>

                {/* Meeting Types */}
                <div className="space-y-2 mb-5">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Available Meeting Types</div>
                  {booking.slots.map(slot => (
                    <div key={slot.label} className="flex items-center justify-between bg-blue-900/30 rounded-lg px-3 py-2 border border-blue-800/40">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{slot.icon}</span>
                        <span className="text-white text-sm font-semibold">{slot.label}</span>
                      </div>
                      <span className="text-blue-400 text-xs">{slot.duration}</span>
                    </div>
                  ))}
                </div>

                {/* Contact Info */}
                <div className="bg-blue-900/20 rounded-xl p-3 mb-4 border border-blue-800/30">
                  <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">Contact</div>
                  <div className="flex items-center gap-2 text-sm text-blue-200 mb-1">
                    <span></span>
                    <a href={`mailto:${booking.email}`} className="hover:text-white transition-colors">{booking.email}</a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-blue-200">
                    <span></span>
                    <a href={`tel:${booking.phone}`} className="hover:text-white transition-colors">{booking.phone}</a>
                  </div>
                </div>

                {/* Book Button */}
                <button
                  onClick={() => handleBook(booking)}
                  className={`w-full bg-gradient-to-r ${booking.color} text-white font-black py-3.5 rounded-xl text-sm hover:scale-105 transition-all shadow-lg`}
                >
                   Book Now — Opens Google Calendar
                </button>

                {/* Alternative: Email */}
                <a
                  href={`mailto:${booking.email}?subject=Meeting Request — ${booking.title}&body=Hi Chad,%0A%0AI'd like to schedule a meeting to discuss...%0A%0APreferred times:%0A%0AThank you`}
                  className="block text-center text-blue-400 text-xs mt-3 hover:text-white transition-colors"
                >
                  Or send an email request →
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Availability Banner */}
        <div className="bg-[#0d1b3e] rounded-2xl border border-blue-800 p-5">
          <div className="text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">General Availability</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
              <div key={day} className="bg-blue-900/30 rounded-xl p-3 text-center border border-blue-800/40">
                <div className="text-white font-bold text-sm">{day}</div>
                <div className="text-blue-400 text-xs mt-1">9:00 AM</div>
                <div className="text-blue-600 text-xs">— 5:00 PM</div>
                <div className="text-blue-500 text-[10px] mt-1">Central Time</div>
              </div>
            ))}
          </div>
          <div className="mt-3 text-center text-blue-500 text-xs">
            Timezone: GMT-05:00 Central Time (Chicago) · All meetings confirmed via Google Calendar
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Community Feedback", href: "/community-feedback", icon: "" },
            { label: "Partner Portal", href: "/partner-portal", icon: "" },
            { label: "Investor Hub", href: "/investor-hub", icon: "" },
            { label: "Contact", href: "/contact", icon: "" },
          ].map(link => (
            <Link key={link.href} href={link.href}>
              <div className="bg-[#0d1b3e] rounded-xl border border-blue-800 p-3 text-center hover:border-blue-600 hover:bg-blue-900/30 transition-all cursor-pointer">
                <div className="text-2xl mb-1">{link.icon}</div>
                <div className="text-white text-xs font-bold">{link.label}</div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </PlatformLayout>
  );
}
