import { connect_service } from '$lib/helpers/helper.js';

export const load = async ({ platform, cookies }) => {
    try {
        const token = cookies.get('customer_token');
        let customer = await platform.env.VLYP_KV.get(`customer_${token}`);
     
        if (!customer) {
            throw new Error('Customer not found');
        }
        customer = JSON.parse(customer);
        
        const resp = await connect_service(platform, `${platform.env.BASE_URL}/${customer?.id}/order`);
        const {status,message,data} = await resp.json();
        console.log({status,message,data},"PPPP")
        if(!status){
            throw new Error(message);
        }
        console.log(data, "data");
        return {
            orders: data
        }
    } catch (error) {
        return {
            error: error.message,
            orders: []
        }
    }
  
}
    // const orders = [
    //     {
    //         id: 1,
    //         order_number: '1234567890',
    //         order_items: [
    //             {
    //                 id: 1,
    //                 name: 'Product 1',
    //                 quantity: 1,
    //                 price: 100,
    //                 image: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
    //                 variant:'Size: M, Color: Red',
    //             }
    //         ],
    //         total_amount: 100,
    //         order_status:'confirmed',
    //         delivered_date: null,
    //         expected_delivery_date: '2025-01-01',
    //         created_at: '2025-01-01',
    //         updated_at: '2025-01-01',
    //     },
    //     {
    //         id: 2,
    //         order_number: '1234567890',
    //         order_items: [
    //             {
    //                 id: 1,
    //                 name: 'Product 2',
    //                 quantity: 2,
    //                 price: 200,
    //                 image: 'https://images.meesho.com/images/products/430702251/kronx_512.avif?width=512',
    //                 variant:'Size: L, Color: Blue',
    //             }
    //         ],
    //         total_amount: 200,
    //         order_status:'delivered',
    //         delivered_date: '2025-01-02',
    //         expected_delivery_date: '2025-01-02',
    //         created_at: '2025-01-02',
    //         updated_at: '2025-01-02',
    //     },
    // ]
    // return {
    //     orders
    // }
