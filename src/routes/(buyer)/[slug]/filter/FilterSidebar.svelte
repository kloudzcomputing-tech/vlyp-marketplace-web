<script>
    import { page } from "$app/stores";
    import { X, RotateCcw } from "@lucide/svelte";

    let {
        categories = [],
        price_range,
        filterable_attributes = [],
        filtersOpen = $bindable(false),
        clearFilters = () => {},
        activeFilterCount = 0,
        // bound from parent
        selectedSort,
        selectedCategories,
        minPrice,
        maxPrice,
    } = $props();

    let t = Object.fromEntries($page.url.searchParams);
    let filters = $state(
        filterable_attributes.map((fa) => {
            return { label: fa.label, values: t[fa.label]?.split(",").filter(p=>p !== "") ?? [] };
        }),
    );

    const SORT_OPTIONS = [
        "Relevance",
        "New Arrival",
        "Price: Low to High",
        "Price: High to Low",
    ];

    const priceRange = $derived({
        min: price_range?.min_selling_price ?? 0,
        max: price_range?.max_selling_price ?? 1000,
        range:
            (price_range?.max_selling_price ?? 1000) -
            (price_range?.min_selling_price ?? 0),
    });

    const minPos = $derived(
        priceRange.range
            ? ((minPrice - priceRange.min) / priceRange.range) * 100
            : 0,
    );

    const maxPos = $derived(
        priceRange.range
            ? ((maxPrice - priceRange.min) / priceRange.range) * 100
            : 100,
    );

    function toggleCategory(id) {
        const next = new Set(selectedCategories);
        next.has(id) ? next.delete(id) : next.add(id);
        selectedCategories = next;
    }

    function onMin(e) {
        minPrice = Math.min(+e.target.value, maxPrice);
    }

    function onMax(e) {
        maxPrice = Math.max(+e.target.value, minPrice);
    }

    $effect(() => {
        let found_filters = filters.filter((f) => f.values.length > 0);
        const url = new URL(window.location.href);
        found_filters.forEach((f) => {
            url.searchParams.set(f.label, f.values.join(","));
        });
        // location.href = url.toString();
    });
</script>

