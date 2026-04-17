import { tavily } from '@tavily/core';
import dotenv from 'dotenv';

dotenv.config();

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

// Local cache to avoid excessive API calls
let newsCache = {
  data: [],
  lastFetched: 0
};

const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

/**
 * Fetches legal news using Tavily Search API.
 */
export const fetchLegalNews = async () => {
  const now = Date.now();

  if (newsCache.data.length > 0 && (now - newsCache.lastFetched) < CACHE_DURATION) {
    console.log('  → Returning cached Tavily news');
    return newsCache.data;
  }

  try {
    console.log('  → Fetching legal news via Tavily...');
    const response = await tvly.search("latest supreme court and high court india legal news headlines", {
      searchDepth: "advanced",
      topic: "news",
      maxResults: 10
    });

    const sanitizedNews = response.results.map(item => {
      // 1. Clean Title: Remove "Image X:" and "###" duplicates
      let cleanTitle = item.title
        .replace(/Image \d+:/gi, '')
        .split('###')[0]
        .trim();

      // 2. Clean Snippet: Remove site navigation noise
      const noisePatterns = [
        /Trending on Group sites.*/gi,
        /Stock Market Live Updates.*/gi,
        /Editor’s Note:.*/gi,
        /Latest News.*/gi,
        /###.*/g,
        /Image \d+:.*/gi
      ];

      let cleanSnippet = item.content || item.description || "";
      noisePatterns.forEach(pattern => {
        cleanSnippet = cleanSnippet.replace(pattern, '');
      });

      // 3. Final polish
      cleanSnippet = cleanSnippet
        .replace(/\s+/g, ' ')
        .trim();

      if (cleanSnippet.length > 200) {
        cleanSnippet = cleanSnippet.slice(0, 300) + '...';
      }

      return {
        title: cleanTitle || "Legal Update",
        link: item.url,
        pubDate: item.published_date || new Date().toISOString(),
        contentSnippet: cleanSnippet || "Detailed analysis available on the primary source.",
        source: new URL(item.url).hostname.replace('www.', '')
      };
    });

    // 4. Remove exact duplicate titles
    const uniqueNews = Array.from(new Map(sanitizedNews.map(item => [item.title, item])).values());

    newsCache = {
      data: uniqueNews,
      lastFetched: now
    };

    return uniqueNews;
  } catch (error) {
    console.error('Tavily news fetch failed:', error);
    return [];
  }
};
