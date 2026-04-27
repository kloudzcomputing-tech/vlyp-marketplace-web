

export const load = async ({ platform, cookies, locals }) => {
    let cart = locals?.cart || null;
    let customer = locals?.customer || null;
    return { items: cart?.cart_items || [], customer: customer }
}