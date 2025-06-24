// API configuration and utilities
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Get auth token from localStorage
  getAuthToken() {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  // Set auth token in localStorage
  setAuthToken(token) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
  }

  // Remove auth token from localStorage
  removeAuthToken() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  }

  // Make HTTP request
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.post('/auth/login', { email, password });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async register(userData) {
    const response = await this.post('/auth/register', userData);
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async logout() {
    try {
      await this.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  // Business methods
  async getBusinesses(params = {}) {
    return this.get('/businesses', params);
  }

  async getBusinessesByCategory(category, params = {}) {
    return this.get(`/businesses/category/${category}`, params);
  }

  async getBusiness(category, slug) {
    return this.get(`/businesses/${category}/${slug}`);
  }

  async createBusiness(businessData) {
    return this.post('/businesses', businessData);
  }

  async updateBusiness(businessId, businessData) {
    return this.put(`/businesses/${businessId}`, businessData);
  }

  async deleteBusiness(businessId) {
    return this.delete(`/businesses/${businessId}`);
  }

  async getMyBusinesses() {
    return this.get('/businesses/my');
  }

  async getBusinessById(businessId) {
    return this.get(`/businesses/${businessId}`);
  }

  // Review methods
  async getReviews(businessId, params = {}) {
    return this.get(`/businesses/${businessId}/reviews`, params);
  }

  async createReview(businessId, reviewData) {
    return this.post(`/businesses/${businessId}/reviews`, reviewData);
  }

  // User methods
  async getProfile() {
    return this.get('/users/profile');
  }

  async updateProfile(userData) {
    return this.put('/users/profile', userData);
  }
}

// Create and export a singleton instance
const apiClient = new ApiClient();

export default apiClient;

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  getBusinesses,
  getBusinessesByCategory,
  getBusiness,
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getMyBusinesses,
  getBusinessById,
  getReviews,
  createReview,
  getProfile,
  updateProfile
} = apiClient;
