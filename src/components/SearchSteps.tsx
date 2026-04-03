import { useState, useEffect } from 'react';
import { Globe, MapPin, Calendar, Search, ChevronRight, X } from 'lucide-react';
import { getContinents, getCountries } from '../services/api';

const continentEmojis: Record<string, string> = {
  'North America': '🌎',
  'South America': '🌎',
  'Europe': '🌍',
  'Asia': '🌏',
  'Africa': '🌍',
  'Oceania': '🌏',
};

interface Props {
  onSearch: (params: { continent: string; country?: string; month: string }) => void;
  loading?: boolean;
}

export default function SearchSteps({ onSearch, loading }: Props) {
  const [step, setStep] = useState(1);
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
    if (continent) {
      getCountries(continent).then(setCountries).catch(() => setCountries([]));
    }
  }, [continent]);

  function selectContinent(c: string) {
    setContinent(c);
    setCountry(null);
    setMonth(null);
    setStep(2);
  }

  function selectCountry(c: string | null) {
    setCountry(c);
    setStep(3);
  }

  function selectMonth(m: string) {
    setMonth(m);
    if (continent) {
      onSearch({ continent, country: country || undefined, month: m });
    }
  }

  function reset() {
    setStep(1);
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
      <div className="flex items-center gap-2 mb-6 text-sm">
        <button
          onClick={reset}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            step >= 1 ? 'text-sky-400' : 'text-slate-500'
          } ${continent ? 'bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20' : ''}`}
        >
          <Globe className="w-3.5 h-3.5" />
          {continent || 'Continent'}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <button
          onClick={() => continent && setStep(2)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
            step >= 2 ? 'text-sky-400' : 'text-slate-500'
          } ${country ? 'bg-sky-500/10 border border-sky-500/20 hover:bg-sky-500/20' : ''}`}
        >
          <MapPin className="w-3.5 h-3.5" />
          {country || 'Country'}
          {country && (
            <span className="text-slate-500 text-xs">(optional)</span>
          )}
        </button>
        <ChevronRight className="w-3 h-3 text-slate-600" />
        <span
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
            step >= 3 ? 'text-sky-400' : 'text-slate-500'
          } ${month ? 'bg-sky-500/10 border border-sky-500/20' : ''}`}
        >
          <Calendar className="w-3.5 h-3.5" />
          {month ? months.find(m => m.value === month)?.label : 'Month'}
        </span>

        {(continent || country || month) && (
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1 text-slate-500 hover:text-white text-xs transition-colors"
          >
            <X className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* Step 1: Continent */}
      {step === 1 && (
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

      {/* Step 2: Country (optional) */}
      {step === 2 && continent && (
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

      {/* Step 3: Month */}
      {step === 3 && continent && (
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
          <span className="text-sm">Searching for deals...</span>
        </div>
      )}
    </div>
  );
}
