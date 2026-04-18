import React from 'react';
import { Shield, Landmark, Gavel } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Hero } from '../components/Hero';
import { FeatureCard } from '../components/FeatureCard';
import { StatsBar } from '../components/StatsBar';
import { AnalysisForm } from '../components/AnalysisForm';
import { AgentProgress } from '../components/AgentProgress';
import { ResultViewer } from '../components/ResultViewer';
import { ChatPanel } from '../components/ChatPanel';
import { useAnalysis } from '../hooks/useAnalysis';
import { useAuth } from '../context/AuthContext';

export const Home: React.FC = () => {
  const { isAnonymous } = useAuth();
  const { loading, result, agents, savedCaseId, analyze } = useAnalysis(isAnonymous);

  return (
    <main>
      <Hero />
      
      <section className="features-section" style={{ padding: 'var(--section-padding) var(--container-padding)', maxWidth: '1300px', margin: '0 auto' }}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ textAlign: 'center', marginBottom: 'clamp(40px, 8vw, 60px)' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 8vw, 3.5rem)', marginBottom: '20px', lineHeight: 1.1 }}>Justice, Automated.</h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 'clamp(1rem, 4vw, 1.25rem)', maxWidth: '700px', margin: '0 auto' }}>
            LegalSaathi leverages a sophisticated multi-agent orchestration to provide precise, 
            legally-sound assistance for the Indian legal framework.
          </p>
        </motion.div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 350px), 1fr))', 
          gap: 'clamp(16px, 4vw, 32px)' 
        }}>
          <FeatureCard 
            icon={Landmark} 
            title="Indian Law Compliant" 
            description="Built specifically for the Indian Penal Code (IPC) and CrPC, ensuring every draft meets procedural standards." 
            ctaText="LEARN MORE" 
          />
          <FeatureCard 
            icon={Gavel} 
            title="Agentic Research" 
            description="Autonomous agents search high-court precedents and legal databases to strengthen your petition." 
            ctaText="VIEW CAPABILITIES" 
          />
          <FeatureCard 
            icon={Shield} 
            title="Zero-Knowledge Search" 
            description="Privacy-first localized RAG system ensures your data stays secure while searching legal codes." 
            ctaText="SECURE LINK" 
          />
        </div>
      </section>

      <StatsBar />

      <section id="analyze" style={{ padding: 'var(--section-padding) var(--container-padding)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ 
          position: 'absolute', 
          top: '10%', 
          right: '-10%', 
          width: 'clamp(300px, 50vw, 500px)', 
          height: 'clamp(300px, 50vw, 500px)', 
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{ 
              color: 'var(--color-accent)', 
              fontWeight: '800', 
              textTransform: 'uppercase', 
              letterSpacing: '2px',
              fontSize: '0.75rem'
            }}>AI Legal Analysis</span>
            <h2 style={{ fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', marginTop: '12px' }}>Consult the Modern Magistrate</h2>
          </div>
          
          <AnalysisForm onSubmit={analyze} loading={loading} />
          
          <AnimatePresence mode="wait">
            {(loading || agents.some(a => a.status !== 'idle')) && (
              <motion.div
                key="progress"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <AgentProgress steps={agents} />
              </motion.div>
            )}
            
            {result && !loading && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
              >
                <ResultViewer 
                  data={result} 
                  shareUrl={savedCaseId ? `${window.location.origin}/share/${savedCaseId}` : undefined} 
                />
                <ChatPanel context={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <footer style={{ background: 'var(--grad-premium)', color: 'white', padding: 'var(--section-padding) var(--container-padding)', textAlign: 'center' }}>
         <h2 style={{ color: 'white', fontSize: 'clamp(1.75rem, 6vw, 2.5rem)', marginBottom: '24px' }}>Ready to draft your petition?</h2>
         <p style={{ marginBottom: '40px', opacity: 0.7, fontSize: 'clamp(1rem, 4vw, 1.25rem)' }}>Experience the precision of AI-driven legal sovereignty.</p>
         <button className="btn-accent" onClick={() => document.getElementById('query')?.focus()}>
           INITIATE FIRST CASE
         </button>
         <div style={{ marginTop: '60px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '40px', fontSize: '0.875rem', opacity: 0.5 }}>
           © 2025 LegalSaathi AI. Built for the Sovereign Republic of India.
         </div>
      </footer>
    </main>
  );
};
