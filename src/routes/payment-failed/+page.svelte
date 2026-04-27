<script>
    import '../../app.css'
    import { goto } from "$app/navigation";
    import { onMount } from 'svelte';
    let { data } = $props();
    let { txnid, status, error_message } = data
    let mounted = $state(false);

    onMount(() => {
        mounted = true;
    });

    function handleRetry() {
        goto("/checkout");
    }

    function handleGoHome() {
        goto("/");
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4 sm:p-6">
    <div class="max-w-md w-full animate-fade-in-up" style="opacity: {mounted ? 1 : 0};">
        <div class="bg-white border border-gray-200 rounded-lg p-8 sm:p-10 text-center space-y-6 shadow-sm">
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
                    onclick={handleGoHome}
                    class="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                Go to Home
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
</div>

<style>
    @keyframes fade-in-up {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
    }
</style>
