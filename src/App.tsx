import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './presentation/components/Sidebar';
import Dashboard from './presentation/pages/Dashboard';
import Equipamentos from './presentation/pages/Equipamentos';
import './App.css';

function App() {
  return (
    <Router>
      <Sidebar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/equipamentos" element={<Equipamentos />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
