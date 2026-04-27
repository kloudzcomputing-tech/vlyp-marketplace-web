import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies,locals }) => {
    try {
        const payload = await request.json();
        const { selected_items } = payload;
        const cart_key = cookies.get('cart_key');
        let cart = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
        cart = JSON.parse(cart);
        cart.selected_items = selected_items;
        await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify(cart));
        return json({ status: true, message: 'Cart items fetched successfully', data:selected_items })
    }
    catch (error) {
        return json({ status: false, message: error.message })
    }
}