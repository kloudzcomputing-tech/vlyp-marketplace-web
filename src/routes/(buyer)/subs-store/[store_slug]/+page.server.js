import { connect_service } from '$lib/helpers/helper';

/** @type {import('./$types').PageServerLoad} */
export async function load({platform, request, cookies,params }) {
  // preserve any query params from the page route, or set defaults
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || '1';
  const limit = url.searchParams.get('limit') || '10';
  const search = url.searchParams.get('search') || '';

  // call the internal endpoint
  const q = new URLSearchParams({ page, limit });
  if (search) q.set('search', search);

  const storeSlug = params.store_slug;

 
  const res = await connect_service(platform, `${platform.env.BASE_URL}/stores/${storeSlug}`, {
    method: 'GET',
  });

  const {status,data} = await res.json();
  
  
  

  if (!status) {
    return {
      sub_store:null,
      products: [],
      meta: {
        page: Number(page),
        limit: Number(limit),
        total: 0,
      },
      error: message || 'Failed to load stores',
    };
  }
  
  const products = data.products || [];
  const sub_store = data.sub_store || null;
  const meta = data.meta || { total: products.length, page: Number(page), limit: Number(limit) };
 
  
  return { products, meta, sub_store };
}