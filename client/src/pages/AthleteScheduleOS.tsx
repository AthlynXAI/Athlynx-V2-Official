
import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { Calendar, Clock, Trophy, Users, Mail, ChevronLeft, ChevronRight, MapPin, Tag, Award, Handshake, Megaphone, Share2, Globe } from "lucide-react";

export default function AthleteScheduleOS() {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const renderCalendarDays = () => {
    const totalDays = daysInMonth(currentMonth);
    const startDay = firstDayOfMonth(currentMonth);
    const days = [];

    // Fill leading empty days
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-pre-${i}`} className="p-2 text-gray-600"></div>);
    }

    // Fill days with mock events
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i);
      const dayEvents = getMockEventsForDay(date);

      days.push(
        <div
          key={`day-${i}`}
          className="p-2 border border-blue-700/20 rounded-md flex flex-col items-center justify-start h-24 relative overflow-hidden group hover:bg-blue-900/10 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold text-blue-300">{i}</span>
          <div className="flex flex-wrap gap-1 mt-1 justify-center">
            {dayEvents.map((event, idx) => (
              <Globe key={idx} className={`h-4 w-4 ${event.color}`} fill={event.color} />
            ))}
          </div>
          {dayEvents.length > 0 && (
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center text-xs text-center">
              {dayEvents.map((event, idx) => (
                <p key={idx} className={`font-medium ${event.color}`}>{event.type}</p>
              ))}
            </div>
          )}
        </div>
      );
    }
    return days;
  };

  const getMockEventsForDay = (date: Date) => {
    const events = [];
    const day = date.getDate();
    const month = date.getMonth();

    // Mock events for demonstration
    if (day % 5 === 0) events.push({ type: "Game", color: "text-blue-500" });
    if (day % 3 === 0) events.push({ type: "Practice", color: "text-green-500" });
    if (day % 7 === 0) events.push({ type: "Camp", color: "text-blue-500" });
    if (day % 10 === 0) events.push({ type: "Tournament", color: "text-red-500" });
    if (day % 4 === 0 && day % 8 !== 0) events.push({ type: "NIL", color: "text-cyan-400" });
    if (day % 6 === 0) events.push({ type: "Recruiting", color: "text-purple-500" });

    return events;
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prevMonth) => new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 1));
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const upcomingEvents = [
    {
      date: "June 15, 2026",
      type: "Game",
      description: "vs. Wildcats",
      location: "City Stadium",
      time: "7:00 PM",
      color: "text-blue-500",
      icon: <Globe size={20} />,
    },
    {
      date: "June 18, 2026",
      type: "Practice",
      description: "Team Drills",
      location: "Training Facility",
      time: "4:30 PM",
      color: "text-green-500",
      icon: <Users size={20} />,
    },
    {
      date: "June 22-24, 2026",
      type: "Camp",
      description: "Elite Skills Camp",
      location: "Laurel MS",
      time: "All Day",
      color: "text-blue-500",
      icon: <Trophy size={20} />,
    },
    {
      date: "July 1, 2026",
      type: "NIL Event",
      description: "Autograph Session",
      location: "Local Sports Store",
      time: "2:00 PM",
      color: "text-cyan-400",
      icon: <Handshake size={20} />,
    },
    {
      date: "July 5-7, 2026",
      type: "Tournament",
      description: "Summer Classic",
      location: "Atlanta, GA",
      time: "All Day",
      color: "text-red-500",
      icon: <Award size={20} />,
    },
    {
      date: "July 10, 2026",
      type: "Recruiting",
      description: "Official Visit",
      location: "University of State",
      time: "All Day",
      color: "text-purple-500",
      icon: <Megaphone size={20} />,
    },
    {
      date: "July 12, 2026",
      type: "Practice",
      description: "Conditioning",
      location: "Track",
      time: "6:00 AM",
      color: "text-green-500",
      icon: <Users size={20} />,
    },
    {
      date: "July 20, 2026",
      type: "NIL Event",
      description: "Social Media Post",
      location: "Online",
      time: "10:00 AM",
      color: "text-cyan-400",
      icon: <Share2 size={20} />,
    },
  ];

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white p-4 sm:p-6 lg:p-8">
          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white py-20 px-6 rounded-lg shadow-lg mb-12 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/50 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10 max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-black mb-4 leading-tight">Never Miss a Moment.</h1>
              <p className="text-2xl font-semibold mb-6">Every Game. Every Camp. Every Opportunity.</p>
              <div className="flex justify-center items-center space-x-4">
                <Calendar size={48} strokeWidth={2.5} />
                <Clock size={48} strokeWidth={2.5} />
              </div>
              <p className="mt-8 text-lg font-bold text-blue-200">"Be The Legacy" — AthlynXAI</p>
            </div>
          </section>

          {/* Section 2: Mock Calendar Grid */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Your Weekly Schedule</h2>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-full bg-blue-700/30 hover:bg-blue-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronLeft className="text-blue-300" />
              </button>
              <h3 className="text-xl font-bold text-blue-300">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-full bg-blue-700/30 hover:bg-blue-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <ChevronRight className="text-blue-300" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-blue-300 font-bold mb-4">
              {dayNames.map((day) => (
                <div key={day} className="py-2 bg-[#050c1a] rounded-md">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {renderCalendarDays()}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-blue-500" fill="currentColor" /> Games
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-green-500" fill="currentColor" /> Practices
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-blue-500" fill="currentColor" /> Camps
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-red-500" fill="currentColor" /> Tournaments
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-cyan-400" fill="currentColor" /> NIL
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-purple-500" fill="currentColor" /> Recruiting
              </span>
            </div>
          </section>

          {/* Section 3: Upcoming Events List */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Upcoming Events</h2>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-[#1E90FF] transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className={`${event.color}`}>{event.icon}</span>
                    <div>
                      <p className="text-blue-300 font-bold text-sm">{event.date}</p>
                      <p className="text-lg text-white">
                        <span className="font-semibold">[{event.type}]</span> {event.description} at {event.location}
                      </p>
                    </div>
                  </div>
                  <p className="text-blue-300 font-bold mt-2 sm:mt-0 flex items-center space-x-1">
                    <Clock size={16} /> <span>{event.time}</span>
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Camp and Tournament Hub */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Camp & Tournament Hub</h2>
            <p className="text-blue-300 text-center mb-8">
              Discover and register for upcoming camps and tournaments by sport, age, and location. Elevate your game!
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex flex-col items-center text-center hover:border-cyan-400 transition-colors">
                <Globe size={40} className="text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Basketball Skills Camp</h3>
                <p className="text-blue-300 mb-1">Ages 10-14</p>
                <p className="text-blue-300 flex items-center gap-1"><MapPin size={16} /> Laurel MS</p>
                <button className="mt-4 px-6 py-2 bg-[#1E90FF] rounded-md hover:bg-[#4169E1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Register
                </button>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex flex-col items-center text-center hover:border-cyan-400 transition-colors">
                <Trophy size={40} className="text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Summer Soccer Tournament</h3>
                <p className="text-blue-300 mb-1">U16 Division</p>
                <p className="text-blue-300 flex items-center gap-1"><MapPin size={16} /> Atlanta, GA</p>
                <button className="mt-4 px-6 py-2 bg-[#1E90FF] rounded-md hover:bg-[#4169E1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Details
                </button>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex flex-col items-center text-center hover:border-cyan-400 transition-colors">
                <Users size={40} className="text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Volleyball Prospect Camp</h3>
                <p className="text-blue-300 mb-1">High School Athletes</p>
                <p className="text-blue-300 flex items-center gap-1"><MapPin size={16} /> Laurel MS</p>
                <button className="mt-4 px-6 py-2 bg-[#1E90FF] rounded-md hover:bg-[#4169E1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Register
                </button>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex flex-col items-center text-center hover:border-cyan-400 transition-colors">
                <Award size={40} className="text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Track & Field Invitational</h3>
                <p className="text-blue-300 mb-1">All Ages</p>
                <p className="text-blue-300 flex items-center gap-1"><MapPin size={16} /> Local University</p>
                <button className="mt-4 px-6 py-2 bg-[#1E90FF] rounded-md hover:bg-[#4169E1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  View Info
                </button>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex flex-col items-center text-center hover:border-cyan-400 transition-colors">
                <Tag size={40} className="text-cyan-400 mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">Football Showcase</h3>
                <p className="text-blue-300 mb-1">High School Seniors</p>
                <p className="text-blue-300 flex items-center gap-1"><MapPin size={16} /> State College</p>
                <button className="mt-4 px-6 py-2 bg-[#1E90FF] rounded-md hover:bg-[#4169E1] transition-colors font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Apply Now
                </button>
              </div>
            </div>
          </section>

          {/* Section 5: Recruiting Calendar */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Recruiting Calendar: Key Dates</h2>
            <p className="text-blue-300 text-center mb-8">Stay informed on NCAA recruiting periods to maximize your opportunities.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left table-auto border-collapse">
                <thead>
                  <tr className="bg-[#050c1a] border-b border-blue-700/50">
                    <th className="p-3 text-blue-300 font-bold uppercase text-sm">Period</th>
                    <th className="p-3 text-blue-300 font-bold uppercase text-sm">Start Date</th>
                    <th className="p-3 text-blue-300 font-bold uppercase text-sm">End Date</th>
                    <th className="p-3 text-blue-300 font-bold uppercase text-sm">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-blue-700/30 hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">Official Visits</td>
                    <td className="p-3 text-white">Sept 1, 2026</td>
                    <td className="p-3 text-white">Nov 30, 2026</td>
                    <td className="p-3 text-blue-300 text-sm">Prospective student-athletes can visit campus with expenses paid by the institution. Essential for making informed decisions.</td>
                  </tr>
                  <tr className="border-b border-blue-700/30 hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">Early Signing Period</td>
                    <td className="p-3 text-white">Dec 15, 2026</td>
                    <td className="p-3 text-white">Dec 17, 2026</td>
                    <td className="p-3 text-blue-300 text-sm">High school seniors in certain sports can sign National Letters of Intent (NLI) to commit to a university.</td>
                  </tr>
                  <tr className="border-b border-blue-700/30 hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">Dead Period</td>
                    <td className="p-3 text-white">Dec 18, 2026</td>
                    <td className="p-3 text-white">Jan 14, 2027</td>
                    <td className="p-3 text-blue-300 text-sm">No in-person contact between college coaches and recruits or their parents. Coaches can still communicate via phone/email.</td>
                  </tr>
                  <tr className="border-b border-blue-700/30 hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">Quiet Period</td>
                    <td className="p-3 text-white">Jan 15, 2027</td>
                    <td className="p-3 text-white">Feb 1, 2027</td>
                    <td className="p-3 text-blue-300 text-sm">In-person contact is only permitted on the college campus. Coaches cannot visit recruits off-campus.</td>
                  </tr>
                  <tr className="border-b border-blue-700/30 hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">National Signing Day</td>
                    <td className="p-3 text-white">Feb 2, 2027</td>
                    <td className="p-3 text-white">Feb 2, 2027</td>
                    <td className="p-3 text-blue-300 text-sm">The first day that high school football players can sign a National Letter of Intent.</td>
                  </tr>
                  <tr className="hover:bg-blue-900/10 transition-colors">
                    <td className="p-3 text-white font-medium">Evaluation Period</td>
                    <td className="p-3 text-white">April 15, 2027</td>
                    <td className="p-3 text-white">May 31, 2027</td>
                    <td className="p-3 text-blue-300 text-sm">College coaches can observe recruits in person at their high schools or other designated locations.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6: NIL Event Calendar */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">NIL Event Calendar & Opportunities</h2>
            <p className="text-blue-300 text-center mb-8">Manage your Name, Image, and Likeness (NIL) commitments and discover new opportunities.</p>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <Handshake size={24} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-bold text-sm">July 1, 2026</p>
                    <p className="text-lg text-white">Brand Appearance: <span className="font-semibold">"SportCo" Product Launch</span></p>
                    <p className="text-sm text-blue-400 flex items-center gap-1"><MapPin size={14} /> Downtown Event Hall</p>
                  </div>
                </div>
                <p className="text-blue-300 font-bold mt-2 sm:mt-0 flex items-center space-x-1">
                  <Clock size={16} /> <span>2:00 PM - 4:00 PM</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <Award size={24} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-bold text-sm">July 10, 2026</p>
                    <p className="text-lg text-white">Autograph Session: <span className="font-semibold">Charity Fundraiser</span></p>
                    <p className="text-sm text-blue-400 flex items-center gap-1"><MapPin size={14} /> Community Center</p>
                  </div>
                </div>
                <p className="text-blue-300 font-bold mt-2 sm:mt-0 flex items-center space-x-1">
                  <Clock size={16} /> <span>6:00 PM - 8:00 PM</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <Share2 size={24} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-bold text-sm">July 15, 2026</p>
                    <p className="text-lg text-white">Social Media Post: <span className="font-semibold">"FitnessGear" Promotion</span></p>
                    <p className="text-sm text-blue-400 flex items-center gap-1"><Tag size={14} /> #FitnessGear #AthleteLife</p>
                  </div>
                </div>
                <p className="text-blue-300 font-bold mt-2 sm:mt-0 flex items-center space-x-1">
                  <Clock size={16} /> <span>Scheduled 10:00 AM</span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-cyan-400 transition-colors">
                <div className="flex items-center space-x-3">
                  <Megaphone size={24} className="text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-blue-300 font-bold text-sm">August 5, 2026</p>
                    <p className="text-lg text-white">Podcast Interview: <span className="font-semibold">"Athlete Insights"</span></p>
                    <p className="text-sm text-blue-400 flex items-center gap-1"><MapPin size={14} /> Virtual Studio</p>
                  </div>
                </div>
                <p className="text-blue-300 font-bold mt-2 sm:mt-0 flex items-center space-x-1">
                  <Clock size={16} /> <span>1:00 PM - 2:00 PM</span>
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Calendar Connectors */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Calendar Connectors</h2>
            <p className="text-blue-300 text-center mb-8">Seamlessly sync your AthlynXAI schedule with your favorite calendar services to keep everything in one place.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <button className="flex items-center space-x-3 px-6 py-3 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Globe size={24} className="text-blue-400" />
                <span className="text-white font-semibold">Google Calendar</span>
              </button>
              <button className="flex items-center space-x-3 px-6 py-3 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Globe size={24} className="text-gray-400" />
                <span className="text-white font-semibold">Apple Calendar</span>
              </button>
              <button className="flex items-center space-x-3 px-6 py-3 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Globe size={24} className="text-red-400" />
                <span className="text-white font-semibold">Outlook Sync</span>
              </button>
              <button className="flex items-center space-x-3 px-6 py-3 bg-[#050c1a] rounded-md border border-blue-700/30 hover:border-[#1E90FF] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Calendar size={22} className="text-green-400" />
                <span className="text-white font-semibold">iCal Feed</span>
              </button>
            </div>
          </section>

          {/* Section 8: Smart Reminders */}
          <section className="mb-12 p-6 bg-[#0d1a3a] rounded-lg border border-blue-700/50 shadow-xl">
            <h2 className="text-3xl font-black text-white mb-6 text-center">Smart Reminders & Notifications</h2>
            <p className="text-blue-300 text-center mb-8">Never miss an important event or deadline with personalized, intelligent reminders tailored to your schedule.</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex items-start space-x-4 hover:border-blue-500 transition-colors">
                <Globe size={32} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Customizable Alerts</h3>
                  <p className="text-blue-300">Set reminders for games, practices, and academic deadlines with custom timings, notification methods (push, email, SMS), and priority levels.</p>
                </div>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex items-start space-x-4 hover:border-blue-500 transition-colors">
                <Mail size={32} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Automated Notifications</h3>
                  <p className="text-blue-300">Receive automated email or push notifications for critical recruiting events, NIL opportunities, and important updates from your team or institution.</p>
                </div>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex items-start space-x-4 hover:border-blue-500 transition-colors">
                <Clock size={32} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Time Zone Awareness</h3>
                  <p className="text-blue-300">All events and reminders automatically adjust to your current time zone, ensuring you're always on schedule, no matter where you are.</p>
                </div>
              </div>
              <div className="bg-[#050c1a] p-6 rounded-md border border-blue-700/30 flex items-start space-x-4 hover:border-blue-500 transition-colors">
                <Calendar size={32} className="text-cyan-400 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Event Conflict Detection</h3>
                  <p className="text-blue-300">Intelligent system detects potential scheduling conflicts and alerts you, helping you manage your busy athlete life effectively.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="text-center text-blue-300 text-sm py-6 mt-12 border-t border-blue-700/50">
            <p>Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™</p>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
