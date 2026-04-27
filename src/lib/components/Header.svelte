<script>
  import { goto } from "$app/navigation";
  import { cart } from "$lib/stores/cart";
  import { onMount } from "svelte";
  import {
    ShoppingCartIcon,
    UserIcon,
    ChevronDownIcon,
    ChevronRightIcon,
    Search,
  } from "@lucide/svelte";
  import LoginModal from "./auth/LoginModal.svelte";

  let { isLoggedIn, customer, showMenu = true } = $props();
  let searchQuery = $state("");
  let openLoginModal = $state(false);
  let activeCategoryId = $state("popular");

  const menu = [
    {
      id: "popular",
      label: "Popular",
      icon: "🔥",
      path: "/",
      subcategories: [
        { name: "Electronics", path: "/cat?cs=popular", count: "1,234" },
        { name: "Fashion", path: "/cat?cs=popular", count: "856" },
        {
          name: "Smartphones",
          path: "/cat?cs=popular&sub=smartphones",
          count: "643",
        },
        { name: "Laptops", path: "/cat?cs=popular&sub=laptops", count: "432" },
        { name: "Tablets", path: "/cat?cs=popular&sub=tablets", count: "521" },
        {
          name: "Smartwatches",
          path: "/cat?cs=popular&sub=smartwatches",
          count: "389",
        },
        {
          name: "Headphones",
          path: "/cat?cs=popular&sub=headphones",
          count: "2,104",
        },
      ],
      trending: [
        { name: "iPhone 15 Pro", brand: "Apple", price: "₹999", icon: "📱" },
        { name: "MacBook Air M3", brand: "Apple", price: "₹1,299", icon: "💻" },
        { name: "AirPods Pro", brand: "Apple", price: "₹249", icon: "🎧" },
        {
          name: "Galaxy S24 Ultra",
          brand: "Samsung",
          price: "₹1,199",
          icon: "📱",
        },
        { name: "PlayStation 5", brand: "Sony", price: "₹499", icon: "🎮" },
        { name: "iPad Pro 12.9", brand: "Apple", price: "₹1,099", icon: "📱" },
      ],
    },
    {
      id: "kurtis-sarees",
      label: "Kurtis & Sarees",
      icon: "👗",
      path: "/cat?cs=kurtis-sarees",
      subcategories: [
        {
          name: "Silk Sarees",
          path: "/cat?cs=kurtis-sarees&sub=silk-sarees",
          count: "3,456",
        },
        {
          name: "Cotton Sarees",
          path: "/cat?cs=kurtis-sarees&sub=cotton-sarees",
          count: "4,234",
        },
        {
          name: "All Kurtis",
          path: "/cat?cs=kurtis-sarees&sub=silk-kurtis",
          count: "1,876",
        },
        {
          name: "Anarkali Kurtis",
          path: "/cat?cs=kurtis-sarees&sub=cotton-kurtis",
          count: "2,543",
        },
        {
          name: "Rayon Kurtis",
          path: "/cat?cs=kurtis-sarees&sub=kurta-kurtis",
          count: "1,234",
        },
        {
          name: "All Lehengas",
          path: "/cat?cs=kurtis-sarees&sub=silk-lehengas",
          count: "987",
        },
        {
          name: "Popular Lehengas",
          path: "/cat?cs=kurtis-sarees&sub=cotton-lehengas",
          count: "765",
        },
      ],
      trending: [
        {
          name: "Silk Saree Collection",
          brand: "Ethnic Wear",
          price: "₹149",
          icon: "👘",
        },
        { name: "Designer Kurti", brand: "Zara", price: "₹89", icon: "👗" },
        {
          name: "Anarkali Set",
          brand: "W for Woman",
          price: "₹129",
          icon: "👗",
        },
        { name: "Lehenga Choli", brand: "Biba", price: "₹199", icon: "👗" },
        { name: "Cotton Kurti", brand: "Aurelia", price: "₹45", icon: "👗" },
        {
          name: "Wedding Lehenga",
          brand: "Manyavar",
          price: "₹399",
          icon: "👗",
        },
      ],
    },
    {
      id: "women-western",
      label: "Women Western",
      icon: "👚",
      path: "/cat?cs=jewellery",
      subcategories: [
        {
          name: "All Topwears",
          path: "/cat?cs=jewellery&sub=tops",
          count: "2,134",
        },
        {
          name: "Tops & Tunics",
          path: "/cat?cs=jewellery&sub=shirts",
          count: "3,456",
        },
        {
          name: "T-Shirts",
          path: "/cat?cs=jewellery&sub=t-shirts",
          count: "1,876",
        },
        {
          name: "Dresses",
          path: "/cat?cs=jewellery&sub=sweaters",
          count: "1,234",
        },
        { name: "Jeans", path: "/cat?cs=jewellery&sub=sweaters", count: "876" },
        {
          name: "All Bottomwears",
          path: "/cat?cs=jewellery&sub=bottoms",
          count: "1,543",
        },
        {
          name: "Jackets & Coats",
          path: "/cat?cs=jewellery&sub=jackets",
          count: "987",
        },
      ],
      trending: [
        { name: "Denim Jacket", brand: "Levi's", price: "₹89", icon: "🧥" },
        { name: "Summer Dress", brand: "H&M", price: "₹59", icon: "👗" },
        { name: "Skinny Jeans", brand: "Zara", price: "₹79", icon: "👖" },
        { name: "Crop Top", brand: "Forever 21", price: "₹29", icon: "👚" },
        { name: "Maxi Dress", brand: "Mango", price: "₹99", icon: "👗" },
        {
          name: "Winter Coat",
          brand: "The North Face",
          price: "₹199",
          icon: "🧥",
        },
      ],
    },
    {
      id: "men",
      label: "Men",
      icon: "👔",
      path: "/cat?cs=men",
      subcategories: [
        {
          name: "Summer T-Shirts",
          path: "/cat?cs=men&sub=summer-tshirts",
          count: "2,345",
        },
        { name: "Shirts", path: "/cat?cs=men&sub=shirts", count: "1,876" },
        { name: "Jeans", path: "/cat?cs=men&sub=jeans", count: "1,234" },
        { name: "Kurtas", path: "/cat?cs=men&sub=kurtas", count: "876" },
        { name: "Watches", path: "/cat?cs=men&sub=watches", count: "543" },
        {
          name: "Men Footwear",
          path: "/cat?cs=men&sub=men-footwear",
          count: "654",
        },
        { name: "Jackets", path: "/cat?cs=men&sub=jackets", count: "432" },
      ],
      trending: [
        { name: "Formal Shirt", brand: "Van Heusen", price: "₹59", icon: "👔" },
        { name: "Casual T-Shirt", brand: "Nike", price: "₹39", icon: "👕" },
        { name: "Denim Jeans", brand: "Levi's", price: "₹89", icon: "👖" },
        { name: "Leather Watch", brand: "Fossil", price: "₹149", icon: "⌚" },
        { name: "Running Shoes", brand: "Adidas", price: "₹129", icon: "👟" },
        { name: "Winter Jacket", brand: "Columbia", price: "₹179", icon: "🧥" },
      ],
    },
  ];

  function handleSearch(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search results
      goto(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  }

  function setActiveCategory(categoryId) {
    activeCategoryId = categoryId;
  }

  let activeCategory = $derived(
    menu.find((m) => m.id === activeCategoryId) || menu[0],
  );
</script>

<div class="sticky bg-white top-0 left-0 right-0 z-50 shadow-sm">
  {#if customer?.referral_code}
    <div
      class="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-slate-900"
    >
      <div class="mx-auto flex max-w-7xl flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <p class="text-xs font-medium text-slate-700 md:text-sm">
          Invite friends and earn 20% off your next purchase.
        </p>
        <button
          onclick={async () => {
            try {
              const url = new URL(window.location.href);
              let text = `${url.protocol}://${url.host}?ri=${customer?.referral_code ?? ""}`;
              await navigator.clipboard.writeText(text);
              alert(`Referral code copied to clipboard!`);
            } catch (err) {
              alert("Failed to copy referral code.");
            }
          }}
          class="inline-flex items-center justify-center rounded-lg bg-[var(--primary-color)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--primary-color-light)]"
        >
          Invite <span class="ml-1 hidden md:inline">friends and family</span>
        </button>
      </div>
    </div>
  {/if}

  <div class="bg-[var(--primary-color)] px-4 py-3">
    <div
      class="mx-auto flex max-w-7xl items-center justify-between gap-3 md:gap-6"
    >
      <div class="flex min-w-0 flex-shrink-0 items-center">
        <a
          href="/"
          data-sveltekit-reload="true"
          class="text-2xl font-bold tracking-tight text-white transition-colors"
        >
          <span class="not-italic">
            Cart<span class="text-[#f8c914] italic">ly</span>
          </span>
        </a>
      </div>

      <div class="hidden max-w-2xl flex-1 md:block">
        <form onsubmit={handleSearch} class="w-full">
          <div class="flex items-center overflow-hidden rounded-lg border border-white/10 bg-white shadow-sm">
            <div class="relative">
              <select
                class="cursor-pointer appearance-none border-r border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 focus:outline-none"
              >
                <option>All</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Home</option>
                <option>Sports</option>
              </select>

              <svg
                class="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search for products, brands and more..."
              bind:value={searchQuery}
              class="min-w-0 flex-1 px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
            />

            <button
              type="submit"
              class="flex h-[46px] items-center justify-center bg-[#f8c914] px-5 text-[#14532d] transition hover:bg-[#e7b70f]"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </div>
        </form>
      </div>

      <div class="flex items-center gap-3 md:gap-5">
        <a
          href="https://seller.vlyp.store"
          target="_blank"
          class="hidden items-center rounded-lg border border-[#f8c914]/80 px-4 py-2 text-sm font-medium text-[#f8c914] transition hover:bg-[#f8c914] hover:text-[#14532d] lg:flex"
        >
          Become a Seller
        </a>

        <a
          href="/cart"
          data-sveltekit-reload="true"
          class="relative flex items-center gap-2 text-white transition-colors"
        >
          <div class="relative">
            <ShoppingCartIcon size={24} class="text-white" />
            {#if $cart?.length > 0}
              <span
                class="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 text-xs font-bold text-black bg-[#f8c914] rounded-full"
              >
                {$cart?.length}
              </span>
            {/if}
          </div>
          <span class="hidden lg:inline text-sm font-medium">Cart</span>
        </a>

        {#if customer}
          <a
            href="/account"
            data-sveltekit-reload="true"
            class="flex items-center gap-2 transition-colors"
          >
            <UserIcon size={24} class="text-white" />
            <span class="hidden lg:inline text-sm font-medium">Account</span>
          </a>
        {:else}
          <button
            onclick={() => (openLoginModal = true)}
            class="flex items-center gap-2 text-white transition-colors"
          >
            <UserIcon size={24} class="text-white" />
            <span class="hidden lg:inline text-sm font-medium">Login</span>
          </button>
        {/if}
      </div>
    </div>
  </div>

  <div class="border-b border-slate-200 bg-white px-4 py-3 md:hidden">
    <div class="mx-auto max-w-7xl">
      <form onsubmit={handleSearch}>
        <div class="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 shadow-sm">
          <input
            type="text"
            placeholder="Search products, brands and more"
            bind:value={searchQuery}
            class="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            class="flex h-[44px] items-center justify-center border-l border-slate-200 bg-white px-4 text-slate-700 transition hover:bg-slate-100"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </form>
    </div>
  </div>

  {#if showMenu}
    <div class="w-full border-t bg-white border-b border-gray-100 relative hidden md:block mega-menu">
      <div class="max-w-[1480px] mx-auto px-4">
        <nav class="mega-menu-nav">
          <ul class="flex items-center">
            {#each menu as item}
              <li class="mega-menu-item group">
                <a href={item.path} class="mega-menu-link">
                  <span>{item.label}</span>
                  <ChevronDownIcon size={14} class="chevron-icon" />
                </a>

                <!-- 3-Column Mega Menu Dropdown -->
                <div class="mega-menu-dropdown">
                  <div class="mega-menu-3col-container">
                    <!-- Column 1: Main Categories with Icons -->
                    <div class="mega-menu-col-left">
                      <div class="category-list">
                        {#each menu as category}
                          <button
                            onmouseenter={() => setActiveCategory(category.id)}
                            class="category-item"
                            class:active={activeCategoryId === category.id}
                          >
                            <div class="category-content">
                              <span class="category-icon">{category.icon}</span>
                              <span class="category-name">{category.label}</span
                              >
                            </div>
                            <ChevronRightIcon size={14} class="text-gray-400" />
                          </button>
                        {/each}
                      </div>
                    </div>

                    <!-- Column 2: Subcategories -->
                    <div class="mega-menu-col-middle">
                      <h3 class="subcategory-heading">POPULAR SUBCATEGORIES</h3>
                      <div class="subcategory-list">
                        {#each activeCategory.subcategories as subcategory}
                          <a href={subcategory.path} class="subcategory-item">
                            <span class="subcategory-name"
                              >{subcategory.name}</span
                            >
                            <span class="subcategory-count"
                              >{subcategory.count}</span
                            >
                          </a>
                        {/each}
                      </div>
                    </div>

                    <!-- Column 3: Trending Products -->
                    <div class="mega-menu-col-right">
                      <h3 class="trending-heading">TRENDING NOW</h3>
                      <div class="trending-list">
                        {#each activeCategory.trending as product}
                          <a href="#" class="trending-item">
                            <div class="trending-icon-box">
                              <span class="trending-emoji">{product.icon}</span>
                            </div>
                            <div class="trending-info">
                              <h4 class="trending-name">{product.name}</h4>
                              <p class="trending-brand">{product.brand}</p>
                            </div>
                            <span class="trending-price">{product.price}</span>
                          </a>
                        {/each}
                      </div>

                      <!-- Featured Banner -->
                      <div class="featured-banner">
                        <p class="banner-title">Summer Sale</p>
                        <p class="banner-subtitle">
                          Up to 50% off on selected items
                        </p>
                        <button class="banner-button">View Deals</button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            {/each}

            <li>
              <a href="#" class="mega-menu-link">Deals</a>
            </li>
            <li>
              <a href="#" class="mega-menu-link">New Arrivals</a>
            </li>
            <li>
              <a href="#" class="mega-menu-link">Brands</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  {/if}
</div>

<LoginModal
  open={openLoginModal}
  onClose={() => (openLoginModal = false)}
  onLoggedIn={() => {
    location.reload();
  }}
/>

<style>
  /* ============================================
     MEGA MENU NAVIGATION
     ============================================ */
  .mega-menu-nav {
    position: relative;
  }

  .mega-menu-link {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 1rem 1.25rem;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #2d2d2d;
    transition: all 0.2s ease;
    position: relative;
  }

  .mega-menu-link::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 2px;
    background: var(--new-brand-color);
    transition: width 0.3s ease;
  }

  .mega-menu-item:hover .mega-menu-link {
    color: var(--new-brand-color);
  }

  .mega-menu-item:hover .mega-menu-link::after {
    width: 80%;
  }

  .chevron-icon {
    transition: transform 0.3s ease;
  }

  .mega-menu-item:hover .chevron-icon {
    transform: rotate(180deg);
  }

  /* ============================================
     3-COLUMN MEGA MENU DROPDOWN
     ============================================ */
  .mega-menu-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border-top: 1px solid #e5e5e5;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-10px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
  }

  .mega-menu-item:hover .mega-menu-dropdown {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  .mega-menu-3col-container {
    display: flex;
    max-width: 1480px;
    margin: 0 auto;
    height: 500px;
  }

  /* ============================================
     COLUMN 1: MAIN CATEGORIES (LEFT)
     ============================================ */
  .mega-menu-col-left {
    width: 240px;
    background: #f9fafb;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 0.5rem 0;
  }

  .category-list {
    display: flex;
    flex-direction: column;
  }

  .category-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
    background: transparent;
    width: 100%;
    text-align: left;
  }

  .category-item:hover,
  .category-item.active {
    background: #fff7ed;
    border-left-color: var(--new-brand-color);
    color: var(--new-brand-color);
  }

  .category-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .category-icon {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 0.5rem;
    font-size: 1.25rem;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .category-item:hover .category-icon,
  .category-item.active .category-icon {
    background: #fff7ed;
  }

  .category-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
  }

  .category-item:hover .category-name,
  .category-item.active .category-name {
    color: var(--new-brand-color);
  }

  /* ============================================
     COLUMN 2: SUBCATEGORIES (MIDDLE)
     ============================================ */
  .mega-menu-col-middle {
    width: 280px;
    border-right: 1px solid #e5e7eb;
    overflow-y: auto;
    padding: 1rem 0.5rem;
  }

  .subcategory-heading {
    font-size: 0.75rem;
    font-weight: 700;
    color: #9ca3af;
    letter-spacing: 0.05em;
    margin-bottom: 0.75rem;
    padding: 0 1rem;
  }

  .subcategory-list {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .subcategory-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.625rem 1rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #374151;
    transition: all 0.2s ease;
  }

  .subcategory-item:hover {
    background: #f9fafb;
    color: var(--new-brand-color);
    padding-left: 1.25rem;
  }

  .subcategory-name {
    flex: 1;
  }

  .subcategory-count {
    font-size: 0.75rem;
    color: #9ca3af;
    background: #f3f4f6;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
  }

  /* ============================================
     COLUMN 3: TRENDING PRODUCTS (RIGHT)
     ============================================ */
  .mega-menu-col-right {
    flex: 1;
    background: #fafafa;
    overflow-y: auto;
    padding: 1rem 1.5rem;
  }

  .trending-heading {
    font-size: 0.75rem;
    font-weight: 700;
    color: #9ca3af;
    letter-spacing: 0.05em;
    margin-bottom: 1rem;
  }

  .trending-list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .trending-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  .trending-item:hover {
    background: white;
    border-color: #e5e7eb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  }

  .trending-icon-box {
    width: 3rem;
    height: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
    flex-shrink: 0;
  }

  .trending-emoji {
    font-size: 1.5rem;
  }

  .trending-info {
    flex: 1;
    min-width: 0;
  }

  .trending-name {
    font-size: 0.875rem;
    font-weight: 600;
    color: #111827;
    margin: 0 0 0.125rem 0;
    line-height: 1.3;
  }

  .trending-brand {
    font-size: 0.75rem;
    color: #6b7280;
    margin: 0;
  }

  .trending-price {
    font-size: 0.875rem;
    font-weight: 700;
    color: var(--new-brand-color);
    flex-shrink: 0;
  }

  /* ============================================
     FEATURED BANNER
     ============================================ */
  .featured-banner {
    margin-top: 1.5rem;
    padding: 1rem;
    background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
    border-radius: 0.75rem;
    border: 1px solid #fed7aa;
  }

  .banner-title {
    font-size: 0.875rem;
    font-weight: 600;
    color: #9a3412;
    margin: 0 0 0.25rem 0;
  }

  .banner-subtitle {
    font-size: 0.75rem;
    color: #ea580c;
    margin: 0 0 0.75rem 0;
  }

  .banner-button {
    font-size: 0.75rem;
    background: var(--new-brand-color, #f97316);
    color: white;
    padding: 0.375rem 0.75rem;
    border-radius: 0.375rem;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .banner-button:hover {
    background: #ea580c;
  }

  /* ============================================
     CUSTOM SCROLLBAR
     ============================================ */
  .mega-menu-col-left::-webkit-scrollbar,
  .mega-menu-col-middle::-webkit-scrollbar,
  .mega-menu-col-right::-webkit-scrollbar {
    width: 6px;
  }

  .mega-menu-col-left::-webkit-scrollbar-track,
  .mega-menu-col-middle::-webkit-scrollbar-track,
  .mega-menu-col-right::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .mega-menu-col-left::-webkit-scrollbar-thumb,
  .mega-menu-col-middle::-webkit-scrollbar-thumb,
  .mega-menu-col-right::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 3px;
  }

  /* ============================================
     RESPONSIVE
     ============================================ */
  @media (max-width: 1200px) {
    .mega-menu-3col-container {
      max-width: 900px;
    }
  }

  @media (max-width: 992px) {
    .mega-menu-col-right {
      display: none;
    }

    .mega-menu-3col-container {
      max-width: 600px;
    }
  }

  @media (max-width: 768px) {
    .mega-menu-dropdown {
      position: static;
      opacity: 1;
      visibility: visible;
      transform: none;
      display: none;
    }

    .mega-menu-item:hover .mega-menu-dropdown {
      display: none;
    }

    .mega-menu-3col-container {
      flex-direction: column;
      height: auto;
    }

    .mega-menu-col-left,
    .mega-menu-col-middle {
      width: 100%;
      border-right: none;
      border-bottom: 1px solid #e5e7eb;
    }
  }
</style>
