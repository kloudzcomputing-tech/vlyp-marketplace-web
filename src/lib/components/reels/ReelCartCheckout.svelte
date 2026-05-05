<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import AddressModal from "$lib/components/address/AddressModal.svelte";
    import { MapPin, X } from "@lucide/svelte";

    let { product, user, onclose } = $props();

    /* ---------------- STATE ---------------- */
    let qty = $state(1);
    let addresses = $state([]);
    let selectedAddress = $state(null);
    let cod = $state(false);
    let showAddAddress = $state(false);
    let isLoading = $state(false);
    let showAddressSelector = $state(false);

    /* ---------------- BILL CALCULATION ---------------- */
    const itemTotalOriginal = $derived(
        (product?.compare_at_price || product?.selling_price || 0) * qty
    );

    const itemTotalSelling = $derived(
        (product?.selling_price || 0) * qty
    );

    const discount = $derived(itemTotalOriginal - itemTotalSelling);

    const deliveryCharge = $derived(40);

    const tax = $derived(0); // 👉 change later if GST applied

    const total = $derived(itemTotalSelling + tax + deliveryCharge);

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
        if (onclose) onclose();
    }

    /* ---------------- FORMAT ADDRESS ---------------- */
    function formatAddress(addr) {
        if (!addr) return "";
        const parts = [addr.line1, addr.city, addr.state].filter(Boolean);
        return parts.join(", ");
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
                alert("Please select an address");
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

<!-- ================= Quick Checkout UI ================= -->
<div class="flex flex-col h-full bg-white">

    <!-- Header -->
    <div class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
        <h2 class="text-xl font-bold text-slate-900 tracking-tight">Quick Checkout</h2>
        <button
            onclick={close}
            class="w-9 h-9 rounded-full border border-slate-200 bg-slate-50 grid place-items-center text-slate-500 cursor-pointer transition-all duration-200 hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300"
            aria-label="Close checkout"
        >
            <X size={18} strokeWidth={2.5} />
        </button>
    </div>

    <!-- Scrollable Content -->
    <div class="flex-1 overflow-y-auto px-5 py-4 space-y-5 scrollbar-hide">

        <!-- Product Card -->
        <div class="flex items-center gap-4 bg-slate-50 rounded-2xl p-4">
            <div class="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-slate-200">
                <img
                    src={product?.image_url}
                    alt={product?.title}
                    class="w-full h-full object-cover"
                />
            </div>
            <div class="flex-1 min-w-0">
                <p class="font-semibold text-slate-900 text-base truncate">{product?.title}</p>
                <p class="text-sm text-slate-500 mt-0.5 capitalize">{product?.category || "Fashion"}</p>
                <p class="text-lg font-bold text-[var(--primary-color)] mt-1">₹{product?.selling_price}</p>
            </div>
        </div>

        <!-- Quantity Selector -->
        <div class="flex items-center justify-between py-3">
            <span class="text-sm font-medium text-slate-700">Quantity</span>
            <div class="flex items-center gap-3">
                <button
                    class="w-8 h-8 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-600 font-medium text-lg transition-all hover:bg-slate-50 hover:border-slate-300 disabled:opacity-30"
                    onclick={() => qty > 1 && qty--}
                    disabled={qty <= 1}
                >−</button>
                <span class="font-bold text-slate-900 w-6 text-center">{qty}</span>
                <button
                    class="w-8 h-8 rounded-full border border-slate-200 bg-white grid place-items-center text-slate-600 font-medium text-lg transition-all hover:bg-slate-50 hover:border-slate-300"
                    onclick={() => qty++}
                >+</button>
            </div>
        </div>

        <!-- Delivery Address -->
        {#if user}
            <div class="bg-slate-50 rounded-2xl p-4">
                {#if isLoading}
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 rounded-full bg-slate-200 animate-pulse"></div>
                        <div class="flex-1 space-y-2">
                            <div class="h-3 bg-slate-200 rounded animate-pulse w-24"></div>
                            <div class="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
                        </div>
                    </div>
                {:else if addresses.length === 0}
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-full bg-white border border-slate-200 grid place-items-center text-slate-400">
                                <MapPin size={18} />
                            </div>
                            <p class="text-sm text-slate-500">No address found</p>
                        </div>
                        <button
                            class="text-sm font-semibold text-[var(--primary-color)] hover:underline"
                            onclick={() => (showAddAddress = true)}
                        >
                            ADD
                        </button>
                    </div>
                {:else if selectedAddress}
                    <div class="flex items-start gap-3">
                        <div class="w-10 h-10 rounded-full bg-white border border-slate-200 grid place-items-center text-slate-400 flex-shrink-0 mt-0.5">
                            <MapPin size={18} />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Delivering to</p>
                            <p class="text-sm font-medium text-slate-800 leading-snug">{formatAddress(selectedAddress)}</p>
                        </div>
                        <button
                            class="text-sm font-semibold text-[var(--primary-color)] flex-shrink-0 hover:underline mt-3"
                            onclick={() => (showAddressSelector = !showAddressSelector)}
                        >
                            CHANGE
                        </button>
                    </div>

                    <!-- Address Selector Dropdown -->
                    {#if showAddressSelector}
                        <div class="mt-3 pt-3 border-t border-slate-200 space-y-2">
                            {#each addresses as addr}
                                <button
                                    class="w-full text-left p-3 rounded-xl border transition-all duration-200 text-sm
                                    {selectedAddress?.id === addr.id
                                        ? 'border-[var(--primary-color)] bg-[var(--primary-color)]/5'
                                        : 'border-slate-200 bg-white hover:border-slate-300'}"
                                    onclick={() => { selectedAddress = addr; showAddressSelector = false; }}
                                >
                                    <p class="font-medium text-slate-800">{addr.label}</p>
                                    <p class="text-slate-500 text-xs mt-0.5">{formatAddress(addr)}</p>
                                </button>
                            {/each}
                            <button
                                class="w-full text-center p-2.5 rounded-xl border border-dashed border-slate-300 text-sm font-medium text-slate-500 hover:border-[var(--primary-color)] hover:text-[var(--primary-color)] transition-all"
                                onclick={() => (showAddAddress = true)}
                            >
                                + Add New Address
                            </button>
                        </div>
                    {/if}
                {/if}
            </div>

            <!-- Payment Mode -->
            <div class="flex items-center gap-3 py-1">
                <label class="flex items-center gap-2.5 cursor-pointer">
                    <input
                        type="checkbox"
                        bind:checked={cod}
                        class="w-4.5 h-4.5 rounded border-slate-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)] cursor-pointer"
                    />
                    <span class="text-sm font-medium text-slate-700">Cash on Delivery</span>
                </label>
            </div>
        {/if}

        <!-- Total Section -->
        <div class="border-t border-slate-100 pt-4 space-y-1">
            <div class="flex items-center justify-between">
                <span class="text-sm font-semibold text-slate-400 uppercase tracking-wider">Total Payable</span>
                <span class="text-2xl font-bold text-slate-900">₹{total}</span>
            </div>
            <p class="text-xs text-slate-400">
                Includes ₹{deliveryCharge} delivery & handling charges
            </p>
        </div>
    </div>

    <!-- Pay Button - Fixed Bottom -->
    <div class="px-5 py-4 pb-[max(16px,env(safe-area-inset-bottom))] bg-white border-t border-slate-100">
        <button
            onclick={checkout}
            class="w-full py-4 rounded-full bg-[var(--primary-color)] hover:bg-[var(--primary-color-hover)] text-white text-base font-bold transition-all duration-300 shadow-lg shadow-[var(--primary-color)]/30 hover:shadow-xl hover:shadow-[var(--primary-color)]/40 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            disabled={!user}
        >
            Pay & Place Order
        </button>
    </div>
</div>

<!-- Address Modal -->
<AddressModal
    open={showAddAddress}
    onAddressAdded={refreshAddresses}
    onClose={() => (showAddAddress = false)}
/>
