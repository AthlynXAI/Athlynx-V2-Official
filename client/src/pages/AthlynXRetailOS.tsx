import DashboardLayout from "@/components/DashboardLayout";
import MobileBottomNav from "@/components/MobileBottomNav";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import { ShoppingBag, Star, Award, Clock, Users, Store, DollarSign, BookOpen, TrendingUp, Zap, Globe, Trophy } from "lucide-react";

export default function AthlynXRetailOS() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date("2026-12-25T00:00:00Z") - +new Date();
      let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      return timeLeft;
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <RouteErrorBoundary>
      <DashboardLayout>
        <div className="min-h-screen bg-[#050c1a] text-white">
          {/* Hero Section */}
          <section className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-[#1E90FF] to-[#4169E1] text-white p-8">
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-black mb-4 flex items-center justify-center gap-4">
                Wear The Legacy. Be The Legacy.
                <ShoppingBag size={64} />
                <Star size={64} />
              </h1>
              <p className="text-xl md:text-2xl font-bold text-blue-300">
                AthlynX Retail OS: Your gateway to exclusive merchandise and brand partnerships.
              </p>
            </div>
          </section>

          {/* AthlynX Be The Legacy Apparel Line */}
          <section className="py-16 px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12">AthlynX Be The Legacy Apparel Line</h2>
            <p className="text-center text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
              Discover our core collection, crafted for performance, comfort, and style. Each piece embodies the AthlynX spirit.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Legacy Hoodie</h3>
                <p className="text-blue-300 text-sm mb-4">Premium cotton blend, brushed fleece interior, embroidered AthlynX logo on chest and sleeve. Designed for ultimate comfort and lasting durability, perfect for pre-game focus or post-workout relaxation. Available in multiple colors and sizes.</p>
                <p className="text-xl font-bold text-white">$79.99</p>
                <Link href="/shop/hoodie" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Elite Performance Tee</h3>
                <p className="text-blue-300 text-sm mb-4">Lightweight, moisture-wicking fabric with four-way stretch. Engineered to keep you cool and dry during intense training sessions. Features reflective AthlynX branding for visibility. Ideal for running, gym workouts, and competitive sports.</p>
                <p className="text-xl font-bold text-white">$34.99</p>
                <Link href="/shop/performance-tee" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Signature Snapback</h3>
                <p className="text-blue-300 text-sm mb-4">Classic six-panel design with an adjustable snap closure for a perfect fit. Features a raised 3D embroidered AthlynX logo on the front. Made from durable, breathable material for all-day comfort. A timeless accessory for any fan.</p>
                <p className="text-xl font-bold text-white">$29.99</p>
                <Link href="/shop/snapback" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Training Shorts</h3>
                <p className="text-blue-300 text-sm mb-4">Engineered for maximum mobility and breathability, these shorts feature a lightweight, quick-dry fabric and an elastic waistband with an internal drawstring. Perfect for intense workouts, casual wear, or any activity requiring unrestricted movement.</p>
                <p className="text-xl font-bold text-white">$49.99</p>
                <Link href="/shop/training-shorts" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Performance Socks (3-Pack)</h3>
                <p className="text-blue-300 text-sm mb-4">Cushioned for impact absorption and designed with arch support to reduce foot fatigue. Made with breathable mesh panels to keep your feet cool and dry. Essential for athletes seeking comfort and protection during long training sessions.</p>
                <p className="text-xl font-bold text-white">$19.99</p>
                <Link href="/shop/socks" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
                <Trophy size={48} className="text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">AthlynX Water Bottle</h3>
                <p className="text-blue-300 text-sm mb-4">Durable, BPA-free water bottle with a leak-proof design and easy-grip surface. Features a wide mouth for easy cleaning and ice insertion. Stay hydrated and represent the legacy wherever you go. Capacity: 750ml.</p>
                <p className="text-xl font-bold text-white">$14.99</p>
                <Link href="/shop/water-bottle" className="mt-4 inline-block bg-[#1E90FF] hover:bg-[#4169E1] text-white font-bold py-2 px-4 rounded transition-colors duration-300">View Details</Link>
              </div>
            </div>
          </section>

          {/* Athlete Co-Brand Collections */}
          <section className="py-16 px-8 bg-[#050c1a]">
            <h2 className="text-4xl font-black text-white text-center mb-12">Athlete Co-Brand Collections</h2>
            <p className="text-center text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
              AthlynX empowers athletes to launch their own merchandise lines, backed by our robust retail OS.
              We handle the logistics, so athletes can focus on their legacy and connect directly with their fans.
            </p>
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Award size={32} className="text-cyan-400" /> Revenue Split & Benefits
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-[#050c1a]">
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Partner</th>
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Revenue Share</th>
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Key Benefits</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">Athlete</td>
                      <td className="p-3 border-b border-blue-700/50 text-green-400 font-bold">70%</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Creative Control, High Profit Share, Global Distribution, Fan Engagement</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">AthlynX</td>
                      <td className="p-3 border-b border-blue-700/50 text-red-400 font-bold">30%</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Platform, Production, Fulfillment, Marketing Support, Customer Service</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-blue-300 mt-4">Transparent and athlete-first revenue sharing model, designed for mutual growth and success. Join our roster of elite athletes today!</p>
              <Link href="/athlete-partnerships" className="mt-6 inline-block bg-cyan-400 hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded transition-colors duration-300">Become a Partner</Link>
            </div>
          </section>

          {/* Limited Edition Drops */}
          <section className="py-16 px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12">Limited Edition Drops</h2>
            <p className="text-center text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
              Exclusive releases tied to major sports moments, cultural events, or athlete milestones. Don\'t miss out on history in the making – these items are truly unique and available for a limited time only.
            </p>
            <div className="max-w-md mx-auto bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 text-center">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                <Clock size={32} className="text-cyan-400" /> Next Drop In:
              </h3>
              <div className="flex justify-center items-center space-x-4 text-4xl font-black text-white">
                <div>
                  <span>{timeLeft.days < 10 ? '0' + timeLeft.days : timeLeft.days}</span>
                  <span className="block text-sm font-normal text-blue-300">Days</span>
                </div>
                <span>:</span>
                <div>
                  <span>{timeLeft.hours < 10 ? '0' + timeLeft.hours : timeLeft.hours}</span>
                  <span className="block text-sm font-normal text-blue-300">Hours</span>
                </div>
                <span>:</span>
                <div>
                  <span>{timeLeft.minutes < 10 ? '0' + timeLeft.minutes : timeLeft.minutes}</span>
                  <span className="block text-sm font-normal text-blue-300">Minutes</span>
                </div>
                <span>:</span>
                <div>
                  <span>{timeLeft.seconds < 10 ? '0' + timeLeft.seconds : timeLeft.seconds}</span>
                  <span className="block text-sm font-normal text-blue-300">Seconds</span>
                </div>
              </div>
              <p className="text-sm text-blue-300 mt-4">Stay tuned for our next exclusive release! Follow us on social media for announcements.</p>
              <Link href="/limited-drops" className="mt-6 inline-block bg-cyan-400 hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded transition-colors duration-300">Explore Past Drops</Link>
            </div>
          </section>

          {/* Custom Team Gear */}
          <section className="py-16 px-8 bg-[#050c1a]">
            <h2 className="text-4xl font-black text-white text-center mb-12">Custom Team Gear</h2>
            <p className="text-center text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
              Outfit your team, school, or club with custom AthlynX-branded gear. Elevate your unity, performance, and team spirit with high-quality, customizable apparel and accessories.
            </p>
            <div className="max-w-4xl mx-auto bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Users size={32} className="text-cyan-400" /> Bulk Pricing & Customization
              </h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left table-auto">
                  <thead>
                    <tr className="bg-[#050c1a]">
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Quantity</th>
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Discount</th>
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Per Item Price (Est.)</th>
                      <th className="p-3 border-b border-blue-700/50 text-blue-300">Customization Options</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">1-10</td>
                      <td className="p-3 border-b border-blue-700/50">0%</td>
                      <td className="p-3 border-b border-blue-700/50">Standard</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Basic Logo Placement</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">11-50</td>
                      <td className="p-3 border-b border-blue-700/50">10%</td>
                      <td className="p-3 border-b border-blue-700/50">-$5 to -$8</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Team Name, Numbers</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">51-100</td>
                      <td className="p-3 border-b border-blue-700/50">15%</td>
                      <td className="p-3 border-b border-blue-700/50">-$8 to -$12</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Full Custom Design, Multiple Placements</td>
                    </tr>
                    <tr>
                      <td className="p-3 border-b border-blue-700/50">100+</td>
                      <td className="p-3 border-b border-blue-700/50">20%+</td>
                      <td className="p-3 border-b border-blue-700/50">Negotiable</td>
                      <td className="p-3 border-b border-blue-700/50 text-blue-300">Dedicated Design Consultant, Premium Options</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-blue-300 mt-4">Contact us for a custom quote and design consultation for your team\'s unique needs.</p>
              <Link href="/custom-team-gear" className="mt-6 inline-block bg-cyan-400 hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded transition-colors duration-300">Get a Custom Quote</Link>
            </div>
          </section>

          {/* Retail Partners section */}
          <section className="py-16 px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12">Retail Partners</h2>
            <p className="text-center text-lg text-blue-300 mb-8 max-w-3xl mx-auto">
              Find AthlynX merchandise at our official online store and through our trusted retail partners. We\'re expanding our global reach to bring the legacy closer to you.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 max-w-6xl mx-auto">
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 flex flex-col items-center justify-center w-48 h-32">
                <Store size={48} className="text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">AthlynX Official Store</p>
                <Link href="/shop" className="text-blue-300 text-sm hover:text-cyan-400">Shop Now</Link>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 flex flex-col items-center justify-center w-48 h-32">
                <Globe size={48} className="text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">Global Retailer A</p>
                <p className="text-blue-300 text-sm">Online & In-Store</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 flex flex-col items-center justify-center w-48 h-32">
                <Globe size={48} className="text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">Sports Mart B</p>
                <p className="text-blue-300 text-sm">Exclusive Collection</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 flex flex-col items-center justify-center w-48 h-32">
                <Globe size={48} className="text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">Fitness Hub C</p>
                <p className="text-blue-300 text-sm">Training Gear</p>
              </div>
              <div className="bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50 flex flex-col items-center justify-center w-48 h-32">
                <Globe size={48} className="text-cyan-400 mb-2" />
                <p className="text-xl font-bold text-white">Local Boutique D</p>
                <p className="text-blue-300 text-sm">Limited Drops</p>
              </div>
            </div>
          </section>

          {/* Merchandise Revenue Model */}
          <section className="py-16 px-8 bg-[#050c1a]">
            <h2 className="text-4xl font-black text-white text-center mb-12">Merchandise Revenue Model</h2>
            <div className="max-w-3xl mx-auto bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <DollarSign size={32} className="text-cyan-400" /> How AthlynX Earns Sustainably
              </h3>
              <p className="text-blue-300 mb-4 leading-relaxed">
                AthlynX generates revenue from retail through a sustainable model that prioritizes athlete empowerment and brand integrity.
                We focus on quality merchandise, ethical production, and strategic partnerships, ensuring fair revenue splits without resorting to traditional advertising on athletes or intrusive marketing tactics.
                Our earnings primarily come from a percentage of sales from both our own AthlynX branded apparel and the co-branded athlete collections, typically a 30% share as outlined in our partnership agreements.
              </p>
              <p className="text-blue-300 mb-4 leading-relaxed">
                This model allows us to continuously invest in cutting-edge design, advanced material research, platform development, and robust global distribution networks. More importantly, it enables us to support the next generation of athletes through various development programs and community initiatives, fostering a true ecosystem of growth.
              </p>
              <p className="text-blue-300 leading-relaxed">
                Our business philosophy is built on mutual success: when athletes thrive, AthlynX thrives. We believe in building enduring legacies, not just selling products. This approach ensures long-term viability and a positive impact on the sports community.
              </p>
              <Link href="/investor-relations" className="mt-6 inline-block bg-cyan-400 hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded transition-colors duration-300">Learn More for Investors</Link>
            </div>
          </section>

          {/* Brand Story */}
          <section className="py-16 px-8">
            <h2 className="text-4xl font-black text-white text-center mb-12">Brand Story: Be The Legacy.</h2>
            <div className="max-w-3xl mx-auto bg-[#0d1a3a] p-6 rounded-lg shadow-lg border border-blue-700/50">
              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen size={32} className="text-cyan-400" /> More Than Just Sports, It\'s a Movement
              </h3>
              <p className="text-blue-300 mb-4 leading-relaxed">
                "Be The Legacy" is more than a tagline; it\'s a philosophy that permeates every aspect of AthlynX. It\'s about the profound impact you leave on the world, the unwavering standards you set for yourself and others,
                and the inspiring future you help to create. AthlynX was founded on the core principle that true greatness extends far beyond mere athletic achievements or scoreboard victories.
              </p>
              <p className="text-blue-300 mb-4 leading-relaxed">
                It\'s deeply rooted in the relentless dedication, the unyielding resilience in the face of adversity, the invaluable mentorship you provide to aspiring talents, and the profound positive influence you exert on your community and beyond.
                Our merchandise serves as a tangible symbol of this unwavering commitment.
              </p>
              <p className="text-blue-300 leading-relaxed">
                When you choose to wear AthlynX, you\'re not merely donning a piece of apparel; you\'re actively embodying a powerful movement. You\'re making a clear declaration of your intention to build something lasting, to inspire countless others,
                and to leave an indelible, positive mark on the world. Join us in this journey, and together, let\'s truly Be The Legacy.
              </p>
              <Link href="/our-mission" className="mt-6 inline-block bg-cyan-400 hover:bg-[#1E90FF] text-white font-bold py-2 px-4 rounded transition-colors duration-300">Discover Our Mission</Link>
            </div>
          </section>

          {/* Call to Action Section */}
          <section className="py-16 px-8 bg-gradient-to-r from-[#4169E1] to-[#1E90FF] text-white text-center">
            <h2 className="text-4xl font-black mb-4">Ready to Be The Legacy?</h2>
            <p className="text-xl text-blue-100 mb-8">Explore our collections, partner with us, or customize your team\'s gear.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/shop" className="bg-white text-[#1E90FF] hover:bg-gray-200 font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg">
                Shop AthlynX Gear
              </Link>
              <Link href="/athlete-partnerships" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#1E90FF] font-bold py-3 px-8 rounded-full transition-colors duration-300 text-lg shadow-lg">
                Partner with Us
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-[#0d1a3a] py-8 px-8 text-center text-blue-300 border-t border-blue-700/50">
            <p className="text-sm">
              Copyright © 2026 Chad A. Dozier Sr. / AthlynXAI. All rights reserved. Be The Legacy.™
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <Link href="/privacy" className="text-blue-300 hover:text-cyan-400 text-sm">Privacy Policy</Link>
              <span className="text-blue-300 text-sm">|</span>
              <Link href="/terms" className="text-blue-300 hover:text-cyan-400 text-sm">Terms of Service</Link>
              <span className="text-blue-300 text-sm">|</span>
              <Link href="/contact" className="text-blue-300 hover:text-cyan-400 text-sm">Contact Us</Link>
            </div>
          </footer>
        </div>
        <MobileBottomNav />
      </DashboardLayout>
    </RouteErrorBoundary>
  );
}
