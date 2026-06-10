import { useState, useMemo } from "react";
import { RouteErrorBoundary } from "@/components/GlobalErrorBoundary";
import PlatformLayout from "@/components/PlatformLayout";
import MobileBottomNav from '@/components/MobileBottomNav'
import { Link } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ContactSalesModal } from "@/components/ContactSalesModal";

interface LocalCartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  image: string;
  category: string;
  description?: string;
}

// Static products for display (will be synced to DB)
const staticProducts = [
  // ENTERPRISE HARDWARE - Supermicro Servers (ICC Partnership)
  { id: 101, sku: "SM-4U-60BAY", name: "Supermicro 4U 60-Bay Storage Server", category: "enterprise", price: 38793.44, image: "/img-server-rack.jpg", rating: 5.0, reviews: 12, description: "Intel Xeon 6521P, 128GB DDR5, 60x 30TB HDD capacity", requiresQuote: false },
  { id: 102, sku: "SM-2U-8BAY", name: "Custom Server — 2U Silver (256GB)", category: "enterprise", price: 15313.11, image: "/img-server-rack.jpg", rating: 4.9, reviews: 28, description: "Supermicro 2U · Intel Xeon Silver 4514Y · 256GB DDR5", requiresQuote: false },
  { id: 103, sku: "SM-2U-HP", name: "Supermicro 2U High-Performance Server", category: "enterprise", price: 22516.88, image: "/img-server-rack.jpg", rating: 5.0, reviews: 8, description: "Dual Xeon, 160GB RAM, 7.68TB NVMe per bay", requiresQuote: false },
  { id: 104, sku: "NV-CX7-VPI", name: "NVIDIA ConnectX-7 VPI Adapter", category: "enterprise", price: 1299.99, image: "/img-hardware.jpg", rating: 4.9, reviews: 45, description: "200Gb/s NDR Infiniband & 200GbE, 2xQSFP", requiresQuote: false },
  { id: 105, sku: "SG-EXOS-30TB", name: "Seagate Exos M 3+ 30TB HDD", category: "enterprise", price: 549.99, image: "/img-hardware.jpg", rating: 4.8, reviews: 156, description: "Enterprise 3.5\" 7200RPM SATA drive", requiresQuote: false },
  { id: 106, sku: "MC-7500-7TB", name: "Micron 7500 PRO 7.68TB NVMe", category: "enterprise", price: 899.99, image: "/img-hardware.jpg", rating: 4.9, reviews: 89, description: "U.3 PCIe 4.0 enterprise SSD", requiresQuote: false },
  { id: 107, sku: "INT-XEON-6521P", name: "Intel Xeon 6521P Processor", category: "enterprise", price: 2499.99, image: "/img-hardware.jpg", rating: 5.0, reviews: 34, description: "24C/48T, 2.60GHz, 144MB cache, LGA4710", requiresQuote: false },
  { id: 108, sku: "DDR5-32GB-ECC", name: "32GB DDR5 6400MHz ECC RAM", category: "enterprise", price: 189.99, image: "/economic-vision.png", rating: 4.8, reviews: 267, description: "Registered ECC memory module", requiresQuote: false },

  // SOFTWARE & LICENSES
  { id: 201, sku: "ATH-PRO-ANN", name: "AthlynX Pro Subscription (Annual)", category: "software", price: 99.99, image: "/img-ai-software.jpg", rating: 4.9, reviews: 1245, description: "50 AI credits/mo, video highlights, analytics", requiresQuote: false },
  { id: 202, sku: "ATH-ELITE-ANN", name: "AthlynX Elite Subscription (Annual)", category: "software", price: 299.99, image: "/img-ai-software.jpg", rating: 5.0, reviews: 567, description: "200 AI credits/mo, AI coach, scout access", requiresQuote: false },
  { id: 203, sku: "ATH-ENT-LIC", name: "AthlynX Enterprise License", category: "software", price: 999.99, image: "/img-ai-software.jpg", rating: 5.0, reviews: 23, description: "Unlimited credits, white-label, API access", requiresQuote: false },
  { id: 204, sku: "AI-CRED-100", name: "AI Credits Pack — 100 Credits", category: "software", price: 9.99, image: "/img-ai-software.jpg", rating: 4.7, reviews: 2341, description: "Use for training plans, video analysis, recruiting", requiresQuote: false },
  { id: 205, sku: "AI-CRED-500", name: "AI Credits Pack — 500 Credits", category: "software", price: 39.99, image: "/economic-vision.png", rating: 4.8, reviews: 1567, description: "Includes 50 bonus credits", requiresQuote: false },
  { id: 206, sku: "AI-CRED-1K", name: "AI Credits Pack — 1,000 Credits", category: "software", price: 69.99, image: "/economic-vision.png", rating: 4.9, reviews: 892, description: "Includes 150 bonus credits", requiresQuote: false },
  { id: 207, sku: "AI-CRED-5K", name: "AI Credits Pack — 5,000 Credits", category: "software", price: 299.99, image: "/img-ai-software.jpg", rating: 5.0, reviews: 234, description: "Includes 1,000 bonus credits", requiresQuote: false },
  { id: 208, sku: "WL-SPORT-APP", name: "White-Label Sport App License", category: "software", price: 4999.99, image: "/img-ai-software.jpg", rating: 5.0, reviews: 12, description: "Your brand, our platform - per sport", requiresQuote: true },
  { id: 209, sku: "SOFT-AI-ENT", name: "Softmor AI Enterprise Suite", category: "software", price: 9999.99, image: "/img-ai-software.jpg", rating: 5.0, reviews: 8, description: "Full AI/ML platform license", requiresQuote: true },

  // DATA CENTER PACKAGES
  { id: 301, sku: "DC-STARTER", name: "Starter Data Center Package", category: "datacenter", price: 99999.99, image: "/economic-vision.png", rating: 5.0, reviews: 5, description: "10 servers, networking, 3-year support", requiresQuote: true },
  { id: 302, sku: "DC-GROWTH", name: "Growth Data Center Package", category: "datacenter", price: 499999.99, image: "/economic-vision.png", rating: 5.0, reviews: 3, description: "50 servers, full stack, dedicated support", requiresQuote: true },
  { id: 303, sku: "DC-ENTERPRISE", name: "Enterprise Data Center Package", category: "datacenter", price: 2499999.99, image: "/economic-vision.png", rating: 5.0, reviews: 2, description: "250+ servers, custom config, 24/7 support", requiresQuote: true },
  { id: 304, sku: "DC-CUSTOM", name: "Custom Data Center Solution", category: "datacenter", price: 0, image: "/economic-vision.png", rating: 5.0, reviews: 15, description: "Contact sales for custom quote", requiresQuote: true },
  { id: 305, sku: "GEO-POWER", name: "Geothermal Power Integration", category: "datacenter", price: 0, image: "/img-server-rack.jpg", rating: 5.0, reviews: 4, description: "Sustainable power solutions - contact sales", requiresQuote: true },

  // SUPPORT & MAINTENANCE
  { id: 401, sku: "SUP-3YR-PARTS", name: "3-Year Parts Warranty", category: "support", price: 2999.99, image: "/img-tech-support.jpg", rating: 4.9, reviews: 89, description: "Extended parts coverage per server", requiresQuote: false },
  { id: 402, sku: "SUP-1YR-CRIT", name: "1-Year Critical Replacement", category: "support", price: 999.99, image: "/img-tech-support.jpg", rating: 5.0, reviews: 67, description: "Next-day replacement service", requiresQuote: false },
  { id: 403, sku: "SUP-247-TECH", name: "24/7 Technical Support (Annual)", category: "support", price: 4999.99, image: "/img-tech-support.jpg", rating: 4.8, reviews: 123, description: "Round-the-clock expert support", requiresQuote: false },
  { id: 404, sku: "SUP-DED-MGR", name: "Dedicated Account Manager", category: "support", price: 9999.99, image: "/img-tech-support.jpg", rating: 5.0, reviews: 34, description: "Personal enterprise support contact", requiresQuote: true },
  { id: 405, sku: "SUP-ONSITE", name: "On-Site Service Package", category: "support", price: 14999.99, image: "/img-tech-support.jpg", rating: 5.0, reviews: 18, description: "Technician visits included (annual)", requiresQuote: true },
  { id: 406, sku: "SUP-MONITOR", name: "Proactive Monitoring Service", category: "support", price: 1999.99, image: "/img-tech-support.jpg", rating: 4.9, reviews: 56, description: "24/7 system health monitoring", requiresQuote: false },
  { id: 407, sku: "SUP-UPDATES", name: "Software Updates & Patches", category: "support", price: 499.99, image: "/img-tech-support.jpg", rating: 4.7, reviews: 234, description: "Annual update subscription", requiresQuote: false },

  // AI COMPANIONS (FUEL BOTS) - All require quotes
  { id: 501, sku: "FB-TRAIN", name: "Fuel Bot — Training Companion", category: "fuelbots", price: 0, image: "/img-robot-dog.jpg", rating: 5.0, reviews: 0, description: "AI-powered athletic trainer - Contact for lease", requiresQuote: true },
  { id: 502, sku: "FB-MEDICAL", name: "Fuel Bot — Medical Response Unit", category: "fuelbots", price: 0, image: "/img-robot-dog.jpg", rating: 5.0, reviews: 0, description: "Rapid AED delivery & injury support - Contact sales", requiresQuote: true },
  { id: 503, sku: "FB-SECURITY", name: "Fuel Bot — Stadium Security", category: "fuelbots", price: 0, image: "/img-robot-dog.jpg", rating: 5.0, reviews: 0, description: "Autonomous security patrol - Contact sales", requiresQuote: true },
  { id: 504, sku: "FB-DATACENTER", name: "Fuel Bot — Data Center Operations", category: "fuelbots", price: 0, image: "/img-server-rack.jpg", rating: 5.0, reviews: 0, description: "Automated facility management - Contact sales", requiresQuote: true },
  { id: 505, sku: "FB-ENERGY", name: "Fuel Bot — Energy Sector", category: "fuelbots", price: 0, image: "/img-server-rack.jpg", rating: 5.0, reviews: 0, description: "Geothermal & power station ops - Contact sales", requiresQuote: true },
  { id: 506, sku: "RD-HEXAPOD", name: "Hexapod Robot Dog", category: "fuelbots", price: 0, image: "/img-robot-dog.jpg", rating: 5.0, reviews: 0, description: "6-legged all-terrain companion - Contact sales", requiresQuote: true },
  { id: 507, sku: "RD-HYBRID", name: "Wheel-Leg Hybrid Robot", category: "fuelbots", price: 0, image: "/img-robot-hybrid.jpg", rating: 5.0, reviews: 0, description: "Speed + stability hybrid - Contact sales", requiresQuote: true },
  { id: 508, sku: "RD-MEDIUM", name: "Medium Size Robot Dog", category: "fuelbots", price: 0, image: "/img-robot-dog.jpg", rating: 5.0, reviews: 0, description: "25kg payload, 4-6hr battery - Contact sales", requiresQuote: true },

  // SPORTS EQUIPMENT
  { id: 1, sku: "BB-BAT-PRO", name: "Pro Baseball Bat", category: "baseball", price: 299.99, image: "/img-baseball-bat.jpg", rating: 4.8, reviews: 124, description: "Professional grade aluminum bat", requiresQuote: false },
  { id: 2, sku: "BB-GLOVE-LTH", name: "Leather Baseball Glove", category: "baseball", price: 189.99, image: "/img-baseball-bat.jpg", rating: 4.9, reviews: 89, description: "Premium leather fielding glove", requiresQuote: false },
  { id: 3, sku: "BB-BALLS-12", name: "Training Baseballs (12pk)", category: "baseball", price: 49.99, image: "/img-baseball-bat.jpg", rating: 4.7, reviews: 256, description: "Official size training balls", requiresQuote: false },
  { id: 4, sku: "FB-BALL-ELITE", name: "Elite Football", category: "football", price: 129.99, image: "/img-football-helmet.jpg", rating: 4.8, reviews: 178, description: "Official size game ball", requiresQuote: false },
  { id: 5, sku: "FB-GLOVES", name: "Football Gloves", category: "football", price: 79.99, image: "/img-football-helmet.jpg", rating: 4.6, reviews: 92, description: "Sticky grip receiver gloves", requiresQuote: false },
  { id: 6, sku: "BK-BALL-PRO", name: "Pro Basketball", category: "basketball", price: 149.99, image: "/img-basketball-gear.jpg", rating: 4.9, reviews: 312, description: "Indoor/outdoor composite leather", requiresQuote: false },
  { id: 7, sku: "BK-SHOES", name: "Basketball Shoes", category: "basketball", price: 179.99, image: "/img-basketball-gear.jpg", rating: 4.7, reviews: 445, description: "High-top performance shoes", requiresQuote: false },
  { id: 8, sku: "FISH-ROD-PRO", name: "Fishing Rod Pro", category: "fishing", price: 249.99, image: "/img-fishing-gear.jpg", rating: 4.8, reviews: 67, description: "Carbon fiber spinning rod", requiresQuote: false },
  { id: 9, sku: "FISH-TACKLE", name: "Tackle Box Complete", category: "fishing", price: 89.99, image: "/img-fishing-gear.jpg", rating: 4.5, reviews: 134, description: "200+ piece tackle set", requiresQuote: false },
  { id: 10, sku: "GOLF-CLUBS", name: "Golf Club Set", category: "golf", price: 899.99, image: "/img-golf-clubs.jpg", rating: 4.9, reviews: 56, description: "Complete 14-piece set with bag", requiresQuote: false },
  { id: 11, sku: "GOLF-BALLS-24", name: "Golf Balls (24pk)", category: "golf", price: 39.99, image: "/img-golf-clubs.jpg", rating: 4.6, reviews: 289, description: "Tour-quality golf balls", requiresQuote: false },
  { id: 12, sku: "HUNT-SCOPE", name: "Hunting Rifle Scope", category: "hunting", price: 349.99, image: "/img-hunting-gear.jpg", rating: 4.8, reviews: 78, description: "4-16x50mm illuminated scope", requiresQuote: false },
  { id: 13, sku: "HUNT-JACKET", name: "Camo Jacket", category: "hunting", price: 149.99, image: "/img-hunting-gear.jpg", rating: 4.7, reviews: 112, description: "Waterproof hunting jacket", requiresQuote: false },
  { id: 14, sku: "FIT-DUMBBELLS", name: "Adjustable Dumbbells", category: "fitness", price: 399.99, image: "/sport-training.jpg", rating: 4.8, reviews: 567, description: "5-50lb adjustable set", requiresQuote: false },
  { id: 15, sku: "FIT-BENCH", name: "Weight Bench Pro", category: "fitness", price: 299.99, image: "/sport-training.jpg", rating: 4.7, reviews: 234, description: "Adjustable incline/decline bench", requiresQuote: false },
  { id: 16, sku: "APP-TEE", name: "AthlynX Performance Tee", category: "apparel", price: 34.99, image: "/img-athlete-apparel.jpg", rating: 4.8, reviews: 234, description: "Moisture-wicking athletic tee", requiresQuote: false },
  { id: 17, sku: "APP-HOODIE", name: "AthlynX Hoodie", category: "apparel", price: 69.99, image: "/img-athlete-apparel.jpg", rating: 4.9, reviews: 189, description: "Premium fleece hoodie", requiresQuote: false },
  { id: 18, sku: "TRAIN-LADDER", name: "Speed Ladder", category: "training", price: 24.99, image: "/img-agility-training.jpg", rating: 4.6, reviews: 345, description: "20ft agility ladder", requiresQuote: false },
  { id: 19, sku: "TRAIN-CONES", name: "Agility Cones (20pk)", category: "training", price: 19.99, image: "/img-agility-training.jpg", rating: 4.7, reviews: 456, description: "High-visibility training cones", requiresQuote: false },
  { id: 20, sku: "BB-PITCH-MACH", name: "Pitching Machine", category: "baseball", price: 1299.99, image: "/img-pitching-machine.jpg", rating: 4.9, reviews: 34, description: "Variable speed pitching machine", requiresQuote: false },

  // PREMIUM SPORTS EQUIPMENT — KUIU/SITKA LEVEL
  // Football — Elite
  { id: 21, sku: "FB-HELMET-PRO", name: "Riddell SpeedFlex Precision Diamond Helmet", category: "football", price: 699.99, image: "/img-football-helmet.jpg", rating: 5.0, reviews: 89, description: "NFL-grade impact protection, custom fit", requiresQuote: false },
  { id: 22, sku: "FB-PADS-ELITE", name: "Schutt NOMAD Elite Shoulder Pads", category: "football", price: 349.99, image: "/img-football-helmet.jpg", rating: 4.9, reviews: 67, description: "Pro-grade shoulder pads, skill positions", requiresQuote: false },
  { id: 23, sku: "FB-CLEATS-ELITE", name: "Nike Alpha Menace Elite 3 Cleats", category: "football", price: 189.99, image: "/img-football-helmet.jpg", rating: 4.8, reviews: 234, description: "Carbon fiber plate, elite traction", requiresQuote: false },

  // Basketball — Elite
  { id: 24, sku: "BK-BALL-WILSON", name: "Wilson Evolution Game Ball", category: "basketball", price: 169.99, image: "/img-basketball-gear.jpg", rating: 5.0, reviews: 1245, description: "Official NCAA game ball, microfiber composite", requiresQuote: false },
  { id: 25, sku: "BK-HOOP-PRO", name: "Spalding Pro Slam Portable Hoop", category: "basketball", price: 599.99, image: "/img-basketball-gear.jpg", rating: 4.8, reviews: 156, description: "Adjustable 7.5–10ft, 44\" acrylic backboard", requiresQuote: false },
  { id: 26, sku: "BK-SHOES-LEBRON", name: "Nike LeBron NXXT Gen AMPD", category: "basketball", price: 249.99, image: "/img-basketball-gear.jpg", rating: 4.9, reviews: 445, description: "React foam + Air Zoom, elite court feel", requiresQuote: false },

  // Baseball — Elite
  { id: 27, sku: "BB-BAT-RAWLINGS", name: "Rawlings Quatro Pro BBCOR Bat", category: "baseball", price: 449.99, image: "/img-baseball-bat.jpg", rating: 4.9, reviews: 178, description: "Carbon fiber composite, max pop", requiresQuote: false },
  { id: 28, sku: "BB-GLOVE-RAWLINGS", name: "Rawlings Heart of the Hide PRO206-9", category: "baseball", price: 379.99, image: "/img-baseball-bat.jpg", rating: 5.0, reviews: 312, description: "Pro-grade kip leather, 12\" pattern", requiresQuote: false },
  { id: 29, sku: "BB-CATCHER-PRO", name: "All-Star System 7 Catcher's Set", category: "baseball", price: 599.99, image: "/img-baseball-bat.jpg", rating: 4.9, reviews: 89, description: "Helmet, chest protector, leg guards", requiresQuote: false },

  // Hunting & Outdoor — KUIU/Sitka Level
  { id: 30, sku: "HUNT-KUIU-ULTRA", name: "KUIU Ultra Merino 145 Base Layer", category: "hunting", price: 119.99, image: "/img-hunting-gear.jpg", rating: 5.0, reviews: 234, description: "Ultralight merino wool, odor control", requiresQuote: false },
  { id: 31, sku: "HUNT-SITKA-FANATIC", name: "Sitka Fanatic Jacket — Optifade", category: "hunting", price: 599.99, image: "/img-hunting-gear.jpg", rating: 5.0, reviews: 156, description: "GORE-TEX, Optifade camo, ultralight", requiresQuote: false },
  { id: 32, sku: "HUNT-BINO-SWAROVSKI", name: "Swarovski EL 10x42 Binoculars", category: "hunting", price: 2799.99, image: "/img-hunting-gear.jpg", rating: 5.0, reviews: 67, description: "World-class glass, field flattener lenses", requiresQuote: false },
  { id: 33, sku: "HUNT-RANGEFINDER", name: "Leupold RX-2800 TBR/W Rangefinder", category: "hunting", price: 499.99, image: "/img-hunting-gear.jpg", rating: 4.9, reviews: 123, description: "2800 yard range, True Ballistic Range", requiresQuote: false },
  { id: 34, sku: "HUNT-PACK-KUIU", name: "KUIU Pro 7200 Hunting Pack", category: "hunting", price: 649.99, image: "/img-hunting-gear.jpg", rating: 5.0, reviews: 89, description: "7200ci capacity, ultralight frame", requiresQuote: false },

  // Fishing — Premium
  { id: 35, sku: "FISH-ROD-SAGE", name: "Sage R8 Core Fly Rod", category: "fishing", price: 1095.00, image: "/img-fishing-gear.jpg", rating: 5.0, reviews: 45, description: "9ft 5wt, graphite composite, lifetime warranty", requiresQuote: false },
  { id: 36, sku: "FISH-REEL-ABEL", name: "Abel Super 7/8 Fly Reel", category: "fishing", price: 895.00, image: "/img-fishing-gear.jpg", rating: 5.0, reviews: 34, description: "USA-made, machined aluminum, drag system", requiresQuote: false },
  { id: 37, sku: "FISH-WADERS-SIMMS", name: "Simms G3 Guide Stockingfoot Waders", category: "fishing", price: 699.99, image: "/img-fishing-gear.jpg", rating: 4.9, reviews: 178, description: "GORE-TEX Pro, 4-layer, lifetime warranty", requiresQuote: false },

  // Golf — Premium
  { id: 38, sku: "GOLF-DRIVER-TAYLORMADE", name: "TaylorMade Qi10 Max Driver", category: "golf", price: 599.99, image: "/img-golf-clubs.jpg", rating: 4.9, reviews: 234, description: "460cc, Carbonwood face, 10.5° loft", requiresQuote: false },
  { id: 39, sku: "GOLF-IRONS-TITLEIST", name: "Titleist T100 Iron Set (4-PW)", category: "golf", price: 1399.99, image: "/img-golf-clubs.jpg", rating: 5.0, reviews: 89, description: "Tour-proven forged irons, 7-piece set", requiresQuote: false },
  { id: 40, sku: "GOLF-BAG-TITLEIST", name: "Titleist Players 4 Stand Bag", category: "golf", price: 299.99, image: "/img-golf-clubs.jpg", rating: 4.8, reviews: 156, description: "Lightweight, dual strap, 14-way top", requiresQuote: false },

  // Training & Recovery — Elite
  { id: 41, sku: "FIT-RACK-POWER", name: "Rogue Monster Lite Power Rack", category: "fitness", price: 1895.00, image: "/sport-training.jpg", rating: 5.0, reviews: 456, description: "11-gauge steel, 1000lb capacity, USA-made", requiresQuote: false },
  { id: 42, sku: "FIT-BARBELL-ROGUE", name: "Rogue Ohio Bar — Cerakote", category: "fitness", price: 395.00, image: "/sport-training.jpg", rating: 5.0, reviews: 789, description: "20kg, 190,000 PSI tensile strength", requiresQuote: false },
  { id: 43, sku: "FIT-PLATES-BUMPER", name: "Rogue Bumper Plates (260lb Set)", category: "fitness", price: 695.00, image: "/sport-training.jpg", rating: 4.9, reviews: 345, description: "High-density rubber, IWF spec", requiresQuote: false },
  { id: 44, sku: "RECOV-NORMATEC", name: "Hyperice Normatec 3 Legs", category: "training", price: 699.99, image: "/img-recovery.jpg", rating: 5.0, reviews: 567, description: "Dynamic air compression recovery system", requiresQuote: false },
  { id: 45, sku: "RECOV-THERAGUN", name: "Theragun PRO Plus", category: "training", price: 599.99, image: "/img-recovery.jpg", rating: 4.9, reviews: 1234, description: "6 attachments, 60lb force, app-connected", requiresQuote: false },
  { id: 46, sku: "RECOV-ICEBATH", name: "Edge Theory Labs Cold Plunge", category: "training", price: 4999.99, image: "/img-cold-plunge.jpg", rating: 5.0, reviews: 89, description: "Chills to 37°F, filtration system, 100 gal", requiresQuote: false },

  // Nutrition — Elite
  { id: 47, sku: "NUT-WHEY-OPTIMUM", name: "Optimum Nutrition Gold Standard Whey (10lb)", category: "apparel", price: 149.99, image: "/img-nutrition.jpg", rating: 4.9, reviews: 5678, description: "100% whey protein, 24g protein per serving", requiresQuote: false },
  { id: 48, sku: "NUT-CREATINE-PRO", name: "Thorne Creatine — 90 Servings", category: "apparel", price: 49.99, image: "/img-nutrition.jpg", rating: 5.0, reviews: 2345, description: "NSF Certified for Sport, 5g pure creatine", requiresQuote: false },
  { id: 49, sku: "NUT-GATORADE-BULK", name: "Gatorade Endurance Formula (Case)", category: "apparel", price: 89.99, image: "/img-nutrition.jpg", rating: 4.8, reviews: 3456, description: "32 x 32oz bottles, electrolyte formula", requiresQuote: false },

  // NIL & Branding
  { id: 50, sku: "NIL-BRAND-KIT", name: "AthlynXAI Athlete Brand Kit", category: "apparel", price: 299.99, image: "/img-nil-brand.jpg", rating: 5.0, reviews: 234, description: "Logo, social templates, press kit, bio page", requiresQuote: false },
  { id: 51, sku: "NIL-JERSEY-CUSTOM", name: "Custom NIL Jersey (Name + Number)", category: "apparel", price: 149.99, image: "/img-athlete-apparel.jpg", rating: 4.9, reviews: 567, description: "Sublimated, any sport, any design", requiresQuote: false },

  // FuelBots with real images
  { id: 502, sku: "FB-RUNNER", name: "FuelBot — AI Running Companion", category: "fuelbots", price: 0, image: "/fuel-bot-running.jpg", rating: 5.0, reviews: 0, description: "Runs alongside athletes at full speed — Contact for lease", requiresQuote: true },
  { id: 503, sku: "FB-TRAINER", name: "FuelBot — AI Training Coach", category: "fuelbots", price: 0, image: "/fuel-bot-training.jpg", rating: 5.0, reviews: 0, description: "AI-powered athletic trainer — Contact for lease", requiresQuote: true },
];

