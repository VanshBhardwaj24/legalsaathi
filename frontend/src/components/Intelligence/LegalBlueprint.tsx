import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, Check, Info, ChevronDown } from 'lucide-react';
import styles from './Intelligence.module.css';

const BLUEPRINTS = [
  {
    id: 'rti-general',
    title: 'RTI Application Draft',
    description: 'A standard format to request information from any government department.',
    template: (data: any) => `To,
The Public Information Officer (PIO),
[DEPARTMENT: ${data.dept || '________________'}]
[CITY/STATE: ${data.location || '________________'}]

Sub: Request for Information under RTI Act, 2005.

Sir/Madam,
Please provide the following information regarding [SUBJECT: ${data.subject || '________________'}]:
1. [SPECIFIC QUESTION 1]
2. [SPECIFIC QUESTION 2]

Particulars of the Applicant:
Name: ${data.name || '________________'}
Address: ${data.address || '________________'}

I have attached the application fee of Rs. 10/- vide [MODE: Postal Order/Cash].

Yours faithfully,
(Date: ${new Date().toLocaleDateString()})`,
    fields: [
      { id: 'dept', label: 'Department Name', placeholder: 'e.g. Municipal Corporation' },
      { id: 'subject', label: 'Subject of Inquiry', placeholder: 'e.g. Road repair status in Colony X' },
      { id: 'name', label: 'Your Full Name', placeholder: 'Jay Singh' }
    ]
  },
  {
    id: 'fir-refusal',
    title: 'FIR Refusal Letter to SP',
    description: 'Use this if a Police Station refuses to register your FIR for a serious crime.',
    template: (data: any) => `To,
The Superintendent of Police (SP),
[DISTRICT: ${data.district || '________________'}]

Sub: Complaint regarding non-registration of FIR under Section 154(3) CrPC.

Respected Sir,
I am writing to bring to your notice that I approached the [PS NAME: ${data.ps || '________________'}] on ${data.date || '____/____/____'} to lodge an FIR regarding [CRIME: ${data.crime || '________________'}]. However, the officer in charge refused to register the same.

The details of the incident are as follows:
[INCIDENT DETAILS]

I request you to direct the registration of the FIR and investigate the matter.

Yours sincerely,
${data.name || '________________'}
Contact: ${data.phone || '________________'}`,
    fields: [
      { id: 'district', label: 'District Name', placeholder: 'e.g. Bangalore Urban' },
      { id: 'ps', label: 'Police Station Name', placeholder: 'e.g. Koramangala PS' },
      { id: 'crime', label: 'Nature of Incident', placeholder: 'e.g. Theft of Vehicle' }
    ]
  }
];

export const LegalBlueprint: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [copied, setCopied] = useState(false);

  const activeBlueprint = BLUEPRINTS.find(b => b.id === selected);

  const handleCopy = () => {
    if (activeBlueprint) {
      const text = activeBlueprint.template(formData);
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className={styles.blueprintContainer}>
      <div className={styles.blueprintHeader}>
        <div className={styles.headerTitle}>
          <FileText className={styles.accentIcon} />
          <h3>Legal Drafting Blueprints</h3>
        </div>
        <p className={styles.subtitle}>Fill in the blanks to generate a professional legal draft. Copy and customize it.</p>
      </div>

      <div className={styles.blueprintPicker}>
        {BLUEPRINTS.map(b => (
          <button 
            key={b.id} 
            className={`${styles.pickerBtn} ${selected === b.id ? styles.active : ''}`}
            onClick={() => { setSelected(b.id); setFormData({}); }}
          >
            {b.title}
            <ChevronDown size={16} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeBlueprint ? (
          <motion.div 
            key={selected}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className={styles.blueprintWorkspace}
          >
            <div className={styles.blueprintEditor}>
              <div className={styles.fieldGrid}>
                {activeBlueprint.fields.map(f => (
                  <div key={f.id} className={styles.inputGroup}>
                    <label>{f.label}</label>
                    <input 
                      type="text" 
                      placeholder={f.placeholder}
                      value={formData[f.id] || ''}
                      onChange={(e) => setFormData({...formData, [f.id]: e.target.value})}
                    />
                  </div>
                ))}
              </div>

              <div className={styles.previewBox}>
                <div className={styles.previewHeader}>
                  <span>Draft Preview</span>
                  <button onClick={handleCopy} className={styles.copyBtn}>
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy Draft'}
                  </button>
                </div>
                <pre className={styles.previewText}>
                  {activeBlueprint.template(formData)}
                </pre>
              </div>
            </div>

            <div className={styles.blueprintNotice}>
              <Info size={16} />
              <p>This is a starting template only. It does not constitute legal advice. Please verify details with a professional before submitting.</p>
            </div>
          </motion.div>
        ) : (
          <div className={styles.emptyBlueprint}>
            <FileText size={48} opacity={0.1} />
            <p>Select a blueprint above to start drafting</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
