import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [tempEmail, setTempEmail] = useState('')
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token')
      
      if (token) {
        try {
          // Set default headers for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
          
          const response = await axios.get('http://localhost:5000/api/users/me')
          setUser(response.data)
          setIsAuthenticated(true)
        } catch (error) {
          console.error('Authentication error:', error)
          localStorage.removeItem('token')
          delete axios.defaults.headers.common['Authorization']
        }
      }
      
      setLoading(false)
    }
    
    checkAuthStatus()
  }, [])
  
  // Register user
  const register = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', userData)
      setTempEmail(userData.email)
      toast.success('Registration successful! Please verify your email.')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      throw error
    }
  }
  
  // Verify OTP
  const verifyOtp = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/verify-otp', { email, otp })
      const { token, user } = response.data
      
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      setUser(user)
      setIsAuthenticated(true)
      setTempEmail('')
      
      toast.success('Email verified successfully!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed')
      throw error
    }
  }
  
  // Login user
  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', credentials)
      if (response.data.requireOtp) {
        setTempEmail(credentials.email)
        toast.info('Please verify your email with the OTP sent')
        return { requireOtp: true }
      }
      // If backend ever returns token directly (shouldn't in 2FA flow)
      const { token, user } = response.data
      if (token && user) {
        localStorage.setItem('token', token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(user)
        setIsAuthenticated(true)
        toast.success('Login successful!')
      }
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      throw error
    }
  }
  
  // Login with OTP
  const loginWithOtp = async (email, otp) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login-otp', { email, otp })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      setUser(user)
      setIsAuthenticated(true)
      setTempEmail('')
      toast.success('Login successful!')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP login failed')
      throw error
    }
  }
  
  // Logout user
  const logout = () => {
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
    toast.info('Logged out successfully')
  }
  
  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const response = await axios.put('http://localhost:5000/api/users/profile', userData)
      setUser(response.data)
      toast.success('Profile updated successfully')
      return response.data
    } catch (error) {
      toast.error(error.response?.data?.message || 'Profile update failed')
      throw error
    }
  }
  
  const value = {
    user,
    isAuthenticated,
    loading,
    tempEmail,
    register,
    verifyOtp,
    login,
    loginWithOtp,
    logout,
    updateProfile
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}