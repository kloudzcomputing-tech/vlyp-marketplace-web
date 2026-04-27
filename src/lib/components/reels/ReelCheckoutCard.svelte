<script>
    import {
        reelShopCheckoutOpen,
        reelShopCart,
        reelShopLockXScroll,
        reelShopSuccessOpen,
        clearReelShopCart,
    } from "$lib/stores/reelShop";
    import { onMount } from "svelte";
    import AddressModal from "$lib/components/address/AddressModal.svelte";

    let addresses = $state([]);

    let itemTotal = $derived(
        $reelShopCart.reduce(
            (acc, product) => acc + product.selling_price * product.quantity,
            0,
        ),
    );

    let showAddressModal = $state(false);

    async function getAddresses() {
        try {
            const response = await fetch("/api/address", {
                method: "GET",
            });
            const { status, message, data } = await response.json();
            if (status) {
                addresses = data.addresses;
            }
        } catch (error) {
            console.error(error);
        }
    }

    onMount(() => {
        getAddresses();
    });
</script>

<div class="flex-1 overflow-y-auto">
    {#each $reelShopCart as product}
        <div class="flex items-center px-4 py-2">
            <div class="flex-1 flex items-start gap-2">
                <img
                    src={product.image_url}
                    alt={product.title}
                    loading="lazy"
                    class="w-[60px] h-[60px] aspect-square object-contain transition-transform duration-300 hover:scale-105"
                />
                <div>
                    <p
                        class="text-sm sm:text-base font-medium text-gray-900 line-clamp-2"
                    >
                        {product.title.length > 30
                            ? product.title.slice(0, 30) + "..."
                            : product.title}
                    </p>
                </div>
            </div>
            <div>
                <button
                    class="bg-gray-900 w-[80px] text-white py-2 sm:py-3 rounded-sm text-sm sm:text-base font-semibold hover:bg-gray-800 hover:scale-105 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
                    >Add</button
                >
            </div>
        </div>
    {/each}
    <div class="p-4">
        <div class="flex p-2 items-center justify-between">
            <p class="text-gray-900 text-sm sm:text-base font-medium">
                Delivery address
            </p>
            {#if addresses.length > 0}
                <button
                    class="text-[var(--primary-color)] text-sm sm:text-base font-medium"
                    >Change</button
                >
            {:else}
                <button
                    onclick={() => {
                        showAddressModal = true;
                    }}
                    class="text-[var(--primary-color)] text-sm sm:text-base font-medium"
                    >Add Address</button
                >
            {/if}
        </div>

        <div class="p-4 bg-gray-100">
            {#if addresses.length > 0}
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    {addresses[0].line1}, {addresses[0].line2}, {addresses[0].city}, {addresses[0].state}
                </p>
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    {addresses[0].postal_code}
                </p>
            {:else}
                <p
                    class="text-sm text-center sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    No address found
                </p>
            {/if}
        </div>
    </div>
    <div class="p-4">
        <div class="flex p-2 items-center justify-between">
            <p class="text-gray-900 text-sm sm:text-base font-medium">
                Bill details
            </p>
        </div>

        <div class="px-4 py-2 space-y-1 bg-gray-100">
            <span class="flex items-center justify-between">
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    Item total
                </p>
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    ₹{itemTotal}
                </p>
            </span>
            <span class="flex items-center justify-between">
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    Delivery Fee
                </p>
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2 text-green-500"
                >
                    Free
                </p>
            </span>
            <span class="flex items-center justify-between">
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    GST on Fees
                </p>
                <p
                    class="text-sm sm:text-base font-medium text-gray-600 line-clamp-2"
                >
                    ₹0.50
                </p>
            </span>
        </div>
        <span class="p-2 px-4 flex items-center justify-between">
            <p
                class="text-sm sm:text-base font-bold text-gray-800 line-clamp-2"
            >
                To Pay
            </p>
            <p
                class="text-sm sm:text-base font-bold text-gray-600 line-clamp-2"
            >
                ₹{itemTotal}
            </p>
        </span>
    </div>
</div>
<div class="flex items-center gap-2 sm:gap-3 p-4 sm:p-6 bg-white">
    <button
        onclick={() => {
            reelShopCheckoutOpen.set(false);
            reelShopLockXScroll.set(false);
        }}
        class="cart-btn flex-1 border-2 border-[var(--primary-color)] text-[var(--primary-color)] py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-[var(--primary-color-hover)] hover:text-[var(--primary-color-text)] transition-all duration-200 active:scale-95"
    >
        Cancel
    </button>
    <button
        class="buy-btn flex-1 border-2 border-[var(--primary-color)] bg-[var(--primary-color)] text-[var(--primary-color-text)] py-3 sm:py-4 rounded-xl text-sm sm:text-base font-semibold hover:bg-[var(--primary-color-hover)] hover:scale-105 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
        onclick={() => {
            reelShopSuccessOpen.set(true);
            reelShopCheckoutOpen.set(false);
            reelShopLockXScroll.set(true);
            clearReelShopCart();
        }}
    >
        Pay now
    </button>
</div>

<AddressModal
    open={showAddressModal}
    onAddressAdded={() => {
        getAddresses();
        showAddressModal = false;
    }}
    onClose={() => {
        showAddressModal = false;
    }}
/>
