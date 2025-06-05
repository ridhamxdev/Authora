import { useState } from 'react'
import { Link } from 'react-router-dom'
import { 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Rating, 
  Box,
  IconButton,
  Skeleton
} from '@mui/material'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { useCart } from '../context/CartContext'

const ProductCard = ({ product, showAddToCart = true }) => {
  const { id, name, price, image, description, rating = 0 } = product
  const [isLoading, setIsLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)
  const { addToCart } = useCart()

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
  }

  const toggleFavorite = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFavorite(!isFavorite)
    // Here you would typically call a function to add/remove from wishlist
  }

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.03)',
          boxShadow: 3
        }
      }}
      component={Link}
      to={`/products/${id}`}
      style={{ textDecoration: 'none' }}
    >
      <Box sx={{ position: 'relative' }}>
        {isLoading && (
          <Skeleton 
            variant="rectangular" 
            height={200} 
            animation="wave" 
          />
        )}
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={name}
          onLoad={handleImageLoad}
          sx={{ display: isLoading ? 'none' : 'block' }}
        />
        <IconButton 
          sx={{ 
            position: 'absolute', 
            top: 8, 
            right: 8, 
            bgcolor: 'rgba(255,255,255,0.8)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' }
          }}
          onClick={toggleFavorite}
          size="small"
        >
          {isFavorite ? 
            <FavoriteIcon color="error" /> : 
            <FavoriteBorderIcon />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap>
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          mb: 1
        }}>
          {description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({rating.toFixed(1)})
          </Typography>
        </Box>
        <Typography variant="h6" color="primary">
          ${price.toFixed(2)}
        </Typography>
      </CardContent>
      {showAddToCart && (
        <CardActions>
          <Button 
            size="small" 
            variant="contained" 
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
          >
            Add to Cart
          </Button>
        </CardActions>
      )}
    </Card>
  )
}

export default ProductCard