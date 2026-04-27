import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ params,cookies,platform,locals }) => {
    try {
        const order_item_id = params['item_id'];
        const customer = locals.customer;
        if (!customer) {
            throw new Error('Customer not found');
        }
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/${customer?.id}/order/${order_item_id}`)
        const {status,message,data} = await resp.json();
        console.log({status,message,data})
        if(!status){
            throw new Error(message);
        }
        console.log(data,'ORDER DETAIL')
        return {
            order: data
        }
    } catch (error) {
        return {
            error: error.message,
            order: null
        }
    }
    
   
   
    
}