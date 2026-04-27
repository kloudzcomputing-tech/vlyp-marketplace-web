import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const PUT = async ({ request, platform, cookies }) => {
    try {
        const token = cookies.get('customer_token');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        
        const user = JSON.parse(users);
        if (!user) {
            return json({ status: false, message: 'User not found' })
        }
        
        const body = await request.json();
        console.log(`${platform.env.BASE_URL}/profile/update/${user.id}`);
        
        const response = await connect_service(platform,
            `${platform.env.BASE_URL}/profile/update/${user.id}`,
            {
                method: "PUT",
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
                { status: false, message: data?.message || "Profile update failed" },
                { status: response.status }
            );
        }

        return json({
            status: true,
            message: "Profile updated successfully",
            data
        });
    } catch (error) {
        return json(
            { status: false, message: error.message },
            { status: 500 }
        );
    }
};
