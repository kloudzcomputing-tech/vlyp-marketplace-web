<script>
    let { data } = $props();
    let coupons = data?.coupons;

    const activeCoupons = $derived(
        coupons?.filter((coupon) => coupon.status === 'active') || []
    );
    const usedCoupons = $derived(
        coupons?.filter((coupon) => coupon.status === 'used') || []
    );
    const expiredCoupons = $derived(
        coupons?.filter((coupon) => coupon.status === 'expired') || []
    );

    function copyCode(code) {
        navigator.clipboard.writeText(code);
    }

    function formatDiscount(coupon) {
        if (coupon.discount_type === 'percentage') {
            return `${coupon.discount}% OFF`;
        } else {
            return `₹${coupon.discount} OFF`;
        }
    }
</script>

<div class="space-y-6 p-6">
    <!-- Header -->
<div>
        <h1 class="text-2xl font-light text-gray-900">Coupons</h1>
        <p class="text-sm text-gray-500 mt-1">
            {coupons?.length || 0} {coupons?.length === 1 ? 'coupon' : 'coupons'} available
        </p>
    </div>

    <!-- Active Coupons -->
    {#if activeCoupons.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Available</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each activeCoupons as coupon}
                    <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 transition-colors">
                        <div class="space-y-4">
                            <!-- Coupon Header -->
                            <div class="flex items-center justify-between">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                    Active
                                </span>
                                {#if coupon.expiry_date}
                                    <span class="text-xs text-gray-500">
                                        Expires {coupon.expiry_date}
                                    </span>
                                {/if}
                            </div>

                            <!-- Discount Badge -->
                            <div class="flex items-center gap-3">
                                <div class="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-900 flex items-center justify-center">
                                    <span class="text-white text-xs font-medium text-center leading-tight">
                                        {formatDiscount(coupon)}
                                    </span>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-gray-900 mb-1">
                                        {coupon.description}
                                    </p>
                                    {#if coupon.min_purchase}
                                        <p class="text-xs text-gray-500">
                                            Min. purchase: ₹{coupon.min_purchase}
                                        </p>
                                    {/if}
                                </div>
                            </div>

                            <!-- Coupon Code -->
                            <div class="pt-3 border-t border-gray-100">
                                <p class="text-xs text-gray-500 mb-2">Coupon Code</p>
                                <div class="flex items-center gap-2">
                                    <div class="flex-1 px-3 py-2 bg-gray-100 rounded-md border border-gray-200">
                                        <p class="text-sm font-mono font-medium text-gray-900">
                                            {coupon.code}
                                        </p>
                                    </div>
                                    <button
                                        onclick={() => copyCode(coupon.code)}
                                        class="px-4 py-2 text-xs font-medium text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <!-- Terms -->
                            {#if coupon.max_discount || coupon.applicable_on}
                                <div class="pt-2 space-y-1">
                                    {#if coupon.max_discount && coupon.discount_type === 'percentage'}
                                        <p class="text-xs text-gray-500">
                                            Max discount: ₹{coupon.max_discount}
                                        </p>
                                    {/if}
                                    {#if coupon.applicable_on}
                                        <p class="text-xs text-gray-500">
                                            {coupon.applicable_on}
                                        </p>
                                    {/if}
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Used Coupons -->
    {#if usedCoupons.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Used</h2>
            <div class="space-y-3">
                {#each usedCoupons as coupon}
                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="px-3 py-1 bg-gray-200 rounded-md">
                                        <p class="text-sm font-mono font-medium text-gray-600">
                                            {coupon.code}
                                        </p>
                                    </div>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        Used
                                    </span>
                                </div>
                                <p class="text-sm text-gray-600">
                                    {coupon.description}
                                </p>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Expired Coupons -->
    {#if expiredCoupons.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Expired</h2>
            <div class="space-y-3">
                {#each expiredCoupons as coupon}
                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 opacity-75">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <div class="px-3 py-1 bg-gray-200 rounded-md">
                                        <p class="text-sm font-mono font-medium text-gray-500">
                                            {coupon.code}
                                        </p>
                                    </div>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                        Expired
                                    </span>
                                </div>
                                <p class="text-sm text-gray-500">
                                    {coupon.description}
                                </p>
                                {#if coupon.expiry_date}
                                    <p class="text-xs text-gray-400 mt-1">
                                        Expired on {coupon.expiry_date}
                                    </p>
                                {/if}
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Empty State -->
    {#if !coupons || coupons.length === 0}
        <div class="text-center py-12 border border-gray-200 rounded-lg">
            <p class="text-gray-500 mb-4">No coupons available</p>
            <p class="text-sm text-gray-400">
                Check back later for new offers
            </p>
        </div>
    {/if}
</div>
