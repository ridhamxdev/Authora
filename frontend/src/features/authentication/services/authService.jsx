import axios from 'axios'

const API_URL = 'http://localhost:5000/api/users'

// Register user
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData)
  return response.data
}

// Verify OTP
export const verifyOtp = async (email, otp) => {
  const response = await axios.post(`${API_URL}/verify-otp`, { email, otp })
  return response.data
}

// Login user
export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials)
  return response.data
}

// Get user profile
export const getUserProfile = async () => {
  const response = await axios.get(`${API_URL}/me`)
  return response.data
}

// Update user profile
export const updateUserProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/profile`, userData)
  return response.data
}

// Request password reset
export const requestPasswordReset = async (email) => {
  const response = await axios.post(`${API_URL}/forgot-password`, { email })
  return response.data
}

// Reset password
export const resetPassword = async (token, password) => {
  const response = await axios.post(`${API_URL}/reset-password`, { token, password })
  return response.data
}