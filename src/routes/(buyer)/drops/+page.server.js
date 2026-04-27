import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ request, platform, params, cookies }) => {
    let isMobile = false;
    try {
        const customer_token = cookies.get('customer_token');
        let user = null
        if (customer_token) {
            const customer = await platform.env.VLYP_KV.get(`customer_${customer_token}`);
            user = customer ? JSON.parse(customer) : null;
        }

        const userAgent = request.headers.get("user-agent") || "";

        isMobile =
            /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);


        const reel_media_id = params.reel_media_id || "";
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/reels/${18}`);

        const { status, message, data } = await resp.json();
        console.log(data, "data");
        if (!status) {
            throw new Error(message);
        }
        const cart_key = cookies.get('cart_key');
        let cart = null;
        if (cart_key) {
            let _cart_items = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
            cart = JSON.parse(_cart_items);
        }
        return { user: user, reels: data || null, isMobile,cart };
    } catch (error) {
        return {
            user: null,
            error: error.message,
            reels: null,
            isMobile,
            cart: null,
        }
    }
}