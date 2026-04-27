import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ platform, cookies }) => {
    try {
        const token = cookies.get("customer_token");

        let customer = await platform.env.VLYP_KV.get(`customer_${token}`);
        if (!customer) {
            throw new Error("Customer not found");
        }

        customer = JSON.parse(customer);

        /* ----------- VENDOR FOLLOWINGS API ----------- */
        const followResp = await connect_service(
            platform,
            `${platform.env.BASE_URL}/vendor/followings/${customer.id}`
        );

        const { success, message, data } = await followResp.json();
        console.log(success, message, data ,"QQQQ");
        
        if (!success) {
            throw new Error(message);
        }

        return {
            followings: data
        };
    } catch (error) {
        return {
            error: error.message,
            followings: []
        };
    }
};
