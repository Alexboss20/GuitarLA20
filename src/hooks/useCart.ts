import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import type {CartItem, Guitar} from '../types/types'


function useCart() {
    const initialCart =() : CartItem[]  => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }
      const [data] = useState(db);
      const [cart, setCard] = useState(initialCart);
      const MAX_ITEMS = 5;
      const MIN_ITEMS = 1;
      
      useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
      },[cart])
    
    function addToCart(item : Guitar){
    
      const itemExist = cart.findIndex(guitar => guitar.id === item.id)
      if(itemExist >= 0){
        if(cart[itemExist].quantity >= MAX_ITEMS) return
        const updatedCart = [...cart]
        updatedCart[itemExist].quantity++
        setCard(updatedCart)
      } else {
        const newItem : CartItem = {...item, quantity : 1}
        setCard([...cart, newItem])
      }
    }
    
    function removeFromCart(id : Guitar['id']){
      setCard(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }
    function increaseQuantity(id : Guitar['id']) {
      const updateCart = cart.map(item => {
        if(item.id === id && item.quantity < MAX_ITEMS){
          return {
            ...item,
            quantity: item.quantity + 1
          }
        }
        return item
      })
      setCard(updateCart)
    }
    function decreaseQuantity(id : Guitar['id']) {
      const updateCart = cart.map(item => {
        if(item.id === id && item.quantity > MIN_ITEMS){
          return {
            ...item,
            quantity: item.quantity - 1
          }
        }
        return item
      })
      setCard(updateCart)
    }
    
    function clearCart() {
      setCard([])
    }

    const isEmpty =useMemo(() => cart.length === 0,[cart]);
    const cartTotal = useMemo(() => cart.reduce((total,item) => total + (item.quantity * item.price), 0), [cart]);

    return{
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal

    }
}

export default useCart