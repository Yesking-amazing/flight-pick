import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Waypoints, TrendingDown } from 'lucide-react';
import type { DealFlight } from '../services/api';
import DealBadge from './DealBadge';

interface Props {
  flight: DealFlight;
}

export default function FlightCard({ flight }: Props) {
  const savings = flight.medianPrice > 0 ? Math.round(flight.medianPrice - flight.price) : 0;
  const encodedId = encodeURIComponent(flight.id);

  return (
    <Link
      to={`/flight/${encodedId}`}
      state={{ flight }}
      className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-sky-500/30 hover:bg-slate-800/80 transition-all no-underline group relative overflow-hidden"
    >
      {/* Big discount percentage badge in corner */}
      {flight.discountPercent > 0 && (
        <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-xl font-black text-sm ${
          flight.discountPercent >= 30
            ? 'bg-red-500/90 text-white'
            : flight.discountPercent >= 20
            ? 'bg-orange-500/90 text-white'
            : flight.discountPercent >= 10
            ? 'bg-yellow-500/90 text-black'
            : 'bg-sky-500/90 text-white'
        }`}>
          -{flight.discountPercent}%
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        {flight.discountPercent > 0 ? (
          <DealBadge discountPercent={flight.discountPercent} />
        ) : (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/50 text-slate-400 border border-slate-600/50 font-medium">
            FLIGHT
          </span>
        )}
        <span className="text-xs text-slate-500 mr-12">{flight.airline}</span>
      </div>

      <div className="flex items-center gap-3 mb-1">
        <div className="text-left">
          <div className="text-lg font-bold text-white">
            {flight.originAirport?.code || flight.origin}
          </div>
          <div className="text-xs text-slate-400">
            {flight.originAirport?.city || flight.origin}
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />
        <div className="text-left">
          <div className="text-lg font-bold text-white">
            {flight.destinationAirport?.code || flight.destination}
          </div>
          <div className="text-xs text-slate-400">
            {flight.destinationAirport?.city || flight.destination}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
        {flight.duration && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {flight.duration}
          </span>
        )}
        <span className="flex items-center gap-1">
          <Waypoints className="w-3 h-3" /> {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
        </span>
      </div>

      {/* Price metrics bar */}
      {flight.priceMetrics && (
        <div className="mb-3 bg-slate-900/50 rounded-lg p-2">
          <div className="flex justify-between text-[10px] text-slate-500 mb-1">
            <span>${Math.round(flight.priceMetrics.min)}</span>
            <span>Typical: ${Math.round(flight.priceMetrics.median)}</span>
            <span>${Math.round(flight.priceMetrics.max)}</span>
          </div>
          <div className="relative h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-slate-600 rounded-full"
              style={{
                left: `${((flight.priceMetrics.firstQuartile - flight.priceMetrics.min) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100}%`,
                width: `${((flight.priceMetrics.thirdQuartile - flight.priceMetrics.firstQuartile) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100}%`,
              }}
            />
            <div
              className={`absolute w-2 h-2 rounded-full top-0 -translate-x-1 ${
                flight.discountPercent >= 20 ? 'bg-green-400' : flight.discountPercent >= 10 ? 'bg-yellow-400' : 'bg-sky-400'
              }`}
              style={{
                left: `${Math.min(100, Math.max(0, ((flight.price - flight.priceMetrics.min) / (flight.priceMetrics.max - flight.priceMetrics.min)) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-end justify-between">
        <div>
          <span className="text-2xl font-bold text-white">${Math.round(flight.price)}</span>
          {flight.medianPrice > 0 && flight.medianPrice !== flight.price && (
            <span className="text-sm text-slate-500 line-through ml-2">
              ${Math.round(flight.medianPrice)}
            </span>
          )}
        </div>
        {savings > 0 && (
          <span className="flex items-center gap-1 text-sm text-green-400 font-bold">
            <TrendingDown className="w-3.5 h-3.5" />
            ${savings} cheaper
          </span>
        )}
      </div>

      <div className="text-xs text-slate-500 mt-2">
        {flight.departureDate}
        {flight.returnDate && ` — ${flight.returnDate}`}
      </div>
    </Link>
  );
}
