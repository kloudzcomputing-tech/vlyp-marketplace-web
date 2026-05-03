<script>
    import ReelProductCard from "./ReelProductCard.svelte";
    import { onMount } from "svelte";
    import {
        X,
        ShoppingBagIcon,
        PlayIcon,
        ShoppingCartIcon,
        ChevronLeftIcon,
        ChevronRightIcon,
    } from "@lucide/svelte";
    import { goto } from "$app/navigation";
    import { reelMetrics } from "$lib/stores/reelMetrics";
    let { reel, user, isMobile } = $props();
    let products = $state(reel?.products || []);

    let currentIndex = $state(0);
    let video1 = $state(null);
    let video2 = $state(null);
    let showPanel = $state(false);
    let videoPlaying = $state(false);
    let isTransitioning = $state(false);
    let trigger = $state(null);
    // Handle video interactions
    function handleVideoToggle(video) {
        if (!video) return;
        if (video.paused) {
            video.play();
            video.muted = false;
        } else {
            video.pause();
            video.muted = true;
        }
    }

    function togglePanel() {
        isTransitioning = true;
        showPanel = !showPanel;
        setTimeout(() => {
            isTransitioning = false;
        }, 300);
    }

    function onAppear() {
        showPanel = false;

        goto(`/reels/${reel?.reel_media_id}`);
    }

    let isActive = false;

    onMount(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !isActive) {
                    isActive = true;

                    reelMetrics.startReel(reel.reel_media_id);

                    video2?.play().catch(() => {});
                    video1?.play().catch(() => {});
                }

                if (!entry.isIntersecting && isActive) {
                    isActive = false;

                    const payload = reelMetrics.endCurrentReel();
                    console.log("SEND METRICS", payload);

                    video2?.pause();
                    video1?.pause();
                }
            },
            { threshold: 0.6 },
        );

        if (trigger) observer.observe(trigger);

        return () => {
            if (isActive) {
                reelMetrics.endCurrentReel();
            }
            observer.disconnect();
        };
    });

    $effect(() => {
        const handleTouch1 = () => handleVideoToggle(video1);
        const handleTouch2 = () => handleVideoToggle(video2);
        const handlePause = () => {
            videoPlaying = false;
        };
        const handlePlay = () => {
            videoPlaying = true;
        };

        video1?.addEventListener("touchstart", handleTouch1);
        video2?.addEventListener("touchstart", handleTouch2);
        video2?.addEventListener("pause", handlePause);
        video2?.addEventListener("play", handlePlay);

        // Auto-play video2 when panel is closed
        // if (!showPanel && video2 && video2.paused) {
        //     video2.muted = true;
        //     video2.play().catch(() => {
        //         // Autoplay blocked, show play button
        //         videoPlaying = false;
        //     });
        // }

        // // Pause video2 when panel opens
        // if (showPanel && video2 && !video2.paused) {
        //     video2.pause();
        // }

        return () => {
            video1?.removeEventListener("touchstart", handleTouch1);
            video2?.removeEventListener("touchstart", handleTouch2);
            video2?.removeEventListener("pause", handlePause);
            video2?.removeEventListener("play", handlePlay);
        };
    });
</script>

