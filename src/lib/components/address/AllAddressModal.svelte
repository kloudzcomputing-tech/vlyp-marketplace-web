<script>
    import {
        Check,
        CheckIcon,
        LocateIcon,
        MailIcon,
        User2Icon,
    } from "@lucide/svelte";
    let { open, onClose, addresses:initialAddresses, onAddressSelected } = $props();
    let addresses = $state(initialAddresses || []);
    let isLoading = $state(false);
 
    let is_default = $state(true);
    const handleSelectAddress = async (e) => {
        e.preventDefault();
    };
    const handleSaveAddress = async (e) => {
        e.preventDefault();
        if (!line1 || !city || !state || !postalcode || !country) {
            alert("Please fill all the fields");
            return;
        }
        isLoading = true;
        const response = await fetch("/api/address", {
            method: "POST",
            body: JSON.stringify({
                label: 'Home',
                name,
                phone,
                line1,
                line2,
                city,
                state,
                postal_code:postalcode.toString(),
                country,
                is_default : is_default ? 1 : 0,
            }),
        });
        const data = await response.json();
       
        if (data.status) {
            getAddresses()
            isLoading = false;
        } else {
            isLoading = false;
            error = data.message;
        }
    };
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

</script>

{#if open}
    <div
        class="fixed inset-0 flex items-center backdrop-blur-sm justify-center z-50"
    >
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="absolute inset-0 bg-black opacity-50 w-full h-full" onclick={onClose}></div>
        <div
            class="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 px-6 w-full h-full md:w-[40%] md:h-[90%] overflow-y-auto"
        >
            <h2 class="text-xl px-4 font-bold mb-4 ">
                Select Delivery Address
            </h2>
          
            <div class="space-y-2">
                {#each addresses as address}
                    <div  class="p-4 bg-gray-50">
                        <p class="text-sm  font-bold text-gray-600">{address.label}</p>
                        <p
                            class="text-sm  font-medium text-gray-500 line-clamp-2"
                        >
                            {address.line1}, {address.line2},
                            {address.city}, {address.state}, {address.postal_code}
                        </p>
                    </div>
                {/each}
            </div>
        </div>
    </div>
{/if}
