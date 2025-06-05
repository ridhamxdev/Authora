import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Box, 
  CircularProgress, 
  Alert, 
  Stack 
} from '@mui/material'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

const Register = () => {
  const { register, verifyOtp, tempEmail } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  
  const navigate = useNavigate()
  
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleRegister = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      setStep(2)
      setSuccess('OTP sent to your email. Please verify.')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleVerifyOtp = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await verifyOtp(tempEmail || form.email, otp)
      setSuccess('Registration and verification successful!')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handleResendOtp = async () => {
    setError('')
    setSuccess('')
    setResendLoading(true)
    try {
      await fetch('http://localhost:5000/api/users/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: tempEmail || form.email })
      })
      setSuccess('OTP resent to your email.')
    } catch (err) {
      setError('Failed to resend OTP')
    } finally {
      setResendLoading(false)
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
            <PersonAddIcon />
          </Box>
          <Typography component="h1" variant="h5">
            Sign Up
          </Typography>
        </Box>
        
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}
        
        {step === 1 && (
          <Box component="form" onSubmit={handleRegister} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Full Name"
              name="name"
              autoComplete="name"
              autoFocus
              value={form.name}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </Box>
        )}
        {step === 2 && (
          <Box component="form" onSubmit={handleVerifyOtp} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Enter OTP"
              name="otp"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                fullWidth
              >
                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
              <Button
                onClick={handleResendOtp}
                variant="outlined"
                disabled={resendLoading}
                fullWidth
              >
                {resendLoading ? <CircularProgress size={24} /> : 'Resend OTP'}
              </Button>
            </Stack>
          </Box>
        )}
        {step === 3 && (
          <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
            Registration complete! You can now log in.
          </Typography>
        )}
        
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Already have an account? Sign In
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Register