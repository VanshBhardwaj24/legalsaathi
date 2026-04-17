export interface LegalProcedure {
  id: string;
  title: string;
  description: string;
  steps: {
    title: string;
    description: string;
  }[];
}

export const PROCEDURAL_GUIDES: LegalProcedure[] = [
  {
    id: 'fir',
    title: 'How to File an FIR',
    description: 'A First Information Report (FIR) is the first step to initiating a criminal investigation in India.',
    steps: [
      { title: 'Visit the Police Station', description: 'Go to the nearest police station to the incident. You can also file a "Zero FIR" at any station.' },
      { title: 'Narrate the Incident', description: 'Clearly explain what happened, when, where, and who was involved.' },
      { title: 'Verify the Writing', description: 'The officer must write down your narration. You have the right to hear it read out.' },
      { title: 'Read and Sign', description: 'Sign the report only after verifying all details are correct.' },
      { title: 'Receive a Free Copy', description: 'Under Section 154 CrPC (or BNSS equivalent), you are entitled to a free copy of the FIR.' }
    ]
  },
  {
    id: 'bail',
    title: 'How to Apply for Bail',
    description: 'Process for seeking temporary release from custody during a pending trial.',
    steps: [
      { title: 'Determine Offense Type', description: 'Check if the offense is Bailable or Non-Bailable.' },
      { title: 'Engage a Lawyer', description: 'A legal professional will draft the bail application (Anticipatory or Regular).' },
      { title: 'File with Area Magistrate', description: 'Submit the application to the Court having jurisdiction.' },
      { title: 'Furnish Bail Bond', description: 'If granted, provide the required monetary security or personal bond.' },
      { title: 'Adhere to Conditions', description: 'Comply with any court-imposed restrictions (e.g., surrendering passport).' }
    ]
  }
];

export const LIMITATION_PERIODS = [
  { suit: 'Money Recovery / Debt', period: '3 Years', triggering_point: 'Date of default/demand' },
  { suit: 'Breach of Contract', period: '3 Years', triggering_point: 'Date of breach' },
  { suit: 'Possession of Property', period: '12 Years', triggering_point: 'Date of dispossession' },
  { suit: 'Commercial Suits (NCDRC)', period: '2 Years', triggering_point: 'Date of cause of action' },
  { suit: 'Appeal to High Court', period: '90 Days', triggering_point: 'Date of lower court decree' },
  { suit: 'Appeal to District Court', period: '30 Days', triggering_point: 'Date of order' }
];

export const JURISDICTION_MAP = [
  { court: 'District Civil Court', pecuniary: 'Up to ₹2 Crore (varies by state)', nature: 'General Civil' },
  { court: 'High Court (Original)', pecuniary: 'Above ₹2 Crore (Delhi, Bombay, etc.)', nature: 'Significant Civil/Commercial' },
  { court: 'Small Causes Court', pecuniary: 'Low-value claims', nature: 'Rent, small debts' },
  { court: 'Consumer Forum (District)', pecuniary: 'Up to ₹50 Lakhs', nature: 'Consumer grievances' },
  { court: 'Consumer Forum (State)', pecuniary: '₹50 Lakhs to ₹2 Crore', nature: 'Consumer appeals/large claims' }
];
