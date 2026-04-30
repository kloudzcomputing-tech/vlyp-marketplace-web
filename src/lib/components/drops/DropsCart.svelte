<script>
  import { inView } from "$lib/helpers/inView";
  import {
    Bookmark,
    ChevronLeftIcon,
    ChevronRightIcon,
    ExternalLink,
    Globe,
    Heart,
    MessageCircle,
    PauseIcon,
    PlayIcon,
    Share2,
    ShoppingBag,
    Star,
    Volume2,
    VolumeX,
    X,
  } from "@lucide/svelte";
  import ReelProductCard from "../reels/ReelProductCard.svelte";
  import ReelComments from "../reels/ReelComments.svelte";
  import { onMount } from "svelte";
  import ReelCartCheckout from "../reels/ReelCartCheckout.svelte";
  import { addToCart } from "$lib/stores/cart";
  import { goto } from "$app/navigation";
  let { reel, updateMatrix, user } = $props();

  let products = $state(reel?.products || []);
  let showComments = $state(false);
  let currentIndex = $state(0);
  let video1 = $state(null);
  const categories_color = {
    fashion: "bg-pink-500",
    electronics: "bg-blue-500",
    beauty: "bg-rose-500",
    "home-and-kitchen": "bg-amber-500",
    grocery: "bg-green-500",
    fitness: "bg-emerald-500",
    "toys-and-baby": "bg-purple-500",
    automotive: "bg-slate-500",
    books: "bg-indigo-500",
    sports: "bg-orange-500",
  };

  const DURATION_S = 30;
  const DURATION_MS = DURATION_S * 1000;

  let container = $state(null);
  let counter = $state(0); // seconds within current loop
  let loopCounter = $state(0); // completed loops within this session

  let view_3s = $state(false);
  let view_6s = $state(false);
  let view_12s = $state(false);

  let intervalId = $state(null);
  let isActive = $state(false);

  let isLiked = $state(false);
  let isCommented = $state(false);
  let isShared = $state(false);
  let isSaved = $state(false);
  let isManuallyPaused = $state(false);
  let isMuted = $state(true);
  let showCenterControl = $state(false);
  let isVideoHovered = $state(false);
  let centerControlTimeout = $state(null);

  let likeCount = $state(0);
  let commentCount = $state(0);

  $effect(() => {
    if (reel?.reel_stats) {
      likeCount = reel.reel_stats.likes ?? 0;
      commentCount = reel.reel_stats.comments ?? 0;
    }
  });

  const progressPct = $derived(
    Math.min(100, Math.round((counter / DURATION_S) * 100)),
  );

  const resetSessionFlags = () => {
    view_3s = false;
    view_6s = false;
    view_12s = false;
    loopCounter = 0;
    counter = 0;
  };

  function playCounter() {
    console.log("PPP");

    if (isActive) return;
    if (intervalId) clearInterval(intervalId);
    intervalId = setInterval(() => {
      counter = counter + 1;
    }, 1000);
    isActive = true;
    isManuallyPaused = false;
    video1.play();
  }

  function pauseCounter() {
    console.log("QQQQ");
    video1.pause();
    video1.currentTime = 0;

    if (!isActive) return;
    isActive = false;
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    const duration_ms = video1.duration * 1000;
    const total_watch_ms = counter * 1000 + loopCounter * duration_ms;
    if (total_watch_ms <= 0) {
      isManuallyPaused = false;
      resetSessionFlags();
      return;
    }

    const raw_loop = Math.floor(total_watch_ms / duration_ms);
    const effective_loop = Math.min(raw_loop, 2);
    const loop_score = effective_loop / 2;

    const watch_ratio = total_watch_ms / duration_ms;
    const capped_watch_ratio = Math.min(watch_ratio, 2.0);
    const watch_time_score = Number((capped_watch_ratio / 2.0).toFixed(1));

    const payload = {
      reel_id: reel.reel_media_id,
      duration_ms: duration_ms,
      total_watch_ms,
      view_in_ms: total_watch_ms,
      effective_loop,
      loop_score,
      watch_time_score,
      view_3s,
      view_6s,
      view_12s,
      isLiked,
      isCommented,
      isShared,
      category: reel.category,
      created_at: reel.created_at,
      skip_fast: total_watch_ms < 2000,
    };
    console.log(payload, "payload");

    fetch(`/api/reels/${reel.reel_media_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data, "DATA");
        updateMatrix?.(data?.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        isManuallyPaused = false;
        resetSessionFlags();
      });
  }

  function togglePlayPause() {
    if (!video1) return;

    if (!isActive) {
      playCounter();
      return;
    }

    if (isManuallyPaused) {
      if (!intervalId) {
        intervalId = setInterval(() => {
          counter = counter + 1;
        }, 1000);
      }
      video1.play();
      isManuallyPaused = false;
      return;
    }

    video1.pause();
    if (intervalId) clearInterval(intervalId);
    intervalId = null;
    isManuallyPaused = true;
  }

  function showControlTemporarily() {
    showCenterControl = true;
    if (centerControlTimeout) clearTimeout(centerControlTimeout);
    centerControlTimeout = setTimeout(() => {
      if (!isVideoHovered) showCenterControl = false;
    }, 1200);
  }

  function handleVideoTap(event) {
    if (event.target.closest("button, a, input, textarea")) return;
    togglePlayPause();
    showControlTemporarily();
  }

  function toggleMute() {
    if (!video1) return;
    isMuted = !isMuted;
    video1.muted = isMuted;
  }

  function onInView(e) {
    if (e.detail && !isActive) {
      resetSessionFlags();
      playCounter();
    } else if (!e.detail && isActive) {
      pauseCounter();
    }
  }

  $effect(() => {
    if (counter >= DURATION_S) {
      loopCounter = loopCounter + 1;
      counter = 0;
    }

    if (counter >= 3) view_3s = true;
    if (counter >= 6) view_6s = true;
    if (counter >= 12) view_12s = true;
  });

  $effect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (centerControlTimeout) clearTimeout(centerControlTimeout);
    };
  });

  $effect(() => {
    if (showCartPanel) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  });

  function handleLike() {
    if (isLiked) {
      isLiked = false;
      likeCount = Math.max(0, likeCount - 1);
    } else {
      isLiked = true;
      likeCount += 1;
    }
  }

  function handleComment() {
    console.log("LL");

    isCommented = true;
    showComments = true;
    showCartPanel = true;
  }

  function handleShare() {
    if (isShared) return;
    isShared = true;
  }

  function handleSave() {
    isSaved = !isSaved;
  }

  onMount(() => {
    isLiked = reel?.is_liked ?? false;
    likeCount = reel.reel_stats.likes;
    commentCount = reel?.reel_stats?.comments ?? 0;
  });

  let showCart = $state(false);
  let showCartPanel = $state(false);
</script>

<div
  use:inView={{ threshold: 0.5 }}
  oninview={onInView}
  bind:this={container}
  class=" w-full snap-end overflow-hidden bg-[#080b18] h-full flex items-center justify-center"
>
  <div class="relative overflow-hidden rells-section max-w-[890px] w-full h-full">
    <div class="mx-auto flex w-full items-center justify-center px-0 sm:px-4  h-full">
      <!-- svelte-ignore a11y_media_has_caption -->

      <div
        class=" h-full md:h-[85vh] relative w-full md:max-w-auto w-full md:w-[50%] overflow-hidden sm:rounded-[15px] sm:border sm:border-white/10"
        onmouseenter={() => {
          isVideoHovered = true;
          showCenterControl = true;
        }}
        onmouseleave={() => {
          isVideoHovered = false;
          if (!isManuallyPaused) showCenterControl = false;
        }}
        onclick={handleVideoTap}
      >
        <video
          bind:this={video1}
          src={reel?.original_url}
          playsinline
          preload="auto"
          muted={isMuted}
          loop
          class="h-full w-full object-cover"
          onended={() => {
            reelMetrics.incrementLoop();
            video1.currentTime = 0;
            video1.play().catch(() => {});
          }}
        ></video>

        <div
          class="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/70"
        ></div>

        <!-- Top Bar -->
        <div
          class="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4"
        >
          <!-- Back Button - goes to home -->
          <button
            onclick={() => goto('/')}
            class="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all"
          >
            <ChevronLeftIcon size={24} strokeWidth={2.5} />
          </button>
          <!-- Mute Button -->
          <button
            onclick={toggleMute}
            class="w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-all"
          >
            {#if isMuted}
              <VolumeX size={20} strokeWidth={2.5} />
            {:else}
              <Volume2 size={20} strokeWidth={2.5} />
            {/if}
          </button>
        </div>

        <button
          onclick={togglePlayPause}
          onmouseenter={() => {
            isVideoHovered = true;
            showCenterControl = true;
          }}
          onmouseleave={() => {
            isVideoHovered = false;
            if (!isManuallyPaused) showCenterControl = false;
          }}
          class="absolute left-1/2 top-1/2 z-50 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/35 bg-black/45 text-white backdrop-blur-md transition-all hover:bg-black/60
           {showCenterControl || isManuallyPaused
            ? 'opacity-100'
            : 'pointer-events-none opacity-0'}"
        >
          {#if isManuallyPaused}
            <PlayIcon size={28} strokeWidth={2.7} />
          {:else}
            <PauseIcon size={28} strokeWidth={2.7} />
          {/if}
        </button>

        <!-- Right Side Actions -->
        <div class="absolute right-3 top-1/2 -translate-y-1/2 z-[9] flex flex-col gap-5">
          <!-- Like -->
          <div class="text-center">
            <button
              onclick={handleLike}
              class="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center transition-all hover:scale-110"
            >
              <Heart
                size={24}
                class={isLiked ? "text-red-500 fill-red-500" : "text-white"}
              />
            </button>
            <span
              class="text-sm font-semibold text-white mt-1 block"
            >
              {likeCount > 999 ? (likeCount/1000).toFixed(1) + 'K' : likeCount}
            </span>
          </div>

          <!-- Comment -->
          <div class="text-center">
            <button
              onclick={handleComment}
              class="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all"
            >
              <MessageCircle size={24} class="text-white" />
            </button>
            <span
              class="text-sm font-semibold text-white mt-1 block"
            >
              {commentCount}
            </span>
          </div>

          <!-- Share -->
          <div class="text-center">
            <button
              onclick={handleShare}
              class="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all"
            >
              <Share2 size={24} class="text-white" />
            </button>
            <span
              class="text-sm font-semibold text-white mt-1 block"
            >
              Share
            </span>
          </div>

          <!-- Save -->
          <div class="text-center">
            <button
              onclick={handleSave}
              class="w-12 h-12 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-all"
            >
              <Bookmark
                size={24}
                class={isSaved ? "text-white fill-white" : "text-white"}
              />
            </button>
            <span
              class="text-sm font-semibold text-white mt-1 block"
            >
              Save
            </span>
          </div>
        </div>

        <!-- Bottom Section: Store Info -->
        <div
          class="absolute bottom-[130px] md:bottom-0 left-0 right-0 z-10 px-4"
        >
          <div class="flex items-center gap-3 mb-2">
            <!-- Avatar with purple ring -->
            <div class="w-12 h-12 rounded-full border-2 border-[var(--primary-color)] overflow-hidden flex-shrink-0">
              <img
                src={reel?.store?.logo_url || "https://placehold.co/48x48/7c3aed/white?text=S"}
                alt={reel?.store?.name || "Store"}
                class="w-full h-full object-cover"
              />
            </div>
            <div class=" min-w-0">
              <p class="font-semibold text-lg text-white truncate">{reel?.store?.name || "Fashionista_Jane"}</p>
              <p class="text-xs text-gray-400 uppercase tracking-wide">Store Partner</p>
            </div>
            <button
              class="px-5 py-2 bg-[var(--primary-color)] text-white rounded-full text-sm font-bold hover:bg-[var(--primary-color-hover)] transition-all"
            >
              FOLLOW
            </button>
          </div>
          <!-- Caption -->
          <p class="text-white text-sm line-clamp-2">{reel?.caption || "Loving this new cotton tee! Super comfy and stylish. #fashion #vlyp"}</p>
        </div>

        <!-- Mobile Product Card Overlay -->
        {#if products.length > 0}
        {@const product = products[currentIndex]}
        <div class="absolute bottom-4 left-4 right-4 z-20 md:hidden">
          <div class="bg-black/80 backdrop-blur-md rounded-2xl p-3 flex items-center gap-3 border border-white/10">
            <!-- Product Image -->
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
              <img
                src={product?.image_url}
                alt={product?.title}
                class="w-full h-full object-cover"
              />
            </div>
            <!-- Product Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-0.5">
                <span class="px-2 py-0.5 bg-yellow-500 text-black text-xs font-bold rounded flex items-center gap-0.5">
                  <Star size={10} class="fill-black" /> {product?.rating || "4.2"}
                </span>
                <span class="text-xs text-gray-400 uppercase">{reel?.category || "Fashion"}</span>
              </div>
              <p class="text-white font-semibold text-sm truncate">{product?.title}</p>
              <div class="flex items-center gap-2">
                <span class="text-[var(--primary-color)] font-bold">₹{product?.selling_price}</span>
                <span class="text-gray-500 text-xs line-through">₹{product?.compare_at_price}</span>
              </div>
            </div>
            <!-- Actions -->
            <div class="flex flex-col gap-2">
              <button
                class="px-4 py-2 bg-lime-500 text-black text-xs font-bold rounded-full hover:bg-lime-400 transition-all"
              >
                BUY NOW
              </button>
              <button
                onclick={() => {
                  const payload = {
                    id: product?.id,
                    variant_id: product?.variant_id,
                    vendor_id: product?.vendor_id,
                    category_id: product?.category_id,
                    title: product?.title,
                    slug: product?.slug,
                    sku: product?.sku,
                    coupons: [],
                    selling_price: product?.selling_price,
                    compare_at_price: product?.compare_at_price,
                    weight_grams: product?.weight_grams,
                    image_url: product?.image_url,
                  };
                  addToCart(payload);
                }}
                class="px-4 py-2 bg-gray-700 text-white text-xs font-bold rounded-full hover:bg-gray-600 transition-all"
              >
                ADD
              </button>
            </div>
          </div>
        </div>
        {/if}
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 w-full max-h-[70vh] overflow-y-auto rounded-t-[20px] border border-white/25 bg-white/95 shadow-[0_-16px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl m-0 z-[99] transition-all duration-500 ease-out md:static md:max-h-none md:h-[85vh] md:ml-4 md:w-[50%] md:rounded-[15px] md:border-white/20 md:shadow-[0_24px_80px_rgba(0,0,0,0.3)] md:block md:translate-y-0 md:visible
        {showCartPanel
          ? 'translate-y-0 visible'
          : 'translate-y-full invisible md:translate-y-0 md:visible'}"
      >
        <div class="h-full overflow-y-auto scroll-smooth scrollbar-hide">
          <div class="relative px-4 py-5">
            <!-- Close button for mobile -->
            <button
              onclick={() => (showCartPanel = false)}
              class="md:hidden absolute top-4 right-4 z-50 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all"
            >
              <X size={20} strokeWidth={2.5} />
            </button>
            {#if showComments}
              <ReelComments
                reelId={reel?.reel_media_id}
                {user}
                on:close={() => (showComments = false)}
              />
            {:else if showCart}
              <ReelCartCheckout
                product={products[currentIndex]}
                {user}
                on:close={() => (showCart = false)}
              />
            {:else}
              <ReelProductCard
                product={products[currentIndex]}
                index={currentIndex}
                isLoggedIn={user ? true : false}
                {user}
                on:buyNow={() => {
                  showCart = true;
                  showComments = false;
                }}
              />
              <button
                onclick={() => {
                  if (currentIndex > 0) {
                    currentIndex--;
                  }
                }}
                class="absolute left-[23px] top-[20%] z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-2xl border border-slate-200 bg-white/95 text-slate-700 shadow-lg transition hover:scale-105 disabled:opacity-30"
                disabled={currentIndex === 0}
              >
                <ChevronLeftIcon size={20} />
              </button>

              <button
                onclick={() => {
                  if (currentIndex < products.length - 1) {
                    currentIndex++;
                  }
                }}
                class="absolute right-[23px] top-[20%] z-40 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-2xl border border-slate-200 bg-white/95 text-slate-700 shadow-lg transition hover:scale-105 disabled:opacity-30"
                disabled={currentIndex >= products.length - 1}
              >
                <ChevronRightIcon size={20} />
              </button>
            {/if}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
