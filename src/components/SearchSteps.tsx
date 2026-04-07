import { useState, useEffect } from 'react';
import { Globe, MapPin, Calendar, Search, ChevronRight, X, PlaneTakeoff } from 'lucide-react';
import { getContinents, getCountries, getAirports } from '../services/api';
import type { AirportData } from '../services/api';

const continentEmojis: Record<string, string> = {
  'North America': '🌎',
  'South America': '🌎',
  'Europe': '🌍',
  'Asia': '🌏',
  'Africa': '🌍',
  'Oceania': '🌏',
};

interface SearchParams {
  origin: string;
  continent: string;
  country?: string;
  month: string;
}

interface Props {
  onSearch: (params: SearchParams) => void;
  loading?: boolean;
}

export default function SearchSteps({ onSearch, loading }: Props) {
  const [step, setStep] = useState(1);
  const [origin, setOrigin] = useState<AirportData | null>(null);
  const [originQuery, setOriginQuery] = useState('');
  const [originResults, setOriginResults] = useState<AirportData[]>([]);
  const [continent, setContinent] = useState<string | null>(null);
  const [country, setCountry] = useState<string | null>(null);
  const [month, setMonth] = useState<string | null>(null);

  const [continents, setContinents] = useState<string[]>([]);
  const [countries, setCountries] = useState<string[]>([]);

  useEffect(() => {
    getContinents().then(setContinents).catch(() => {
      setContinents(['North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania']);
    });
  }, []);

  useEffect(() => {
    if (originQuery.length >= 2) {
      getAirports({ q: originQuery }).then(setOriginResults).catch(() => {});
    } else {
      setOriginResults([]);
    }
  }, [originQuery]);

  useEffect(() => {
    if (continent) {
      getCountries(continent).then(setCountries).catch(() => setCountries([]));
    }
  }, [continent]);

  function selectOrigin(airport: AirportData) {
    setOrigin(airport);
    setOriginQuery('');
    setOriginResults([]);
    setContinent(null);
    setCountry(null);
    setMonth(null);
    setStep(2);
  }

  function selectContinent(c: string) {
    setContinent(c);
    setCountry(null);
    setMonth(null);
    setStep(3);
  }

  function selectCountry(c: string | null) {
    setCountry(c);
    setStep(4);
  }

  function selectMonth(m: string) {
    setMonth(m);
    if (origin && continent) {
      onSearch({ origin: origin.code, continent, country: country || undefined, month: m });
    }
  }

  function reset() {
    setStep(1);
    setOrigin(null);
    setOriginQuery('');
    setContinent(null);
    setCountry(null);
    setMonth(null);
  }

  // Generate next 12 months
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() + i);
    return {
      value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
      short: d.toLocaleString('default', { month: 'short' }),
    };
  });

  return (
    <div className="mb-8">
      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6 text-sm flex-wrap">
        <button
          onClick={() => { setStep(1); setOrigin(null); setOriginQuery(''); }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            step >= 1 ? 'text-sky-400' : 'text-slate-500'
          } ${origin ? 'bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20' : ''}`}
        >
          <PlaneTakeoff className="w-3.5 h-3.5" />
          {origin ? `From ${origin.code}` : 'Origin'}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button
          onClick={() => origin && setStep(2)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            step >= 2 ? 'text-sky-400' : 'text-slate-500'
          } ${continent ? 'bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20' : ''}`}
        >
          <Globe className="w-3.5 h-3.5" />
          {continent || 'Continent'}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button
          onClick={() => continent && setStep(3)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            step >= 3 ? 'text-sky-400' : 'text-slate-500'
          } ${country ? 'bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20' : ''}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {country || 'Country'}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            step >= 4 ? 'text-sky-400' : 'text-slate-500'
          } ${month ? 'bg-sky-500/10 border border-sky-500/20' : ''}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {month ? months.find(m => m.value === month)?.label : 'Month'}
        </span>

        {(origin || continent || country || month) && (
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1 text-slate-500 hover:text-white text-xs transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Step 1: Origin airport */}
      {step === 1 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <PlaneTakeoff className="w-5 h-5 text-sky-400" />
            Where are you flying from?
          </h2>
          <div className="max-w-md">
            <input
              type="text"
              placeholder="Search city or airport code (e.g. Zurich, JFK)..."
              value={origin ? `${origin.code} — ${origin.city}, ${origin.country}` : originQuery}
              onChange={e => { setOriginQuery(e.target.value); setOrigin(null); }}
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-sky-500 placeholder:text-slate-500"
              autoFocus
            />
            {originQuery && !origin && originResults.length > 0 && (
              <div className="mt-1 max-h-48 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl">
                {originResults.map(a => (
                  <button
                    key={a.code}
                    onClick={() => selectOrigin(a)}
                    className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border-b border-slate-700/50 last:border-0"
                  >
                    <span className="font-bold text-white">{a.code}</span>
                    <span className="text-slate-400"> — {a.city}, {a.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Quick picks */}
          <div className="mt-4">
            <div className="text-xs text-slate-500 mb-2">Popular airports</div>
            <div className="flex flex-wrap gap-2">
              {[
                { code: 'JFK', city: 'New York', country: 'USA', continent: 'North America' },
                { code: 'LAX', city: 'Los Angeles', country: 'USA', continent: 'North America' },
                { code: 'LHR', city: 'London', country: 'United Kingdom', continent: 'Europe' },
                { code: 'ZRH', city: 'Zurich', country: 'Switzerland', continent: 'Europe' },
                { code: 'SIN', city: 'Singapore', country: 'Singapore', continent: 'Asia' },
                { code: 'SYD', city: 'Sydney', country: 'Australia', continent: 'Oceania' },
              ].map(a => (
                <button
                  key={a.code}
                  onClick={() => selectOrigin(a)}
                  className="px-3 py-2 rounded-lg text-xs bg-slate-800/60 text-slate-400 border border-slate-700/50 hover:border-sky-500/30 hover:text-white transition-colors"
                >
                  <span className="font-bold text-slate-300">{a.code}</span> {a.city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Continent */}
      {step === 2 && origin && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-400" />
            Where do you want to fly?
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {continents.map(c => (
              <button
                key={c}
                onClick={() => selectContinent(c)}
                className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center hover:border-sky-500/30 hover:bg-slate-800 transition-all group"
              >
                <div className="text-3xl mb-2">{continentEmojis[c] || '🌐'}</div>
                <div className="text-sm font-medium text-white group-hover:text-sky-400 transition-colors">
                  {c}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 3: Country (optional) */}
      {step === 3 && continent && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-400" />
            Narrow it down? Pick a country or skip
          </h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => selectCountry(null)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:bg-sky-500/30 transition-colors"
            >
              All of {continent} →
            </button>
            {countries.map(c => (
              <button
                key={c}
                onClick={() => selectCountry(c)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-sky-500/30 hover:text-white transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Month */}
      {step === 4 && continent && (
        <div>
          <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-sky-400" />
            When are you thinking?
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            {months.map(m => (
              <button
                key={m.value}
                onClick={() => selectMonth(m.value)}
                disabled={loading}
                className="px-3 py-3 rounded-xl text-sm font-medium bg-slate-800/60 text-slate-300 border border-slate-700/50 hover:border-sky-500/30 hover:text-white transition-colors disabled:opacity-50"
              >
                <div className="text-white font-bold">{m.short}</div>
                <div className="text-xs text-slate-500">{m.value.split('-')[0]}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center gap-3 mt-6 text-sky-400">
          <Search className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Searching for deals from {origin?.code}...</span>
        </div>
      )}
    </div>
  );
}
