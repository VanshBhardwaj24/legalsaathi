import React, { useState } from 'react';
import styles from './AnalysisForm.module.css';

interface AnalysisFormProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

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

  const handleFillExample = (key: string) => {
    setQuery(EXAMPLE_TEXTS[key]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.length > 20 && !loading) {
      onSubmit(query);
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
        <div className={styles.inputWrapper}>
          <textarea
            id="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Provide a concise but detailed narrative of your legal problem..."
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
