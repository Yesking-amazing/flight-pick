const API_BASE = '/api';

async function fetchJson<T>(path: string, params?: Record<string, string>): Promise<T> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch(`${API_BASE}${path}${qs}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body.error || `API error ${res.status}`);
  }
  return res.json();
}

export interface AirportData {
  code: string;
  city: string;
  country: string;
  continent: string;
}

export interface DealFlight {
  id: string;
  origin: string;
  destination: string;
  originAirport: AirportData | null;
  destinationAirport: AirportData | null;
  departureDate: string;
  returnDate: string;
  price: number;
  currency: string;
  airline: string;
  duration: string;
  stops: number;
  medianPrice: number;
  discountPercent: number;
  continent: string;
  country: string;
  priceMetrics: PriceMetrics | null;
}

export interface PriceMetrics {
  origin: string;
  destination: string;
  departureDate: string;
  min: number;
  firstQuartile: number;
  median: number;
  thirdQuartile: number;
  max: number;
}

export async function getStatus(): Promise<{ ok: boolean; amadeusConfigured: boolean }> {
  return fetchJson('/status');
}

export async function getContinents(): Promise<string[]> {
  return fetchJson('/continents');
}

export async function getCountries(continent: string): Promise<string[]> {
  return fetchJson('/countries', { continent });
}

export async function getAirports(params: {
  q?: string;
  continent?: string;
  country?: string;
}): Promise<AirportData[]> {
  const p: Record<string, string> = {};
  if (params.q) p.q = params.q;
  if (params.continent) p.continent = params.continent;
  if (params.country) p.country = params.country;
  return fetchJson('/airports', p);
}

export async function discoverDeals(params: {
  continent: string;
  country?: string;
  month: string;
  origin?: string;
}): Promise<{ deals: DealFlight[] }> {
  const p: Record<string, string> = {
    continent: params.continent,
    month: params.month,
  };
  if (params.country) p.country = params.country;
  if (params.origin) p.origin = params.origin;
  return fetchJson('/flights/discover', p);
}

export async function searchFlights(params: {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
}): Promise<{ flights: DealFlight[]; priceMetrics: PriceMetrics | null }> {
  const p: Record<string, string> = {
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
  };
  if (params.returnDate) p.returnDate = params.returnDate;
  return fetchJson('/flights/search', p);
}

export async function getPriceMetrics(params: {
  origin: string;
  destination: string;
  departureDate: string;
}): Promise<{ priceMetrics: PriceMetrics | null }> {
  return fetchJson('/flights/price-metrics', params);
}
