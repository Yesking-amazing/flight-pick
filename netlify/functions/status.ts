import { isConfigured } from './lib/amadeus.ts';

export default async () => {
  return Response.json({ ok: true, amadeusConfigured: isConfigured() });
};
