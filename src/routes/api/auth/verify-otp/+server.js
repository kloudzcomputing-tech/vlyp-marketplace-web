import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request,platform,cookies}) => {
    try {
        const referral_code = cookies.get('referral_code');
        const { otp,country_code,phone,name,email } = await request.json();
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/verify-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ otp,country_code,phone,name,email,referral_code }),
        });
        const {status,message,data} = await resp.json();
       
        if(!status){
            return json({ status: false, message: message })
        }
        const customer_token = crypto.randomUUID();

        cookies.set('customer_token', customer_token, {
            path: '/',
            httpOnly: true,
            secure: platform.env.enviroment === 'production',
            maxAge: 60 * 60 * 24, // 1 days
        });
       
        if(referral_code){
            await platform.env.VLYP_KV.put(`referral_click_${data.user?.global_uid}`, JSON.stringify({
                referral_id: referral_code,
                created_at: new Date().toISOString(),
            }), {
                expirationTtl: 60 * 60 * 24, // 24 hr
            });
            cookies.delete('referral_code', { path: '/' });
        }
        
        await platform.env.VLYP_KV.put(`customer_${customer_token}`, JSON.stringify(data.user),{
            expirationTtl: 60 * 60 * 24, // 1 day
        });
        return json({ status: true, message: 'OTP verified successfully' })
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}