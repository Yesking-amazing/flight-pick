import { searchFlights, getPriceMetrics } from './lib/amadeus.ts';
import { findAirport, getAirportsForContinent } from './lib/airports.ts';
import type { Config } from '@netlify/functions';

export const config: Config = {
  path: '/api/flights/discover',
};

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const continent = url.searchParams.get('continent');
    const country = url.searchParams.get('country');
    const month = url.searchParams.get('month');
    const originCode = url.searchParams.get('origin');

    if (!continent || !month) {
      return Response.json({ error: 'continent and month required' }, { status: 400 });
    }

    const destAirports = getAirportsForContinent(continent, country || undefined);
    if (destAirports.length === 0) {
      return Response.json({ deals: [] });
    }

    const departureDate = `${month}-15`;

    // Use 1 origin to keep it fast, pick based on continent
    const defaultOrigin = originCode || 'JFK';
    const originAirport = findAirport(defaultOrigin);

    // Skip if origin is in the same continent
    if (originAirport?.continent === continent) {
      return Response.json({ deals: [], note: 'Origin is in the same continent as destination' });
    }

    // Limit to 3 destinations to stay within timeout
    const destinations = destAirports.slice(0, 3);
    const allDeals: any[] = [];

    // Run all destination searches in parallel
    const results = await Promise.allSettled(
      destinations.map(async (dest) => {
        const [offers, metrics] = await Promise.all([
          searchFlights(defaultOrigin, dest.code, departureDate, undefined, 1, 5),
          getPriceMetrics(defaultOrigin, dest.code, departureDate),
        ]);

        return { dest, offers, metrics };
      })
    );

    for (const result of results) {
      if (result.status !== 'fulfilled') continue;
      const { dest, offers, metrics } = result.value;

      for (const offer of offers) {
        let discountPercent = 0;
        let medianPrice = 0;
        if (metrics) {
          medianPrice = metrics.median;
          if (medianPrice > 0 && offer.price < medianPrice) {
            discountPercent = Math.round(
              ((medianPrice - offer.price) / medianPrice) * 100
            );
          }
        }

        allDeals.push({
          id: `${offer.origin}-${offer.destination}-${offer.departureDate}-${offer.id}`,
          origin: offer.origin,
          destination: offer.destination,
          originAirport: findAirport(offer.origin),
          destinationAirport: findAirport(offer.destination) || dest,
          departureDate: offer.departureDate,
          returnDate: offer.returnDate,
          price: offer.price,
          currency: offer.currency,
          airline: offer.airline,
          duration: offer.duration,
          stops: offer.stops,
          medianPrice,
          discountPercent,
          continent: dest.continent,
          country: dest.country,
          priceMetrics: metrics,
        });
      }
    }

    allDeals.sort((a, b) => b.discountPercent - a.discountPercent);
    return Response.json({ deals: allDeals });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
