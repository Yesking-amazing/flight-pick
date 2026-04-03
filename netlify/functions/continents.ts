import { getContinents } from './lib/airports.ts';

export default async () => {
  return Response.json(getContinents());
};
