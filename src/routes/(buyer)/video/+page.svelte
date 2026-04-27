<script>
  import {
    Heart,
    Play,
    Rows3,
    ShoppingBag,
    Table,
    Volume2,
    VolumeOff,
    X,
  } from "@lucide/svelte";
  import { onMount } from "svelte";

  export let data;
  let { video, products, isMobile } = data;

  let containerRef;
  let videoRefs = [];
  let currentVideo = 0;
  let isPlaying = true;
  let isMuted = false;
  let isLiked = false;
  let isFollowing = false;
  let showProducts = false;
  let dragPosition = 60;
  let isDragging = false;
  let viewMode = "grid";
  let isScrolling = false;
  let scrollTimeout;

  let initialTouchY = null;
  let startDragPosition = null;

  let videos = [
    {
      id: 1,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      storeName: "Fashion Hub",
      isLive: true,
      likes: "12.5K",
      products: products || [],
    },
    {
      id: 2,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      storeName: "Style Boutique",
      isLive: false,
      likes: "8.2K",
      products: products || [],
    },
    {
      id: 3,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      storeName: "Trendy Store",
      isLive: true,
      likes: "15.7K",
      products: products || [],
    },
    {
      id: 4,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
      storeName: "Urban Fashion",
      isLive: false,
      likes: "9.4K",
      products: products || [],
    },
    {
      id: 5,
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
      storeName: "Chic Wear",
      isLive: true,
      likes: "11.3K",
      products: products || [],
    },
  ];

  let currentVideoData = videos[currentVideo];

  onMount(() => {
    if (videoRefs[currentVideo]) {
      videoRefs[currentVideo].play();
    }
  });

  const scrollToVideo = (index) => {
    if (containerRef && !showProducts) {
      containerRef.scrollTo({
        top: index * window.innerHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (showProducts || isScrolling) return;

    isScrolling = true;
    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      const scrollTop = containerRef.scrollTop;
      const videoHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / videoHeight);

      if (
        newIndex !== currentVideo &&
        newIndex >= 0 &&
        newIndex < videos.length
      ) {
        changeVideo(newIndex);
      }

      isScrolling = false;
    }, 150);
  };

  const handleWheel = (e) => {
    if (showProducts) return;

    e.preventDefault();

    clearTimeout(scrollTimeout);

    scrollTimeout = setTimeout(() => {
      if (e.deltaY > 0 && currentVideo < videos.length - 1) {
        changeVideo(currentVideo + 1);
      } else if (e.deltaY < 0 && currentVideo > 0) {
        changeVideo(currentVideo - 1);
      }
    }, 50);
  };

  const changeVideo = (newIndex) => {
    if (newIndex === currentVideo) return;

    if (videoRefs[currentVideo]) {
      videoRefs[currentVideo].pause();
    }

    currentVideo = newIndex;
    currentVideoData = videos[currentVideo];
    isPlaying = true;
    isLiked = false;
    isFollowing = false;
    showProducts = false;

    scrollToVideo(newIndex);

    setTimeout(() => {
      if (videoRefs[currentVideo]) {
        videoRefs[currentVideo].play();
      }
    }, 100);
  };

  const togglePlayPause = () => {
    isPlaying = !isPlaying;
    if (videoRefs[currentVideo]) {
      if (isPlaying) {
        videoRefs[currentVideo].play();
      } else {
        videoRefs[currentVideo].pause();
      }
    }
  };

  const toggleMute = () => {
    isMuted = !isMuted;
    videoRefs.forEach((video) => {
      if (video) video.muted = isMuted;
    });
  };

  const toggleLike = () => (isLiked = !isLiked);
  const toggleFollow = () => (isFollowing = !isFollowing);
  const toggleProducts = () => (showProducts = !showProducts);

  const handleTouchStart = (e) => {
    if (!e.touches || e.touches.length === 0) return;
    isDragging = true;
    initialTouchY = e.touches[0].clientY;
    startDragPosition = dragPosition;
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length === 0) return;
    e.preventDefault();
    const touch = e.touches[0];
    const windowHeight = window.innerHeight;
    const deltaY = initialTouchY - touch.clientY;
    const deltaPercent = (deltaY / windowHeight) * 100;
    const newPosition = Math.min(
      Math.max(startDragPosition + deltaPercent, 10),
      90
    );
    dragPosition = newPosition;
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    isDragging = false;
    initialTouchY = null;
    startDragPosition = null;
    if (dragPosition < 35) dragPosition = 10;
    else if (dragPosition < 70) dragPosition = 50;
    else dragPosition = 90;
  };
