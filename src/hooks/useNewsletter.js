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
      // Get reCAPTCHA token (optional - don't block submission if it fails)
      const recaptchaToken = await executeRecaptcha('newsletter');

      // Prepare form data
      const formData = new FormData();
      formData.append('email', email);
      formData.append('timestamp', new Date().toISOString());
      formData.append('type', 'newsletter');

      // Only add reCAPTCHA token if available
      if (recaptchaToken && recaptchaToken !== 'dev_mode_no_recaptcha') {
        formData.append('recaptchaToken', recaptchaToken);
      }

      // Submit to Google Apps Script
      const response = await fetch(API_ENDPOINTS.NEWSLETTER, {
        method: 'POST',
        body: formData,
        redirect: 'follow',
      });

      // Try to parse JSON response
      let data;
      try {
        const text = await response.text();
        console.log('Newsletter response text:', text);
        data = JSON.parse(text);
      } catch (parseError) {
        console.log('Could not parse response as JSON, assuming success');
        // If we can't parse JSON but the request succeeded, assume success
        if (response.ok) {
          data = { success: true };
        } else {
          throw new Error('Failed to parse response');
        }
      }

      if (data.success || response.ok) {
        setStatus('success');
        setEmail('');
        setTimeout(() => setStatus(''), TIMING.SUCCESS_MESSAGE_DURATION);
      } else {
        console.error('Server response:', data);
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
