import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, ChevronRight, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react';
import { VIOLATION_WIZARD } from '../../data/legalLiteracy';
import styles from './Intelligence.module.css';

export const ViolationChecker: React.FC = () => {
  const [activeLogic, setActiveLogic] = useState<typeof VIOLATION_WIZARD[0] | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [results, setResults] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const startChecking = (logic: typeof VIOLATION_WIZARD[0]) => {
    setActiveLogic(logic);
    setStepIndex(0);
    setResults([]);
    setComplete(false);
  };

  const handleAnswer = (advice?: string) => {
    if (advice) setResults([...results, advice]);
    
    if (activeLogic && stepIndex < activeLogic.questions.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      setComplete(true);
    }
  };

  const reset = () => {
    setActiveLogic(null);
    setComplete(false);
    setResults([]);
  };

  if (!activeLogic) {
    return (
      <div className={styles.checkerHero}>
        <div className={styles.heroInfo}>
          <h2><ShieldAlert color="var(--color-accent)" /> Rights Violation Checker</h2>
          <p>Suspicious of a legal breach? Select a scenario to check if your rights were technically violated.</p>
        </div>
        <div className={styles.scenarioGrid}>
          {VIOLATION_WIZARD.map(v => (
            <button key={v.id} onClick={() => startChecking(v)} className={styles.scenarioBtn}>
              {v.title} <ChevronRight size={18} />
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.checkerActive}>
      <div className={styles.checkerHeader}>
        <h3>{activeLogic.title}</h3>
        {!complete && <span className={styles.stepIndicator}>Step {stepIndex + 1} of {activeLogic.questions.length}</span>}
      </div>

      <AnimatePresence mode="wait">
        {!complete ? (
          <motion.div 
            key={stepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={styles.questionCard}
          >
            <p className={styles.questionText}>{activeLogic.questions[stepIndex].text}</p>
            <div className={styles.optionGrid}>
              {activeLogic.questions[stepIndex].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt.advice)} className={styles.optionBtn}>
                  {opt.text}
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.resultsCard}
          >
            <div className={styles.resultsHeader}>
              {results.length > 0 ? <AlertTriangle color="#F59E0B" size={32} /> : <CheckCircle2 color="#10B981" size={32} />}
              <h4>{results.length > 0 ? "Potential Violations Found" : "No Obvious Violations Detected"}</h4>
            </div>
            
            <div className={styles.resultsList}>
              {results.map((r, i) => (
                <div key={i} className={styles.resultItem}>
                  <span>{r}</span>
                </div>
              ))}
              {results.length === 0 && <p className={styles.successMsg}>Based on your answers, the mandatory protocols seem to have been followed.</p>}
            </div>

            <button onClick={reset} className={styles.resetBtn}>
              <RotateCcw size={16} /> Check Another Scenario
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
