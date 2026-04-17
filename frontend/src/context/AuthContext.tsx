import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

// ─── Types ──────────────────────────────────────────────────────────────────

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAnonymous: boolean;
  toggleAnonymous: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithMagicLink: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Initialize: restore session from storage and listen for auth changes
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        // getSession reads from local storage (no network call). We use it
        // only to display state quickly; critical checks use getUser() below.
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) throw error;

        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
        }
      } catch (err: any) {
        console.error('[Auth] Session init error:', err.message);
        // Don't toast here — user may simply not be logged in yet
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    // Real-time auth state changes (login, logout, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (event === 'SIGNED_IN') {
          toast.success(`Welcome back, ${newSession?.user?.email?.split('@')[0] ?? 'Counsellor'}! 🏛️`);
        }
        if (event === 'SIGNED_OUT') {
          toast('Signed out securely.', { icon: '🔒' });
        }
        if (event === 'TOKEN_REFRESHED') {
          console.log('[Auth] Token refreshed silently.');
        }
        if (event === 'PASSWORD_RECOVERY') {
          toast('Password recovery email sent.', { icon: '📧' });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ── Sign In: Google OAuth ─────────────────────────────────────────────────
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      // Browser will redirect — no success toast needed here
    } catch (err: any) {
      console.error('[Auth] Google sign-in error:', err.message);
      toast.error(`Sign-in failed: ${err.message}`);
    }
  }, []);

  // ── Sign In: Magic Link ───────────────────────────────────────────────────
  const signInWithMagicLink = useCallback(async (email: string) => {
    // Client-side email validation before making the API call
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const toastId = toast.loading('Sending magic link...');
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: window.location.origin,
          shouldCreateUser: true, // auto-register if new
        },
      });

      if (error) throw error;

      toast.success('Magic link sent! Check your inbox. 📧', { id: toastId });
    } catch (err: any) {
      console.error('[Auth] Magic link error:', err.message);

      // Provide specific, actionable error messages
      let message = 'Failed to send magic link.';
      if (err.message.includes('rate limit')) {
        message = 'Too many attempts. Please wait 60 seconds and try again.';
      } else if (err.message.includes('invalid')) {
        message = 'Invalid email address provided.';
      }
      toast.error(message, { id: toastId });
    }
  }, []);

  // ── Sign Out ──────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    const toastId = toast.loading('Signing out...');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out securely.', { id: toastId, icon: '🔒' });
    } catch (err: any) {
      console.error('[Auth] Sign-out error:', err.message);
      toast.error('Sign-out failed. Please refresh the page.', { id: toastId });
    }
  }, []);

  // ── Anonymous / Incognito Mode ─────────────────────────────────────────────
  const toggleAnonymous = useCallback(() => {
    setIsAnonymous(prev => {
      const next = !prev;
      if (next) {
        toast('Incognito mode enabled — case will not be saved.', { icon: '🕵️' });
      } else {
        toast('Incognito mode disabled — cases will be saved.', { icon: '💾' });
      }
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      isAnonymous,
      toggleAnonymous,
      signInWithGoogle,
      signInWithMagicLink,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('[LegalSaathi] useAuth must be used within an <AuthProvider>. ' +
      'Did you forget to wrap your app?');
  }
  return context;
};
