import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
    try {
        const token = cookies.get('customer_token');
        const cart_key = cookies.get('cart_key');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        
        const user = JSON.parse(users);
       
        const body = await request.json();
    
        const payload = {
            order_id:body.order_id,
            order_items_id: body.order_item_id,
        }
        // console.log(payload,"payload");return
        
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/${payload?.order_id}/cancel-order`, {
            method: 'PUT',
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
        console.log(error.message)
        return json({ status: false, message: error.message });
    }
}