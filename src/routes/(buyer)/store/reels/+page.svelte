<script>
    let { data } = $props();
    let reels = data?.reels;
    let selectedFilter = $state('Latest');
    
    const filters = ['Latest', 'Popular', 'Oldest'];
</script>

<div class="space-y-6">
    <!-- Filter Buttons -->
    <div class="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
        {#each filters as filter}
            <button
                onclick={() => (selectedFilter = filter)}
                class="px-4 py-2 text-sm font-medium rounded-lg border transition-colors whitespace-nowrap flex-shrink-0 {selectedFilter === filter
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'}"
            >
                {filter}
            </button>
        {/each}
    </div>

    <!-- Reels Grid -->
    {#if reels && reels.length > 0}
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  sm:gap-4">
            {#each reels as reel}
                <div class="flex-1 rounded-lg h-[300px] overflow-hidden bg-gray-50 ">
                    <iframe
                    width="100%"
                    height="100%"
                        class="w-full h-full rounded-lg"
                        src={reel.src}
                        title={reel.title}
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerpolicy="strict-origin-when-cross-origin"
                        allowfullscreen
                    ></iframe>
                </div>
            {/each}
        </div>
    {:else}
        <div class="text-center py-16">
            <p class="text-gray-500">No reels available</p>
        </div>
    {/if}
</div>

<style>
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
</style>
