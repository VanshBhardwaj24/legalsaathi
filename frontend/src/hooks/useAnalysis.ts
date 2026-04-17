import { useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import type { AnalysisResult } from '../types/index';
import type { AgentStep } from '../components/AgentProgress';
import { supabase, getCurrentUser } from '../lib/supabase';

const initialAgents: AgentStep[] = [
  { id: 'intake', name: 'Case Intake', status: 'idle' },
  { id: 'ipc', name: 'IPC Search', status: 'idle' },
  { id: 'precedent', name: 'Precedent Research', status: 'idle' },
  { id: 'draft', name: 'Document Drafting', status: 'idle' },
];

export function useAnalysis(isAnonymous: boolean = false) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [savedCaseId, setSavedCaseId] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentStep[]>(initialAgents);

  const simulateAgentProgress = () => {
    let currentStep = 0;
    setAgents(initialAgents.map((a, i) => i === 0 ? { ...a, status: 'active' } : a));

    const interval = setInterval(() => {
      setAgents(prev => {
        const next = [...prev];
        if (currentStep < 3) {
          next[currentStep].status = 'complete';
          currentStep++;
          next[currentStep].status = 'active';
        }
        return next;
      });
    }, 4000);

    return interval;
  };

  const completeAllAgents = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'complete' })));
  };

  // ── Persist case to Supabase ─────────────────────────────────────────────
  const persistCase = useCallback(async (
    query: string,
    language: string,
    data: AnalysisResult
  ) => {
    // Skip persistence in anonymous mode
    if (isAnonymous) return;

    // Server-verified user identity (NOT raw session)
    const user = await getCurrentUser();
    if (!user) {
      // User not logged in — don't save, but don't throw either
      toast('Sign in to save your case history. 💾', { icon: '🔑', duration: 4000 });
      return;
    }

    try {
      const title = data.structured?.case_type
        ? `${data.structured.case_type} — ${new Date().toLocaleDateString('en-IN')}`
        : `Case — ${new Date().toLocaleDateString('en-IN')}`;

      // 1. Insert Case
      const { data: inserted, error: caseError } = await supabase
        .from('cases')
        .insert({
          user_id: user.id,
          title,
          query,
          language,
          result: data,
          document_type: data.structured?.case_type?.toLowerCase() || 'generic',
          is_anonymous: false,
        })
        .select('id')
        .single();

      if (caseError) throw caseError;

      if (inserted) {
        setSavedCaseId(inserted.id);
        const caseId = inserted.id;

        // 2. Batch Insert Evidence Logs
        if (data.structured?.evidence_checklist?.length) {
          const evidenceLogs = data.structured.evidence_checklist.map(item => ({
            case_id: caseId,
            category: item.category,
            document: item.document,
            importance: item.importance,
            reason: item.reason,
            action_step: item.action_step,
            status: 'Pending'
          }));
          await supabase.from('evidence_logs').insert(evidenceLogs);
        }

        // 3. Batch Insert Agent Activities
        if (data.activities?.length) {
          const activityLogs = data.activities.map(act => ({
            case_id: caseId,
            agent_name: act.agent,
            action_type: act.type,
            description: act.description,
            metadata: act.metadata
          }));
          await supabase.from('agent_activity').insert(activityLogs);
        }

        // 4. Save initial draft version
        if (data.structured?.draft) {
          await supabase.from('case_versions').insert({
            case_id: caseId,
            draft_text: data.structured.draft,
            version_label: 'Initial Draft',
          });
        }

        toast.success('Case & Intelligence saved! 🏛️', { duration: 3000 });
      }
    } catch (err: any) {
      console.error('[Supabase] Multi-table persist error:', err.message);
      toast.error('Analysis complete, but failed to save full intelligence stream.');
    }
  }, [isAnonymous]);

  // ── Main Analysis Function ────────────────────────────────────────────────
  const analyze = useCallback(async (query: string, language: string = 'English', document_type: string = 'generic') => {
    // Input validation
    if (!query || query.trim().length < 20) {
      toast.error('Please provide a more detailed case description (at least 20 characters).');
      return;
    }

    setLoading(true);
    setResult(null);
    setSavedCaseId(null);

    const toastId = toast.loading('Running legal analysis agents...');
    const interval = simulateAgentProgress();

    try {
      const { data } = await axios.post<AnalysisResult>('/api/analyze', {
        query: query.trim(),
        language,
        document_type
      }, {
        timeout: 120_000, // 2 min timeout for complex cases
        headers: { 'Content-Type': 'application/json' },
      });

      clearInterval(interval);
      completeAllAgents();
      setResult(data);
      toast.success('Legal analysis complete! ⚖️', { id: toastId });

      // Persist to Supabase asynchronously (non-blocking)
      persistCase(query.trim(), language, data).catch(console.error);

    } catch (error) {
      clearInterval(interval);
      setAgents(prev => prev.map(a => ({ ...a, status: 'error' })));

      let errorMessage = 'Analysis failed. Please try again.';

      if (axios.isAxiosError(error)) {
        const axErr = error as AxiosError<{ message: string }>;
        if (axErr.code === 'ECONNABORTED') {
          errorMessage = 'Analysis timed out. The case may be too complex — try a shorter description.';
        } else if (axErr.response?.status === 429) {
          errorMessage = 'Rate limit reached. Please wait 30 seconds before trying again.';
        } else if (axErr.response?.status === 500) {
          errorMessage = 'Server error during analysis. Please try again in a moment.';
        } else if (!axErr.response) {
          errorMessage = 'Cannot reach the server. Check your internet connection.';
        }
      }

      toast.error(errorMessage, { id: toastId, duration: 6000 });
      setResult({ status: 'error', structured: null });
    } finally {
      setLoading(false);
    }
  }, [persistCase]);

  const reset = useCallback(() => {
    setResult(null);
    setSavedCaseId(null);
    setAgents(initialAgents);
  }, []);

  return { loading, result, agents, savedCaseId, analyze, reset };
}
