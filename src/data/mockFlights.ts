import type { Airport, Flight, PricePoint } from '../types/flight';

const airports: Airport[] = [
  { code: 'JFK', city: 'New York', country: 'USA', continent: 'North America' },
  { code: 'LAX', city: 'Los Angeles', country: 'USA', continent: 'North America' },
  { code: 'ORD', city: 'Chicago', country: 'USA', continent: 'North America' },
  { code: 'MIA', city: 'Miami', country: 'USA', continent: 'North America' },
  { code: 'YYZ', city: 'Toronto', country: 'Canada', continent: 'North America' },
  { code: 'MEX', city: 'Mexico City', country: 'Mexico', continent: 'North America' },
  { code: 'LHR', city: 'London', country: 'UK', continent: 'Europe' },
  { code: 'CDG', city: 'Paris', country: 'France', continent: 'Europe' },
  { code: 'FCO', city: 'Rome', country: 'Italy', continent: 'Europe' },
  { code: 'BCN', city: 'Barcelona', country: 'Spain', continent: 'Europe' },
  { code: 'AMS', city: 'Amsterdam', country: 'Netherlands', continent: 'Europe' },
  { code: 'IST', city: 'Istanbul', country: 'Turkey', continent: 'Europe' },
  { code: 'NRT', city: 'Tokyo', country: 'Japan', continent: 'Asia' },
  { code: 'BKK', city: 'Bangkok', country: 'Thailand', continent: 'Asia' },
  { code: 'SIN', city: 'Singapore', country: 'Singapore', continent: 'Asia' },
  { code: 'DXB', city: 'Dubai', country: 'UAE', continent: 'Asia' },
  { code: 'DEL', city: 'Delhi', country: 'India', continent: 'Asia' },
  { code: 'ICN', city: 'Seoul', country: 'South Korea', continent: 'Asia' },
  { code: 'GRU', city: 'São Paulo', country: 'Brazil', continent: 'South America' },
  { code: 'EZE', city: 'Buenos Aires', country: 'Argentina', continent: 'South America' },
  { code: 'BOG', city: 'Bogotá', country: 'Colombia', continent: 'South America' },
  { code: 'LIM', city: 'Lima', country: 'Peru', continent: 'South America' },
  { code: 'CPT', city: 'Cape Town', country: 'South Africa', continent: 'Africa' },
  { code: 'NBO', city: 'Nairobi', country: 'Kenya', continent: 'Africa' },
  { code: 'CAI', city: 'Cairo', country: 'Egypt', continent: 'Africa' },
  { code: 'CMN', city: 'Casablanca', country: 'Morocco', continent: 'Africa' },
  { code: 'SYD', city: 'Sydney', country: 'Australia', continent: 'Oceania' },
  { code: 'AKL', city: 'Auckland', country: 'New Zealand', continent: 'Oceania' },
  { code: 'MEL', city: 'Melbourne', country: 'Australia', continent: 'Oceania' },
];

const airlines = [
  'Delta', 'United', 'American Airlines', 'JetBlue', 'Southwest',
  'British Airways', 'Air France', 'Lufthansa', 'Ryanair', 'Emirates',
  'Qatar Airways', 'Singapore Airlines', 'ANA', 'Korean Air', 'LATAM',
  'Turkish Airlines', 'Qantas', 'Air New Zealand', 'Ethiopian Airlines',
  'Royal Air Maroc',
];

function generatePriceHistory(basePrice: number, dropPercent: number): PricePoint[] {
  const points: PricePoint[] = [];
  const now = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    let price: number;
    if (i > 5) {
      // Normal fluctuation around base price
      price = basePrice * (0.9 + Math.random() * 0.2);
    } else if (i > 2) {
      // Start dropping
      const dropFactor = 1 - (dropPercent / 100) * ((5 - i) / 3);
      price = basePrice * dropFactor * (0.95 + Math.random() * 0.1);
    } else {
      // At dropped price
      price = basePrice * (1 - dropPercent / 100) * (0.97 + Math.random() * 0.06);
    }

    points.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price),
    });
  }

  return points;
}

function generateFlight(
  id: string,
  origin: Airport,
  destination: Airport,
  airline: string,
  basePrice: number,
  dropPercent: number,
  stops: number,
  duration: string,
  daysOut: number,
  tripLength: number,
): Flight {
  const priceHistory = generatePriceHistory(basePrice, dropPercent);
  const currentPrice = priceHistory[priceHistory.length - 1].price;
  const previousPrice = priceHistory[priceHistory.length - 4].price;
  const prices = priceHistory.map(p => p.price);

  const dep = new Date();
  dep.setDate(dep.getDate() + daysOut);
  const ret = new Date(dep);
  ret.setDate(ret.getDate() + tripLength);

  return {
    id,
    origin,
    destination,
    airline,
    departureDate: dep.toISOString().split('T')[0],
    returnDate: ret.toISOString().split('T')[0],
    currentPrice,
    previousPrice,
    lowestPrice: Math.min(...prices),
    highestPrice: Math.max(...prices),
    priceHistory,
    continent: destination.continent,
    discountPercent: dropPercent,
    stops,
    duration,
  };
}

const a = (code: string) => airports.find(ap => ap.code === code)!;

