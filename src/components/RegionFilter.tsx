import type { Continent } from '../types/flight';
import { continents, continentEmojis } from '../data/regions';

interface Props {
  selected: Continent | null;
  onSelect: (continent: Continent | null) => void;
}

export default function RegionFilter({ selected, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
          selected === null
            ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'
        }`}
      >
        All Regions
      </button>
      {continents.map(c => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            selected === c
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:border-slate-500'
          }`}
        >
          {continentEmojis[c]} {c}
        </button>
      ))}
    </div>
  );
}
