<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import CouponListCard from "$lib/components/coupon/CouponListCard.svelte";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";
  import {
    ArrowLeftIcon,
    BadgePercentIcon,
    Check,
    CheckIcon,
    CirclePercentIcon,
    Heart,
    MapPin,
    MoveRight,
    PercentCircle,
    PercentCircleIcon,
    PercentIcon,
    Star,
    X,
    ArrowLeft,
    ArrowRight,
  } from "@lucide/svelte";
  import {
    addToCart,
    removeFromCart,
    cart as _cart,
    checkIfItemIsInCart,
    setCart,
  } from "$lib/stores/cart";

  import { ChevronUpIcon, ChevronDownIcon } from "@lucide/svelte";

  // TAB
  let openSection = $state("specs");

  function toggleSection(section) {
    openSection = openSection === section ? null : section;
  }
  // TAB

  let { data } = $props();

  // Extract data once
  const product = data?.product;
  console.log(product, "product");

  const category_attributes = data?.category_attributes || [];
  const product_attributes = data?.product_attributes || [];
  const coupons = data?.coupons || [];
  const cart = $state(_cart);
  const reviews = data?.reviews || [];
  const variants = product?.variants || [];

  let selectedVariantId = $state(variants[0]?.variant_id || null);
  const product_media = $derived(
    product?.product_media.filter(
      (media) => media.variant_key == selectedVariantId,
    ) || [],
  );
  let variant_attributes = variants.map((v) => {
    let key = v.variant_key;
    key = key.split(",");
    return { ...v, key };
  });
  const specifications = product?.specifications?.specifications;
  let openSpecifications = $state(false);

  // Initialize selected options as array based on product options
  let selectedOptionValue = $state(product?.options?.map(() => null) || []);

  let selectedImageIndex = $state(0);
  let isAddingToCart = $state(false);
  let mounted = $state(false);
  let appliedCoupons = $state([]);
  // Memoize available options using Set for O(1) lookup
  const availableOptionsSet = $derived.by(() => {
    const optionsSet = new Set();
    variants.forEach((v) => {
      v.tagValue?.forEach((o) => optionsSet.add(o));
    });
    return optionsSet;
  });

  // Memoize selected variation
  let selectedVariants = $derived(
    variants.find((v) => v.variant_id === selectedVariantId) || null,
  );

  // Memoize prices
  let sellingPrice = $derived(selectedVariants?.selling_price || 0);
  const cummulativeCouponDiscount = $derived(
    appliedCoupons.reduce((acc, coupon) => {
      if (coupon.discount_type === "PERCENTAGE") {
        return acc + (coupon.discount_value / 100) * sellingPrice;
      }
      if (coupon.discount_type === "FLAT") {
        return acc + coupon.discount_value;
      }
      return acc;
    }, 0),
  );

  const originalPrice = $derived(selectedVariants?.compare_at_price || 0);

  // Memoize discount info
  const discountInfo = $derived.by(() => {
    if (!originalPrice || originalPrice <= sellingPrice) return null;

    const amount = originalPrice - sellingPrice + cummulativeCouponDiscount;
    const percentage = Math.round((amount / originalPrice) * 100);

    return {
      amount,
      percentage,
    };
  });

  // Memoize cart check - O(1) lookup
  const isInCart = $derived(
    $cart.filter((i) => i.variant_id === selectedVariantId).length > 0,
  );

  // Memoize current image
  const currentImage = $derived(
    product_media?.[selectedImageIndex]?.image_url || "",
  );

  // Optimize date formatting - avoid moment for better performance
  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
  }

  function toggleSelectedOptionValue(index, optionValue) {
    selectedOptionValue = [...selectedOptionValue];
    if (selectedOptionValue[index] === optionValue) {
      selectedOptionValue[index] = null;
    } else {
      selectedOptionValue[index] = optionValue;
    }
  }

  async function handleAddToCart(item) {
    const _variant = item.variants.find(
      (v) => v.variant_id === selectedVariantId,
    );

    const payload = {
      id: item.id,
      variant_id: selectedVariantId,
      vendor_id: item.vendor_id,
      category_id: item.category_id,
      title: item.title,
      slug: item.slug,
      sku: _variant.sku,
      coupons: appliedCoupons,
      selling_price: sellingPrice - cummulativeCouponDiscount,
      compare_at_price: _variant.compare_at_price,
      weight_grams: _variant.weight_grams,
      image_url: item.product_media && item.product_media.length > 0 ? item.product_media[0].image_url : "",
    };
    isAddingToCart = true;
    addToCart(payload);
    isAddingToCart = false;
  }

  function applyCoupon(coupon) {
    let discount_amount = 0;
    if (coupon.discount_type === "PERCENTAGE") {
      discount_amount = sellingPrice * (coupon.discount_value / 100);
    } else {
      discount_amount = coupon.discount_value;
    }
    appliedCoupons = [
      ...appliedCoupons,
      { ...coupon, discount_amount: discount_amount },
    ];
  }
  function removeCoupon(coupon) {
    appliedCoupons = appliedCoupons.filter((c) => c.id !== coupon.id);
  }
  onMount(() => {
    mounted = true;
  });

  let expanded = $state(false);
  const MAX_LINES = 2;
  
  // Reviews drawer state
  let isReviewsDrawerOpen = $state(false);
  
  function openReviewsDrawer() {
    isReviewsDrawerOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  function closeReviewsDrawer() {
    isReviewsDrawerOpen = false;
    document.body.style.overflow = '';
  }
  
  // Fullscreen image carousel state
  let isImageCarouselOpen = $state(false);
  let carouselImages = $state([]);
  let carouselStartIndex = $state(0);
  let splideInstance = $state(null);
  
  // All review images for the carousel
  const allReviewImages = [
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800",
    "https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=800",
    "https://images.unsplash.com/photo-1623082574085-157d955f1d35?w=800",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800",
    "https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800",
  ];
  
  function openImageCarousel(images, startIndex = 0) {
    carouselImages = images;
    carouselStartIndex = startIndex;
    isImageCarouselOpen = true;
    document.body.style.overflow = 'hidden';
  }
  
  function closeImageCarousel() {
    isImageCarouselOpen = false;
    document.body.style.overflow = isReviewsDrawerOpen ? 'hidden' : '';
  }
  
  // Splide options for fullscreen carousel
  const carouselOptions = $derived({
    type: 'loop',
    perPage: 1,
    start: carouselStartIndex,
    arrows: false,
    pagination: true,
    speed: 400,
  });
  
  // Product image zoom state
  let isZooming = $state(false);
  let zoomLensPosition = $state({ x: 0, y: 0 });
  let zoomImagePosition = $state({ x: 0, y: 0 });
  let imageContainer = $state(null);
  const ZOOM_LEVEL = 2.5; // Magnification level
  const LENS_SIZE = 150; // Size of the zoom lens in pixels
  
  function handleMouseEnter() {
    if (window.innerWidth >= 768) { // Only enable on desktop
      isZooming = true;
    }
  }
  
  function handleMouseLeave() {
    isZooming = false;
  }
  
  function handleMouseMove(event) {
    if (!isZooming || !imageContainer) return;
    
    const rect = imageContainer.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate lens position (centered on cursor)
    let lensX = x - LENS_SIZE / 2;
    let lensY = y - LENS_SIZE / 2;
    
    // Constrain lens within image bounds
    lensX = Math.max(0, Math.min(lensX, rect.width - LENS_SIZE));
    lensY = Math.max(0, Math.min(lensY, rect.height - LENS_SIZE));
    
    zoomLensPosition = { x: lensX, y: lensY };
    
    // Calculate the position for the zoomed image
    const percentX = (lensX / (rect.width - LENS_SIZE)) * 100;
    const percentY = (lensY / (rect.height - LENS_SIZE)) * 100;
    
    zoomImagePosition = { x: percentX, y: percentY };
  }
</script>


<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">

  <div class="">
    <div class="w-full px-3 sm:px-4 py-3 flex items-center justify-between">
      <button onclick={() => history.back()} class="flex items-center gap-2 p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
        <ArrowLeftIcon class="w-5 h-5" />
        <span class="hidden sm:inline font-medium">Back</span>
      </button>
    
    </div>
  </div>

  <div class="w-full px-3 sm:px-4 lg:px-6 py-4 sm:py-6 pb-24 md:pb-6">
 
    <div class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      
      <div class="pb-10 flex flex-col animate-fade-in max-w-[550px] w-full z-1">
        <div class="md:sticky md:top-[140px]">
      
          <div class="w-full flex flex-col md:flex-row gap-4 relative">
            
            
            {#if product_media.length > 0}
              <div class="flex md:flex-col gap-2 sm:gap-3 overflow-x-auto md:overflow-y-auto md:max-h-[500px] pb-2 md:pb-0 md:pr-2 scrollbar-hide order-2 md:order-1 -mx-3 px-3 sm:mx-0 sm:px-0">
                {#each product_media as media, index (index)}
                  <button
                    onclick={() => (selectedImageIndex = index)}
                    class="flex-shrink-0 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-300 {selectedImageIndex === index
                      ? 'border-[var(--primary-color)] ring-2 ring-[var(--primary-color)]/20'
                      : 'border-gray-200 hover:border-gray-400'}"
                    aria-label="View image {index + 1}"
                  >
                    <img
                      src={media.image_url}
                      alt="{product?.title} - view {index + 1}"
                      class="w-full h-full object-contain transition-opacity duration-300"
                      loading="lazy"
                    />
                  </button>
                {/each}
              </div>
            {/if}

            
            <div class="flex-1 relative order-1 md:order-2">
              <div
                bind:this={imageContainer}
                class="relative bg-gradient-to-br from-gray-50 to-white rounded-lg sm:rounded-xl overflow-hidden cursor-crosshair shadow-sm hover:shadow-md transition-shadow duration-300"
                onmouseenter={handleMouseEnter}
                onmouseleave={handleMouseLeave}
                onmousemove={handleMouseMove}
              >
                <img
                  src={currentImage}
                  alt={product?.title}
                  class="w-full aspect-square object-contain p-2 sm:p-4"
                  loading="eager"
                />
                
                <!-- Mobile Zoom Hint -->
                <div class="absolute bottom-3 left-3 md:hidden bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  Tap to zoom
                </div>
                
              
                {#if isZooming}
                  <div
                    class="hidden md:block absolute border-2 border-[var(--primary-color)] bg-[var(--primary-color)]/10 pointer-events-none z-10 rounded-sm"
                    style="
                      width: {LENS_SIZE}px;
                      height: {LENS_SIZE}px;
                      left: {zoomLensPosition.x}px;
                      top: {zoomLensPosition.y}px;
                    "
                  ></div>
                {/if}
              </div>
              
              
              <button
                class="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 backdrop-blur-sm p-2 sm:p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 hover:shadow-lg transition-all duration-200 cursor-pointer group z-10"
                aria-label="Add to wishlist"
              >
                <Heart size={20} class="text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>
              
                
              <div class="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                {selectedImageIndex + 1} / {product_media.length || 1}
              </div>
            </div>
            
            
            {#if isZooming}
              <div 
                class="hidden md:block z-1 absolute left-[calc(100%+20px)] top-0 w-[450px] h-[450px] bg-white shadow-2xl overflow-hidden border border-gray-100"
              >
                <div 
                  class="w-full h-full"
                  style="
                    background-image: url('{currentImage}');
                    background-size: {ZOOM_LEVEL * 100}%;
                    background-position: {zoomImagePosition.x}% {zoomImagePosition.y}%;
                    background-repeat: no-repeat;
                  "
                ></div>
              </div>
            {/if}
          </div>

          
          <div
            class="hidden md:block space-y-5 w-full pt-8 animate-fade-in-up"
            style="animation-delay: 0.5s;"
          >
            
            {#if product?.stock_status}
              <div class="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-full w-fit">
                <span class="relative flex h-2.5 w-2.5">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full {product.stock_status === 'IN_STOCK' ? 'bg-green-400' : 'bg-red-400'} opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2.5 w-2.5 {product.stock_status === 'IN_STOCK' ? 'bg-green-500' : 'bg-red-500'}"></span>
                </span>
                <p class="text-sm font-semibold {product.stock_status === 'IN_STOCK' ? 'text-green-700' : 'text-red-700'}">
                  {#if product.stock_status === "IN_STOCK"}
                    {product.stock > 0 ? `${product.stock} in stock` : "In stock"}
                  {:else}
                    Out of stock
                  {/if}
                </p>
              </div>
            {/if}
            
            
            <div class="flex gap-4 w-full">
              {#if isInCart}
                <button
                  onclick={() => goto("/cart")}
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold text-gray-800
                   bg-white border-2 border-gray-200 rounded-xl
                   hover:bg-gray-50 hover:border-gray-300
                   transition-all duration-200
                   shadow-sm hover:shadow-md"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  View Cart
                </button>
              {:else}
                <button
                  onclick={() => handleAddToCart(product)}
                  disabled={isAddingToCart}
                  class="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-semibold
                   bg-white border-2 border-[var(--primary-color)] rounded-xl text-[var(--primary-color)]
                   hover:bg-[var(--primary-color)]/5
                   transition-all duration-200
                   shadow-sm hover:shadow-md
                   disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  {isAddingToCart ? "Adding..." : "Add to Cart"}
                </button>
              {/if}

              <button
                onclick={() => {}}
                class="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-bold text-white
                 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-color)] rounded-xl
                 hover:shadow-lg hover:shadow-[var(--primary-color)]/30 hover:scale-[1.02]
                 transition-all duration-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>

     
      <div class="space-y-4 md:space-y-6 w-full lg:max-w-[650px] lg:flex-1">
        
        <div class="space-y-3 animate-fade-in-up" style="animation-delay: 0.1s;">
          
          <p class=" text-2xl md:text-3xl lg:text-4xl font-bold display-font">
            {product?.title}
          </p>

          
          <div class="flex flex-wrap items-center gap-2 sm:gap-3 text-sm">
            <div class="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
              <span class="font-bold text-green-700">4.5</span>
              <Star size={14} color="#15803d" fill="#15803d" />
            </div>
            <span class="text-gray-400 hidden sm:inline">|</span>
            <a href="#reviews" class="text-blue-600 font-medium hover:underline">2,847 reviews</a>
            <span class="text-gray-400">|</span>
            <span class="text-green-600 font-medium flex items-center gap-1">
              <span class="w-2 h-2 bg-green-500 rounded-full"></span>
              In Stock
            </span>
          </div>

          {#if product?.averageRating !== undefined}
            <div class="flex items-center gap-3 text-sm text-gray-500">
              <span
                class="flex items-center text-sm gap-1.5 px-2 py-1 bg-green-600 rounded-md"
              >
                <span class="text-gray-200 font-medium"
                  >{product.averageRating}</span
                >
                <span class="text-yellow-500">⭐</span>
              </span>
              <span class="text-gray-400">•</span>
              <span>{product?.totalReviews || 0} reviews</span>
            </div>
          {/if}
          {#if product?.stock_status}
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full
                    {product.stock_status === 'IN_STOCK'
                  ? 'bg-green-500'
                  : 'bg-red-500'}"
              ></div>

              <p
                class="text-sm font-medium
                    {product.stock_status === 'IN_STOCK'
                  ? 'text-green-600'
                  : 'text-red-600'}"
              >
                {#if product.stock_status === "IN_STOCK"}
                  {product.stock > 0 ? `${product.stock} in stock` : "In stock"}
                {:else}
                  Out of stock
                {/if}
              </p>
            </div>
          {/if}
        </div>

        
        <div class="space-y-2 animate-fade-in-up" style="animation-delay: 0.2s;">
          <div class="flex flex-wrap items-baseline gap-2 sm:gap-3">
            <span class="text-3xl sm:text-4xl font-bold display-font">
              ₹{sellingPrice - cummulativeCouponDiscount}
            </span>
            {#if originalPrice > sellingPrice}
              <span class="text-lg sm:text-2xl text-gray-400 line-through">
                ₹{originalPrice}
              </span>
            {/if}
            {#if discountInfo}
              <span class="bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                {discountInfo.percentage}% OFF
              </span>
            {/if}
          </div>
          <p class="text-xs sm:text-sm text-gray-500">
            Inclusive of all taxes • FREE Shipping
          </p>
        </div>

        {#if category_attributes.length > 0}
          {#each category_attributes as ca}
            <div>
              <div class="flex items-center gap-1 text-sm font-semibold mb-3">
                <p class="font-bold">{ca.label}:</p>
                <span class="font-normal text-gray-600">Midnight Black</span>
              </div>
              {#if ca.label === "Color"}
                <div class="flex flex-wrap gap-2">
                  <div class="gap-4 flex">
                    {#each variant_attributes as va}
                      <div
                        onclick={() => (selectedVariantId = va.variant_id)}
                        style="border-color: {selectedVariantId ===
                        va.variant_id
                          ? 'var(--primary-color)'
                          : '#0002'}"
                        class="hover:bg-gray-100 cursor-pointer p-1 transition-all duration-200 border border-gray-200 rounded-md"
                      >
                        <div>
                          <img
                            src={product?.product_media.find(
                              (m) => m.variant_key == va.variant_id,
                            )?.image_url}
                            alt={product?.title}
                            class="w-[40px] object-cover"
                          />
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {:else}
                <div class="flex flex-wrap gap-2">
                  {#each JSON.parse(ca.attribute_values) as attr}
                    <div class="flex flex-col items-center gap-2">
                      <p class="text-xs text-gray-500">
                        {attr}
                      </p>
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        {/if}

        {#if coupons.length > 0}
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <p class="text-lg font-bold text-gray-900">Discounts</p>
              {#if cummulativeCouponDiscount > 0}
                <span class="pl-4 text-sm text-red-700"
                  >₹{cummulativeCouponDiscount} discount applied</span
                >
              {/if}
            </div>
            {#each coupons as coupon}
              <CouponListCard
                {coupon}
                isSelected={appliedCoupons.find((c) => c.id === coupon.id)}
                {removeCoupon}
                {applyCoupon}
              />
            {/each}
          </div>
        {/if}

        <!-- {#if product?.description}
          <div
            class="space-y-4 pt-6 border-t border-gray-200 animate-fade-in-up"
            style="animation-delay: 0.4s;"
          >
            <h2 class="text-lg sm:text-xl font-medium text-gray-900">
              Product Summary
            </h2>

            <p
              class="text-sm sm:text-base text-gray-600 leading-relaxed transition-all duration-300"
              class:clamped={!expanded}
            >
              {product.description}
            </p>

            <button
              type="button"
              onclick={() => (expanded = !expanded)}
              class="text-sm font-medium text-gray-900 hover:underline"
            >
              {expanded ? "Show less" : "Show more"}
            </button>
          </div>
        {/if} -->

        <h3 class="font-bold mb-2">Highlights</h3>

        <div
          class="flex items-start justify-around bg-gray-50 rounded-lg flex-col animate-fade-in"
        >
          <ul class="flex items-center justify-around py-4 w-full">
            {#each product_attributes as pa}
              <li class="">
                <span class="block text-center text-xs text-gray-600"
                  >{pa.label}</span
                >
                <span class="block text-center font-bold text-sm"
                  >{pa.value || "N/A"}</span
                >
              </li>
              <li class="w-px h-8 bg-gray-300 last:hidden"></li>
            {/each}
          </ul>
        </div>

        <!-- Seller -->

        <div class="border border-gray-200 rounded-lg p-4 mb-6">
          <div class="flex items-start space-x-3 mb-3">
            <Check size={20} color="#00a63e" />
            <div>
              <p class="font-semibold">Free Delivery by Monday, Feb 3</p>
              <p class="text-sm text-gray-600">Order within 4 hours 23 mins</p>
            </div>
          </div>
          <div class="flex space-x-3 items-center">
            <MapPin size={20} color="#000000" />
            <div>
              <input
                type="text"
                placeholder="Enter Pincode"
                class="border border-gray-300 rounded px-3 py-1 text-sm w-full"
              />
            </div>
          </div>
        </div>

        <div
          class="border border-gray-200 rounded-lg p-4 mb-4 animate-fade-in-up"
          style="animation-delay: 0.6s;"
        >
          <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          >
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center w-12 h-12 bg-black dark:bg-gray-800 shadow rounded-lg"
              >
                <span
                  class="text-lg font-bold text-[var(--primary-color-text)] dark:text-gray-200"
                >
                  {product?.vendor_display_name?.[0] || ""}
                </span>
              </div>
              <div>
                <span class="text-xs text-gray-500 mb-1 block"> Sold by </span>
                <span class="font-bold">
                  {product?.vendor_display_name}
                </span>

                <div class="flex items-center space-x-2 mt-1">
                  <div class="flex items-center space-x-1">
                    <Star size={12} color="#facc15" fill="#facc15" />
                    <span class="text-xs font-medium">4.7</span>
                  </div>
                  <span class="text-xs text-gray-400">|</span>
                  <span class="text-xs text-gray-600">8.5k ratings</span>
                </div>
              </div>
            </div>
            <a
              href={`/${product.vendor_slug}?vid=${product.vendor_id}`}
              class="text-blue-600 text-sm font-bold hover:underline inline-flex items-center gap-1"
            >
              View Store
              <MoveRight size={14} />
            </a>
          </div>

          <div
            class="mt-3 pt-3 border-t border-gray-100 grid grid-cols-3 gap-2 text-center"
          >
            <div>
              <p class="text-xs text-gray-500">Positive Rating</p>
              <p class="text-sm font-semibold text-green-600">98%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Ships on time</p>
              <p class="text-sm font-semibold text-green-600">95%</p>
            </div>
            <div>
              <p class="text-xs text-gray-500">Products</p>
              <p class="text-sm font-semibold">1.2k+</p>
            </div>
          </div>
        </div>

        <div
          class="flex items-center justify-around py-4 bg-gray-50 rounded-lg"
        >
          <div class="text-center">
            <p class="text-xs text-gray-600">Certified</p>
            <p class="font-semibold text-sm flex items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="18" height="18" fill="url(#pattern0_929_897)" />
                <defs>
                  <pattern
                    id="pattern0_929_897"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_929_897"
                      transform="scale(0.0111111)"
                    />
                  </pattern>
                  <image
                    id="image0_929_897"
                    width="90"
                    height="90"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEGUlEQVR4nO2dy28OURiHH+qyUhtJ2VDxB/gXkKJtSCkb1wgbC3vE5R+gLhV27gkWrJQiSiI2LpF008SeKitEUqK8cpIzyeRL9Tvz9cycd2bOk/ySpsk353xPT86cmfPOFCKRSCQSiUQikUgk0hILgR7gAvASmAAmbSbs7waBbmBBa03Um3bgBPAFEMd8Bo7bz0Yc2A6MZxDcmI9Av0tDdaUNODsLwY05Y48ZSWGEXPcoOckdYF66obpzJgfJSQaoEcuAPcAlYBh4a/McuJuj5CR3bVtJuw+Bi8BuYCkVYAPwGJgqQGarMX17BHRRQlYCTxVIlIx5AnRSErYC3xVIkxZj+t6Hcg4onybEMVP2u6gdyVWQLCnZ6kZ2Z8mnC/lPfgCrUEQZT3ziGLNqUrOEk4pnHQp4rECE5BxzgRP8iq9KJ0D5T36HvoLcq0CCFJSdIUVfUiBACorZyQnGIwUCpKAMhRT9VoEAKSivQ4p+p0CAZMxP4LA9uS21P/9y+NybkKKflVByzzTf44jDZ81FWTDuVUByskx12TwIssc3UBHJrqJNThe54WsauqlAnjhmsolkw9EMx7tRlOyzFZPcY0d8luOazeTci1vqLllscivSabdVQFKC/AI2N/k+G+0fo9U2PgGL8xB9UoFAUSI5ian1817VmaXgsKrThTTEVLTO9ym6V4FEUTSS0zHH9MagApGiaCSnc86n6JceO/YCOAgc8nRTKqTk5Pt4Y8JTp24Bc1PHNZWeV0osWWwttzd8zWsrpjm2EX+5pJKTfqgS/WeGM3RW2S6SewuQ7F20r6lj7QxtuMrWJNn71OHrZPgeWDIL2dokez8Z+lzejbYoe9I+5qZJsvflXbfnzo01qZOY07DD7nIx0p3DxYhL1vsUvcA+xycBRvak0pGc3FjyegmOvYEiAWSvVirZ5Bg5sAj4kENnx2ZRbhVqukhWG7ncJjVsy6nTo01GtraR/BfYQkmfCRzNIDuk5GSTtrRPuYrjNBJyujC5XfRO+ECAkd2rYCS3VamAZhToaGhrU2DJQQpoiigJ+2zf2bEPuGpPQBIwIyFFl7HIUVpM0CLHOpXtvgopeliBAKlDIXp8tKIg9igQIAVlBwGp0+NvHQSmDg8MDaGALgUiJOfMtNdZKE8UyJCcYlZWql4j8U2BFPGcr8BylNFXsRPjlMM+ZTCq9Kqf/Sinr+TTyFfNI7mRFSVd9g1rnJNdMG9ueaB8Ovlt18lrqAAdwC57v2Ao9erKkQJfmTmSave+7ctODVd8RXI6R8mnQn85TbQB13LaSI2vNZ5Gtq9Shr8hN1LLQv8sHxz9UERxS1Vot7V+WQrgJ2wtnCldi2Rkvn2B4Xlb8D2e+vcg4/Z352zprPeqzkgkEolEIpFIJBKhDvwDSK6FYkwSxW4AAAAASUVORK5CYII="
                  />
                </defs>
              </svg>
              Authentic
            </p>
          </div>
          <div class="w-px h-8 bg-gray-300"></div>
          <div class="text-center">
            <p class="text-xs text-gray-600">Fast</p>
            <p class="font-semibold text-sm flex items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="18" height="18" fill="url(#pattern0_929_899)" />
                <defs>
                  <pattern
                    id="pattern0_929_899"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_929_899"
                      transform="scale(0.0111111)"
                    />
                  </pattern>
                  <image
                    id="image0_929_899"
                    width="90"
                    height="90"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyUlEQVR4nO2cS2vVQBSAv4q26r4tai2tdaVLH1QFQcT/0IU/wI0KShWt3bipb8UqiksFF1bc67KIj52Cf8EXigreq6itkSlHuMpNMsmdTCa554NDISTnnnzNnWRmMhcURVEURVEURVEURVEURVGUNqwEDgPPgQYQBRwN4BlwCOijQgwBLwMQGOWIF1J/Ja7kqkqOWmQHf2UfDkBU5CAOEjjPA5AUOYinBM7XACRFDsKcR9BENYqgKVtOpKKrF0Hj6iQXgHngKDAODAArJAZk21HZx+yrojPGN+CMyLRlADgrx6poi5hL6ZUtS/ns9cB9FR0fi8BJoCcm5yrgGvBFYla2tcPkmJKcUWDxSZ7PD0gP2qtoI2QiJeeVNsddSjlmIlDZrd38tT5Fmys5jXdtjntrcdxUAEKT4hXQ60P0XEJzYZMzjR7HbXYRMUlObD/gu9y8OslpwzqgGYDQuHifd6TQ9gNmHOS05VwAQpNiPzmwSbyQ8Tk56lD0YAk3xh/AsU5veHmktMa8o5xZeOxZ9HEKxqaII45yZmHSs+g1FIxNEeOOcmZhl2fRhWNTRL+jnLeAkQztdNeJzvqQHiXET+A2sDElh3mEUtEpfLTIaYSfl2HUdnSl6KxNx8UMJ2iGWNvRlU3Hjow5e4HLctWm5X4Tk6Mrb4ZmZiQPI3ID/JlDtO/Hu8IposOSRfhMIB2WwimiC54k/IYMmb4WycsD6YIXjm0hZo7PFxc8Sw5KtBkmHfZQz1ABk7aVEh3JoLzNwH9eTO4HJUgOTnQk001FMV2SZC//sCImZ/MQ+uSsd9EmfkuPzkUz0iNjwXWQ7Fx0a5ttO4/YjuES2+RKif77NHJOnn1tGZQBpe8BiKmM6L+xKL0503XeKTJ7JQZl26TsU5dmohTRGqjoSEVTu1DRqGjqFCoaFU2dQkWjoqlT/MNq4LqsL3GxNPgEMCrvaIzKqoBGACddRv2fZf3O0pqdmw6L3BLzTdlaAdlF1m8cO5sqMldCEqcCkFlW/U2Xos3XLImxAGSWVX/TZdOR9k5eXwAyy6rfvFax1FDPSsMd6hUReYgi6jeLQK8mLGBN5FHONYfTMcc9xC+VqT/upmDuyttijtmesIzNZlFoV9Y/mvDTDw05kQ3S5o3JldCM2f+XpxdxKlv/XUft4p0ii6xD/f2yarSTIj9knMTt2vr3dPAM3gR2+yiyLvXvs1yjEv13JewlDCpV/5C8PJP22sAicE8W0odE5erfDJyWX2l5I2/0m79PZPsmwqbq9SuKoiiKoiiKoiiKouCLP9jsQhM7ROviAAAAAElFTkSuQmCC"
                  />
                </defs>
              </svg>
              Shipping
            </p>
          </div>
          <div class="w-px h-8 bg-gray-300"></div>
          <div class="text-center">
            <p class="text-xs text-gray-600">Secure</p>
            <p class="font-semibold text-sm flex items-center gap-1">
              <svg
                width="24"
                height="24"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <rect width="18" height="18" fill="url(#pattern0_929_900)" />
                <defs>
                  <pattern
                    id="pattern0_929_900"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlink:href="#image0_929_900"
                      transform="scale(0.0111111)"
                    />
                  </pattern>
                  <image
                    id="image0_929_900"
                    width="90"
                    height="90"
                    preserveAspectRatio="none"
                    xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAABaCAYAAAA4qEECAAAACXBIWXMAAAsTAAALEwEAmpwYAAADcElEQVR4nO2cOWgVQRjHf1GJinhgZaKFWqooWogWHgHBwkYRxUYbEfF83hE8QOxEiIXggQS0VluTCCpaaMBCQSUWHogHHo0mqPEaGZkH4bHz8t7LzLrv2+8H/ybM8s38sm92dnZZUBRFURRFURRFURRFyS+jgALQDfQBJmfpA+4BO4GRsSRPAR5mYLAmI3ngnAQ/k1UyibKDntmFDAzKZDQ7QoruzsCATEZzN6To3gwMyGQ01k0wfEX6gQNAs0ur+1uo9qZOEl20FVVKa8D2pk4SXXRTQttJAdubOkl00fbnX8rkgO1NnSS66KSp4GDA9qZOEl10v5NXzcWwVS+G1YvWoKKNikZcVDQqGklR0QgRnTeMik4HFZ0SuRBt8tCHXAyyAlR0SogWPQc4WqYPx4F5KfVFpOjZwM0q1rK3gbmR+yRO9HrgRxWSi/kJbIzYL1GilwO/a5BczB9gdaS+iRHdCLzy1HoLtLn33rYCJ4HnnrafgPER+idG9FpPnTbPq1cjgMOeY3ZF6J8Y0ecTajwFhg1y3IWE4zoi9E+M6GsJNS5XuAS8XpL2CP0TI7ozocYzN3dnATGi2z11rnjeCUkbMaI3lKn1FbgKbAZmVDBvx0CM6NFuGWcqyGfgBnAMWAoMJz5iRFuW1XhX+Bo4AowhHqJEF2W/q0G2zcuIex7iRFvGAYeAFzXItneG0wmPSNEDmQlsAy4BPW4/YzDZdqUSGvGiS5kIrAEulnlJ8hcwgbDkTvRApgKPPP1rISy5Fm2Z7+lf6O1SEaIXAfdLYp+wNFRw7FhP/+zedkhEiJ41hLNylefY0CsPEaIbPJv+9g5wXZlbbjsPv/dsr4ZGhGjL7jK17Hr6NLAf2A6ccF8a8LXfRHjEiG4E7pSpV2m6Im06iRFdXCPfGoLkTndxjIEo0cVngQXP3OvLG2BL5O1TcaIHTiUr3dzs68MpYIX758RGrOjc9SEXg6wAFZ0SuRCdBVR0SqjolIju4YungP2oSV5o9jiwezHB6PEU2UN+2Odx8CRkkXOeIt+c7KRP+EihCdgLfPc4OBOyWEuZ+SnvWUxgujIwKJOxdMR6CPohA4MzGUmsd0f+sRD4mIFBmv8ce8ItIDLTcj6NdLpfd2osAc665Y3kb5f2Ao/d6iL4hU9RFEVRFEVRFEVRFIU65C8J9qH9PH/qrwAAAABJRU5ErkJggg=="
                  />
                </defs>
              </svg>
              Payment
            </p>
          </div>
        </div>

        {#if product?.care_information}
          <div
            class="space-y-4 pt-6 border-t border-gray-200 animate-fade-in-up"
            style="animation-delay: 0.7s;"
          >
            <h2 class="text-xl sm:text-2xl font-light text-gray-900">
              Care Instructions
            </h2>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
              {product.care_information}
            </p>
          </div>
        {/if}
        <!-- Reviews -->
        {#if reviews && reviews.length > 0}
          <div
            class="space-y-8 pt-6 border-t border-gray-200 animate-fade-in-up hidden"
            style="animation-delay: 0.8s;"
          >
            <div class="space-y-3">
              <h2 class="text-xl sm:text-2xl font-light text-gray-900">
                Reviews
              </h2>
              {#if product?.averageRating !== undefined}
                <div class="flex items-center gap-3">
                  <div
                    class="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full"
                  >
                    <span class="text-2xl sm:text-3xl font-light text-gray-900"
                      >{product.averageRating}</span
                    >
                    <span class="text-yellow-500 text-lg">⭐</span>
                  </div>
                  <span class="text-sm text-gray-600">
                    • {product?.totalReviews || 0} reviews
                  </span>
                </div>
              {/if}
            </div>
            <div class="space-y-8">
              {#each reviews as review, index}
                <div
                  class="space-y-3 pb-8 border-b border-gray-100 last:border-0 animate-fade-in-up"
                  style="animation-delay: {0.9 +
                    index * 0.1}s; opacity: {mounted ? 1 : 0};"
                >
                  <div
                    class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                  >
                    <p class="text-sm font-medium text-gray-900">
                      {review?.customer_name || "Anonymous"}
                    </p>
                    {#if review?.created_at}
                      <span class="text-xs text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    {/if}
                  </div>
                  {#if review?.rating}
                    <div class="flex items-center gap-2">
                      <div
                        class="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-full"
                      >
                        <span class="text-xs text-gray-700 font-medium">
                          {review.rating}
                        </span>
                        <span class="text-yellow-500 text-xs">⭐</span>
                      </div>
                    </div>
                  {/if}
                  {#if review?.review}
                    <p class="text-sm text-gray-600 leading-relaxed">
                      {review.review}
                    </p>
                  {/if}
                </div>
              {/each}
            </div>
            <button
              class="text-sm text-gray-600 hover:text-gray-900 underline transition-colors duration-200"
            >
              View all reviews →
            </button>
          </div>
        {/if}

        <!-- Tab -->

        <nav class="flex space-x-8 flex-col gap-2">
          <div class="border border-gray-200 rounded-lg overflow-hidden m-0">
            <button
              onclick={() => toggleSection("specs")}
              class="w-full px-4 py-4 font-bold flex items-center justify-between bg-white hover:bg-gray-50 transition"
            >
              Key Features
              <span class="text-xl">
                {openSection === "specs" ? "−" : "+"}
              </span>
            </button>

            {#if openSection === "specs"}
              <div
                id="specs-tab"
                class="px-4 py-4 bg-gray-50 border-t border-gray-200"
              >
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Product Specifications -->
                  <div class="space-y-4">
                    <h3 class="text-xl font-bold display-font mb-4">
                      Product Specifications
                    </h3>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Color</p>
                      <p class="font-semibold">Red</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Fabric</p>
                      <p class="font-semibold">Banarasi Silk Blend</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Weave Type</p>
                      <p class="font-semibold">Traditional Banarasi Woven</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Pattern</p>
                      <p class="font-semibold">Intricate Woven Motifs</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Blouse Piece</p>
                      <p class="font-semibold">Yes (Attached)</p>
                    </div>
                  </div>

                  <!-- Physical Specifications -->
                  <div class="space-y-4">
                    <h3 class="text-xl font-bold display-font mb-4">
                      Physical Specifications
                    </h3>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Saree Length</p>
                      <p class="font-semibold">5.5 meters</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Blouse Piece Length</p>
                      <p class="font-semibold">0.8 meters</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Width</p>
                      <p class="font-semibold">Approx. 1.1 meters</p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Occasion</p>
                      <p class="font-semibold">
                        Wedding, Festive & Traditional Wear
                      </p>
                    </div>

                    <div class="border-b border-gray-200 pb-3">
                      <p class="text-sm text-gray-600">Wash Care</p>
                      <p class="font-semibold">Dry Clean Only</p>
                    </div>
                  </div>
                </div>
              </div>
            {/if}
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden m-0">
            <button
              onclick={() => toggleSection("description")}
              class="w-full px-4 py-4 flex items-center font-bold justify-between bg-white hover:bg-gray-50 transition"
            >
              Product Details
              <span class="text-xl">
                {openSection === "description" ? "−" : "+"}
              </span>
            </button>

            {#if openSection === "description"}
              {product?.description}
            {/if}
          </div>

          <div class="border border-gray-200 rounded-lg overflow-hidden m-0">
            <button
              onclick={() => toggleSection("reviews")}
              class="w-full px-4 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition"
            >
              <div class="flex items-center space-x-2">
                <span class="text-left font-bold">Customer Reviews</span>
                <div class="flex items-center space-x-1">
                  <svg class="w-4 h-4 fill-yellow-400" viewBox="0 0 24 24"
                    ><path
                      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                    ></path></svg
                  >
                  <span class="text-sm font-medium">4.5</span>
                  <span class="text-sm text-gray-500">(2,847)</span>
                </div>
              </div>
              <span class="text-xl font-bold">
                {openSection === "reviews" ? "−" : "+"}
              </span>
            </button>

            {#if openSection === "reviews"}
              <div
                id="reviews-tab"
                class="px-4 py-4 bg-gray-50 border-t border-gray-200"
              >
                <!-- Rating Summary -->
                <div class="mb-4 pb-4 border-b border-gray-200">
                  <div class="space-y-2">
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-medium w-6">5★</span>
                      <div
                        class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="progress-bar h-full bg-yellow-400"
                          style="width: 68%"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 w-10">68%</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-medium w-6">4★</span>
                      <div
                        class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="progress-bar h-full bg-yellow-400"
                          style="width: 20%"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 w-10">20%</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-medium w-6">3★</span>
                      <div
                        class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="progress-bar h-full bg-yellow-400"
                          style="width: 8%"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 w-10">8%</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-medium w-6">2★</span>
                      <div
                        class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="progress-bar h-full bg-yellow-400"
                          style="width: 3%"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 w-10">3%</span>
                    </div>
                    <div class="flex items-center space-x-3">
                      <span class="text-xs font-medium w-6">1★</span>
                      <div
                        class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden"
                      >
                        <div
                          class="progress-bar h-full bg-yellow-400"
                          style="width: 1%"
                        ></div>
                      </div>
                      <span class="text-xs text-gray-600 w-10">1%</span>
                    </div>
                  </div>
                </div>

                <div class="mb-6 pb-6 border-b border-gray-200">
                  <div class="flex items-center space-x-2 overflow-hidden">
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0"
                      onclick={() => openImageModal(0)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0"
                      onclick={() => openImageModal(1)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1484704849700-f032a568e944?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0"
                      onclick={() => openImageModal(0)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0"
                      onclick={() => openImageModal(0)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0"
                      onclick={() => openImageModal(0)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                    </div>
                    <div
                      class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition flex-shrink-0 relative"
                      onclick={() => openImageModal(0)}
                    >
                      <img
                        src="https://images.unsplash.com/photo-1545127398-14699f92334b?w=200"
                        alt="Customer review"
                        class="w-full h-full object-cover"
                      />
                      <div
                        class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white font-semibold text-sm opacity-[0.5]"
                      >
                        +50
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Individual Reviews -->
                <div class="space-y-6">
                  <div class="review-card py-4">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-start space-x-3">
                        <div
                          class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold"
                        >
                          SM
                        </div>
                        <div>
                          <div class="flex items-center space-x-2 mb-1">
                            <p class="font-semibold">Sarah Mitchell</p>
                            <span
                              class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                              >Verified Purchase</span
                            >
                          </div>
                          <div class="flex items-center space-x-2">
                            <div class="flex space-x-1">
                              <div
                                class="flex items-center px-1 rounded-sm text-white bg-[#08a944] text-[12px]"
                              >
                                5
                                <svg
                                  class="w-3 h-3 fill-white"
                                  viewBox="0 0 24 24"
                                  ><path
                                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                  ></path></svg
                                >
                              </div>
                            </div>
                            <span class="text-xs text-gray-500">2 days ago</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <p
                      class="text-sm text-gray-700"
                      class:line-clamp-3={!expanded}
                    >
                      This saree exceeded my expectations in every way. The
                      Banarasi weaving is intricate and elegant, and the red
                      color looks rich and festive in person. The fabric feels
                      soft and premium, making it perfect for weddings and
                      special occasions. I received so many compliments wearing
                      this saree. This saree exceeded my expectations in every
                      way. The Banarasi weaving is intricate and elegant, and
                      the red color looks rich and festive in person. The fabric
                      feels soft and premium, making it perfect for weddings and
                      special occasions. I received so many compliments wearing
                      this saree.
                    </p>

                    <button
                      onclick={() => (expanded = !expanded)}
                      class="text-sm font-medium text-green-600 hover:underline mb-3"
                    >
                      {expanded ? "Read less" : "Read more"}
                    </button>

                    <!-- Customer Images -->
                    <div class="flex space-x-2 mb-3">
                      <div
                        class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200"
                          alt="Banarasi saree customer photo"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200"
                          alt="Red silk saree customer photo"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1623082574085-157d955f1d35?w=200"
                          alt="Traditional Banarasi saree photo"
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div class="flex items-center space-x-4 text-sm">
                      <button
                        class="text-gray-600 hover:text-black flex items-center space-x-1"
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
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          ></path>
                        </svg>
                        <span>Helpful (47)</span>
                      </button>
                      <button class="text-gray-600 hover:text-black"
                        >Report</button
                      >
                    </div>
                  </div>

                  <div class="review-card py-4">
                    <div class="flex items-start justify-between mb-3">
                      <div class="flex items-start space-x-3">
                        <div
                          class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold"
                        >
                          JR
                        </div>
                        <div>
                          <div class="flex items-center space-x-2 mb-1">
                            <p class="font-semibold">James Rodriguez</p>
                            <span
                              class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                              >Verified Purchase</span
                            >
                          </div>
                          <div class="flex items-center space-x-2">
                            <div
                              class="flex items-center px-1 rounded-sm text-white bg-[#db3434] text-[12px]"
                            >
                              3 <svg
                                class="w-3 h-3 fill-white"
                                viewBox="0 0 24 24"
                                ><path
                                  d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                                  class="s-61sYTupS_IpB"
                                ></path></svg
                              >
                            </div>
                            <span class="text-xs text-gray-500">1 week ago</span
                            >
                          </div>
                        </div>
                      </div>
                    </div>

                    <p class="text-sm text-gray-700 mb-3">
                      This saree is ideal for weddings and festive occasions.
                      The fabric drapes beautifully and feels comfortable even
                      when worn for long hours. The craftsmanship and detailing
                      make it look very elegant. Slightly heavy due to the rich
                      weave, but that adds to its premium look.
                    </p>

                    <!-- Customer Images -->
                    <div class="flex space-x-2 mb-3">
                      <div
                        class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=200"
                          alt="Customer photo"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div
                        class="w-20 h-20 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=200"
                          alt="Customer photo"
                          class="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    <div class="flex items-center space-x-4 text-sm">
                      <button
                        class="text-gray-600 hover:text-black flex items-center space-x-1"
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
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                          ></path>
                        </svg>
                        <span>Helpful (32)</span>
                      </button>
                      <button class="text-gray-600 hover:text-black"
                        >Report</button
                      >
                    </div>
                  </div>
                </div>

                <div class="mt-8 text-center">
                  <button
                    onclick={openReviewsDrawer}
                    class="border-2 border-gray-300 px-8 py-3 rounded-lg font-semibold hover:border-black transition"
                  >
                    Load More Reviews
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </nav>

        <!-- Tab -->
      </div>
    </div>
  </div>

  <!-- Mobile Sticky Action Buttons -->
  <div
    class="md:hidden fixed left-0 right-0 bottom-0 bg-white w-full border-t border-gray-200 z-40"
    style="padding-bottom: max(8px, env(safe-area-inset-bottom));"
  >
    <div class="px-3 sm:px-4 py-3">
      <div class="grid grid-cols-2 gap-3 w-full">
        {#if isInCart}
          <button
            onclick={() => goto("/cart")}
            class="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold text-gray-800
              bg-white border-2 border-gray-300 rounded-xl
              active:bg-gray-50 active:scale-[0.98]
              transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            View Cart
          </button>
        {:else}
          <button
            onclick={() => handleAddToCart(product)}
            disabled={isAddingToCart}
            class="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-semibold
              bg-white border-2 border-[var(--primary-color)] rounded-xl text-[var(--primary-color)]
              active:bg-[var(--primary-color)]/5 active:scale-[0.98]
              transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {isAddingToCart ? "Adding..." : "Add to Cart"}
          </button>
        {/if}

        <button
          onclick={() => {}}
          class="flex items-center justify-center gap-2 px-4 py-3.5 text-sm font-bold text-white
            bg-[var(--primary-color)] rounded-xl
            active:scale-[0.98] active:shadow-lg
            transition-all duration-200 shadow-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
          Buy Now
        </button>
      </div>
    </div>
  </div>
  
  <!-- Reviews Side Drawer -->
  {#if isReviewsDrawerOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="fixed inset-0 z-50 flex justify-end"
      onclick={(e) => { if (e.target === e.currentTarget) closeReviewsDrawer(); }}
    >
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        class:opacity-100={isReviewsDrawerOpen}
        class:opacity-0={!isReviewsDrawerOpen}
      ></div>
      
      <!-- Drawer Panel -->
      <div 
        class="relative w-full sm:max-w-lg bg-white h-full shadow-2xl transform transition-transform duration-300 ease-out overflow-hidden flex flex-col"
        class:translate-x-0={isReviewsDrawerOpen}
        class:translate-x-full={!isReviewsDrawerOpen}
      >
        <!-- Drawer Header -->
        <div class="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
          <div class="flex items-center space-x-2 sm:space-x-3">
            <h2 class="text-lg sm:text-xl font-bold text-gray-900">All Reviews</h2>
            <div class="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded-full">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-yellow-400" viewBox="0 0 24 24">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path>
              </svg>
              <span class="text-xs sm:text-sm font-medium">4.5</span>
              <span class="text-xs text-gray-500">(2,847)</span>
            </div>
          </div>
          <button 
            onclick={closeReviewsDrawer}
            class="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close reviews"
          >
            <X size={22} />
          </button>
        </div>
        
        <!-- Rating Summary -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="space-y-2">
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium w-6">5★</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400" style="width: 68%"></div>
              </div>
              <span class="text-xs text-gray-600 w-10">68%</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium w-6">4★</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400" style="width: 20%"></div>
              </div>
              <span class="text-xs text-gray-600 w-10">20%</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium w-6">3★</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400" style="width: 8%"></div>
              </div>
              <span class="text-xs text-gray-600 w-10">8%</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium w-6">2★</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400" style="width: 3%"></div>
              </div>
              <span class="text-xs text-gray-600 w-10">3%</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-xs font-medium w-6">1★</span>
              <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-yellow-400" style="width: 1%"></div>
              </div>
              <span class="text-xs text-gray-600 w-10">1%</span>
            </div>
          </div>
        </div>
        
        <!-- Reviews List -->
        <div class="flex-1 overflow-y-auto px-6 py-4">
          <div class="space-y-6">
            <!-- Review 1 - Sarah Mitchell -->
            <div class="review-card py-4 border-b border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                    SM
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">Sarah Mitchell</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#08a944] text-[12px]">
                        5 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                This saree exceeded my expectations in every way. The Banarasi weaving is intricate and elegant, and the red color looks rich and festive in person. The fabric feels soft and premium, making it perfect for weddings and special occasions. I received so many compliments wearing this saree.
              </p>
              <div class="flex space-x-2 mb-3">
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 0)}
                >
                  <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 1)}
                >
                  <img src="https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
              </div>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (47)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
            
            <!-- Review 2 - James Rodriguez -->
            <div class="review-card py-4 border-b border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-semibold">
                    JR
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">James Rodriguez</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#db3434] text-[12px]">
                        3 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">1 week ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                This saree is ideal for weddings and festive occasions. The fabric drapes beautifully and feels comfortable even when worn for long hours. The craftsmanship and detailing make it look very elegant. Slightly heavy due to the rich weave, but that adds to its premium look.
              </p>
              <div class="flex space-x-2 mb-3">
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 2)}
                >
                  <img src="https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
              </div>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (32)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
            
            <!-- Review 3 - Priya Sharma -->
            <div class="review-card py-4 border-b border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-[#6366f1] flex items-center justify-center text-white font-semibold">
                    PS
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">Priya Sharma</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#08a944] text-[12px]">
                        5 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">2 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                Absolutely stunning! The color is exactly as shown in the pictures. The golden zari work is exquisite and adds so much elegance. I wore it to my cousin's wedding and got so many compliments. Worth every penny!
              </p>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (28)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
            
            <!-- Review 4 - Anita Desai -->
            <div class="review-card py-4 border-b border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-[#ec4899] flex items-center justify-center text-white font-semibold">
                    AD
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">Anita Desai</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#f59e0b] text-[12px]">
                        4 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">3 weeks ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                Beautiful saree with excellent craftsmanship. The packaging was also very good. Only giving 4 stars because the delivery took a bit longer than expected. Otherwise, the product quality is fantastic.
              </p>
              <div class="flex space-x-2 mb-3">
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 3)}
                >
                  <img src="https://images.unsplash.com/photo-1623082574085-157d955f1d35?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 4)}
                >
                  <img src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
                <button 
                  class="w-16 h-16 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                  onclick={() => openImageCarousel(allReviewImages, 5)}
                >
                  <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200" alt="Customer review" class="w-full h-full object-cover" />
                </button>
              </div>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (19)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
            
            <!-- Review 5 - Meera Patel -->
            <div class="review-card py-4 border-b border-gray-100">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-[#14b8a6] flex items-center justify-center text-white font-semibold">
                    MP
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">Meera Patel</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#08a944] text-[12px]">
                        5 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">1 month ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                This is my third purchase from this seller and they never disappoint! The saree quality is consistent and premium. The blouse piece that comes with it is also of good quality. Highly recommend!
              </p>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (15)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
            
            <!-- Review 6 - Ritu Agarwal -->
            <div class="review-card py-4">
              <div class="flex items-start justify-between mb-3">
                <div class="flex items-start space-x-3">
                  <div class="w-10 h-10 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white font-semibold">
                    RA
                  </div>
                  <div>
                    <div class="flex items-center space-x-2 mb-1">
                      <p class="font-semibold">Ritu Agarwal</p>
                      <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Verified Purchase</span>
                    </div>
                    <div class="flex items-center space-x-2">
                      <div class="flex items-center px-1 rounded-sm text-white bg-[#08a944] text-[12px]">
                        5 <svg class="w-3 h-3 fill-white" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"></path></svg>
                      </div>
                      <span class="text-xs text-gray-500">1 month ago</span>
                    </div>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-700 mb-3">
                The saree arrived well-packaged and the quality exceeded my expectations. The red color is vibrant and the golden border adds a royal touch. Perfect for traditional occasions. Will definitely buy more from this store!
              </p>
              <div class="flex items-center space-x-4 text-sm">
                <button class="text-gray-600 hover:text-black flex items-center space-x-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>Helpful (12)</span>
                </button>
                <button class="text-gray-600 hover:text-black">Report</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
  
  <!-- Fullscreen Image Carousel Modal -->
  {#if isImageCarouselOpen && browser}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black"
      onclick={(e) => { if (e.target === e.currentTarget) closeImageCarousel(); }}
    >
      <!-- Close Button -->
      <button 
        onclick={closeImageCarousel}
        class="absolute top-3 sm:top-4 right-3 sm:right-4 z-[110] p-2 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        aria-label="Close gallery"
      >
        <X size={24} class="text-white sm:w-7 sm:h-7" />
      </button>
      
      <!-- Image Counter -->
      <div class="absolute top-3 sm:top-4 left-3 sm:left-4 z-[110] text-white/80 text-xs sm:text-sm font-medium bg-black/40 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
        {carouselStartIndex + 1} / {carouselImages.length}
      </div>
      
      <!-- Carousel Container -->
      <div class="w-full max-w-5xl mx-2 sm:mx-4 relative">
        <Splide 
          bind:this={splideInstance}
          options={carouselOptions} 
          aria-label="Review images gallery"
        >
          {#each carouselImages as image, i}
            <SplideSlide>
              <div class="flex items-center justify-center h-[70vh] sm:h-[80vh]">
                <img 
                  src={image} 
                  alt={`Review image ${i + 1}`} 
                  class="max-w-full max-h-[70vh] sm:max-h-[80vh] object-contain rounded-lg"
                />
              </div>
            </SplideSlide>
          {/each}
        </Splide>
        
        <!-- Navigation Arrows - Hidden on small mobile, shown on larger screens -->
        <button
          class="hidden sm:flex absolute left-2 md:-left-16 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors items-center justify-center"
          aria-label="Previous image"
          onclick={() => splideInstance?.go('<')}
        >
          <ArrowLeft class="text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
        
        <button
          class="hidden sm:flex absolute right-2 md:-right-16 top-1/2 -translate-y-1/2 z-10 p-2 md:p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors items-center justify-center"
          aria-label="Next image"
          onclick={() => splideInstance?.go('>')}
        >
          <ArrowRight class="text-white w-5 h-5 md:w-6 md:h-6" />
        </button>
      </div>
      
      <!-- Mobile Swipe Hint -->
      <div class="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-xs sm:text-sm flex items-center gap-2 sm:hidden">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"></path>
        </svg>
        <span>Swipe to navigate</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
        </svg>
      </div>
    </div>
  {/if}
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
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
    animation: fade-in 0.8s ease-out forwards;
    opacity: 0;
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
    opacity: 0;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }

  .clamped {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }
</style>
