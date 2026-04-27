import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ params, request, platform, fetch,cookies }) => {
    try {
        const token = cookies.get('customer_token');
        const cart_key = cookies.get('cart_key');
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);

        const user = JSON.parse(users);
        if (!user) {
            return json({ status: false, message: 'User not found' })
        }
        
        const url = new URL(request.url);
        const vid = url.searchParams.get("vid");
        const { slug, type } = params;
        let filter
        let products = []
        let vendor_details
        const filterResp = await connect_service(platform, `${platform.env.BASE_URL}/products/vendor/${vid}/filters`)
        const filterData = await filterResp.json();
        if (!filterData.status) {
            throw new Error(filterData.message);
        }
        filter = filterData.data;

        const INTERNAL_PARAMS = new Set([
            "x-sveltekit-invalidated",
            "x-sveltekit-noscroll",
            "x-sveltekit-preload"
        ]);


        const filteredEntries = [...url.searchParams.entries()]
            .filter(([_, value]) => value !== "");

        const searchParams =
            filteredEntries.length > 0
                ? "&" + filteredEntries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
                : "";

        const productResp = await fetch(`${platform.env.BASE_URL}/products/vendor/${vid}?customer_id=${user.id}`)
        const productData = await productResp.json();

        if (!productData.status) {
            throw new Error(productData.message);
        }
        products = productData.data.products;
        vendor_details = productData.data.vendor_details
        return {
            filter,
            products,
            vendor_details,
            user
        }
    } catch (error) {
        return {
            filters: null,
            products: [],
            error: error.message
        }
    }
}