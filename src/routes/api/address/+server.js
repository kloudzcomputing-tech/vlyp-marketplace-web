import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies,locals }) => {
    try {
        let customer = locals.customer;
        if(!customer){
            return json({ status: false, message: 'Customer not found' })
        }
        const payload = await request.json();
        
        const response = await connect_service(platform, `${platform.env.BASE_URL}/${customer.id}/address`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const {status,message,data} = await response.json();
        if(!status){
             throw new Error(message);
        }
        return json({ status: true, message: 'Address added successfully'})
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}

export const GET = async ({ request, platform, locals }) => {
    try {
        
        let customer = locals.customer;
        if(!customer){
            return json({ status: false, message: 'Customer not found' })
        }
        let customer_id = customer.id;
        const response = await connect_service(platform, `${platform.env.BASE_URL}/${customer_id}/address`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        
        const {status,message,data} = await response.json();
        if(!status){
            throw new Error(message);
        }
        return json({ status: true, message: 'Address fetched successfully', data: data })
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}