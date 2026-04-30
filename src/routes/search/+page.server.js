export const load = async ({ locals }) => {
    return {
        customer: locals?.customer || null,
    };
};
