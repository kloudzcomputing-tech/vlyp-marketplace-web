<script>
    let { data } = $props();
    let reviews = data?.reviews;
</script>

<div class="space-y-6 sm:p-6 sm:pb-6">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-light text-gray-900">Reviews and Ratings</h1>
        <p class="text-sm text-gray-500 mt-1">
            {reviews?.length || 0} {reviews?.length === 1 ? 'review' : 'reviews'} written
        </p>
    </div>

    <!-- Reviews List -->
    <div class="space-y-4">
        {#each reviews as review}
            <div class="border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors">
                <div class="space-y-4">
                    <!-- Product Name -->
                    <div>
                        <h3 class="text-sm font-medium text-gray-900">
                            {review.product_name}
                        </h3>
                    </div>

                    <!-- Rating & Date -->
                    <div class="flex items-center gap-4">
                        <div class="flex items-center gap-1.5">
                            <span class="text-sm font-medium text-gray-900">
                                {review.rating}
                            </span>
                            <span class="text-sm text-gray-400">⭐</span>
                        </div>
                        <span class="text-xs text-gray-500">
                            Reviewed on {review.date}
                        </span>
                    </div>

                    <!-- Review Text -->
                    {#if review.review}
                        <div class="pt-2 border-t border-gray-100">
                            <p class="text-sm text-gray-700 leading-relaxed">
                                {review.review}
                            </p>
                        </div>
                    {/if}

                    <!-- Actions -->
                    <div class="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button
                            class="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Edit
                        </button>
                        <button
                            class="text-xs text-red-600 hover:text-red-700 transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Empty State -->
    {#if !reviews || reviews.length === 0}
        <div class="text-center py-12 border border-gray-200 rounded-lg">
            <p class="text-gray-500">You haven't written any reviews yet</p>
        </div>
    {/if}
</div>
