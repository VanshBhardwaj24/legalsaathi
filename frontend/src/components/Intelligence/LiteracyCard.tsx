import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, ShieldCheck, Download, Copy } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './Intelligence.module.css';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface LiteracyCardProps {
  title: string;
  category: string;
  summary: string;
  content: string;
  mythBusters?: { myth: string; reality: string }[];
  templates?: { name: string; content: string }[];
}

export const LiteracyCard: React.FC<LiteracyCardProps> = ({ 
  title, category, summary, content, mythBusters, templates 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopyTemplate = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard!');
  };

  return (
    <div className={`${styles.literacyCard} ${isExpanded ? styles.expanded : ''}`}>
      <div className={styles.cardHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div className={styles.iconCircle}>
            <BookOpen size={20} />
          </div>
          <div>
            <span className={styles.categoryBadge}>{category}</span>
            <h3 className={styles.cardTitle}>{title}</h3>
            <p className={styles.cardSummary}>{summary}</p>
          </div>
        </div>
        <button className={styles.expandBtn}>
          {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            className={styles.expandedContent}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className={styles.markdownBody}>
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            {mythBusters && mythBusters.length > 0 && (
              <div className={styles.mythSection}>
                <h4 style={{ color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} /> Myth vs. Reality
                </h4>
                {mythBusters.map((mb, i) => (
                  <div key={i} className={styles.mythItem}>
                    <p><strong>Myth:</strong> <em>{mb.myth}</em></p>
                    <p style={{ color: '#10B981' }}><strong>Reality:</strong> {mb.reality}</p>
                  </div>
                ))}
              </div>
            )}

            {templates && templates.length > 0 && (
              <div className={styles.templateSection}>
                <h4><Download size={18} /> Actionable Templates</h4>
                {templates.map((temp, i) => (
                  <div key={i} className={styles.templateItem}>
                    <span>{temp.name}</span>
                    <button onClick={() => handleCopyTemplate(temp.content)}>
                      <Copy size={16} /> Copy Template
                    </button>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
