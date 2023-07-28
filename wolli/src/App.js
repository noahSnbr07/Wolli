import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './config/Navbar.jsx';
import Welcome from './pages/fullscreen/Welcome';
import Settings from './pages/fullscreen/Settings';
import Match from './pages/fullscreen/Match';
import History from './pages/inserted/History';
import Statistic from './pages/inserted/Statistic';
export default function App() {
  return (
    <div className="App">
      <Routes>
        {/* FULLSCREEN PAGES */}
        <Route path='/' element={<Welcome />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/match' element={<Match />} />
        <Route path='/history' element={<History />} />
        <Route path='/statistic' element={<Statistic />} />
      </Routes>
    </div>
  );
}