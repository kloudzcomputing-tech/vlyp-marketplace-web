import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ params,platform }) => {
    try {
       
        const { col_slug } = params;
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/customer/collection/${col_slug}`)
        const data = await resp.json();
        if(data.success){
            return {
                collection_name: data.collections.name,
                categories: data.collections.categories,
                products: data.collections.products,
                price_range: data.collections.price_range,
            }
        }else{
            throw new Error(data.message);
        }
    } catch (error) {
        return {
            collection: null,
            error: error.message
        }
    }
   
}