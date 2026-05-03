<script>
    import { goto } from "$app/navigation";
    import { PlusIcon } from "@lucide/svelte";
    import AddressModal from "$lib/components/address/AddressModal.svelte";
    import AllAddressModal from "$lib/components/address/AllAddressModal.svelte";
    import CartListItem from "$lib/components/CartListItem.svelte";
    import PaymentFailedModal from "$lib/components/checkout/PaymentFailedModal.svelte";
    import { cart as _cart, setCart } from "$lib/stores/cart";
    import { onMount } from "svelte";
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    import CheckBox from "$lib/components/CheckBox.svelte";
    import CouponListCard from "$lib/components/coupon/CouponListCard.svelte";

    let { data } = $props();
    let isLoading = $state(true);

    let cart = $state(data?.items || []);
    let addresses = $state(data?.addresses || []);
    let coupons = $state([]);
    let user_id = $state(data?.user_id || null);

    let payment_failed = $state(data?.payment_failed || false);
    let error_message = $state(data?.error_message || "");
    let coupon_discount = $state(0);
    let showAddAddressModal = $state(false);
    let showAllAddressesModal = $state(false);
    let addressPromise = $state(null);
    let billPromise = $state(null);
    let appliedCoupons = $state([]);
    let discount = $state(0);
    let cod = $state(false);
    let deliveryFee = $state(0);
    let tax = $state(0);
    let selectedAddress = $derived(
        addresses[0] || null,
        // addresses.find((address) => address.is_default) || null
    );
    let deliveryMode = $state("surface");
    let items_total = $derived(
        cart?.reduce(
            (acc, item) => acc + item.selling_price * item.quantity,
            0,
        ),
    );
    let items_total_original = $derived(
        cart?.reduce(
            (acc, item) => acc + item.compare_at_price * item.quantity,
            0,
        ),
    );

    let total = $derived(
        (
            items_total -
            appliedCoupons.reduce(
                (acc, coupon) => acc + coupon.discount_amount,
                0,
            )
        ).toFixed(2),
    );

    const getAddresses = async () => {
        try {
            isLoading = true;
            const response = await fetch("/api/address", {
                method: "GET",
            });
            const { status, message, data } = await response.json();
            if (status) {
                isLoading = false;
                addresses = data.addresses;
            }
        } catch (error) {
            isLoading = false;
            console.error(error);
        }
    };
    async function _getAddresses() {
        try {
            const response = await fetch("/api/address", {
                method: "GET",
            });
            const { status, message, data } = await response.json();
            if (status) {
                return data.addresses;
            }
            return [];
        } catch (error) {
            return [];
        }
    }

    async function getCoupons() {
        const resp = await fetch(`/api/coupons`, {
            method: "POST",
            body: JSON.stringify({
                amount: items_total,
                user_id: user_id,
                is_global: true,
            }),
        });
        const couponsJson = await resp.json();
        if (couponsJson.status) {
            coupons = couponsJson.data.coupons;
        }
    }

    async function getBillDetails() {
        let payload = {
            cart: cart,
            delivery_address: selectedAddress,
            delivery_mode: deliveryMode === "surface" ? "S" : "E",
            coupon_code: "",
            is_cod: cod,
        };
        isLoading = true;
        const resp = await fetch(`/api/bill`, {
            method: "POST",
            body: JSON.stringify(payload),
        });
        isLoading = false;
        const { status, message, data } = await resp.json();
        if (status) {
            items_total = data.items_total;
            items_total_original = data.items_total_original;
            discount = data.discount_total;
            deliveryFee = data.shipping_total;
            tax = data.tax_total;
        } else {
            throw new Error(data.message);
        }
    }

    async function createOrder({ is_cod }) {
        //call create order API
        const resp = await fetch(`/api/order`, {
            method: "POST",
            body: JSON.stringify({
                shipping_address: selectedAddress,
                bill: {
                    items_total: items_total_original*100,
                    discount_total: discount*100,
                    tax_total: tax*100,
                    items_total_original: total*100,
                },
                coupon_code: "",
                is_cod,
            }),
        });
        const data = await resp.json();

        if (!data.status) {
            throw new Error(data.message);
        }
        setCart([]);
        //redirect to order success page
        if (is_cod) {
            goto(
                `/orders/success?mode=cod&oid=${data.order_id}`,
            );
        } else {
            return data;
        }
    }
    async function handleProceedToPay() {
        try {
            if (cod) {
                return createOrder({ is_cod: true });
            }
            const order = await createOrder({ is_cod: false });
            const cartItemNames = cart.map((item) => item.title).join(", ");
            const res = await fetch(`/api/payu/init`, {
                method: "POST",
                body: JSON.stringify({
                    order_id: order?.order_id,
                    cartItemNames: cartItemNames,
                    amount: items_total,
                    variant_ids: cart.map((item) => item.variation_id),
                }),
            });

            const data = await res.json();

            if (!data?.ok) {
                throw new Error("Could not initiate payment");
            }
            // Submit a form to PayU
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.action;
            let t = Object.entries(data.params).filter(([k, v]) => {
                if (v != undefined && v != null && v != "") return [k, v];
            });
            // t.push(["pg", "TESTPG"]);
            // t.push(["bankcode", "TESTPGNB"]);
            // t.push(["vpa", "999999999@payu"]);
            t.forEach(([k, v]) => {
                if (v === undefined || v === null || v === "") return;
                if (k == "amount") {
                    v = Number(v).toFixed(2);
                }
                const input = document.createElement("input");
                input.type = "hidden";
                input.name = k;
                input.value = v;
                form.appendChild(input);
            });
            document.body.appendChild(form);
            form.submit();
        } catch (error) {
            alert(error.message);
        }
    }

    const refreshAddressPromise = () => {
        addressPromise = _getAddresses();
    };

    function applyCoupon(coupon) {
        let discount_amount = 0;
        if (coupon.discount_type === "PERCENTAGE") {
            discount_amount = items_total * (coupon.discount_value / 100);
        } else {
            discount_amount = coupon.discount_value;
        }
        appliedCoupons = [
            ...appliedCoupons,
            { ...coupon, discount_amount: discount_amount },
        ];
    }
    function removeCoupon(coupon) {
        appliedCoupons = appliedCoupons.filter((c) => c.id !== coupon.id);
    }
    onMount(() => {
        addressPromise = _getAddresses();
        getCoupons();
        if (cart.length > 0 && selectedAddress) {
            billPromise = getBillDetails();
        }
    });
    const refreshBillPromise = () => {
        billPromise = getBillDetails();
        getCoupons();
    };
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    class="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto px-3 py-3 sm:py-4 md:py-6 lg:py-8 sm:pb-4 md:pb-6 lg:pb-8 min-h-screen"
>
    <!-- Left Column -->
    <div
        class="md:flex-1 flex justify-center sm:px-4 md:px-6 lg:px-8 lg:justify-end"
    >
        <div class="w-full lg:w-[90%] space-y-3 sm:space-y-4 md:space-y-6">
            <!-- Items Section -->
            <div
                class="space-y-2 sm:space-y-3 pb-3 sm:pb-4 md:pb-6 border-b border-gray-100"
            >
                {#if cart.length > 0}
                    <div class="space-y-2 sm:space-y-3">
                        {#each cart as item}
                            <CartListItem {item} />
                        {/each}
                    </div>
                {:else}
                    <div
                        class="space-y-2 bg-gray-100 p-4 rounded-lg sm:space-y-3"
                    >
                        <p class="text-gray-500 text-center">
                            No items in cart
                        </p>
                    </div>
                {/if}
            </div>
            <!-- Delivery Address -->
            <div class="">
                <div class="flex p-2 items-center justify-between">
                    <p class="text-gray-900 text-sm sm:text-base font-medium">
                        Delivery address
                    </p>
                    <button
                        onclick={() => {
                            showAddAddressModal = true;
                        }}
                        class="text-[var(--primary-color)] cursor-pointer hover:bg-blue-50 text-xs text-blue-500 px-4 py-2 rounded-md font-medium"
                        >Add Address</button
                    >
                </div>

                {#await addressPromise}
                    <div class="space-y-2">
                        <Skeleton class="w-full h-20 rounded-lg" />
                    </div>
                {:then _addresses}
                    <div class="space-y-2">
                        {#if _addresses?.length > 0}
                            <div class="space-y-2">
                                {#each _addresses as address}
                                    <div
                                        onclick={() => {
                                            selectedAddress = address;
                                            refreshBillPromise();
                                        }}
                                        style="border-color: {selectedAddress.id ===
                                        address.id
                                            ? 'var(--primary-color)'
                                            : 'transparent'}"
                                        class="p-4 bg-gray-50 border-1 rounded-lg"
                                    >
                                        <p
                                            class="text-sm font-bold text-gray-600"
                                        >
                                            {address.label}
                                        </p>
                                        <p
                                            class="text-sm font-medium text-gray-500"
                                        >
                                            {address.line1}, {address.line2},
                                            {address.city}, {address.state}, {address.postal_code}
                                        </p>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p
                                class="text-sm text-center sm:text-base font-medium text-gray-600 line-clamp-2"
                            >
                                No address found
                            </p>
                        {/if}
                    </div>
                {:catch error}
                    <p
                        class="text-sm text-center sm:text-base font-medium text-gray-600 line-clamp-2"
                    >
                        {error.message}
                    </p>
                {/await}
            </div>
            
        </div>
    </div>
    <!-- Right Column -->
    <div
        class="flex-1 flex justify-center sm:px-4 md:px-6 lg:px-8 lg:justify-start"
    >
        <div class="w-full lg:w-[70%] space-y-3 sm:space-y-4 md:space-y-6">
            <!-- Coupon -->
            {#if coupons.length > 0}
                <div class="space-y-2 sm:space-y-3">
                    <h3 class="text-xs sm:text-sm font-medium text-gray-900">
                        Coupon
                    </h3>
                    <div class="space-y-2">
                        {#each coupons as coupon}
                            <CouponListCard
                                {coupon}
                                isSelected={appliedCoupons.find(
                                    (c) => c.id === coupon.id,
                                )}
                                {removeCoupon}
                                {applyCoupon}
                            />
                        {/each}
                    </div>
                </div>
            {/if}

            
            <!-- Delivery Mode -->
            <!-- <div class="space-y-2 sm:space-y-3">
                <h3 class="text-xs sm:text-sm font-medium text-gray-900">
                    Select Delivery Mode
                </h3>
                <div class="flex items-stretch sm:items-center gap-2 sm:gap-3">
                    <label class="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="delivery-mode"
                            value="surface"
                            bind:group={deliveryMode}
                            onchange={() => {
                                deliveryMode = "surface";
                                getBillDetails();
                            }}
                            class="sr-only"
                        />
                        <div
                            class="border rounded-lg p-3 sm:p-4 transition-all {deliveryMode ===
                            'surface'
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'}"
                        >
                            <p
                                class="text-xs sm:text-sm font-medium text-gray-900"
                            >
                                Surface Delivery
                            </p>
                            <p
                                class="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1"
                            >
                                5-7 days
                            </p>
                        </div>
                    </label>
                    <label class="flex-1 cursor-pointer">
                        <input
                            type="radio"
                            name="delivery-mode"
                            value="express"
                            bind:group={deliveryMode}
                            onchange={() => {
                                deliveryMode = "express";
                                getBillDetails();
                            }}
                            class="sr-only"
                        />
                        <div
                            class="border rounded-lg p-3 sm:p-4 transition-all {deliveryMode ===
                            'express'
                                ? 'border-gray-900 bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'}"
                        >
                            <p
                                class="text-xs sm:text-sm font-medium text-gray-900"
                            >
                                Express Delivery
                            </p>
                            <p
                                class="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1"
                            >
                                2-3 days
                            </p>
                        </div>
                    </label>
                </div>
            </div> -->

            <!-- Price summary -->
            <div class="">
                <p
                    class="text-sm font-medium text-gray-700 px-1 sm:px-2 py-1.5"
                >
                    Bill Summary
                </p>
                {#if !isLoading}
                    <div
                        class="w-full space-y-3 bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm"
                    >
                        <div class="w-full flex items-center justify-between">
                            <p class="text-sm font-normal text-gray-600">
                                Item total
                            </p>
                            <p class="text-sm font-semibold text-gray-800">
                                ₹{items_total_original}
                            </p>
                        </div>
                        <div class="w-full flex items-center justify-between">
                            <p class="text-sm font-normal text-gray-600">
                                Discount
                            </p>
                            <p
                                class="text-xs sm:text-sm text-green-600 font-semibold"
                            >
                                -₹{items_total_original - items_total}
                            </p>
                        </div>
                        <div class="w-full flex items-center justify-between">
                            <p class="text-sm font-normal text-gray-600">
                                Coupons
                            </p>
                            <p
                                class="text-xs sm:text-sm text-green-600 font-semibold"
                            >
                                {appliedCoupons.length > 0
                                    ? "-"
                                    : ""}₹{appliedCoupons.reduce(
                                    (acc, coupon) =>
                                        acc + coupon.discount_amount,
                                    0,
                                )}
                            </p>
                        </div>
                        <div
                            class="pt-3 mt-1 border-t border-dashed border-gray-300 w-full flex items-center justify-between"
                        >
                            <p class="text-sm font-semibold text-gray-900">
                                Total
                            </p>
                            <p class="text-base font-bold text-gray-900">
                                ₹{total}
                            </p>
                        </div>
                    </div>
                {:else}
                    <div class="space-y-1.5 sm:space-y-2">
                        <Skeleton class="w-full h-40 rounded-lg" />
                    </div>
                {/if}
            </div>

            <div
                class=" px-4 py-3 space-y-4 hidden md:block"
                style="
padding-bottom: max(70px, env(safe-area-inset-bottom));
"
            >
                <!-- Payment Method -->
                <CheckBox
                    bind:checked={cod}
                    label="Cash on Delivery"
                    onChange={(checked) => {
                        cod = checked;
                        getBillDetails();
                    }}
                />

                <!-- Proceed Button - Desktop -->
                <button
                    onclick={handleProceedToPay}
                    class="w-full cursor-pointer bg-[var(--primary-color)] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition"
                >
                    Proceed to Pay
                </button>
            </div>
        </div>
    </div>
    <div
        class="sticky md:hidden bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-5 px-4 py-3 space-y-4"
        style="
padding-bottom: max(70px, env(safe-area-inset-bottom));
"
    >
        <!-- Payment Method -->
        <CheckBox
            bind:checked={cod}
            label="Cash on Delivery"
            onChange={(checked) => {
                cod = checked;
                getBillDetails();
            }}
        />

        <!-- Proceed Button - Desktop -->
        <button
            onclick={handleProceedToPay}
            class="w-full cursor-pointer bg-[var(--primary-color)] text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-sm hover:shadow-md active:scale-[0.98] transition"
        >
            Proceed to Pay
        </button>
    </div>
</div>

<AddressModal
    open={showAddAddressModal}
    onAddressAdded={() => {
        refreshAddressPromise();
        showAddAddressModal = false;
    }}
    onClose={() => {
        showAddAddressModal = false;
    }}
/>

<PaymentFailedModal
    open={payment_failed}
    onClose={() => {
        payment_failed = false;
        const url = new URL(location.href);
        const cleanUrl = new URL(`${url.protocol}//${url.host}${url.pathname}`);

        cleanUrl.searchParams.delete("payment_failed");
        cleanUrl.searchParams.delete("error_message");

        goto(cleanUrl.toString(), { replaceState: true });
    }}
    {error_message}
/>
