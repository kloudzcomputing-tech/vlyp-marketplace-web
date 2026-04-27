export const load = async () => {
    const categories = [
        {
            id: 'fashion',
            name: 'Fashion',
            slug: 'fashion',
            children: [
                {
                    id: 'men',
                    name: 'Men',
                    slug: 'men',
                    children: [
                        {
                            id: 'shirts',
                            name: 'Shirts',
                            slug: 'shirts',
                        },
                        {
                            id: 't-shirts',
                            name: 'T-Shirts',
                            slug: 't-shirts',
                        },
                    ],
                },
                {
                    id: 'women',
                    name: 'Women',
                    slug: 'women',
                    children: [
                        {
                            id: 'tops',
                            name: 'Tops',
                            slug: 'tops',
                        },
                        {
                            id: 'bottoms',
                            name: 'Bottoms',
                            slug: 'bottoms',
                        },
                        {
                            id: 'ethnic',
                            name: 'Ethnic',
                            slug: 'ethnic',
                            children: [
                                {
                                    id: 'sarees',
                                    name: 'Sarees',
                                    slug: 'sarees',
                                },
                                {
                                    id: 'lehengas',
                                    name: 'Lehengas',
                                    slug: 'lehengas',
                                },
                                {
                                    id: 'salwars',
                                    name: 'Salwars',
                                    slug: 'salwars',
                                },
                                {
                                    id: 'suites',
                                    name: 'Suites',
                                    slug: 'suites',
                                },
                                {
                                    id: 'kurtas',
                                    name: 'Kurtas',
                                    slug: 'kurtas',
                                },
                                {
                                    id: 'dresses',
                                    name: 'Dresses',
                                    slug: 'dresses',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: 'electronics',
            name: 'Electronics',
            slug: 'electronics',
            children: [
                {
                    id: 'laptops',
                    name: 'Laptops',
                    slug: 'laptops',
                },
                {
                    id: 'desktops',
                    name: 'Desktops',
                    slug: 'desktops',
                },
                {
                    id: 'mobiles',
                    name: 'Mobiles',
                    slug: 'mobiles',
                },
                {
                    id: 'tablets',
                    name: 'Tablets',
                    slug: 'tablets',
                },
                {
                    id: 'smartphones',
                    name: 'Smartphones',
                    slug: 'smartphones',
                },
                {
                    id: 'smartwatches',
                    name: 'Smartwatches',
                    slug: 'smartwatches',
                },
                {
                    id: 'headphones',
                    name: 'Headphones',
                    slug: 'headphones',
                },
                {
                    id: 'speakers',
                    name: 'Speakers',
                    slug: 'speakers',
                },
                {
                    id: 'cameras',
                    name: 'Cameras',
                    slug: 'cameras',
                },
            ],
        },
        {
            id: 'home-living',
            name: 'Home & Living',
            slug: 'home-living',
            children: [
                {
                    id: 'furniture',
                    name: 'Furniture',
                    slug: 'furniture',
                },
                {
                    id: 'decor',
                    name: 'Decor',
                    slug: 'decor',
                },
            ],
        },
    ]
    return {
        categories
    }
}