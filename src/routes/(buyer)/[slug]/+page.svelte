<script>
    import "../../../app.css";
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { ChevronDown, Filter, X, RotateCcw, Star } from "@lucide/svelte";
    import MobileFilterSheet from "$lib/components/MobileFilterSheet.svelte";
    import ProductCard from "$lib/components/ProductCard.svelte";
    let mounted = false;
    onMount(() => {
        mounted = true;
    });

    let { data } = $props();

    // svelte-ignore state_referenced_locally
    let filter = data.filter;
    // svelte-ignore state_referenced_locally
    let products = data.products;
    // svelte-ignore state_referenced_locally
    let vendor_details = data.vendor_details;
    // svelte-ignore state_referenced_locally
        let customer = data?.user

    let categories = filter?.categories || [];
    let brands = filter?.brands;
    let discounts = filter?.discount;
    let sellers = filter?.sellers;
    let ratings = [
        {
            label: "3 Stars and above",
            value: "30",
        },
        {
            label: "4 Stars and above",
            value: "40",
        },
    ];
    let attributes = filter?.attributes;
    let a = {};
    let ao = {};

    attributes?.forEach((attribute) => {
        a[attribute.label] = [];
        ao[attribute.label] = true;
    });

    let selectedFilters = $state({
        Categories: [],
        Brands: [],
        Discounts: [],
        Sellers: [],
        Ratings: [],
        ...a,
    });
    let accordianOpen = $state({
        Categories: true,
        Discounts: true,
        Ratings: true,
        Brands: true,
        Sellers: true,
        ...ao,
    });
    let filtersOpen = $state(false);

    // Count active filters
    const activeFilterCount = $derived(() => {
        return Object.values(selectedFilters).reduce(
            (sum, arr) => sum + arr.length,
            0,
        );
    });

    function parseUrlParams() {
        const url = new URL(window.location.href);
        Object.entries(selectedFilters)?.forEach(([label, values]) => {
            if (values.length > 0) {
                url.searchParams.set(label, values.join(","));
            } else {
                url.searchParams.delete(label);
            }
        });
        // window.history.pushState({}, "", url.toString());
        location.href = url.toString();
    }

    function clearAllFilters() {
        Object.keys(selectedFilters)?.forEach((key) => {
            selectedFilters[key] = [];
        });
        parseUrlParams();
    }

    function toggleFilter(section, value, checked) {
        if (checked) {
            selectedFilters[section] = [...selectedFilters[section], value];
        } else {
            selectedFilters[section] = selectedFilters[section].filter(
                (v) => v !== value,
            );
        }
        parseUrlParams();
    }

    onMount(() => {
        $page.url.searchParams?.forEach((value, key) => {
            selectedFilters[key] = value.split(",");
        });
    });

    let isFollowing = $state(vendor_details?.follow_status === "FOLLOWING");

    let isLoading = $state(false);
    async function toggleFollow() {
        if (isLoading) return;

        isLoading = true;

        // optimistic UI
        isFollowing = !isFollowing;

        const customerId = customer.id;
        const vendorId = vendor_details.id;

        const url = isFollowing
            ? `https://cartly-worker-v2.sabui1999.workers.dev/api/follow/${customerId}/stores/${vendorId}`
            : `https://cartly-worker-v2.sabui1999.workers.dev/api/unfollow/${customerId}/stores/${vendorId}`;

        try {
            const res = await fetch(url, { method: "GET" });
            const json = await res.json();

            if (!json.success) {
                throw new Error(json.message);
            }

            // keep backend + UI in sync
            vendor_details.follow_status = isFollowing
                ? "FOLLOWING"
                : "NOT_FOLLOWING";
        } catch (err) {
            // rollback if API fails
            isFollowing = !isFollowing;
            console.error(err);
        } finally {
            isLoading = false;
        }
    }
</script>

<!-- Mobile Filter Bottom Sheet (Meesho-style) -->
<MobileFilterSheet
    bind:filtersOpen
    bind:selectedFilters
    {categories}
    {discounts}
    {sellers}
    {ratings}
    {attributes}
    onApply={parseUrlParams}
    onClear={clearAllFilters}
    {toggleFilter}
