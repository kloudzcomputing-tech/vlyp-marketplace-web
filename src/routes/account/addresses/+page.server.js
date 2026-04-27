import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ platform, cookies }) => {
    try {
        const token = cookies.get('token');
        const response = await connect_service(platform, `${platform.env.BASE_URL}/customer/address`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if(data.success){
            return {
                addresses: data.addresses
            }
        }else{
            throw new Error(data.message);
        }
    } catch (error) {
        return {
            addresses: []
        }
    }

}