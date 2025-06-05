import axios from 'axios'

const API_URL = 'http://localhost:5000/api'

// Create a new order with Razorpay
export const createOrder = async (amount) => {
  try {
    const response = await axios.post(`${API_URL}/payments/create-order`, { amount })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create order' }
  }
}

// Verify payment after successful transaction
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payments/verify`, paymentData)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Payment verification failed' }
  }
}

// Process refund if needed
export const processRefund = async (paymentId, amount) => {
  try {
    const response = await axios.post(`${API_URL}/payments/refund`, { paymentId, amount })
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Refund process failed' }
  }
}

// Get payment history for a user
export const getPaymentHistory = async () => {
  try {
    const response = await axios.get(`${API_URL}/payments/history`)
    return response.data
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch payment history' }
  }
}