import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import styles from './Hero.module.css';

export const Hero: React.FC = () => {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.pill}>
          <Sparkles size={16} /> Powered by CrewAI
        </div>
        <h2 className={styles.headline}>
          The modern magistrate for<br />digital justice.
        </h2>
        <p className={styles.subtext}>
          Bridging the gap between legal complexity and human clarity. Our multi-agent AI system drafts formal complaints, identifies IPC sections, and suggests precedents with surgical precision.
        </p>
        <div className={styles.actions}>
          <button className="btn-primary" onClick={() => document.getElementById('query')?.focus()}>
            Start new Complaint <ArrowRight size={18} style={{ verticalAlign: 'middle', marginLeft: 8 }} />
          </button>
          <button className="btn-outlined">
            View Case History
          </button>
        </div>
      </div>
    </section>
  );
};
