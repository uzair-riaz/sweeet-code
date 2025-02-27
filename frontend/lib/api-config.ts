/**
 * Configuration for API endpoints
 */

// Base URL for API requests
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Authentication endpoints
export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  refresh: `${API_BASE_URL}/auth/refresh`,
};

// Challenge endpoints
export const CHALLENGE_ENDPOINTS = {
  list: `${API_BASE_URL}/challenges`,
  detail: (id: string) => `${API_BASE_URL}/challenges/${id}`,
  submit: (id: string) => `${API_BASE_URL}/challenges/${id}/submit`,
};

// Code execution endpoint
export const CODE_EXECUTION_ENDPOINT = `${API_BASE_URL}/run`; 