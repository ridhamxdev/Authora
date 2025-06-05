import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// Layouts
import MainLayout from '../layouts/MainLayout'

// Pages
import Home from '../pages/Home'
import Login from '../pages/Login'
import Register from '../pages/Register'
import VerifyOtp from '../pages/VerifyOtp'
import Products from '../pages/Products'
import ProductDetail from '../pages/ProductDetail'
import Cart from '../pages/Cart'
import Checkout from '../pages/Checkout'
import PaymentSuccess from '../pages/PaymentSuccess'
import Profile from '../pages/Profile'
import Orders from '../pages/Orders'
import NotFound from '../pages/NotFound'

// Route Components
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

export const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()
  
  if (!isAuthenticated || !user?.isAdmin) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {/* Public Routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="verify-otp" element={<VerifyOtp />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        
        {/* Protected Routes */}
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="payment-success" element={
          <ProtectedRoute>
            <PaymentSuccess />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        <Route path="orders/:id" element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        } />
        
        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes