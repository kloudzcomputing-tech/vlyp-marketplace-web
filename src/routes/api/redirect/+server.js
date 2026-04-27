import { computeResponseHash } from "$lib/server/payu";
import { json, redirect } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies }) => {
  const raw = await request.text();
  const SALT = platform.env.PAYU_SALT;
  const params = Object.fromEntries(new URLSearchParams(raw))


  const url = new URL(request.url);
  const origin = `${url.protocol}//${url.host}`;


  if (params.status === 'failure') {
    console.log(params)
    const failureUrl = new URL("/checkout", origin);

    failureUrl.searchParams.set('payment_failed', 1);
    failureUrl.searchParams.set('error_message', params.error_Message ?? '');
    return new Response(null, { status: 302, headers: { Location: failureUrl.toString() } });
  }

  
  const verifyHash = await computeResponseHash({ ...params, salt: SALT });

  if (verifyHash !== params.hash) {
    return new Response("Invalid hash", { status: 400 });
  }


  const successUrl = new URL("/orders/success", origin);
  console.log(params,"paramsparams");
  

  successUrl.searchParams.set('oid', params.udf1 ?? '');
  successUrl.searchParams.set('txnid', params.txnid ?? '');
  successUrl.searchParams.set('status', params.status ?? '');
  successUrl.searchParams.set('mode', params.mode ?? 'COD');
  return new Response(null, { status: 302, headers: { Location: successUrl.toString() } });
};