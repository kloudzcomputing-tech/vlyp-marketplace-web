<script>
    import dayjs from "dayjs";
    let { data } = $props();
    let orders = $state(data?.orders || []);
    let selectedTabs = $state([]);
    let tabs = ["On the way", "Delivered", "Cancelled", "Returned"];

    const getStatus = (order) => {
        
        switch (order.item_status) {
            case "READY":
                return {
                    label: "Confirmed",
                    subLabel: `Expected delivery on : ${dayjs(
                        order.expected_delivery_date,
                    ).format("DD MMM YYYY")}`,
                    class: "bg-blue-50 text-blue-700",
                };
            case "SHIPPED":
                return {
                    label: "Shipped",
                    subLabel: `Arriving on : ${dayjs(
                        order.expected_delivery_date,
                    ).format("DD MMM YYYY")}`,
                    class: "bg-green-50 text-green-700",
                };
            case "PENDING":
                return {
                    label: "Pending",
                    subLabel: `Expected delivery on : ${dayjs(
                        order.expected_delivery_date,
                    ).format("DD MMM YYYY")}`,
                    class: "bg-yellow-50 text-yellow-700",
                };
        }
    };
    // Filter orders based on selected tabs
    const filteredOrders = $derived(() => {
        if (selectedTabs.length === 0) return orders;
        // This is a simplified filter - you'd need to map order_status to tabs
        return orders;
    });

    const getPaymentMethodColor = (payment_type) => {
        switch (payment_type) {
            case "COD":
                return "bg-blue-50 text-blue-700";
            case "PREPAID":
                return "bg-green-50 text-green-700";
        }
    };
</script>

<div class="space-y-4 sm:space-y-6 p-2 sm:p-6">
    <!-- Header -->
    <div>
        <h1 class="text-xl sm:text-2xl font-light text-gray-900">Orders</h1>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">
            {orders?.length || 0}
            {orders?.length === 1 ? "order" : "orders"}
        </p>
    </div>

    <!-- Filters -->
    <div class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <span class="text-xs sm:text-sm text-gray-600 font-medium">Filter:</span
        >
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
            {#each tabs as tab}
                <button
                    onclick={() => {
                        if (selectedTabs.includes(tab)) {
                            selectedTabs = selectedTabs.filter(
                                (t) => t !== tab,
                            );
                        } else {
                            selectedTabs = [...selectedTabs, tab];
                        }
                    }}
                    class="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm border transition-all {selectedTabs.includes(
                        tab,
                    )
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}"
                >
                    {tab}
                </button>
            {/each}
        </div>
    </div>

    <!-- Orders List -->
    <div class="space-y-2 sm:space-y-4">
        {#each orders as order}
            <a
                href="/orders/{order.order_item_id}"
                class="block border border-gray-200 p-2 sm:p-6 hover:border-gray-300 transition-colors"
            >
                <div
                    class="flex justify-between flex-col sm:flex-row gap-4 sm:gap-6"
                >
                    <div class="flex sm:flex-row gap-4 sm:gap-6">
                        <!-- Product Image -->
                        <div
                            class="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 overflow-hidden bg-gray-50 self-start"
                        >
                            <img
                                src={order.product.image_url}
                                alt={order.product.title}
                                class="w-full h-full object-contain"
                            />
                        </div>

                        <!-- Order Details -->
                        <div class="flex-1 space-y-2 min-w-0">
                            <div>
                                <h3
                                    class="text-xs sm:text-base font-normal text-gray-700 line-clamp-2"
                                >
                                    {order.product.title.length > 50
                                        ? order.product.title.slice(0, 50) +
                                          "..."
                                        : order.product.title}
                                </h3>
                                <span
                                    class="text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1"
                                    >Qty:<span> {order.quantity}</span></span
                                >
                                <!-- {#if order.tagname}
                                    {#each JSON.parse(order.tagname) as tag, index}
                                        <p class="text-xs text-gray-500 mt-0.5">
                                            {tag}:{JSON.parse(order.tagvalue)[
                                                index
                                            ]}
                                        </p>
                                    {/each}
                                {/if} -->
                            </div>
                            <div
                                class="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4"
                            >
                                <span
                                    class="text-sm sm:text-lg font-medium text-gray-900"
                                >
                                    ₹{order.variation.selling_price || 0}
                                </span>
                                <span
                                    class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium {getPaymentMethodColor(
                                        order?.payment_type,
                                    )} whitespace-nowrap"
                                >
                                    {order?.payment_type}
                                    {order?.payment_method
                                        ? ` - ${order?.payment_method}`
                                        : ""}
                                </span>
                                {#if order.order_number}
                                    <span class="text-xs text-gray-500">
                                        Order #{order.order_id}
                                    </span>
                                {/if}
                            </div>
                        </div>
                    </div>
                    <!-- Order Status -->
                    <div
                        class="flex flex-row sm:flex-col sm:items-end gap-3 sm:gap-2"
                    >
                        <span
                            class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium {getStatus(
                                order
                            ).class} whitespace-nowrap"
                        >
                            {getStatus(order).label}
                        </span>
                        <div
                            class="text-left sm:text-right space-y-1 flex-1 sm:flex-none"
                        >
                            <p class="text-xs text-gray-500">
                                {getStatus(order).subLabel}
                            </p>
                        </div>
                    </div>
                </div>
            </a>
        {/each}
    </div>

    <!-- Empty State -->
    {#if !orders || orders.length === 0}
        <div class="text-center py-8 sm:py-12">
            <p class="text-sm sm:text-base text-gray-500">No orders found</p>
        </div>
    {/if}
</div>
