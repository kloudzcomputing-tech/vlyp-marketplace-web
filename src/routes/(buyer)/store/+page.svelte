<script>
    import ProductCard from '$lib/components/ProductCard.svelte';

    let { data } = $props();
    let store = data?.store;
    let filters = data?.filters;
    let products = data?.products;
    let filtersOpen = $state(false);
</script>

<div class="min-h-screen bg-white">
    <div class="flex flex-col lg:flex-row">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h1 class="text-lg font-light text-gray-900">
                Products
            </h1>
            <button
                onclick={() => (filtersOpen = !filtersOpen)}
                class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                <svg
                    class="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                </svg>
                Filters
            </button>
        </div>

        <!-- Sidebar Filters -->
        <aside
            class="p-4 shadow-sm fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-80 lg:w-64 h-full lg:h-screen bg-white border-r border-gray-100 transform transition-transform duration-300 ease-in-out {filtersOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'} overflow-y-auto"
        >
        
            <div>
                <!-- Mobile Close Button -->
                <div class="flex items-center justify-between lg:hidden pb-4 border-b border-gray-200">
                    <h2 class="text-lg font-medium text-gray-900">Filters</h2>
                    <button
                        onclick={() => (filtersOpen = false)}
                        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close filters"
                    >
                        <svg
                            class="w-5 h-5"
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

                {#each data?.filters ?? [] as filter}
                    <div class="space-y-3">
                        <h3 class="text-sm font-medium text-gray-900 uppercase tracking-wide">
                            {filter.name}
                        </h3>
                        {#if filter.type === "dropdown"}
                            <select
                                class="w-full px-3 py-2 text-sm border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
                            >
                                {#each filter.options ?? [] as option}
                                    <option value={option}>{option}</option>
                                {/each}
                            </select>
                        {/if}
                        {#if filter.type === "select"}
                            <div class="space-y-2 max-h-48 overflow-y-auto">
                                {#each filter.options ?? [] as option}
                                    <label class="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name={filter.name}
                                            value={option}
                                            class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer"
                                        />
                                        <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            {option}
                                        </span>
                                    </label>
                                {/each}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        </aside>

        <!-- Mobile Overlay -->
        {#if filtersOpen}
            <button
                type="button"
                class="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onclick={() => (filtersOpen = false)}
                aria-label="Close filters overlay"
            ></button>
        {/if}

        <!-- Products Grid -->
        <main class="flex-1 w-full">
            <div class="p-4 sm:p-6 lg:p-8">
                <!-- Desktop Header -->
                <div class="hidden lg:block mb-6">
                    <h1 class="text-2xl font-light text-gray-900">
                        Products
                    </h1>
                    {#if data?.products}
                        <p class="text-sm text-gray-500 mt-1">
                            {data.products.length} {data.products.length === 1 ? 'item' : 'items'}
                        </p>
                    {/if}
                </div>

                <!-- Mobile Product Count -->
                {#if data?.products}
                    <div class="lg:hidden mb-4">
                        <p class="text-sm text-gray-500">
                            {data.products.length} {data.products.length === 1 ? 'item' : 'items'}
                        </p>
                    </div>
                {/if}

                {#if data?.products && data.products.length > 0}
                    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                        {#each data.products as item}
                            <ProductCard {item} />
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-16">
                        <p class="text-gray-500">No products found</p>
                    </div>
                {/if}
            </div>
        </main>
    </div>
</div>
