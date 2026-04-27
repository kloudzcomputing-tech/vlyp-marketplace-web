<script>
    import ProductCard from "./ProductCard.svelte";
    let { filters, products } = $props();
</script>

<div class="flex">
    <aside
        class="w-64 border-r border-gray-100 bg-white sticky top-0 h-screen overflow-y-auto"
    >
        <div class="p-6 space-y-8">
            {#each filters ?? [] as filter}
                <div class="space-y-3">
                    <h3
                        class="text-sm font-medium text-gray-900 uppercase tracking-wide"
                    >
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
                        <div class="space-y-2">
                            {#each filter.options ?? [] as option}
                                <label
                                    class="flex items-center gap-2 cursor-pointer group"
                                >
                                    <input
                                        type="checkbox"
                                        name={filter.name}
                                        value={option}
                                        class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer"
                                    />
                                    <span
                                        class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors"
                                    >
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

    <!-- Products Grid -->
    <main class="flex-1">
        <div class="p-8">
            <div class="mb-6">
                <h1 class="text-2xl font-light text-gray-900">
                    Products
                </h1>
                {#if products}
                    <p class="text-sm text-gray-500 mt-1">
                        {products.length}
                        {products.length === 1 ? "item" : "items"}
                    </p>
                {/if}
            </div>

            {#if products && products.length > 0}
                <div
                    class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                >
                    {#each products as item}
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