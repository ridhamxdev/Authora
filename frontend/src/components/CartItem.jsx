import { 
  Box, 
  Typography, 
  IconButton, 
  TextField, 
  Paper,
  Grid,
  Divider 
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import { useCart } from '../context/CartContext'

const CartItem = ({ item }) => {
  const { id, name, price, image, quantity } = item
  const { updateQuantity, removeFromCart } = useCart()

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value)
    if (newQuantity > 0) {
      updateQuantity(id, newQuantity)
    }
  }

  const handleIncrement = () => {
    updateQuantity(id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1)
    }
  }

  const handleRemove = () => {
    removeFromCart(id)
  }

  return (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={3}>
          <Box
            component="img"
            sx={{
              height: 80,
              width: '100%',
              objectFit: 'contain',
              borderRadius: 1
            }}
            src={image}
            alt={name}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Typography variant="subtitle1" fontWeight="medium">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ${price.toFixed(2)} each
          </Typography>
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton size="small" onClick={handleDecrement} disabled={quantity <= 1}>
              <RemoveIcon fontSize="small" />
            </IconButton>
            <TextField
              size="small"
              value={quantity}
              onChange={handleQuantityChange}
              inputProps={{ 
                min: 1, 
                style: { textAlign: 'center' },
                'aria-label': 'quantity' 
              }}
              sx={{ width: 60, mx: 1 }}
            />
            <IconButton size="small" onClick={handleIncrement}>
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </Grid>
        <Grid item xs={12} sm={2}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' } }}>
            <Typography variant="subtitle1" fontWeight="bold">
              ${(price * quantity).toFixed(2)}
            </Typography>
            <IconButton 
              color="error" 
              size="small" 
              onClick={handleRemove}
              sx={{ mt: 1 }}
            >
              <DeleteOutlineIcon fontSize="small" />
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                Remove
              </Typography>
            </IconButton>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  )
}

export default CartItem