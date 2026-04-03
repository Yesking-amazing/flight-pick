import type { Flight } from '../types/flight';

export function getHotDeals(flights: Flight[]): Flight[] {
  return flights
    .filter(f => f.discountPercent >= 30)
    .sort((a, b) => b.discountPercent - a.discountPercent);
}

export function getDealsByContinent(flights: Flight[], continent: string | null): Flight[] {
  const filtered = continent ? flights.filter(f => f.continent === continent) : flights;
  return filtered.sort((a, b) => b.discountPercent - a.discountPercent);
}

export function getRelatedDeals(flights: Flight[], flight: Flight, limit = 4): Flight[] {
  return flights
    .filter(f => f.id !== flight.id && f.continent === flight.continent)
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, limit);
}

export function getPriceStats(flight: Flight) {
  const prices = flight.priceHistory.map(p => p.price);
  const avg = Math.round(prices.reduce((s, p) => s + p, 0) / prices.length);
  return {
    lowest: flight.lowestPrice,
    highest: flight.highestPrice,
    average: avg,
    current: flight.currentPrice,
    savings: flight.previousPrice - flight.currentPrice,
  };
}

export function getDealLabel(discountPercent: number): { text: string; color: string } {
  if (discountPercent >= 40) return { text: 'INCREDIBLE DEAL', color: 'text-red-400 bg-red-500/20 border-red-500/30' };
  if (discountPercent >= 30) return { text: 'HOT DEAL', color: 'text-orange-400 bg-orange-500/20 border-orange-500/30' };
  if (discountPercent >= 20) return { text: 'GREAT PRICE', color: 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30' };
  if (discountPercent >= 10) return { text: 'GOOD DEAL', color: 'text-green-400 bg-green-500/20 border-green-500/30' };
  return { text: 'DEAL', color: 'text-blue-400 bg-blue-500/20 border-blue-500/30' };
}
