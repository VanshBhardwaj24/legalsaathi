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
    draft?: string;
  } | null;
}
