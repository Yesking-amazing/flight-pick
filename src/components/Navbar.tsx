import { Link, useLocation } from 'react-router-dom';
import { Plane, TrendingDown, Radar } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Deals', icon: TrendingDown },
    { to: '/tracked', label: 'Tracked', icon: Radar },
  ];

  return (
    <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline">
          <Plane className="w-6 h-6 text-sky-400" />
          <span>FlightPick</span>
        </Link>
        <div className="flex gap-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium no-underline transition-colors ${
                pathname === to
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
