import { useState } from 'react';
import { Flame, TrendingDown, Plane, AlertTriangle } from 'lucide-react';
import type { DealFlight } from '../services/api';
import { discoverDeals } from '../services/api';
import FlightCard from '../components/FlightCard';
import SearchSteps from '../components/SearchSteps';

export default function Deals() {
  const [deals, setDeals] = useState<DealFlight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    continent: string;
    country?: string;
    month: string;
  } | null>(null);

  async function handleSearch(params: { continent: string; country?: string; month: string }) {
    setLoading(true);
    setError(null);
    setSearchParams(params);
    try {
      const result = await discoverDeals(params);
      setDeals(result.deals);
      setSearched(true);
    } catch (err: any) {
      setError(err.message);
      setDeals([]);
    } finally {
      setLoading(false);
    }
  }

  const hotDeals = deals.filter(d => d.discountPercent >= 30);
  const allDeals = [...deals].sort((a, b) => b.discountPercent - a.discountPercent);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-500/20 flex items-center justify-center">
            <Plane className="w-7 h-7 text-sky-400" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">
          Find Your Next Flight Deal
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Pick a continent, narrow it down by country, choose your month — we'll find the biggest price drops for you.
        </p>
      </div>

      {/* Search Steps */}
      <SearchSteps onSearch={handleSearch} loading={loading} />

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="text-red-400 font-medium text-sm">Something went wrong</div>
            <div className="text-red-400/70 text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Results */}
      {searched && !loading && (
        <>
          {/* Hot Deals */}
          {hotDeals.length > 0 && (
            <section className="mb-10">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white mb-4">
                <Flame className="w-5 h-5 text-orange-400" />
                Hot Deals — Biggest Price Drops
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {hotDeals.slice(0, 4).map(flight => (
                  <FlightCard key={flight.id} flight={flight} />
                ))}
              </div>
            </section>
          )}

          {/* All Deals */}
          <section>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <h2 className="flex items-center gap-2 text-xl font-bold text-white">
                <TrendingDown className="w-5 h-5 text-sky-400" />
                {searchParams?.country
                  ? `${searchParams.country} Deals`
                  : `${searchParams?.continent} Deals`}
              </h2>
              <span className="text-sm text-slate-500">{allDeals.length} deals found</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {allDeals.map(flight => (
                <FlightCard key={flight.id} flight={flight} />
              ))}
            </div>

            {allDeals.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg mb-2">No deals found</p>
                <p className="text-sm">Try a different region or month. The Amadeus test API has limited route coverage.</p>
              </div>
            )}
          </section>
        </>
      )}

      {/* Initial state */}
      {!searched && !loading && (
        <div className="text-center py-12 text-slate-500">
          <TrendingDown className="w-16 h-16 mx-auto mb-4 opacity-15" />
          <p className="text-lg">Pick a continent above to start discovering deals</p>
        </div>
      )}
    </div>
  );
}
