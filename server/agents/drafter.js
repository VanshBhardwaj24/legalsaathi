import { generateText } from '../tools/llm.js';

const TEMPLATES = {
    bail: {
        title: "Bail Application",
        system: "You are a senior criminal lawyer specializing in High Court/Session Court bail applications. Draft a formal Bail Application under Section 437/439 CrPC (or equivalent BNS). Structure: 1. Jurisdiction 2. Parties 3. Facts 4. Grounds for Bail (e.g., No prior record, cooperating with investigation, fixed place of abode) 5. Prayer."
    },
    recovery: {
        title: "Suit for Recovery",
        system: "You are an expert in Civil Procedure Code. Draft a formal Suit for Recovery of Money. Structure: 1. In the Court of [Jurisdiction] 2. Plaintiff vs Defendant 3. Particulars of Debt 4. Cause of Action 5. Limitation 6. Jurisdiction 7. Court Fee 8. Prayer."
    },
    eviction: {
        title: "Eviction Notice",
        system: "You are a property law expert. Draft a formal Legal Notice for Eviction of a Tenant. Structure: 1. Party details 2. Tenancy details 3. Termination Clause 4. Grounds for Eviction 5. Notice Period 6. Demand for possession."
    },
    divorce: {
        title: "Divorce Petition",
        system: "You are a family law specialist. Draft a formal Petition for Divorce (Mutual or Contested). Structure: 1. Marriage details 2. Grounds (if contested) 3. Separation date 4. Child custody/Alimony details (if any) 5. Prayer."
    },
    ncdrc: {
        title: "Consumer Complaint (NCDRC)",
        system: "You are a Consumer Protection expert. Draft a formal complaint to the District/State/National Consumer Commission. Structure: 1. Complainant details 2. Opposite Party 3. Deficiency in Service 4. Unfair Trade Practice 5. Compensation claimed 6. Prayer."
    },
    pil: {
        title: "Public Interest Litigation (PIL)",
        system: "You are a Constitutional Law expert. Draft a PIL petition under Article 32 or 226 of the Constitution of India. Structure: 1. Petitioner's credentials 2. Respondents (State/Authorities) 3. Public interest involved 4. Fundamental rights violated 5. Legal Grounds 6. Prayer."
    },
    p_156_3: {
        title: "Section 156(3) Petition",
        system: "You are a criminal litigation expert. Draft a petition under Section 156(3) CrPC for direction to the Police to register an FIR. Structure: 1. Facts of the offence 2. Previous attempts to file FIR (154(1), 154(3)) 3. Police inaction 4. Legal grounds 5. Prayer."
    },
    generic: {
        title: "Legal Representation",
        system: "You are an elite legal draftsmanship expert. Draft a formal legal document based on the case summary. Use Indian procedural standards: SUBJECT, FACTS, LEGAL GROUNDS, PRAYER."
    }
};

export const runDrafter = async (intake, ipc, precedent, templateType = 'generic', targetLanguage = "English") => {
    const template = TEMPLATES[templateType] || TEMPLATES.generic;
    
    console.log(`    ✍️  Running Drafter 2.0 [Template: ${template.title}]...`);

    const text = await generateText({
        system: `${template.system} ` +
            "STRICT RULES:\n" +
            "1. Use RICH MARKDOWN formatting. Use # for main titles, ## for sections.\n" +
            "2. Use BOLD for emphasizing key legal terms and parties.\n" +
            "3. Use blockquotes for citations or legal mantras.\n" +
            "4. STRICTLY Output the entire legal document in this language: " + targetLanguage + ".\n" +
            "5. NO INTERNAL MONOLOGUE: Output only the formal document text. No <think> blocks.",
        prompt: `Draft a high-end, professionally formatted ${template.title} based on this case, translated into ${targetLanguage}:\n\n` +
            `INTAKE SUMMARY:\n${JSON.stringify(intake, null, 2)}\n\n` +
            `IDENTIFIED SECTIONS:\n${JSON.stringify(ipc, null, 2)}\n\n` +
            `PRECEDENTS:\n${precedent.summary}`
    });

    return text;
};
