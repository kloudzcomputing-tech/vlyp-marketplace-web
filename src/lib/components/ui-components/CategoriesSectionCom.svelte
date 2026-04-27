<script>
  import { ArrowRight } from "@lucide/svelte";

  let { card } = $props();
</script>

<div class="col-span-3 overflow-hidden rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">
  <!-- Header Section -->
  <!-- Header -->
  <div class="border-b border-slate-100 bg-slate-50/70 pb-3">
    <div class="flex items-center justify-between gap-3">
      <div>
        <p class="text-base font-semibold text-slate-900 md:text-lg">{card.label}</p>
        {#if card.description}
          <p class="mt-0.5 text-xs text-slate-500 sm:text-sm">{card.description}</p>
        {/if}
      </div>
      <a 
        href={'/'} 
        class="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors rounded-lg hover:bg-[var(--primary-color)]/5"
      >
        <span class="hidden sm:inline">View All</span>
        <span class="sm:hidden">All</span>
        <ArrowRight size={16} class="transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  </div>

  <!-- Categories Grid -->
  <div
    class="scrollbar-hide flex items-center gap-4 overflow-x-auto py-4 md:gap-7"
  >
    {#each card.items as item}
      <a 
        data-sveltekit-reload 
        href={item.href}
        class="group flex-shrink-0 cursor-pointer bg-transparent border-none p-0"
      >
        <div class="flex flex-col items-center space-y-3 text-center">
          <!-- Category Image Container -->
          <div class="relative">
            <figure
              class="relative h-18 w-18 overflow-hidden rounded-full border border-slate-200 bg-slate-50 transition-all duration-300 ease-out group-hover:scale-105 group-hover:border-[var(--primary-color)] group-hover:shadow-md md:h-24 md:w-24"
            >
              <img 
                src={item.img} 
                alt={item.title}
                class="h-full w-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
              />
            </figure>
          </div>
          
          <p
            class="text-xs font-medium leading-tight text-slate-700 transition-colors duration-300 group-hover:text-[var(--primary-color)] md:text-sm"
          >
            {item.title}
        </p>
        </div>
      </a>
    {/each}
  </div>
</div>

<style>
  /* Smooth scroll behavior */
  :global(.scrollbar-hide) {
    scroll-behavior: smooth;
  }
  
  :global(.scrollbar-hide::-webkit-scrollbar) {
    height: 6px;
  }
  
  :global(.scrollbar-hide::-webkit-scrollbar-track) {
    background: transparent;
  }
  
  :global(.scrollbar-hide::-webkit-scrollbar-thumb) {
    background: rgba(15, 23, 42, 0.16);
    border-radius: 3px;
  }
  
  :global(.scrollbar-hide::-webkit-scrollbar-thumb:hover) {
    background: rgba(15, 23, 42, 0.28);
  }
</style>
