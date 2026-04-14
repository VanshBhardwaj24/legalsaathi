import { tavily } from "@tavily/core";
import dotenv from 'dotenv';
dotenv.config();

export const searchPrecedents = async (query, apiKeyOverride, siteFilter) => {
    try {
        const apiKey = apiKeyOverride || process.env.TAVILY_API_KEY;
        if (!apiKey) {
            console.warn('⚠️ Tavily API Key not set. Skipping web search.');
            return [];
        }

        const tvly = tavily({ apiKey });

        // Build flexible query. 
        // We use siteFilter if it is EXPLICITLY provided (even if empty string).
        // If it's null or undefined, we fallback to indiankanoon.org for compatibility.
        const siteQuery = (siteFilter !== undefined && siteFilter !== null)
            ? `${siteFilter} ${query}`.trim()
            : `site:indiankanoon.org ${query}`;

        console.log(`    🌐 Tavily Query: "${siteQuery}"`);

        const response = await tvly.search(siteQuery, {
            maxResults: 6,
            searchDepth: "basic"
        });

        return response.results.map(item => ({
            title: item.title,
            summary: item.content,
            link: item.url
        }));
    } catch (error) {
        console.error('❌ Tavily search error:', error);
        return [];
    }
};
