<script>
    let { data } = $props();
    let giftCards = data?.giftCards;

    const activeCards = $derived(
        giftCards?.filter((card) => card.status === 'active') || []
    );
    const usedCards = $derived(
        giftCards?.filter((card) => card.status === 'used') || []
    );
    const expiredCards = $derived(
        giftCards?.filter((card) => card.status === 'expired') || []
    );
</script>

<div class="space-y-6 p-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-light text-gray-900">Gift Cards</h1>
            <p class="text-sm text-gray-500 mt-1">
                {giftCards?.length || 0} {giftCards?.length === 1 ? 'gift card' : 'gift cards'}
            </p>
        </div>
        <button
            class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
            Add Gift Card
        </button>
    </div>

    <!-- Active Gift Cards -->
    {#if activeCards.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Active</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each activeCards as card}
                    <div class="border border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white hover:border-gray-300 transition-colors">
                        <div class="space-y-4">
                            <!-- Card Header -->
                            <div class="flex items-center justify-between">
                                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                    Active
                                </span>
                                {#if card.expiry_date}
                                    <span class="text-xs text-gray-500">
                                        Expires {card.expiry_date}
                                    </span>
                                {/if}
                            </div>

                            <!-- Card Code -->
                            <div>
                                <p class="text-xs text-gray-500 mb-1">Gift Card Code</p>
                                <div class="flex items-center gap-2">
                                    <p class="text-base font-mono font-medium text-gray-900">
                                        {card.code}
                                    </p>
                                    <button
                                        class="text-xs text-gray-600 hover:text-gray-900 transition-colors"
                                        onclick={() => {
                                            navigator.clipboard.writeText(card.code);
                                        }}
                                        title="Copy code"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <!-- Balance -->
                            <div class="pt-2 border-t border-gray-100">
                                <div class="flex items-baseline justify-between">
                                    <span class="text-xs text-gray-500">Balance</span>
                                    <span class="text-2xl font-light text-gray-900">
                                        ₹{card.balance}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between mt-1">
                                    <span class="text-xs text-gray-500">Original Amount</span>
                                    <span class="text-sm text-gray-400 line-through">
                                        ₹{card.amount}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Used Gift Cards -->
    {#if usedCards.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Used</h2>
            <div class="space-y-3">
                {#each usedCards as card}
                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <p class="text-sm font-mono font-medium text-gray-600">
                                        {card.code}
                                    </p>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-700">
                                        Used
                                    </span>
                                </div>
                                <div class="flex items-center gap-4 text-sm text-gray-600">
                                    <span>₹{card.amount}</span>
                                    {#if card.issued_date}
                                        <span class="text-xs text-gray-500">
                                            Used on {card.issued_date}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Expired Gift Cards -->
    {#if expiredCards.length > 0}
        <div class="space-y-4">
            <h2 class="text-sm font-medium text-gray-900">Expired</h2>
            <div class="space-y-3">
                {#each expiredCards as card}
                    <div class="border border-gray-200 rounded-lg p-5 bg-gray-50 opacity-75">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <p class="text-sm font-mono font-medium text-gray-500">
                                        {card.code}
                                    </p>
                                    <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-200 text-gray-600">
                                        Expired
                                    </span>
                                </div>
                                <div class="flex items-center gap-4 text-sm text-gray-500">
                                    <span>₹{card.amount}</span>
                                    {#if card.expiry_date}
                                        <span class="text-xs text-gray-400">
                                            Expired on {card.expiry_date}
                                        </span>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    <!-- Empty State -->
    {#if !giftCards || giftCards.length === 0}
        <div class="text-center py-12 border border-gray-200 rounded-lg">
            <p class="text-gray-500 mb-4">No gift cards</p>
            <button
                class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
                Add Your First Gift Card
            </button>
        </div>
    {/if}
</div>
