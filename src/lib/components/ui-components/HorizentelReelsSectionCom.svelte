<script>
  import { ChevronsRight, ArrowRight } from "@lucide/svelte";

  let { card } = $props();

  const playVideo = (e) => {
    e.currentTarget.play();
  };

  const pauseVideo = (e) => {
    e.currentTarget.pause();
    e.currentTarget.currentTime = 0;
  };
</script>

<div class="bg-white col-span-3 max-h-[660px] rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
  <!-- Header -->
  <div class="px-4 pt-2 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-lg  font-bold text-gray-900">Reels</p>
       
      </div>
      <a 
        href={'/reels'} 
        class="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors rounded-lg hover:bg-[var(--primary-color)]/5"
      >
        <span class="hidden sm:inline">View All</span>
        <span class="sm:hidden">All</span>
        <ArrowRight size={16} class="transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  </div>

  <div class="flex scrollbar-hide md:grid p-2 md:grid-cols-5 gap-3 overflow-x-auto">
    {#each card.items as reel}
      <a href={reel.href} aria-label={reel.title} class="min-w-[150px] md:min-h-[350px]  max-h-[280px] overflow-hidden rounded-[10px] relative">
        <video
          class="w-full h-full object-cover"
          muted
          loop
          playsinline
          onmouseenter={playVideo}
          onmouseleave={pauseVideo}
        >
          <source src={reel.video} type="video/mp4" />
        </video>
      </a>
    {/each}
  </div>
</div>
