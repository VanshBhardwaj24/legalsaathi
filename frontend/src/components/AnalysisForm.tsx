import { useState } from 'react';
import { Mic, MicOff, Globe, Scale } from 'lucide-react';
import styles from './AnalysisForm.module.css';

interface AnalysisFormProps {
  onSubmit: (query: string, language: string, document_type: string) => void;
  loading: boolean;
}

const LANGUAGES = ["English", "Hindi", "Tamil", "Marathi", "Bengali"];

const DOC_TYPES = [
  { id: 'generic', label: 'General Advice', category: 'Standard' },
  { id: 'bail', label: 'Bail Application', category: 'Criminal' },
  { id: 'p_156_3', label: 'Section 156(3)', category: 'Criminal' },
  { id: 'recovery', label: 'Recovery Suit', category: 'Civil' },
  { id: 'eviction', label: 'Eviction Notice', category: 'Civil' },
  { id: 'divorce', label: 'Divorce Petition', category: 'Civil' },
  { id: 'ncdrc', label: 'Consumer Complaint', category: 'Consumer' },
  { id: 'pil', label: 'PIL Petition', category: 'Public Interest' },
];

const EXAMPLES = [
  "Workplace harassment",
  "Financial fraud",
  "Property dispute"
];

const EXAMPLE_TEXTS: Record<string, string> = {
  "Workplace harassment": "My manager has been harassing me with constant threats of firing if I don’t work unpaid overtime. He also sent inappropriate messages late at night. What action can I take?",
  "Financial fraud": "I loaned ₹5 lakh to a relative who promised to return it in 3 months. It has been a year, and now he is denying the transaction even though I have bank transfer proof.",
  "Property dispute": "Our neighbor broke down the boundary wall and encroached on our land while we were out of town. We have the property papers and earlier photographs."
};

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onSubmit, loading }) => {
  const [query, setQuery] = useState('');
  const [language, setLanguage] = useState('English');
  const [docType, setDocType] = useState('generic');
  const [isListening, setIsListening] = useState(false);

  const handleFillExample = (key: string) => {
    setQuery(EXAMPLE_TEXTS[key]);
  };

  const toggleMic = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    const langMap: Record<string, string> = { "English": "en-IN", "Hindi": "hi-IN", "Tamil": "ta-IN", "Marathi": "mr-IN", "Bengali": "bn-IN" };
    recognition.lang = langMap[language] || "en-IN";
    recognition.interimResults = true;
    recognition.continuous = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setQuery(prev => prev + " " + finalTranscript.trim());
      }
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 20 && !loading) {
      if (isListening) toggleMic(); // stop mic on submit
      onSubmit(query, language, docType);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.exampleChips}>
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            type="button"
            className="btn-outlined"
            onClick={() => handleFillExample(ex)}
          >
            {ex}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-alt)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Globe size={18} color="var(--color-accent)" />
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
              >
                {LANGUAGES.map(lang => <option key={lang} value={lang}>{lang}</option>)}
              </select>
           </div>

           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--color-bg-alt)', padding: '8px 12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <Scale size={18} color="var(--color-accent)" />
              <select 
                value={docType} 
                onChange={(e) => setDocType(e.target.value)}
                style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none' }}
              >
                {DOC_TYPES.map(type => <option key={type.id} value={type.id}>{type.label}</option>)}
              </select>
           </div>
        </div>

        <div style={{ marginBottom: '16px' }}>
           <button type="button" onClick={toggleMic} className="btn-outlined" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderColor: isListening ? 'var(--color-error)' : undefined, color: isListening ? 'var(--color-error)' : undefined }}>
              {isListening ? <MicOff size={16} /> : <Mic size={16} />} 
              {isListening ? 'Stop Recording' : 'Dictate Case Facts'}
           </button>
        </div>
        
        <div className={styles.inputWrapper}>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Provide a concise but detailed narrative of your legal problem... (${isListening ? 'Listening...' : 'Type or dictate'})`}
            className={styles.textarea}
            disabled={loading}
          />
          <div className={styles.charCount}>
            {query.length} chars
          </div>
        </div>
        <button
          type="submit"
          className={`btn-primary ${styles.submitBtn}`}
          disabled={loading || query.length < 20}
        >
          {loading ? 'Running Agents...' : 'Run Legal Assistant'}
        </button>
      </form>
    </div>
  );
};
