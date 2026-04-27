import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies, locals }) => {
    try {
        const token = cookies.get('customer_token');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        
        const user = JSON.parse(users);
        if (!user) {
            return json({ status: false, message: 'User not found' })
        }
        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return json(
                { status: false, message: "File is required" },
                { status: 400 }
            );
        }

        // forward exactly what backend expects
        const backendForm = new FormData();
        backendForm.append("file", file);
        const res = await connect_service(platform,
            `${platform.env.BASE_URL}/profile/upload/${user.id}`,
            {
                method: "POST",
                headers: {
                    cookie: cookies.toString(), // session / auth
                },
                body: backendForm,
            }
        );

        const data = await res.json();
        console.log(data);
        
        if (!res.ok) {
            return json(
                {
                    status: false,
                    message: data?.message || "Upload failed",
                },
                { status: res.status }
            );
        }

        return json({
            status: true,
            message: "Profile image updated successfully",
            image_url: data?.data?.profile_image || null,
        });
    } catch (error) {
        console.log(error);
        
        return json(
            { status: false, message: error.message },
            { status: 500 }
        );
    }
};
