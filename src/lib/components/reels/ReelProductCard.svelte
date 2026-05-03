<script>
  import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
  import LoginModal from "$lib/components/auth/LoginModal.svelte";
  import { addToCart, cart } from "$lib/stores/cart";
  import { goto } from "$app/navigation";
  import {
    reelShopCheckoutOpen,
    addToReelShopCart,
    reelShopLockXScroll,
  } from "$lib/stores/reelShop";

  import {
    ArrowRight,
    HeartIcon,
    RotateCcw,
    ShieldCheck,
    ShoppingBag,
    Star,
    StarHalf,
    Van,
  } from "@lucide/svelte";
  import { reelMetrics } from "$lib/stores/reelMetrics";
  import { createEventDispatcher, onDestroy, onMount } from "svelte";
  let { product, index, isLoggedIn, user, isMobile } = $props();
  const isInCart = $derived(
    $cart.filter((i) => i.id === product?.id).length > 0,
  );
  let openLoginModal = $state(false);
  const dispatch = createEventDispatcher();
</script>

<!-- svelte-ignore attribute_quoted -->
<div
  class="product-card border-r border-gray-200 w-full h-full min-w-[100%] animate-fade-in"
  style="animation-delay: {index * 0.1}s;"
>
  <div class="relative flex-1 flex items-center justify-center bg-white p-4 md:mt-0 mt-[30px]">
    <a
      href={`/items/${product?.slug}`}
      onclick={() => reelMetrics.markViewedDetails(product.id)}
      class="block"
    >
      <img
        src={product?.image_url}
        alt={product?.title}
        loading="lazy"
        style="max-height:{isMobile ? '180px' : '300px'}"
        class="w-full aspect-square object-contain"
      />
    </a>

    <button
      class="absolute top-4 right-4 bg-rose-100 text-white rounded-full p-2"
    >
      <HeartIcon size={20} color="oklch(64.5% 0.246 16.439)" />
    </button>
  </div>
  <div class="space-y-2 px-4 md:px-6 bg-white">
    <p class="text-lg font-bold text-gray-800 mb-1 leading-tight">
      {product?.title.length > 30
        ? product?.title.slice(0, 30) + "..."
        : product?.title}
    </p>
    <div class="flex items-center gap-2 flex-wrap">
      <p class="text-lg font-bold text-gray-900">
        ₹{product?.selling_price}
      </p>
      <p class="text-sm text-gray-400 line-through">
        ₹{product?.compare_at_price}
      </p>
      {#if product?.compare_at_price > product?.selling_price}
        <span
          class="px-2 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg"
        >
          {Math.ceil(
            ((product?.compare_at_price - product?.selling_price) /
              product?.compare_at_price) *
              100,
          )}% off
        </span>
      {/if}
    </div>
  </div>
  <div class="flex items-center md:px-6 gap-2 p-2 bg-white">
    {#if isInCart}
      <button
        onclick={() => goto("/cart")}
        class="w-full px-5 sm:px-6 py-3.5 text-sm font-medium text-gray-900
border border-gray-300 rounded-lg
shadow-lg hover:shadow-xl
transition-all duration-200
shadow-sm"
      >
        View Cart
      </button>
    {:else}
      <button
        onclick={() => {
          const payload = {
            id: product?.id,
            variant_id: product?.variant_id,
            vendor_id: product?.vendor_id,
            category_id: product?.category_id, //yet to fix
            title: product?.title,
            slug: product?.slug,
            sku: product?.sku,
            coupons: [],
            selling_price: product?.selling_price,
            compare_at_price: product?.compare_at_price,
            weight_grams: product?.weight_grams,
            image_url: product?.image_url,
          };
          addToCart(payload);
          reelMetrics.markAddedToCart();
        }}
        class="w-full px-5 sm:px-6 py-3.5 text-sm font-medium flex items-center justify-center gap-1
           border border-[var(--primary-color)] rounded-md text-black
           
           transition-all duration-200
           shadow-lg hover:shadow-xl
           disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ShoppingBag size={16} /> Add to Cart
      </button>
    {/if}
    <button
      class="w-full px-5 sm:px-6 py-3.5 text-sm font-semibold text-white flex items-center justify-center gap-1
        bg-[var(--primary-color)] rounded-md
border border-[var(--primary-color)]
        transition-all duration-200
        shadow-lg hover:shadow-xl "
      onclick={() => {
        if (!isLoggedIn) {
          openLoginModal = true;
          return;
        }
        // addToCart(product);
        dispatch("buyNow");
      }}
    >
      Buy Now <ArrowRight size={16} />
    </button>
  </div>

  <div
    class=" items-center md:px-6 p-2 bg-white grid grid-cols-3 gap-2 pt-4 border-t border-gray-100"
  >
    <div class="flex flex-col items-center text-center p-2">
      <Van />
      <span class="text-xs text-gray-600 font-medium mt-1">Free Delivery</span>
    </div>
    <div class="flex flex-col items-center text-center p-2">
      <RotateCcw />
      <span class="text-xs text-gray-600 font-medium mt-1">Easy Returns</span>
    </div>
    <div class="flex flex-col items-center text-center p-2">
      <ShieldCheck />
      <span class="text-xs text-gray-600 font-medium mt-1">Secure Pay</span>
    </div>
  </div>





<div class="border-t border-gray-200 md:px-6 gap-2 p-2 bg-white">
                    <h3 class="font-bold text-lg mb-4">Product Details</h3>
                    <div class="space-y-3 text-sm text-gray-600">
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span>Fabric</span>
                            <span class="font-medium text-gray-900">Pure Silk</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span>Work</span>
                            <span class="font-medium text-gray-900">Zari Woven</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span>Blouse Piece</span>
                            <span class="font-medium text-gray-900">Included (0.8m)</span>
                        </div>
                        <div class="flex justify-between py-2 border-b border-gray-100">
                            <span>Occasion</span>
                            <span class="font-medium text-gray-900">Wedding, Festival</span>
                        </div>
                    </div>
                </div>








<div class="mt-6 p-4 bg-gray-50 rounded-2xl">
                    <div class="flex items-center gap-2 mb-2">
                        <div class="flex text-yellow-400 text-sm">
                           <Star class="fill-current size-4" />
                           <Star class="fill-current size-4" />
                           <Star class="fill-current size-4" />
                           <Star class="fill-current size-4" />
                           <StarHalf class="fill-current size-4" />
                        </div>
                        <span class="font-bold text-gray-900">4.8</span>
                        <span class="text-gray-500 text-sm">(2,405 reviews)</span>
                    </div>
                    <p class="text-sm text-gray-600 italic">"Absolutely stunning saree! The quality exceeded my expectations..."</p>
                </div>










</div>

<LoginModal
  open={openLoginModal}
  onClose={() => (openLoginModal = false)}
  onLoggedIn={() => {
    addToCart(product);
    goto("/checkout");
  }}
/>
