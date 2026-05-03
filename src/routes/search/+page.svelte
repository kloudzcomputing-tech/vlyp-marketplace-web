<script>
    import MobileNav from '$lib/components/mobienav/MobileNav.svelte';
    import { goto } from '$app/navigation';

    let { data } = $props();
    let customer = $derived(data?.customer);
</script>

<div class="min-h-screen bg-white pb-24 md:pb-0">
    <!-- Top Search Bar -->
    <div class="flex items-center gap-3 p-4 bg-white sticky top-0 z-10">
        <button onclick={() => goto('/')} class="p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-600">
            <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
        </button>
        <div class="flex-1 relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.3-4.3"></path>
                </svg>
            </div>
            <input 
                type="text" 
                class="w-full bg-purple-50 border border-purple-100 text-gray-900 text-sm rounded-2xl focus:ring-[var(--primary-color)] focus:border-[var(--primary-color)] block pl-10 p-3 outline-none" 
                placeholder="Search snacks, drinks..." 
            />
        </div>
    </div>

    <!-- Main Content -->
    <div class="px-4 py-2 space-y-8">
        
        <!-- Recent Searches -->
        <div>
            <div class="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-wide">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                RECENT SEARCHES
            </div>
            <div class="flex flex-wrap gap-3">
                <button class="px-5 py-2 rounded-full border border-gray-100 bg-white shadow-sm text-sm font-bold text-slate-700 hover:bg-gray-50 transition-colors">Avocado</button>
                <button class="px-5 py-2 rounded-full border border-gray-100 bg-white shadow-sm text-sm font-bold text-slate-700 hover:bg-gray-50 transition-colors">Milk</button>
            </div>
        </div>

        <!-- Trending Searches -->
        <div>
            <div class="flex items-center gap-2 mb-4 text-slate-400 font-bold text-xs uppercase tracking-wide">
                <svg class="w-5 h-5 text-[var(--primary-color)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                </svg>
                TRENDING SEARCHES
            </div>
            <div class="flex flex-wrap gap-3">
                <button class="px-5 py-2 rounded-full border border-lime-200 bg-lime-50 text-sm font-bold text-lime-800 hover:bg-lime-100 transition-colors">Coca Cola</button>
                <button class="px-5 py-2 rounded-full border border-lime-200 bg-lime-50 text-sm font-bold text-lime-800 hover:bg-lime-100 transition-colors">Lays</button>
                <button class="px-5 py-2 rounded-full border border-lime-200 bg-lime-50 text-sm font-bold text-lime-800 hover:bg-lime-100 transition-colors">Maggi</button>
                <button class="px-5 py-2 rounded-full border border-lime-200 bg-lime-50 text-sm font-bold text-lime-800 hover:bg-lime-100 transition-colors">T-shirts</button>
                <button class="px-5 py-2 rounded-full border border-lime-200 bg-lime-50 text-sm font-bold text-lime-800 hover:bg-lime-100 transition-colors">Airpods</button>
            </div>
        </div>

        <!-- Categories -->
        <div>
            <div class="mb-4 text-slate-400 font-bold text-xs uppercase tracking-wide">
                CATEGORIES
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🍿</span>
                    <span class="text-sm font-bold text-slate-800">Snacks</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🥤</span>
                    <span class="text-sm font-bold text-slate-800">Drinks</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">👕</span>
                    <span class="text-sm font-bold text-slate-800">Fashion</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🎧</span>
                    <span class="text-sm font-bold text-slate-800">Electronics</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">💄</span>
                    <span class="text-sm font-bold text-slate-800">Beauty</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🏠</span>
                    <span class="text-sm font-bold text-slate-800">Home</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🥦</span>
                    <span class="text-sm font-bold text-slate-800">Groceries</span>
                </div>
                <div class="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-gray-100 bg-gray-50 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <span class="text-2xl">🧴</span>
                    <span class="text-sm font-bold text-slate-800">Personal Care</span>
                </div>
            </div>
        </div>

    </div>
</div>

<MobileNav {customer} />
