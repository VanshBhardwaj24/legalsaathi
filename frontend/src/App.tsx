import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { ThemeProvider } from './context/ThemeContext';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { SharedCase } from './pages/SharedCase';
import LegalAid from './pages/LegalAid';
import IntelligenceHub from './pages/IntelligenceHub';
import { Settings } from './pages/Settings';

export const App: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <ThemeProvider>
      <div className="app">
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '4px', background: 'var(--color-border-subtle)', backdropFilter: 'blur(4px)', zIndex: 10001 }}>
          <div style={{ height: '100%', background: 'var(--grad-vibrant)', width: `${scrollProgress}%`, transition: 'width 0.1s cubic-bezier(0.1, 0.7, 0.1, 1)' }} />
        </div>
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/legal-aid" element={<LegalAid />} />
          <Route path="/intelligence" element={<IntelligenceHub />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/case/:id" element={<SharedCase />} />
          <Route path="/share/:id" element={<SharedCase />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
};

export default App;
