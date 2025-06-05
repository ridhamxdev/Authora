/**
 * Handles API errors consistently across the application
 * @param {Error} error - The error object from axios or fetch
 * @param {Function} toastFn - Toast notification function (optional)
 * @returns {object} - Normalized error object
 */
export const handleApiError = (error, toastFn = null) => {
  // Default error response
  const defaultError = {
    message: 'An unexpected error occurred. Please try again.',
    status: 500,
    data: null
  };

  // No error passed
  if (!error) {
    return defaultError;
  }

  // Handle Axios errors
  if (error.response) {
    // Server responded with a status code outside of 2xx range
    const errorMessage = error.response.data?.message || 
                         error.response.data?.error || 
                         `Error: ${error.response.status}`;
    
    // Show toast notification if function provided
    if (toastFn) {
      toastFn(errorMessage, { type: 'error' });
    }
    
    return {
      message: errorMessage,
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received (network error)
    const errorMessage = 'Network error. Please check your connection.';
    
    if (toastFn) {
      toastFn(errorMessage, { type: 'error' });
    }
    
    return {
      message: errorMessage,
      status: 0,
      data: null
    };
  } else {
    // Something else happened while setting up the request
    const errorMessage = error.message || defaultError.message;
    
    if (toastFn) {
      toastFn(errorMessage, { type: 'error' });
    }
    
    return {
      message: errorMessage,
      status: 500,
      data: null
    };
  }
};

/**
 * Checks if an error is a network error
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether it's a network error
 */
export const isNetworkError = (error) => {
  return error && error.request && !error.response;
};

/**
 * Checks if an error is an authentication error
 * @param {Error} error - The error to check
 * @returns {boolean} - Whether it's an auth error
 */
export const isAuthError = (error) => {
  return error && error.response && (error.response.status === 401 || error.response.status === 403);
};