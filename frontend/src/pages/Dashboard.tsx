import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Gavel, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SavedCase {
  id: string;
  title: string;
  query: string;
  language: string;
  created_at: string;
  result: any;
}

export const Dashboard: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [cases, setCases] = useState<SavedCase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCases();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchCases = async () => {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCases(data || []);
    } catch (err: any) {
      console.error('Error fetching cases:', err.message);
      toast.error('Failed to load your cases.');
    } finally {
      setLoading(false);
    }
  };

  const deleteCase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this case permanently?')) return;
    
    const toastId = toast.loading('Deleting case...');
    try {
      const { error } = await supabase.from('cases').delete().eq('id', id);
      if (error) throw error;
      
      setCases(prev => prev.filter(c => c.id !== id));
      toast.success('Case deleted.', { id: toastId });
    } catch (err: any) {
      toast.error(`Delete failed: ${err.message}`, { id: toastId });
    }
  };

  if (authLoading || loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <div className="loader">Loading your vault...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <Gavel size={64} style={{ opacity: 0.2, marginBottom: '24px' }} />
        <h2>Your Sovereign Vault is Locked</h2>
        <p style={{ opacity: 0.7, marginBottom: '32px' }}>Please sign in to view your case history and saved drafts.</p>
        <button className="btn-primary" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
      <header style={{ marginBottom: '48px' }}>
        <span style={{ color: 'var(--color-accent)', fontWeight: 'bold', fontSize: '0.875rem', letterSpacing: '2px' }}>MY RECORDS</span>
        <h1 style={{ fontSize: '2.5rem', marginTop: '8px' }}>Your Case Vault</h1>
      </header>

      {cases.length === 0 ? (
        <div className="glass-ui" style={{ padding: '60px', textAlign: 'center' }}>
          <p style={{ opacity: 0.7 }}>No saved cases found. Start your first analysis to see it here!</p>
          <Link to="/" className="btn-accent" style={{ marginTop: '24px', display: 'inline-block' }}>New Analysis</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cases.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-ui"
              style={{ 
                padding: '24px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s'
              }}
              whileHover={{ scale: 1.01 }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Clock size={16} style={{ color: 'var(--color-accent)' }} />
                  <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{new Date(c.created_at).toLocaleDateString()}</span>
                  <span style={{ padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.65rem' }}>{c.language}</span>
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>{c.title || 'Untitled Case'}</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.7, maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.query}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <button 
                  onClick={(e) => { e.stopPropagation(); deleteCase(c.id); }}
                  className="btn-outlined" 
                  style={{ padding: '8px', border: 'none', color: 'var(--color-error)' }}
                  title="Delete case"
                >
                  <Trash2 size={18} />
                </button>
                <Link to={`/case/${c.id}`} className="btn-outlined" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  VIEW <ChevronRight size={16} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
