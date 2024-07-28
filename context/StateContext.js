import React, { useState, createContext, useContext, useEffect } from 'react'
import { toast } from 'react-hot-toast'

const Context = createContext()

export const StateContext = ({ children }) => {
    const [showCart, setShowCart] = useState(false)
    const [cartItems, setCartItems] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const [totalQuantity, setTotalQuantity] = useState(0)
    const [qty, setQty] = useState(1)

    let foundProduct
    let index

    const incQty = () => setQty(prev => prev + 1)
    const decQty = () => setQty(prev => (prev - 1) < 1 ? 1 : prev - 1)

    const toggleCartItemQuantity = (id, value) => {
        foundProduct = cartItems.find(item => item._id === id)
        index = cartItems.findIndex(item => item._id === id)
        const newCartItems = cartItems.filter(item => item._id !== id)

        if (value === 'inc') {
            setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity + 1 }])
            setTotalPrice(prevTotalPrice => prevTotalPrice + foundProduct.price)
            setTotalQuantity(prevTotalQuantity => prevTotalQuantity + 1)
        } else if (value === 'dec') {
            if (foundProduct.quantity > 1) {
                setCartItems([ ...newCartItems, { ...foundProduct, quantity: foundProduct.quantity - 1 }])
                setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price)
                setTotalQuantity(prevTotalQuantity => prevTotalQuantity - 1)
            }
        }
    }
    
    const handleRemoveFromCart = (id) => {
        foundProduct = cartItems.find(item => item._id === id)
        const newCartItems = cartItems.filter(item => item._id !== id)
        setCartItems(newCartItems)
        setTotalPrice(prevTotalPrice => prevTotalPrice - foundProduct.price * foundProduct.quantity)
        setTotalQuantity(prevTotalQuantity => prevTotalQuantity - foundProduct.quantity)
    }

    const handleAddToCart = (product, qty) => {
        setTotalPrice(prevTotalPrice => prevTotalPrice + product.price * qty)
        setTotalQuantity(prevQty => prevQty + qty)
        
        const itemInCart = cartItems.find(item => item._id === product._id)
        
        if (itemInCart) {

            const updateCartItems = cartItems.map(cartProduct => {
                if (cartProduct._id == product._id) return {
                    ...cartProduct,
                    quantity: cartProduct.quantity + qty
                }
            })

            setCartItems(updateCartItems)
        }else {
            product.quantity = qty
            setCartItems([...cartItems, { ...product }])
        }
        toast.success(`${qty} ${product.name} added to the cart`)
    }

    return (
        <Context.Provider
            value={{
                showCart,
                setShowCart,
                cartItems,
                totalPrice,
                totalQuantity,
                qty,
                incQty,
                decQty,
                handleAddToCart,
                handleRemoveFromCart,
                toggleCartItemQuantity,
                setCartItems,
                setTotalPrice,
                setTotalQuantity,
            }}
        >
            {children}
        </Context.Provider>
    )
}

export const useStateContext = () => useContext(Context)