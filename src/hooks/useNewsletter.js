/**
 * Newsletter Subscription Hook
 * Handles newsletter subscription logic with reCAPTCHA
 */

import { useState } from 'react';
import { API_ENDPOINTS } from '../config/api';
import { TIMING } from '../config/constants';
import { executeRecaptcha } from '../utils/recaptcha';

export const useNewsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(''); // '', 'loading', 'success', 'error'

  const subscribe = async (e) => {
    if (e) e.preventDefault();
    
    setStatus('loading');

    try {
      // Get reCAPTCHA token
      const recaptchaToken = await executeRecaptcha('newsletter');

      if (!recaptchaToken) {
        setStatus('error');
        setTimeout(() => setStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
        return;
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('email', email);
      formData.append('timestamp', new Date().toISOString());
      formData.append('type', 'newsletter');
      formData.append('recaptchaToken', recaptchaToken);

      // Submit to Google Apps Script
      const response = await fetch(API_ENDPOINTS.NEWSLETTER, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
      } else {
        setStatus('error');
        setTimeout(() => setStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      setStatus('error');
      setTimeout(() => setStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
    }
  };

  const reset = () => {
    setEmail('');
    setStatus('');
  };

  return {
    email,
    setEmail,
    status,
    subscribe,
    reset,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error',
  };
};
