<script>
  import { browser } from "$app/environment";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";

  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  let splide;
  let currentSlide = 0;

  const options = {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 5000,
    pauseOnHover: true,
    arrows: false,
    pagination: false,
    speed: 600,
  };


  const banners = [
    {
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80",
      title: "Makeup",
      subtitle: "UNDER ₹299",
      cta: "Shop Now",
      bgGradient: "linear-gradient(135deg, #31111d 0%, #4b1735 45%, #0f0f11 100%)",
      glow: "rgba(244, 114, 182, 0.28)",
    },
    {
      image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&q=80",
      title: "Skincare",
      subtitle: "UP TO 50% OFF",
      cta: "Explore",
      bgGradient: "linear-gradient(135deg, #102548 0%, #1d3c7a 45%, #0d1117 100%)",
      glow: "rgba(96, 165, 250, 0.24)",
    },
    {
      image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=1200&q=80",
      title: "Fragrances",
      subtitle: "PREMIUM COLLECTION",
      cta: "Discover",
      bgGradient: "linear-gradient(135deg, #3a2410 0%, #7c3f10 45%, #161616 100%)",
      glow: "rgba(251, 191, 36, 0.24)",
    },
    {
      image: "https://images.unsplash.com/photo-1551848994-cf79721b1faf?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "Hair Care",
      subtitle: "BESTSELLERS",
      cta: "Shop Now",
      bgGradient: "linear-gradient(135deg, #42131d 0%, #7b1730 45%, #131112 100%)",
      glow: "rgba(251, 113, 133, 0.24)",
    },
    {
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=1200&q=80",
      title: "Beauty Tools",
      subtitle: "NEW ARRIVALS",
      cta: "Buy Now",
      bgGradient: "linear-gradient(135deg, #231245 0%, #4d2391 45%, #11111a 100%)",
      glow: "rgba(167, 139, 250, 0.26)",
    },
    {
      image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=80",
      title: "Personal Care",
      subtitle: "DAILY ESSENTIALS",
      cta: "Shop Now",
      bgGradient: "linear-gradient(135deg, #0b3130 0%, #0f766e 45%, #111827 100%)",
      glow: "rgba(45, 212, 191, 0.22)",
    },
  ];

  function handleMove(e) {
    currentSlide = e.detail.index;
  }

  function goToSlide(index) {
    splide.go(index);
  }
</script>

{#if browser}
  <div class="relative mx-auto w-full max-w-7xl px-3 pt-3 md:px-4 md:pt-4">
    <div class="group relative overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
      <Splide
        bind:this={splide}
        {options}
        aria-label="Product Banner Carousel"
        on:move={handleMove}
      >
        {#each banners as banner, i}
          <SplideSlide>
            <div
              class="relative min-h-[320px] overflow-hidden md:min-h-[360px] lg:min-h-[400px]"
              style={`background: ${banner.bgGradient};`}
            >
              <div class="relative grid h-full items-center gap-8 px-6 py-8 md:px-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
                <div class="order-2 flex flex-col items-start gap-3 text-left md:gap-4 lg:order-1">
                  <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
                    Featured edit
                  </span>
                  <h2 class="max-w-[12ch] text-4xl font-bold text-white md:text-5xl lg:text-6xl" style="font-family: 'Georgia', serif;">
                    {banner.title}
                  </h2>
                  <p class="text-lg font-semibold tracking-wide text-white/85 md:text-2xl">
                    {banner.subtitle}
                  </p>
                  <button class="mt-2 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 md:text-base">
                    {banner.cta}
                  </button>
                </div>

                <div class="order-1 flex items-center justify-center lg:order-2">
                  <div class="relative transform transition-transform duration-700 hover:scale-[1.02]">
                    <img 
                      src={banner.image} 
                      alt={banner.title}
                      class="h-[180px] w-auto object-contain drop-shadow-2xl md:h-[240px] lg:h-[320px]"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                   
                    <div class="absolute inset-0 -z-10 scale-150 rounded-full blur-3xl" style={`background:${banner.glow};`}></div>
                  </div>
                </div>
              </div>

            
              <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none"></div>
            </div>
          </SplideSlide>
        {/each}
      </Splide>

      <button
        class="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 p-2 text-white transition-all duration-300 hover:bg-black/35 md:flex"
        aria-label="Previous slide"
        on:click={() => splide.go("<")}
      >
        <ChevronLeft size={24} strokeWidth={2}/>
      </button>

   
      <button
        class="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/20 p-2 text-white transition-all duration-300 hover:bg-black/35 md:flex"
        aria-label="Next slide"
        on:click={() => splide.go(">")}
      >
        <ChevronRight size={24} strokeWidth={2}/>
      </button>


      <div class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-sm">
        {#each banners as _, i}
          <button
            class="h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0 {currentSlide === i ? 'w-6 bg-white' : 'bg-white/45 hover:bg-white/70'}"
            aria-label={`Go to slide ${i + 1}`}
            on:click={() => goToSlide(i)}
          />
        {/each}
      </div>
    </div>
  </div>
{:else}
  <!-- SSR Fallback -->
  <div class="relative mx-auto my-4 w-full max-w-7xl overflow-hidden rounded-xl bg-[linear-gradient(135deg,#31111d_0%,#4b1735_45%,#0f0f11_100%)] px-6 py-8 shadow-sm ring-1 ring-black/5 md:px-10 lg:grid lg:grid-cols-[0.95fr_1.05fr] lg:px-14">
    <div class="order-2 flex flex-col items-start gap-3 text-left md:gap-4 lg:order-1">
      <span class="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/90">
        Featured edit
      </span>
      <h2 class="max-w-[12ch] text-4xl font-bold text-white md:text-5xl lg:text-6xl" style="font-family: 'Georgia', serif;">
        Makeup
      </h2>
      <p class="text-lg font-semibold tracking-wide text-white/85 md:text-2xl">
        UNDER ₹299
      </p>
      <button class="mt-2 inline-flex items-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 md:text-base">
        Shop Now
      </button>
    </div>
    <div class="order-1 flex items-center justify-center lg:order-2">
      <div class="relative">
        <img 
          src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200&q=80" 
          alt="Makeup"
          class="h-[180px] w-auto object-contain drop-shadow-2xl md:h-[240px] lg:h-[320px]"
        />
        <div class="absolute inset-0 -z-10 scale-150 rounded-full blur-3xl" style="background: rgba(244, 114, 182, 0.28);"></div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.splide__arrows) {
    display: none;
  }
  
  :global(.splide__pagination) {
    display: none;
  }

  :global(.splide__slide) {
    transition: opacity 0.6s ease;
  }

  /* Smooth transition for slide content */
  :global(.splide__slide img) {
    transition: transform 0.7s ease;
  }

  :global(.splide__slide.is-active img) {
    transform: scale(1);
  }
</style>
