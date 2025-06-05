import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, verifyPayment } from '../services/paymentService'

const steps = ['Shipping Address', 'Review Order', 'Payment']

const Checkout = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [shippingData, setShippingData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [orderId, setOrderId] = useState(null)
  
  const { cart, totalPrice, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login')
    }
    
    // Redirect if cart is empty
    if (cart.length === 0) {
      navigate('/products')
    }
    
    // Pre-fill user data if available
    if (user) {
      setShippingData(prevData => ({
        ...prevData,
        fullName: user.name || '',
        email: user.email || ''
      }))
    }
  }, [isAuthenticated, cart, navigate, user])
  
  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handlePayment()
    } else {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }
  
  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }
  
  const handleChange = (e) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    })
  }
  
  const validateShippingForm = () => {
    const requiredFields = ['fullName', 'address', 'city', 'state', 'postalCode', 'country', 'phone']
    return requiredFields.every(field => shippingData[field].trim() !== '')
  }
  
  const handlePayment = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Create order in backend
      const orderData = await createOrder(totalPrice * 100) // Convert to smallest currency unit (paise)
      setOrderId(orderData.id)
      
      // Initialize Razorpay
      const options = {
        key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'MERN E-Commerce',
        description: 'Purchase from MERN E-Commerce',
        order_id: orderData.id,
        handler: function (response) {
          handlePaymentSuccess(response)
        },
        prefill: {
          name: shippingData.fullName,
          email: user.email,
          contact: shippingData.phone
        },
        notes: {
          address: shippingData.address
        },
        theme: {
          color: '#3f51b5'
        }
      }
      
      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (err) {
      setError(err.message || 'Payment initialization failed')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePaymentSuccess = async (response) => {
    setLoading(true)
    
    try {
      // Verify payment with backend
      const verificationData = {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
        shipping: shippingData,
        items: cart,
        amount: totalPrice
      }
      
      await verifyPayment(verificationData)
      
      // Clear cart and redirect to success page
      clearCart()
      navigate('/payment-success', { 
        state: { 
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id 
        } 
      })
    } catch (err) {
      setError(err.message || 'Payment verification failed')
    } finally {
      setLoading(false)
    }
  }
  
  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="fullName"
                  label="Full Name"
                  name="fullName"
                  value={shippingData.fullName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="address"
                  label="Address"
                  name="address"
                  value={shippingData.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="city"
                  label="City"
                  name="city"
                  value={shippingData.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="state"
                  label="State/Province"
                  name="state"
                  value={shippingData.state}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="postalCode"
                  label="Postal Code"
                  name="postalCode"
                  value={shippingData.postalCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="country"
                  label="Country"
                  name="country"
                  value={shippingData.country}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phone"
                  label="Phone Number"
                  name="phone"
                  value={shippingData.phone}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Box>
        )
      case 1:
        return (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            {cart.map((item) => (
              <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box
                    component="img"
                    sx={{ width: 50, height: 50, mr: 2 }}
                    src={item.image}
                    alt={item.name}
                  />
                  <Box>
                    <Typography variant="subtitle1">{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Qty: {item.quantity}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle1">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              </Box>
            ))}
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">Total</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                ${totalPrice.toFixed(2)}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Shipping Details
              </Typography>
              <Typography gutterBottom>{shippingData.fullName}</Typography>
              <Typography gutterBottom>{shippingData.address}</Typography>
              <Typography gutterBottom>
                {shippingData.city}, {shippingData.state} {shippingData.postalCode}
              </Typography>
              <Typography gutterBottom>{shippingData.country}</Typography>
              <Typography gutterBottom>Phone: {shippingData.phone}</Typography>
            </Box>
          </Box>
        )
      case 2:
        return (
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Payment
            </Typography>
            <Typography variant="body1" gutterBottom>
              Click the button below to proceed with Razorpay payment gateway.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              You will be redirected to Razorpay's secure payment page.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <img 
                src="https://razorpay.com/assets/razorpay-glyph.svg" 
                alt="Razorpay" 
                style={{ height: 50, marginRight: 10 }} 
              />
              <img 
                src="https://razorpay.com/assets/logo.svg" 
                alt="Razorpay" 
                style={{ height: 50 }} 
              />
            </Box>
          </Box>
        )
      default:
        return 'Unknown step'
    }
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 }, mt: 3 }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        {getStepContent(activeStep)}
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !validateShippingForm()) ||
              loading
            }
          >
            {activeStep === steps.length - 1 ? 'Place Order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default Checkout