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
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const Login = () => {
  const { login, loginWithOtp, tempEmail } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [resendLoading, setResendLoading] = useState(false)
  const [forgotStep, setForgotStep] = useState(0)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleLogin = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    try {
      const res = await login(form)
      if (res.requireOtp) {
        setStep(2)
        setSuccess('OTP sent to your email. Please verify.')
      } else {
        setSuccess('Login successful!')
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleLoginOtp = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await loginWithOtp(tempEmail || form.email, otp)
      setSuccess('Login successful!')
      navigate('/')
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

  const handleForgotPassword = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setForgotLoading(true)
    try {
      await fetch('http://localhost:5000/api/users/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail })
      })
      setSuccess('OTP sent to your email for password reset.')
      setForgotStep(2)
    } catch (err) {
      setError('Failed to send OTP for password reset')
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async e => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setForgotLoading(true)
    try {
      await fetch('http://localhost:5000/api/users/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, otp: forgotOtp, newPassword })
      })
      setSuccess('Password reset successful! You can now log in.')
      setForgotStep(0)
    } catch (err) {
      setError('Failed to reset password')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', borderRadius: '50%', p: 1, mb: 1 }}>
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5">Sign In</Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2, width: '100%' }}>{success}</Alert>}
        {step === 1 && forgotStep === 0 && (
          <Box component="form" onSubmit={handleLogin} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="email" label="Email Address" name="email" autoComplete="email" autoFocus value={form.email} onChange={handleChange} />
            <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password" value={form.password} onChange={handleChange} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
            <Button variant="text" fullWidth sx={{ mb: 2 }} onClick={() => setForgotStep(1)}>
              Forgot Password?
            </Button>
          </Box>
        )}
        {step === 1 && forgotStep === 1 && (
          <Box component="form" onSubmit={handleForgotPassword} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="forgotEmail" label="Email Address" name="forgotEmail" autoComplete="email" autoFocus value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={forgotLoading}>
              {forgotLoading ? <CircularProgress size={24} /> : 'Send OTP'}
            </Button>
            <Button variant="text" fullWidth sx={{ mb: 2 }} onClick={() => setForgotStep(0)}>
              Back to Login
            </Button>
          </Box>
        )}
        {step === 1 && forgotStep === 2 && (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="forgotOtp" label="Enter OTP" name="forgotOtp" value={forgotOtp} onChange={e => setForgotOtp(e.target.value)} />
            <TextField margin="normal" required fullWidth id="newPassword" label="New Password" name="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={forgotLoading}>
              {forgotLoading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
            <Button variant="text" fullWidth sx={{ mb: 2 }} onClick={() => setForgotStep(0)}>
              Back to Login
            </Button>
          </Box>
        )}
        {step === 2 && (
          <Box component="form" onSubmit={handleLoginOtp} sx={{ mt: 1 }}>
            <TextField margin="normal" required fullWidth id="otp" label="Enter OTP" name="otp" value={otp} onChange={e => setOtp(e.target.value)} />
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              <Button type="submit" variant="contained" disabled={loading} fullWidth>
                {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
              </Button>
              <Button onClick={handleResendOtp} variant="outlined" disabled={resendLoading} fullWidth>
                {resendLoading ? <CircularProgress size={24} /> : 'Resend OTP'}
              </Button>
            </Stack>
          </Box>
        )}
        <Grid container justifyContent="flex-end">
          <Grid item>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" color="primary">
                Don't have an account? Sign Up
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

export default Login