<aside class="h-full bg-white">
    <div class="p-4 space-y-8 h-full overflow-y-auto">
        <!-- Mobile Header -->
        <div
            class="flex items-center justify-between lg:hidden pb-5 border-b border-gray-200"
        >
            <div>
                <h2 class="text-xl font-bold text-gray-900">Filters</h2>
                {#if activeFilterCount > 0}
                    <p class="text-xs text-gray-500 mt-0.5">
                        {activeFilterCount}
                        {activeFilterCount === 1 ? "filter" : "filters"} active
                    </p>
                {/if}
            </div>
            <button
                type="button"
                onclick={() => {
                    if (typeof filtersOpen !== "undefined") {
                        filtersOpen = false;
                    }
                }}
                class="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200 rounded-lg hover:bg-gray-100"
                aria-label="Close filters"
            >
                <X class="w-5 h-5" />
            </button>
        </div>

        <!-- Desktop Header -->
        <div class="hidden lg:block pb-2 border-b border-gray-200">
            <h2 class="text-xl font-bold text-gray-900">Filters</h2>
            {#if activeFilterCount > 0}
                <p class="text-xs text-gray-500 mt-1">
                    {activeFilterCount}
                    {activeFilterCount === 1 ? "filter" : "filters"} active
                </p>
            {/if}
        </div>

        <!-- Clear Filters Button -->
        {#if activeFilterCount > 0}
            <button
                type="button"
                onclick={clearFilters}
                class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
            >
                <RotateCcw class="w-4 h-4" />
                Clear All Filters
            </button>
        {/if}

        <!-- Sort -->
        <div class="space-y-3">
            <p
                class="block text-sm font-semibold text-gray-900 uppercase tracking-wide"
            >
                Sort by
            </p>
            <select
                bind:value={selectedSort}
                class="w-full px-4 py-3 text-sm font-medium text-gray-900 bg-white border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-color)] focus:border-transparent transition-all duration-200 cursor-pointer hover:border-gray-300"
            >
                {#each SORT_OPTIONS as opt}
                    <option value={opt}>{opt}</option>
                {/each}
            </select>
        </div>

        <!-- Categories -->
        {#if categories.length}
            <div class="space-y-4">
                <p
                    class="block text-sm font-semibold text-gray-900 uppercase tracking-wide"
                >
                    Categories
                </p>
                <div class="space-y-2 overflow-y-auto pr-2 custom-scrollbar">
                    {#each categories as c (c.id)}
                        <label
                            class="flex items-center gap-3 cursor-pointer group rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategories.has(c.id)}
                                onchange={() => toggleCategory(c.id)}
                                class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0 cursor-pointer transition-all duration-200"
                            />
                            <span
                                class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                            >
                                {c.name}
                            </span>
                            {#if selectedCategories.has(c.id)}
                                <span
                                    class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                ></span>
                            {/if}
                        </label>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Price Range -->
        {#if price_range}
            <div class="space-y-4">
                <p
                    class="block text-sm font-semibold text-gray-900 uppercase tracking-wide"
                >
                    Price Range
                </p>

                <div class="space-y-4">
                    <!-- Price Display -->
                    <div class="flex items-center justify-between px-1">
                        <div class="flex flex-col">
                            <span
                                class="text-xs text-gray-500 uppercase tracking-wide"
                                >Min</span
                            >
                            <span class="text-sm font-medium text-gray-900 mt-1"
                                >₹{Math.round(minPrice)}</span
                            >
                        </div>
                        <div class="w-8 h-px bg-gray-300"></div>
                        <div class="flex flex-col items-end">
                            <span
                                class="text-xs text-gray-500 uppercase tracking-wide"
                                >Max</span
                            >
                            <span class="text-sm font-medium text-gray-900 mt-1"
                                >₹{Math.round(maxPrice)}</span
                            >
                        </div>
                    </div>

                    <!-- Range Slider -->
                    <div class="relative h-12 px-2">
                        <!-- Track -->
                        <div
                            class="absolute top-1/2 left-2 right-2 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"
                        ></div>

                        <!-- Active Range -->
                        <div
                            class="absolute top-1/2 h-2 bg-[var(--primary-color)] rounded-full transform -translate-y-1/2 transition-all duration-200"
                            style="left: {minPos}%; width: {maxPos - minPos}%;"
                        ></div>

                        <!-- Min Slider -->
                        <input
                            type="range"
                            min={priceRange.min}
                            max={priceRange.max}
                            value={minPrice}
                            oninput={onMin}
                            class="absolute top-1/2 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-10"
                            style="background: transparent;"
                        />

                        <!-- Max Slider -->
                        <input
                            type="range"
                            min={priceRange.min}
                            max={priceRange.max}
                            value={maxPrice}
                            oninput={onMax}
                            class="absolute top-1/2 left-0 w-full h-2 bg-transparent appearance-none cursor-pointer transform -translate-y-1/2 z-10"
                            style="background: transparent;"
                        />
                    </div>
                </div>
            </div>
        {/if}

        {#if filterable_attributes.length > 0}
            <div class="space-y-6">
                {#each filterable_attributes as fa}
                    <div class="space-y-2">
                        <p
                            class="block text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                            {fa.label}
                        </p>
                        <div
                            class="space-y-2 overflow-y-auto pr-2 custom-scrollbar"
                        >
                            {#each JSON.parse(fa.attribute_values) as attr}
                                <label
                                    class="flex items-center gap-3 cursor-pointer group rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        name={fa.label}
                                        checked={filters
                                            .find((f) => f.label === fa.label)
                                            ?.values.includes(attr) ?? false}
                                        onchange={(e) => {
                                            let checked = e.target.checked;
                                            let label_values =
                                                filters.find(
                                                    (f) => f.label === fa.label,
                                                )?.values ?? [];
                                            if (checked) {
                                                label_values = [
                                                    ...label_values,
                                                    attr,
                                                ];
                                            } else {
                                                label_values =
                                                    label_values.filter(
                                                        (v) => v !== attr,
                                                    );
                                            }

                                            filters = filters.map((f) =>
                                                f.label === fa.label
                                                    ? {
                                                          ...f,
                                                          values: label_values,
                                                      }
                                                    : f,
                                            );

                                            
                                            const url = new URL(
                                                window.location.href,
                                            );
                                            filters.forEach((f) => {
                                                url.searchParams.set(
                                                    f.label,
                                                    f.values.join(","),
                                                );
                                            });
                                            location.href = url.toString();
                                        }}
                                        class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-2 focus:ring-[var(--primary-color)] focus:ring-offset-0 cursor-pointer transition-all duration-200"
                                    />
                                    <span
                                        class="text-xs text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                                    >
                                        {attr}
                                    </span>
                                </label>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    </div>
</aside>

<style>
    /* Custom Scrollbar */
    :global(.custom-scrollbar) {
        scrollbar-width: thin;
        scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
    }

    :global(.custom-scrollbar::-webkit-scrollbar) {
        width: 6px;
    }

    :global(.custom-scrollbar::-webkit-scrollbar-track) {
        background: transparent;
    }

    :global(.custom-scrollbar::-webkit-scrollbar-thumb) {
        background-color: rgba(156, 163, 175, 0.5);
        border-radius: 3px;
    }

    :global(.custom-scrollbar::-webkit-scrollbar-thumb:hover) {
        background-color: rgba(156, 163, 175, 0.7);
    }

    /* Range Input Styling */
    input[type="range"] {
        -webkit-appearance: none;
        appearance: none;
    }

    input[type="range"]::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    input[type="range"]::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        border: 3px solid white;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        transition: all 0.2s ease;
    }

    input[type="range"]::-moz-range-thumb:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
</style>
