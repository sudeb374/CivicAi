const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ? import.meta.env.VITE_API_BASE_URL : 'http://127.0.0.1:8000';

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

async function fetchWithHandling(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }
      throw new ApiError(`HTTP Error ${response.status}`, response.status, errorData);
    }

    try {
      return await response.json();
    } catch (e) {
      throw new ApiError('Failed to parse JSON response', response.status, null);
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    // Network errors or other unexpected errors
    throw new ApiError(error.message || 'Network error occurred', 0, null);
  }
}

export const api = {
  getHealth: () => fetchWithHandling('/api/health'),
  getDistricts: () => fetchWithHandling('/api/districts'),
  getDemographics: () => fetchWithHandling('/api/demographics'),
  getInfrastructure: () => fetchWithHandling('/api/infrastructure'),
};
