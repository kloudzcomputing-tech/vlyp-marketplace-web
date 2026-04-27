<script>
    import { onMount } from 'svelte';
    import ProductCard from "$lib/components/ProductCard.svelte";
    
    let { data } = $props();
    let collection_name = data?.collection_name;
    let products = data?.products;
    let categories = data?.categories;
    let price_range = data?.price_range;
    
    let minPrice = $state(price_range?.min_selling_price || 0);
    let maxPrice = $state(price_range?.max_selling_price || 1000);
    let selectedSort = $state("Relevance");
    let selectedCategories = $state(new Set());
    let filtersOpen = $state(false);
    let mounted = $state(false);
    
    const SORT_OPTIONS = [
        "Relevance",
        "New Arrival",
        "Price: Low to High",
        "Price: High to Low",
        "Best Sellers",
        "Most Popular",
        "Most Rated",
        "Most Reviewed",
        "Most Viewed",
    ];

    // Optimize price range calculations with derived values
    const priceRange = $derived({
        min: price_range?.min_selling_price || 0,
        max: price_range?.max_selling_price || 1000,
        range: (price_range?.max_selling_price || 1000) - (price_range?.min_selling_price || 0)
    });

    // Calculate slider positions (memoized)
    const minPosition = $derived(
        priceRange.range > 0 
            ? ((minPrice - priceRange.min) / priceRange.range) * 100 
            : 0
    );
    
    const maxPosition = $derived(
        priceRange.range > 0 
            ? ((maxPrice - priceRange.min) / priceRange.range) * 100 
            : 100
    );
    
    const sliderWidth = $derived(maxPosition - minPosition);

    // Optimize price validation
    $effect(() => {
        if (minPrice > maxPrice) {
            minPrice = maxPrice;
        }
        if (maxPrice < minPrice) {
            maxPrice = minPrice;
        }
        // Clamp values to valid range
        if (minPrice < priceRange.min) minPrice = priceRange.min;
        if (maxPrice > priceRange.max) maxPrice = priceRange.max;
    });

    onMount(() => {
        mounted = true;
    });

    function handleCategoryToggle(categoryId) {
        selectedCategories = new Set(selectedCategories);
        if (selectedCategories.has(categoryId)) {
            selectedCategories.delete(categoryId);
        } else {
            selectedCategories.add(categoryId);
        }
    }

    function handleMinPriceChange(e) {
        const value = Number(e.target.value);
        minPrice = Math.min(value, maxPrice);
    }

    function handleMaxPriceChange(e) {
        const value = Number(e.target.value);
        maxPrice = Math.max(value, minPrice);
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="flex flex-col lg:flex-row">
        <!-- Mobile Filter Button -->
        <div class="lg:hidden px-4 py-4 border-b border-gray-100 flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-30 shadow-sm">
            <h1 class="text-lg font-light text-gray-900 tracking-tight">
                {collection_name || 'Products'}
            </h1>
            <button
                onclick={() => (filtersOpen = !filtersOpen)}
                class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow"
            >
                <svg
                    class="w-4 h-4 transition-transform duration-200 {filtersOpen ? 'rotate-180' : ''}"
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
            class="fixed lg:sticky top-0 left-0 z-50 lg:z-auto w-80 lg:w-72 h-full lg:h-screen bg-white/95 lg:bg-white backdrop-blur-sm lg:backdrop-blur-none border-r border-gray-100 transform transition-all duration-300 ease-out {filtersOpen
                ? 'translate-x-0 shadow-xl lg:shadow-none'
                : '-translate-x-full lg:translate-x-0'} lg:overflow-y-auto overflow-y-auto"
        >
            <div class="p-5 sm:p-6 lg:p-8 space-y-8">
                <!-- Mobile Close Button -->
                <div class="flex items-center justify-between lg:hidden pb-5 border-b border-gray-100">
                    <h2 class="text-lg font-light text-gray-900 tracking-tight">Filters</h2>
                    <button
                        onclick={() => (filtersOpen = false)}
                        class="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-50"
                        aria-label="Close filters"
                    >
                        <svg
                            class="w-5 h-5 transition-transform duration-200 hover:rotate-90"
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

                <!-- Sort -->
                <div class="space-y-3 animate-fade-in" style="animation-delay: 0.1s;">
                    <label for="sort" class="block text-xs font-medium text-gray-900 uppercase tracking-wider">
                        Sort by
                    </label>
                    <select 
                        id="sort"
                        bind:value={selectedSort}
                        class="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow"
                    >
                        {#each SORT_OPTIONS as sort}
                            <option value={sort}>{sort}</option>
                        {/each}
                    </select>
                </div>

                <!-- Categories -->
                {#if categories && categories.length > 0}
                    <div class="space-y-3 animate-fade-in" style="animation-delay: 0.2s;">
                        <p class="text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Categories
                        </p>
                        <div class="space-y-2 ">
                            {#each categories as category, index (category.id)}
                                <label class="flex items-center gap-3 cursor-pointer group p-2 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.has(category.id)}
                                        onchange={() => handleCategoryToggle(category.id)}
                                        class="w-4 h-4 rounded border-gray-300 text-gray-900 focus:ring-2 focus:ring-gray-900 focus:ring-offset-0 cursor-pointer transition-all duration-200"
                                    />
                                    <span class="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-200">
                                        {category.name}
                                    </span>
                                </label>
                            {/each}
                        </div>
                    </div>
                {/if}

                <!-- Price Range -->
                {#if price_range}
                    <div class="space-y-4 animate-fade-in" style="animation-delay: 0.3s;">
                        <p class="text-xs font-medium text-gray-900 uppercase tracking-wider">
                            Price
                        </p>
                        <div class="flex items-center justify-between text-sm text-gray-600 font-medium">
                            <span>₹{priceRange.min}</span>
                            <span>₹{priceRange.max}</span>
                        </div>
                        
                        <!-- Price Slider -->
                        <div class="space-y-4">
                            <div class="relative h-8 flex items-center">
                                <!-- Track -->
                                <div class="absolute w-full h-1 bg-gray-200 rounded-full"></div>
                                
                                <!-- Active Range -->
                                <div
                                    class="absolute h-1 bg-gray-900 rounded-full transition-all duration-200"
                                    style="left: {minPosition}%; width: {sliderWidth}%;"
                                ></div>
                                
                                <!-- Min Thumb -->
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step={10}
                                    value={minPrice}
                                    oninput={handleMinPriceChange}
                                    class="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-20"
                                    style="pointer-events: auto;"
                                />
                                
                                <!-- Max Thumb -->
                                <input
                                    type="range"
                                    min={priceRange.min}
                                    max={priceRange.max}
                                    step={10}
                                    value={maxPrice}
                                    oninput={handleMaxPriceChange}
                                    class="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-20"
                                    style="pointer-events: auto;"
                                />
                                
                                <!-- Visual Thumbs -->
                                <div
                                    class="absolute w-5 h-5 bg-gray-900 rounded-full border-2 border-white shadow-lg pointer-events-none z-30 transition-all duration-200 hover:scale-110"
                                    style="left: calc({minPosition}% - 10px);"
                                ></div>
                                <div
                                    class="absolute w-5 h-5 bg-gray-900 rounded-full border-2 border-white shadow-lg pointer-events-none z-30 transition-all duration-200 hover:scale-110"
                                    style="left: calc({maxPosition}% - 10px);"
                                ></div>
                            </div>
                            
                            <div class="flex justify-between text-xs text-gray-600 font-medium">
                                <span>Min: ₹{minPrice}</span>
                                <span>Max: ₹{maxPrice}</span>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        </aside>

        <!-- Mobile Overlay -->
        {#if filtersOpen}
            <button
                type="button"
                class="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
                onclick={() => (filtersOpen = false)}
                aria-label="Close filters overlay"
            ></button>
        {/if}

        <!-- Products Grid -->
        <main class="flex-1 w-full">
            <div class="p-4 sm:p-6 lg:p-10">
                <!-- Desktop Header -->
                <div class="hidden lg:block mb-8 animate-fade-in-up">
                    <h1 class="text-3xl font-light text-gray-900 tracking-tight mb-2">
                        {collection_name || 'Products'}
                    </h1>
                    {#if products}
                        <p class="text-sm text-gray-500 font-light">
                            {products.length} {products.length === 1 ? 'item' : 'items'} available
                        </p>
                    {/if}
                </div>

                <!-- Mobile Product Count -->
                {#if products}
                    <div class="lg:hidden mb-5 animate-fade-in">
                        <p class="text-sm text-gray-500 font-light">
                            {products.length} {products.length === 1 ? 'item' : 'items'} available
                        </p>
                    </div>
                {/if}

                {#if products && products.length > 0}
                    <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 lg:gap-6">
                        {#each products as item, index (item.id)}
                            <div
                                class="animate-fade-in-up"
                                style="animation-delay: {index * 0.05}s; opacity: {mounted ? 1 : 0};"
                            >
                                <ProductCard from="store" {item} />
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="text-center py-20 animate-fade-in">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <p class="text-gray-500 font-light">No products found</p>
                    </div>
                {/if}
            </div>
        </main>
    </div>
</div>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
        opacity: 0;
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
        opacity: 0;
    }

  

    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
    }
    
    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #111827;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
    
    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        background: #111827;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        transition: all 0.2s ease;
    }

    input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    }
</style>
