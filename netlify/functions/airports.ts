import { airports, searchAirports, getAirportsForContinent } from './lib/airports.ts';

export default async (req: Request) => {
  const url = new URL(req.url);
  const q = url.searchParams.get('q') || '';
  const continent = url.searchParams.get('continent');
  const country = url.searchParams.get('country');

  if (continent) {
    return Response.json(getAirportsForContinent(continent, country || undefined));
  }
  if (!q || q.length < 2) {
    return Response.json(airports.slice(0, 20));
  }
  return Response.json(searchAirports(q).slice(0, 10));
};
