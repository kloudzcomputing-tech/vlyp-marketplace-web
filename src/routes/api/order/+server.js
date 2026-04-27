import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
    try {
        const token = cookies.get('customer_token');
        const cart_key = cookies.get('cart_key');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        
        const user = JSON.parse(users);
        if (!user) {
            return json({ status: false, message: 'User not found' })
        }
        const body = await request.json(); 
        
        const cart_items = await platform.env.VLYP_KV.get(`cart_${cart_key}`);
        const selected_items = JSON.parse(cart_items)?.selected_items

        const payload = {
            bill:body.bill,
            shipping_address: body.shipping_address,
            cart_items: selected_items.length > 0 ? selected_items : body.cart_items,
            coupon_code: body?.coupon_code || '',
            is_cod: body.is_cod,
            delivery_type:body?.delivery_type || 'S',
            receiver_name:`${user.first_name}`,
            receiver_phone:`+${user?.country_code}${user?.phone}`
        }
        console.log(payload,"payload");
    //    return
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/${user?.id}/order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const data = await resp.json();
        if(data.success){
            // await platform.env.VLYP_KV.put(`cart_${cart_key}`, JSON.stringify({cart_items:[],selected_items:[]}));
            return json({ status: true, message: 'Order created successfully',order_id:data.data });
        }else{
            throw new Error(data.message);
        }
    } catch (error) {
        console.log(error.message,"PPP")
        return json({ status: false, message: error.message });
    }
}