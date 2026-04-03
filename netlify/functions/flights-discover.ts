import { searchFlights, getPriceMetrics } from './lib/amadeus.ts';
import { findAirport, getAirportsForContinent } from './lib/airports.ts';

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

    const origins = originCode
      ? [originCode]
      : ['JFK', 'LAX', 'LHR', 'SIN'];

    const allDeals: any[] = [];

    for (const origin of origins) {
      const originAirport = findAirport(origin);
      if (originAirport?.continent === continent) continue;

      for (const dest of destAirports.slice(0, 5)) {
        try {
          const [offers, metrics] = await Promise.all([
            searchFlights(origin, dest.code, departureDate, undefined, 1, 3),
            getPriceMetrics(origin, dest.code, departureDate),
          ]);

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
        } catch {
          // Skip failed routes
        }
      }
    }

    allDeals.sort((a, b) => b.discountPercent - a.discountPercent);
    return Response.json({ deals: allDeals });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
