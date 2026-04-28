<script>
  import { page } from '$app/state';
  import LoginModal from '../auth/LoginModal.svelte';

  let { customer = null } = $props();

  let openLoginModal = $state(false);

  let path = $derived(page.url.pathname);

  let isHome = $derived(path === '/');
  let isCategories = $derived(path === '/categories');
  let isDrops = $derived(path === '/drops');
  let isAccount = $derived(path === '/account');
</script>

<nav class="fixed bottom-0 left-0 right-0 w-full z-50 border-t border-black/5 sm:hidden bg-white">
  <div class="px-4 py-2">
    <div class="flex items-center justify-around gap-2">

      <!-- Home -->
      <a href="/" class="flex-1 flex flex-col items-center gap-1">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isHome ? '#FC8019' : 'none'}
            stroke={isHome ? '#000' : '#6b7280'}
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
            <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          </svg>
        </div>
        <span class="text-xs {isHome ? 'font-bold text-black' : 'font-medium text-gray-600'}">
          Home
        </span>
      </a>

      <!-- Categories -->
      <a href="/categories" class="flex-1 flex flex-col items-center gap-1">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isCategories ? '#FC8019' : 'none'}
            stroke={isCategories ? '#000' : '#6b7280'}
            stroke-width="2"
          >
            <rect width="7" height="7" x="3" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="3" rx="1" />
            <rect width="7" height="7" x="14" y="14" rx="1" />
            <rect width="7" height="7" x="3" y="14" rx="1" />
          </svg>
        </div>
        <span class="text-xs {isCategories ? 'font-bold text-black' : 'font-medium text-gray-600'}">
          Categories
        </span>
      </a>

      <!-- Reels -->
      <a href="/drops" class="flex-1 flex flex-col items-center gap-1">
        <div class="w-8 h-8 flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={isDrops ? '#FC8019' : 'none'}
            stroke={isDrops ? '#000' : '#6b7280'}
            stroke-width="2"
          >
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
          </svg>
        </div>
        <span class="text-xs {isDrops ? 'font-bold text-black' : 'font-medium text-gray-600'}">
          Reels
        </span>
      </a>

      <!-- Profile / Login -->
      {#if customer}
        <a href="/account" data-sveltekit-reload="true" class="flex-1 flex flex-col items-center gap-1">
          <div class="w-8 h-8 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isAccount ? '#FC8019' : 'none'}
              stroke={isAccount ? '#000' : '#6b7280'}
              stroke-width="2"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <span class="text-xs {isAccount ? 'font-bold text-black' : 'font-medium text-gray-600'}">
            Account
          </span>
        </a>
      {:else}
        <button onclick={() => (openLoginModal = true)} class="flex-1 flex flex-col items-center gap-1 bg-transparent border-none cursor-pointer p-0">
          <div class="w-8 h-8 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              stroke-width="2"
            >
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 0 0-16 0" />
            </svg>
          </div>
          <span class="text-xs font-medium text-gray-600">
            Login
          </span>
        </button>
      {/if}

    </div>
  </div>
</nav>

<LoginModal
  open={openLoginModal}
  onClose={() => (openLoginModal = false)}
  onLoggedIn={() => {
    location.reload();
  }}
/>