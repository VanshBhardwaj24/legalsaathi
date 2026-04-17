/**
 * Global Configuration for LegalSaathi
 */

const isProd = import.meta.env.PROD;

export const API_URL = isProd 
  ? import.meta.env.VITE_API_URL || 'https://legalsaathi-api.vercel.app' // Fallback for production
  : 'http://localhost:3004';

export const CONFIG = {
  API_URL,
  GLOSSARY_LIMIT: 100,
  APP_VERSION: '1.2.0-Intelligence'
};
