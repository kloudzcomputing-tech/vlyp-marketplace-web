<script>
    import SidePanel from '$lib/components/account/SidePanel.svelte';
  import Footer from '$lib/components/Footer.svelte';
    import Header from '$lib/components/Header.svelte';
    import MobileNav from '$lib/components/mobienav/MobileNav.svelte';
    import { page } from '$app/state';
    import '../../app.css';
    
    let { children, data } = $props();
    let customer = $derived(data?.customer);

    const tabs = [
        {
            id: 1,
            label: "Profile",
            path: "/account",
            icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M4 18C4 16.9391 4.42143 15.9217 5.17157 15.1716C5.92172 14.4214 6.93913 14 8 14H16C17.0609 14 18.0783 14.4214 18.8284 15.1716C19.5786 15.9217 20 16.9391 20 18" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="7" r="4"/>
            </svg>`,
        },
        {
            id: 2,
            label: "Orders",
            path: "/account/orders",
            icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M13 22V11M2 13H5M2 16H5M9.326 9.691L6.405 8.278C4.802 7.502 4 7.114 4 6.5C4 5.886 4.802 5.498 6.405 4.722L9.325 3.309C11.13 2.436 12.03 2 13 2C13.97 2 14.871 2.436 16.674 3.309L19.595 4.722C21.198 5.498 22 5.886 22 6.5C22 7.114 21.198 7.502 19.595 8.278L16.675 9.691C14.87 10.564 13.97 11 13 11" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        },
        {
            id: 3,
            label: "Addresses",
            path: "/account/addresses",
            icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M12 22C12 22 20 16 20 10C20 6.13401 16.4183 3 12 3C7.58172 3 4 6.13401 4 10C4 16 12 22 12 22Z"/>
                <circle cx="12" cy="10" r="3"/>
            </svg>`,
        },
        {
            id: 6,
            label: "Following",
            path: "/account/followings",
            icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M3.5 10V15C3.5 17.828 3.5 19.243 4.379 20.121C5.257 21 6.672 21 9.5 21H14.5C17.328 21 18.743 21 19.621 20.121C20.5 19.243 20.5 17.828 20.5 15V10" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M17.0002 7.502C17 8.16504 16.7363 8.80082 16.2673 9.26947C16.035 9.50153 15.7594 9.68557 15.456 9.81108C15.1527 9.9366 14.8275 10.0011 14.4992 10.001C14.1709 10.0009 13.8459 9.93607 13.5426 9.81032C13.2393 9.68456 12.9638 9.5003 12.7318 9.26806C12.2631 8.79903 12 8.16304 12.0002 7.5C12.0002 8.16304 11.7368 8.79893 11.268 9.26777C10.7992 9.73661 10.1633 10 9.50023 10C8.83719 10 8.2013 9.73661 7.73246 9.26777C7.26362 8.79893 7.00023 8.16304 7.00023 7.5C7.00023 8.88 5.82723 10 4.37923 10C3.59923 10 2.90023 9.676 2.42023 9.16C1.59523 8.276 2.12623 6.974 2.81423 5.988L3.20223 5.458C4.08423 4.253 4.52523 3.65 5.16523 3.325C5.80523 3 6.55223 3 8.04523 3L15.9552 3.001C17.4482 3.001 18.1952 3.001 18.8352 3.327C19.4752 3.651 19.9152 4.254 20.7972 5.46L21.1862 5.99C21.8742 6.976 22.4062 8.278 21.5802 9.163C21.3288 9.42986 21.0251 9.64208 20.6881 9.78642C20.351 9.93077 19.9879 10.0042 19.6212 10.002C18.1732 10.002 17.0002 8.882 17.0002 7.502Z" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        },
        {
            id: 7,
            label: "Reviews",
            path: "/account/reviews-and-ratings",
            icon: `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M8 4L9.344 7.514L13 7.729L10.097 10.167L11.055 13.686L8 11.823L4.945 13.686L5.903 10.167L3 7.729L6.656 7.514L8 4Z" stroke-linejoin="round"/>
                <path d="M8.868 15L8 14.5L10 11H13C13.1314 11.0002 13.2615 10.9745 13.3829 10.9243C13.5043 10.8741 13.6146 10.8004 13.7075 10.7075C13.8004 10.6146 13.8741 10.5043 13.9243 10.3829C13.9745 10.2615 14.0002 10.1314 14 10V4C14.0002 3.86862 13.9745 3.7385 13.9243 3.61708C13.8741 3.49567 13.8004 3.38535 13.7075 3.29245C13.6146 3.19955 13.5043 3.1259 13.3829 3.07572C13.2615 3.02553 13.1314 2.9998 13 3H3C2.86862 2.9998 2.7385 3.02553 2.61708 3.07572C2.49567 3.1259 2.38535 3.19955 2.29245 3.29245C2.19955 3.38535 2.1259 3.49567 2.07572 3.61708C2.02553 3.7385 1.9998 3.86862 2 4V10C1.9998 10.1314 2.02553 10.2615 2.07572 10.3829C2.1259 10.5043 2.19955 10.6146 2.29245 10.7075C2.38535 10.8004 2.49567 10.8741 2.61708 10.9243C2.7385 10.9745 2.86862 11.0002 3 11H7.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
        },
    ];

    let currentPath = $derived(page.url.pathname);

    const handleLogout = () => {
        fetch("/api/auth/logout", {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status) {
                    location.href = "/";
                }
            });
    };
</script>

<div class="min-h-screen bg-gray-50 pb-24 lg:pb-0">
    <Header  customer={customer} />
    
    <!-- Mobile Tab Menu (below lg) -->
    <div class="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div class="flex overflow-x-auto scrollbar-hide">
            {#each tabs as tab}
                {@const isActive = currentPath === tab.path}
                <a
                    href={tab.path}
                    class="flex flex-col items-center justify-center min-w-[72px] px-3 py-3 space-y-1 transition-all {isActive ? 'text-[var(--primary-color)] border-b-2 border-[var(--primary-color)] bg-[var(--primary-color)]/10' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50/30'}"
                >
                    <div class="{isActive ? 'text-[var(--primary-color)]' : 'text-gray-500'}">
                        {@html tab.icon}
                    </div>
                    <span class="text-[11px] font-medium whitespace-nowrap">{tab.label}</span>
                </a>
            {/each}
            <!-- Logout button for mobile -->
            <button
                onclick={handleLogout}
                class="flex flex-col items-center justify-center min-w-[72px] px-3 py-3 space-y-1 text-gray-500 hover:text-red-600 hover:bg-red-50/30 transition-all"
            >
                <div class="text-gray-500 hover:text-red-600">
                    <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M15.5 8.03989C15.459 6.87989 15.322 6.15489 14.864 5.58689C14.211 4.77489 13.094 4.52089 10.86 4.01089L9.86 3.78289C6.465 3.00889 4.768 2.62189 3.634 3.51289C2.5 4.40489 2.5 6.12589 2.5 9.56789V14.4319C2.5 17.8739 2.5 19.5959 3.634 20.4869C4.768 21.3779 6.464 20.9909 9.859 20.2169L10.861 19.9889C13.094 19.4789 14.211 19.2249 14.864 18.4129C15.322 17.8459 15.459 17.1199 15.5 15.9599M18.5 9.01189C18.5 9.01189 21.5 11.2219 21.5 12.0119C21.5 12.8019 18.5 15.0119 18.5 15.0119M21 12.0119H8.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                <span class="text-[11px] font-medium whitespace-nowrap">Logout</span>
            </button>
        </div>
    </div>
   
    <div class="flex mx-auto w-full max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 gap-4 lg:gap-6">
        <!-- Sidebar (lg and above) -->
        <aside
            class="hidden lg:block sticky top-0 lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto"
        >
            <SidePanel {customer} onClose={() => {}} />
        </aside>

        <!-- Main Content -->
        <main class="flex-1 w-full min-w-0">
            <div class="bg-white rounded-lg sm:border sm:border-gray-200 sm:p-6 lg:p-8">
                {@render children?.()}
            </div>
        </main>
    </div>
    <MobileNav {customer} />
</div>

<style>
    /* Hide scrollbar for mobile tab menu */
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

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
