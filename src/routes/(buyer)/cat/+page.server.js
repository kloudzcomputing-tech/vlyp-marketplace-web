import { redirect } from '@sveltejs/kit';

export const load = async ({ platform, params,request }) => {
    const url = new URL(request.url);
    const category = url.searchParams.get('cs');
    if(!category){
        redirect(302, '/cat?cs=popular');
    }
    const filters = [
        {
            name:"Sort by",
            options: [
                "Relevance",
                "New Arrival",
                "Price: Low to High",
                "Price: High to Low",
                "Best Sellers",
                "Most Popular",
                "Most Rated",
                "Most Reviewed",
                "Most Viewed",
            ],
            type:"dropdown"
        },
        {
            name:"Categories",
            options: [
                "Boxers","Jackets & Sweaters","Shirts","T-Shirts","Jeans","Shorts","Sleepwear","Men Shorts","Men Tracksuits","Men Joggers","Men Shorts","Men Tracksuits","Men Joggers"
            ],
            type:"select"
        },
        {
            name:"Price",
            options: [
                "₹0 - ₹1000",
                "₹1000 - ₹2000",
                "₹2000 - ₹3000",
            ],
            type:"select"
        },
        
    ]
    const products = [
        {
            id: 1,
            title: "Product 1",
            selling_price: 100,
            original_price: 150,
            discount:23,
            rating: '4.0',
            reviews: 1234,
            images: ["https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512"],
            category:'T-Shirt',
            variations:[
                {
                    id:1,
                    size:'S',
                    color:'Red',
                    price:100,
                    stock:10,
                }
            ],
            discount_type:"percentage",
            category: "Category 1",
        },
        {
            id: 2,
            title: "FTX (Pack of 4) Men's Solid Regular Round Multicolor Tshirts",
            selling_price: 100,
            original_price: 150,
            discount:23,
            rating: '4.3',
            reviews: 456,
            images: ["https://images.meesho.com/images/products/79514661/lw9yk_512.avif?width=512"],
            category:'T-Shirt',
            variations:[
                {
                    id:1,
                    size:'M',
                    color:'Blue',
                    price:150,
                    stock:10,
                }
            ],
            discount_type:"percentage",
            category: "Category 1",
        },
    ]
    return {
        filters,products
    }
}