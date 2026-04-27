import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

const initialCoupons = [
    {
        id: 1,
        title: '₹50 off on this product',
        code: 'FREE50',
        discount: 50,
        discount_type: 'fixed',
        description: 'Get ₹50 off on your order',
        max_discount_amount: 500,
        min_cart_value: 50,
        scope: 'PRODUCT'
    }
]

export const POST = async ({ platform, cookies, locals, request }) => {
    try {
        const body = await request.json();
        const { product_id, variation_id, category_id, vendor_id, amount, is_global } = body;
       console.log(body,"LLL");
       

        const resp = await connect_service(platform, `${platform.env.BASE_URL}/coupons`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        
        const { status, message, data } = await resp.json();
      
        if (!status) {
            throw new Error(message);
        }
        let filteredCoupons = data.filter((coupon) => {
            if (coupon.scope !== 'PRODUCT') {
                if (coupon.discount_type === 'PERCENTAGE') {
                    return coupon.min_cart_value <= amount && coupon.max_discount_amount >= amount * (coupon.discount_value / 100);
                }
            } else {
                return coupon;
            }
        });

        let dataResponse = {
            coupons: filteredCoupons
        }
        return json({ status: true, message: 'Coupons fetched successfully', data: dataResponse })
    } catch (error) {
        return json({ status: false, message: error.message })
    }

}