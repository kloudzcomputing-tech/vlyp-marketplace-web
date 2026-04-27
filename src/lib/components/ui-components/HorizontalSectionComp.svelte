<script>
  import { ArrowRight } from "@lucide/svelte";

  let { card, href = "#" } = $props();
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
        href={href} 
        class="group flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm font-semibold text-[var(--primary-color)] hover:text-[var(--primary-color)]/80 transition-colors rounded-lg hover:bg-[var(--primary-color)]/5"
      >
        <span class="hidden sm:inline">View All</span>
        <span class="sm:hidden">All</span>
        <ArrowRight size={16} class="transition-transform duration-200 group-hover:translate-x-0.5" />
      </a>
    </div>
  </div>

  <!-- Cards Grid -->
  <div class="p-3">
    <div class="scrollbar-hide flex gap-3 overflow-x-auto md:grid md:grid-cols-6">
      {#each card.items as collection, index}
        <a
          href={collection.href || href}
          class="card-item group min-w-[160px] cursor-pointer overflow-hidden rounded-lg border border-slate-200 bg-white transition-all duration-300 hover:border-slate-300 hover:shadow-md md:min-w-0"
          style="animation-delay: {index * 0.05}s;"
        >
          <!-- Image Container -->
          <div class="relative bg-white aspect-square overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center p-3 sm:p-4">
              <img
                src={collection.img}
                alt={collection.title || collection.subtitle}
                class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <!-- Content -->
          <div class="p-3 sm:p-4">
            {#if collection.title}
              <h3 class="line-clamp-2 text-sm font-medium text-slate-900 transition-colors group-hover:text-[var(--primary-color)]">
                {collection.title}
              </h3>
            {/if}
            {#if collection.price}
              <p class="line-clamp-2 pt-1 text-xs font-bold text-emerald-700">
                {collection.price}
              </p>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</div>

<style>
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .card-item {
    animation: fadeInUp 0.4s ease-out forwards;
    opacity: 0;
  }

  @media (prefers-reduced-motion: reduce) {
    .card-item {
      animation: none;
      opacity: 1;
    }
  }
</style>
