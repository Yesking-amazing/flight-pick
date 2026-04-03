import { getPriceMetrics } from './lib/amadeus.ts';

export default async (req: Request) => {
  try {
    const url = new URL(req.url);
    const origin = url.searchParams.get('origin');
    const destination = url.searchParams.get('destination');
    const departureDate = url.searchParams.get('departureDate');

    if (!origin || !destination || !departureDate) {
      return Response.json({ error: 'origin, destination, departureDate required' }, { status: 400 });
    }

    const metrics = await getPriceMetrics(origin, destination, departureDate);
    return Response.json({ priceMetrics: metrics });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
};
