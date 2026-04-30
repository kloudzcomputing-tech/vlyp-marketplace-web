<script>
  import { page } from '$app/state';
  import LoginModal from '../auth/LoginModal.svelte';
  import { hideBottomNav } from '$lib/stores/dropsNav.js';

  let { customer = null } = $props();

  let openLoginModal = $state(false);

  let path = $derived(page.url.pathname);

  let isHome = $derived(path === '/');
  let isDrops = $derived(path === '/drops');
  let isSearch = $derived(path === '/search');
  let isAccount = $derived(path === '/account' || path.startsWith('/account/'));

  // Subscribe to hideBottomNav store
  let shouldHideNav = $state(false);
  $effect(() => {
    const unsubscribe = hideBottomNav.subscribe(value => {
      shouldHideNav = value;
    });
    return unsubscribe;
  });
</script>

<!-- Modern floating bottom nav bar - hide on drops page -->
<nav class="mobile-nav-wrapper" class:hidden={isDrops || shouldHideNav} aria-label="Mobile navigation">
  <div class="mobile-nav-bar">

    <!-- Home -->
    <a href="/" class="nav-item" class:active={isHome} aria-label="Home">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
          <path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        </svg>
      </div>
      <span class="nav-label">Home</span>
    </a>

    <!-- Reels -->
    <a href="/drops" class="nav-item" class:active={isDrops} aria-label="Reels">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
          <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
          <rect x="2" y="6" width="14" height="12" rx="2" />
        </svg>
      </div>
      <span class="nav-label">Reels</span>
    </a>

    <!-- Search -->
    <a href="/search" class="nav-item" class:active={isSearch} aria-label="Search">
      <div class="nav-icon-wrap">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      <span class="nav-label">Search</span>
    </a>

    <!-- Profile / Login -->
    {#if customer}
      <a href="/account" data-sveltekit-reload="true" class="nav-item" class:active={isAccount} aria-label="Account">
        <div class="nav-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <span class="nav-label">Account</span>
      </a>
    {:else}
      <button onclick={() => (openLoginModal = true)} class="nav-item" aria-label="Login">
        <div class="nav-icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="12" cy="8" r="5" />
            <path d="M20 21a8 8 0 0 0-16 0" />
          </svg>
        </div>
        <span class="nav-label">Login</span>
      </button>
    {/if}

  </div>
</nav>

<LoginModal
  open={openLoginModal}
  onClose={() => (openLoginModal = false)}
  onLoggedIn={() => {
    location.reload();
  }}
/>

<style>
  /* ──────── Wrapper ──────── */
  .mobile-nav-wrapper {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 9999;
    padding: 0;
    pointer-events: none;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  .mobile-nav-wrapper.hidden {
    transform: translateY(100%);
    opacity: 0;
    pointer-events: none;
  }

  @media (min-width: 640px) {
    .mobile-nav-wrapper {
      display: none;
    }
  }

  /* ──────── Glass bar ──────── */
  .mobile-nav-bar {
    pointer-events: auto;
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    width: 100%;
    padding: 8px 6px 8px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(18px) saturate(180%);
    -webkit-backdrop-filter: blur(18px) saturate(180%);
    box-shadow: 0 -1px 12px rgba(0, 0, 0, 0.06);
    border-top: 1px solid rgba(0, 0, 0, 0.04);
  }

  /* ──────── Nav item ──────── */
  .nav-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    flex: 1;
    padding: 4px 0 2px;
    background: none;
    border: none;
    cursor: pointer;
    text-decoration: none;
    color: #9ca3af;
    transition: color 0.25s ease, transform 0.2s ease;
    -webkit-tap-highlight-color: transparent;
    position: relative;
  }

  .nav-item:active {
    transform: scale(0.90);
  }

  /* Active state - violet theme */
  .nav-item.active {
    color: #FF3F6C;
  }

  .nav-item.active .nav-label {
    color: #FF3F6C;
    font-weight: 700;
  }


  .nav-item.active::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #FF3F6C;
    animation: dotPop 0.3s ease forwards;
  }

  @keyframes dotPop {
    0% { transform: translateX(-50%) scale(0); opacity: 0; }
    60% { transform: translateX(-50%) scale(1.3); opacity: 1; }
    100% { transform: translateX(-50%) scale(1); opacity: 1; }
  }

  /* ──────── Icon wrapper ──────── */
  .nav-icon-wrap {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12px;
    transition: background 0.25s ease, transform 0.25s ease;
  }

  .nav-item.active .nav-icon-wrap {
    background: rgba(255, 61, 106, 0.12);
    transform: translateY(-2px);
  }

  .nav-item.active .nav-icon-wrap svg {
    fill: rgba(255, 61, 106, 0.15);
    stroke: #ff3d6a;
  }

  /* ──────── Label ──────── */
  .nav-label {
    font-size: 10px;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.01em;
    transition: color 0.25s ease, font-weight 0.25s ease;
  }

</style>