</script>

<div class="fixed top-0 left-0 w-screen h-screen z-[999]">
  <div
    bind:this={containerRef}
    class="relative w-full h-screen bg-black overflow-y-scroll snap-y snap-mandatory scroll-smooth "
    style="scroll-snap-type: y mandatory; -webkit-overflow-scrolling: touch;"
    on:scroll={handleScroll}
    on:wheel={handleWheel}
  >
    {#each videos as video, index}
      <div
        class="relative w-full h-screen snap-start snap-always flex-shrink-0"
      >
        <video
          bind:this={videoRefs[index]}
          class="w-full h-full object-cover"
          src={video.url}
          loop
          playsinline
          muted={isMuted}
          on:click={togglePlayPause}
        ></video>

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
        ></div>

        {#if index === currentVideo}
          <div
            class="absolute top-0 left-0 right-0 p-4 sm:p-6 flex justify-between items-center z-20"
          >
            <div class="flex items-center gap-4 text-white text-sm">
              <span class="font-medium">For You</span>
              <span class="text-gray-400">Following</span>
            </div>
          </div>

          {#if !isPlaying}
            <div
              class="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <div class="bg-black/40 rounded-full p-4">
                <Play class="w-8 h-8 text-white" fill="white" />
              </div>
            </div>
          {/if}

          <div
            class="absolute right-4 sm:right-6 bottom-24 sm:bottom-32 flex flex-col gap-5 z-20 items-center"
          >
            <div class="relative">
              <div
                class="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex items-center justify-center text-white font-medium text-sm"
              >
                {video.storeName[0]}
              </div>
              {#if !isFollowing}
                <button
                  on:click={toggleFollow}
                  class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-5 h-5 bg-white rounded-full text-black flex items-center justify-center text-xs font-medium hover:bg-gray-100 transition-colors"
                  aria-label="Follow"
                >
                  +
                </button>
              {/if}
            </div>

            <button
              on:click={toggleLike}
              class="flex flex-col items-center gap-1 text-white"
              aria-label="Like"
            >
              <Heart
                class="w-6 h-6"
                fill={isLiked ? "currentColor" : "none"}
                stroke={isLiked ? "currentColor" : "currentColor"}
                stroke-width={isLiked ? 0 : 1.5}
              />
              <span class="text-xs font-medium">{video.likes}</span>
            </button>

            <button
              on:click={toggleProducts}
              class="flex flex-col items-center gap-1 text-white"
              aria-label="Shop"
            >
              <ShoppingBag class="w-6 h-6" />
              <span class="text-xs font-medium">Shop</span>
            </button>

            <button
              on:click={toggleMute}
              class="text-white"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {#if isMuted}
                <VolumeOff class="w-6 h-6" />
              {:else}
                <Volume2 class="w-6 h-6" />
              {/if}
            </button>
          </div>

          <div
            class="absolute bottom-0 left-0 right-0 p-4 sm:p-6 pb-6 sm:pb-8 z-10"
          >
            <div class="flex items-center gap-2 mb-2">
              <span class="text-white font-medium text-base"
                >@{video.storeName}</span
              >
              {#if video.isLive}
                <span
                  class="bg-red-600 text-white text-xs px-2 py-0.5 rounded font-medium"
                  >LIVE</span
                >
              {/if}
            </div>
            <p class="text-white/90 text-sm">Check out our latest collection</p>
          </div>
        {/if}
      </div>
    {/each}

    {#if showProducts}
      <button
        type="button"
        class="fixed inset-0 bg-black/60 z-30"
        on:click={toggleProducts}
        aria-label="Close products"
      ></button>

      <div
        class="fixed left-0 right-0 bg-white rounded-t-2xl z-40 transition-all duration-300 shadow-lg"
        style="bottom: 0; height: {dragPosition}%;"
      >
        <div
          class="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
          on:touchstart={handleTouchStart}
          on:touchmove={handleTouchMove}
          on:touchend={handleTouchEnd}
          on:touchcancel={handleTouchEnd}
          style="touch-action: none;"
        >
          <div class="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        <div
          class="px-4 sm:px-6 pb-4 border-b border-gray-100 flex items-center justify-between"
        >
          <h3 class="text-base font-medium text-gray-900">
            Products ({products?.length || 0})
          </h3>
          <div class="flex items-center gap-2">
            <button
              on:click={() => (viewMode = "grid")}
              class="p-2 rounded-lg transition-colors {viewMode === 'grid'
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'}"
              aria-label="Grid view"
            >
              <Table class="w-4 h-4 text-gray-700" />
            </button>
            <button
              on:click={() => (viewMode = "card")}
              class="p-2 rounded-lg transition-colors {viewMode === 'card'
                ? 'bg-gray-100'
                : 'hover:bg-gray-50'}"
              aria-label="Card view"
            >
              <Rows3 class="w-4 h-4 text-gray-700" />
            </button>
            <button
              on:click={toggleProducts}
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <X class="w-4 h-4 text-gray-700" />
            </button>
          </div>
        </div>

        <div class="overflow-y-auto" style="height: calc(100% - 80px);">
          {#if viewMode === "grid"}
            <div class="grid grid-cols-2 gap-3 sm:gap-4 p-4 sm:p-6">
              {#each products || [] as product}
                <div
                  class="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors"
                >
                  <div class="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="p-3 space-y-1">
                    <p class="text-xs text-gray-900 line-clamp-2 min-h-[2rem]">
                      {product.title.length > 20
                        ? product.title.slice(0, 20) + "..."
                        : product.title}
                    </p>
                    <div class="flex items-center gap-1">
                      <p class="text-xs font-normal text-gray-400 line-through">
                        ₹{product.original_price}
                      </p>
                      <p class="text-sm font-medium text-gray-900">
                        ₹{product.selling_price}
                      </p>
                    </div>

                    <button
                      class="w-full bg-gray-900 text-white py-2 rounded-lg text-xs font-medium hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div
              class="flex overflow-x-auto gap-4 p-4 sm:p-6 snap-x snap-mandatory scrollbar-hide"
            >
              {#each products as product}
                <div
                  class="flex-shrink-0 w-72 bg-white rounded-lg overflow-hidden border border-gray-200 snap-start hover:border-gray-300 transition-colors"
                >
                  <div class="aspect-square overflow-hidden bg-gray-50">
                    <img
                      src={product.images?.[0]}
                      alt={product.title}
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div class="p-4 space-y-3">
                    <h4 class="font-medium text-sm text-gray-900 line-clamp-2">
                      {product.title.length > 30
                        ? product.title.slice(0, 30) + "..."
                        : product.title}
                    </h4>
                    <div class="flex items-center gap-1">
                      <p class="text-xs font-normal text-gray-400 line-through">
                        ₹{product.original_price}
                      </p>
                      <p class="text-sm font-medium text-gray-900">
                        ₹{product.selling_price}
                      </p>
                    </div>
                    <button
                      class="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </div>
    {/if}
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

  div::-webkit-scrollbar {
    display: none;
  }

  div {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
</style>
