<script>
  const MIN = 0;
  const MAX = 1000;
  const MIN_GAP = 10;

  let minVal = $state(100);
  let maxVal = $state(900);

  const { data } = $props();

  const { products, sub_store } = data;

  

  let leftPercent = $derived((minVal / MAX) * 100);
  let rightPercent = $derived((maxVal / MAX) * 100);

  let rangeStyle = $derived(
    `left: ${leftPercent}%; right: ${100 - rightPercent}%;`,
  );

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function handleMinInput(e) {
    let v = Number(e.target.value);
    v = clamp(v, MIN, MAX);

    if (maxVal - v <= MIN_GAP) {
      v = maxVal - MIN_GAP;
    }

    minVal = v;
  }

  function handleMaxInput(e) {
    let v = Number(e.target.value);
    v = clamp(v, MIN, MAX);

    if (v - minVal <= MIN_GAP) {
      v = minVal + MIN_GAP;
    }

    maxVal = v;
  }
</script>

<div class="container mx-auto px-3 sm:px-4 py-4 sm:py-6">
  <div
    class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-4 transition-shadow duration-300 mb-4 sm:mb-6 border border-gray-100"
  >
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6"
    >
      <div class="flex items-center gap-3 sm:gap-4">
        <div
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl gradient-box flex items-center justify-center text-lg sm:text-2xl font-bold text-white  flex-shrink-0"
        >
          {sub_store?.title?.split(" ")[0]?.[0]?.toUpperCase() ||
            ""}{sub_store?.title?.split(" ")[1]?.[0]?.toUpperCase() ||
            sub_store?.title?.split(" ")[0]?.[1]?.toUpperCase() ||
            ""}
        </div>

        <div class="min-w-0 flex-1">
          <h3
            class="text-base sm:text-lg md:text-xl font-semibold text-gray-800 truncate"
          >
            {sub_store?.title}
          </h3>
          <p
            class="text-xs sm:text-sm text-gray-500 flex flex-wrap items-center gap-1 sm:gap-2 mt-1"
          >
            <span>Kolkata, India</span>
            <span class="text-gray-400 hidden sm:inline">|</span>
            <span>⭐ 4.7 Rating</span>
            <span class="text-gray-400 hidden sm:inline">|</span>
            <span>{products.length} Products</span>
          </p>
        </div>
      </div>

      <div
        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4"
      >
        <span
          class="flex items-center justify-center gap-2 bg-green-50 text-green-700 text-xs font-medium px-3 py-1.5 sm:py-1 rounded-full border border-green-200"
        >
          ✔ Verified Seller
        </span>

        <button
          class="inline-flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white font-semibold rounded-full px-4 sm:px-5 py-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all"
        >
          + Follow
        </button>
      </div>
    </div>
  </div>

  <div
    class="flex px-4 flex-wrap items-center text-xs sm:text-sm text-gray-500 gap-1 sm:gap-2 mb-4 overflow-x-auto"
  >
    <span class="cursor-pointer hover:underline whitespace-nowrap">Home</span>
    <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none"
      ><path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
    <span class="cursor-pointer hover:underline whitespace-nowrap">Sellers</span
    >
    <svg class="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none"
      ><path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      /></svg
    >
    <span class="text-gray-700 font-medium truncate"
      >{sub_store?.title || "Store"}</span
    >
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
    <aside class="lg:col-span-3 order-2 lg:order-1">
      <div class="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm">
        <div class="bg-white rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <h3
            class="text-xs sm:text-sm font-medium text-gray-900 uppercase tracking-wide mb-2"
          >
            Sort by
          </h3>
          <select
            class="w-full px-3 py-2 text-xs sm:text-sm border border-gray-200 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 transition-colors"
            ><option value="Relevance">Relevance</option><option
              value="New Arrival">New Arrival</option
            ><option value="Price: Low to High">Price: Low to High</option
            ><option value="Price: High to Low">Price: High to Low</option
            ><option value="Best Sellers">Best Sellers</option><option
              value="Most Popular">Most Popular</option
            ><option value="Most Rated">Most Rated</option><option
              value="Most Reviewed">Most Reviewed</option
            ><option value="Most Viewed">Most Viewed</option></select
          >
        </div>

        <div class="bg-white rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <h2 class="text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            Category (radio)
          </h2>
          <div class="space-y-2">
            <label class="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value="all"
                checked=""
                class="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer rounded-full"
              />
              <span class="text-xs sm:text-sm">All</span>
            </label>
            <label class="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value="women"
                class="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer rounded-full"
              />
              <span class="text-xs sm:text-sm">Women</span>
            </label>
            <label class="flex items-center gap-2 sm:gap-3 cursor-pointer">
              <input
                type="radio"
                name="category"
                value="men"
                class="w-4 h-4 border-gray-300 text-gray-900 focus:ring-gray-900 focus:ring-1 cursor-pointer rounded-full"
              />
              <span class="text-xs sm:text-sm">Men</span>
            </label>
          </div>
        </div>

     

        <div class="bg-white rounded p-3 sm:p-4 mb-3 sm:mb-4">
          <div
            class="mb-2 sm:mb-3 flex items-center justify-between text-xs sm:text-sm font-medium text-gray-700"
          >
            <span>Min: ₹<span id="minValueText">{minVal}</span></span>
            <span>Max: ₹<span id="maxValueText">{maxVal}</span></span>
          </div>

          <div class="relative">
            <div
              id="rangeSelected"
              class="pointer-events-none absolute top-1/2 h-1 -translate-y-1/2 rounded bg-blue-500"
              style={rangeStyle}
            ></div>

            <div class="h-1 w-full rounded bg-gray-200"></div>

            <input
              id="minRange"
              type="range"
              min={MIN}
              max={MAX}
              bind:value={minVal}
              oninput={handleMinInput}
              class="pointer-events-none absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
              aria-label="Minimum range"
            />

            <input
              id="maxRange"
              type="range"
              min={MIN}
              max={MAX}
              bind:value={maxVal}
              oninput={handleMaxInput}
              class="pointer-events-none absolute inset-0 h-1 w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow"
              aria-label="Maximum range"
            />
          </div>
        </div>
      </div>
    </aside>

    <main class="lg:col-span-9 order-1 lg:order-2">
      <div class="mb-3 sm:mb-4 flex items-center justify-between">
        <div class="text-xs sm:text-sm text-gray-600">
          Showing <span class="font-medium text-gray-800"
            >{products.length}</span
          > results
        </div>
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3"
      >
        {#each products as product}
          <div
            class="w-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200 border border-gray-100"
          >
            <div class="relative bg-white">
              <figure
                class="p-[5%] flex items-center justify-center h-[180px] sm:h-[220px] md:h-[240px] lg:h-[280px] group"
              >
                <img
                  src={product?.image_url}
                  alt={product?.title || "product"}
                  class="max-h-full w-full object-contain transition-transform duration-200 group-hover:scale-105"
                />
              </figure>
            </div>

            <div>
              <div class="px-2 sm:px-[5%] pt-2 sm:pt-3">
                <h3
                  class="text-xs sm:text-sm text-black/80 font-medium leading-[18px] sm:leading-[20px] mb-1 line-clamp-2"
                >
                  {product?.title}
                </h3>

                <div class="flex flex-wrap items-center gap-1 sm:gap-2 mb-2">
                  <strong class="text-sm sm:text-base"
                    >₹{product?.selling_price}</strong
                  >
                  <span
                    class="text-[10px] sm:text-xs line-through text-gray-400"
                    >₹{product.compare_at_price}</span
                  >
                  <small
                    class="text-[10px] sm:text-xs text-green-600 font-semibold"
                    >{Math.ceil(
                      ((product.compare_at_price - product?.selling_price) /
                        product.compare_at_price) *
                        100,
                    )}% off</small
                  >
                </div>

                <div
                  class="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs text-gray-600 mb-2 sm:mb-3"
                >
                  <div
                    class="flex items-center bg-green-600 text-white px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-[11px]"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path
                        d="M12 .587l3.668 7.431L23.327 9.8l-5.659 5.51L18.995 24 12 19.897 5.005 24l1.327-8.69L.673 9.8l7.659-1.782z"
                      />
                    </svg>
                    4.3
                  </div>
                  <span class="hidden sm:inline">•</span>
                  <span class="hidden sm:inline">128 reviews</span>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </main>
  </div>
</div>

<style>
  .gradient-box {
    background: linear-gradient(140.37deg, #3dd2f7 -3.83%, #8973f4 79.24%);
  
  }
</style>
