export const load = async () => {
    const giftCards = [
        {
            id: 1,
            code: 'GC-1234567890',
            amount: 1000,
            balance: 750,
            currency: 'INR',
            status: 'active',
            expiry_date: '2025-12-31',
            issued_date: '2024-01-15',
        },
        {
            id: 2,
            code: 'GC-0987654321',
            amount: 500,
            balance: 0,
            currency: 'INR',
            status: 'used',
            expiry_date: '2025-06-30',
            issued_date: '2024-03-20',
        },
        {
            id: 3,
            code: 'GC-5555555555',
            amount: 2000,
            balance: 2000,
            currency: 'INR',
            status: 'active',
            expiry_date: '2026-01-15',
            issued_date: '2024-12-01',
        },
    ];

    return {
        giftCards
    };
};

