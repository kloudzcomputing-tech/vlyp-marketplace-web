import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
    try {
        
        const payload = await request.json();
        const response = await connect_service(platform, `${platform.env.BASE_URL}/checkout/calculate-billing `, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        const {status,message,data} = await response.json();
        if(status){
            return json({ status: true,  message: message, data: data })
        }else{
            throw new Error(message);
        }
    }
    catch (error) {
        return json({ status: false, message: error.message })
    }
}