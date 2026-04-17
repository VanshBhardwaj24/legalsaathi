import React from 'react';
import { ExternalLink, Clock, Newspaper } from 'lucide-react';
import styles from './Intelligence.module.css';

interface NewsCardProps {
  title: string;
  source: string;
  date: string;
  link: string;
  snippet: string;
}

export const NewsCard: React.FC<NewsCardProps> = ({ title, source, date, link, snippet }) => {
  return (
    <motion.div 
      className={styles.newsCard}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className={styles.newsHeader}>
        <span className={styles.newsSource}>
          <Newspaper size={14} /> {source}
        </span>
        <span className={styles.newsDate}>
          <Clock size={14} /> {new Date(date).toLocaleDateString()}
        </span>
      </div>
      <h3 className={styles.newsTitle}>{title}</h3>
      <p className={styles.newsSnippet}>{snippet}</p>
      <a 
        href={link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={styles.newsLink}
      >
        Read Full Coverage <ExternalLink size={14} />
      </a>
    </motion.div>
  );
};
import { motion } from 'framer-motion';
