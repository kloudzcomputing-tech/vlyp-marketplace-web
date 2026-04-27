import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request,platform,cookies}) => {
    try {
        const { country_code, phone } = await request.json();
      
        const resp  = await connect_service(platform, `${platform.env.BASE_URL}/get-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ country_code, phone }),
        });
        const {status,message,data} = await resp.json();
        if(!status){
            return json({ status: false, message: message })
        }
        return json({ status: true, message: 'OTP sent successfully',data:{
            is_new: data.is_new
        } })  
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}