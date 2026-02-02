/**
 * API Configuration
 * Centralizes all external API endpoints
 */

export const API_ENDPOINTS = {
  NEWSLETTER: import.meta.env.VITE_NEWSLETTER_API_URL,
  ADVERTISING: import.meta.env.VITE_ADVERTISING_API_URL,
};

export const ANALYTICS = {
  GA_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
};

export const RECAPTCHA = {
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
};
