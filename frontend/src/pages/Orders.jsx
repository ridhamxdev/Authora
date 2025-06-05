import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid,
  CircularProgress,
  Alert
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const { isAuthenticated } = useAuth()
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/orders')
        setOrders(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to load orders')
        setLoading(false)
      }
    }
    
    if (isAuthenticated) {
      fetchOrders()
    }
  }, [isAuthenticated])
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return 'warning'
      case 'shipped':
        return 'info'
      case 'delivered':
        return 'success'
      case 'cancelled':
        return 'error'
      default:
        return 'default'
    }
  }
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    )
  }
  
  if (orders.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: { xs: 2, md: 3 }, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            No Orders Found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            You haven't placed any orders yet.
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained"
          >
            Start Shopping
          </Button>
        </Paper>
      </Container>
    )
  }
  
  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      
      {orders.map((order) => (
        <Accordion key={order._id} sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <Box>
                <Typography variant="subtitle1">
                  Order #{order._id.substring(0, 8)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Chip 
                  label={order.status.toUpperCase()} 
                  color={getStatusColor(order.status)} 
                  size="small" 
                />
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              {order.items.map((item) => (
                <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      component="img"
                      sx={{ width: 40, height: 40, mr: 2 }}
                      src={item.image}
                      alt={item.name}
                    />
                    <Typography variant="body1">
                      {item.name} x {item.quantity}
                    </Typography>
                  </Box>
                  <Typography variant="body1">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>
              ))}
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2">
                    {order.shipping.fullName}<br />
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.postalCode}<br />
                    {order.shipping.country}<br />
                    Phone: {order.shipping.phone}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Payment Information
                  </Typography>
                  <Typography variant="body2">
                    Payment ID: {order.paymentId}<br />
                    Method: Razorpay<br />
                    Total: ${order.amount.toFixed(2)}
                  </Typography>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                {order.status === 'processing' && (
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </Button>
                )}
                <Button 
                  variant="outlined" 
                  size="small"
                  component={Link}
                  to={`/orders/${order._id}`}
                >
                  View Details
                </Button>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Container>
  )
}

export default Orders