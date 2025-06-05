import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required')
})

const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true)
    try {
      const result = await login(values)
      
      if (result.requireOtp) {
        navigate('/verify-otp')
      } else {
        navigate('/')
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      
      <Formik
        initialValues={{ email: '', password: '' }}
        validationSchema={LoginSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="email"
                label="Email"
                type="email"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="password"
                label="Password"
                type="password"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            
            <Box mt={2}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Button
                  color="primary"
                  onClick={() => navigate('/register')}
                  sx={{ p: 0, minWidth: 'auto' }}
                >
                  Register
                </Button>
              </Typography>
            </Box>
            
            <Box mt={1}>
              <Typography variant="body2">
                <Button
                  color="primary"
                  onClick={() => navigate('/forgot-password')}
                  sx={{ p: 0, minWidth: 'auto' }}
                >
                  Forgot Password?
                </Button>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default LoginForm