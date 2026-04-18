import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SharedCase } from './pages/SharedCase';
import LegalAid from './pages/LegalAid';
import IntelligenceHub from './pages/IntelligenceHub';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/legal-aid" element={<LegalAid />} />
          <Route path="/intelligence" element={<IntelligenceHub />} />
          <Route path="/case/:id" element={<SharedCase />} />
          <Route path="/share/:id" element={<SharedCase />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
