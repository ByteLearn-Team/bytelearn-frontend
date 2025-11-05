// Centralized API config for BytLearn frontend
// Edit this file to change the backend URL for all pages
window.BYTLEARN_API_URL = window.BYTLEARN_API_URL || 'https://bytelearn-backend.onrender.com';

// Convenience wrapper around fetch to make calls easier: byFetch('/path', options)
window.byFetch = function(path, options) {
  const base = (window.BYTLEARN_API_URL || '');
  // if path already absolute, use as-is
  if (/^https?:\/\//i.test(path)) return fetch(path, options);
  return fetch(base + path, options);
};

// Also expose a simple constant for inline scripts
window.API_URL = window.BYTLEARN_API_URL;
