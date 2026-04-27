import { redirect } from "@sveltejs/kit";

export const load = async ({ request, platform, cookies, locals }) => {

    const customer = locals?.customer || null;

    const cart_key = cookies.get('cart_key');
    let cart = null;
    if (cart_key) {
        let _cart_items = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
        cart = JSON.parse(_cart_items);
    }
    const url = new URL(request.url);
    const ref_id = url.searchParams.get('ri');

    if (ref_id) {
        cookies.set('referral_code', ref_id, {
            path: '/',
            httpOnly: true,
            secure: platform.env.enviroment === 'production',
            maxAge: 60 * 60 * 24, // 24 hr
        });
        return redirect(302, `/`);
    }
    return {
        cart: cart || null,
        customer: customer,
    }
}