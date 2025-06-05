import { createContext, useContext, useState, useEffect } from 'react'
import { toast } from 'react-toastify'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart)
      setCart(parsedCart)
    }
  }, [])
  
  // Update localStorage and totals whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
    
    const items = cart.reduce((total, item) => total + item.quantity, 0)
    const price = cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    
    setTotalItems(items)
    setTotalPrice(price)
  }, [cart])
  
  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(item => item.id === product.id)
      
      if (existingItemIndex !== -1) {
        // Item already exists, update quantity
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity
        }
        toast.success(`Updated ${product.name} quantity in cart`)
        return updatedCart
      } else {
        // Add new item
        toast.success(`Added ${product.name} to cart`)
        return [...prevCart, { ...product, quantity }]
      }
    })
  }
  
  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    setCart(prevCart => {
      return prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    })
  }
  
  // Remove item from cart
  const removeFromCart = (productId) => {
    setCart(prevCart => {
      const item = prevCart.find(item => item.id === productId)
      if (item) {
        toast.info(`Removed ${item.name} from cart`)
      }
      return prevCart.filter(item => item.id !== productId)
    })
  }
  
  // Clear cart
  const clearCart = () => {
    setCart([])
    toast.info('Cart cleared')
  }
  
  const value = {
    cart,
    totalItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart
  }
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}