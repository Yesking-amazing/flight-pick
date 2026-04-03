import { getCountriesForContinent } from './lib/airports.ts';

export default async (req: Request) => {
  const url = new URL(req.url);
  const continent = url.searchParams.get('continent');
  if (!continent) {
    return Response.json({ error: 'continent required' }, { status: 400 });
  }
  return Response.json(getCountriesForContinent(continent));
};
