<script>
    import { createEventDispatcher, onMount } from "svelte";
    import { goto } from "$app/navigation";
    import AddressModal from "$lib/components/address/AddressModal.svelte";

    let { product, user } = $props();
    const dispatch = createEventDispatcher();

    /* ---------------- STATE ---------------- */
    let qty = $state(1);
    let addresses = $state([]);
    let selectedAddress = $state(null);
    let cod = $state(false);
    let showAddAddress = $state(false);
    let isLoading = $state(false);

    /* ---------------- BILL CALCULATION ---------------- */
    const itemTotalOriginal = $derived(
        (product?.compare_at_price || product?.selling_price || 0) * qty
    );

    const itemTotalSelling = $derived(
        (product?.selling_price || 0) * qty
    );

    const discount = $derived(itemTotalOriginal - itemTotalSelling);

    const tax = $derived(0); // 👉 change later if GST applied

    const total = $derived(itemTotalSelling + tax);

    /* ---------------- LOAD ADDRESSES ---------------- */
    async function loadAddresses() {
        try {
            isLoading = true;

            const res = await fetch("/api/address");
            const json = await res.json();

            if (json.status) {
                addresses = json.data.addresses || [];
                selectedAddress = addresses[0] || null;
            }
        } catch (e) {
            console.error(e);
        } finally {
            isLoading = false;
        }
    }

    async function refreshAddresses() {
        await loadAddresses();
        showAddAddress = false;
    }

    /* ---------------- ACTIONS ---------------- */
    function close() {
        dispatch("close");
    }

    /* ---------------- CREATE ORDER ---------------- */
    async function createOrder({ is_cod }) {
        if (!selectedAddress) {
            throw new Error("Please select address");
        }
        console.log(product,"productproduct");
        
        const resp = await fetch(`/api/order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                shipping_address: selectedAddress,
                bill: {
                    items_total: itemTotalSelling * 100,
                    discount_total: discount * 100,
                    tax_total: tax * 100,
                    items_total_original: itemTotalOriginal * 100,
                },
                coupon_code: "",
                is_cod,
                cart_items: [
                {
                    id: product.id,
                    variant_id: product.variant_id,
                    vendor_id: product.vendor_id,
                    title: product.title,
                    category_id: product.category_id,
                    slug: product.slug,
                    sku: product.sku,
                    selling_price: product.selling_price,
                    compare_at_price: product.compare_at_price,
                    weight_grams: product.weight_grams,
                    image_url: product.image_url,
                    quantity: qty,
                },
            ],
            }),
        });

        const data = await resp.json();

        if (!data.status) {
            throw new Error(data.message || "Order creation failed");
        }

        // 👉 COD redirect
        if (is_cod) {
            goto(`/orders/success?mode=cod&oid=${data.order_id}`);
            return;
        }

        return data;
    }

    /* ---------------- CHECKOUT FLOW ---------------- */
    async function checkout() {
        try {
            if (!user) {
                dispatch("login");
                return;
            }

            if (!selectedAddress) {
                alert("Please select address");
                return;
            }

            /* ---------- COD ---------- */
            if (cod) {
                await createOrder({ is_cod: true });
                return;
            }

            /* ---------- ONLINE PAYMENT ---------- */
            const order = await createOrder({ is_cod: false });

            const res = await fetch(`/api/payu/init`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    order_id: order?.order_id,
                    cartItemNames: product?.title,
                    amount: total,
                    variant_ids: [product?.variation_id],
                }),
            });

            const data = await res.json();

            if (!data?.ok) {
                throw new Error("Could not initiate payment");
            }

            /* ---------- SUBMIT PAYU FORM ---------- */
            const form = document.createElement("form");
            form.method = "POST";
            form.action = data.action;

            Object.entries(data.params).forEach(([k, v]) => {
                if (!v) return;

                if (k === "amount") v = Number(v).toFixed(2);

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

    onMount(() => {
        if (user) loadAddresses();
    });
</script>

<!-- ================= UI ================= -->
<div class="h-full flex flex-col bg-white">

    <!-- Header -->
    <div class="flex items-center justify-between pb-3 border-b">
        <h2 class="font-bold text-lg">Your Order</h2>
        <button onclick={close} class="text-gray-500 text-lg">✕</button>
    </div>

    <!-- Product -->
    <div class="flex gap-3 py-4">
        <img src={product?.image_url} alt={product?.title}
            class="w-16 h-16 rounded-lg object-cover" />

        <div class="flex-1">
            <p class="font-semibold text-sm">{product?.title}</p>
            <p class="text-gray-500 text-xs">₹{product?.selling_price}</p>
        </div>
    </div>

    <!-- Quantity -->
    <div class="flex items-center justify-between py-3 border-t">
        <span class="text-sm font-medium">Quantity</span>

        <div class="flex items-center gap-3">
            <button class="px-2 py-1 border rounded"
                onclick={() => qty > 1 && qty--}>−</button>

            <span class="font-semibold">{qty}</span>

            <button class="px-2 py-1 border rounded"
                onclick={() => qty++}>+</button>
        </div>
    </div>

    <!-- Address -->
    {#if user}
        <div class="py-3 border-t space-y-2">
            <div class="flex items-center justify-between">
                <p class="text-sm font-medium">Select Address</p>

                <button class="text-xs text-blue-600 font-semibold"
                    onclick={() => (showAddAddress = true)}>
                    + Add Address
                </button>
            </div>

            {#if isLoading}
                <p class="text-xs text-gray-500">Loading...</p>

            {:else if addresses.length === 0}
                <p class="text-xs text-gray-500">No address found</p>

            {:else}
                {#each addresses as addr}
                    <div
                        class="p-2 border rounded cursor-pointer text-xs transition
                        {selectedAddress?.id === addr.id
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200'}"
                        onclick={() => (selectedAddress = addr)}
                    >
                        <p class="font-medium">{addr.label}</p>
                        <p class="text-gray-500">
                            {addr.line1}, {addr.city}, {addr.state}
                        </p>
                    </div>
                {/each}
            {/if}
        </div>

        <!-- Payment -->
        <div class="py-3 border-t flex items-center gap-2">
            <input type="checkbox" bind:checked={cod} />
            <span class="text-sm">Cash on Delivery</span>
        </div>
    {/if}

    <!-- Bill Summary -->
    <div class="border-t py-4 space-y-2 text-sm">
        <div class="flex justify-between">
            <span class="text-gray-600">Item total</span>
            <span>₹{itemTotalOriginal}</span>
        </div>

        <div class="flex justify-between">
            <span class="text-gray-600">Discount</span>
            <span class="text-green-600">-₹{discount}</span>
        </div>

        <div class="flex justify-between">
            <span class="text-gray-600">Tax</span>
            <span>₹{tax}</span>
        </div>

        <div class="flex justify-between font-semibold text-base border-t pt-2">
            <span>Total</span>
            <span>₹{total}</span>
        </div>
    </div>

    <!-- Button -->
    <button
        onclick={checkout}
        class="mt-auto w-full bg-black text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        disabled={!user}
    >
        Proceed to Pay
    </button>
</div>

<!-- Address Modal -->
<AddressModal
    open={showAddAddress}
    onAddressAdded={refreshAddresses}
    onClose={() => (showAddAddress = false)}
/>
