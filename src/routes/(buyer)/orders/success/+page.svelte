<script>
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { clearCart } from "$lib/stores/cart";
    
    let orderId = $state(null);
    let paymentMethod = $state(null);
    
    $effect(() => {
        // Get order ID from URL params if available
        orderId = $page.url.searchParams.get('oid');
        paymentMethod = $page.url.searchParams.get('mode');

        clearCart();
    });
    
    function viewOrders() {
        goto('/account/orders');
    }
    
    function continueShopping() {
        goto('/');
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <!-- Success Icon and Message -->
        <div class="text-center mb-4 sm:mb-6 animate-fade-in">
            <div class="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-green-100 mb-4">
                <svg 
                    class="w-8 h-8 sm:w-10 sm:h-10 text-green-600" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        stroke-linecap="round" 
                        stroke-linejoin="round" 
                        stroke-width="2" 
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </div>
            <h1 class="text-xl sm:text-2xl font-light text-gray-900 mb-2">
                Order Placed Successfully!
            </h1>
            <p class="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
                Thank you for your order. We've received your order and will begin processing it right away.
            </p>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white border border-gray-200 p-4 sm:p-5 mb-4 animate-fade-in-up" style="animation-delay: 0.1s;">
            <h2 class="text-xs sm:text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                Order Details
            </h2>
            <div class="space-y-2">
                {#if orderId}
                    <div class="flex items-center justify-between py-2 border-b border-gray-100">
                        <span class="text-xs sm:text-sm text-gray-600">Order ID</span>
                        <span class="text-xs sm:text-sm font-medium text-gray-900">#{orderId}</span>
                    </div>
                {/if}
                <div class="flex items-center justify-between py-2 border-b border-gray-100">
                    <span class="text-xs sm:text-sm text-gray-600">Payment Method</span>
                    <span class="text-xs sm:text-sm font-medium text-gray-900">
                        {paymentMethod === 'cod' ? 'Cash on Delivery' : paymentMethod}
                    </span>
                </div>
                <div class="flex items-center justify-between py-2">
                    <!-- <span class="text-xs sm:text-sm text-gray-600">Status</span> -->
                    <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium text-gray-900 bg-gray-100">
                        {paymentMethod === 'cod' ? 'Your order will be confirmed once its approved by seller' : 'Your order is confirmed'}
                    </span>
                </div>
            </div>
        </div>

        <!-- What's Next Card -->
        <div class="bg-white border border-gray-200 p-4 sm:p-5 mb-4 animate-fade-in-up" style="animation-delay: 0.2s;">
            <h2 class="text-xs sm:text-sm font-medium text-gray-900 mb-3 uppercase tracking-wide">
                What's Next?
            </h2>
            <div class="space-y-3">
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-6 h-6 bg-gray-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-900">1</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xs sm:text-sm font-medium text-gray-900 mb-0.5">Order Confirmation</h3>
                        <p class="text-xs text-gray-600">
                            You'll receive an email confirmation with your order details shortly.
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-6 h-6 bg-gray-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-900">2</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xs sm:text-sm font-medium text-gray-900 mb-0.5">Processing</h3>
                        <p class="text-xs text-gray-600">
                            We'll start processing your order within 1-2 business days.
                        </p>
                    </div>
                </div>
                <div class="flex items-start gap-3">
                    <div class="flex-shrink-0 w-6 h-6 bg-gray-100 flex items-center justify-center">
                        <span class="text-xs font-medium text-gray-900">3</span>
                    </div>
                    <div class="flex-1">
                        <h3 class="text-xs sm:text-sm font-medium text-gray-900 mb-0.5">Shipping</h3>
                        <p class="text-xs text-gray-600">
                            You'll receive tracking information once your order ships.
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 animate-fade-in-up" style="animation-delay: 0.3s;">
            <button 
                onclick={viewOrders}
                class="flex-1 px-4 py-2 text-xs sm:text-sm font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
            >
                View My Orders
            </button>
            <button 
                onclick={continueShopping}
                class="flex-1 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
            >
                Continue Shopping
            </button>
        </div>

        <!-- Help Section -->
        <div class="text-center animate-fade-in-up" style="animation-delay: 0.4s;">
            <p class="text-xs text-gray-600 mb-1">
                Need help with your order?
            </p>
            <button 
                class="text-xs text-gray-900 font-medium hover:text-gray-700 underline transition-colors duration-200"
            >
                Contact Support
            </button>
        </div>
    </div>
</div>

<style>
    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

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

    .animate-fade-in {
        animation: fade-in 0.6s ease-out forwards;
        opacity: 0;
    }

    .animate-fade-in-up {
        animation: fade-in-up 0.6s ease-out forwards;
        opacity: 0;
    }
</style>