import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Container, 
  Typography, 
  Grid, 
  Button, 
  Box, 
  CircularProgress, 
  Paper, 
  Divider, 
  Rating, 
  TextField, 
  Snackbar, 
  Alert, 
  Breadcrumbs, 
  Link as MuiLink 
} from '@mui/material'
import { Link } from 'react-router-dom'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import axios from 'axios'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { formatPrice } from '../utils/priceFormatter'

const ProductDetail = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [alertOpen, setAlertOpen] = useState(false)
  
  const { addToCart } = useCart()
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to load product details')
        setLoading(false)
      }
    }
    
    fetchProduct()
  }, [id])
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }
  
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    addToCart(product, quantity)
    setAlertOpen(true)
  }
  
  const handleAlertClose = () => {
    setAlertOpen(false)
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
  
  // Fallback for development if API is not available
  const tempProduct = {
    id: id,
    name: 'Sample Product',
    price: 99.99,
    description: 'This is a sample product description. It includes details about the product features, specifications, and benefits.',
    image: 'https://via.placeholder.com/600',
    category: 'Electronics',
    rating: 4.5,
    reviews: [
      { id: 1, user: 'John Doe', rating: 5, comment: 'Great product, highly recommended!', date: '2023-01-15' },
      { id: 2, user: 'Jane Smith', rating: 4, comment: 'Good quality but a bit expensive.', date: '2023-02-20' }
    ],
    stock: 15
  }
  
  // Use API product or fallback to temp product
  const displayProduct = product || tempProduct
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Breadcrumbs navigation */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <MuiLink component={Link} to="/" underline="hover" color="inherit">
          Home
        </MuiLink>
        <MuiLink component={Link} to="/products" underline="hover" color="inherit">
          Products
        </MuiLink>
        <MuiLink component={Link} to={`/products?category=${displayProduct.category}`} underline="hover" color="inherit">
          {displayProduct.category}
        </MuiLink>
        <Typography color="text.primary">{displayProduct.name}</Typography>
      </Breadcrumbs>
      
      <Grid container spacing={4}>
        {/* Product Image */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
            <Box
              component="img"
              sx={{
                width: '100%',
                borderRadius: 1
              }}
              src={displayProduct.image}
              alt={displayProduct.name}
            />
          </Paper>
        </Grid>
        
        {/* Product Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1" gutterBottom>
            {displayProduct.name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Rating value={displayProduct.rating} precision={0.5} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>
              ({displayProduct.rating} stars)
            </Typography>
          </Box>
          
          <Typography variant="h5" color="primary" gutterBottom>
            {formatPrice(displayProduct.price)}
          </Typography>
          
          <Typography variant="body1" paragraph sx={{ mt: 2 }}>
            {displayProduct.description}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, mb: 3 }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              Quantity:
            </Typography>
            <TextField
              type="number"
              InputProps={{ inputProps: { min: 1, max: displayProduct.stock } }}
              value={quantity}
              onChange={handleQuantityChange}
              size="small"
              sx={{ width: 80 }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
              {displayProduct.stock} available
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            sx={{ mb: 2 }}
          >
            Add to Cart
          </Button>
          
          <Divider sx={{ my: 3 }} />
          
          {/* Additional Product Information */}
          <Typography variant="subtitle1" gutterBottom>
            Category: {displayProduct.category}
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            SKU: PROD-{displayProduct.id}
          </Typography>
        </Grid>
      </Grid>
      
      {/* Product Reviews Section */}
      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        Customer Reviews
      </Typography>
      
      {displayProduct.reviews && displayProduct.reviews.length > 0 ? (
        displayProduct.reviews.map((review) => (
          <Paper key={review.id} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1">{review.user}</Typography>
              <Typography variant="body2" color="text.secondary">
                {new Date(review.date).toLocaleDateString()}
              </Typography>
            </Box>
            <Rating value={review.rating} size="small" readOnly />
            <Typography variant="body1" sx={{ mt: 1 }}>
              {review.comment}
            </Typography>
          </Paper>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No reviews yet for this product.
        </Typography>
      )}
      
      {/* Related Products Section */}
      <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
        You May Also Like
      </Typography>
      
      {/* Alert for adding to cart */}
      <Snackbar open={alertOpen} autoHideDuration={3000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity="success" sx={{ width: '100%' }}>
          {displayProduct.name} added to cart!
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ProductDetail