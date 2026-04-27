// import { json } from "@sveltejs/kit";
// import { jwtVerify } from "jose";

// export const randomAlphaNum = (size) => {
//     const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     const arr = new Uint8Array(size);
//     crypto.getRandomValues(arr);
//     return Array.from(arr, n => chars[n % chars.length]).join('');
// }

// export const verifyJwtToken = async (request, platform) => {
//     try {
//     const authHeader = request.headers.get("Authorization");
//     if (!authHeader) {
//         return json({ success: false, message: "Authorization header required" }, { status: 401 });
//     }

//     const [type, tokenValue] = authHeader.split(" ");
//     if (type !== "Bearer" || !tokenValue) {
//         return json({ success: false, message: "Invalid token format" }, { status: 401 });
//     }

//     const secret = new TextEncoder().encode(platform.env.JWT_SECRET);
//     const { payload } = await jwtVerify(tokenValue, secret);

//     return payload;
//     } catch (error) {
//         console.error("Token verification error:", error);
//         return json({ success: false, message: "Invalid token" }, { status: 401 });
//     }
// }

// export function formatCurrency(amount) {
//     if (!amount) return '₹0';
//     return new Intl.NumberFormat('en-IN', {
//         style: 'currency',
//         currency: 'INR',
//         maximumFractionDigits: 0
//     }).format(amount);
// }

export const connect_service = async (platform, ...request) => {
    console.log("connect_service called with platform:", platform.env.enviroment);
    
    if (platform.env.enviroment == "production") {
        const service = await platform.env.CARTLY_WORKER_V2.fetch(...request);
        return service;
    }
    const service = await fetch(...request);
    return service;
}