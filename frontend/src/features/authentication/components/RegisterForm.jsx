import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'

const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
})

const RegisterForm = () => {
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setLoading(true)
    try {
      await register({
        name: values.name,
        email: values.email,
        password: values.password
      })
      
      navigate('/verify-otp')
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
        Register
      </Typography>
      
      <Formik
        initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
        validationSchema={RegisterSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <Field
                as={TextField}
                fullWidth
                name="name"
                label="Name"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
            </Box>
            
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
            
            <Box mb={2}>
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
            
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
            
            <Box mt={2}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Button
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ p: 0, minWidth: 'auto' }}
                >
                  Login
                </Button>
              </Typography>
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default RegisterForm