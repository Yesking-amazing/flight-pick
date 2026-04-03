import { useState, useEffect } from 'react';
import { Radar, Plus, Trash2, ArrowRight, Search, AlertTriangle } from 'lucide-react';
import type { TrackedRoute } from '../types/flight';
import type { DealFlight } from '../services/api';
import {
  getTrackedRoutes,
  addTrackedRoute,
  removeTrackedRoute,
} from '../services/flightService';
import { searchFlights, getAirports } from '../services/api';
import type { AirportData } from '../services/api';
import DealBadge from '../components/DealBadge';

export default function Tracked() {
  const [routes, setRoutes] = useState<TrackedRoute[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [originSearch, setOriginSearch] = useState('');
  const [destSearch, setDestSearch] = useState('');
  const [originResults, setOriginResults] = useState<AirportData[]>([]);
  const [destResults, setDestResults] = useState<AirportData[]>([]);
  const [selectedOrigin, setSelectedOrigin] = useState<AirportData | null>(null);
  const [selectedDest, setSelectedDest] = useState<AirportData | null>(null);
  const [routeFlights, setRouteFlights] = useState<Record<string, DealFlight | null>>({});
  const [loadingRoutes, setLoadingRoutes] = useState<Set<string>>(new Set());

  useEffect(() => {
    setRoutes(getTrackedRoutes());
  }, []);

  // Search airports as user types
  useEffect(() => {
    if (originSearch.length >= 2) {
      getAirports({ q: originSearch }).then(setOriginResults).catch(() => {});
    } else {
      setOriginResults([]);
    }
  }, [originSearch]);

  useEffect(() => {
    if (destSearch.length >= 2) {
      getAirports({ q: destSearch }).then(setDestResults).catch(() => {});
    } else {
      setDestResults([]);
    }
  }, [destSearch]);

  // Fetch best flights for tracked routes
  useEffect(() => {
    for (const route of routes) {
      if (routeFlights[route.id] !== undefined) continue;
      setLoadingRoutes(prev => new Set(prev).add(route.id));

      // Search for flights departing in the next month
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const depDate = nextMonth.toISOString().split('T')[0];

      searchFlights({
        origin: route.origin.code,
        destination: route.destination.code,
        departureDate: depDate,
      })
        .then(result => {
          const best = result.flights.sort((a, b) => b.discountPercent - a.discountPercent)[0] || null;
          setRouteFlights(prev => ({ ...prev, [route.id]: best }));
        })
        .catch(() => {
          setRouteFlights(prev => ({ ...prev, [route.id]: null }));
        })
        .finally(() => {
          setLoadingRoutes(prev => {
            const next = new Set(prev);
            next.delete(route.id);
            return next;
          });
        });
    }
  }, [routes]);

  function handleAdd() {
    if (!selectedOrigin || !selectedDest) return;
    addTrackedRoute({ origin: selectedOrigin, destination: selectedDest });
    setRoutes(getTrackedRoutes());
    setShowAdd(false);
    setOriginSearch('');
    setDestSearch('');
    setSelectedOrigin(null);
    setSelectedDest(null);
  }

  function handleRemove(id: string) {
    removeTrackedRoute(id);
    setRoutes(getTrackedRoutes());
    setRouteFlights(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Radar className="w-8 h-8 text-sky-400" />
            Tracked Routes
          </h1>
          <p className="text-slate-400 mt-1">Monitor price changes on your favorite routes</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Track Route
        </button>
      </div>

      {/* Add Route Panel */}
      {showAdd && (
        <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 mb-8">
          <h3 className="text-white font-bold mb-4">Add a Route to Track</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-slate-400 block mb-1">From</label>
              <input
                type="text"
                placeholder="Search city or airport code..."
                value={selectedOrigin ? `${selectedOrigin.code} — ${selectedOrigin.city}` : originSearch}
                onChange={e => {
                  setOriginSearch(e.target.value);
                  setSelectedOrigin(null);
                }}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
              />
              {originSearch && !selectedOrigin && originResults.length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto bg-slate-900 border border-slate-600 rounded-lg">
                  {originResults.map(a => (
                    <button
                      key={a.code}
                      onClick={() => { setSelectedOrigin(a); setOriginSearch(''); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      {a.code} — {a.city}, {a.country}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div>
              <label className="text-sm text-slate-400 block mb-1">To</label>
              <input
                type="text"
                placeholder="Search city or airport code..."
                value={selectedDest ? `${selectedDest.code} — ${selectedDest.city}` : destSearch}
                onChange={e => {
                  setDestSearch(e.target.value);
                  setSelectedDest(null);
                }}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-sky-500"
              />
              {destSearch && !selectedDest && destResults.length > 0 && (
                <div className="mt-1 max-h-32 overflow-y-auto bg-slate-900 border border-slate-600 rounded-lg">
                  {destResults.map(a => (
                    <button
                      key={a.code}
                      onClick={() => { setSelectedDest(a); setDestSearch(''); }}
                      className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
                    >
                      {a.code} — {a.city}, {a.country}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleAdd}
              disabled={!selectedOrigin || !selectedDest}
              className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Add Route
            </button>
            <button
              onClick={() => { setShowAdd(false); setOriginSearch(''); setDestSearch(''); setSelectedOrigin(null); setSelectedDest(null); }}
              className="px-4 py-2 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Tracked Routes List */}
      {routes.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          <Radar className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p className="text-lg mb-2">No tracked routes yet</p>
          <p className="text-sm">Click "Track Route" to start monitoring price changes</p>
        </div>
      ) : (
        <div className="space-y-4">
          {routes.map(route => {
            const flight = routeFlights[route.id];
            const isLoading = loadingRoutes.has(route.id);

            return (
              <div
                key={route.id}
                className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <div className="text-xl font-bold text-white">{route.origin.code}</div>
                        <div className="text-xs text-slate-400">{route.origin.city}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                      <div>
                        <div className="text-xl font-bold text-white">{route.destination.code}</div>
                        <div className="text-xs text-slate-400">{route.destination.city}</div>
                      </div>
                    </div>
                    {flight && flight.discountPercent > 0 && (
                      <DealBadge discountPercent={flight.discountPercent} />
                    )}
                  </div>
                  <button
                    onClick={() => handleRemove(route.id)}
                    className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {isLoading ? (
                  <div className="flex items-center gap-2 py-4 text-slate-500 text-sm">
                    <Search className="w-4 h-4 animate-pulse" />
                    Checking prices...
                  </div>
                ) : flight ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Price range bar */}
                    {flight.priceMetrics && (
                      <div className="md:col-span-2 bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-500 mb-2">Price range for this route</div>
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>${Math.round(flight.priceMetrics.min)}</span>
                          <span>Typical: ${Math.round(flight.priceMetrics.median)}</span>
                          <span>${Math.round(flight.priceMetrics.max)}</span>
                        </div>
                        <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="absolute h-full bg-slate-600 rounded-full"
                            style={{
                              left: `${((flight.priceMetrics.firstQuartile - flight.priceMetrics.min) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100}%`,
                              width: `${((flight.priceMetrics.thirdQuartile - flight.priceMetrics.firstQuartile) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100}%`,
                            }}
                          />
                          <div
                            className={`absolute w-3 h-3 rounded-full ${
                              flight.discountPercent >= 20 ? 'bg-green-400' : flight.discountPercent >= 10 ? 'bg-yellow-400' : 'bg-sky-400'
                            }`}
                            style={{
                              left: `${Math.min(97, Math.max(0, ((flight.price - flight.priceMetrics.min) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <div className="space-y-3">
                      <div className="bg-slate-900/50 rounded-lg p-3">
                        <div className="text-xs text-slate-500">Best Price Found</div>
                        <div className="text-2xl font-bold text-white">${Math.round(flight.price)}</div>
                      </div>
                      {flight.medianPrice > 0 && flight.price < flight.medianPrice && (
                        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                          <div className="text-xs text-green-400">Below Typical</div>
                          <div className="text-lg font-bold text-green-400">
                            ${Math.round(flight.medianPrice - flight.price)} cheaper
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 py-4 text-slate-500 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    Couldn't fetch prices for this route. The API may not cover it.
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
