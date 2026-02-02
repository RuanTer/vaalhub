/**
 * reCAPTCHA Utilities
 * Handles reCAPTCHA v3 token generation
 */

import { RECAPTCHA } from '../config/api';

/**
 * Execute reCAPTCHA and get token
 * @param {string} action - The action name for this reCAPTCHA execution
 * @returns {Promise<string|null>} reCAPTCHA token or null if failed
 */
export const executeRecaptcha = async (action) => {
  try {
    // Check if grecaptcha is loaded
    if (!window.grecaptcha || !window.grecaptcha.execute) {
      console.warn('reCAPTCHA not loaded yet');
      return null;
    }

    const siteKey = RECAPTCHA.SITE_KEY;
    
    if (!siteKey || siteKey === 'YOUR_RECAPTCHA_SITE_KEY_HERE') {
      console.warn('reCAPTCHA site key not configured');
      // Allow form submission without reCAPTCHA in development
      return 'dev_mode_no_recaptcha';
    }

    const token = await window.grecaptcha.execute(siteKey, { action });
    return token;
  } catch (error) {
    console.error('reCAPTCHA error:', error);
    return null;
  }
};

/**
 * Check if reCAPTCHA is ready
 * @returns {boolean} True if reCAPTCHA is loaded and ready
 */
export const isRecaptchaReady = () => {
  return !!(window.grecaptcha && window.grecaptcha.execute);
};
