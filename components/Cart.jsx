import React, { useRef } from 'react'
import Link from 'next/link'
import { AiOutlineMinus, AiOutlinePlus, AiOutlineLeft, AiOutlineShopping } from 'react-icons/ai'
import { TiDeleteOutline } from 'react-icons/ti'
import toast from 'react-hot-toast'

import { useStateContext } from '../context/StateContext'
import { urlFor } from '../lib/client'
import getStripe from '../lib/getStripe'

const Cart = () => {
  const cartRef = useRef()
  const { totalPrice, totalQuantity, cartItems, setShowCart, qty, toggleCartItemQuantity, handleRemoveFromCart } = useStateContext()
  const handleCheckout = async () => {
    const stripe = await getStripe()
    const response = await fetch('/api/stripe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cartItems),
    })

    if (response.statusCode === 500) return
    
    const data = await response.json()
    console.log(data)

    toast.loading('Redirecting...')

    stripe.redirectToCheckout({
      sessionId: data.id
    })
  }

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <div className='cart-container'>
        <button
          type='button'
          className='cart-heading'
          onClick = {()=> setShowCart(false)}
        >
          <AiOutlineLeft />
          <span className='heading'>Your cart </span>
          <span className='cart-num-items'>{ totalQuantity } items</span>
        </button>

        {cartItems.length < 1 && (
          <div className='empty-cart'>
            <AiOutlineShopping size={150} />
            <h3>Your shopping bag is empty</h3>
            <Link href='/'>
              <button
                type='button'
                onClick={() => setShowCart(false)}
                className='btn'
              >Continue shopping</button>
            </Link>
          </div>
        )}

        <div className='product-container'>
          {cartItems.length >= 1 && cartItems.map((item, index) => (
            <div className='product' key={item._id}>
              <img src={urlFor(item?.image[0])} className='cart-product-image' />
              <div className='item-desc'>
                <div className='flex top'>
                  <h5>{item.name}</h5>
                  <h4>&#x20a6;{ item.price.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) }</h4>
                </div>
                <div className='flex bottom'>
                  <div>
                    <p className='quantity-desc'>
                      <span
                          className='minus'
                          onClick={()=> toggleCartItemQuantity(item._id, 'dec')}
                          ><AiOutlineMinus /></span>
                      <span
                          className='num'
                          >{item.quantity}</span>
                      <span
                          className='plus'
                          onClick={()=> toggleCartItemQuantity(item._id, 'inc')}
                      ><AiOutlinePlus /></span>
                    </p>
                  </div>
                  <button type='button' className='remove-item' onClick={() => handleRemoveFromCart(item._id)}>
                    <TiDeleteOutline />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length >= 1 && (
          <div className='cart-bottom'>
            <div className='total'>
              <h3>Subtotal:</h3>
              <h3>&#x20a6;{ totalPrice.toLocaleString(navigator.language, { minimumFractionDigits: 0 }) }</h3>
            </div>
            <div className='btn-container'>
              <button
                type='button'
                className='btn'
                onClick={handleCheckout}
              >Pay with Stripe</button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart