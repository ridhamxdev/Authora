import { useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  Divider,
  Paper
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

const FilterPanel = ({ onFilterChange, categories = [], initialFilters = {} }) => {
  const [filters, setFilters] = useState({
    categories: initialFilters.categories || [],
    priceRange: initialFilters.priceRange || [0, 1000],
    rating: initialFilters.rating || 0,
    ...initialFilters
  })

  const handleCategoryChange = (category) => {
    const updatedCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category]
    
    const updatedFilters = {
      ...filters,
      categories: updatedCategories
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handlePriceChange = (event, newValue) => {
    const updatedFilters = {
      ...filters,
      priceRange: newValue
    }
    
    setFilters(updatedFilters)
  }

  const handlePriceChangeCommitted = (event, newValue) => {
    onFilterChange(filters)
  }

  const handleRatingChange = (rating) => {
    const updatedFilters = {
      ...filters,
      rating: filters.rating === rating ? 0 : rating
    }
    
    setFilters(updatedFilters)
    onFilterChange(updatedFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters = {
      categories: [],
      priceRange: [0, 1000],
      rating: 0
    }
    
    setFilters(clearedFilters)
    onFilterChange(clearedFilters)
  }

  return (
    <Paper sx={{ p: 2, borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Filters</Typography>
        <Button 
          size="small" 
          onClick={handleClearFilters}
          disabled={filters.categories.length === 0 && 
                  filters.priceRange[0] === 0 && 
                  filters.priceRange[1] === 1000 && 
                  filters.rating === 0}
        >
          Clear All
        </Button>
      </Box>
      
      <Divider sx={{ mb: 2 }} />
      
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map((category) => (
              <FormControlLabel
                key={category}
                control={
                  <Checkbox 
                    checked={filters.categories.includes(category)} 
                    onChange={() => handleCategoryChange(category)} 
                  />
                }
                label={category}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 1 }}>
            <Slider
              value={filters.priceRange}
              onChange={handlePriceChange}
              onChangeCommitted={handlePriceChangeCommitted}
              valueLabelDisplay="auto"
              min={0}
              max={1000}
              step={10}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">${filters.priceRange[0]}</Typography>
              <Typography variant="body2">${filters.priceRange[1]}</Typography>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
      
      <Accordion defaultExpanded elevation={0} disableGutters>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Rating</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[4, 3, 2, 1].map((rating) => (
              <Button 
                key={rating}
                variant={filters.rating === rating ? "contained" : "outlined"}
                size="small"
                onClick={() => handleRatingChange(rating)}
                sx={{ justifyContent: 'flex-start' }}
              >
                {rating}★ & Above
              </Button>
            ))}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  )
}

export default FilterPanel