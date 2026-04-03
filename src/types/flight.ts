export type Continent = 'North America' | 'South America' | 'Europe' | 'Asia' | 'Africa' | 'Oceania';

export interface Airport {
  code: string;
  city: string;
  country: string;
  continent: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface TrackedRoute {
  id: string;
  origin: Airport;
  destination: Airport;
  addedAt: string;
}
