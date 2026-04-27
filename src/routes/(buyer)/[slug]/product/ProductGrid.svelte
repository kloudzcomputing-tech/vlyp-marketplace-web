<script>
  import { onMount } from "svelte";
  import ProductCard from "$lib/components/ProductCard.svelte";
  import { Package, Filter, Sparkles } from "@lucide/svelte";

  export let products = [];
  export let collection_name = "Products";
  export let selectedSort = "Relevance";
  export let activeFilterCount = 0;
  export let clearFilters = () => {};

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<main class="flex-1 w-full min-w-0 md:p-4">
  <div class="">
    <!-- Desktop Header -->
    <div class="hidden lg:block mb-8 lg:mb-10 animate-fade-in">
      <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-2">
        <div class="space-y-2">
          <div class="flex items-center gap-3">
            <h1 class="text-2xl font-bold text-gray-900 tracking-tight">
              {collection_name}
            </h1>
          </div>
          <div class="flex items-center gap-3 text-sm text-gray-600">
            <span class="font-medium">
              {products.length} {products.length === 1 ? 'item' : 'items'} available
            </span>
            {#if selectedSort !== "Relevance"}
              <span class="text-gray-400">•</span>
              <span class="text-gray-500">Sorted by {selectedSort}</span>
            {/if}
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Header -->
    <!-- <div class="lg:hidden mb-5 pb-4 border-b border-gray-100">
      <div class="flex items-center justify-between mb-2">
        <h2 class="text-lg font-bold text-gray-900">
          {collection_name}
        </h2>
        {#if products.length > 0}
          <div class="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--primary-color)]/10 rounded-full">
            <span class="text-xs font-bold text-[var(--primary-color)]">
              {products.length}
            </span>
          </div>
        {/if}
      </div>
      <div class="flex items-center gap-2 text-xs text-gray-500">
        <span>{products.length} {products.length === 1 ? 'item' : 'items'}</span>
        {#if selectedSort !== "Relevance"}
          <span>•</span>
          <span>{selectedSort}</span>
        {/if}
      </div>
    </div> -->

    <!-- Products Grid -->
    {#if products.length > 0}
      <div class="grid grid-cols-2 md:grid-cols-4">
        {#each products as item, i (item.id)}
          <div 
            class="product-card-wrapper animate-fade-in-up"
            style="opacity: {mounted ? 1 : 0}; animation-delay: {Math.min(i * 0.03, 0.5)}s;"
          >
            <div class="h-full transform transition-all duration-300 ">
              <ProductCard from="store" {item} />
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <!-- Enhanced Empty State -->
      <div class="flex flex-col items-center justify-center py-16 sm:py-24 md:py-32 px-4 animate-fade-in">
        <div class="relative mb-8">
          <!-- Animated Background Circle -->
          <div class="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-50 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <!-- Icon Container -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 flex items-center justify-center border-4 border-gray-200 shadow-lg">
            <Package class="w-12 h-12 sm:w-14 sm:h-14 text-gray-400" />
          </div>
        </div>
        
        <div class="text-center space-y-3 max-w-md">
          <h3 class="text-2xl sm:text-3xl font-bold text-gray-900">
            No products found
          </h3>
          <p class="text-sm sm:text-base text-gray-500 leading-relaxed">
            {#if activeFilterCount > 0}
              We couldn't find any products matching your current filters. Try adjusting your search criteria to see more results.
            {:else}
              There are no products available in this collection at the moment. Check back soon for new arrivals!
            {/if}
          </p>
        </div>

        {#if activeFilterCount > 0}
          <button
            type="button"
            onclick={clearFilters}
            class="mt-8 inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl active:scale-95 transform"
          >
            <Filter class="w-4 h-4" />
            <span>Clear All Filters</span>
          </button>
        {/if}
      </div>
    {/if}
  </div>
</main>

<style>
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  :global(.animate-fade-in-up) {
    animation: fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
      transform: scale(0.98);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  :global(.animate-fade-in) {
    animation: fade-in 0.5s ease-out forwards;
  }

  /* Product Card Wrapper Enhancements */
  :global(.product-card-wrapper) {
    will-change: transform, opacity;
  }

  :global(.product-card-wrapper:hover) {
    z-index: 10;
  }

  /* Custom scrollbar for better UX */
  @media (min-width: 1024px) {
    :global(.product-card-wrapper) {
      transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
  }
</style>
