// Centralized API config for BytLearn frontend
// Edit this file to change the backend URL for all pages
window.BYTLEARN_API_URL = window.BYTLEARN_API_URL || 'https://bytelearn-backend.onrender.com';

// Convenience wrapper around fetch to make calls easier: byFetch('/path', options)
window.byFetch = async function(path, options = {}) {
  const base = (window.BYTLEARN_API_URL || '');
  const url = /^https?:\/\//i.test(path) ? path : base + path;
  
  console.log(`🔄 Calling API: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Handle Render sleeping server (503 response)
    if (!response.ok && response.status === 503) {
      console.log('⚠️ Server is waking up, retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return window.byFetch(path, options); // Retry the request
    }

    if (!response.ok) {
      throw new Error(`API Error ${response.status}: ${await response.text()}`);
    }

    return response;

  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.log('⚠️ Connection failed, retrying...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return window.byFetch(path, options);
    }
    throw error;
  }
};

// Also expose a simple constant for inline scripts
window.API_URL = window.BYTLEARN_API_URL;
