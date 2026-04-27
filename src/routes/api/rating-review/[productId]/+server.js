import { connect_service } from "$lib/helpers/helper.js";
import { json } from "@sveltejs/kit";

/**
 * POST /api/rating-review/[productId]
 */
export const POST = async ({ request, params, platform }) => {
    try {
        const { productId } = params;

        // Read incoming multipart form
        const incomingFormData = await request.formData();

        // Create new FormData for backend
        const backendForm = new FormData();

        // Copy all fields safely
        for (const [key, value] of incomingFormData.entries()) {
            backendForm.append(key, value);
        }

        // Call backend API
        const res = await connect_service(platform,
            `${platform.env.BASE_URL}/rating-review/${productId}`,
            {
                method: "POST",
                body: backendForm,
            }
        );

        const data = await res.json();

        return json(data, { status: res.status });
    } catch (err) {
        console.error("Rating review error:", err);

        return json(
            {
                status: false,
                message: "Failed to submit rating & review",
            },
            { status: 500 }
        );
    }
};
