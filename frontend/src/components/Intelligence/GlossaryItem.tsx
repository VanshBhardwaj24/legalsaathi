import React from 'react';
import styles from './Intelligence.module.css';

interface GlossaryItemProps {
  term: string;
  definition: string;
  category: string;
}

export const GlossaryItem: React.FC<GlossaryItemProps> = ({ term, definition, category }) => {
  return (
    <div className={styles.glossaryItem}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ margin: 0, color: 'var(--color-accent)' }}>{term}</h4>
        <span style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>{category}</span>
      </div>
      <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5', opacity: 0.8 }}>{definition}</p>
    </div>
  );
};
