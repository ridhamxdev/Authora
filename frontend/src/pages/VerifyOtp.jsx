import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Box, 
  CircularProgress, 
  Alert 
} from '@mui/material'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'

const VerifyOtp = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  
  const { verifyOtp, resendOtp, tempEmail } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect if no email is stored (user didn't come from register/login)
    if (!tempEmail) {
      navigate('/login')
      return
    }
    
    // Countdown timer for OTP resend
    let timer
    if (countdown > 0 && !canResend) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    } else {
      setCanResend(true)
    }
    
    return () => clearTimeout(timer)
  }, [countdown, canResend, tempEmail, navigate])
  
  const handleChange = (e) => {
    setOtp(e.target.value)
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      await verifyOtp(otp)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handleResendOtp = async () => {
    setLoading(true)
    setError(null)
    
    try {
      await resendOtp()
      setCountdown(60)
      setCanResend(false)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          mb: 3
        }}>
          <Box sx={{ 
            bgcolor: 'primary.main', 
            color: 'white', 
            borderRadius: '50%', 
            p: 1, 
            mb: 1 
          }}>
            <VerifiedUserIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Verify OTP
          </Typography>
        </Box>
        
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          We've sent a verification code to {tempEmail}
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="otp"
            label="Enter OTP"
            name="otp"
            autoFocus
            value={otp}
            onChange={handleChange}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Verify'}
          </Button>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            {canResend ? (
              <Button 
                variant="text" 
                onClick={handleResendOtp}
                disabled={loading}
              >
                Resend OTP
              </Button>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Resend OTP in {countdown} seconds
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default VerifyOtp