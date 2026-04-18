import React, { useState, useEffect } from 'react';
import {
  User, Settings as SettingsIcon, Moon, Sun, Monitor, EyeOff,
  Download, Trash2, Shield, LogOut, Lock, Gavel,
  ChevronRight, AlertTriangle, CheckCircle2,
  Eye
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import styles from './Settings.module.css';

export const Settings: React.FC = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isExporting, setIsExporting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const [showId, setShowId] = useState(false);

  // Handle Export Data
  const handleExportData = async () => {
    if (!user) return;
    setIsExporting(true);
    const toastId = toast.loading('Preparing your vault export...');

    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const exportData = {
        user_id: user.id,
        email: user.email,
        exported_at: new Date().toISOString(),
        cases: data || []
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `LegalSaathi_Export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Vault exported successfully!', { id: toastId });
    } catch (err: any) {
      console.error('Export failed:', err.message);
      toast.error('Export failed. Please try again.', { id: toastId });
    } finally {
      setIsExporting(false);
    }
  };

  // Handle Reset History
  const handleResetHistory = async () => {
    if (!user) return;
    if (!confirm('CRITICAL ACTION: This will permanently delete all your saved cases. This cannot be undone. Proceed?')) return;

    setIsResetting(true);
    const toastId = toast.loading('Purging your vault...');

    try {
      const { error } = await supabase
        .from('cases')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      toast.success('History cleared. Your vault is empty.', { id: toastId });
    } catch (err: any) {
      console.error('Reset failed:', err.message);
      toast.error('Reset failed. Please try again.', { id: toastId });
    } finally {
      setIsResetting(false);
    }
  };

  if (authLoading) {
    return (
      <div className={styles.settingsWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div className="loader">Initializing components...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.settingsWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.lockedView}
        >
          <div className={styles.lockIcon}>
            <Lock size={64} style={{ opacity: 0.2 }} />
          </div>
          <h2>Your Settings are Locked</h2>
          <p>Please sign in to your LegalSaathi account to manage your profile, interface preferences, and vault security.</p>
          <button
            className="btn-primary"
            style={{ marginTop: '16px' }}
            onClick={() => window.location.href = '/'}
          >
            Authenticate Identity
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={styles.settingsWrapper}>
      <header className={styles.header}>
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          System Settings
        </motion.h1>
        <p>Manage your professional identity and toolkit environment.</p>
      </header>

      <div className={styles.grid}>
        {/* Profile Section */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <User size={20} /> Identity Profile
          </div>
          <div className={styles.userBadge}>
            <div className={styles.avatar}>
              {user.email?.[0].toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <h4>{user.user_metadata?.full_name || user.email?.split('@')[0]}</h4>
              <p>{user.email}</p>
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Account ID</span>
              <span className={styles.desc} style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {showId ? user.id : '••••••••-••••-••••-••••-••••••••••••'}
                <button
                  onClick={() => setShowId(!showId)}
                  style={{ background: 'none', border: 'none', padding: '4px', display: 'flex', alignItems: 'center', color: 'var(--color-accent)', cursor: 'pointer' }}
                  title={showId ? "Hide Identity ID" : "Reveal Identity ID"}
                >
                  {showId ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </span>
            </div>
          </div>
        </section>

        {/* Interface Section */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <SettingsIcon size={20} /> Interface Preferences
          </div>
          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Appearance Mode</span>
              <span className={styles.desc}>Toggle between high-clarity and dark-mode environments.</span>
            </div>
            <div className={styles.control}>
              <button
                className={theme === 'light' ? 'btn-accent' : 'btn-outlined'}
                onClick={() => theme === 'dark' && toggleTheme()}
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Sun size={16} /> Light
              </button>
              <button
                className={theme === 'dark' ? 'btn-accent' : 'btn-outlined'}
                onClick={() => theme === 'light' && toggleTheme()}
                style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Moon size={16} /> Dark
              </button>
            </div>
          </div>
        </section>

        {/* Data Management Section */}
        <section className={styles.section}>
          <div className={styles.sectionTitle}>
            <Shield size={20} /> Vault Management
          </div>
          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Export Case History</span>
              <span className={styles.desc}>Download all your analyzed cases in a standardized JSON format.</span>
            </div>
            <button
              className="btn-outlined"
              onClick={handleExportData}
              disabled={isExporting}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Download size={16} /> {isExporting ? 'Exporting...' : 'Export Vault'}
            </button>
          </div>
          <div className={`${styles.row} ${styles.dangerZone}`}>
            <div className={styles.info}>
              <span className={styles.label}>Purge Vault History</span>
              <span className={styles.desc}>Irreversibly delete all cases from your permanent record.</span>
            </div>
            <button
              className="btn-outlined"
              onClick={handleResetHistory}
              disabled={isResetting}
              style={{ color: '#EF4444', borderColor: '#EF4444', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={16} /> {isResetting ? 'Purging...' : 'Delete All Data'}
            </button>
          </div>
        </section>

        {/* Account Controls */}
        <section className={styles.section}>
          <div className={styles.sectionTitle} style={{ color: '#EF4444' }}>
            <LogOut size={20} /> Session Security
          </div>
          <div className={styles.row}>
            <div className={styles.info}>
              <span className={styles.label}>Terminate Session</span>
              <span className={styles.desc}>Securely log out of the current professional environment.</span>
            </div>
            <button
              className="btn-outlined"
              onClick={signOut}
              style={{ color: '#EF4444', borderColor: '#EF4444' }}
            >
              Sign Out Securely
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
