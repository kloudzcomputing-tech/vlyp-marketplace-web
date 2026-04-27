import { json } from "@sveltejs/kit";
import { buildPayuRequest, makeTxnId } from "$lib/server/payu";
export const POST = async ({ request, url, platform, cookies, locals }) => {
  try {
    const body = await request.json();
    const { order_id, cartItemNames, amount,variant_ids } = body;
    const customer = locals.customer;
    if (!customer) {
      throw new Error("Customer not found");
    }

    let full_name = customer.first_name
    let email = customer.email
    let phone = customer.phone
    const productinfo = cartItemNames;
    const key = platform.env.PAYU_KEY;
    const salt = platform.env.PAYU_SALT;
    const base = platform.env.PAYU_BASE || "https://test.payu.in";
    if (!key || !salt) {
      return json({ ok: false, error: "PAYU env not configured" }, { status: 500 });
    }
    const txnid = 'TXN_'+order_id+'_'+Date.now();
    const origin = `${url.protocol}//${url.host}`;
    const surl = `${origin}/api/redirect`;
    // const furl = `${origin}/payment-failed`;
    const furl = `${origin}/api/redirect`;
    const { action, params } = await buildPayuRequest({
      key,
      salt,
      baseUrl: base,
      txnid,
      amount,
      productinfo,
      firstname: full_name,
      email,
      phone,
      surl,
      furl,
      udf1: order_id,
      udf2: JSON.stringify(variant_ids),
      udf3: 'CUSTOMER_PAID',
      udf4: '',
      udf5: '',
      udf6: '',
      udf7: ''
    });
    return json({ ok: true, action, params });
  } catch (err) {
    console.error("PayU init error:", err);
    return json({ ok: false, error: "Init failed" }, { status: 500 });
  }
};
