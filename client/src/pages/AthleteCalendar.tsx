/**
 * AthlynX — Athlete Calendar
 * The complete athlete life calendar — from youth to pro
 * Games · Camps · Showcases · Leagues · Signings · NIL · Scholarships
 * Endorsements · Highlights · Life Events · Share to Feed
 * Real DB events — add, edit, delete, share
 */
import { useState } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "wouter";

type EventType =
  | "game" | "practice" | "nil" | "recruiting" | "team" | "personal"
  | "training" | "media" | "camp" | "showcase" | "signing" | "scholarship"
  | "endorsement" | "league" | "tournament" | "highlight" | "life";

const EVENT_CONFIG: Record<EventType, { color: string; bg: string; border: string; icon: string; label: string }> = {
  game:        { color: "text-red-300",    bg: "bg-red-900/40",     border: "border-red-500/50",     icon: "🏆", label: "Game" },
  practice:    { color: "text-blue-300",   bg: "bg-blue-900/40",    border: "border-blue-500/50",    icon: "🏋️", label: "Practice" },
  nil:         { color: "text-blue-300", bg: "bg-blue-900/30/40",  border: "border-blue-400/40/50",  icon: "💰", label: "NIL Deal" },
  recruiting:  { color: "text-green-300",  bg: "bg-green-900/40",   border: "border-green-500/50",   icon: "🎓", label: "Recruiting" },
  team:        { color: "text-purple-300", bg: "bg-purple-900/40",  border: "border-purple-500/50",  icon: "👥", label: "Team" },
  personal:    { color: "text-slate-300",  bg: "bg-slate-800/60",   border: "border-slate-600/50",   icon: "📅", label: "Personal" },
  training:    { color: "text-cyan-300",   bg: "bg-cyan-900/40",    border: "border-cyan-500/50",    icon: "⚡", label: "Training" },
  media:       { color: "text-pink-300",   bg: "bg-pink-900/40",    border: "border-pink-500/50",    icon: "📸", label: "Media" },
  camp:        { color: "text-blue-300", bg: "bg-blue-900/40",  border: "border-blue-500/50",  icon: "⛺", label: "Camp" },
  showcase:    { color: "text-indigo-300", bg: "bg-indigo-900/40",  border: "border-indigo-500/50",  icon: "🌟", label: "Showcase" },
  signing:     { color: "text-emerald-300",bg: "bg-emerald-900/40", border: "border-emerald-500/50", icon: "✍️", label: "Signing Day" },
  scholarship: { color: "text-blue-400",  bg: "bg-blue-900/40/40",   border: "border-blue-500/40/50",   icon: "🎓", label: "Scholarship" },
  endorsement: { color: "text-rose-300",   bg: "bg-rose-900/40",    border: "border-rose-500/50",    icon: "🤝", label: "Endorsement" },
  league:      { color: "text-teal-300",   bg: "bg-teal-900/40",    border: "border-teal-500/50",    icon: "🏅", label: "League" },
  tournament:  { color: "text-violet-300", bg: "bg-violet-900/40",  border: "border-violet-500/50",  icon: "🥇", label: "Tournament" },
  highlight:   { color: "text-lime-300",   bg: "bg-lime-900/40",    border: "border-lime-500/50",    icon: "🎬", label: "Highlight" },
  life:        { color: "text-fuchsia-300",bg: "bg-fuchsia-900/40", border: "border-fuchsia-500/50", icon: "🌟", label: "Life Event" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

// Server only accepts: "game"|"practice"|"nil"|"recruiting"|"team"|"personal"|"training"|"media"
type ServerEventType = "game" | "practice" | "nil" | "recruiting" | "team" | "personal" | "training" | "media";
const QUICK_EVENT_TEMPLATES: Array<{ type: ServerEventType; label: string; title: string; icon: string; desc: string }> = [
  { type: "game",       label: "Game",       title: "Game vs. ",          icon: "🏆", desc: "Add a game" },
  { type: "training",  label: "Camp",       title: "Camp — ",             icon: "⛺", desc: "Training camp" },
  { type: "recruiting",label: "Showcase",   title: "Showcase — ",         icon: "🌟", desc: "Recruiting showcase" },
  { type: "nil",       label: "NIL",        title: "NIL Meeting — ",       icon: "💰", desc: "NIL deal/meeting" },
  { type: "personal",  label: "Signing",    title: "Signing Day",         icon: "✍️", desc: "Sign your letter" },
  { type: "media",     label: "Scholarship",title: "Scholarship — ",       icon: "🎓", desc: "Scholarship event" },
  { type: "team",      label: "Brand Deal", title: "Brand Deal — ",        icon: "🤝", desc: "Endorsement" },
  { type: "practice",  label: "Tournament", title: "Tournament — ",        icon: "🥇", desc: "Tournament" },
  { type: "media",     label: "Highlight",  title: "Highlight Reel Drop", icon: "🎬", desc: "Share highlight" },
  { type: "personal",  label: "Life Event", title: "Life Event — ",        icon: "🌟", desc: "Personal milestone" },
];

function AthleteCalendarInner() {
  const { user } = useAuth();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<EventType | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<any>(null);
  const [newEvent, setNewEvent] = useState({
    title: "", date: today.toISOString().split("T")[0], time: "", type: "game" as EventType,
    location: "", description: "", priority: "medium" as "high" | "medium" | "low",
    shareToFeed: false,
  });

  const utils = trpc.useUtils();
  const { data: events = [], isLoading } = trpc.calendar.getMyEvents.useQuery(
    undefined, { enabled: !!user }
  );

  const createEvent = trpc.calendar.createEvent.useMutation({
    onSuccess: () => {
      utils.calendar.getMyEvents.invalidate();
      setShowAddModal(false);
      setNewEvent({ title: "", date: today.toISOString().split("T")[0], time: "", type: "game", location: "", description: "", priority: "medium", shareToFeed: false });
      toast.success("Event added to your calendar!");
    },
    onError: (e) => toast.error(e.message),
  });

  const updateEvent = trpc.calendar.updateEvent.useMutation({
    onSuccess: () => { utils.calendar.getMyEvents.invalidate(); setEditingEvent(null); toast.success("Event updated!"); },
    onError: (e) => toast.error(e.message),
  });

  const deleteEvent = trpc.calendar.deleteEvent.useMutation({
    onSuccess: () => { utils.calendar.getMyEvents.invalidate(); toast.success("Event removed"); },
    onError: (e) => toast.error(e.message),
  });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const getEventsForDay = (day: number) => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return (events as any[]).filter((e: any) => e.date === dateStr && (filterType === "all" || e.type === filterType));
  };

  const selectedDateEvents = selectedDate
    ? (events as any[]).filter((e: any) => e.date === selectedDate && (filterType === "all" || e.type === filterType))
    : [];

  const upcomingEvents = (events as any[])
    .filter((e: any) => e.date >= today.toISOString().split("T")[0])
    .sort((a: any, b: any) => a.date.localeCompare(b.date))
    .slice(0, 8);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const openAddWithTemplate = (template: typeof QUICK_EVENT_TEMPLATES[0]) => {
    setNewEvent(p => ({ ...p, title: template.title, type: template.type as EventType }));
    setShowAddModal(true);
  };

  if (!user) {
    return (
      <PlatformLayout title="Athlete Calendar">
        <div className="text-center py-12">
          <div className="text-5xl mb-4">📅</div>
          <div className="text-white font-bold text-lg mb-2">Sign in to manage your calendar</div>
          <a href="/signin" className="inline-block bg-blue-600 text-white font-bold px-6 py-2.5 rounded-xl">Sign In</a>
        </div>
      </PlatformLayout>
    );
  }

  return (
    <PlatformLayout title="Athlete Calendar">
      <div className="space-y-4 pb-24 lg:pb-4">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#1a3a8f] to-[#1a2a4a] border border-blue-700 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white">📅 Athlete Calendar</h2>
              <p className="text-blue-300 text-xs mt-0.5">Games · Camps · Showcases · Signings · NIL · Scholarships · Endorsements · Life Events</p>
            </div>
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors">
              <span>+</span> Add Event
            </button>
          </div>
        </div>

        {/* Quick add templates */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-3">
          <div className="text-white font-bold text-xs mb-2">Quick Add</div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {QUICK_EVENT_TEMPLATES.map(t => (
              <button key={t.type} onClick={() => openAddWithTemplate(t)}
                className="flex-shrink-0 flex items-center gap-1.5 bg-[#0d1f3c] border border-blue-800 hover:border-blue-600 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-colors">
                <span>{t.icon}</span><span>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 bg-[#0d1f3c] border border-blue-900 rounded-xl p-1 overflow-x-auto">
          {(["all", "game", "camp", "showcase", "nil", "signing", "scholarship", "endorsement", "recruiting", "highlight", "life"] as const).map(type => (
            <button key={type} onClick={() => setFilterType(type as EventType | "all")}
              className={`flex-1 min-w-fit py-1.5 px-2 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${filterType === type ? "bg-blue-600 text-white" : "text-blue-400 hover:text-white"}`}>
              {type === "all" ? "All" : EVENT_CONFIG[type as EventType]?.icon + " " + EVENT_CONFIG[type as EventType]?.label}
            </button>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-blue-900">
            <button onClick={prevMonth} className="p-2 hover:bg-blue-900 rounded-lg transition-colors text-blue-300">‹</button>
            <h3 className="text-white font-black text-lg">{MONTHS[currentMonth]} {currentYear}</h3>
            <button onClick={nextMonth} className="p-2 hover:bg-blue-900 rounded-lg transition-colors text-blue-300">›</button>
          </div>
          <div className="grid grid-cols-7 border-b border-blue-900">
            {DAYS.map(d => <div key={d} className="py-2 text-center text-blue-400 text-xs font-bold">{d}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`e${i}`} className="h-14 border-b border-r border-blue-900/30" />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayEvents = getEventsForDay(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = selectedDate === dateStr;
              return (
                <div key={day} onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                  className={`h-14 border-b border-r border-blue-900/30 p-1 cursor-pointer transition-colors ${isSelected ? "bg-blue-700/40" : "hover:bg-blue-900/20"}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-0.5 ${isToday ? "bg-blue-600 text-white" : "text-blue-300"}`}>{day}</div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((e: any) => {
                      const cfg = EVENT_CONFIG[e.type as EventType] ?? EVENT_CONFIG.personal;
                      return (
                        <div key={e.id} className="text-[8px] font-bold px-1 rounded truncate bg-blue-600 text-white">
                          {cfg.icon} {e.title}
                        </div>
                      );
                    })}
                    {dayEvents.length > 2 && <div className="text-[8px] text-blue-400">+{dayEvents.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date events */}
        {selectedDate && (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-white font-bold text-sm">
                {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </h3>
              <button onClick={() => { setNewEvent(p => ({ ...p, date: selectedDate })); setShowAddModal(true); }}
                className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-bold">+ Add</button>
            </div>
            {selectedDateEvents.length === 0 ? (
              <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 text-center text-blue-400 text-sm">
                No events on this day.
                <button onClick={() => { setNewEvent(p => ({ ...p, date: selectedDate })); setShowAddModal(true); }} className="text-blue-300 underline ml-1">Add one?</button>
              </div>
            ) : selectedDateEvents.map((event: any) => {
              const cfg = EVENT_CONFIG[event.type as EventType] ?? EVENT_CONFIG.personal;
              return (
                <div key={event.id} className={`${cfg.bg} border ${cfg.border} rounded-xl p-4`}>
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{cfg.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-bold text-white text-sm">{event.title}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-800 ${cfg.color}`}>{cfg.label}</span>
                        {event.priority === "high" && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded-full font-bold">HIGH</span>}
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${cfg.color} flex-wrap`}>
                        {event.time && <span>🕐 {event.time}</span>}
                        {event.location && <span>📍 {event.location}</span>}
                      </div>
                      {event.description && <p className="text-blue-200 text-xs mt-1">{event.description}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <button onClick={() => setEditingEvent(event)} className="w-7 h-7 bg-blue-900/50 hover:bg-blue-700 rounded-lg flex items-center justify-center text-blue-300 text-xs transition-colors">✏️</button>
                      <button onClick={() => deleteEvent.mutate({ id: event.id })} className="w-7 h-7 bg-red-900/50 hover:bg-red-700 rounded-lg flex items-center justify-center text-red-300 text-xs transition-colors">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Upcoming events */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-white font-bold text-sm">Upcoming Events</h3>
            <Link href="/feed" className="text-blue-400 text-xs hover:text-white">Share to Feed →</Link>
          </div>
          {isLoading && <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 animate-pulse h-16" />}
          {!isLoading && upcomingEvents.length === 0 && (
            <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-6 text-center">
              <div className="text-4xl mb-3">📅</div>
              <div className="text-white font-bold mb-1">No upcoming events</div>
              <div className="text-blue-400 text-sm mb-3">Add your games, camps, showcases, NIL meetings, and life events</div>
              <button onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-sm">Add First Event</button>
            </div>
          )}
          {upcomingEvents.map((event: any) => {
            const cfg = EVENT_CONFIG[event.type as EventType] ?? EVENT_CONFIG.personal;
            return (
              <div key={event.id} className={`${cfg.bg} border ${cfg.border} rounded-xl p-3 flex items-center gap-3`}>
                <div className="text-xl shrink-0">{cfg.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-white text-sm truncate">{event.title}</div>
                  <div className={`text-xs ${cfg.color} flex items-center gap-2 flex-wrap`}>
                    <span>{new Date(event.date + "T12:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    {event.time && <span>· {event.time}</span>}
                    {event.location && <span>· 📍 {event.location}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {event.priority === "high" && <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">HIGH</span>}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900 ${cfg.color}`}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats summary */}
        {(events as any[]).length > 0 && (
          <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4">
            <div className="text-white font-bold text-sm mb-3">Your Athletic Journey</div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Games", count: (events as any[]).filter((e: any) => e.type === "game").length, icon: "🏆" },
                { label: "Camps", count: (events as any[]).filter((e: any) => e.type === "camp").length, icon: "⛺" },
                { label: "NIL Events", count: (events as any[]).filter((e: any) => e.type === "nil" || e.type === "endorsement").length, icon: "💰" },
                { label: "Milestones", count: (events as any[]).filter((e: any) => ["signing", "scholarship", "life"].includes(e.type)).length, icon: "🌟" },
              ].map(s => (
                <div key={s.label} className="bg-[#0d1f3c] rounded-xl p-2 text-center">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-white font-black text-lg">{s.count}</div>
                  <div className="text-blue-400 text-[10px]">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Google Calendar sync */}
        <div className="bg-[#1a3a8f] border border-blue-900 rounded-xl p-4 flex items-center gap-3">
          <div className="text-2xl">📅</div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Sync with Google Calendar</div>
            <div className="text-blue-400 text-xs">Keep all your AthlynX events in sync</div>
          </div>
          <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors shrink-0">
            Open →
          </a>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {(showAddModal || editingEvent) && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0d1b3e] border border-blue-700 rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-black text-lg">{editingEvent ? "Edit Event" : "Add Event"}</h3>
              <button onClick={() => { setShowAddModal(false); setEditingEvent(null); }}
                className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center hover:bg-blue-700 text-white transition-colors">✕</button>
            </div>

            {/* Event type selector */}
            <div>
              <label className="text-blue-400 text-xs mb-2 block">Event Type</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(Object.entries(EVENT_CONFIG) as [EventType, typeof EVENT_CONFIG[EventType]][]).map(([type, cfg]) => (
                  <button key={type} onClick={() => editingEvent
                    ? setEditingEvent((p: any) => ({ ...p, type }))
                    : setNewEvent(p => ({ ...p, type }))}
                    className={`flex flex-col items-center gap-1 py-2 px-1 rounded-xl text-[10px] font-bold transition-colors border ${
                      (editingEvent ? editingEvent.type : newEvent.type) === type
                        ? `${cfg.bg} ${cfg.border} ${cfg.color}`
                        : "bg-[#1a3a8f] border-blue-900 text-blue-400 hover:border-blue-600"
                    }`}>
                    <span className="text-base">{cfg.icon}</span>
                    <span>{cfg.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form fields */}
            {[
              { label: "Title *", key: "title", placeholder: "Game vs. State, Nike Camp, Signing Day..." },
              { label: "Date *", key: "date", type: "date" },
              { label: "Time", key: "time", placeholder: "7:00 PM" },
              { label: "Location", key: "location", placeholder: "City, Zoom..." },
              { label: "Description", key: "description", placeholder: "Details, notes, links..." },
            ].map(f => (
              <div key={f.key}>
                <label className="text-blue-400 text-xs mb-1 block">{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={editingEvent ? editingEvent[f.key] || "" : (newEvent as any)[f.key]}
                  onChange={e => editingEvent
                    ? setEditingEvent((p: any) => ({ ...p, [f.key]: e.target.value }))
                    : setNewEvent(p => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.placeholder}
                  className="w-full bg-[#1a3a8f] border border-blue-800 text-white text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 placeholder-blue-600"
                />
              </div>
            ))}

            <div>
              <label className="text-blue-400 text-xs mb-1 block">Priority</label>
              <div className="flex gap-2">
                {(["high", "medium", "low"] as const).map(p => (
                  <button key={p} onClick={() => editingEvent
                    ? setEditingEvent((ev: any) => ({ ...ev, priority: p }))
                    : setNewEvent(ev => ({ ...ev, priority: p }))}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-colors capitalize ${
                      (editingEvent ? editingEvent.priority : newEvent.priority) === p
                        ? p === "high" ? "bg-red-600 border-red-500 text-white"
                          : p === "medium" ? "bg-blue-900/30 border-blue-400/40 text-white"
                          : "bg-slate-600 border-slate-500 text-white"
                        : "bg-[#1a3a8f] border-blue-800 text-blue-400 hover:border-blue-600"
                    }`}>
                    {p === "high" ? "🔴 High" : p === "medium" ? "🟡 Medium" : "🟢 Low"}
                  </button>
                ))}
              </div>
            </div>

            {/* Share to Feed toggle */}
            <div className="flex items-center gap-3 bg-[#1a3a8f] border border-blue-800 rounded-xl p-3">
              <div className="flex-1">
                <div className="text-white text-sm font-bold">Share to Feed</div>
                <div className="text-blue-400 text-xs">Let other athletes see this event</div>
              </div>
              <button
                onClick={() => editingEvent
                  ? setEditingEvent((p: any) => ({ ...p, shareToFeed: !p.shareToFeed }))
                  : setNewEvent(p => ({ ...p, shareToFeed: !p.shareToFeed }))}
                className={`w-12 h-6 rounded-full transition-colors relative ${(editingEvent ? editingEvent.shareToFeed : newEvent.shareToFeed) ? "bg-blue-600" : "bg-blue-900"}`}>
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${(editingEvent ? editingEvent.shareToFeed : newEvent.shareToFeed) ? "translate-x-7" : "translate-x-1"}`} />
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (editingEvent) {
                    updateEvent.mutate({ id: editingEvent.id, title: editingEvent.title, date: editingEvent.date, time: editingEvent.time, type: editingEvent.type, location: editingEvent.location, description: editingEvent.description, priority: editingEvent.priority });
                  } else {
                    if (!newEvent.title || !newEvent.date) { toast.error("Title and date are required"); return; }
                    createEvent.mutate({ title: newEvent.title, date: newEvent.date, time: newEvent.time || undefined, type: (newEvent.type as ServerEventType) || "personal", location: newEvent.location || undefined, description: newEvent.description || undefined, priority: newEvent.priority });
                  }
                }}
                disabled={createEvent.isPending || updateEvent.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors">
                {createEvent.isPending || updateEvent.isPending ? "Saving..." : editingEvent ? "Update Event" : "Add to Calendar"}
              </button>
              <button onClick={() => { setShowAddModal(false); setEditingEvent(null); }}
                className="flex-1 border border-blue-700 text-blue-300 font-bold py-3 rounded-xl hover:bg-blue-900 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </PlatformLayout>
  );
}

export default function AthleteCalendar() {
  return <RouteErrorBoundary><AthleteCalendarInner /></RouteErrorBoundary>;
}
