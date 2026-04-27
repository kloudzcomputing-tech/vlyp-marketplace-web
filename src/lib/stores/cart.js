import { writable } from "svelte/store"

export const cart = writable([])

export const addToCart = (item)=>{
    cart.update(state=>{
        if(state.some(i=>i.id===item.id)){
            return [...state]
        }
        item.quantity = 1;
        fetch(`/api/cart`, {
            method: "POST",
            body: JSON.stringify(item),
        })
        return [...state, item]
    })
    
}

export const removeFromCart = (item)=>{
    cart.update(state=>state.filter(i=>i.id!==item.id))
}

export const updateCartItemQuantity = (item, quantity)=>{
    cart.update(state=>state.map(i=>i.id===item.id?{...i, quantity: quantity}:i))
}

export const checkIfItemIsInCart = (itemId)=>{
    return cart.some(i=>i.id===itemId)
}

export const setCart = (items)=>{
    cart.set(items);
}

export const clearCart = ()=>{
    cart.update(state=>{
        fetch(`/api/cart`, {
            method: "DELETE",
            body: JSON.stringify({
                type:"all"
            }),
        })
        return []
    })
}