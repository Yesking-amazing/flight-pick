import { searchFlights, getPriceMetrics } from './lib/amadeus.ts';
import { findAirport } from './lib/airports.ts';

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get('origin');
    const destination = url.searchParams.get('destination');
    const departureDate = url.searchParams.get('departureDate');
    const returnDate = url.searchParams.get('returnDate');

    if (!origin || !destination || !departureDate) {
      return Response.json({ error: 'origin, destination, departureDate required' }, { status: 400 });
    }

    const [offers, metrics] = await Promise.all([
      searchFlights(origin, destination, departureDate, returnDate || undefined),
      getPriceMetrics(origin, destination, departureDate),
    ]);

    const destAirport = findAirport(destination);

    const enriched = offers.map(offer => {
      let discountPercent = 0;
      let medianPrice = 0;
      if (metrics) {
        medianPrice = metrics.median;
        if (medianPrice > 0 && offer.price < medianPrice) {
          discountPercent = Math.round(((medianPrice - offer.price) / medianPrice) * 100);
        }
      }
      return {
        ...offer,
        originAirport: findAirport(offer.origin),
        destinationAirport: findAirport(offer.destination) || destAirport,
        medianPrice,
        discountPercent,
        priceMetrics: metrics,
      };
    });

    return Response.json({ flights: enriched, priceMetrics: metrics });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
