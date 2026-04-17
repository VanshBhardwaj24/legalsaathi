import React from 'react';
import { Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';
import styles from './Intelligence.module.css';
import { motion } from 'framer-motion';

interface HighlightCardProps {
  type: 'fact' | 'myth' | 'pro-tip';
  content: string;
}

export const HighlightCard: React.FC<HighlightCardProps> = ({ type, content }) => {
  const getIcon = () => {
    switch (type) {
      case 'fact': return <Lightbulb size={24} color="#FBBF24" />;
      case 'myth': return <ShieldAlert size={24} color="#F87171" />;
      case 'pro-tip': return <Sparkles size={24} color="#818CF8" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'fact': return 'Did You Know?';
      case 'myth': return 'Legal Myth Buster';
      case 'pro-tip': return 'Pro-Counsellor Tip';
    }
  };

  return (
    <motion.div
      className={`${styles.highlightCard} ${styles[type]}`}
      whileHover={{ scale: 1.02 }}
    >
      <div className={styles.highlightHeader}>
        {getIcon()}
        <span>{getTitle()}</span>
      </div>
      <p className={styles.highlightContent}>{content}</p>
    </motion.div>
  );
};
