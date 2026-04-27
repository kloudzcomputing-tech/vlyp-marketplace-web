<script>
    import {
        Check,
        CheckIcon,
        LocateIcon,
        MailIcon,
        User2Icon,
        ArrowLeftIcon,
    } from "@lucide/svelte";
    import FormInput from "../shared/FormInput.svelte";
    let { open, onClose, onAddressAdded } = $props();
    let isLoading = $state(false);
    let error = $state("");
    let name = $state("");
    let phone = $state("");
    let line1 = $state("");
    let line2 = $state("");
    let city = $state("");
    let state = $state("");
    let postalcode = $state("");
    let country = $state("India");
    let is_default = $state(true);

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
            onAddressAdded()
            isLoading = false;
        } else {
            isLoading = false;
            error = data.message;
        }
    };
</script>

{#if open}
    <div
        class="fixed inset-0  flex items-center backdrop-blur-sm justify-center z-50"
    >
    <div class="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div class="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-full h-full md:w-[40%] md:h-[90%] overflow-y-auto" >
            <div class="flex p-4 items-center justify-between">

                <button class="w-10 h-10 md:hidden flex items-center justify-center rounded-full bg-gray-100">
                    <ArrowLeftIcon size={18} class="text-gray-600" /> 
                </button>
                <div class="flex-1 flex items-center justify-center">
                    <h2 class="text-xl font-bold  text-center ">
                        Add Delivery Address
                    </h2>
                </div>
                
            </div>
           
            <form onsubmit={handleSaveAddress}>
                <div class="space-y-6 p-6">
                    <FormInput type="text" id="line1"  label="Line 1" bind:value={line1} oninput={(e) => {
                        error = "";
                    }}/>
                    <FormInput  type="text" id="line2" label="Line 2" bind:value={line2} oninput={(e) => {
                        error = "";
                    }}/>
                    <div class="grid grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <FormInput type="text" id="city" label="City" bind:value={city} oninput={(e) => {
                                error = "";
                            }}/>
                        </div>
                        <div>
                            <FormInput type="text" id="state" label="State" bind:value={state} oninput={(e) => {
                                error = "";
                            }}/>
                        </div>
                    </div>
                    <FormInput type="number" id="postalcode" label="Postal Code" bind:value={postalcode} oninput={(e) => {
                        error = "";
                    }}/>
                    <button
                        onclick={(e) => {
                            e.preventDefault();
                            is_default = !is_default;
                        }}
                        class="w-full flex items-center gap-2 p-2"
                    >
                        <span
                            style="background-color: {is_default
                                ? 'var(--primary-color)'
                                : 'transparent'};"
                            class="w-6 h-6 border border-gray-300 gray-200 rounded-md flex items-center justify-center"
                        >
                            {#if is_default}
                                <CheckIcon size={18} class="text-white" />
                            {/if}
                        </span>
                        <span class="block text-sm text-gray-600">
                            Make this my default address
                        </span>
                    </button>
                </div>
                <div class="flex gap-4 items-center  p-6">
                    <button
                        onclick={(e) => {
                            e.preventDefault();
                            onClose();
                        }}
                        class="text-center flex-1 bg-gray-100 text-sm rounded-xl text-[var(--primary-color)] h-12"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isLoading}
                        class="flex-1 border-[var(--primary-color)] border bg-[var(--primary-color)] text-[var(--primary-color-text)] px-4 h-12 rounded-xl hover:bg-[var(--primary-color-hover)]"
                    >
                        {isLoading ? "Saving address..." : "Save Address"}
                    </button>
                    
                </div>
            </form>
            {#if error != ""}
                <div class="text-red-500 text-sm text-center py-6">
                    {error}
                </div>
            {/if}
        </div>
    </div>
{/if}

