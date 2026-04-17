import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Globe, Scale, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithMagicLink } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await signInWithMagicLink(email);
      setMagicSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.backdrop}
          onClick={handleBackdropClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.4 }}
          >
            {/* Close Button */}
            <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
              <X size={20} />
            </button>

            {/* Header */}
            <div className={styles.header}>
              <div className={styles.iconBadge}>
                <Scale size={28} />
              </div>
              <h2>LegalSaathi Vault</h2>
              <p>Secure access to your legal case history</p>
            </div>

            {/* Security Badge */}
            <div className={styles.securityBadge}>
              <Lock size={14} />
              <span>End-to-end secured with Supabase Auth & RLS</span>
            </div>

            {!magicSent ? (
              <>
                {/* Google OAuth */}
                <button
                  className={styles.googleBtn}
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  <Globe size={18} />
                  {isSubmitting ? 'Connecting...' : 'Continue with Google'}
                </button>

                <div className={styles.divider}>
                  <span>or continue with Magic Link</span>
                </div>

                {/* Magic Link Form */}
                <form onSubmit={handleMagicLink} className={styles.form} noValidate>
                  <div className={styles.inputGroup}>
                    <Mail size={16} className={styles.inputIcon} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={styles.input}
                      disabled={isSubmitting}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={isSubmitting || !email.trim()}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Magic Link'}
                  </button>
                </form>

                <p className={styles.disclaimer}>
                  By continuing, you agree that this platform provides legal assistance only, 
                  not formal legal advice. Your data is encrypted and secured under RLS policies.
                </p>
              </>
            ) : (
              <div className={styles.magicSentState}>
                <div className={styles.magicIcon}>📧</div>
                <h3>Check Your Inbox</h3>
                <p>A secure sign-in link has been sent to <strong>{email}</strong>.</p>
                <p className={styles.note}>Link expires in 1 hour. Check spam if not received.</p>
                <button className={styles.backBtn} onClick={() => setMagicSent(false)}>
                  ← Try a different email
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
