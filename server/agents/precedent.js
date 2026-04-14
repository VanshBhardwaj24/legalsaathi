import { generateText } from '../tools/llm.js';
import { searchPrecedents } from '../tools/tavilySearch.js';

export const runPrecedent = async (intakeResult) => {
    const searchQuery = `${intakeResult.case_type || ''} ${intakeResult.legal_domain || ''} precedent cases India`;
    const cases = await searchPrecedents(searchQuery.trim());

    if (cases.length === 0) {
        return {
            summary: "No specific precedents were found from trusted Indian legal sources.",
            cases: []
        };
    }

    // Trim results to avoid Groq Token-Per-Minute restrictions (6k TPM)
    const trimmedCases = cases.map(c => ({
        title: c.title,
        content: c.summary.substring(0, 500)
    }));

    const summary = await generateText({
        system: "You are an expert Indian legal researcher. Summarize the following case precedents in a single cohesive paragraph explaining their legal importance and relevance.",
        prompt: JSON.stringify(trimmedCases).substring(0, 6000)
    });

    return { summary, cases };
};
