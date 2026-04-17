import { Info } from 'lucide-react';
import styles from './Intelligence.module.css';

interface Step {
  title: string;
  description: string;
}

interface ProcedureWalkthroughProps {
  title: string;
  description: string;
  steps: Step[];
}

export const ProcedureWalkthrough: React.FC<ProcedureWalkthroughProps> = ({ title, description, steps }) => {
  return (
    <div className={styles.procedureCard}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px', marginBottom: '16px' }}>
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem', color: 'var(--color-accent)' }}>{title}</h3>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.95rem' }}>{description}</p>
      </div>
      
      <div className={styles.stepList}>
        {steps.map((step, idx) => (
          <div key={idx} className={styles.step}>
            <div className={styles.stepNumber}>{idx + 1}</div>
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{step.title}</h4>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.6, lineHeight: '1.4' }}>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Info size={20} color="#3B82F6" />
        <p style={{ margin: 0, fontSize: '0.8rem', color: '#93C5FD' }}>
          Procedural requirements may vary by State. Always consult a local District Legal Services Authority (DLSA) for specifics.
        </p>
      </div>
    </div>
  );
};
