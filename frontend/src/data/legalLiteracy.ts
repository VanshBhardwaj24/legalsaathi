export interface LegalLiteracyGuide {
  id: string;
  title: string;
  category: 'Civil' | 'Criminal' | 'Constitutional' | 'Consumer' | 'Family' | 'Labour' | 'Cyber' | 'Students' | 'Women';
  summary: string;
  content: string; // Markdown supported
  mythBusters?: { myth: string; reality: string }[];
  templates?: { name: string; content: string }[];
}

export const LEGAL_LITERACY_DATA: LegalLiteracyGuide[] = [
  {
    id: 'rti-action',
    title: 'The RTI Blueprint',
    category: 'Constitutional',
    summary: 'The ultimate tool to make the government accountable. Learn how to file an RTI in 10 minutes.',
    content: `
### What is RTI?
The Right to Information Act, 2005 allows any Indian citizen to request information from a public authority.

### Step-by-Step Filing Process
1. **Identify the Authority**: Find the Public Information Officer (PIO) for the department.
2. **Draft the Application**: Clearly state your questions. Avoid asking "Why?", instead ask for "Certified copies of documents X".
3. **Pay the Fee**: Usually ₹10. 
4. **Timelines**: PIO must respond within **30 days**. If life/liberty is involved, response must be in **48 hours**.
    `,
    mythBusters: [
      { myth: "I have to explain why I want the information.", reality: "No. Under Section 6(2), you are NOT required to give any reason." }
    ],
    templates: [
      { name: "Basic RTI Draft", content: "To, The PIO, [Department]... Subject: Request for Information under RTI Act 2005. Details: 1. [Details]..." }
    ]
  },
  {
    id: 'arrest-shield',
    title: 'The Arrest Shield: D.K. Basu Guidelines',
    category: 'Criminal',
    summary: 'Rights that every citizen possesses at the time of arrest, as mandated by the Supreme Court.',
    content: `
### Your Essential 10 Rights
1. **Identification**: Arresting officers must wear clear name tags.
2. **Arrest Memo**: Must be prepared at the time of arrest and signed by a witness.
3. **Right to Inform**: You have the right to have one relative notified.
4. **The 24-Hour Rule**: You must be produced before a Magistrate within 24 hours.
5. **Medical Exam**: You can request a medical exam to record existing injuries.
    `,
    mythBusters: [
      { myth: "Police can keep me for 2 days for questioning.", reality: "No. The 24-hour limit is absolute." }
    ]
  },
  {
    id: 'pca-complaint',
    title: 'Police Misconduct: The PCA Procedure',
    category: 'Criminal',
    summary: 'How to file a formal complaint against a police officer for abuse of power.',
    content: `
### What is the PCA?
The Police Complaints Authority (PCA) is an independent body established to investigate serious misconduct by police officers.

### When to approach PCA?
- Unauthorized arrest or detention.
- Custodial torture or assault.
- Extortion or serious abuse of power.
- Refusal to file an FIR in a cognizable case.

### Filing the Complaint
1. **Drafting**: Clearly mention the officer's name, designation, and the specific event.
2. **Evidence**: Attach any medical reports, photos, or witness statements.
3. **Direct Filing**: You can file directly at the PCA office in your State Capital or District HQ.
    `,
    mythBusters: [
      { myth: "I can only complain to the police about the police.", reality: "False. The PCA is an independent body and does not report to the Police Department." }
    ]
  },
  {
    id: 'anti-ragging',
    title: 'Anti-Ragging: The Student Shield',
    category: 'Students',
    summary: 'UGC regulations and criminal laws protecting students from college harassment.',
    content: `
### What constitutes Ragging?
Any act that causes physical or psychological harm, shame, or embarrassment to a student.

### Legal Protections
1. **UGC Regulations**: Mandatory Anti-Ragging Committees in every college.
2. **Criminal Liability**: Ragging is a cognizable offence under various State Acts.
3. **Suspension/Expulsion**: Colleges are mandated to suspend students accused of ragging immediately.

### Action Plan
- Call the **National Anti-Ragging Helpline**: 1800-180-5522.
- Email: helpline@antiragging.in.
- File an FIR if physical harm or extreme harassment is involved.
    `,
    mythBusters: [
      { myth: "Ragging is just 'healthy interaction' for personality building.", reality: "False. It is a criminal offence that can lead to permanent expulsion and jail time." }
    ]
  },
  {
    id: 'labour-shield',
    title: 'Labour Shield: Rights against Termination',
    category: 'Labour',
    summary: 'Protection against arbitrary firing and understanding your notice period rights.',
    content: `
### Industrial Disputes Act (Section 25F)
If you have worked for more than 1 year, you cannot be terminated (retrenched) without:
1. **One Month Notice**: Or payment in lieu of notice.
2. **Retrenchment Compensation**: 15 days' average pay for every year of completed service.
3. **Reasonable Cause**: Firing without a valid disciplinary reason is illegal.

### Maternity Benefits
Female employees are entitled to **26 weeks of paid maternity leave**. Termination during this period is a punishable offence.
    `,
    mythBusters: [
      { myth: "Private companies can fire me 'at will' without any notice.", reality: "No. Indian labour laws require valid reasons and mandatory notice/compensation for retrenchment." }
    ]
  },
  {
    id: 'writ-remedies',
    title: 'The Ultimate Weapon: Writ Petitions',
    category: 'Constitutional',
    summary: 'Moving the Supreme Court directly under Article 32 for Fundamental Rights.',
    content: `
### What are Writs?
Official orders issued by the Supreme Court (Article 32) or High Courts (Article 226) to enforce Fundamental Rights.

### The 5 Essential Writs
1. **Habeas Corpus**: "To have the body." Used to release someone unlawfully detained by the police.
2. **Mandamus**: "We command." Used to force a public official to do their duty.
3. **Prohibition**: Issued to a lower court to stop them from exceeding their jurisdiction.
4. **Certiorari**: To quash an illegal order passed by a lower court.
5. **Quo Warranto**: "By what authority." To challenge a person holding a public office illegally.
    `,
    mythBusters: [
      { myth: "I must always go to a Lower Court first.", reality: "False. For violation of Fundamental Rights, you can approach the Supreme Court directly under Article 32." }
    ]
  },
  {
    id: 'cyber-safety',
    title: 'Digital Armor: Protecting Your Virtual Life',
    category: 'Cyber',
    summary: 'Essential knowledge to protect against financial fraud and social media harassment.',
    content: `
### What to do if scammed?
- **Helpline 1930**: Immediately call this for financial cyber fraud.
- **cybercrime.gov.in**: Lodge a formal complaint online.
- **Evidence**: Keep screenshots of chats, transaction IDs, and fake profiles.
      `,
      mythBusters: [
          { myth: "Banks will call you for KYC verification via OTP.", reality: "No. Banks NEVER ask for OTPs or PINs over the phone." }
      ]
  }
];

