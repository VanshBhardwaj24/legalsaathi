import { generateText } from '../tools/llm.js';

export const runTimeline = async (intakeResult) => {
    console.log('    🔍 Extracting Case Chronology...');
    
    const extractionSystem = "You are a legal analyst specializing in chronological case mapping. " +
        "Extract every date and significant event from the case summary to build a timeline. " +
        "CRITICAL RULES:\n" +
        "1. If a specific date is NOT found for an event, use a sequential title like 'Event 1', 'Event 2' or a descriptive phase name like 'Initial Incident', 'Escalation Phase'.\n" +
        "2. NEVER use the word 'Unknown' as a title.\n" +
        "3. Interpret relative dates (e.g. 'Monday', 'next day') correctly based on the context.\n" +
        "Output exactly a JSON array of objects. NO OTHER TEXT. NO THINKING BLOCKS.\n\n" +
        "Format for react-chrono:\n" +
        "[\n" +
        "  {\n" +
        "    \"title\": \"[Date/Sequence Focus]\",\n" +
        "    \"cardTitle\": \"[Brief Title of Event]\",\n" +
        "    \"cardSubtitle\": \"[Parties/People involved in this specific event]\",\n" +
        "    \"cardDetailedText\": \"[Detailed description of what occurred]\"\n" +
        "  }\n" +
        "]";

    const prompt = `CASE SUMMARY:\n${intakeResult.summary}`;

    const jsonString = await generateText({
        system: extractionSystem,
        prompt: prompt,
        apiKey: process.env.GROQ_API_KEY_2,
        model: 'llama-3.1-8b-instant'
    });

    try {
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : jsonString);
        // Sort chronologically if possible? LLM usually handles this but we trust but verify.
        return parsed;
    } catch (e) {
        console.error("⚠️ Failed to parse Timeline JSON:", e);
        return [];
    }
};
