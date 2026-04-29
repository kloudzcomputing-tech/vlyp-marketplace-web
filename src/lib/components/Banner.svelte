<script>
  import { browser } from "$app/environment";
  import { Splide, SplideSlide } from "@splidejs/svelte-splide";
  import "@splidejs/svelte-splide/css";

  import { ChevronLeft, ChevronRight } from "@lucide/svelte";

  import heroBanner1 from "$lib/assets/hero-banner-1.png";
  import heroBanner2 from "$lib/assets/hero-banner-2.png";
  import heroBanner3 from "$lib/assets/hero-banner-3.png";

  let splide;
  let currentSlide = 0;

  const options = {
    type: "loop",
    perPage: 1,
    autoplay: true,
    interval: 4000,
    pauseOnHover: true,
    arrows: false,
    pagination: false,
    speed: 500,
  };

  const banners = [
    {
      image: heroBanner1,
      link: "/products",
      alt: "Hero Banner 1",
    },
    {
      image: heroBanner2,
      link: "/products",
      alt: "Hero Banner 2",
    },
    {
      image: heroBanner3,
      link: "/products",
      alt: "Hero Banner 3",
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
            <a href={banner.link} class="block cursor-pointer">
              <img 
                src={banner.image} 
                alt={banner.alt}
                class="h-auto w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </a>
          </SplideSlide>
        {/each}
      </Splide>

      <!-- Navigation Arrows -->
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

      <!-- Dots Indicator -->
      <div class="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/15 px-3 py-2 backdrop-blur-sm">
        {#each banners as _, i}
          <button
            class="h-2.5 w-2.5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/70 focus:ring-offset-0 {currentSlide === i ? 'w-6 bg-white' : 'bg-white/45 hover:bg-white/70'}"
            aria-label={`Go to slide ${i + 1}`}
            on:click={() => goToSlide(i)}
          ></button>
        {/each}
      </div>
    </div>
  </div>
{:else}
  <!-- SSR Fallback -->
  <div class="relative mx-auto my-4 w-full max-w-7xl overflow-hidden rounded-xl shadow-sm ring-1 ring-black/5">
    <a href="/products" class="block cursor-pointer">
      <img 
        src={heroBanner1}
        alt="Hero Banner"
        class="h-auto w-full object-cover"
      />
    </a>
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
