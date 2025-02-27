import axios from 'axios';

// Configure API client
const apiClient = axios.create({
  baseURL: process.env.USER_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.USER_API_KEY || ''}`,
  }
});

/**
 * Add a user to the external API
 * @param {Object} userData - User data to add
 * @returns {Promise<Object>} - API response
 */
export async function addUser(userData) {
  try {
    const response = await apiClient.post('/users', userData);
    return response.data;
  } catch (error) {
    // Enhanced error handling
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API error response:', {
        status: error.response.status,
        data: error.response.data,
        user: userData
      });
      throw new Error(`API error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API no response:', error.request);
      throw new Error('API request timeout or no response');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API request setup error:', error.message);
      throw error;
    }
  }
}

/**
 * Batch add multiple users with retries
 * @param {Array} users - Array of user data objects
 * @param {function} progressCallback - Callback to report progress
 * @returns {Promise<Object>} - Results summary
 */
export async function batchAddUsers(users, progressCallback) {
  const results = {
    total: users.length,
    successful: 0,
    failed: 0,
    errors: []
  };
  
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        await addUser(user);
        results.successful++;
        break; // Success, exit retry loop
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          results.failed++;
          results.errors.push({
            user: user.email,
            error: error.message
          });
        } else {
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
        }
      }
    }
    
    // Update progress (0-100%)
    const progress = Math.floor((i + 1) / users.length * 100);
    if (progressCallback) {
      progressCallback(progress);
    }
  }
  
  return results;
}