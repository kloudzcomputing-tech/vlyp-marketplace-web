import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

export const POST = async ({ request, platform, cookies, params }) => {
    try {
        const token = cookies.get("customer_token");

        // 🔐 Get logged-in user from KV
        const users = await platform.env.VLYP_KV.get(`customer_${token}`);
        const user = users ? JSON.parse(users) : null;

        if (!user) {
            return json({ status: false, message: "User not found" }, { status: 401 });
        }

        // 📦 Get request body
        const body = await request.json();

        const reelId = params.reelsId; // ✅ TAKE FROM URL PARAM

        if (!reelId || !body.comment?.trim()) {
            return json(
                { status: false, message: "reelId and comment are required" },
                { status: 400 }
            );
        }

        const payload = {
            user_id: user.id,
            comment: body.comment,
        };

        // 🌐 Call backend service
        const response = await connect_service(
            platform,
            `${platform.env.BASE_URL}/reels/${reelId}/comment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    cookie: cookies.toString(),
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return json(
                { status: false, message: data?.message || "Comment failed" },
                { status: response.status }
            );
        }

        return json({
            status: true,
            message: "Comment added successfully",
            data,
        });
    } catch (error) {
        console.error("COMMENT API ERROR:", error);

        return json(
            { status: false, message: error.message || "Internal server error" },
            { status: 500 }
        );
    }
};

export const GET = async ({ platform, params, cookies }) => {
    try {
        const reelId = params.reelsId;

        if (!reelId) {
            return json(
                { status: false, message: "reelId is required" },
                { status: 400 }
            );
        }

        const apiUrl = `${platform.env.BASE_URL}/reels/${reelId}/comments`;

        const response = await connect_service(platform, apiUrl, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                cookie: cookies.toString(),
            },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return json(
                {
                    status: false,
                    message: data?.message || "Failed to fetch comments",
                },
                { status: response.status }
            );
        }

        return json({
            status: true,
            data: data?.data ?? null,
        });
    } catch (error) {
        console.error("❌ GET COMMENTS ERROR:", error);

        return json(
            {
                status: false,
                message: error?.message || "Internal server error",
            },
            { status: 500 }
        );
    }
};