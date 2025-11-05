// Centralized API config for BytLearn frontend
window.BYTLEARN_API_URL = window.BYTLEARN_API_URL || 'https://bytelearn-backend.onrender.com';

// Enhanced fetch wrapper with error handling and logging
window.byFetch = async function(path, options = {}) {
  const base = window.BYTLEARN_API_URL || '';
  const url = /^https?:\/\//i.test(path) ? path : base + path;
  
  console.log(`🔄 API Request to: ${url}`);
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      }
    });

    // Add handling for sleeping server (503)
    if (!response.ok && response.status === 503) {
      console.log('Server is waking up, retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
      return window.byFetch(path, options); // Retry the request
    }

    if (!response.ok) {
      console.error(`❌ API Error: ${response.status} ${response.statusText}`);
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }

    const data = await response.json();
    console.log(`✅ API Response:`, data);
    return response;
  } catch (error) {
    if (error.message.includes('Failed to fetch')) {
      console.log('Server might be starting up, retrying...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return window.byFetch(path, options);
    }
    console.error(`❌ API Call Failed:`, error);
    throw error;
  }
};

// API URL constant for inline scripts
window.API_URL = window.BYTLEARN_API_URL;

// Test connection on page load
window.addEventListener('load', async () => {
  try {
    const response = await window.byFetch('/');
    console.log('🟢 Backend connected successfully');
  } catch (error) {
    console.error('🔴 Backend connection failed:', error);
  }
});
