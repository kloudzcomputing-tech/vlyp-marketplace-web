export const load = async ({ params }) => {
    const { store_slug } = params;
    const store = {
        name: 'Store 1',
        slug: store_slug,
        rating: '4.5',
        reviews: 100,
        followers: 100,
        description: 'This is a description of the store',
        logo: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
        banner: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
    }
    return {
        store
    }
}