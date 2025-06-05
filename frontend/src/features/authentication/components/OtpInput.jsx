import { useState, useRef, useEffect } from 'react'
import { Box, TextField, Typography } from '@mui/material'

const OtpInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''))
  const inputRefs = useRef([])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (e, index) => {
    const value = e.target.value
    if (isNaN(value)) return

    const newOtp = [...otp]
    // Allow only one input
    newOtp[index] = value.substring(value.length - 1)
    setOtp(newOtp)

    // Check if all inputs are filled
    const filledOtp = newOtp.join('')
    if (filledOtp.length === length) {
      onComplete(filledOtp)
    }

    // Move to next input if current field is filled
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (e, index) => {
    // Move to previous input on backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pasteData = e.clipboardData.getData('text/plain').slice(0, length).split('')
    
    if (pasteData) {
      let newOtp = [...otp]
      pasteData.forEach((value, index) => {
        if (index < length && !isNaN(value)) {
          newOtp[index] = value
          inputRefs.current[index].value = value
        }
      })
      
      setOtp(newOtp)
      
      // Check if all inputs are filled after paste
      const filledOtp = newOtp.join('')
      if (filledOtp.length === length) {
        onComplete(filledOtp)
      }
      
      // Focus on the next empty input or the last one
      const lastFilledIndex = newOtp.findIndex(val => val === '') - 1
      const focusIndex = lastFilledIndex < 0 ? length - 1 : lastFilledIndex
      inputRefs.current[focusIndex < length - 1 ? focusIndex + 1 : focusIndex].focus()
    }
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
      {otp.map((_, index) => (
        <TextField
          key={index}
          inputRef={(ref) => (inputRefs.current[index] = ref)}
          variant="outlined"
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          sx={{
            width: '3rem',
            height: '3rem',
            '& input': { textAlign: 'center', fontSize: '1.5rem' }
          }}
          inputProps={{
            maxLength: 1,
            style: { padding: '0.5rem' }
          }}
        />
      ))}
    </Box>
  )
}

export default OtpInput