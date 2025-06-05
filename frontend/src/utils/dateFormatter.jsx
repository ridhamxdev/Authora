/**
 * Formats a date string or Date object to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format to use (default: 'full')
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, format = 'full') => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  const options = {
    full: { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    },
    medium: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    short: { 
      month: 'numeric', 
      day: 'numeric', 
      year: '2-digit' 
    },
    time: { 
      hour: '2-digit', 
      minute: '2-digit' 
    }
  }
  
  return dateObj.toLocaleDateString('en-US', options[format] || options.full)
}

/**
 * Returns a relative time string (e.g., "2 hours ago")
 * @param {string|Date} date - The date to format
 * @returns {string} - The relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return ''
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  // Check if date is valid
  if (isNaN(dateObj.getTime())) return 'Invalid date'
  
  const now = new Date()
  const diffInSeconds = Math.floor((now - dateObj) / 1000)
  
  // Less than a minute
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  // Less than an hour
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`
  }
  
  // Less than a day
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  }
  
  // Less than a week
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'day' : 'days'} ago`
  }
  
  // Less than a month
  if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  
  // Less than a year
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  
  // More than a year
  const years = Math.floor(diffInSeconds / 31536000)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

/**
 * Formats a date range
 * @param {string|Date} startDate - The start date
 * @param {string|Date} endDate - The end date
 * @param {string} format - The format to use (default: 'medium')
 * @returns {string} - The formatted date range
 */
export const formatDateRange = (startDate, endDate, format = 'medium') => {
  if (!startDate || !endDate) return ''
  
  return `${formatDate(startDate, format)} - ${formatDate(endDate, format)}`
}