export const mockFlights: Flight[] = [
  // HOT DEALS (>30% off)
  generateFlight('f1', a('JFK'), a('LHR'), 'British Airways', 850, 42, 0, '7h 10m', 14, 7),
  generateFlight('f2', a('LAX'), a('NRT'), 'ANA', 1200, 38, 0, '11h 30m', 21, 10),
  generateFlight('f3', a('ORD'), a('BCN'), 'American Airlines', 780, 45, 1, '10h 45m', 18, 9),
  generateFlight('f4', a('MIA'), a('GRU'), 'LATAM', 650, 35, 0, '8h 20m', 12, 8),
  generateFlight('f5', a('JFK'), a('CDG'), 'Air France', 720, 40, 0, '7h 30m', 20, 6),
  generateFlight('f6', a('LAX'), a('SYD'), 'Qantas', 1400, 33, 1, '15h 30m', 30, 14),
  generateFlight('f7', a('ORD'), a('IST'), 'Turkish Airlines', 680, 48, 1, '11h 15m', 16, 7),
  generateFlight('f8', a('JFK'), a('DXB'), 'Emirates', 950, 36, 0, '12h 40m', 25, 10),

  // GOOD DEALS (15-30% off)
  generateFlight('f9', a('MIA'), a('BOG'), 'LATAM', 380, 28, 0, '3h 45m', 10, 5),
  generateFlight('f10', a('LAX'), a('MEX'), 'American Airlines', 320, 25, 0, '3h 30m', 8, 4),
  generateFlight('f11', a('JFK'), a('FCO'), 'Delta', 890, 22, 1, '9h 15m', 22, 8),
  generateFlight('f12', a('ORD'), a('AMS'), 'United', 750, 20, 0, '8h 30m', 15, 7),
  generateFlight('f13', a('LAX'), a('BKK'), 'Korean Air', 980, 26, 1, '17h 20m', 28, 12),
  generateFlight('f14', a('JFK'), a('SIN'), 'Singapore Airlines', 1100, 18, 1, '18h 45m', 35, 14),
  generateFlight('f15', a('MIA'), a('LIM'), 'LATAM', 420, 30, 0, '5h 50m', 11, 6),
  generateFlight('f16', a('ORD'), a('LHR'), 'United', 680, 22, 0, '8h 05m', 13, 5),
  generateFlight('f17', a('LAX'), a('ICN'), 'Korean Air', 870, 24, 0, '13h 10m', 19, 9),
  generateFlight('f18', a('JFK'), a('CPT'), 'Delta', 1050, 27, 1, '16h 30m', 40, 12),

  // MODERATE DEALS (5-15% off)
  generateFlight('f19', a('ORD'), a('YYZ'), 'Air France', 280, 12, 0, '1h 40m', 7, 3),
  generateFlight('f20', a('LAX'), a('AKL'), 'Air New Zealand', 1350, 15, 0, '12h 50m', 45, 14),
  generateFlight('f21', a('JFK'), a('NBO'), 'Ethiopian Airlines', 780, 10, 1, '14h 20m', 30, 10),
  generateFlight('f22', a('MIA'), a('EZE'), 'American Airlines', 720, 14, 1, '10h 15m', 20, 8),
  generateFlight('f23', a('ORD'), a('DEL'), 'United', 920, 8, 1, '15h 40m', 25, 11),
  generateFlight('f24', a('LAX'), a('CDG'), 'Air France', 810, 11, 0, '10h 30m', 17, 7),
  generateFlight('f25', a('JFK'), a('CAI'), 'Turkish Airlines', 690, 13, 1, '11h 55m', 22, 9),
  generateFlight('f26', a('MIA'), a('CMN'), 'Royal Air Maroc', 580, 9, 0, '9h 10m', 15, 6),
  generateFlight('f27', a('ORD'), a('MEL'), 'Qantas', 1500, 7, 1, '20h 30m', 50, 14),
  generateFlight('f28', a('LAX'), a('FCO'), 'Delta', 920, 16, 1, '12h 20m', 24, 8),

  // MORE VARIETY
  generateFlight('f29', a('YYZ'), a('LHR'), 'British Airways', 740, 32, 0, '7h 20m', 16, 7),
  generateFlight('f30', a('YYZ'), a('NRT'), 'ANA', 1050, 29, 1, '13h 40m', 28, 10),
  generateFlight('f31', a('MEX'), a('BCN'), 'Lufthansa', 890, 37, 1, '12h 05m', 19, 9),
  generateFlight('f32', a('MEX'), a('GRU'), 'LATAM', 550, 21, 0, '8h 45m', 14, 7),
  generateFlight('f33', a('JFK'), a('BKK'), 'Qatar Airways', 1080, 41, 1, '19h 10m', 32, 12),
  generateFlight('f34', a('LAX'), a('IST'), 'Turkish Airlines', 780, 34, 1, '14h 25m', 20, 8),
  generateFlight('f35', a('ORD'), a('DXB'), 'Emirates', 890, 31, 0, '13h 50m', 26, 10),
  generateFlight('f36', a('MIA'), a('BCN'), 'JetBlue', 620, 39, 0, '9h 30m', 17, 6),
  generateFlight('f37', a('JFK'), a('AKL'), 'Air New Zealand', 1500, 25, 1, '20h 15m', 55, 14),
  generateFlight('f38', a('LAX'), a('BOG'), 'LATAM', 450, 23, 1, '7h 15m', 12, 5),
  generateFlight('f39', a('ORD'), a('SIN'), 'Singapore Airlines', 1150, 19, 1, '18h 30m', 33, 11),
  generateFlight('f40', a('MIA'), a('CAI'), 'Emirates', 820, 17, 1, '13h 40m', 24, 9),
];
