<script>
    import SidePanel from '$lib/components/account/SidePanel.svelte';
  import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';
    import '../../app.css';
    
    let { children, data } = $props();
    let customer = data?.customer;
    let sidebarOpen = $state(false);

    function toggleSidebar() {
        sidebarOpen = !sidebarOpen;
    }

    function closeSidebar() {
        sidebarOpen = false;
    }
</script>

<div class="min-h-screen bg-gray-50">
    <Header  customer={customer} />
    
   
    <div class="flex mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 gap-4 lg:gap-6">
        <!-- Mobile Menu Button -->
        <button
            onclick={toggleSidebar}
            class="lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center"
            aria-label="Toggle menu"
        >
            <svg
                class="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
            >
                {#if sidebarOpen}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M6 18L18 6M6 6l12 12"
                    />
                {:else}
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                {/if}
            </svg>
        </button>

        <!-- Mobile Overlay -->
        {#if sidebarOpen}
            <button
                type="button"
                class="lg:hidden fixed inset-0 bg-black/50 z-30"
                onclick={closeSidebar}
                aria-label="Close sidebar"
            ></button>
        {/if}

        <!-- Sidebar -->
        <aside
            class="fixed lg:sticky top-0 left-0 z-100 lg:z-auto h-full lg:h-[calc(100vh-4rem)] w-72 lg:w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out {sidebarOpen
                ? 'translate-x-0'
                : '-translate-x-full lg:translate-x-0'} lg:overflow-y-auto overflow-y-auto"
        >
            <!-- <div class="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
                <h2 class="text-lg font-medium text-gray-900">Menu</h2>
                <button
                    onclick={closeSidebar}
                    class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close menu"
                >
                    <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div> -->
            <SidePanel {customer} onClose={() => closeSidebar()} />
        </aside>

        <!-- Main Content -->
        <main class="flex-1 w-full min-w-0">
            <div class="bg-white rounded-lg border border-gray-200  sm:p-6 lg:p-8">
                {@render children?.()}
            </div>
        </main>
    </div>

</div>

<style>
    /* Custom scrollbar for sidebar */
    aside::-webkit-scrollbar {
        width: 6px;
    }

    aside::-webkit-scrollbar-track {
        background: transparent;
    }

    aside::-webkit-scrollbar-thumb {
        background: #e5e7eb;
        border-radius: 3px;
    }

    aside::-webkit-scrollbar-thumb:hover {
        background: #d1d5db;
    }
</style>
