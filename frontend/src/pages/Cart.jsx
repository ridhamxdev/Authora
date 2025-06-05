import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Button,
  Divider,
  Paper,
  Grid,
  IconButton,
  Alert
} from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCart } from '../context/CartContext'
import CartItem from '../components/CartItem'
import { formatPrice } from '../utils/priceFormatter'

const Cart = () => {
  const { cart, totalItems, totalPrice, clearCart } = useCart()
  const navigate = useNavigate()
  
  // If cart is empty, show empty cart message
  if (cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Looks like you haven't added any items to your cart yet.
          </Typography>
          <Button 
            component={Link} 
            to="/products" 
            variant="contained" 
            color="primary"
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    )
  }
  
  // Handle checkout button click
  const handleCheckout = () => {
    navigate('/checkout')
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart ({totalItems} {totalItems === 1 ? 'item' : 'items'})
      </Typography>
      
      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                startIcon={<DeleteOutlineIcon />} 
                color="error" 
                onClick={clearCart}
              >
                Clear Cart
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
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: { xs: 2, md: 3 } }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">{formatPrice(totalPrice)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">{totalPrice > 100 ? 'Free' : formatPrice(10)}</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">
                {formatPrice(totalPrice > 100 ? totalPrice : totalPrice + 10)}
              </Typography>
            </Box>
            
            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              fullWidth
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
            
            {totalPrice < 100 && (
              <Alert severity="info" sx={{ mt: 2 }}>
                Add {formatPrice(100 - totalPrice)} more to qualify for free shipping!
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart