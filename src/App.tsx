import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Deals from './pages/Deals';
import Tracked from './pages/Tracked';
import FlightDetail from './pages/FlightDetail';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950">
        <Navbar />
        <Routes>
          <Route path="/" element={<Deals />} />
          <Route path="/tracked" element={<Tracked />} />
          <Route path="/flight/:id" element={<FlightDetail />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
