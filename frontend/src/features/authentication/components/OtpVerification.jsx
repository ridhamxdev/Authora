import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material'
import { useAuth } from '../../../context/AuthContext'

const OtpSchema = Yup.object().shape({
  otp: Yup.string()
    .required('OTP is required')
    .matches(/^[0-9]{6}$/, 'OTP must be 6 digits')
})

const OtpVerification = () => {
  const [loading, setLoading] = useState(false)
  const { verifyOtp, tempEmail } = useAuth()
  const navigate = useNavigate()
  
  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    if (!tempEmail) {
      navigate('/login')
      return
    }
    
    setLoading(true)
    try {
      await verifyOtp(tempEmail, values.otp)
      navigate('/')
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setSubmitting(false)
      setLoading(false)
    }
  }
  
  if (!tempEmail) {
    return (
      <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
        <Typography variant="h5" component="h1" gutterBottom>
          Session Expired
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your verification session has expired. Please login again.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/login')}
        >
          Go to Login
        </Button>
      </Box>
    )
  }
  
  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Verify OTP
      </Typography>
      
      <Typography variant="body1" gutterBottom>
        Please enter the 6-digit code sent to {tempEmail}
      </Typography>
      
      <Formik
        initialValues={{ otp: '' }}
        validationSchema={OtpSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form>
            <Box mb={3}>
              <Field
                as={TextField}
                fullWidth
                name="otp"
                label="OTP Code"
                error={touched.otp && Boolean(errors.otp)}
                helperText={touched.otp && errors.otp}
              />
            </Box>
            
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isSubmitting || loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Verify'}
            </Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default OtpVerification