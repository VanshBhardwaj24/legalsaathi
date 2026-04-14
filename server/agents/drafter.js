import { generateText } from '../tools/llm.js';

export const runDrafter = async (intake, ipc, precedent) => {
    const text = await generateText({
        system: "You are an elite legal draftsmanship expert specialized in the Indian Judicial System. " +
            "Your objective is to draft a 'way more beautiful' and formal legal document (Legal Notice, FIR, or Written Statement as appropriate). " +
            "STRICT RULES:\n" +
            "1. Use RICH MARKDOWN formatting. Use # for main titles, ## for sections.\n" +
            "2. Use BOLD for emphasizing key legal terms and parties.\n" +
            "3. Use blockquotes for citations or legal mantras.\n" +
            "4. Structure MUST follow Indian procedural standards (e.g., SUBJECT, FACTS, LEGAL GROUNDS, PRAYER).\n" +
            "5. Ensure the document uses archaic-authoritative English common in Indian courts (e.g., 'In view of the aforesaid', 'Heretofore').\n" +
            "6. ADD A 'FEATURE ASPECT': Suggest a specific 'Next Step' or 'Strategy' section at the end of the document.\n" +
            "7. DO NOT use US legal terms. Only IPC, CrPC, and relevant Indian Case Law.\n" +
            "8. STRICTLY NO INTERNAL MONOLOGUE OR THINKING BLOCKS: Output only the formal document text. Do not provide internal reasoning, thought processes between tags like <think>, or conversational framing.",
        prompt: `Draft a high-end, professionally formatted Indian legal document based on this case:\n\n` +
            `INTAKE SUMMARY:\n${JSON.stringify(intake, null, 2)}\n\n` +
            `IDENTIFIED IPC SECTIONS:\n${JSON.stringify(ipc, null, 2)}\n\n` +
            `PRECEDENTS & RESEARCH:\n${precedent.summary}`
    });

    return text;
};
