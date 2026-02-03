/**
 * API Configuration
 * Centralizes all external API endpoints
 */

export const API_ENDPOINTS = {
  NEWSLETTER: import.meta.env.VITE_NEWSLETTER_API_URL || 'https://script.google.com/macros/s/AKfycbxa5uQyRQCnKl0EZadMRepmIiufqh2CXWWGv68MDTFxgHsw5GTxoAyj-QkwvOmdl3I0Ag/exec',
  ADVERTISING: import.meta.env.VITE_ADVERTISING_API_URL || 'https://script.google.com/macros/s/AKfycbxxjHeAHj69Ub95UZjU4pE3mtHDxdBOKWFO9_j832KeDC3bvVKgccrUcNq0mkAY4Gfnbg/exec',
};

// Log API endpoints for debugging
console.log('API Endpoints configured:', {
  newsletter: API_ENDPOINTS.NEWSLETTER,
  advertising: API_ENDPOINTS.ADVERTISING,
});

export const ANALYTICS = {
  GA_ID: import.meta.env.VITE_GA_MEASUREMENT_ID,
};

export const RECAPTCHA = {
  SITE_KEY: import.meta.env.VITE_RECAPTCHA_SITE_KEY,
};
