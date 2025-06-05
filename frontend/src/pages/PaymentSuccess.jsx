import { useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Grid
} from '@mui/material'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  
  // Get order details from location state
  const { orderId, paymentId } = location.state || {}
  
  useEffect(() => {
    // Redirect if no order details (direct page access)
    if (!orderId || !paymentId) {
      navigate('/')
    }
  }, [orderId, paymentId, navigate])
  
  if (!orderId || !paymentId) {
    return null // Will redirect in useEffect
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h4" gutterBottom>
            Payment Successful!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your order has been placed successfully.
          </Typography>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Order ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {orderId}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Payment ID
            </Typography>
            <Typography variant="body1" gutterBottom>
              {paymentId}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1" gutterBottom>
              {new Date().toLocaleString()}
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body1" gutterBottom>
            A confirmation email has been sent to your registered email address.
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Please keep your order ID for future reference.
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, gap: 2 }}>
          <Button 
            component={Link} 
            to="/orders" 
            variant="contained"
          >
            View Orders
          </Button>
          <Button 
            component={Link} 
            to="/products" 
            variant="outlined"
          >
            Continue Shopping
          </Button>
        </Box>
      </Paper>
    </Container>
  )
}

export default PaymentSuccess