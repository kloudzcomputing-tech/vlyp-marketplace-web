export const load = async ({ params, request }) => {
    const { id } = params;

    const userAgent = request.headers.get("user-agent") || "";

    const isMobile =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);



    const products = [
        {
            id: 1,
            title: "CHHOTE NAWAB Men's Typography Regular Polo Black Tshirts",
            selling_price: 100,
            original_price: 150,
            description: "This is a description of the product",
            care_information: "This is a care information of the product",
            discount: 23,
            category: 'T-Shirt',
            rating: '4.0',
            reviews: 1234,
            seller: {
                name: "Onelab",
                slug: "onelab",
            },
            images: [
                "https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512",
                "https://images.meesho.com/images/products/430702251/393mn_512.avif?width=512",
                "https://images.meesho.com/images/products/430702251/ioxd0_512.avif?width=512"
            ],
            options: [
                {
                    name: "Size",
                    options: [
                        "S",
                        "M",
                        "L",
                        "XL",
                    ]
                },
                {
                    name: "Color",
                    options: [
                        "Red",
                        "Blue",
                        "Green",
                    ]
                }
            ],
            variations: [
                {
                    id: 1,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['S', 'Red'],
                    selling_price: 100,
                    original_price: 150,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Blue'],
                    selling_price: 150,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Green'],
                    selling_price: 180,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                }
            ],
            discount_type: "percentage",
            category: "Category 1",
        },
        {
            id: 2,
            title: "FTX (Pack of 4) Men's Solid Regular Round Multicolor Tshirts",
            selling_price: 199,
            original_price: 299,
            description: "This is a description of the product",
            care_information: "This is a care information of the product",
            discount: 23,
            category: 'T-Shirt',
            rating: '4.0',
            reviews: 1234,
            seller: {
                name: "Onelab",
                slug: "onelab",
            },
            images: [
                "https://images.meesho.com/images/products/321712648/u0pb2_512.avif?width=512",
                "https://images.meesho.com/images/products/321712648/u0pb2_512.avif?width=512"
            ],
            options: [
                {
                    name: "Size",
                    options: [
                        "S",
                        "M",
                        "L",
                        "XL",
                    ]
                },
                {
                    name: "Color",
                    options: [
                        "Red",
                        "Blue",
                        "Green",
                    ]
                }
            ],
            variations: [
                {
                    id: 1,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['S', 'Red'],
                    selling_price: 200,
                    original_price: 150,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Blue'],
                    selling_price: 150,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Green'],
                    selling_price: 180,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                }
            ],
            discount_type: "percentage",
            category: "Category 1",
        },
        {
            id: 3,
            title: "CHHOTE NAWAB Men's Typography Regular Polo Black Tshirts",
            selling_price: 100,
            original_price: 150,
            description: "This is a description of the product",
            care_information: "This is a care information of the product",
            discount: 23,
            category: 'T-Shirt',
            rating: '4.0',
            reviews: 1234,
            seller: {
                name: "Onelab",
                slug: "onelab",
            },
            images: [
                "https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512",
                "https://images.meesho.com/images/products/430702251/393mn_512.avif?width=512",
                "https://images.meesho.com/images/products/430702251/ioxd0_512.avif?width=512"
            ],
            options: [
                {
                    name: "Size",
                    options: [
                        "S",
                        "M",
                        "L",
                        "XL",
                    ]
                },
                {
                    name: "Color",
                    options: [
                        "Red",
                        "Blue",
                        "Green",
                    ]
                }
            ],
            variations: [
                {
                    id: 1,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['S', 'Red'],
                    selling_price: 100,
                    original_price: 150,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Blue'],
                    selling_price: 150,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Green'],
                    selling_price: 180,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                }
            ],
            discount_type: "percentage",
            category: "Category 1",
        },
        {
            id: 4,
            title: "FTX (Pack of 4) Men's Solid Regular Round Multicolor Tshirts",
            selling_price: 199,
            original_price: 299,
            description: "This is a description of the product",
            care_information: "This is a care information of the product",
            discount: 23,
            category: 'T-Shirt',
            rating: '4.0',
            reviews: 1234,
            seller: {
                name: "Onelab",
                slug: "onelab",
            },
            images: [
                "https://images.meesho.com/images/products/321712648/u0pb2_512.avif?width=512",
                "https://images.meesho.com/images/products/321712648/u0pb2_512.avif?width=512"
            ],
            options: [
                {
                    name: "Size",
                    options: [
                        "S",
                        "M",
                        "L",
                        "XL",
                    ]
                },
                {
                    name: "Color",
                    options: [
                        "Red",
                        "Blue",
                        "Green",
                    ]
                }
            ],
            variations: [
                {
                    id: 1,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['S', 'Red'],
                    selling_price: 200,
                    original_price: 150,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Blue'],
                    selling_price: 150,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                },
                {
                    id: 2,
                    optionname: ['Size', 'Color'],
                    optionvalues: ['M', 'Green'],
                    selling_price: 180,
                    original_price: 200,
                    discount: 23,
                    discount_type: "percentage",
                    stock: 10,
                }
            ],
            discount_type: "percentage",
            category: "Category 1",
        }
    ]
    const video = [
        {
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        }
    ]
    return { video, products, isMobile };
}