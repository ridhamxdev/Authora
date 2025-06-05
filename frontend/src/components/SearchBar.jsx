import { useState } from 'react'
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box,
  Divider,
  Tooltip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

const SearchBar = ({ onSearch, placeholder = 'Search products...' }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    
    // Optional: Search as you type
    // if (value.length > 2 || value.length === 0) {
    //   onSearch(value)
    // }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(searchTerm)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <Paper
      component="form"
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        borderRadius: 2,
        boxShadow: 1
      }}
      elevation={1}
      onSubmit={handleSubmit}
    >
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ 'aria-label': placeholder }}
        value={searchTerm}
        onChange={handleChange}
      />
      {searchTerm && (
        <Tooltip title="Clear search">
          <IconButton 
            sx={{ p: '10px' }} 
            aria-label="clear" 
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      )}
    </Paper>
  )
}

export default SearchBar