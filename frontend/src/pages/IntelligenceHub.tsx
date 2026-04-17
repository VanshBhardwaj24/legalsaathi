import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Newspaper, Book, Clock, Search, Gavel, 
  AlertCircle, RefreshCw, ShieldCheck, Info 
} from 'lucide-react';
import { NewsCard } from '../components/Intelligence/NewsCard';
import { GlossaryItem } from '../components/Intelligence/GlossaryItem';
import { ProcedureWalkthrough } from '../components/Intelligence/ProcedureWalkthrough';
import { LiteracyCard } from '../components/Intelligence/LiteracyCard';
import { HighlightCard } from '../components/Intelligence/HighlightCard';
import { FULL_GLOSSARY } from '../data/legalGlossary';
import { PROCEDURAL_GUIDES, LIMITATION_PERIODS } from '../data/legalProcedures';
import { LEGAL_LITERACY_DATA, DID_YOU_KNOW_FACTS } from '../data/legalLiteracy';
import { CONFIG } from '../config';
import styles from '../components/Intelligence/Intelligence.module.css';

export default function IntelligenceHub() {
  const [activeTab, setActiveTab] = useState<'news' | 'glossary' | 'procedures' | 'rights'>('news');
  const [news, setNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsError, setNewsError] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dailyFact, setDailyFact] = useState('');

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
    // Pick a random fact for the session
    const randomFact = DID_YOU_KNOW_FACTS[Math.floor(Math.random() * DID_YOU_KNOW_FACTS.length)];
    setDailyFact(randomFact);
  }, []);

  const filteredGlossary = useMemo(() => {
    if (!searchQuery) return FULL_GLOSSARY;
    const q = searchQuery.toLowerCase();
    return FULL_GLOSSARY.filter(item => 
      item.term.toLowerCase().includes(q) ||
      item.definition.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredLiteracy = useMemo(() => {
    if (!searchQuery) return LEGAL_LITERACY_DATA;
    const q = searchQuery.toLowerCase();
    return LEGAL_LITERACY_DATA.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
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
        <p>Expert-level insights, citizens' rights, and real-time legal intelligence.</p>
      </header>

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
        {[
          { id: 'news', label: 'News Wire', icon: <Newspaper size={18} /> },
          { id: 'rights', label: 'Citizens Rights', icon: <ShieldCheck size={18} /> },
          { id: 'procedures', label: 'When/Where/How', icon: <Gavel size={18} /> },
          { id: 'glossary', label: 'Glossary', icon: <Book size={18} /> }
        ].map(tab => (
          <button
            key={tab.id}
            className={`btn-${activeTab === tab.id ? 'accent' : 'outlined'}`}
            onClick={() => {
              setActiveTab(tab.id as any);
              setSearchQuery('');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem' }}
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
                <h2><Newspaper /> Legal News Wire</h2>
                <div className="badge badge-accent">LIVE</div>
              </div>
              
              <HighlightCard type="fact" content={dailyFact} />

              {loadingNews ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                  <div className="loader" />
                </div>
              ) : newsError ? (
                <div className={styles.errorState}>
                  <AlertCircle size={48} color="#EF4444" style={{ marginBottom: '16px' }} />
                  <h3>Primary Fetch Offline</h3>
                  <button className="btn-outlined" onClick={fetchNews}><RefreshCw size={16} /> Tap to Retry</button>
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
                <h2><Info /> Contextual Alerts</h2>
                <div style={{ padding: '16px', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '16px', borderLeft: '4px solid var(--color-accent)' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem' }}>Supreme Court Update</h4>
                  <p style={{ margin: 0, fontSize: '0.8rem', opacity: 0.7 }}>Constitutional Bench to hear key citizenship petitions tomorrow at 10:30 AM.</p>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {activeTab === 'rights' && (
          <motion.div 
            key="rights"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.section}
          >
            <div className={styles.sectionHeader}>
              <h2><ShieldCheck /> Citizens' Rights Library</h2>
              <div className="badge badge-outlined">{LEGAL_LITERACY_DATA.length} Deep Dives</div>
            </div>

            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={20} />
              <input 
                type="text" 
                placeholder="Search rights (e.g., RTI, Arrest, Women)..."
                className={styles.searchBar}
                style={{ paddingLeft: '52px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className={styles.literacyGrid}>
              {filteredLiteracy.map(guide => (
                <LiteracyCard 
                  key={guide.id}
                  title={guide.title}
                  category={guide.category}
                  summary={guide.summary}
                  content={guide.content}
                  mythBusters={guide.mythBusters}
                  templates={guide.templates}
                />
              ))}
            </div>
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
                <h2><Gavel /> When, Where & How</h2>
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
                <h3><Clock /> Limitation Deadlines</h3>
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>Suit Type</th><th>Period</th></tr>
                    </thead>
                    <tbody>
                      {LIMITATION_PERIODS.map((lp, i) => (
                        <tr key={i}><td>{lp.suit}</td><td style={{ fontWeight: 600, color: 'var(--color-accent)' }}>{lp.period}</td></tr>
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
              <h2><Book /> Legal Glossary</h2>
            </div>

            <div style={{ position: 'relative', marginBottom: '32px' }}>
              <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={20} />
              <input 
                type="text" 
                placeholder="Search 200+ terms..."
                className={styles.searchBar}
                style={{ paddingLeft: '52px' }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
              {filteredGlossary.slice(0, 100).map((term, i) => (
                <GlossaryItem key={i} term={term.term} definition={term.definition} category={term.category} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
