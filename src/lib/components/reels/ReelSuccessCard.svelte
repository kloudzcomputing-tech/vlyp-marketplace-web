<script>
import { LottiePlayer } from "@lottiefiles/svelte-lottie-player";
import { reelShopSuccessOpen, reelShopLockXScroll } from "$lib/stores/reelShop";

</script>

<div class="flex-1">
    <div class="flex items-center justify-center">
        <LottiePlayer
            src="https://lottie.host/e90344ed-b966-4b8b-b26a-3fdf46f1bc66/eazTyUSBrt.json"
            autoplay={true}
            loop={false}
            controls={false}
            renderer="svg"
            background="white"
            height={150}
            width={150}
            controlsLayout={[
                "previousFrame",
                "playpause",
                "stop",
                "nextFrame",
                "progress",
                "frame",
                "loop",
                "snapshot",
                "zoom",
                "info",
            ]}
        />
    </div>
    <div class="w-[70%] mx-auto">
        <div class="flex flex-col items-center justify-center">
            <p class="text-xl font-bold text-center">
                Yoo! Order Placed Successfully!
            </p>
            <p class="text-xs sm:text-sm text-gray-500 text-center">
                Thank you for your order.Expected delivery in 10-12
                days.
            </p>
        </div>
        <div
            class="flex flex-col py-6 space-y-2 sm:flex-row gap-2 sm:gap-3 items-center justify-center"
        >
            <button
                class="bg-[var(--primary-color)] text-[var(--primary-color-text)] px-4 py-2 rounded-md"
                onclick={() => {}}>View Order</button
            >
            <button
                class="text-[var(--primary-color)] px-4 py-2 rounded-md"
                onclick={() => {
                    reelShopSuccessOpen.set(false);
                    reelShopLockXScroll.set(false);
                }}>Continue Shopping</button
            >
        </div>
    </div>
    <div
        class="w-[80%] bg-gray-50 p-4 rounded-md space-y-2 sm:space-y-3 mx-auto text-xs sm:text-sm text-gray-500"
    >
        <span class="flex items-center justify-between">
            <p class="flex-1">Order ID:</p>
            <p class="flex-1 text-left">1234567890</p>
        </span>
        <span class="flex items-center justify-between">
            <p class="flex-1">Payment Method:</p>
            <p class="flex-1 text-left">COD</p>
        </span>
        <span class="flex items-center justify-between">
            <p class="flex-1">Payment Date:</p>
            <p class="flex-1 text-left">2025-01-01</p>
        </span>
    </div>
</div>