import express from 'express';
import cors from 'cors';
import {
  searchFlights,
  getCheapDestinations,
  getPriceMetrics,
  isConfigured,
} from './amadeus.js';
import {
  airports,
  findAirport,
  searchAirports,
  getCountriesForContinent,
  getAirportsForContinent,
  getContinents,
} from './airports.js';

const app = express();
app.use(cors());
app.use(express.json());

// Health check + config status
app.get('/api/status', (_req, res) => {
  res.json({ ok: true, amadeusConfigured: isConfigured() });
});

// Get all continents
app.get('/api/continents', (_req, res) => {
  res.json(getContinents());
});

// Get countries for a continent
app.get('/api/countries', (req, res) => {
  const continent = req.query.continent as string;
  if (!continent) return res.status(400).json({ error: 'continent required' });
  res.json(getCountriesForContinent(continent));
});

// Airport search for autocomplete
app.get('/api/airports', (req, res) => {
  const q = (req.query.q as string) || '';
  const continent = req.query.continent as string | undefined;
  const country = req.query.country as string | undefined;

  if (continent) {
    return res.json(getAirportsForContinent(continent, country || undefined));
  }
  if (!q || q.length < 2) {
    return res.json(airports.slice(0, 20));
  }
  res.json(searchAirports(q).slice(0, 10));
});

// Discover deals: continent + optional country + month
// Searches from major hub airports to destinations in the selected region
app.get('/api/flights/discover', async (req, res) => {
  try {
    const continent = req.query.continent as string;
    const country = req.query.country as string | undefined;
    const month = req.query.month as string; // YYYY-MM format
    const originCode = req.query.origin as string | undefined;

    if (!continent || !month) {
      return res.status(400).json({ error: 'continent and month required' });
    }

    // Get destination airports in the selected continent/country
    const destAirports = getAirportsForContinent(continent, country || undefined);
    if (destAirports.length === 0) {
      return res.json({ deals: [] });
    }

    // Pick a departure date in the middle of the month
    const departureDate = `${month}-15`;

    // Use the provided origin or default to a major hub
    const origins = originCode
      ? [originCode]
      : ['JFK', 'LAX', 'LHR', 'SIN'];

    const allDeals: any[] = [];

    // Search from each origin to each destination
    for (const origin of origins) {
      // Skip if origin is in the same continent we're searching for deals in
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
        } catch (err) {
          // Skip failed routes silently
          console.warn(`[api] Skipping ${origin}->${dest.code}:`, (err as Error).message);
        }
      }
    }

    // Sort by discount %, biggest first
    allDeals.sort((a, b) => b.discountPercent - a.discountPercent);

    res.json({ deals: allDeals });
  } catch (err: any) {
    console.error('[api] /flights/discover error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Search flight offers for a specific route
app.get('/api/flights/search', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate } = req.query as Record<string, string>;
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'origin, destination, departureDate required' });
    }

    const [offers, metrics] = await Promise.all([
      searchFlights(origin, destination, departureDate, returnDate),
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

    res.json({ flights: enriched, priceMetrics: metrics });
  } catch (err: any) {
    console.error('[api] /flights/search error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get price metrics for a specific route (for tracked routes)
app.get('/api/flights/price-metrics', async (req, res) => {
  try {
    const { origin, destination, departureDate } = req.query as Record<string, string>;
    if (!origin || !destination || !departureDate) {
      return res.status(400).json({ error: 'origin, destination, departureDate required' });
    }

    const metrics = await getPriceMetrics(origin, destination, departureDate);
    res.json({ priceMetrics: metrics });
  } catch (err: any) {
    console.error('[api] /flights/price-metrics error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`[server] Running on http://localhost:${PORT}`);
  console.log(`[server] Amadeus configured: ${isConfigured()}`);
});
