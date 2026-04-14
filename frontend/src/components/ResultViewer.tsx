import React, { useState } from 'react';
import { Copy, FileText, Search, Scale, FileSignature, Sparkles, ExternalLink, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import styles from './ResultViewer.module.css';
import type { AnalysisResult } from '../types/index';

interface ResultViewerProps {
  data: AnalysisResult;
}

const ExpandableSection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <div className={styles.expandableContainer}>
      <div className={`${styles.expandableContent} ${isExpanded ? styles.expanded : styles.collapsed}`}>
        {children}
      </div>
      <button
        className={`${styles.expandBtn} ${isExpanded ? styles.expandedBtn : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <ChevronDown size={16} />
        {isExpanded ? 'Show Less' : 'Show Full Research'}
      </button>
    </div>
  );
};

export const ResultViewer: React.FC<ResultViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'ipc' | 'precedents' | 'draft'>('summary');

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tabs = [
    { id: 'summary', label: 'Case Summary', icon: <FileText size={18} /> },
    { id: 'ipc', label: 'Legal Codes (IPC)', icon: <Search size={18} /> },
    { id: 'precedents' as const, label: 'Research', icon: <Scale size={18} /> },
    { id: 'draft', label: 'Draft Document', icon: <FileSignature size={18} /> },
  ] as const;

  return (
    <div className={`${styles.wrapper} glass-ui`}>
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className={styles.content}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'summary' && (
              <div className={styles.section}>
                <h3>
                  Intake Analysis
                </h3>
                <div className={styles.markdownContent}>
                  <p>{data.structured?.summary || "Analysis in progress..."}</p>
                </div>
                <div className={styles.actions}>
                  {data.structured?.case_type && (
                    <span className={styles.tag}>Classification: {data.structured.case_type}</span>
                  )}
                  {data.structured?.legal_domain && (
                    <span className={styles.tag}>Domain: {data.structured.legal_domain}</span>
                  )}
                  {data.structured?.jurisdiction && (
                    <span className={styles.tag}>Jurisdiction: {data.structured.jurisdiction}</span>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'ipc' && (
              <div className={styles.section}>
                <h3>Relevant Legal Sections</h3>
                {data.structured?.ipc_sections && data.structured.ipc_sections.length > 0 ? (
                  <div className={styles.cards}>
                    {data.structured.ipc_sections.map((ipc, i) => (
                      <motion.div
                        key={i}
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={styles.cardHeader}>
                          <span className={styles.badge}>{ipc.section || "CODE"}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{ipc.chapter}</span>
                        </div>
                        <h4 className={styles.cardTitle}>{ipc.section_title}</h4>
                        <div className={styles.cardMeta}>
                          {ipc.chapter_title}
                        </div>
                        <p className={styles.cardBody}>{ipc.content}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    <p>No specific IPC sections identified for this unique scenario. Consult with the draft for general grouping.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'precedents' && (
              <div className={styles.section}>
                <h3>Research & Jurisprudence</h3>
                {data.structured?.precedents_summary && (
                  <ExpandableSection>
                    <div className={styles.markdownContent}>
                      <ReactMarkdown>{data.structured.precedents_summary}</ReactMarkdown>
                    </div>
                  </ExpandableSection>
                )}
                {data.structured?.precedents && data.structured.precedents.length > 0 ? (
                  <div className={styles.cards}>
                    {data.structured.precedents.map((prec, i) => (
                      <motion.div
                        key={i}
                        className={styles.card}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className={styles.cardHeader}>
                          <span className={styles.badge}>CASE LAW</span>
                          {prec.link && (
                            <a href={prec.link} target="_blank" rel="noopener noreferrer" className={styles.precedentLink}>
                              <ExternalLink size={14} /> Source
                            </a>
                          )}
                        </div>
                        <h4 className={styles.cardTitle}>{prec.title}</h4>
                        <p className={styles.cardBody}>{prec.summary}</p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p>Comprehensive research has not identified specific matching precedents yet.</p>
                )}
              </div>
            )}

            {activeTab === 'draft' && (
              <div className={styles.section}>
                <div className={styles.draftHeader}>
                  <h3>
                    Magistrate's Draft
                  </h3>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-outlined" onClick={() => handleCopy(data.structured?.draft || data.raw)}>
                      <Copy size={16} /> Copy Text
                    </button>
                  </div>
                </div>
                <div className={`${styles.markdownContent} glass-ui`} style={{ padding: '40px', borderRadius: 'var(--radius-md)', background: 'white' }}>
                  <ReactMarkdown>{data.structured?.draft || data.raw}</ReactMarkdown>
                </div>

                <div style={{ marginTop: '40px', padding: '24px', background: 'var(--grad-vibrant)', borderRadius: 'var(--radius-md)', color: 'white' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Sparkles size={20} />
                    <h4 style={{ color: 'white', margin: 0, fontFamily: 'var(--font-body)', textTransform: 'uppercase', letterSpacing: '1px' }}>Strategy Insight</h4>
                  </div>
                  <p style={{ opacity: 0.9, fontSize: '0.95rem' }}>
                    This document has been tailored for the Indian Judicial standards. Ensure all factual dates and entity names are double-checked before filing with the local police jurisdiction.
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
