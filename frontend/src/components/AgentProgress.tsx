import React from 'react';
import styles from './AgentProgress.module.css';

export type AgentStatus = 'idle' | 'active' | 'complete' | 'error';

export interface AgentStep {
  id: string;
  name: string;
  status: AgentStatus;
}

interface AgentProgressProps {
  steps: AgentStep[];
}

export const AgentProgress: React.FC<AgentProgressProps> = ({ steps }) => {
  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Live Workflow Progress</h3>
      <div className={styles.stepper}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`${styles.step} ${styles[step.status]}`}>
              <div className={styles.circle}>
                {step.status === 'complete' ? '✓' : index + 1}
              </div>
              <span className={styles.label}>{step.name}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`${styles.line} ${steps[index].status === 'complete' ? styles.lineActive : ''}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
