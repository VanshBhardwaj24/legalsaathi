export interface LegalLiteracyGuide {
  id: string;
  title: string;
  category: 'Civil' | 'Criminal' | 'Constitutional' | 'Consumer' | 'Family' | 'Labour' | 'Cyber';
  summary: string;
  content: string; // Markdown supported
  mythBusters?: { myth: string; reality: string }[];
  templates?: { name: string; content: string }[];
}

export const LEGAL_LITERACY_DATA: LegalLiteracyGuide[] = [
  {
    id: 'rti-action',
    title: 'The Right to Information (RTI) Blueprint',
    category: 'Constitutional',
    summary: 'The ultimate tool to make the government accountable. Learn how to file an RTI in 10 minutes.',
    content: `
### What is RTI?
The Right to Information Act, 2005 allows any Indian citizen to request information from a public authority.

### Step-by-Step Filing Process
1. **Identify the Authority**: Find the Public Information Officer (PIO) for the department (e.g., Municipal Corp, Police, PMO).
2. **Draft the Application**: Clearly state your questions. Avoid asking "Why?", instead ask for "Certified copies of documents X".
3. **Pay the Fee**: Usually ₹10. Can be paid via Indian Postal Order (IPO), Court Fee Stamp, or Online (via rtionline.gov.in).
4. **Timelines**: PIO must respond within **30 days**. If life/liberty is involved, response must be in **48 hours**.

### What if they don't respond?
- **First Appeal**: To the Senior Officer if no response in 30 days.
- **Second Appeal**: To the Information Commission (State or Central).
    `,
    mythBusters: [
      { myth: "I have to explain why I want the information.", reality: "No. Under Section 6(2), you are NOT required to give any reason for requesting information." }
    ],
    templates: [
      { name: "Basic RTI Draft", content: "To, The PIO, [Department Name]... Subject: Request for Information under RTI Act 2005. I seek the following information: 1. [Details]... I have enclosed a fee of Rs. 10 via [IPO No]." }
    ]
  },
  {
    id: 'arrest-rights',
    title: 'The Arrest Shield: Know Your 10 Rights',
    category: 'Criminal',
    summary: 'Rights that every citizen possesses at the time of arrest and detention, as mandated by the Supreme Court.',
    content: `
### The D.K. Basu Guidelines
The Supreme Court in *D.K. Basu v. State of West Bengal* laid down mandatory protocols:

1. **Identification**: Arresting officers must wear clear, visible name tags and designations.
2. **Arrest Memo**: A memo must be prepared at the time of arrest, signed by at least one witness (family member or locality resident).
3. **Right to Inform**: Arrestee has the right to have one friend or relative notified of their arrest and place of detention.
4. **The 24-Hour Rule**: You must be produced before a Magistrate within 24 hours (excluding travel time).
5. **Medical Examination**: You can request a medical exam at the time of arrest to record existing injuries (useful for preventing custodial torture).

### Women's Special Rights
- Women cannot be arrested after **sunset and before sunrise**, except in extraordinary cases with a Magistrate's prior permission.
- A woman can only be searched or arrested by a **female officer**.
    `,
    mythBusters: [
      { myth: "Police can keep me in the station for 2 days for questioning.", reality: "Strictly forbidden. Every arrestee must be presented to a Judicial Magistrate within 24 hours." }
    ]
  },
  {
    id: 'consumer-protection',
    title: 'The Consumer Shield: Fighting Unfair Trade',
    category: 'Consumer',
    summary: 'Protection against defective goods, deficient services, and misleading advertisements.',
    content: `
### Your 6 Rights as a Consumer
1. **Right to Safety**: Against hazardous goods.
2. **Right to Information**: About quality, quantity, purity, and price.
3. **Right to Choose**: Competitive prices and variety.
4. **Right to be Heard**: Representation in forums.
5. **Right to Redressal**: Against unfair trade practices.
6. **Right to Consumer Education**.

### How to file a Complaint?
1. **Legal Notice**: Send a formal notice to the seller giving them 15 days to resolve the issue.
2. **Select Forum**: Based on value:
   - **District**: Up to ₹50 Lakh.
   - **State**: ₹50 Lakh to ₹2 Crore.
   - **National**: Above ₹2 Crore.
3. **E-Daakhil**: You can now file consumer complaints online via the E-Daakhil portal.
    `,
    mythBusters: [
      { myth: "\"Goods once sold will not be taken back\" is a valid rule.", reality: "No. This is an Unfair Trade Practice. If the product is defective, they MUST replace or refund it under the 2019 Act." }
    ]
  },
  {
    id: 'inheritance-equality',
    title: 'The Inheritance Codes: Equality in Property',
    category: 'Family',
    summary: 'Understanding the 2005 breakthrough for daughters and succession laws for all.',
    content: `
### The 2005 Amendment (Hindu Succession Act)
Post-2005, daughters are **Coparceners** by birth. This means:
- A daughter has the SAME rights in ancestral property as a son.
- Marriage does NOT take away this right.
- This applies even if the father died before 2005 (as per landmark SC judgments).

### Self-Acquired vs. Ancestral
- **Ancestral**: Property passed down for 4 generations. Rights are by birth.
- **Self-Acquired**: Property bought by someone with their own money. They can give it to anyone via a **Will**.
    `,
    mythBusters: [
      { myth: "Only sons can inherit ancestral property.", reality: "False. Since 2005, daughters have equal status as coparceners." }
    ]
  },
  {
      id: 'cyber-safety',
      title: 'Digital Armor: Protecting Your Virtual Life',
      category: 'Cyber',
      summary: 'Essential knowledge to protect against financial fraud and social media harassment.',
      content: `
### Common Cyber Crimes
1. **Phishing/Vishing**: Fake calls/emails to steal OTPs.
2. **Identity Theft**: Impersonating you on social media.
3. **Cyber Stalking**: Harassing messages or tracking.

### What to do if scammed?
- **Helpline 1930**: Immediately call this Ministry of Home Affairs helpline for financial cyber fraud.
- **cybercrime.gov.in**: Lodge a formal complaint online.
- **Freeze Accounts**: Contact your bank immediately to block the UPI/Account.
      `,
      mythBusters: [
          { myth: "Banks will call you to verify your KYC via OTP.", reality: "NEVER. Banks, RBI, and government bodies NEVER ask for OTPs or PINs over the phone." }
      ]
  }
];

export const DID_YOU_KNOW_FACTS = [
  "A police officer is always 'on duty' and must act even if they are not in uniform or at their designated station.",
  "You cannot be arrested for a civil debt or non-payment of a loan by the police; it is a court process.",
  "In an emergency, a 'Zero FIR' can be filed at any police station regardless of jurisdiction.",
  "Maternity Benefit Act allows for 26 weeks of paid leave for female employees in establishments with 10+ people.",
  "Under the Right to Education (RTE), 25% of seats in private schools must be reserved for children from weaker sections."
];
