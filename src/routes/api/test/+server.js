import { redirect } from '@sveltejs/kit';

export async function POST({ request, platform }) {
    const body = await request.json();

    return redirect(302, '/checkout');
}