import React, { useState } from 'react';
import { Scale, FileText, Settings, Home, Sun, Moon, User, LogOut, UserX, ChevronDown, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import styles from './Header.module.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, isAnonymous, toggleAnonymous, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'Counsellor';

  const avatarUrl = user?.user_metadata?.avatar_url;

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <Scale className={styles.logoIcon} size={28} />
            <h1>LegalSaathi</h1>
          </Link>

          <nav className={styles.nav}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Anonymous/Incognito Toggle */}
            <button
              onClick={toggleAnonymous}
              className={`${styles.anonToggle} ${isAnonymous ? styles.anonActive : ''}`}
              title={isAnonymous ? 'Incognito ON — cases not saved' : 'Enable Incognito mode'}
            >
              <UserX size={18} />
              {isAnonymous && <span className={styles.anonBadge}>INCOGNITO</span>}
            </button>

            <Link to="/" className={styles.navLink}>
              <Home size={18} /> Home
            </Link>
            <Link to="/intelligence" className={styles.navLink}>
              <Newspaper size={18} /> Hub
            </Link>
            <Link to="/dashboard" className={styles.navLink}>
              <FileText size={18} /> Vault
            </Link>
            <Link to="/settings" className={styles.navLink}>
              <Settings size={18} /> Settings
            </Link>

            {/* Auth Zone */}
            {loading ? (
              <div className={styles.authLoading} />
            ) : user ? (
              <div className={styles.userZone} onMouseLeave={() => setShowUserMenu(false)}>
                <button
                  className={styles.userBtn}
                  onClick={() => setShowUserMenu(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt={displayName} className={styles.avatar} />
                  ) : (
                    <div className={styles.avatarFallback}>
                      {displayName[0].toUpperCase()}
                    </div>
                  )}
                  <span className={styles.userName}>{displayName}</span>
                  <ChevronDown size={14} />
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      className={styles.userMenu}
                      initial={{ opacity: 0, y: -8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                    >
                      <div className={styles.menuEmail}>{user.email}</div>
                      <button className={styles.menuItem} onClick={signOut}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                className={styles.signInBtn}
                onClick={() => setShowAuthModal(true)}
              >
                <User size={16} /> Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
