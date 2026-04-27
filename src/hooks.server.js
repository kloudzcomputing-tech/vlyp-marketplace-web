 import { sequence } from "@sveltejs/kit/hooks";
 
 async function first({ event, resolve }) {
   
    const cookies = event.cookies;
    const customer_token = cookies.get('customer_token');
    const cart_key = cookies.get('cart_key');
    let customer = null;

    let cart = null
    if(cart_key){
        let _cart_items = await event.platform.env.VLYP_KV.get(`cart_${cart_key}`);
        cart = JSON.parse(_cart_items);
    }
    if(customer_token){
        customer = await event.platform.env.VLYP_KV.get(`customer_${customer_token}`);
        if(!customer){
            cookies.delete('customer_token',{ path: '/' });
            event.locals.customer = null;
        }else{
            customer = JSON.parse(customer);
        }
    }
     

    
    event.locals.customer = customer
    event.locals.cart = cart;
   return resolve(event);
}

export const handle = sequence(first);