import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ params,request,cookies,platform,locals }) => {
    const customer = locals.customer;
    const url = new URL(request.url);
    const oid = url.searchParams.get('oid');
    const mode = url.searchParams.get('mode')

    let user_id = customer?.id;
    const cart_key = cookies.get('cart_key');
    let cart = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
    cart = JSON.parse(cart);
    let selected_items = cart.selected_items;
    let coupons = selected_items.map((item) => item.coupons);
 
    await connect_service(platform, `${platform.env.BASE_URL}/coupons/apply-coupon`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({coupons,user_id,order_id:Number(oid)}),
    });

    await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify({ cart_items: [], selected_items: [] }));
    return { cart_items: [],  oid, payment_method: mode};
}