export const DID_YOU_KNOW_FACTS = [
  "A police officer is always 'on duty' and must act even if they are not in uniform.",
  "You cannot be arrested for a civil debt by the police; it is a court process.",
  "In an emergency, a 'Zero FIR' can be filed at any police station regardless of jurisdiction.",
  "The Bhasin Judgment (2020) recognized the Right to Internet as a part of Article 19.",
  "A woman can't be arrested after sunset and before sunrise without a judge's special order."
];

export const CATEGORIES = [
  { id: 'all', name: 'All Topics', icon: 'Library' },
  { id: 'Criminal', name: 'Criminal & Police', icon: 'Shield' },
  { id: 'Constitutional', name: 'Citizen Power', icon: 'Zap' },
  { id: 'Labour', name: 'Workplace Rights', icon: 'Briefcase' },
  { id: 'Students', name: 'Student Rights', icon: 'GraduationCap' },
  { id: 'Consumer', name: 'Consumer Shield', icon: 'ShoppingCart' },
  { id: 'Cyber', name: 'Digital Armor', icon: 'Globe' },
  { id: 'Women', name: 'Women\'s Protections', icon: 'Heart' }
];

// Violation Checker Logic Trees
export const VIOLATION_WIZARD = [
  {
    id: 'arrest',
    title: 'Police & Arrest Interaction',
    questions: [
      {
        id: 'memo',
        text: 'Did the arresting officer prepare an Arrest Memo at the spot?',
        options: [
          { text: 'Yes', score: 0 },
          { text: 'No', score: 2, advice: 'Violation of D.K. Basu Guidelines. This makes the arrest technically illegal.' }
        ]
      },
      {
        id: 'inform',
        text: 'Were you allowed to inform a friend or relative about your detention?',
        options: [
          { text: 'Yes', score: 0 },
          { text: 'No', score: 1, advice: 'You have a fundamental right under Art 22(1) to inform someone immediately.' }
        ]
      },
      {
        id: 'medical',
        text: 'Did they refuse your request for a medical examination?',
        options: [
          { text: 'No', score: 0 },
          { text: 'Yes', score: 2, advice: 'Serious violation. A medical exam is your Shield against custodial torture.' }
        ]
      }
    ]
  },
  {
      id: 'labour',
      title: 'Workplace & Termination',
      questions: [
          {
              id: 'notice',
              text: 'Were you fired without a 1-month notice or salary in lieu of notice?',
              options: [
                  { text: 'Yes', score: 2, advice: 'Likely violation of Industrial Disputes Act (Section 25F).' },
                  { text: 'No', score: 0 }
              ]
          }
      ]
  }
];
