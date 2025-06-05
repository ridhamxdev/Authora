// Form validation utility functions

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - Whether the email is valid
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validates a password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {object} - Validation result and message
 */
export const validatePassword = (password) => {
  if (!password || password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' }
  }
  
  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  
  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  
  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  
  // Check for at least one special character
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' }
  }
  
  return { isValid: true, message: 'Password is valid' }
}

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  // Basic phone validation - can be adjusted for specific country formats
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}

/**
 * Validates a credit card number using Luhn algorithm
 * @param {string} cardNumber - The card number to validate
 * @returns {boolean} - Whether the card number is valid
 */
export const isValidCreditCard = (cardNumber) => {
  // Remove spaces and dashes
  const sanitized = cardNumber.replace(/[\s-]/g, '')
  
  // Check if contains only digits
  if (!/^\d+$/.test(sanitized)) return false
  
  // Luhn algorithm
  let sum = 0
  let shouldDouble = false
  
  // Loop through values starting from the rightmost digit
  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i))
    
    if (shouldDouble) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    shouldDouble = !shouldDouble
  }
  
  return (sum % 10) === 0
}

/**
 * Validates a form field based on its type
 * @param {string} type - The field type
 * @param {string} value - The field value
 * @returns {object} - Validation result and message
 */
export const validateField = (type, value) => {
  switch (type) {
    case 'email':
      return {
        isValid: isValidEmail(value),
        message: isValidEmail(value) ? '' : 'Please enter a valid email address'
      }
    case 'password':
      return validatePassword(value)
    case 'phone':
      return {
        isValid: isValidPhone(value),
        message: isValidPhone(value) ? '' : 'Please enter a valid phone number'
      }
    case 'creditCard':
      return {
        isValid: isValidCreditCard(value),
        message: isValidCreditCard(value) ? '' : 'Please enter a valid credit card number'
      }
    case 'required':
      return {
        isValid: !!value.trim(),
        message: value.trim() ? '' : 'This field is required'
      }
    default:
      return { isValid: true, message: '' }
  }
}