/>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="flex flex-col lg:flex-row">

        <!-- Filter Sidebar -->
        <aside
            class="hidden sm:block sm:sticky top-0 left-0 z-auto w-72 h-screen bg-white border-r border-gray-200 overflow-y-auto shadow-none"
        >
            <div
                class="p-6 lg:p-8 space-y-6 lg:space-y-8 h-full overflow-y-auto custom-scrollbar"
            >

                <!-- Clear Filters Button -->
                {#if activeFilterCount > 0}
                    <button
                        type="button"
                        onclick={clearAllFilters}
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200"
                    >
                        <RotateCcw class="w-4 h-4" />
                        Clear All Filters
                    </button>
                {/if}

                <!-- Categories -->
                <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between group"
                        onclick={() =>
                            (accordianOpen.Categories =
                                !accordianOpen.Categories)}
                    >
                        <h3
                            class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                            Categories
                        </h3>
                        <ChevronDown
                            class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen.Categories
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>

                    <div
                        class="space-y-2 transition-all duration-300 {accordianOpen.Categories
                            ? 'block'
                            : 'hidden'}"
                    >
                        {#each categories as category}
                            <label
                                class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id={category.id}
                                    name="Categories"
                                    onchange={(e) =>
                                        toggleFilter(
                                            "Categories",
                                            category.id,
                                            e.target.checked,
                                        )}
                                    checked={selectedFilters[
                                        "Categories"
                                    ].includes(category.id)}
                                    class="w-4 h-4 rounded-xl border-gray-300 text-[var(--primary-color)] focus:ring-none cursor-pointer transition-all duration-200"
                                />
                                <span
                                    class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                                >
                                    {category.name}
                                </span>
                                {#if selectedFilters["Categories"].includes(category.id)}
                                    <span
                                        class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                    ></span>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Discounts -->
                <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between group"
                        onclick={() =>
                            (accordianOpen.Discounts =
                                !accordianOpen.Discounts)}
                    >
                        <h3
                            class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                            Discounts
                        </h3>
                        <ChevronDown
                            class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen.Discounts
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>
                    <div
                        class="space-y-2 transition-all duration-300 {accordianOpen.Discounts
                            ? 'block'
                            : 'hidden'}"
                    >
                        {#each discounts as discount}
                            <label
                                class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id={discount}
                                    name="Discounts"
                                    onchange={(e) =>
                                        toggleFilter(
                                            "Discounts",
                                            discount,
                                            e.target.checked,
                                        )}
                                    checked={selectedFilters[
                                        "Discounts"
                                    ].includes(discount)}
                                    class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-none cursor-pointer transition-all duration-200"
                                />
                                <span
                                    class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                                >
                                    {discount}% Off
                                </span>
                                {#if selectedFilters["Discounts"].includes(discount)}
                                    <span
                                        class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                    ></span>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Ratings -->
                <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between group"
                        onclick={() =>
                            (accordianOpen.Ratings = !accordianOpen.Ratings)}
                    >
                        <h3
                            class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                            Ratings
                        </h3>
                        <ChevronDown
                            class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen.Ratings
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>
                    <div
                        class="space-y-2 transition-all duration-300 {accordianOpen.Ratings
                            ? 'block'
                            : 'hidden'}"
                    >
                        {#each ratings as rating}
                            <label
                                class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id={rating.value}
                                    name="Ratings"
                                    onchange={(e) =>
                                        toggleFilter(
                                            "Ratings",
                                            rating.value,
                                            e.target.checked,
                                        )}
                                    checked={selectedFilters[
                                        "Ratings"
                                    ].includes(rating.value)}
                                    class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-none cursor-pointer transition-all duration-200"
                                />
                                <span
                                    class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1 flex items-center gap-2"
                                >
                                    <Star
                                        class="w-4 h-4 text-yellow-400 fill-yellow-400"
                                    />
                                    {rating.label}
                                </span>
                                {#if selectedFilters["Ratings"].includes(rating.value)}
                                    <span
                                        class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                    ></span>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Brands -->
                <!-- <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between group"
                        onclick={() => accordianOpen.Brands = !accordianOpen.Brands}
                    >
                        <h3 class="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                            Brands
                        </h3>
                        <ChevronDown
                            class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen.Brands ? 'rotate-180' : ''}"
                        />
                    </button>
                    <div
                        class="space-y-2  transition-all duration-300  {accordianOpen.Brands
                            ? 'block'
                            : 'hidden'}"
                    >
                        {#each brands as brand}
                            <label
                                class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id={brand}
                                    name="Brands"
                                    onchange={(e) => toggleFilter("Brands", brand, e.target.checked)}
                                    checked={selectedFilters["Brands"].includes(brand)}
                                    class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-none  cursor-pointer transition-all duration-200"
                                />
                                <span class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1">
                                    {brand}
                                </span>
                                {#if selectedFilters["Brands"].includes(brand)}
                                    <span class="w-2 h-2 bg-[var(--primary-color)] rounded-full"></span>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div> -->

                <!-- Sellers -->
                <div class="space-y-3">
                    <button
                        type="button"
                        class="w-full flex items-center justify-between group"
                        onclick={() =>
                            (accordianOpen.Sellers = !accordianOpen.Sellers)}
                    >
                        <h3
                            class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                        >
                            Sellers
                        </h3>
                        <ChevronDown
                            class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen.Sellers
                                ? 'rotate-180'
                                : ''}"
                        />
                    </button>
                    <div
                        class="space-y-2 transition-all duration-300 {accordianOpen.Sellers
                            ? 'block'
                            : 'hidden'}"
                    >
                        {#each sellers as seller}
                            <label
                                class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                            >
                                <input
                                    type="checkbox"
                                    id={seller.slug}
                                    name="Sellers"
                                    onchange={(e) =>
                                        toggleFilter(
                                            "Sellers",
                                            seller.slug,
                                            e.target.checked,
                                        )}
                                    checked={selectedFilters[
                                        "Sellers"
                                    ].includes(seller.slug)}
                                    class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-none cursor-pointer transition-all duration-200"
                                />
                                <span
                                    class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                                >
                                    {seller.display_name}
                                </span>
                                {#if selectedFilters["Sellers"].includes(seller.slug)}
                                    <span
                                        class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                    ></span>
                                {/if}
                            </label>
                        {/each}
                    </div>
                </div>

                <!-- Attributes -->
                {#each attributes as attribute}
                    <div class="space-y-3">
                        <button
                            type="button"
                            class="w-full flex items-center justify-between group"
                            onclick={() =>
                                (accordianOpen[attribute.label] =
                                    !accordianOpen[attribute.label])}
                        >
                            <h3
                                class="text-sm font-semibold text-gray-900 uppercase tracking-wide"
                            >
                                {attribute.label}
                            </h3>
                            <ChevronDown
                                class="w-4 h-4 text-gray-500 transition-transform duration-200 {accordianOpen[
                                    attribute.label
                                ]
                                    ? 'rotate-180'
                                    : ''}"
                            />
                        </button>
                        <div
                            class="space-y-2 transition-all duration-300 {accordianOpen[
                                attribute.label
                            ]
                                ? 'block'
                                : 'hidden'}"
                        >
                            {#each JSON.parse(attribute.values) as value}
                                <label
                                    class="flex items-center gap-3 cursor-pointer group p-2.5 -m-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                                >
                                    <input
                                        type="checkbox"
                                        id={value}
                                        name={attribute.label}
                                        onchange={(e) =>
                                            toggleFilter(
                                                attribute.label,
                                                value,
                                                e.target.checked,
                                            )}
                                        checked={selectedFilters[
                                            attribute.label
                                        ].includes(value)}
                                        class="w-4 h-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-none cursor-pointer transition-all duration-200"
                                    />
                                    <span
                                        class="text-sm text-gray-700 group-hover:text-gray-900 transition-colors duration-200 font-medium flex-1"
                                    >
                                        {value}
                                    </span>
                                    {#if selectedFilters[attribute.label].includes(value)}
                                        <span
                                            class="w-2 h-2 bg-[var(--primary-color)] rounded-full"
                                        ></span>
                                    {/if}
                                </label>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        </aside>



        <!-- Main Content -->
        <main class="flex-1 w-full min-w-0">
            <!-- Vendor Info -->
            {#if vendor_details}
                <section class="border border-gray-200 bg-white p-4 mb-6">
                    <div class="flex items-center justify-between gap-4">
                        <!-- Left -->
                        <div>
                            <h1 class="text-lg font-semibold text-gray-900">
                                {vendor_details.display_name}
                            </h1>

                            <div
                                class="flex items-center gap-2 mt-1 text-sm text-gray-600"
                            >
                                <span>⭐ {vendor_details.avg_rating}</span>
                                <span class="text-gray-400">•</span>
                                <span
                                    >{vendor_details.rating_count} ratings</span
                                >
                            </div>
                        </div>

                        <!-- Right -->
                        <button
                            class="px-4 py-2 text-sm border transition
    {isFollowing
                                ? 'border-black bg-black text-white'
                                : 'border-black hover:bg-black hover:text-white'}"
                            disabled={isLoading}
                            onclick={toggleFollow}
                        >
                            {#if isLoading}
                                ...
                            {:else}
                                {isFollowing ? "Following" : "Follow"}
                            {/if}
                        </button>
                    </div>
                </section>
            {/if}

            <div class="p-4 sm:p-6 lg:p-8 xl:p-10">
                <!-- Desktop Header -->
                <div class="hidden lg:block mb-8 animate-fade-in">
                    <h1
                        class="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight mb-2"
                    >
                        Products
                    </h1>
                    {#if activeFilterCount > 0}
                        <p class="text-sm text-gray-600 font-medium">
                            {activeFilterCount}
                            {activeFilterCount === 1 ? "filter" : "filters"} applied
                        </p>
                    {/if}
                </div>

                <!-- Mobile Header -->
                <div class="lg:hidden mb-6">
                    <h1
                        class="text-2xl font-bold text-gray-900 tracking-tight mb-2"
                    >
                        Products
                    </h1>
                    {#if activeFilterCount > 0}
                        <p class="text-xs text-gray-500">
                            {activeFilterCount}
                            {activeFilterCount === 1 ? "filter" : "filters"} applied
                        </p>
                    {/if}
                </div>

                <div class="grid grid-cols-2 md:grid-cols-4">
                    {#each products as item, i}
                        <div
                            class="product-card-wrapper animate-fade-in-up"
                            style=" animation-delay: {Math.min(
                                i * 0.03,
                                0.5,
                            )}s;"
                        >
                            <div
                                class="h-full transform transition-all duration-300"
                            >
                                <ProductCard {item} />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </main>
    </div>
</div>

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

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    :global(.animate-fade-in) {
        animation: fade-in 0.4s ease-out forwards;
    }
</style>
