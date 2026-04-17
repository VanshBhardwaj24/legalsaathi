import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ResultViewer } from '../components/ResultViewer';
import { ChatPanel } from '../components/ChatPanel';
import { Gavel, ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export const SharedCase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCase();
    }
  }, [id]);

  const fetchCase = async () => {
    setLoading(true);
    try {
      // Try fetching by ID first (authenticated owernship check via RLS)
      let { data: caseData, error } = await supabase
        .from('cases')
        .select('*')
        .eq('id', id)
        .single();

      // If failed or no data, try fetching by share_token
      if (error || !caseData) {
        const { data: publicData, error: publicError } = await supabase
          .from('cases')
          .select('*')
          .eq('share_token', id)
          .single();
        
        if (publicError) throw publicError;
        caseData = publicData;
        setIsPublic(true);
      }

      if (caseData) {
        setData(caseData.result);
      }
    } catch (err: any) {
      console.error('Fetch case error:', err.message);
      toast.error('Could not load case. It may have been deleted or the link is invalid.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <div className="loader">Opening the Vault...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 24px' }}>
        <Gavel size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
        <h1>Access Denied</h1>
        <p style={{ opacity: 0.7, marginBottom: '32px' }}>This record is restricted or does not exist.</p>
        <Link to="/" className="btn-primary">Return to Court</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', textDecoration: 'none' }}>
           <ArrowLeft size={18} /> Back to Records
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22c55e', fontSize: '0.875rem', fontWeight: 600 }}>
          <ShieldCheck size={16} /> RECORD SECURED BY RLS
        </div>
      </div>

      <div style={{ marginBottom: '60px' }}>
         <ResultViewer data={data} />
         <ChatPanel context={data} />
      </div>

      {isPublic && (
        <div className="glass-ui" style={{ padding: '32px', textAlign: 'center', background: 'rgba(108, 99, 255, 0.05)' }}>
           <h3>This is a Shared Legal Insight</h3>
           <p style={{ opacity: 0.7, marginBottom: '20px' }}>You are viewing a read-only snapshot provided by a LegalSaathi user.</p>
           <Link to="/" className="btn-accent">Try LegalSaathi Yourself</Link>
        </div>
      )}
    </div>
  );
};
