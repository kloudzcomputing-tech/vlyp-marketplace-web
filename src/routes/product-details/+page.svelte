<script>
  import "../../app.css";
  import productA from "$lib/assets/product-1.jpeg";
</script>

<div class="bg-gray-50 text-gray-900">
  <div class="max-w-[1300px] w-full mx-auto">
    <div class="min-h-screen">
      <nav
        class="mx-auto mt-3 bg-white rounded p-4 mb-4 px-4 text-xs text-gray-500"
      >
        <span class="hover:text-blue-600 cursor-pointer">Home</span> /
        <span class="hover:text-blue-600 cursor-pointer">Clothing</span> /
        <span class="hover:text-blue-600 cursor-pointer">Men's T‑Shirts</span>
        /
        <span class="text-gray-700 font-medium">Graphic Print T‑Shirt</span>
      </nav>

      <div
        class="mx-auto mt-4 bg-white rounded p-4 mb-4 gap-6 px-4 pb-10 lg:flex"
      >
        <div class="w-full lg:w-2/5">
          <div class="overflow-hidden rounded-xl border bg-white">
            <img
              src={productA}
              alt="product"
              class="max-h-full object-contain"
            />
          </div>
        </div>

        <div class="mt-6 w-full space-y-5 lg:mt-0 lg:w-3/5">
          
          <div>
            <p class="text-sm font-semibold text-gray-500">Kook N Keech</p>
            <h1 class="mt-1 text-lg font-semibold text-gray-900">
              Disney Graphic Print Men Round Neck Grey T‑Shirt
            </h1>
            <p class="mt-1 text-xs text-gray-500">
              Stylish casual T‑shirt for everyday wear with premium Disney
              artwork.
            </p>

           
            <div class="mt-2 flex items-center gap-2">
              <span
                class="inline-flex items-center rounded bg-green-600 px-2 py-0.5 text-xs font-semibold text-white"
              >
                4.3 ★
              </span>
              <span class="text-xs text-gray-500"
                >12,345 ratings & 1,234 reviews</span
              >
            </div>
          </div>

          
          <div class="rounded-lg bg-white ">
            <div class="flex  gap-3 items-center">
              <p class="text-2xl font-semibold text-gray-900">₹499</p>
              <p class="text-sm text-gray-500 line-through">₹999</p>
              <p class="text-sm font-semibold text-green-600">50% off</p>
            </div>
            <p class="mt-1 text-xs text-gray-500">
              Inclusive of all taxes • Special price for limited time
            </p>
          </div>

         
          <div class="rounded-lg bg-white">
            <div class="flex items-center gap-4">
              <p class="text-sm font-semibold text-gray-800">Select Size</p>
              <button
                class="text-xs font-semibold text-blue-600 hover:underline"
              >
                Size chart
              </button>
            </div>
            <div class="mt-3 flex flex-wrap gap-2 text-sm">
              <button
                class="h-9 w-9 rounded-full border border-blue-600 text-center text-xs font-semibold text-blue-600"
              >
                S
              </button>
              <button
                class="h-9 w-9 rounded-full border text-center text-xs font-semibold hover:border-blue-600 hover:text-blue-600"
              >
                M
              </button>
              <button
                class="h-9 w-9 rounded-full border text-center text-xs font-semibold hover:border-blue-600 hover:text-blue-600"
              >
                L
              </button>
              <button
                class="h-9 w-9 rounded-full border text-center text-xs font-semibold hover:border-blue-600 hover:text-blue-600"
              >
                XL
              </button>
              <button
                class="h-9 w-9 rounded-full border text-center text-xs font-semibold hover:border-blue-600 hover:text-blue-600"
              >
                XXL
              </button>
            </div>
          </div>


            <div class="mb-2">
              <p class="text-sm font-semibold text-gray-800">Color</p>
              <div class="mt-2 flex gap-2">
                <button
                  class="h-7 w-7 rounded-full border-2 border-blue-600 bg-gray-700"
                ></button>
                <button class="h-7 w-7 rounded-full border bg-black"></button>
                <button class="h-7 w-7 rounded-full border bg-red-600"></button>
              </div>
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800">Quantity</p>
              <div
                class="mt-2 inline-flex items-center rounded border bg-white"
              >
                <button class="px-3 py-1 text-lg leading-none text-gray-600"
                  >-</button
                >
                <span class="border-x px-4 py-1 text-sm">1</span>
                <button class="px-3 py-1 text-lg leading-none text-gray-600"
                  >+</button
                >
              </div>
              <p class="mt-1 text-xs text-gray-500">Only few left in stock!</p>
            </div>
        

        
          <div class="flex flex-col gap-3 sm:flex-row">
            <button
              class="flex-1 rounded-md bg-orange-500 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 max-w-[140px] w-full"
            >
              Add to Cart
            </button>
            <button
              class="flex-1 rounded-md bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-700 max-w-[140px] w-full"
            >
              Buy Now
            </button>
          </div>

        
          <div class="rounded-lg bg-white py-4 ">
            <p class="text-sm font-semibold text-gray-800">Delivery</p>
            <div class="mt-2 flex flex-wrap items-center gap-2 text-sm">
              <input
                type="text"
                placeholder="Enter pincode"
                class="w-32 rounded border px-2 py-1 text-sm outline-none focus:border-blue-600"
              />
              <button
                class="text-xs font-semibold text-blue-600 hover:underline"
              >
                Check
              </button>
              <p class="text-xs text-gray-500 w-full sm:w-auto">
                Expected delivery by Mon, 01 Dec • Cash on Delivery available
              </p>
            </div>
          </div>

      


        </div>
      </div>
    </div>
  </div>
</div>
