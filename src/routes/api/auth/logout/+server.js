import { json } from "@sveltejs/kit";

export const POST = async ({ platform, cookies }) => {
    try {
        const customer_token = cookies.get('customer_token');
       
        if (!customer_token) {
            throw new Error('Unauthorized')
        }
        cookies.delete('customer_token', { path: '/' });
        await platform.env.VLYP_KV.delete(`customer_${customer_token}`);

        
        const cart_key = cookies.get('cart_key');
        if(cart_key){
            cookies.delete('cart_key', { path: '/' });
            await platform.env.VLYP_KV.delete(`cart_${cart_key}`);
        }
        

        return json({ status: true, message: 'Logout successful' })
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}