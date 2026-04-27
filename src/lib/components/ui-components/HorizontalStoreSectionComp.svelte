<script>
  import { ArrowRight } from "@lucide/svelte";
  let { card } = $props();
</script>

<div class="col-span-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
  <!-- Header -->
  <div class="border-b border-slate-100 bg-slate-50/70 px-4 py-3">
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
  <div class="scrollbar-hide flex snap-x snap-mandatory gap-3 overflow-x-auto p-3 md:grid md:grid-cols-3">
    {#each card.items as store}
      <a href={`/subs-store/${store.slug}`} class="group relative min-w-full snap-center overflow-hidden rounded-lg md:min-w-0">
        <img src={store.img} alt={store.name} class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
        <div class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4">
          <span class="inline-flex rounded-lg bg-white/95 px-4 py-2 text-sm font-semibold text-slate-900">
            {store.name}
          </span>
        </div>
      </a>
    {/each}
  </div>
</div>
