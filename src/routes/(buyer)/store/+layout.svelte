<script>
    import { page } from "$app/stores";
    import banner from "$lib/assets/banner.png";
    let { data, children } = $props();
    let store = data?.store;

    const isActive = (path) => {
        return $page.url.pathname === path || $page.url.pathname.startsWith(path + "/");
    };
</script>

<div class="min-h-screen bg-white">
    <!-- Banner -->
    <div class="h-20 sm:h-32 md:h-60 bg-black relative">
        <img
        src={banner}
        alt={store.name}
        class="w-full h-full object-cover"
    />
    </div>

    <!-- Store Header -->
    <div class="container-fluid pt-[60px]">
        <div class="flex flex-col sm:flex-row items-center sm:items-end gap-4 sm:gap-6 pb-4 sm:pb-6">
            <!-- Store Logo -->
            <div class=" w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden bg-white border-2 sm:border-4 border-white shadow-sm flex-shrink-0">
                <img
                    src={store.logo}
                    alt={store.name}
                    class="w-full h-full object-cover"
                />
            </div>

            <!-- Store Info -->
            <div class="flex-1 w-full sm:w-auto pb-2 text-center sm:text-left">
                <div class="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-3 sm:gap-4">
                    <div class="space-y-2 sm:space-y-3">
                        <h1 class="text-xl sm:text-2xl font-light text-gray-900">
                            {store.name}
                        </h1>
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <div class="flex items-center gap-1.5">
                                <span class="text-gray-900 font-medium">
                                    {store.rating}
                                </span>
                                <span>⭐</span>
                            </div>
                            <span class="hidden sm:inline">•</span>
                            <span>{store.reviews} reviews</span>
                            <span class="hidden sm:inline">•</span>
                            <span>{store.followers} followers</span>
                        </div>
                    </div>
                    <button
                        class="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex-shrink-0"
                    >
                        Follow
                    </button>
                </div>
            </div>
        </div>

        <!-- Navigation Tabs -->
        <nav class="flex items-center gap-1 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <a
                href="/{store.slug}"
                class="px-4 sm:px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 {isActive(`/${store.slug}`) && !isActive(`/${store.slug}/lives`) && !isActive(`/${store.slug}/reels`)
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'}"
            >
                Products
                {#if isActive(`/${store.slug}`) && !isActive(`/${store.slug}/lives`) && !isActive(`/${store.slug}/reels`)}
                    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                {/if}
            </a>
            <a
                href="/{store.slug}/lives"
                class="px-4 sm:px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 {isActive(`/${store.slug}/lives`)
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'}"
            >
                Lives
                {#if isActive(`/${store.slug}/lives`)}
                    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                {/if}
            </a>
            <a
                href="/{store.slug}/reels"
                class="px-4 sm:px-6 py-3 text-sm font-medium transition-colors relative whitespace-nowrap flex-shrink-0 {isActive(`/${store.slug}/reels`)
                    ? 'text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'}"
            >
                Reels
                {#if isActive(`/${store.slug}/reels`)}
                    <span class="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
                {/if}
            </a>
        </nav>
    </div>

    <!-- Page Content -->
    <div class="container-fluid py-4 sm:py-6 lg:py-8">
        {@render children?.()}
    </div>
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
