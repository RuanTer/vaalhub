/**
 * Application Constants
 * Centralizes all magic numbers and configuration values
 */

export const TIMING = {
  CAROUSEL_INTERVAL: 7000,
  FEATURED_STORIES_INTERVAL: 3000,
  SUCCESS_MESSAGE_DURATION: 3000,
  MODAL_AUTO_CLOSE: 2000,
};

export const LIMITS = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 150,
  PHONE_MIN_LENGTH: 10,
  PHONE_MAX_LENGTH: 20,
  BUSINESS_NAME_MIN_LENGTH: 2,
  BUSINESS_NAME_MAX_LENGTH: 150,
  MESSAGE_MAX_LENGTH: 1000,
};

export const VALIDATION = {
  PHONE_PATTERN: '[0-9\\s\\-\\+\\(\\)]{10,20}',
  PHONE_TITLE: 'Please enter a valid phone number (10-20 digits)',
};

export const SOCIAL_LINKS = {
  FACEBOOK: '#',
  TWITTER: '#',
  INSTAGRAM: '#',
};

export const TOWNS = [
  { 
    name: 'Vereeniging', 
    slug: 'vereeniging', 
    path: '/towns/vereeniging',
    shortDesc: 'Historic town on the banks of the Vaal River'
  },
  { 
    name: 'Vanderbijlpark', 
    slug: 'vanderbijlpark', 
    path: '/towns/vanderbijlpark',
    shortDesc: 'Industrial hub of the Vaal Triangle'
  },
  { 
    name: 'Meyerton', 
    slug: 'meyerton', 
    path: '/towns/meyerton',
    shortDesc: 'Gateway to the Vaal Triangle'
  },
  { 
    name: 'Sharpeville', 
    slug: 'sharpeville', 
    path: '/towns/sharpeville',
    shortDesc: 'Site of historic 1960 massacre'
  },
  { 
    name: 'Sasolburg', 
    slug: 'sasolburg', 
    path: '/towns/sasolburg',
    shortDesc: 'Home of Sasol petrochemical industry'
  },
];
