import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Menu from './components/Menu';
import SavedCasts from './components/SavedCasts';
import About from './components/About';
import Donate from './components/Donate';
import './App.css';

function App() {
  return (
    <Router>
      <Menu />
      <Routes>
        <Route path="/" element={<SavedCasts />} />
        <Route path="/about" element={<About />} />
        <Route path="/donate" element={<Donate />} />
      </Routes>
    </Router>
  );
}

export default App;
