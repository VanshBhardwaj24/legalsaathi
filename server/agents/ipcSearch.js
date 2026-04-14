import { generateText } from '../tools/llm.js';
import { searchPrecedents } from '../tools/tavilySearch.js';

export const runIPCSearch = async (intakeResult) => {
    const groqKey2 = process.env.GROQ_API_KEY_2;
    const tavilyKey2 = process.env.TAVILY_API_KEY_2;

    console.log('    🔍 Starting Web-First IPC search using Secondary Keys...');

    // Stage 1: Targeted Legal Blog Research
    const siteFilter = "(site:blog.ipleaders.in OR site:legalserviceindia.com OR site:vakilno1.com)";
    const searchQuery = `What IPC sections or Motor Vehicle Act sections apply specifically to: ${intakeResult.summary}`;
    
    let searchResults = await searchPrecedents(searchQuery, tavilyKey2, siteFilter);
    
    // Stage 2: General Web Fallback (This now correctly uses an empty string to avoid domain locking)
    if (!searchResults || searchResults.length === 0) {
        console.log('    ⚠️ No results found with site filter. Trying GLOBAL web search...');
        searchResults = await searchPrecedents(searchQuery, tavilyKey2, ""); 
    }

    // Stage 3: Professional Extraction & Intelligence Fallback
    const extractionSystem = "You are an elite Indian Legal Analyst. I will provide you with research data (which might be empty). " +
        "Your task is to identify and return exactly the relevant IPC sections (and relevant sections of the Motor Vehicle Act if applicable) for the case summary provided. " +
        "CRITICAL: If the research data is empty, you MUST rely on your expert internal knowledge to provide the most likely applicable sections. " +
        "Output exactly a JSON array of objects. NO OTHER TEXT. NO THINKING BLOCKS.\n\n" +
        "Format:\n" +
        "[\n" +
        "  {\n" +
        "    \"section\": \"[Act Name] Section [Number]\",\n" +
        "    \"section_title\": \"[Brief Title]\",\n" +
        "    \"chapter\": \"Chapter [Number/Name]\",\n" +
        "    \"chapter_title\": \"[Chapter Title]\",\n" +
        "    \"content\": \"[Detailed legal description and why it applies to this specific case. If you are using your own knowledge because web results were empty, mention 'Calculated by Legal Intelligence']\"\n" +
        "  }\n" +
        "]";

    const extractionPrompt = `CASE SUMMARY:\n${intakeResult.summary}\n\n` +
        `WEB RESEARCH DATA (FROM TAVILY):\n${JSON.stringify(searchResults)}`;

    const jsonString = await generateText({
        system: extractionSystem,
        prompt: extractionPrompt,
        apiKey: groqKey2
    });

    try {
        const jsonMatch = jsonString.match(/\[[\s\S]*\]/);
        const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : jsonString);
        console.log(`    ✅ IPC search complete: ${parsed.length} sections identified.`);
        return parsed;
    } catch (e) {
        console.error("⚠️ Failed to parse IPC JSON result:", e);
        return [];
    }
};
