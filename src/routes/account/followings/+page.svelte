<script>
    let { data } = $props();
    let followings = data?.followings ?? [];
</script>

<div class="space-y-4 sm:space-y-6 p-2 sm:p-6">
    <!-- Header -->
    <div>
        <h1 class="text-2xl font-light text-gray-900">Followings</h1>
        <p class="text-sm text-gray-500 mt-1">
            {followings.length} {followings.length === 1 ? 'seller' : 'sellers'} you follow
        </p>
    </div>

    <!-- Followings List -->
    <div class="space-y-4">
        {#each followings as vendor}
            <a
                href={`/${vendor.slug}?vid=${vendor.id}`}
                class="block border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
            >
                <div class="flex items-center gap-4">
                    <!-- Logo -->
                    <div class="w-10 h-10 sm:w-16 sm:h-16 flex-shrink-0 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                        {#if vendor.logo_url}
                            <img
                                src={vendor.logo_url}
                                alt={vendor.display_name}
                                class="w-full h-full object-cover"
                            />
                        {:else}
                            <span class="text-xl sm:text-2xl font-medium text-gray-400">
                                {vendor.display_name.charAt(0).toUpperCase()}
                            </span>
                        {/if}
                    </div>

                    <!-- Vendor Info -->
                    <div class="flex-1 min-w-0">
                        <h3 class="text-sm sm:text-lg font-medium text-gray-900 truncate">
                            {vendor.display_name}
                        </h3>

                        <div class="flex items-center gap-4 text-xs sm:text-sm text-gray-600 mt-1">
                            <div class="flex items-center gap-1">
                                <span class="font-medium">{vendor.avg_rating}</span>
                                <span>⭐</span>
                            </div>
                            <span>({vendor.rating_count} reviews)</span>
                        </div>
                    </div>

                    <!-- Arrow -->
                    <svg
                        class="w-5 h-5 text-gray-400 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </a>
        {/each}
    </div>

    <!-- Empty State -->
    {#if followings.length === 0}
        <div class="text-center py-12">
            <p class="text-gray-500">You're not following any sellers yet</p>
        </div>
    {/if}
</div>
