export const load = async ({ request }) => {
    const url = new URL(request.url);
    const error_message = url.searchParams.get('error_message');
    const status = url.searchParams.get('status');
    const txnid = url.searchParams.get('txnid');
    return { txnid, status, error_message };
};