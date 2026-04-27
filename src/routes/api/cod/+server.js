import { connect_service } from "$lib/helpers/helper.js";
import { computeResponseHash } from "$lib/server/payu";
import { json, redirect } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
    const body = await request.json();

    const token = cookies.get('token');
    const users = await platform.env.VLYP_KV.get(`user_${token}`);
    const user = JSON.parse(users);
    if (!user) {
        return json({ status: false, message: 'User not found' })
    }

    const cart_items = await platform.env.VLYP_KV.get(`cart_${user?.id}`);
    const shipping_address = body.selectedAddress;
    const { address, city, state, country, pincode, receiver_name, receiver_phone } = shipping_address;

    //cart items 
    //delivery address -> name,phone,email,address,city,state,country,pincode
    //bill -> item_total,discount,delivery_fee,tax,total
    //coupon_code -> if any
    //delivery_type
    //is_code ->1
    const payload = {
        customer_id: user.id,
        receiver_name: receiver_name,
        receiver_phone: receiver_phone,
        bill: {
            item_total: body.item_total,
            discount: body.discount,
            delivery_fee: body.delivery_fee,
            tax: body.tax,
            total: body.grand_total,
        },
        shipping_address: {
            receiver_name: receiver_name,
            receiver_phone: receiver_phone,
            address: address,
            city: city,
            state: state,
            country: country,
            pincode: pincode,
        },
        cart_items: JSON.parse(cart_items),
        is_code: true,
        delivery_type:body.delivery_type

    }

    const response = await connect_service(platform, `${platform.env.BASE_URL}/customer/order/create`, {
        method: 'POST',
        headers: {
            // 'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (data.success) {
        await platform.env.VLYP_KV.delete(params.udf1);
    }

    const url = new URL(request.url); // or c.req.url if you're in Hono
    const origin = `${url.protocol}//${url.host}`;
    const successUrl = new URL("/payment-success", origin);

    successUrl.searchParams.set('txnid', params.txnid ?? '');
    successUrl.searchParams.set('status', params.status ?? '');
    return new Response(null, { status: 302, headers: { Location: successUrl.toString() } });
};


