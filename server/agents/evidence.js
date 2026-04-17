import { generateText } from '../tools/llm.js';

export const runEvidence = async (intakeResult, ipcResult) => {
    console.log('    🔍 Generating Evidence Matrix...');
    
    const extractionSystem = "You are a senior Indian Legal Consultant specialization in Evidence Law. " +
        "Based on the provided case summary and the identified legal sections, generate a structured checklist of evidence and documents the user should collect. " +
        "Be specific to the case facts. " +
        "Output exactly a JSON array of objects. NO OTHER TEXT. NO THINKING BLOCKS.\n\n" +
        "Format:\n" +
        "[\n" +
        "  {\n" +
        "    \"category\": \"[e.g., Medical, Documentary, Testimonial, Digital]\",\n" +
        "    \"document\": \"[Name of the specific document or evidence]\",\n" +
        "    \"importance\": \"High\" | \"Medium\" | \"Low\",\n" +
        "    \"reason\": \"[Why this is needed for the specific IPC/Legal section]\"\n" +
        "  }\n" +
        "]";

    const prompt = `CASE SUMMARY:\n${intakeResult.summary}\n\n` +
        `LEGAL SECTIONS IDENTIFIED:\n${JSON.stringify(ipcResult)}`;

    const jsonString = await generateText({
        system: extractionSystem,
        prompt: prompt,
        apiKey: process.env.GROQ_API_KEY_2,
        model: 'llama-3.1-8b-instant'
    });

    try {
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : jsonString);
    } catch (e) {
        console.error("⚠️ Failed to parse Evidence Matrix JSON:", e);
        return [];
    }
};
