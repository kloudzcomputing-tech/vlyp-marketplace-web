<script>
    import { goto } from "$app/navigation";
    import { addToCart } from "$lib/stores/cart";

    let { data } = $props();
    let wishlists = data?.wishlists;
    let selectedWishlist = $state(null);

    function removeFromWishlist(wishlistId, productId) {
        // Handle remove from wishlist
        
    }

    function deleteWishlist(wishlistId) {
        // Handle delete wishlist
        
    }
</script>

<div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-light text-gray-900">Wishlists</h1>
            <p class="text-sm text-gray-500 mt-1">
                {wishlists?.length || 0} {wishlists?.length === 1 ? 'wishlist' : 'wishlists'}
            </p>
        </div>
        <button
            class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
            Create Wishlist
        </button>
    </div>

    <!-- Wishlists -->
    {#if wishlists && wishlists.length > 0}
        <div class="space-y-6">
            {#each wishlists as wishlist}
                <div class="border border-gray-200 rounded-lg p-6 space-y-4">
                    <!-- Wishlist Header -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <h2 class="text-lg font-medium text-gray-900">
                                {wishlist.name}
                            </h2>
                            {#if wishlist.is_default}
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white">
                                    Default
                                </span>
                            {/if}
                            <span class="text-sm text-gray-500">
                                {wishlist.product_count} {wishlist.product_count === 1 ? 'item' : 'items'}
                            </span>
                        </div>
                        <div class="flex items-center gap-2">
                            <button
                                class="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                Rename
                            </button>
                            {#if !wishlist.is_default}
                                <button
                                    onclick={() => deleteWishlist(wishlist.id)}
                                    class="text-xs text-red-600 hover:text-red-700 transition-colors"
                                >
                                    Delete
                                </button>
                            {/if}
                        </div>
                    </div>

                    <!-- Products Grid -->
                    {#if wishlist.products && wishlist.products.length > 0}
                        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {#each wishlist.products as product}
                                <div class="group relative">
                                    <a
                                        href={`/items/${product.id}`}
                                        class="block space-y-3"
                                    >
                                        <!-- Product Image -->
                                        <div class="aspect-square overflow-hidden rounded-lg bg-gray-50 relative">
                                            <img
                                                src={product.thumbnail}
                                                alt={product.name}
                                                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <!-- Remove Button -->
                                            <button
                                                onclick={(e) => {
                                                    e.preventDefault();
                                                    removeFromWishlist(wishlist.id, product.id);
                                                }}
                                                class="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                                                title="Remove from wishlist"
                                            >
                                                <svg
                                                    class="w-4 h-4 text-gray-600"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        <!-- Product Info -->
                                        <div class="space-y-1">
                                            <h3 class="text-sm text-gray-900 font-normal line-clamp-2 group-hover:text-gray-700 transition-colors">
                                                {product.name}
                                            </h3>
                                            <div class="flex items-baseline gap-2">
                                                <span class="text-base font-light text-gray-900">
                                                    ₹{product.selling_price}
                                                </span>
                                                {#if product.original_price && product.original_price > product.selling_price}
                                                    <span class="text-sm text-gray-400 line-through">
                                                        ₹{product.original_price}
                                                    </span>
                                                {/if}
                                            </div>
                                            {#if product.rating}
                                                <div class="flex items-center gap-1.5 pt-1">
                                                    <span class="text-xs text-gray-600">
                                                        {product.rating} ⭐
                                                    </span>
                                                    {#if product.reviews}
                                                        <span class="text-xs text-gray-400">
                                                            ({product.reviews})
                                                        </span>
                                                    {/if}
                                                </div>
                                            {/if}
                                        </div>
                                    </a>

                                    <!-- Quick Add to Cart -->
                                    <button
                                        onclick={(e) => {
                                            e.preventDefault();
                                            addToCart(product);
                                        }}
                                        class="w-full mt-2 px-3 py-2 text-xs font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <div class="text-center py-8 text-gray-500">
                            <p class="text-sm">This wishlist is empty</p>
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/if}

    <!-- Empty State -->
    {#if !wishlists || wishlists.length === 0}
        <div class="text-center py-12 border border-gray-200 rounded-lg">
            <p class="text-gray-500 mb-4">No wishlists yet</p>
            <button
                class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Create Your First Wishlist
            </button>
        </div>
    {/if}
</div>
