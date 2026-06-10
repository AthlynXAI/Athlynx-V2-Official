import type { NILDeal, NILValuationSnapshot } from '@/types';

export const NIL_RECENT_DEALS: NILDeal[] = [
  { id: '1', brand: 'Nike', category: 'Apparel', value: 125000, sport: 'Football', athleteType: 'QB', platform: 'Instagram', date: '2026-06-01' },
  { id: '2', brand: 'Gatorade', category: 'Beverage', value: 85000, sport: 'Basketball', athleteType: 'PG', platform: 'TikTok', date: '2026-05-28' },
  { id: '3', brand: 'Under Armour', category: 'Apparel', value: 72000, sport: 'Baseball', athleteType: 'SP', platform: 'Instagram', date: '2026-05-25' },
  { id: '4', brand: 'Adidas', category: 'Apparel', value: 95000, sport: 'Track', athleteType: 'Sprinter', platform: 'YouTube', date: '2026-05-22' },
  { id: '5', brand: 'Celsius', category: 'Beverage', value: 45000, sport: 'Softball', athleteType: 'P', platform: 'TikTok', date: '2026-05-20' },
  { id: '6', brand: 'Panini', category: 'Trading Cards', value: 38000, sport: 'Football', athleteType: 'WR', platform: 'Instagram', date: '2026-05-18' },
  { id: '7', brand: 'Beats by Dre', category: 'Electronics', value: 60000, sport: 'Basketball', athleteType: 'SF', platform: 'YouTube', date: '2026-05-15' },
  { id: '8', brand: 'Fanatics', category: 'Merchandise', value: 55000, sport: 'Baseball', athleteType: 'OF', platform: 'Instagram', date: '2026-05-12' },
];

export const NIL_VALUATIONS: NILValuationSnapshot[] = [
  { sport: 'Football', avgValue: 48500, topValue: 2100000, dealCount: 1842, trend: 'up', trendPct: 12.4 },
  { sport: 'Basketball', avgValue: 62000, topValue: 3400000, dealCount: 1205, trend: 'up', trendPct: 18.7 },
  { sport: 'Baseball', avgValue: 28000, topValue: 850000, dealCount: 734, trend: 'up', trendPct: 22.1 },
  { sport: 'Softball', avgValue: 18500, topValue: 420000, dealCount: 512, trend: 'up', trendPct: 31.5 },
  { sport: 'Track & Field', avgValue: 22000, topValue: 680000, dealCount: 398, trend: 'flat', trendPct: 1.2 },
  { sport: 'Soccer', avgValue: 19500, topValue: 540000, dealCount: 445, trend: 'up', trendPct: 8.9 },
  { sport: 'Swimming', avgValue: 14000, topValue: 320000, dealCount: 287, trend: 'down', trendPct: -2.3 },
  { sport: 'Volleyball', avgValue: 16000, topValue: 380000, dealCount: 334, trend: 'up', trendPct: 15.6 },
];
