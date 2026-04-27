import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ params, request, platform, fetch }) => {
    try {


        const { slug, type } = params;
        let filter
        let products = []
        const filterResp = await connect_service(platform, `${platform.env.BASE_URL}/products/filters?type=${type}&slug=${slug}`)
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

        const url = new URL(request.url);

        const filteredEntries = [...url.searchParams.entries()]
          .filter(([_, value]) => value !== "");
        
        const searchParams =
          filteredEntries.length > 0
            ? "&" + filteredEntries.map(([k, v]) => `${k}=${encodeURIComponent(v)}`).join("&")
            : "";
        console.log(searchParams, "searchParams", filteredEntries);
        const productResp = await fetch(`${platform.env.BASE_URL}/products/search?type=${type}&slug=${slug}`)
        const productData = await productResp.json();
       
        if (!productData.status) {
            throw new Error(productData.message);
        }
        // console.log(productData.data, "productData.data");
        products = productData.data;
        return {
            filter,
            products,
        }
    } catch (error) {
        return {   
            filters: null,
            products: [],
            error: error.message
        }
    }
}