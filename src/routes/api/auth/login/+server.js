import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request,platform,cookies, fetch}) => {
    try {
        console.log(platform, "gjgj");
        
        const { country_code, phone } = await request.json();
      
        const resp  = await connect_service(platform, `${platform.env.BASE_URL}/get-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ country_code, phone }),
        });
        const data = await resp.json();
        if(data.success){
            let token = data.token;
            let user = data.customer
            cookies.set('token', token, {
                path: '/',
                httpOnly: true,
                secure: platform.env.enviroment === 'production',
                maxAge: 60 * 60 * 24 * 30, // 30 days
            });
            await platform.env.VLYP_KV.put(`user_${token}`, JSON.stringify(user));
            return json({ status: true, message: 'Login successful' })
        }else{
            return json({ status: false, message: data.message })
        }
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}