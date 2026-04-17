import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, Book, Clock, MapPin, Search, Gavel, AlertCircle, RefreshCw } from 'lucide-react';
import { NewsCard } from '../components/Intelligence/NewsCard';
import { GlossaryItem } from '../components/Intelligence/GlossaryItem';
import { ProcedureWalkthrough } from '../components/Intelligence/ProcedureWalkthrough';
import { FULL_GLOSSARY } from '../data/legalGlossary';
import { PROCEDURAL_GUIDES, LIMITATION_PERIODS, JURISDICTION_MAP } from '../data/legalProcedures';
import { CONFIG } from '../config';
import styles from '../components/Intelligence/Intelligence.module.css';

export default function IntelligenceHub() {
  const [activeTab, setActiveTab] = useState<'news' | 'glossary' | 'procedures'>('news');
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNews = async () => {
    setLoadingNews(true);
    setNewsError(false);
    try {
      const resp = await fetch(`${CONFIG.API_URL}/api/news`);
      if (!resp.ok) throw new Error('Source offline');
      const data = await resp.json();
      setNews(data);
    } catch (e) {
      console.error('Failed to load news wire');
      setNewsError(true);
    } finally {
      setLoadingNews(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredGlossary = useMemo(() => {
    if (!searchQuery) return FULL_GLOSSARY;
    const q = searchQuery.toLowerCase();
    return FULL_GLOSSARY.filter(item => 
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className={styles.hubWrapper}>
      <header className={styles.hubHeader}>
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Intelligence Hub
        </motion.h1>
        <p>The Supreme Legal Saathi Legal Compass: Research, News, and Procedural Guidance.</p>
      </header>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}>
        {[
          { id: 'news', label: 'News Wire', icon: <Newspaper size={18} /> },
          { id: 'procedures', label: 'When, Where, How', icon: <Gavel size={18} /> },
          { id: 'glossary', label: 'Legal Glossary', icon: <Book size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-${activeTab === tab.id ? 'accent' : 'outlined'}`}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '14px' }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'news' && (
          <motion.div 
            key="news"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.grid}
          >
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2><Newspaper /> Real-Time Legal Headlines</h2>
                <div className="badge badge-accent">Live Updates</div>
              </div>
              
              {loadingNews ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                  <div className="loader" />
                </div>
              ) : newsError ? (
                <div style={{ textAlign: 'center', padding: '60px', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '24px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                  <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
                  <h3>Legal News Wire Offline</h3>
                  <p style={{ opacity: 0.7, marginBottom: '24px' }}>We're unable to reach our primary legal sources at the moment.</p>
                  <button className="btn-outlined" onClick={fetchNews} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <RefreshCw size={16} /> Retry Connection
                  </button>
                </div>
              ) : (
                <div className={styles.newsGrid}>
                  {news.map((item, i) => (
                    <NewsCard 
                      key={i}
                      title={item.title}
                      source={item.source}
                      date={item.pubDate}
                      link={item.link}
                      snippet={item.contentSnippet}
                    />
                  ))}
                </div>
              )}
            </div>

            <aside>
              <div className={styles.section}>
                <h2><Clock /> Today's Focus</h2>
                <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>Major hearings at the Supreme Court today cover issues of digital privacy and electoral reforms.</p>
                <hr style={{ opacity: 0.1, margin: '20px 0' }} />
                <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                  <h4 style={{ color: '#60A5FA', margin: '0 0 8px 0' }}>Constitutional Insight</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>Article 32 allows citizens to move the Supreme Court for enforcement of fundamental rights.</p>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {activeTab === 'procedures' && (
          <motion.div 
            key="procedures"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.grid}
          >
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2><Gavel /> Procedural Walkthroughs ("How")</h2>
              </div>
              {PROCEDURAL_GUIDES.map(guide => (
                <ProcedureWalkthrough 
                  key={guide.id}
                  title={guide.title}
                  description={guide.description}
                  steps={guide.steps}
                />
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div className={styles.section}>
                <h3><Clock /> Limitation Tracker ("When")</h3>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Suit Type</th>
                        <th>Period</th>
                      </tr>
                    </thead>
                    <tbody>
                      {LIMITATION_PERIODS.map((lp, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: '0.85rem' }}>{lp.suit}</td>
                          <td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{lp.period}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className={styles.section}>
                <h3><MapPin /> Jurisdiction Finder ("Where")</h3>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Court</th>
                        <th>Claim Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JURISDICTION_MAP.map((jm, i) => (
                        <tr key={i}>
                          <td style={{ fontSize: '0.85rem' }}>{jm.court}</td>
                          <td style={{ fontSize: '0.8rem', opacity: 0.8 }}>{jm.pecuniary}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'glossary' && (
          <motion.div 
            key="glossary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.section}
          >
            <div className={styles.sectionHeader}>
              <h2><Book /> Comprehensive Legal Glossary</h2>
              <div className="badge badge-outlined">{filteredGlossary.length} Terms</div>
            </div>

            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={20} />
              <input 
                type="text" 
                placeholder="Search definitions (e.g., Bail, WRIT, FIR)..."
                className={styles.searchBar}
                style={{ paddingLeft: '52px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
              {filteredGlossary.slice(0, 100).map((term, i) => (
                <GlossaryItem 
                  key={i}
                  term={term.term}
                  definition={term.definition}
                  category={term.category}
                />
              ))}
            </div>
            {filteredGlossary.length > 100 && (
              <p style={{ textAlign: 'center', marginTop: '32px', opacity: 0.5, fontSize: '0.9rem' }}>
                Showing first 100 matches. Refine your search for more.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
