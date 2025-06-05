import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { Link } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Badge, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Container, 
  Box, 
  Divider 
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const MainLayout = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const { totalItems } = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)
  
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return
    }
    setDrawerOpen(open)
  }
  
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
            E-Shop
          </Typography>
          
          <Button color="inherit" component={Link} to="/products">
            Products
          </Button>
          
          {isAuthenticated ? (
            <>
              <IconButton color="inherit" component={Link} to="/profile">
                <AccountCircleIcon />
              </IconButton>
              <IconButton color="inherit" component={Link} to="/cart">
                <Badge badgeContent={totalItems} color="secondary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              <Button color="inherit" onClick={logout}>Logout</Button>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to="/products">
              <ListItemText primary="Products" />
            </ListItem>
            {isAuthenticated && (
              <>
                <ListItem button component={Link} to="/cart">
                  <ListItemText primary="Cart" />
                </ListItem>
                <ListItem button component={Link} to="/orders">
                  <ListItemText primary="My Orders" />
                </ListItem>
                <ListItem button component={Link} to="/profile">
                  <ListItemText primary="Profile" />
                </ListItem>
              </>
            )}
          </List>
          <Divider />
          <List>
            {isAuthenticated ? (
              <ListItem button onClick={logout}>
                <ListItemText primary="Logout" />
              </ListItem>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      
      <Container sx={{ mt: 4, mb: 4 }}>
        <Outlet />
      </Container>
      
      <Box component="footer" sx={{ bgcolor: 'background.paper', py: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" gutterBottom>
            E-Shop
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
            MERN E-commerce with 2FA and Razorpay Integration
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} E-Shop. All rights reserved.
          </Typography>
        </Container>
      </Box>
      
      <ToastContainer position="bottom-right" />
    </>
  )
}

export default MainLayout