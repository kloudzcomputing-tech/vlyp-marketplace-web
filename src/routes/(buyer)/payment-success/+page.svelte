<script>
    import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
    import { setCart } from "$lib/stores/cart";

    let { data } = $props();

    // data from +page.server.js
    let cart_items = $state(data?.cart_items || []);
    const oid = data?.oid;
    const payment_method = data?.payment_method || "COD";
    const payment_date =
        data?.payment_date || new Date().toLocaleDateString();

    $effect(() => {
        setCart(cart_items);
    });
</script>

<div
    class="flex-1 h-[500px] md:h-[400px] flex flex-col items-center justify-center"
>
    <div class="flex items-center justify-center">
        <!-- Lottie intentionally unchanged -->
    </div>

    <div class="md:w-[50%] w-full mx-auto">
        <div class="flex flex-col items-center justify-center">
            <p class="text-xl font-bold text-center">
                Yoo! Order Placed Successfully!
            </p>
            <p class="text-xs sm:text-sm text-gray-500 text-center">
                Thank you for your order.Expected delivery in 10-12 days.
            </p>
        </div>

        <div
            class="flex flex-col py-6 space-y-2 sm:flex-row gap-2 sm:gap-3 items-center justify-center"
        >
            <a
                href="/account/orders"
                class="bg-[var(--primary-color)] text-white px-4 py-2 rounded-md"
            >
                View Order
            </a>
            <a
                href="/"
                class="text-[var(--primary-color)] px-4 py-2 rounded-md"
            >
                Continue Shopping
            </a>
        </div>
    </div>

    <div
        class="md:w-[30%] w-[80%] bg-gray-100 border border-[var(--primary-color)]/40 p-4 rounded-md space-y-2 sm:space-y-3 mx-auto text-xs sm:text-sm text-gray-500"
    >
        <span class="flex items-center justify-between">
            <p class="flex-1">Order ID:</p>
            <p class="flex-1 text-left">{oid}</p>
        </span>

        <span class="flex items-center justify-between">
            <p class="flex-1">Payment Method:</p>
            <p class="flex-1 text-left">{payment_method}</p>
        </span>

        <span class="flex items-center justify-between">
            <p class="flex-1">Payment Date:</p>
            <p class="flex-1 text-left">{payment_date}</p>
        </span>
    </div>
</div>
