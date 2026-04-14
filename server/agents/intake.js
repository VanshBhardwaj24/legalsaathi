import { generateText } from '../tools/llm.js';

export const runIntake = async (userInput) => {
    const text = await generateText({
        system: "You're a highly skilled legal intake assistant trained to analyze plain-English legal concerns. " +
                "Identify the core legal issue, classify the legal domain (e.g., civil, criminal, labor), " +
                "and return a structured JSON response. " +
                "Response MUST be valid JSON only, no markdown fences, no explanation.",
        prompt: `The user has submitted the following legal query:\n\n"${userInput}"\n\n` +
                `Return a JSON object with these exact keys: case_type, legal_domain, summary, relevant_entities, jurisdiction.`
    });

    try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (e) {
        console.error("⚠️ Failed to parse intake JSON, using fallback.");
        return { summary: text, case_type: 'Unknown', legal_domain: 'Unknown', relevant_entities: [], jurisdiction: 'India' };
    }
};
