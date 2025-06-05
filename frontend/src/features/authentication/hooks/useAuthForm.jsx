import { useState } from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { useAuth } from '../../../context/AuthContext'

export const useLoginForm = () => {
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await login(values)
      } catch (error) {
        console.error('Login error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  })
  
  return { formik, isSubmitting }
}

export const useRegisterForm = () => {
  const { register } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),
      confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password')], 'Passwords must match')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        const { confirmPassword, ...userData } = values
        await register(userData)
      } catch (error) {
        console.error('Registration error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  })
  
  return { formik, isSubmitting }
}

export const useOtpForm = () => {
  const { verifyOtp } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const formik = useFormik({
    initialValues: {
      otp: ''
    },
    validationSchema: Yup.object({
      otp: Yup.string()
        .required('OTP is required')
        .matches(/^\d+$/, 'OTP must contain only digits')
        .length(6, 'OTP must be 6 digits')
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true)
      try {
        await verifyOtp(values.otp)
      } catch (error) {
        console.error('OTP verification error:', error)
      } finally {
        setIsSubmitting(false)
      }
    }
  })
  
  return { formik, isSubmitting }
}