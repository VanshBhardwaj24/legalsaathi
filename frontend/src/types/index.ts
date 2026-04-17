export interface IPCSection {
  section: string;
  section_title: string;
  chapter: string;
  chapter_title: string;
  content: string;
}

export interface Precedent {
  title: string;
  summary: string;
  link: string | null;
}

export interface TimelineEvent {
  title: string;
  cardTitle: string;
  cardSubtitle?: string;
  cardDetailedText: string;
}

export interface EvidenceItem {
  category: string;
  document: string;
  importance: 'High' | 'Medium' | 'Low';
  reason: string;
  action_step?: string;
}

export interface AnalysisResult {
  status: 'success' | 'error';
  raw: string;
  structured: {
    case_type?: string;
    legal_domain?: string;
    summary?: string;
    relevant_entities?: string[];
    jurisdiction?: string;
    ipc_sections?: IPCSection[];
    precedents?: Precedent[];
    precedents_summary?: string;
    timeline_data?: TimelineEvent[];
    evidence_checklist?: EvidenceItem[];
    draft?: string;
  } | null;
}
