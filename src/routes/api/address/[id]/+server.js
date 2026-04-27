import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const DELETE = async ({ platform, cookies, params }) => {
    try {
        const token = cookies.get('token');
        const { id } = params;
        const response = await connect_service(platform, `${platform.env.BASE_URL}/customer/address/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if(data.success){
            return json({ status: true, message: 'Address deleted successfully' })
        }else{
            throw new Error(data.message);
        }
    } catch (error) {
        return json({ status: false, message: error.message })
    }
}