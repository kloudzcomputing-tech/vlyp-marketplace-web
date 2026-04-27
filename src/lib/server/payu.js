const toHex = (buf) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");

// export async function sha512Hex(str) {
  
//   try {
//     const { createHash } = await import("node:crypto");
//     return createHash("sha512").update(str, "utf8").digest("hex");
// } catch (err) {
//   throw err;
// }
// }

export async function sha512Hex(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest("SHA-512", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

const clean = (v) => (v ?? "").toString();
const amt2  = (v) => {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new Error(`Invalid amount: ${v}`);
  return n.toFixed(2);
};

// --- REQUEST HASH (merchant -> PayU) ----------------------------------------
/**
 * PayU request-hash **must** be:
 * key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|SALT
 * If you don't use UDFs, they are empty strings => **10 empties** after email.
 */
export async function generateRequestHash({
  key, txnid, amount, productinfo, firstname, email,
  udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "",
  udf6 = "", udf7 = "", udf8 = "", udf9 = "", udf10 = "",
  salt,
  debug = false
}) {
  const seq = [
    clean(key),
    clean(txnid),
    amt2(amount),
    clean(productinfo),
    clean(firstname),
    clean(email),
    clean(udf1), clean(udf2), clean(udf3), clean(udf4), clean(udf5),
    clean(udf6), clean(udf7), clean(udf8), clean(udf9), clean(udf10),
    salt  // DO NOT trim/mutate the salt
  ].join("|");


  

  const hash = await sha512Hex(seq);
  return hash;
}

export async function buildPayuRequest({
  key,
  salt,
  baseUrl,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  phone,
  surl,
  furl,
  // optional UDFs
  udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "",
  udf6 = "", udf7 = "", udf8 = "", udf9 = "", udf10 = "",
  debug = false
}) {
  // Normalize everything exactly as you will POST it
  const payload = {
    key: clean(key),
    txnid: clean(txnid),
    amount: amt2(amount),
    productinfo: clean(productinfo),
    firstname: clean(firstname),
    email: clean(email),
    phone: clean(phone),
    surl: clean(surl),
    furl: clean(furl),
    udf1: clean(udf1), udf2: clean(udf2), udf3: clean(udf3), udf4: clean(udf4), udf5: clean(udf5),
    udf6: clean(udf6), udf7: clean(udf7), udf8: clean(udf8), udf9: clean(udf9), udf10: clean(udf10),
    salt // keep as provided
  };

  const hash = await generateRequestHash({ ...payload, debug });
  

  const action = `${baseUrl}/_payment`;
  const params = {
    key: payload.key,
    txnid: payload.txnid,
    amount: payload.amount,
    productinfo: payload.productinfo,
    firstname: payload.firstname,
    email: payload.email,
    phone: payload.phone,
    surl: payload.surl,
    furl: payload.furl,
    udf1: payload.udf1,
    udf2: payload.udf2,
    udf3: payload.udf3,
    udf4: payload.udf4,
    udf5: payload.udf5,
    udf6: payload.udf6,
    udf7: payload.udf7,
    udf8: payload.udf8,
    udf9: payload.udf9,
    udf10: payload.udf10,
    hash
  };

  return { action, params, hash };
}

// --- Txn id helper -----------------------------------------------------------
export function makeTxnId(prefix = "SH") {
  const now36  = Date.now().toString(36);
  const rand36 = Math.floor(Math.random() * 1e6).toString(36);
  return `${prefix}${now36}${rand36}`.slice(0, 24);
}

// --- RESPONSE HASH (PayU -> merchant) ---------------------------------------
/**
 * Common response verification pattern:
 * SALT|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 * (PayU docs sometimes omit labeling, but the 10 UDF slots are there.)
 */
export async function computeResponseHash({
  salt,
  status,
  key,
  txnid,
  amount,
  productinfo,
  firstname,
  email,
  udf1 = "", udf2 = "", udf3 = "", udf4 = "", udf5 = "",
  udf6 = "", udf7 = "", udf8 = "", udf9 = "", udf10 = ""
}) {
  const seq = [
    salt,
    clean(status),
    clean(udf10), clean(udf9), clean(udf8), clean(udf7), clean(udf6),
    clean(udf5), clean(udf4), clean(udf3), clean(udf2), clean(udf1),
    clean(email),
    clean(firstname),
    clean(productinfo),
    amt2(amount),
    clean(txnid),
    clean(key)
  ].join("|");

  return sha512Hex(seq);
}
