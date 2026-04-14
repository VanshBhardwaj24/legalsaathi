import React from 'react';
import { Scale, FileText, Settings, Home } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Scale className={styles.logoIcon} size={28} />
          <h1>LegalSaathi</h1>
        </div>
        <nav className={styles.nav}>
          <a href="#" className={styles.navLink}>
            <Home size={18} /> Home
          </a>
          <a href="#drafts" className={styles.navLink}>
            <FileText size={18} /> Drafts
          </a>
          <a href="#settings" className={styles.navLink}>
            <Settings size={18} /> Settings
          </a>
        </nav>
      </div>
    </header>
  );
};
