import { connect_service } from "$lib/helpers/helper.js";
import { redirect } from "@sveltejs/kit";


export const load = async ({ platform,request, cookies, locals }) => {
    let addresses = [];
    const url = new URL(request.url);
    const error_message = url.searchParams.get('error_message');
    const payment_failed = url.searchParams.get('payment_failed');
    const customer = locals.customer;
    let cart = locals.cart;
    let items = cart?.selected_items || [];
    let coupons = [];
    if (!customer) {
        return redirect(302, '/');
    }

    const customer_id = customer?.id;
    const response = await connect_service(platform, `${platform.env.BASE_URL}/${customer_id}/address`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const { status, message, data } = await response.json();
    if (status) {
        addresses = data.addresses;
    }
   
    return {user_id:customer_id, addresses: addresses, items, payment_failed: payment_failed == 1 ? true : false, error_message }
}