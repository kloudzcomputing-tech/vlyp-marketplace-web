
import { json, redirect } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
  const raw = await request.text();
  const SALT = platform.env.PAYU_SALT;
  const token = cookies.get('token');

  

  const url = new URL(`http://localhost:5173/payment-failed`);
  return new Response(null, { status: 302, headers: { Location: url.toString() } });
};