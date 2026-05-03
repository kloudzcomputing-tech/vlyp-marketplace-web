<script>
    import { cart, setCart } from "$lib/stores/cart";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import { goto } from "$app/navigation";
    import { onMount } from "svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import LoginModal from "$lib/components/auth/LoginModal.svelte";
    import { ShoppingBagIcon } from "@lucide/svelte";
    import CartListItem from "$lib/components/CartListItem.svelte";

    console.log($cart,"cart")
    let { data } = $props();
    let isLoading = $state(false);
    let openLoginModal = $state(false);
    let items = $state(data?.items || []);
    let selectedItems = $derived(items);
    let coupons = $state(0);
    let items_total = $derived(
        selectedItems.reduce(
            (acc, item) => acc + item.compare_at_price * item.quantity,
            0,
        ),
    );
    let discount = $derived(
        selectedItems.reduce(
            (acc, item) => acc + item.compare_at_price - item.selling_price,
            0,
        ),
    );
    let total = $derived(items_total - discount + coupons);

    function removeFromCart(item) {
        isLoading = true;
        fetch(`/api/cart`, {
            method: "DELETE",
            body: JSON.stringify({ id: item.id }),
        })
            .then((response) => {
                response.json().then((data) => {
                    if (data.status) {
                        location.reload();
                    }
                });
            })
            .catch((error) => {
                isLoading = false;
            });
    }
    function addToWishlist(item) {}

    function goToPlaceOrder() {
        fetch(`/api/cart/checkout-items`, {
            method: "POST",
            body: JSON.stringify({ selected_items: selectedItems }),
        }).then((response) => {
            response.json().then((data) => {
                if (data.status) {
                    goto("/checkout");
                }
            });
        });
    }
    function handlePlaceOrder() {
        if (!data?.customer) {
            openLoginModal = true;
            return;
        }
        goToPlaceOrder();
    }
    onMount(() => {
        setCart(items);
    });
</script>

<div class=" bg-gray-50">
    <!-- Header -->
    <div class="border-b border-gray-200 bg-white">
        <div class="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
            <h1
                class="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900"
            >
                Shopping Cart
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
                You have <span class="font-medium text-gray-700"
                    >{items.length}</span
                >
                {items.length === 1 ? " item" : " items"} in your cart
            </p>
        </div>
    </div>

    <!-- Main content -->
    <div
        class="max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 flex flex-col md:flex-row items-start gap-4 md:gap-6"
    >
        <!-- Cart items -->
        <div class="w-full flex flex-col space-y-3 sm:space-y-4">
            {#if isLoading}
                <div class="space-y-3">
                    <Skeleton class="w-full h-20 rounded-xl" />
                    <Skeleton class="w-full h-20 rounded-xl" />
                </div>
            {:else if $cart.length > 0}
                {#each $cart as item}
                    <CartListItem {item} bind:selectedItems={selectedItems}/>
                {/each}
            {:else}
                <div
                    class="flex flex-col bg-gray-100 rounded-xl p-4 gap-4 items-center justify-center h-[200px]"
                >
                    <ShoppingBagIcon size={50} class="text-gray-300" />
                    <p class="text-gray-500 text-center">No items in cart</p>
                </div>
            {/if}
        </div>

        {#if $cart.length > 0}
            <!-- Price summary -->
            <div class="w-full md:w-1/3 md:sticky md:top-28 md:space-y-3">
                <p
                    class="text-sm font-medium text-gray-700 px-1 sm:px-2 py-1.5"
                >
                    Price details
                </p>
                <div
                    class="w-full space-y-3 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm"
                >
                    <div class="w-full flex items-center justify-between">
                        <p class="text-sm font-normal text-gray-600">
                            Item total
                        </p>
                        <p class="text-sm font-semibold text-gray-800">
                            ₹{items_total}
                        </p>
                    </div>
                    <div class="w-full flex items-center justify-between">
                        <p class="text-sm font-normal text-gray-600">
                            Discount
                        </p>
                        <p
                            class="text-xs sm:text-sm text-green-600 font-semibold"
                        >
                            -₹{discount}
                        </p>
                    </div>
                    <div class="w-full flex items-center justify-between">
                        <p class="text-sm font-normal text-gray-600">Coupons</p>
                        <p class="text-sm font-semibold text-gray-800">
                            ₹{coupons}
                        </p>
                    </div>
                    <div
                        class="pt-3 mt-1 border-t border-dashed border-gray-300 w-full flex items-center justify-between"
                    >
                        <p class="text-sm font-semibold text-gray-900">Total</p>
                        <p class="text-base font-bold text-gray-900">
                            ₹{total}
                        </p>
                    </div>
                </div>
                <div class="hidden md:block">
                    <button
                        onclick={handlePlaceOrder}
                        class="w-full cursor-pointer bg-[var(--primary-color)] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition"
                    >
                        Checkout
                    </button>
                </div>
            </div>
        {/if}
    </div>
    <div class="md:hidden p-4 py-8">
        <p class="text-start text-6xl font-bold text-gray-300">
            With Love from Vlyp
        </p>
    </div>
    <!-- Mobile sticky footer -->
    <div
        class="sticky sm:hidden bottom-0 left-0 right-0 z-[9] bg-white border-t border-gray-200 shadow-2xl px-4 py-3 space-x-4 flex items-center justify-between"
        style="
    padding-bottom: max(70px, env(safe-area-inset-bottom));
  "
    >
        <div>
            <p class="text-xs text-gray-500">Total</p>
            <p class="text-lg font-bold text-gray-900">₹{total}</p>
        </div>
        <button
            class="flex-1 flex items-center justify-center bg-[var(--primary-color)] text-white font-semibold text-sm px-4 py-2.5 rounded-mdw-full px-5 sm:px-6 py-3.5 text-sm font-medium
   rounded-md text-black
   transition-all duration-200
   shadow-sm
   disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-[0.98] transition"
            onclick={handlePlaceOrder}
        >
            Checkout
        </button>
    </div>
</div>

<LoginModal
    open={openLoginModal}
    onClose={() => (openLoginModal = false)}
    onLoggedIn={() => {
        openLoginModal = false;
        goToPlaceOrder();
    }}
/>
