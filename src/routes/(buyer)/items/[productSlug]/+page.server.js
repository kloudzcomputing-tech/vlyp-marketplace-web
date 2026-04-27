import { connect_service } from "$lib/helpers/helper.js";
import { error } from "@sveltejs/kit";

export const load = async ({ params, fetch, platform ,locals, request}) => {
    const { productSlug } = params;
   
    let postal_code
    let coupons = [];
    const customer = locals.customer
    let address = [];
    if(customer){
        // const addressRes = await connect_service(platform, `${platform.env.BASE_URL}/api/address`);
         const addressRes = await connect_service(platform, `${platform.env.BASE_URL}/${customer.id}/address`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const addressJson = await addressRes.json()
        console.log(addressJson, "jhgfd");
        
        postal_code = addressJson.data.addresses.find((ele) => ele.is_default === 1)
    }
    const res = await connect_service(platform,
        `${platform.env.BASE_URL}/products/${productSlug}`
    );

    // if (!res.ok) {
    //     throw error(404, "Product not found");
    // }

    const json = await res.json();
    const apiProduct = json?.data?.product;
    console.log(json,"apiProduct");
    
    if (!apiProduct) {
        return {
            product: null,
            reviews: []
        };
    }
   

    const couponsRes = await fetch(`/api/coupons`,{
        method:'POST',
        body: JSON.stringify({
            product_id: apiProduct.id,
            variation_id: apiProduct.variation_id,
            category_id: apiProduct.category_id,
            vendor_id: apiProduct.vendor_id,
            amount:apiProduct.selling_price,
            user_id:customer?.id,
            is_global:false
        }),
    
    });
    const couponsJson = await couponsRes.json();
    console.log(couponsJson,"couponsJsoncouponsJson");
    
    if(couponsJson.status){
     coupons = couponsJson.data.coupons;
    }
    return {
        product:apiProduct,
        product_attributes:json?.data?.product_attributes ?? [],
        coupons,
        category_attributes:json?.data?.category_attributes ?? [],
        reviews: json?.data?.reviews ?? [],
        postalCode: postal_code?.postal_code || null,
    };
};
