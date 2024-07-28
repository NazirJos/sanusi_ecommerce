import React from 'react'
import { AiFillInstagram, AiFillTwitterCircle, AiFillFacebook } from 'react-icons/ai'

const Footer = () => {
  return (
    <div className='footer-container'>
      <p>2024 Sanusi ShopSpot All Rights Reserved.</p>
      <p className='icons'>
        <AiFillFacebook />
        <AiFillInstagram />
        <AiFillTwitterCircle />
      </p>
    </div>
  )
}

export default Footer