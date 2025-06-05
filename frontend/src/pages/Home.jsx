import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Container, Typography, Grid, Card, CardMedia, CardContent, CardActions, Button, Box, CircularProgress, Paper } from '@mui/material'
import axios from 'axios'
import ProductCard from '../components/ProductCard'

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // Add a refresh key to force re-renders
  const [refreshKey, setRefreshKey] = useState(0)

  const refreshProducts = () => {
    setLoading(true)
    setRefreshKey(prevKey => prevKey + 1)
  }

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products/featured')
        setFeaturedProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to load featured products:', error)
        setLoading(false)
      }
    }
    
    fetchFeaturedProducts()
  }, [refreshKey]) // Add refreshKey as a dependency

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  // Temporary featured products for development
  const tempProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 129.99,
      image: 'https://via.placeholder.com/300',
      description: 'High-quality wireless headphones with noise cancellation.'
    },
    {
      id: 2,
      name: 'Smartphone',
      price: 699.99,
      image: 'https://via.placeholder.com/300',
      description: 'Latest smartphone with advanced camera and long battery life.'
    },
    {
      id: 3,
      name: 'Laptop',
      price: 1299.99,
      image: 'https://via.placeholder.com/300',
      description: 'Powerful laptop for work and gaming.'
    },
    {
      id: 4,
      name: 'Smartwatch',
      price: 249.99,
      image: 'https://via.placeholder.com/300',
      description: 'Fitness tracker and smartwatch with heart rate monitoring.'
    }
  ]

  // Use tempProducts if no featured products from API
  const displayProducts = featuredProducts.length > 0 ? featuredProducts : tempProducts

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Hero Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        p: 4,
        borderRadius: 2,
        mb: 4,
        textAlign: 'center'
      }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to Our E-Commerce Store
        </Typography>
        <Typography variant="h6" gutterBottom>
          Shop the latest products with secure payments and fast delivery
        </Typography>
        <Button
          component={Link}
          to="/products"
          variant="contained"
          color="secondary"
          size="large"
          sx={{ mt: 2 }}
        >
          Shop Now
        </Button>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h2">
          Featured Products
        </Typography>
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={refreshProducts}
        >
          Refresh Products
        </Button>
      </Box>
      <Grid container spacing={3}>
        {displayProducts.map((product) => (
          <Grid item key={`${product.id}-${refreshKey}`} xs={12} sm={6} md={3}>
            <ProductCard product={product} key={`product-${product.id}-${refreshKey}`} />
          </Grid>
        ))}
      </Grid>

      {/* Rest of your component remains the same */}
      {/* Categories Section */}
      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6 }}>
        Shop by Category
      </Typography>
      <Grid container spacing={3}>
        {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((category) => (
          <Grid item key={category} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%' }}>
              <CardMedia
                component="img"
                height="140"
                image={`https://via.placeholder.com/300?text=${category}`}
                alt={category}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  component={Link}
                  to={`/products?category=${category.toLowerCase()}`}
                >
                  Browse {category}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Promotional Banner */}
      <Paper
        sx={{
          p: 3,
          mt: 6,
          mb: 4,
          bgcolor: 'secondary.light',
          textAlign: 'center'
        }}
      >
        <Typography variant="h5" gutterBottom>
          Special Offer!
        </Typography>
        <Typography variant="body1" paragraph>
          Use code WELCOME10 for 10% off your first order.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products"
        >
          Shop Now
        </Button>
      </Paper>
    </Container>
  )
}

export default Home