import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './presentation/components/Sidebar';
import Dashboard from './presentation/pages/Dashboard';
import Clients from './presentation/pages/Clients';
import Equipamentos from './presentation/pages/Equipamentos';
import './App.css';

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, []);

  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipamentos" element={<Equipamentos />} />
          <Route path="/clients" element={<Clients />} /> {/* Placeholder for Clients page */}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