// Product type from database
interface Product {
  id: number;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  price: string;
  imageUrl: string | null;
  image: string | null;
  rating: string | null;
  reviewCount: number | null;
  stockQuantity: number | null;
  requiresQuote: string;
  isActive: string;
}

function StoreInner() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [localCart, setLocalCart] = useState<LocalCartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [showContactSales, setShowContactSales] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutName, setCheckoutName] = useState("");
  const [checkoutAddress, setCheckoutAddress] = useState("");
  const [checkoutCity, setCheckoutCity] = useState("");
  const [checkoutZip, setCheckoutZip] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = [
    { id: "all", name: "All Products", icon: "" },
    { id: "enterprise", name: "Enterprise Hardware", icon: "" },
    { id: "software", name: "Software & Licenses", icon: "" },
    { id: "datacenter", name: "Data Center", icon: "" },
    { id: "support", name: "Support & Maintenance", icon: "" },
    { id: "fuelbots", name: "AI Companions", icon: "" },
    { id: "baseball", name: "Baseball", icon: "" },
    { id: "football", name: "Football", icon: "" },
    { id: "basketball", name: "Basketball", icon: "" },
    { id: "fishing", name: "Fishing", icon: "" },
    { id: "golf", name: "Golf", icon: "" },
    { id: "hunting", name: "Hunting & Outdoor", icon: "" },
    { id: "fitness", name: "Fitness", icon: "" },
    { id: "apparel", name: "Apparel & Nutrition", icon: "" },
    { id: "training", name: "Training & Recovery", icon: "" },
  ];

  // Live Stripe products — falls back to static if Stripe not configured
  const { data: stripeProducts = [], isLoading: productsLoading } = trpc.stripe.getStoreProducts.useQuery(
    { limit: 50 },
    { retry: false, staleTime: 60000 }
  );
  const createProductCheckout = trpc.stripe.createProductCheckout.useMutation({
    onSuccess: (data) => {
      if (data.url) window.location.href = data.url;
    },
    onError: (err) => {
      toast.error(err.message || 'Checkout failed. Please try again.');
      setIsProcessing(false);
    },
  });
  const createCheckout = {
    mutateAsync: async (_input: unknown) => {
      const cartDescription = localCart.map(i => `${i.qty}x ${i.name}`).join(', ');
      await createProductCheckout.mutateAsync({
        productName: `AthlynX Store Order (${cartCount} item${cartCount !== 1 ? 's' : ''})`,
        productDescription: cartDescription.slice(0, 200),
        priceInCents: Math.round(orderTotal * 100),
        quantity: 1,
        origin: window.location.origin,
      });
    },
    isPending: createProductCheckout.isPending,
  };

  // Use live Stripe products if available, otherwise fall back to static
  const products: Product[] = stripeProducts.length > 0
    ? stripeProducts.map((p: any) => ({
        id: p.id,
        sku: p.sku || p.id,
        name: p.name,
        description: p.description || "",
        category: p.category || "general",
        price: String(p.price / 100), // Stripe stores in cents
        imageUrl: p.image || "/img-hardware.jpg",
        image: p.image || "/img-hardware.jpg",
        rating: String(p.rating || 5.0),
        reviewCount: p.reviews || 0,
        stockQuantity: p.inStock ? 100 : 0,
        requiresQuote: p.requiresQuote ? 'yes' : 'no',
        isActive: 'yes',
        priceId: p.priceId,
      }))
    : staticProducts.map(p => ({
        id: p.id,
        sku: p.sku,
        name: p.name,
        description: p.description,
        category: p.category,
        price: String(p.price),
        imageUrl: p.image,
        image: p.image,
        rating: String(p.rating),
        reviewCount: p.reviews,
        stockQuantity: 100,
        requiresQuote: p.requiresQuote ? 'yes' : 'no',
        isActive: 'yes',
      }));

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const addToCart = (product: Product) => {
    const price = parseFloat(product.price);
    // Check if requires quote
    if (product.requiresQuote === 'yes' || price === 0) {
      setSelectedProduct(product);
      setShowContactSales(true);
      return;
    }

    setLocalCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        price: price,
        qty: 1,
        image: product.imageUrl || product.image || '',
        category: product.category,
        description: product.description || ''
      }];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQuantity = (id: number, delta: number) => {
    setLocalCart(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.qty + delta;
          if (newQty <= 0) return null as any;
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeFromCart = (id: number) => {
    setLocalCart(prev => prev.filter(item => item.id !== id));
    toast.success("Item removed from cart");
  };

  const cartTotal = localCart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cartCount = localCart.reduce((sum, item) => sum + item.qty, 0);
  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const tax = cartTotal * 0.0825;
  const orderTotal = cartTotal + shipping + tax;

  const handleCheckout = async () => {
    if (!checkoutEmail || !checkoutName || !checkoutAddress || !checkoutCity || !checkoutZip) {
      toast.error("Please fill in all shipping information");
      return;
    }

    setIsProcessing(true);

    // For logged-in users, use Stripe checkout
    if (user) {
      void createCheckout.mutateAsync({
        shippingName: checkoutName,
        shippingEmail: checkoutEmail,
        shippingAddress: checkoutAddress,
        shippingCity: checkoutCity,
        shippingZip: checkoutZip,
      });
    } else {
      // For guests, show login prompt
      toast.error("Please log in to complete your purchase");
      setIsProcessing(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Contact Sales";
    if (price >= 1000000) return `$${(price / 1000000).toFixed(2)}M`;
    if (price >= 1000) return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    return `$${price.toFixed(2)}`;
  };

  const getInquiryType = (category: string) => {
    const mapping: Record<string, string> = {
      enterprise: "enterprise_hardware",
      datacenter: "data_center",
      software: "software_license",
      fuelbots: "fuel_bots",
      support: "support_contract",
    };
    return mapping[category] || "other";
  };

  // Helper: is image a URL or an emoji/text
  const isImageUrl = (img: string | null) => img && (img.startsWith('http') || img.startsWith('/'));

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      {/* Contact Sales Modal */}
      <ContactSalesModal
        isOpen={showContactSales}
        onClose={() => {
          setShowContactSales(false);
          setSelectedProduct(null);
        }}
        productName={selectedProduct?.name}
        inquiryType={selectedProduct ? getInquiryType(selectedProduct.category) : undefined}
      />

      {/* Cart Sidebar */}
      {showCart && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowCart(false)} />
          <div className="relative w-full max-w-md bg-[#1a1a2e] h-full overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Your Cart ({cartCount})</h2>
                <button onClick={() => setShowCart(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>

              {localCart.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl mb-4 block"></span>
                  <p className="text-gray-400">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 px-6 py-2 bg-[#1E90FF] text-black rounded-lg font-semibold hover:bg-[#1E90FF]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {localCart.map((item) => (
                      <div key={item.id} className="flex gap-4 bg-white/5 rounded-xl p-4">
                        <div className="w-16 h-16 bg-white/10 rounded-lg overflow-hidden flex items-center justify-center">
                          {isImageUrl(item.image) ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-3xl">{item.image}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-semibold text-sm">{item.name}</p>
                          <p className="text-[#1E90FF] font-bold">${item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                            >
                              −
                            </button>
                            <span className="text-white text-sm">{item.qty}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 bg-white/10 rounded flex items-center justify-center hover:bg-white/20"
                            >
                              +
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto text-[#1E90FF] hover:text-[#1E90FF] text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="bg-white/5 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-2">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mb-3">
                      <span>Tax (8.25%)</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-white font-bold border-t border-white/10 pt-3">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => { setShowCart(false); setShowCheckout(true); }}
                    className="w-full py-4 bg-[#1E90FF] text-black rounded-xl font-bold text-lg hover:bg-[#1E90FF] transition-all"
                  >
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setShowCheckout(false)} />
          <div className="relative w-full max-w-lg bg-[#1a1a2e] rounded-2xl p-8 mx-4 overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Checkout</h2>
              <button onClick={() => setShowCheckout(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Full Name</label>
                <input
                  type="text"
                  value={checkoutName}
                  onChange={e => setCheckoutName(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-[#1E90FF] outline-none"
                  placeholder="Chad A. Dozier"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Email</label>
                <input
                  type="email"
                  value={checkoutEmail}
                  onChange={e => setCheckoutEmail(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-[#1E90FF] outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Street Address</label>
                <input
                  type="text"
                  value={checkoutAddress}
                  onChange={e => setCheckoutAddress(e.target.value)}
                  className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-[#1E90FF] outline-none"
                  placeholder="123 Main St"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">City</label>
                  <input
                    type="text"
                    value={checkoutCity}
                    onChange={e => setCheckoutCity(e.target.value)}
                    className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-[#1E90FF] outline-none"
                    placeholder="Houston"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">ZIP Code</label>
                  <input
                    type="text"
                    value={checkoutZip}
                    onChange={e => setCheckoutZip(e.target.value)}
                    className="w-full bg-white/10 rounded-lg px-4 py-3 text-white border border-white/20 focus:border-[#1E90FF] outline-none"
                    placeholder="77001"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-400 mb-3">
                <span>Tax (8.25%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-white font-bold border-t border-white/10 pt-3">
                <span>Total</span>
                <span>${orderTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-[#1E90FF] to-[#0a1628] text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {isProcessing ? "Processing..." : `Pay $${orderTotal.toFixed(2)}`}
            </button>
            <p className="text-gray-500 text-xs text-center mt-2">
               Your payment is secure and encrypted
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <span className="text-xl font-black text-white">AthlynX</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/home" className="text-gray-400 hover:text-white">Platform</Link>
            <Link href="/store" className="text-[#1E90FF] font-semibold">Store</Link>
            <Link href="/pricing" className="text-gray-400 hover:text-white">Pricing</Link>
          </nav>
          <button
            onClick={() => setShowCart(true)}
            className="relative flex items-center gap-2 bg-[#1E90FF] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#1E90FF] transition-all"
          >
            <span></span>
            <span>${cartTotal.toFixed(2)}</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 w-5 h-5 bg-white text-[#1E90FF] text-xs rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">
          {/* Hero */}
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1 bg-[#1E90FF]/20 text-[#1E90FF] rounded-full text-sm font-semibold mb-4">
               OFFICIAL STORE
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              The Amazon of <span className="text-[#1E90FF]">Sports</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Memberships, AI credits, training programs, NIL gear, recruiting services, playbooks, enterprise servers, and more — everything an athlete needs, all in one place.
            </p>
          </div>

          {/*  Membership Plans  */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#0a1628]/30" />
              <span className="text-[#1E90FF] font-bold tracking-widest text-xs uppercase">AthlynX Memberships</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#0a1628]/30" />
            </div>
            <p className="text-gray-400 text-sm text-center mb-6">7-day free trial on all plans — credit card required, not charged until day 8.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "Athlete Free", price: "$0", badge: "Free Trial", color: "border-blue-500/40 bg-blue-900/20", features: ["Basic Profile", "NIL Discovery", "Community Feed", "7-Day Trial"] },
                { name: "Starter", price: "$9.99", badge: "Starter", color: "border-[#1E90FF]/30 bg-[#1E90FF]/20", features: ["Basic Profile", "NIL Discovery", "Community Messaging", "Diamond Grind"] },
                { name: "Pro", price: "$19.99", badge: "Most Popular", color: "border-[#00C2FF]/40 bg-[#00C2FF]/20", features: ["AI Recruiter", "NIL Marketplace", "Warriors Playbook", "AI Sales"] },
                { name: "Elite", price: "$39.99", badge: "Best Value", color: "border-[#1E90FF]/40 bg-[#1E90FF]/20", features: ["NIL Vault", "Brand Deal AI", "Account Manager", "API Access"] },
                { name: "Champion", price: "$59.99", badge: "Champion", color: "border-[#1E90FF]/30 bg-[#1E90FF]/20", features: ["NIL Analytics", "Brand Deal Suite", "Custom Page", "Early Access"] },
                { name: "MVP", price: "$99.99", badge: "MVP ", color: "border-blue-500/40 bg-blue-900/20", features: ["1-on-1 Strategy", "VIP Network", "Unlimited Credits", "Custom Brand Kit"] },
              ].map(plan => (
                <div key={plan.name} className={`border rounded-xl p-4 flex flex-col ${plan.color}`}>
                  <span className="text-xs font-bold text-white/60 mb-1">{plan.badge}</span>
                  <h3 className="font-black text-white text-sm mb-1">{plan.name}</h3>
                  <div className="text-xl font-black text-white mb-3">{plan.price}<span className="text-xs text-white/40">/mo</span></div>
                  <ul className="space-y-1 mb-4 flex-1">
                    {plan.features.map((f, i) => <li key={i} className="text-xs text-white/60 flex items-center gap-1"><span className="text-[#00C2FF]"></span>{f}</li>)}
                  </ul>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full py-1.5 bg-[#1E90FF] hover:bg-[#1E90FF] text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/*  AI Credits  */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#0a1628]/30" />
              <span className="text-[#00C2FF] font-bold tracking-widest text-xs uppercase">AI Credits</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#0a1628]/30" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "100 Credits", price: "$9.99", icon: "", desc: "Casual AI Trainer sessions", highlight: false },
                { name: "500 Credits", price: "$39.99", icon: "", desc: "Best value for active athletes", highlight: true },
                { name: "1,000 Credits", price: "$69.99", icon: "", desc: "Power users, teams & coaches", highlight: false },
              ].map(pack => (
                <div key={pack.name} className={`relative border rounded-xl p-5 text-center flex flex-col items-center ${
                  pack.highlight ? "border-[#1E90FF]/30 bg-[#1E90FF]/20" : "border-white/10 bg-white/5"
                }`}>
                  {pack.highlight && <span className="absolute -top-3 bg-[#1E90FF] text-black text-xs font-black px-3 py-1 rounded-full">BEST VALUE</span>}
                  <div className="text-3xl mb-2">{pack.icon}</div>
                  <h3 className="font-black text-white mb-1">{pack.name}</h3>
                  <div className="text-2xl font-black text-[#00C2FF] mb-2">{pack.price}</div>
                  <p className="text-white/50 text-xs mb-4">{pack.desc}</p>
                  <button
                    onClick={() => window.location.href = '/pricing'}
                    className="w-full py-2 bg-[#1565C0] hover:bg-[#1E90FF] text-white text-sm font-bold rounded-lg transition-colors"
                  >
                    Buy Credits
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "bg-[#1E90FF] text-white font-semibold"
                    : "bg-white/10 text-gray-400 hover:bg-white/20"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
            {filteredProducts.map((product: Product) => {
              const imgSrc = product.imageUrl || product.image;
              const isUrl = isImageUrl(imgSrc);
              return (
                <div
                  key={product.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-[#1E90FF]/50 transition-all group cursor-pointer"
                >
                  {/* Product Image */}
                  <div className="aspect-square bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] overflow-hidden relative">
                    {isUrl ? (
                      <img
                        src={imgSrc!}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`${isUrl ? 'hidden' : ''} absolute inset-0 flex items-center justify-center text-6xl`}>
                      {imgSrc || ''}
                    </div>
                    {/* Category badge */}
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-xs rounded-full font-medium capitalize">
                        {product.category}
                      </span>
                    </div>
                    {product.requiresQuote === 'yes' && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-0.5 bg-blue-600/80 text-white text-xs rounded-full font-medium">
                          Quote
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <p className="text-white font-semibold text-sm mb-1 line-clamp-2">{product.name}</p>
                    {product.description && (
                      <p className="text-gray-500 text-xs mb-2 line-clamp-2">{product.description}</p>
                    )}
                    <div className="flex items-center gap-1 mb-3">
                      <span className="text-[#1E90FF] text-xs"></span>
                      <span className="text-gray-400 text-xs">{product.rating} ({product.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${parseFloat(product.price) === 0 ? 'text-blue-400 text-xs' : 'text-white text-base'}`}>
                        {formatPrice(parseFloat(product.price))}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className={`px-3 py-2 rounded-lg font-semibold text-sm transition-all ${
                          product.requiresQuote === 'yes' || parseFloat(product.price) === 0
                            ? "bg-blue-600/30 text-blue-400 hover:bg-blue-600/50 border border-blue-500/30"
                            : "bg-[#1E90FF] text-white hover:bg-[#1E90FF]"
                        }`}
                      >
                        {product.requiresQuote === 'yes' || parseFloat(product.price) === 0 ? "Get Quote" : "Add +"}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enterprise CTA */}
          <div className="bg-gradient-to-r from-blue-900/40 to-[#0a1628]/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-8 mb-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Need Enterprise Solutions?</h3>
                <p className="text-gray-400">
                  Data centers, AI companions, custom hardware configurations. Our team is ready to help.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setShowContactSales(true);
                }}
                className="px-8 py-4 bg-[#1E90FF] text-white rounded-xl font-bold hover:bg-[#1E90FF] transition-all whitespace-nowrap"
              >
                Contact Sales Team
              </button>
            </div>
          </div>

          {/* Featured Partners */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8 mb-10">
            <h3 className="text-xl font-bold text-white mb-6 text-center">Technology Partners</h3>
            <div className="flex justify-center gap-8 flex-wrap">
              {["Supermicro", "NVIDIA", "Intel", "Seagate", "Micron", "ICC"].map((brand) => (
                <div key={brand} className="text-gray-500 font-semibold text-lg hover:text-white transition-all cursor-pointer">
                  {brand}
                </div>
              ))}
            </div>
          </div>

          {/* Back Link */}
          <div className="text-center">
            <Link href="/" className="text-blue-400 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}

export default function Store() {
  return <RouteErrorBoundary><StoreInner /></RouteErrorBoundary>;
}
