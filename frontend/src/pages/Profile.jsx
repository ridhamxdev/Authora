import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  TextField,
  Button,
  Avatar,
  Divider,
  Tab,
  Tabs,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import LockIcon from '@mui/icons-material/Lock'
import HistoryIcon from '@mui/icons-material/History'
import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user, updateProfile, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  const [activeTab, setActiveTab] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  useEffect(() => {
    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    
    // Initialize form data with user info
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || ''
      })
    }
  }, [user, isAuthenticated, navigate])
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setIsEditing(false)
    setSuccess(false)
    setError(null)
  }
  
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData({
      ...passwordData,
      [name]: value
    })
  }
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing)
    setSuccess(false)
    setError(null)
  }
  
  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // This would call your API to update the profile
      // await updateProfile(formData)
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setIsEditing(false)
    } catch (err) {
      setError('Failed to update profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  const handlePasswordUpdate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match')
      setLoading(false)
      return
    }
    
    try {
      // This would call your API to update the password
      // await updatePassword(passwordData)
      
      // Simulating API call for now
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSuccess(true)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (err) {
      setError('Failed to update password. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Sidebar */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main'
              }}
              alt={user.name}
              src={user.avatar}
            >
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {user.name}
            </Typography>
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            
            <Typography variant="body2" color="text.secondary">
              Member since: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              orientation="vertical"
              variant="fullWidth"
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<EditIcon />} label="Profile" />
              <Tab icon={<LockIcon />} label="Security" />
              <Tab icon={<HistoryIcon />} label="Orders" />
            </Tabs>
          </Paper>
        </Grid>
        
        {/* Profile Content */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {/* Profile Tab */}
            {activeTab === 0 && (
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h5">Profile Information</Typography>
                  <Button
                    startIcon={<EditIcon />}
                    onClick={handleEditToggle}
                    variant={isEditing ? "outlined" : "contained"}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </Button>
                </Box>
                
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Profile updated successfully!
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handleProfileUpdate}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={true} // Email should not be editable
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                      />
                    </Grid>
                    
                    {isEditing && (
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={loading}
                          sx={{ mt: 2 }}
                        >
                          {loading ? <CircularProgress size={24} /> : 'Save Changes'}
                        </Button>
                      </Grid>
                    )}
                  </Grid>
                </form>
              </Box>
            )}
            
            {/* Security Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Change Password
                </Typography>
                
                {success && (
                  <Alert severity="success" sx={{ mb: 3 }}>
                    Password updated successfully!
                  </Alert>
                )}
                
                {error && (
                  <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                  </Alert>
                )}
                
                <form onSubmit={handlePasswordUpdate}>
                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Current Password"
                        name="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="New Password"
                        name="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        required
                        helperText="Password must be at least 8 characters long"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Confirm New Password"
                        name="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Update Password'}
                      </Button>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            )}
            
            {/* Orders Tab */}
            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Order History
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/orders')}
                >
                  View All Orders
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Profile