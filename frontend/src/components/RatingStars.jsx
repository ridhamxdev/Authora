import { useState } from 'react'
import { 
  Rating, 
  Typography, 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { useAuth } from '../context/AuthContext'

const RatingStars = ({ value = 0, count = 0, productId, onRatingSubmit, readOnly = false }) => {
  const [open, setOpen] = useState(false)
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(-1)
  const [review, setReview] = useState('')
  const { isAuthenticated } = useAuth()
  
  const handleRatingChange = (event, newValue) => {
    setRating(newValue)
  }
  
  const handleReviewChange = (event) => {
    setReview(event.target.value)
  }
  
  const handleClickOpen = () => {
    if (isAuthenticated) {
      setOpen(true)
    } else {
      // Redirect to login or show login prompt
      alert('Please login to submit a review')
    }
  }
  
  const handleClose = () => {
    setOpen(false)
  }
  
  const handleSubmit = () => {
    onRatingSubmit({
      productId,
      rating,
      review
    })
    setOpen(false)
    // Reset form
    setRating(0)
    setReview('')
  }
  
  const labels = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }
  
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Rating 
          value={value} 
          precision={0.5} 
          readOnly={true}
          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
        />
        <Typography variant="body2" sx={{ ml: 1 }}>
          {value.toFixed(1)} ({count} {count === 1 ? 'review' : 'reviews'})
        </Typography>
      </Box>
      
      {!readOnly && (
        <Button 
          size="small" 
          sx={{ mt: 1 }} 
          onClick={handleClickOpen}
        >
          Write a Review
        </Button>
      )}
      
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Write a Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
            <Typography component="legend" sx={{ mr: 2 }}>Your Rating:</Typography>
            <Rating
              name="product-rating"
              value={rating}
              precision={1}
              onChange={handleRatingChange}
              onChangeActive={(event, newHover) => {
                setHover(newHover);
              }}
            />
            {rating !== null && (
              <Typography sx={{ ml: 2 }}>
                {labels[hover !== -1 ? hover : rating]}
              </Typography>
            )}
          </Box>
          <TextField
            autoFocus
            margin="dense"
            id="review"
            label="Your Review"
            type="text"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={review}
            onChange={handleReviewChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            disabled={rating === 0}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default RatingStars