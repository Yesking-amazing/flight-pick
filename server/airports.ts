export interface AirportData {
  code: string;
  city: string;
  country: string;
  continent: string;
}

export const airports: AirportData[] = [
  // North America
  { code: 'JFK', city: 'New York', country: 'USA', continent: 'North America' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', continent: 'North America' },
  { code: 'ORD', city: 'Chicago', country: 'USA', continent: 'North America' },
  { code: 'SFO', city: 'San Francisco', country: 'USA', continent: 'North America' },
  { code: 'MIA', city: 'Miami', country: 'USA', continent: 'North America' },
  { code: 'ATL', city: 'Atlanta', country: 'USA', continent: 'North America' },
  { code: 'DFW', city: 'Dallas', country: 'USA', continent: 'North America' },
  { code: 'SEA', city: 'Seattle', country: 'USA', continent: 'North America' },
  { code: 'BOS', city: 'Boston', country: 'USA', continent: 'North America' },
  { code: 'DEN', city: 'Denver', country: 'USA', continent: 'North America' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', continent: 'North America' },
  { code: 'YVR', city: 'Vancouver', country: 'Canada', continent: 'North America' },
  { code: 'YUL', city: 'Montreal', country: 'Canada', continent: 'North America' },
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', continent: 'North America' },
  { code: 'CUN', city: 'Cancun', country: 'Mexico', continent: 'North America' },

  // Europe
  { code: 'LHR', city: 'London', country: 'United Kingdom', continent: 'Europe' },
  { code: 'CDG', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'FRA', city: 'Frankfurt', country: 'Germany', continent: 'Europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', continent: 'Europe' },
  { code: 'MAD', city: 'Madrid', country: 'Spain', continent: 'Europe' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', continent: 'Europe' },
  { code: 'FCO', city: 'Rome', country: 'Italy', continent: 'Europe' },
  { code: 'MXP', city: 'Milan', country: 'Italy', continent: 'Europe' },
  { code: 'MUC', city: 'Munich', country: 'Germany', continent: 'Europe' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'ZRH', city: 'Zurich', country: 'Switzerland', continent: 'Europe' },
  { code: 'LIS', city: 'Lisbon', country: 'Portugal', continent: 'Europe' },
  { code: 'ATH', city: 'Athens', country: 'Greece', continent: 'Europe' },
  { code: 'CPH', city: 'Copenhagen', country: 'Denmark', continent: 'Europe' },
  { code: 'OSL', city: 'Oslo', country: 'Norway', continent: 'Europe' },
  { code: 'ARN', city: 'Stockholm', country: 'Sweden', continent: 'Europe' },
  { code: 'DUB', city: 'Dublin', country: 'Ireland', continent: 'Europe' },
  { code: 'VIE', city: 'Vienna', country: 'Austria', continent: 'Europe' },
  { code: 'PRG', city: 'Prague', country: 'Czech Republic', continent: 'Europe' },
  { code: 'WAW', city: 'Warsaw', country: 'Poland', continent: 'Europe' },

  // Asia
  { code: 'NRT', city: 'Tokyo Narita', country: 'Japan', continent: 'Asia' },
  { code: 'HND', city: 'Tokyo Haneda', country: 'Japan', continent: 'Asia' },
  { code: 'KIX', city: 'Osaka', country: 'Japan', continent: 'Asia' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'PEK', city: 'Beijing', country: 'China', continent: 'Asia' },
  { code: 'PVG', city: 'Shanghai', country: 'China', continent: 'Asia' },
  { code: 'HKG', city: 'Hong Kong', country: 'Hong Kong', continent: 'Asia' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', continent: 'Asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'DEL', city: 'Delhi', country: 'India', continent: 'Asia' },
  { code: 'BOM', city: 'Mumbai', country: 'India', continent: 'Asia' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', continent: 'Asia' },
  { code: 'KUL', city: 'Kuala Lumpur', country: 'Malaysia', continent: 'Asia' },
  { code: 'MNL', city: 'Manila', country: 'Philippines', continent: 'Asia' },
  { code: 'SGN', city: 'Ho Chi Minh City', country: 'Vietnam', continent: 'Asia' },
  { code: 'TPE', city: 'Taipei', country: 'Taiwan', continent: 'Asia' },
  { code: 'DOH', city: 'Doha', country: 'Qatar', continent: 'Asia' },

  // South America
  { code: 'GRU', city: 'Sao Paulo', country: 'Brazil', continent: 'South America' },
  { code: 'GIG', city: 'Rio de Janeiro', country: 'Brazil', continent: 'South America' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'SCL', city: 'Santiago', country: 'Chile', continent: 'South America' },
  { code: 'BOG', city: 'Bogota', country: 'Colombia', continent: 'South America' },
  { code: 'LIM', city: 'Lima', country: 'Peru', continent: 'South America' },
  { code: 'UIO', city: 'Quito', country: 'Ecuador', continent: 'South America' },
  { code: 'CCS', city: 'Caracas', country: 'Venezuela', continent: 'South America' },

  // Africa
  { code: 'JNB', city: 'Johannesburg', country: 'South Africa', continent: 'Africa' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', continent: 'Africa' },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', continent: 'Africa' },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', continent: 'Africa' },
  { code: 'ADD', city: 'Addis Ababa', country: 'Ethiopia', continent: 'Africa' },
  { code: 'LOS', city: 'Lagos', country: 'Nigeria', continent: 'Africa' },
  { code: 'ACC', city: 'Accra', country: 'Ghana', continent: 'Africa' },

  // Oceania
  { code: 'SYD', city: 'Sydney', country: 'Australia', continent: 'Oceania' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', continent: 'Oceania' },
  { code: 'BNE', city: 'Brisbane', country: 'Australia', continent: 'Oceania' },
  { code: 'PER', city: 'Perth', country: 'Australia', continent: 'Oceania' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', continent: 'Oceania' },
  { code: 'CHC', city: 'Christchurch', country: 'New Zealand', continent: 'Oceania' },
  { code: 'NAN', city: 'Nadi', country: 'Fiji', continent: 'Oceania' },
];

export function findAirport(code: string): AirportData | undefined {
  return airports.find(a => a.code === code);
}

export function searchAirports(query: string): AirportData[] {
  const q = query.toLowerCase();
  return airports.filter(
    a =>
      a.code.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q)
  );
}

export function getCountriesForContinent(continent: string): string[] {
  const countries = new Set<string>();
  for (const a of airports) {
    if (a.continent === continent) countries.add(a.country);
  }
  return [...countries].sort();
}

export function getAirportsForContinent(continent: string, country?: string): AirportData[] {
  return airports.filter(a => {
    if (a.continent !== continent) return false;
    if (country && a.country !== country) return false;
    return true;
  });
}

export function getContinents(): string[] {
  const set = new Set<string>();
  for (const a of airports) set.add(a.continent);
  return [...set].sort();
}
