export const load = async () => {
    const coupons = [
        {
            id: 1,
            code: 'FIRST12',
            discount: 12,
            discount_type: 'percentage',
            description: 'Get 12% off on your first order',
            min_purchase: 500,
            max_discount: 1000,
            status: 'active',
            expiry_date: '2025-12-31',
            applicable_on: 'All products',
        },
        {
            id: 2,
            code: 'SAVE50',
            discount: 50,
            discount_type: 'fixed',
            description: 'Flat ₹50 off on orders above ₹500',
            min_purchase: 500,
            max_discount: 50,
            status: 'active',
            expiry_date: '2025-06-30',
            applicable_on: 'All products',
        },
        {
            id: 3,
            code: 'WELCOME20',
            discount: 20,
            discount_type: 'percentage',
            description: 'Welcome offer: 20% off',
            min_purchase: 1000,
            max_discount: 500,
            status: 'expired',
            expiry_date: '2024-12-31',
            applicable_on: 'All products',
        },
        {
            id: 4,
            code: 'SUMMER25',
            discount: 25,
            discount_type: 'percentage',
            description: 'Summer sale: 25% off',
            min_purchase: 2000,
            max_discount: 2000,
            status: 'used',
            expiry_date: '2025-08-31',
            applicable_on: 'All products',
        },
    ];

    return {
        coupons
    };
};

