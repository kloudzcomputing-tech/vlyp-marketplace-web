import { connect_service } from "$lib/helpers/helper.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ platform, cookies, locals }) => {
    const customer = locals?.customer || null;

    if (!customer) {
        throw redirect(302, "/");
    }

    const res = await connect_service(platform,
        `${platform.env.BASE_URL}/profile/details/${customer.id}`,
        {
            headers: {
                "Content-Type": "application/json",
                cookie: cookies.toString(), // forward auth/session
            },
        }
    );

    if (!res.ok) {
        throw redirect(302, "/");
    }

    const data = await res.json();
    console.log(data,"LLL");
    
    return {
        customer: data?.data || null,
    };
};
