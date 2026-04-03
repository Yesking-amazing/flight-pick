import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Waypoints, Bookmark, BookmarkCheck, Calendar } from 'lucide-react';
import { useState } from 'react';
import type { DealFlight } from '../services/api';
import { isRouteTracked, addTrackedRoute, removeTrackedRoute, getTrackedRoutes } from '../services/flightService';
import DealBadge from '../components/DealBadge';

export default function FlightDetail() {
  const location = useLocation();
  const flight = location.state?.flight as DealFlight | undefined;
  const [tracked, setTracked] = useState(() => {
    if (!flight) return false;
    return isRouteTracked(flight.origin, flight.destination);
  });

  if (!flight) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 text-lg">Flight not found.</p>
        <Link to="/" className="text-sky-400 hover:underline mt-4 inline-block">Back to deals</Link>
      </div>
    );
  }

  const metrics = flight.priceMetrics;
  const savings = flight.medianPrice > 0 ? Math.round(flight.medianPrice - flight.price) : 0;

  function toggleTrack() {
    if (!flight) return;
    const origin = flight.originAirport || { code: flight.origin, city: flight.origin, country: '', continent: '' };
    const dest = flight.destinationAirport || { code: flight.destination, city: flight.destination, country: '', continent: '' };

    if (tracked) {
      const routes = getTrackedRoutes();
      const route = routes.find(
        r => r.origin.code === flight.origin && r.destination.code === flight.destination
      );
      if (route) removeTrackedRoute(route.id);
    } else {
      addTrackedRoute({ origin, destination: dest });
    }
    setTracked(!tracked);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6 no-underline">
        <ArrowLeft className="w-4 h-4" />
        Back to deals
      </Link>

      {/* Header */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
          {flight.discountPercent > 0 ? (
            <DealBadge discountPercent={flight.discountPercent} size="md" />
          ) : (
            <span className="text-xs px-3 py-1 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50 font-medium">
              FLIGHT
            </span>
          )}
          <button
            onClick={toggleTrack}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tracked
                ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {tracked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            {tracked ? 'Tracking' : 'Track Route'}
          </button>
        </div>

        <div className="flex items-center gap-5 mb-4">
          <div>
            <div className="text-3xl font-bold text-white">{flight.originAirport?.code || flight.origin}</div>
            <div className="text-sm text-slate-400">
              {flight.originAirport?.city || flight.origin}
              {flight.originAirport?.country && `, ${flight.originAirport.country}`}
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-slate-500 shrink-0" />
          <div>
            <div className="text-3xl font-bold text-white">{flight.destinationAirport?.code || flight.destination}</div>
            <div className="text-sm text-slate-400">
              {flight.destinationAirport?.city || flight.destination}
              {flight.destinationAirport?.country && `, ${flight.destinationAirport.country}`}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          {flight.duration && (
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> {flight.duration}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Waypoints className="w-4 h-4" /> {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" /> {flight.departureDate}
            {flight.returnDate && ` — ${flight.returnDate}`}
          </span>
          <span className="text-slate-500">{flight.airline}</span>
        </div>
      </div>

      {/* Price & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Price metrics visualization */}
        <div className="md:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-white font-bold mb-4">Price Analysis</h3>
          {metrics ? (
            <div>
              {/* Visual price range */}
              <div className="mb-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Cheapest</span>
                  <span>Most Expensive</span>
                </div>
                <div className="relative h-6 bg-slate-700 rounded-full overflow-hidden">
                  {/* Typical range */}
                  <div
                    className="absolute h-full bg-slate-600 rounded-full"
                    style={{
                      left: `${((metrics.firstQuartile - metrics.min) / (metrics.max - metrics.min)) * 100}%`,
                      width: `${((metrics.thirdQuartile - metrics.firstQuartile) / (metrics.max - metrics.min)) * 100}%`,
                    }}
                  />
                  {/* Current price */}
                  <div
                    className={`absolute w-4 h-6 rounded-full ${
                      flight.discountPercent >= 20 ? 'bg-green-400' : flight.discountPercent >= 10 ? 'bg-yellow-400' : 'bg-sky-400'
                    }`}
                    style={{
                      left: `${Math.min(96, Math.max(0, ((flight.price - metrics.min) / (metrics.max - metrics.min)) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-green-400">${Math.round(metrics.min)}</span>
                  <span className="text-slate-400">Median: ${Math.round(metrics.median)}</span>
                  <span className="text-red-400">${Math.round(metrics.max)}</span>
                </div>
              </div>

              {/* Price breakdown */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 mb-1">Min</div>
                  <div className="text-sm font-bold text-green-400">${Math.round(metrics.min)}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 mb-1">25th %</div>
                  <div className="text-sm font-bold text-slate-300">${Math.round(metrics.firstQuartile)}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 mb-1">Median</div>
                  <div className="text-sm font-bold text-slate-300">${Math.round(metrics.median)}</div>
                </div>
                <div className="bg-slate-900/50 rounded-lg p-3 text-center">
                  <div className="text-[10px] text-slate-500 mb-1">Max</div>
                  <div className="text-sm font-bold text-red-400">${Math.round(metrics.max)}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-sm">Price history data not available for this route.</p>
          )}
        </div>

        {/* Price summary */}
        <div className="space-y-3">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <div className="text-xs text-slate-500 mb-1">Current Price</div>
            <div className="text-3xl font-bold text-white">${Math.round(flight.price)}</div>
            {flight.medianPrice > 0 && (
              <div className="text-sm text-slate-500 line-through">${Math.round(flight.medianPrice)}</div>
            )}
          </div>
          {savings > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <div className="text-xs text-green-400 mb-1">Below Median</div>
              <div className="text-2xl font-bold text-green-400">${savings}</div>
              <div className="text-xs text-green-400/60">cheaper than typical</div>
            </div>
          )}
          {flight.discountPercent > 0 && (
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4">
              <div className="text-xs text-orange-400 mb-1">Discount</div>
              <div className="text-2xl font-bold text-orange-400">{flight.discountPercent}% OFF</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
