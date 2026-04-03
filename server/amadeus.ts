import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = 'https://test.api.amadeus.com';

let accessToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (accessToken && Date.now() < tokenExpiry) return accessToken;

  const key = process.env.AMADEUS_API_KEY;
  const secret = process.env.AMADEUS_API_SECRET;

  if (!key || !secret || key === 'your_api_key_here') {
    throw new Error('AMADEUS_API_KEY and AMADEUS_API_SECRET must be set in .env');
  }

  const res = await fetch(`${BASE_URL}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: key,
      client_secret: secret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Amadeus auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  accessToken = data.access_token;
  tokenExpiry = Date.now() + (data.expires_in - 30) * 1000;
  console.log('[amadeus] Token acquired, expires in', data.expires_in, 'seconds');
  return accessToken!;
}

async function amadeusGet(path: string, params: Record<string, string> = {}): Promise<any> {
  const token = await getToken();
  const qs = new URLSearchParams(params).toString();
  const url = `${BASE_URL}${path}${qs ? '?' + qs : ''}`;

  console.log(`[amadeus] GET ${url}`);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error(`[amadeus] Error ${res.status}:`, text);
    throw new Error(`Amadeus API error (${res.status}): ${text}`);
  }

  return res.json();
}

export interface FlightOffer {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
  currency: string;
  airline: string;
  duration: string;
  stops: number;
}

export interface CheapDestination {
  destination: string;
  departureDate: string;
  returnDate: string;
  price: number;
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

function parseDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const h = match[1] || '0';
  const m = match[2] || '0';
  return `${h}h ${m}m`;
}

export async function searchFlights(
  origin: string,
  destination: string,
  departureDate: string,
  returnDate?: string,
  adults = 1,
  max = 20,
): Promise<FlightOffer[]> {
  const params: Record<string, string> = {
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate,
    adults: String(adults),
    max: String(max),
    currencyCode: 'USD',
    nonStop: 'false',
  };
  if (returnDate) params.returnDate = returnDate;

  const data = await amadeusGet('/v2/shopping/flight-offers', params);

  return (data.data || []).map((offer: any) => {
    const itin = offer.itineraries[0];
    const segments = itin.segments;
    const firstSeg = segments[0];
    const lastSeg = segments[segments.length - 1];
    return {
      id: offer.id,
      origin: firstSeg.departure.iataCode,
      destination: lastSeg.arrival.iataCode,
      departureDate: firstSeg.departure.at.split('T')[0],
      returnDate: offer.itineraries[1]
        ? offer.itineraries[1].segments[0].departure.at.split('T')[0]
        : '',
      price: parseFloat(offer.price.total),
      currency: offer.price.currency,
      airline: offer.validatingAirlineCodes?.[0] || firstSeg.carrierCode,
      duration: parseDuration(itin.duration),
      stops: segments.length - 1,
    };
  });
}

export async function getCheapDestinations(
  origin: string,
): Promise<CheapDestination[]> {
  const data = await amadeusGet('/v1/shopping/flight-destinations', {
    origin,
    oneWay: 'false',
    nonStop: 'false',
  });

  return (data.data || []).map((d: any) => ({
    destination: d.destination,
    departureDate: d.departureDate,
    returnDate: d.returnDate,
    price: parseFloat(d.price.total),
  }));
}

export async function getPriceMetrics(
  origin: string,
  destination: string,
  departureDate: string,
): Promise<PriceMetrics | null> {
  try {
    const data = await amadeusGet('/v1/analytics/itinerary-price-metrics', {
      originIataCode: origin,
      destinationIataCode: destination,
      departureDate,
      currencyCode: 'USD',
      oneWay: 'false',
    });

    const metric = data.data?.[0];
    if (!metric) return null;

    const prices: Record<string, number> = {};
    for (const pm of metric.priceMetrics || []) {
      prices[pm.quartileRanking] = parseFloat(pm.amount);
    }

    return {
      origin: metric.origin?.iataCode || origin,
      destination: metric.destination?.iataCode || destination,
      departureDate: metric.departureDate || departureDate,
      min: prices['MINIMUM'] || 0,
      firstQuartile: prices['FIRST'] || 0,
      median: prices['MEDIUM'] || 0,
      thirdQuartile: prices['THIRD'] || 0,
      max: prices['MAXIMUM'] || 0,
    };
  } catch {
    return null;
  }
}

export function isConfigured(): boolean {
  const key = process.env.AMADEUS_API_KEY;
  return !!key && key !== 'your_api_key_here';
}
