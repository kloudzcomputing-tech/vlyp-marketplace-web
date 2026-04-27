import { writable } from "svelte/store"

export const reelShopCart = writable([]);
export const reelShopCheckoutOpen = writable(false);
export const reelShopSuccessOpen = writable(false);
export const reelShopLockXScroll = writable(false);


export const addToReelShopCart = (item) => {
    reelShopCart.update(state => {
        if(state.some(i => i.id === item.id)){
            return [...state]
        }
        return [...state, {...item, quantity: 1}];
    });
};

export const removeFromReelShopCart = (item) => {
    reelShopCart.update(state => state.filter(i => i.id !== item.id));
};

export const updateReelShopCartItemQuantity = (item, quantity) => {
    reelShopCart.update(state => state.map(i => i.id === item.id ? { ...i, quantity: quantity } : i));
};

export const clearReelShopCart = () => {
    reelShopCart.set([]);
};