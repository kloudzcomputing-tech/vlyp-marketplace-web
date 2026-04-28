<script>
    import { CameraIcon } from "@lucide/svelte";
    import { StarRating } from "@dev-ekkx/svelte-star-rating";

    let { open, onClose, onRatingAdded, product } = $props();

    let isLoading = $state(false);
    let rating = $state(0);
    let review = $state("");
    let error = $state("");
    let images = $state([]);

    const config = {
        readonly: false,
        maxVal: 5,
        minVal: 0,
        step: 0.5,
        numOfStars: 5,
        starConfig: {
            size: 26,
            filledColor: "#FC8019",
            unfilledColor: "#0002",
        },
    };

    const resetState = () => {
        rating = 0;
        review = "";
        images = [];
        error = "";
    };

    const handleImageChange = (e) => {
        error = "";
        const files = Array.from(e.target.files || []);

        if (images.length + files.length > 5) {
            error = "You can upload maximum 5 images";
            return;
        }

        images = [...images, ...files];
        e.target.value = ""; // allow re-select same file
    };

    const removeImage = (index) => {
        images = images.filter((_, i) => i !== index);
    };

    const validate = () => {
        if (!rating || rating <= 0) {
            error = "Please give a rating";
            return false;
        }

        if (!review || review.trim().length < 10) {
            error = "Review must be at least 10 characters";
            return false;
        }

        return true;
    };

    const handleSaveReview = async (e) => {
        e.preventDefault();
        error = "";

        if (!validate()) return;

        isLoading = true;

        try {
            const formData = new FormData();
            formData.append("product_id", product.id);
            formData.append("rating", rating * 10);
            formData.append("review", review);

            if (images.length > 0) {
                formData.append("has_images", "1");
                images.forEach((img) => {
                    formData.append("images", img);
                });
            } else {
                formData.append("has_images", "0");
            }

            const res = await fetch(`/api/rating-review/${product.id}`, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok || !data?.status) {
                throw new Error(data?.message || "Failed to submit review");
            }

            onRatingAdded();
            resetState();
            onClose();
        } catch (err) {
            error = err.message;
        } finally {
            isLoading = false;
        }
    };
</script>

{#if open}
<div class="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
    <!-- Overlay -->
    <div
        class="absolute inset-0 bg-black/50"
        onclick={() => {
            resetState();
            onClose();
        }}
    ></div>

    <!-- Modal -->
    <div
        class="bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
               w-full h-full md:w-[60%] md:h-[90%] p-6 overflow-y-auto"
    >
        <h2 class="text-xl font-bold text-center mb-6">
            Rate & Review Product
        </h2>

        <!-- Product -->
        <div class="border border-gray-200 p-4 mb-4 flex gap-4">
            <img
                src={product?.image_url}
                alt={product?.title}
                class="w-20 h-20 object-cover bg-gray-100"
            />
            <p class="text-sm text-gray-800">{product?.title}</p>
        </div>

        <!-- Rating -->
        <div class="border border-gray-200 p-4 mb-4 flex justify-between items-center">
            <p class="text-sm font-medium">Rate the product</p>
            <StarRating {config} bind:value={rating} />
        </div>

        <!-- Image Upload -->
        <div class="mb-4">
            <label
                for="review-image"
                class="cursor-pointer inline-flex items-center gap-3"
            >
                <div class="w-14 h-14 bg-gray-100 flex items-center justify-center">
                    <CameraIcon size={20} />
                </div>
                <span class="text-sm text-gray-600">
                    Add images (optional)
                </span>
            </label>

            <input
                id="review-image"
                hidden
                type="file"
                accept="image/*"
                multiple
                disabled={images.length >= 5}
                onchange={handleImageChange}
            />

            <!-- Image previews -->
            {#if images.length}
                <div class="mt-3 grid grid-cols-5 gap-3">
                    {#each images as img, index}
                        <div class="relative group border border-gray-200">
                            <img
                                src={URL.createObjectURL(img)}
                                alt="Review image"
                                class="w-full h-20 object-cover"
                            />
                            <button
                                type="button"
                                onclick={() => removeImage(index)}
                                class="absolute top-1 right-1 w-5 h-5
                                       bg-black/70 text-white text-xs
                                       flex items-center justify-center
                                       opacity-0 group-hover:opacity-100 transition"
                            >
                                ✕
                            </button>
                        </div>
                    {/each}
                </div>
            {/if}
        </div>

        <!-- Review -->
        <div class="mb-6">
            <p class="text-sm mb-1">Review</p>
            <textarea
                class="w-full h-32 border border-gray-300 p-3 text-sm focus:border-gray-500"
                bind:value={review}
                placeholder="Write your review here..."
            ></textarea>
        </div>

        <!-- Error -->
        {#if error}
            <p class="text-red-500 text-sm text-center mb-4">{error}</p>
        {/if}

        <!-- Actions -->
        <div class="flex justify-end gap-3">
            <button
                class="px-5 py-2 text-xs border border-gray-400"
                onclick={() => {
                    resetState();
                    onClose();
                }}
            >
                Cancel
            </button>

            <button
                disabled={isLoading}
                onclick={handleSaveReview}
                class="px-5 py-2 text-xs text-white
                {isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--primary-color)]'}"
            >
                {isLoading ? "Submitting..." : "Submit"}
            </button>
        </div>
    </div>
</div>
{/if}
