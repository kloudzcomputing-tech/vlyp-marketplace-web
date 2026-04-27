<script>
    import Header from "$lib/components/Header.svelte";
    import "../../../app.css";
    import "./style.css";
    import { onMount } from "svelte";
    import {
        ShoppingBagIcon,
        PlayIcon,
        X,
        ShoppingCart,
        ShoppingCartIcon,
    } from "@lucide/svelte";

    import ReelViewCard from "$lib/components/reels/ReelViewCard.svelte";
    import { setCart } from "$lib/stores/cart";

    let { data } = $props();
    let reels = data?.reels;
    let user = data?.user;
    let isMobile = data?.isMobile;
    let cart_items = data?.cart?.cart_items || [];
    let addresses = data?.user?.address || [];
    $effect(() => {
        setCart(cart_items);
    });
    let scrollPosition = $state(0);
   
</script>

<div class="h-screen w-screen bg-black overflow-x-hidden">
    <Header showMenu={false} isLoggedIn={user ? true : false} customer={user} />
    <div
        
        class="h-[calc(100dvh-52px)] bg-black overflow-y-auto snap-y snap-mandatory scroll-smooth relative"
    >
        {#each reels as reel}
            <ReelViewCard {reel} {user} {isMobile} />
        {/each}
    </div>
</div>

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

    /* .animate-slide-up {
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

    .product-card {
        scroll-snap-align: start;
    }

    .gradient-overlay {
        backdrop-filter: blur(10px);
    } */
</style>
