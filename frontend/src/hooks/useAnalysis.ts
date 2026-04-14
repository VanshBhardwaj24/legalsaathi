import { useState } from 'react';
import axios from 'axios';
import type { AnalysisResult } from '../types/index';
import type { AgentStep } from '../components/AgentProgress';

const initialAgents: AgentStep[] = [
  { id: 'intake', name: 'Case Intake', status: 'idle' },
  { id: 'ipc', name: 'IPC Search', status: 'idle' },
  { id: 'precedent', name: 'Precedent Research', status: 'idle' },
  { id: 'draft', name: 'Document Drafting', status: 'idle' },
];

export function useAnalysis() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [agents, setAgents] = useState<AgentStep[]>(initialAgents);

  const simulateAgentProgress = () => {
    let currentStep = 0;
    setAgents(initialAgents.map((a, i) => i === 0 ? { ...a, status: 'active' } : a));
    
    // Simulate progression for visual feedback
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
    }, 4000); // roughly corresponds to backend timing
    
    return interval;
  };

  const completeAllAgents = () => {
    setAgents(prev => prev.map(a => ({ ...a, status: 'complete' })));
  };

  const analyze = async (query: string) => {
    setLoading(true);
    setResult(null);
    const interval = simulateAgentProgress();
    
    try {
      const { data } = await axios.post<AnalysisResult>('/api/analyze', { query });
      clearInterval(interval);
      completeAllAgents();
      setResult(data);
    } catch (error) {
      console.error(error);
      clearInterval(interval);
      setAgents(prev => prev.map(a => ({ ...a, status: 'error' })));
      setResult({ status: 'error', raw: 'An error occurred during analysis.', structured: null });
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setAgents(initialAgents);
  };

  return { loading, result, agents, analyze, reset };
}
