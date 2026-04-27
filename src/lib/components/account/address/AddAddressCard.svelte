<script>
    let { onClose, onAddressAdded } = $props();

    let isLoading = $state(false);

    let receiver_name = $state("");
    let receiver_phone = $state("");
    let address = $state("");
    let pincode = $state("");
    let city = $state("");
    let state = $state("");
    let landmark = $state("");
    let alternate_phone = $state("");
    let type = $state("Home");
    let is_default = $state(false);

    const handleSave = async (e) => {
        e.preventDefault();

        if (receiver_name.length < 3) {
            alert("Receiver name must be at least 3 characters long");
            return;
        }
        if (receiver_phone.length !== 10) {
            alert("Receiver phone must be 10 digits long");
            return;
        }
        if (!address || address.length < 3) {
            alert("Address must be at least 3 characters long");
            return;
        }
        if (city.length < 2) {
            alert("City must be at least 2 characters long");
            return;
        }
        if (state.length < 3) {
            alert("State must be at least 3 characters long");
            return;
        }

        const payload = {
            name: receiver_name,
            phone: receiver_phone,
            line1: address,
            line2: '',
            postal_code: pincode,
            city,
            state,
            landmark,
            alternate_phone,
            label: type,
            country: "India",
            is_default: is_default ? 1 : 0,
        };

        try {
            isLoading = true;

            const response = await fetch("/api/address", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (data.status) {
                // 🔁 notify parent to refresh addresses
                onAddressAdded?.();
                onClose();
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert("Something went wrong. Please try again.");
        } finally {
            isLoading = false;
        }
    };
</script>

<div
    class="bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm w-full max-w-xl relative"
>
    <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4 sm:mb-6"
    >
        <h2 class="text-sm sm:text-base font-semibold text-gray-800">
            Add new address
        </h2>
        <!-- <button
            class="flex items-center gap-1 text-gray-500 hover:text-gray-800 text-xs px-2 py-1.5 sm:py-1 rounded transition-colors border border-transparent hover:border-gray-200 focus:outline-none self-start sm:self-auto"
        >
            <svg
                class="w-4 h-4 sm:w-[18px] sm:h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="1.5"
                />
                <path
                    d="M12 8V16"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
                <path
                    d="M8 12H16"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                />
            </svg>
            <span class="hidden sm:inline">Use current location</span>
            <span class="sm:hidden">Location</span>
        </button> -->
    </div>
    <form class="space-y-3 sm:space-y-4" onsubmit={handleSave}>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
                <label for="name" class="block text-xs text-gray-600 mb-1"
                    >Receiver Name</label
                >
                <input
                    type="text"
                    id="name"
                    required
                    bind:value={receiver_name}
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition"
                />
            </div>
            <div>
                <label for="phone" class="block text-xs text-gray-600 mb-1"
                    >Receiver Phone</label
                >
                <input
                    type="text"
                    id="phone"
                    required
                    bind:value={receiver_phone}
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition"
                />
            </div>
        </div>
        <div>
            <label for="address" class="block text-xs text-gray-600 mb-1"
                >Address</label
            >
            <textarea
                id="address"
                placeholder="Address"
                rows="3"
                required
                bind:value={address}
                class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition resize-none"
            ></textarea>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
                <label for="pincode" class="block text-xs text-gray-600 mb-1"
                    >Pincode</label
                >
                <input
                    type="number"
                    id="pincode"
                    required
                    bind:value={pincode}
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition"
                />
            </div>
            <div>
                <label for="city" class="block text-xs text-gray-600 mb-1"
                    >City</label
                >
                <input
                    type="text"
                    id="city"
                    required
                    bind:value={city}
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition"
                />
            </div>
            <div>
                <label for="state" class="block text-xs text-gray-600 mb-1"
                    >State</label
                >
                <input
                    type="text"
                    id="state"
                    required
                    bind:value={state}
                    class="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:border-gray-500 focus:ring-0 transition"
                />
            </div>
        </div>
        <div>
            <span class="block text-xs text-gray-600 mb-2">Address type</span>
            <div class="flex flex-wrap gap-3 sm:gap-4">
                <label
                    class="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="address_type"
                        checked={type === "Home"}
                        onchange={(e) => {
                            if (e.target.checked) {
                                type = "Home";
                            }
                        }}
                        class="accent-gray-800"
                    /> Home
                </label>
                <label
                    class="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="address_type"
                        checked={type === "Office"}
                        onchange={(e) => {
                            if (e.target.checked) {
                                type = "Office";
                            }
                        }}
                        class="accent-gray-800"
                    /> Office
                </label>
                <label
                    class="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer"
                >
                    <input
                        type="radio"
                        name="address_type"
                        checked={type === "Other"}
                        onchange={(e) => {
                            if (e.target.checked) {
                                type = "Other";
                            }
                        }}
                        class="accent-gray-800"
                    /> Other
                </label>
            </div>
        </div>
        <div
            class="pt-2 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4"
        >
            <button
                onclick={(e) => {
                    e.preventDefault();
                    onClose();
                }}
                type="button"
                class="w-full sm:w-auto border border-gray-400 text-gray-900 rounded px-5 py-2.5 sm:py-2 text-sm font-medium hover:bg-gray-100 transition-colors"
            >
                Cancel
            </button>
            <button
                onclick={handleSave}
                type="submit"
                disabled={isLoading}
                class="w-full sm:w-auto bg-gray-800 active:bg-gray-900 text-white rounded px-5 py-2.5 sm:py-2 text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Save
            </button>
        </div>
    </form>
    {#if isLoading}
        <div
            class="absolute flex flex-col gap-2 inset-0 backdrop-blur-sm bg-white/80 rounded-lg flex items-center justify-center z-10"
        >
            <div
                class="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-gray-900"
            ></div>
            <p class="text-sm text-gray-700">Saving address...</p>
        </div>
    {/if}
</div>
