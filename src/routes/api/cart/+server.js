import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies,locals }) => {
    try {
        let cart_key = cookies.get('cart_key');
        const payload = await request.json();
        let cart_items = null;
        if(!cart_key){
            cart_key = crypto.randomUUID(); 
            cookies.set('cart_key', cart_key, {
                path: '/',
                httpOnly: true,
                secure: platform.env.enviroment === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            cart_items = [payload]
            locals.cart = {cart_items,selected_items:cart_items};
            await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify({cart_items,selected_items:cart_items}),{
                expirationTtl: 60 * 60 * 24 * 30, // 30 days
            });
        }else{
            let  cart = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
            cart = JSON.parse(cart);
            cart_items = cart.cart_items;
            cart_items.push(payload);
            locals.cart = {cart_items,selected_items:cart_items};
            await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify({...cart,cart_items}),{
                expirationTtl: 60 * 60 * 24 * 30, // 30 days
            });
        }
        return json({ status: true, message: 'Cart items added successfully' })
    }
    catch (error) {
        return json({ status: false, message: error.message })
    }
}

export const DELETE = async ({ platform, cookies, request }) => {
    try {
        let cart_key = cookies.get('cart_key');
        const { id, type } = await request.json();
        if(type === 'all'){
            await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify({ cart_items: [], selected_items: [] }));
            return json({ status: true, message: 'Cart cleared successfully' })
        }
        let cart = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
        cart = JSON.parse(cart);
        cart.cart_items = cart.cart_items.filter(item => item.id !== id);
        cart.selected_items = cart.selected_items.filter(item => item.id !== id);
        await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify(cart));
        return json({ status: true, message: 'Cart item removed successfully',data:cart })
    }
    catch (error) {
        return json({ status: false, message: error.message })
    }
}

export const PUT = async ({ platform, cookies, request }) => {
    try {
        const { id, quantity } = await request.json();
        const token = cookies.get('token');
        const users = await platform.env.VLYP_KV.get(`user_${token}`);
        const user = JSON.parse(users);
        let cart = await platform.env.VLYP_KV.get(`cart_${user?.id}`);
        cart = JSON.parse(cart);
        cart = cart.map(item => item.id === id ? { ...item, quantity: quantity } : item);
        await platform.env.VLYP_KV.put(`cart_${user?.id}`, JSON.stringify(cart));
        return json({ status: true, message: 'Cart item quantity updated successfully' })
    }
    catch (error) {
        return json({ status: false, message: error.message })
    }
}

export const GET = async ({ platform, cookies, locals }) => {
    try {
        let cart_key = cookies.get('cart_key');
        let cart = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
        cart = JSON.parse(cart);
        return json({ status: true, message: 'Cart items fetched successfully', data:cart || [] })
    }
    catch (error) {
        return json({ status: false, message: error.message, data: [] })
    }
}