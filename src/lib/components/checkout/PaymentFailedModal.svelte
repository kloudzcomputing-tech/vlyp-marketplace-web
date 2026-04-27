<script>
    import {
        Check,
        CheckIcon,
        LocateIcon,
        MailIcon,
        User2Icon,
    } from "@lucide/svelte";
    let { open, onClose, error_message } = $props();
   
</script>

{#if open}
    <div
        class="fixed inset-0  flex items-center backdrop-blur-sm justify-center z-50"
    >
    <div class="absolute inset-0 bg-black opacity-50 w-full h-full"></div>
        <div class="bg-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 px-6 w-full h-full md:w-[40%] md:h-[90%] overflow-y-auto" >
            <!-- Icon -->
            <div class="flex justify-center">
                <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center">
                    <svg
                        class="w-8 h-8 sm:w-10 sm:h-10 text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </div>
            </div>

            <!-- Title -->
            <div class="space-y-2">
                <h1 class="text-2xl sm:text-3xl font-light text-gray-900">
                    Payment Failed
                </h1>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                    We couldn't process your payment. <span><br/>{error_message}</span>
                </p>
            </div>

            <!-- Actions -->
            <div class="flex flex-col sm:flex-row gap-3 pt-4">
                <!-- <button
                    onclick={handleRetry}
                    class="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                    Retry Payment
                </button> -->
               
                <button
                    onclick={onClose}
                    class="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                Close
                </button>
            </div>

            <!-- Help Text -->
            <div class="pt-4 border-t border-gray-200">
                <p class="text-xs text-gray-500">
                    If the problem persists, please contact our support team or try a different payment method.
                </p>
            </div>
        </div>
    </div>
{/if}
