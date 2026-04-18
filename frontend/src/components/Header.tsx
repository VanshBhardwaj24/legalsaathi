import React, { useState } from 'react';
import { Scale, FileText, Settings, Home, Sun, Moon, User, LogOut, UserX, ChevronDown, Newspaper, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import styles from './Header.module.css';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, loading, isAnonymous, toggleAnonymous, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const displayName = user?.user_metadata?.full_name
    ?? user?.email?.split('@')[0]
    ?? 'Counsellor';

  const avatarUrl = user?.user_metadata?.avatar_url;

  const NavContent = () => (
    <>
      <Link to="/" className={`${styles.navLink} ${location.pathname === '/' ? styles.navActive : ''}`} onClick={() => setIsMenuOpen(false)}>
        <Home size={18} /> Home
      </Link>
      <Link to="/intelligence" className={`${styles.navLink} ${location.pathname === '/intelligence' ? styles.navActive : ''}`} onClick={() => setIsMenuOpen(false)}>
        <Newspaper size={18} /> Hub
      </Link>
      <Link to="/dashboard" className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.navActive : ''}`} onClick={() => setIsMenuOpen(false)}>
        <FileText size={18} /> Vault
      </Link>
      <Link to="/settings" className={`${styles.navLink} ${location.pathname === '/settings' ? styles.navActive : ''}`} onClick={() => setIsMenuOpen(false)}>
        <Settings size={18} /> Settings
      </Link>
    </>
  );

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <Link to="/" className={styles.logo}>
            <Scale className={styles.logoIcon} size={28} />
            <h1>LegalSaathi</h1>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            <NavContent />
          </nav>

          <div className={styles.actions}>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={styles.themeToggle}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {/* Anonymous Toggle - Hidden on very small mobile if space is tight, or adjusted */}
            <button
              onClick={toggleAnonymous}
              className={`${styles.anonToggle} ${isAnonymous ? styles.anonActive : ''}`}
            >
              <UserX size={18} />
              {isAnonymous && <span className={styles.anonBadge}>INCOGNITO</span>}
            </button>

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
                <User size={16} /> <span className={styles.signInText}>Sign In</span>
              </button>
            )}

            {/* Hamburger Button */}
            <button
              className={styles.mobileMenuBtn}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className={styles.mobileNav}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <div className={styles.mobileNavLinks}>
                <NavContent />
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};
