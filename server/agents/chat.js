import { generateText } from '../tools/llm.js';

export const handleChat = async (userMessage, analysisContext) => {
    console.log(`    💬 Processing follow-up: "${userMessage.slice(0, 50)}..."`);
    
    const chatSystem = "You are LegalSaathi, an advanced AI legal assistant. " +
        "You are helping a user with follow-up questions regarding a specific legal analysis you just performed. " +
        "Use the provided context (case summary, IPC sections, research, and draft) to answer the user's questions accurately and formally. " +
        "If the user asks something outside the scope of the provided data, advise them based on general Indian Law principles but prioritize the case facts. " +
        "ALWAYS maintain a professional, senior legal consultant tone. " +
        "NEVER include thinking blocks or conversational filler like 'Sure, I can help with that'. Go straight to the legal insight.";

    const contextString = `
CASE CONTEXT:
Summary: ${analysisContext.intake.summary}
Classification: ${analysisContext.intake.case_type}
Relevant Laws: ${JSON.stringify(analysisContext.ipc_sections)}
Precedent Research: ${analysisContext.precedents_summary}
Current Draft: ${analysisContext.raw}
`;

    const prompt = `USER FOLLOW-UP QUESTION:\n${userMessage}\n\n${contextString}`;

    return await generateText({
        system: chatSystem,
        prompt: prompt,
        apiKey: process.env.GROQ_API_KEY_2,
        model: 'llama-3.1-8b-instant'
    });
};
