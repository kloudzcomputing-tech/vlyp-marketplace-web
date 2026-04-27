<script>
    import { onMount } from "svelte";
    import AddAddressCard from "$lib/components/account/address/AddAddressCard.svelte";

    let { data } = $props();

    let addresses = $state([]);
    let showNewAddressModal = $state(false);
    let loading = $state(false);

    // Fetch existing addresses
    const fetchAddresses = async () => {
        try {
            loading = true;
            const response = await fetch("/api/address", {
                method: "GET",
            });
            const { status, data } = await response.json();
            if (status) {
                addresses = data.addresses || [];
            } else {
                addresses = [];
            }
        } catch (error) {
            addresses = [];
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        fetchAddresses();
    });

    // After add address
    const handleAddressAdded = () => {
        showNewAddressModal = false;
        fetchAddresses();
    };

    // Delete address
    const handleDelete = async (address) => {
        const previous = [...addresses];
        addresses = addresses.filter((a) => a.id !== address.id);

        const response = await fetch(`/api/address/${address.id}`, {
            method: "DELETE",
        });
        const data = await response.json();

        if (!data.status) {
            alert(data.message);
            addresses = previous; // rollback
        }
    };

    // Set default address
    const setDefault = async (address) => {
        const response = await fetch(`/api/address/${address.id}/default`, {
            method: "POST",
        });
        const data = await response.json();

        if (data.status) {
            fetchAddresses();
        } else {
            alert(data.message);
        }
    };
</script>

<div class="space-y-4 sm:space-y-6 p-4 sm:p-6">
    <!-- Header -->
    <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
    >
        <div>
            <h1 class="text-xl sm:text-2xl font-light text-gray-900">
                Addresses
            </h1>
            <p class="text-xs sm:text-sm text-gray-500 mt-1">
                {addresses?.length || 0}
                {addresses?.length === 1 ? "address" : "addresses"} saved
            </p>
        </div>
        <button
            onclick={() => (showNewAddressModal = true)}
            class="px-4 py-2 text-sm font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
        >
            Add New Address
        </button>
    </div>

    {#if showNewAddressModal}
        <AddAddressCard
            onClose={() => (showNewAddressModal = false)}
            onAddressAdded={handleAddressAdded}
        />
    {/if}

    <!-- Addresses List -->
    <div class="space-y-3 sm:space-y-4">
        {#each addresses as address}
            <div
                class="border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors"
            >
                <div
                    class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                    <div class="flex-1 space-y-2 min-w-0">
                        <!-- Address Type & Default Badge -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <h3
                                class="text-sm sm:text-base font-medium text-gray-900"
                            >
                                {address?.name || "Home"}
                            </h3>
                            {#if address.is_default}
                                <span
                                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-900 text-white whitespace-nowrap"
                                >
                                    Default
                                </span>
                            {/if}
                        </div>

                        <!-- Receiver Info -->
                        {#if address?.name || address?.phone}
                            <div
                                class="flex flex-col sm:flex-row sm:items-center gap-1"
                            >
                                {#if address?.name}
                                    <p class="text-sm text-gray-900">
                                        {address.name}
                                    </p>
                                {/if}

                                {#if address?.name && address?.phone}
                                    <span class="hidden sm:inline text-gray-400"
                                        >-</span
                                    >
                                {/if}

                                {#if address?.phone}
                                    <p class="text-sm text-gray-600">
                                        {address.phone}
                                    </p>
                                {/if}
                            </div>
                        {/if}

                        <!-- Address -->
                        {#if address?.line1 || address?.line2 || address?.city || address?.state || address?.postal_code}
                            <div class="pt-1 space-y-1">
                                {#if address?.line1}
                                    <p
                                        class="text-sm text-gray-600 leading-relaxed break-words"
                                    >
                                        {address.line1}
                                    </p>
                                {/if}

                                {#if address?.line2}
                                    <p
                                        class="text-sm text-gray-600 leading-relaxed break-words"
                                    >
                                        {address.line2}
                                    </p>
                                {/if}

                                {#if address?.city || address?.state || address?.postal_code}
                                    <p class="text-sm text-gray-600">
                                        {address.city}
                                        {#if address?.state},{/if}
                                        {address.state}
                                        {#if address?.postal_code}
                                            {address.postal_code}
                                        {/if}
                                    </p>
                                {/if}

                                {#if address?.country}
                                    <p class="text-sm text-gray-600">
                                        {address.country}
                                    </p>
                                {/if}
                            </div>
                        {/if}
                    </div>

                    <!-- Actions -->
                    <div
                        class="flex flex-row sm:flex-col sm:items-end gap-2 sm:gap-2 flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-200 sm:border-0"
                    >
                        {#if !address.is_default}
                            <button
                                onclick={() => setDefault(address)}
                                class="px-3 py-1.5 sm:px-0 sm:py-0 text-xs text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
                            >
                                Set Default
                            </button>
                        {/if}

                        <button
                            class="px-3 py-1.5 sm:px-0 sm:py-0 text-xs text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
                        >
                            Edit
                        </button>

                        <button
                            onclick={() => {
                                const confirmed = confirm(
                                    "Are you sure you want to delete this address?",
                                );
                                if (confirmed) {
                                    handleDelete(address);
                                }
                            }}
                            class="px-3 py-1.5 sm:px-0 sm:py-0 text-xs text-red-600 hover:text-red-700 transition-colors whitespace-nowrap"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        {/each}
    </div>

    <!-- Empty State -->
    {#if !addresses || addresses.length === 0}
        <div
            class="text-center py-8 sm:py-12 border border-gray-200 rounded-lg"
        >
            <p class="text-sm sm:text-base text-gray-500 mb-4">
                No addresses saved
            </p>
        </div>
    {/if}
</div>
