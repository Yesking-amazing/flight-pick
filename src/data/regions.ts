import type { Continent } from '../types/flight';

export const continents: Continent[] = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Oceania',
];

export const continentEmojis: Record<Continent, string> = {
  'North America': '🌎',
  'South America': '🌎',
  'Europe': '🌍',
  'Asia': '🌏',
  'Africa': '🌍',
  'Oceania': '🌏',
};
