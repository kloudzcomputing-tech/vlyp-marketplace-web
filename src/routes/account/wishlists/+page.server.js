export const load = async () => {
    const wishlists = [
        {
            id: 1,
            name: 'My Wishlist',
            product_count: 5,
            created_at: '2024-01-15',
            is_default: true,
            products: [
                {
                    id: 1,
                    name: 'CHHOTE NAWAB Men\'s Typography Regular Polo Black Tshirts',
                    selling_price: 299,
                    original_price: 599,
                    thumbnail: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
                    rating: 4.5,
                    reviews: 1234,
                },
                {
                    id: 2,
                    name: 'FTX (Pack of 4) Men\'s Solid Regular Round Multicolor Tshirts',
                    selling_price: 499,
                    original_price: 999,
                    thumbnail: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
                    rating: 4.2,
                    reviews: 567,
                },
            ],
        },
        {
            id: 2,
            name: 'Summer Collection',
            product_count: 3,
            created_at: '2024-03-20',
            is_default: false,
            products: [
                {
                    id: 3,
                    name: 'Red Stripe Men\'s T-Shirt',
                    selling_price: 399,
                    original_price: 799,
                    thumbnail: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
                    rating: 4.0,
                    reviews: 890,
                },
            ],
        },
    ];

    return {
        wishlists
    };
};