{#if isMobile}
    <div
        bind:this={trigger}
        class="snap-start snap-always h-full bg-black overflow-hidden relative"
    >
        {#if showPanel}
            <div
                class="panel-container max-h-full h-full bg-black flex flex-col animate-slide-up"
            >
                <div
                    class="max-h-[30%] h-[30%] flex items-center bg-black justify-center animate-fade-in"
                >
                    <!-- svelte-ignore a11y_media_has_caption -->
                    <video
                        bind:this={video1}
                        src={reel?.original_url}
                        playsinline
                        preload="auto"
                        muted
                        class="h-full w-full object-contain"
                        onended={() => {
                            reelMetrics.incrementLoop();
                            video1.currentTime = 0;
                            video1.play().catch(() => {});
                        }}
                    >
                    </video>
                </div>

                <div
                    class="max-h-[70%] h-[70%] bg-white rounded-t-3xl shadow-2xl animate-slide-up-delay"
                >
                    <div
                        class="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100"
                    >
                        <p
                            class="text-lg sm:text-xl font-semibold text-gray-900"
                        >
                            Shop
                        </p>
                        <button
                            onclick={togglePanel}
                            class="close-btn w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
                            aria-label="Close panel"
                        >
                            <X size={18} class="text-gray-700" />
                        </button>
                    </div>
                    <div
                        class="flex-1 overflow-y-auto flex snap-x snap-mandatory scroll-smooth hide-scrollbar"
                    >
                        {#each products as product, index}
                            <ReelProductCard
                                {product}
                                {index}
                                {isMobile}
                                isLoggedIn={user ? true : false}
                                {user}
                            />
                        {/each}
                    </div>
                </div>
            </div>
        {:else}
            <div
                class="h-screen relative bg-black flex flex-col items-center justify-center overflow-hidden"
            >
                <!-- svelte-ignore a11y_media_has_caption -->
                <video
                bind:this={video2}
                src={reel?.original_url}
                playsinline
                preload="auto"
                muted
                class="h-full w-full object-cover"
                onended={() => {
                    reelMetrics.incrementLoop();

                    // manual loop (important)
                    video2.currentTime = 0;
                    video2.play().catch(() => {});
                }}
            >
            </video>

                {#if video2 && !videoPlaying}
                    <button
                        onclick={() => {
                            video2.play();
                            video2.muted = false;
                        }}
                        class="play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 animate-pulse-slow"
                        aria-label="Play video"
                    >
                        <PlayIcon size={40} color="white" class="ml-1" />
                    </button>
                {/if}

                <div
                    class="absolute w-full bottom-30 left-0 right-0 p-2 sm:p-6 animate-fade-in-up"
                >
                    <div
                        class="flex items-center bg-[#0004] p-3 rounded-full justify-between gap-3 sm:gap-4"
                    >
                        <div class="flex w-full items-center justify-between">
                            <div
                                class="flex items-center gap-3 sm:gap-4 animate-slide-in-left"
                            >
                                <div
                                    class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 flex-shrink-0 animate-fade-in"
                                ></div>
                                <div>
                                    <p
                                        class="text-white text-base sm:text-lg font-semibold"
                                    >
                                        {reel?.store_name || "Store Name"}
                                    </p>
                                    <p
                                        class="text-white/80 text-xs sm:text-sm font-normal"
                                    >
                                        {reel?.followers || "12"} followers
                                    </p>
                                </div>
                            </div>
                        </div>
                        <button
                            onclick={togglePanel}
                            class=" shop-btn bg-[var(--primary-color)] backdrop-blur-md hover:bg-white/30 rounded-full min-w-12 min-h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 animate-slide-in-right border border-white/20"
                            aria-label="Open shop"
                        >
                            <ShoppingBagIcon color="white" size={22} />
                        </button>
                    </div>
                </div>
            </div>
        {/if}
    </div>
{:else}
    <div
        bind:this={trigger}
        class="snap-start flex items-center justify-center snap-always h-full bg-black overflow-hidden relative"
    >
        <div
            class="h-[calc(100vh-52px)] w-[400px] bg-red-500 flex flex-col items-center justify-center overflow-hidden"
        >
            <!-- svelte-ignore a11y_media_has_caption -->
            <video
                bind:this={video2}
                src={reel?.original_url}
                playsinline
                preload="auto"
                muted
                class="h-full w-full object-cover"
                onended={() => {
                    reelMetrics.incrementLoop();

                    // manual loop (important)
                    video2.currentTime = 0;
                    video2.play().catch(() => {});
                }}
            >
            </video>

            {#if video2 && !videoPlaying}
                <button
                    onclick={() => {
                        video2.play();
                        video2.muted = false;
                    }}
                    class="play-btn absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 sm:w-24 sm:h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/30 active:scale-95 animate-pulse-slow"
                    aria-label="Play video"
                >
                    <PlayIcon size={40} color="white" class="ml-1" />
                </button>
            {/if}
        </div>
        <div class="h-full w-[400px] bg-white overflow-hidden">
            <div class="">
                <div
                    class="p-4 flex items-center gap-3 sm:gap-4 animate-slide-in-left"
                >
                    <div
                        class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gray-200/20 backdrop-blur-sm border-2 border-gray-500/30 flex-shrink-0 animate-fade-in"
                    ></div>
                    <div>
                        <p
                            class="text-gray-900 text-base sm:text-lg font-semibold"
                        >
                            {reel?.store_name || "Store Name"}
                        </p>
                        <p class="text-gray-500 text-xs sm:text-sm font-normal">
                            {reel?.followers || "12"} followers
                        </p>
                    </div>
                </div>
                <div
                    class="flex-1 flex snap-x snap-mandatory scroll-smooth relative"
                >
                    <ReelProductCard
                        product={products[currentIndex]}
                        index={currentIndex}
                        {isMobile}
                        isLoggedIn={user ? true : false}
                        {user}
                    />
                    <button
                        onclick={() => {
                            if (currentIndex > 0) {
                                currentIndex--;
                            }
                        }}
                        class="absolute left-2 z-40 top-40 bg-[#0001] w-10 h-10 rounded-full flex items-center justify-center -translate-y-1/2"
                    >
                        <ChevronLeftIcon size={20} color="#0007" />
                    </button>
                    <button
                        onclick={() => {
                            if (currentIndex < products.length - 1) {
                                currentIndex++;
                            }
                        }}
                        class="absolute right-2 z-40 top-40 bg-[#0001] w-10 h-10 rounded-full flex items-center justify-center -translate-y-1/2"
                    >
                        <ChevronRightIcon size={20} color="#0007" />
                    </button>
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    @keyframes slide-up {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes slide-up-delay {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes slide-in-left {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slide-in-right {
        from {
            opacity: 0;
            transform: translateX(20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes pulse-slow {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.8;
        }
    }

    .animate-slide-up {
        animation: slide-up 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-slide-up-delay {
        animation: slide-up-delay 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s
            forwards;
        opacity: 0;
    }

    .animate-fade-in {
        animation: fade-in 0.4s ease-out forwards;
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.5s ease-out forwards;
    }

    .animate-slide-in-left {
        animation: slide-in-left 0.5s ease-out 0.2s forwards;
        opacity: 0;
    }

    .animate-slide-in-right {
        animation: slide-in-right 0.5s ease-out 0.2s forwards;
        opacity: 0;
    }

    .animate-pulse-slow {
        animation: pulse-slow 2s ease-in-out infinite;
    }

    .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .hide-scrollbar::-webkit-scrollbar {
        display: none;
    }

    /* .product-card {
        scroll-snap-align: start;
    } */

    .gradient-overlay {
        backdrop-filter: blur(10px);
    }
</style>
