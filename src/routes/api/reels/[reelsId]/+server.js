import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
    try {
        const token = cookies.get('customer_token');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        
        const user = JSON.parse(users);
        if (!user) {
            return json({ status: false, message: 'User not found' })
        }
        
        let body = await request.json();
        body.user_id = user.id
        body.category = 'fashion'
        
        const response = await connect_service(platform,
            `${platform.env.BASE_URL}/reels/${body.reel_id}/stats`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: cookies.toString()
                },
                body: JSON.stringify(body)
            }
        );

        const data = await response.json();
        

        if (!response.ok) {
            return json(
                { status: false, message: data?.message || "Reels fetched failed" },
                { status: response.status }
            );
        }

        return json({
            status: true,
            message: "Reels fetched successfully",
            data
        });
    } catch (error) {
        console.log(error,"error");
        
        return json(
            { status: false, message: error.message },
            { status: 500 }
        );
    }
};
