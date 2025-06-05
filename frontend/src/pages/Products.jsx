import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Button, 
  Box, 
  CircularProgress, 
  TextField, 
  InputAdornment, 
  MenuItem, 
  Select, 
  FormControl, 
  InputLabel 
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import axios from 'axios'
import { useCart } from '../context/CartContext'

const Products = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('default')
  
  const { addToCart } = useCart()
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products')
        setProducts(response.data)
        setLoading(false)
      } catch (error) {
        setError('Failed to load products')
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [])
  
  // Filter products based on search term
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price
      case 'price-high':
        return b.price - a.price
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })
  
  // Temporary products for development
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
    },
    {
      id: 5,
      name: 'Wireless Earbuds',
      price: 89.99,
      image: 'https://via.placeholder.com/300',
      description: 'Compact wireless earbuds with great sound quality.'
    },
    {
      id: 6,
      name: 'Tablet',
      price: 399.99,
      image: 'https://via.placeholder.com/300',
      description: 'Versatile tablet for entertainment and productivity.'
    }
  ]
  
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
        <Typography color="error">{error}</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Showing temporary product data for development
        </Typography>
      </Box>
    )
  }
  
  // Use tempProducts for development if API fails
  const displayProducts = error ? tempProducts : sortedProducts
  
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Products
      </Typography>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          label="Search Products"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, minWidth: '200px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        
        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="default">Default</MenuItem>
            <MenuItem value="price-low">Price: Low to High</MenuItem>
            <MenuItem value="price-high">Price: High to Low</MenuItem>
            <MenuItem value="name-asc">Name: A to Z</MenuItem>
            <MenuItem value="name-desc">Name: Z to A</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {displayProducts.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
          No products found
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {displayProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="primary" gutterBottom>
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" component={Link} to={`/products/${product.id}`}>
                    View Details
                  </Button>
                  <Button size="small" onClick={() => addToCart(product)}>
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  )
}

export default Products