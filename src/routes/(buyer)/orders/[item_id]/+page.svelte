<script>
  import { onMount } from "svelte";
  import RatingAndReviewModal from "$lib/components/rating_reviews/RatingAndReviewModal.svelte";
  import moment from "moment";
  import { Package } from "@lucide/svelte";
  let { data } = $props();

  const order = data?.order;
  let cancelling = false;

  let openRatingModal = $state(false);
  const status_class = {
    READY: "bg-blue-50 text-blue-700 border-blue-200",
    SHIPPED: "bg-green-50 text-green-700 border-green-200",
    OUT_FOR_DELIVERY: "bg-yellow-50 text-yellow-700 border-yellow-200",
    DELIVERED: "bg-green-50 text-green-700 border-green-200",
  };
  const timeline = [
    {
      key: "CONFIRMED",
      label: "Order Confirmed",
      sublabel: moment().format("DD MMM YYYY"),
    },
    {
      key: "SHIPPED",
      label: "Shipped",
      sublabel: `Expected ${moment().format("DD MMM YYYY")}`,
    },
    { key: "OUT_FOR_DELIVERY", label: "Out for Delivery" },
    {
      key: "DELIVERED",
      label: "Delivered",
      sublabel: `Expected ${moment().add(3, "days").format("DD MMM YYYY")}`,
    },
  ];

  const statusOrder = ["CONFIRMED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentIdx = statusOrder.indexOf(order?.status);

  let mounted = $state(false);

  function openInvoice() {
    if (order.invoiceUrl) window.open(order.invoiceUrl, "_blank");
  }

  function trackPackage() {
    // TODO: route to your tracking page
    alert("Tracking coming soon");
  }

  function viewMap() {
    const q = encodeURIComponent(
      order.customer.address + " " + (order.customer.pincode ?? ""),
    );
    window.open(`https://maps.google.com/?q=${q}`, "_blank");
  }

  function formatDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  const getPaymentMethodColor = (payment_type) => {
    switch (payment_type) {
      case "COD":
        return "bg-blue-50 text-blue-700";
      case "PREPAID":
        return "bg-green-50 text-green-700";
    }
  };
  onMount(() => {
    mounted = true;
  });

  async function cancleOrder() {

    if (!order?.order_id || cancelling) return;

    const ok = confirm("Are you sure you want to cancel this order?");
    if (!ok) return;

    cancelling = true;

    try {
      const res = await fetch("/api/cancle-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: order.order_id,
          order_item_id: order.order_item_id,
        }),
      });

      const data = await res.json();

      if (!data.status) {
        alert(data.message || "Unable to cancel order");
        return;
      }

      // ✅ update UI instantly
      order.canCancel = false;
      order.item_status = "CANCELLED";

      alert("Order cancelled successfully");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      cancelling = false;
    }
  }
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
    <!-- Header -->
    <header class="mb-4 sm:mb-6 animate-fade-in">
      <div class="flex flex-col gap-3">
        <div class="space-y-1">
          <h1
            class="text-lg sm:text-xl font-medium text-gray-900 tracking-tight"
          >
            Order #{order?.order_item_id}
          </h1>
          <div class="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <span>Placed {formatDate(order?.created_at)}</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row sm:items-center gap-2">
          <span
            class="inline-flex border items-center justify-center gap-2 px-3 py-1.5 text-xs font-medium
                    {status_class[order?.item_status]} 
                    w-full sm:w-auto"
          >
            {order?.item_status}
          </span>
          <!-- <div class="flex gap-2 w-full sm:w-auto">
                        <button
                            onclick={trackPackage}
                            class="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-gray-900 border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Track Package
                        </button>
                        <button
                            onclick={openInvoice}
                            class="flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 transition-colors duration-200"
                        >
                            Download Invoice
                        </button>
                    </div> -->
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <!-- Left Column -->
      <section class="lg:col-span-2 space-y-3 sm:space-y-4">
        <!-- Product Card -->
        <div
          class="bg-white border border-gray-200 p-3 sm:p-4 animate-fade-in-up"
          style="animation-delay: 0.1s;"
        >
          <div class="flex gap-3 sm:gap-4">
            <div
              class="flex-shrink-0 flex items-center justify-center sm:justify-start"
            >
              <img
                src={order?.product?.image_url}
                alt={order?.product?.title}
                class="w-16 h-16 sm:w-20 sm:h-20 object-cover bg-gray-50"
              />
            </div>
            <div class="flex-1 min-w-0">
              <a href="/items/{order?.product?.slug}">
                <p
                  class="text-sm font-normal hover:underline text-blue-600 mb-1.5"
                >
                  {order?.product?.title}
                </p>
              </a>

              <!-- {#if order?.tagname}
                                <div class="flex flex-wrap gap-1.5 mb-1.5">
                                    {#each JSON.parse(order.tagname) as option, index}
                                        <span class="px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100">
                                            {option}: {JSON.parse(order.tagvalue)[index]}
                                        </span>
                                    {/each}
                                </div>
                            {/if} -->
              <div
                class="flex flex-wrap items-center gap-4 text-xs text-gray-600"
              >
                <div class="text-base sm:text-lg font-normal text-gray-900">
                  ₹{order?.variation?.selling_price || 0}
                </div>
                <span class="border border-gray-200 rounded-md px-2 py-1"
                  >Qty: {order?.quantity}</span
                >

                <span class="border border-gray-200 rounded-md px-2 py-1"
                  >Sold by: <span class="text-gray-900 text-sm font-medium"
                    >{order?.vendor?.display_name}</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline -->
        <div
          class="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 animate-fade-in-up backdrop-blur-sm"
          style="animation-delay: 0.2s;"
        >
          <!-- Header -->
          <div class="flex items-center gap-3 mb-8">
            <div class="p-2 bg-indigo-50 rounded-lg">
              <Package size={18} />
            </div>
            <div>
              <h3
                class="text-sm font-bold text-gray-900 uppercase tracking-wider"
              >
                Delivery Timeline
              </h3>
              <p class="text-xs text-gray-500 mt-0.5">
                Real-time tracking updates
              </p>
            </div>
          </div>

          <!-- Timeline -->
          <div class="relative">
            <div
              class="absolute left-[19px] sm:left-[23px] top-[16px] bottom-2 w-0.5 bg-gray-100 rounded-full"
            ></div>

            <div
              class="absolute left-[19px] sm:left-[23px] top-[16px] w-0.5 bg-[#4dc952] rounded-full transition-all duration-700 ease-out"
              style="height: {currentIdx >= 0
                ? (currentIdx / (timeline.length - 1)) * 100
                : 50}%"
            ></div>

            <div class="space-y-0">
              {#each timeline as step, i}
                <div class="relative pl-12 sm:pl-14 py-4 group">
                  <div
                    class="absolute left-0 top-4 flex items-center justify-center"
                  >
                    {#if i < currentIdx}
                      <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-200 flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110"
                      >
                        <svg
                          class="w-5 h-5 sm:w-6 sm:h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2.5"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                    {:else if i === currentIdx}
                      <div class="relative">
                        <div
                          class="absolute inset-0 bg-indigo-400 rounded-full animate-ping opacity-20"
                        ></div>
                        <div
                          class="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white border-4 border-indigo-500 shadow-lg shadow-indigo-200 flex items-center justify-center"
                        >
                          <div
                            class="w-3 h-3 sm:w-4 sm:h-4 bg-indigo-500 rounded-full"
                          ></div>
                        </div>
                      </div>
                    {:else}
                      <div
                        class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-50 border-2 border-gray-200 flex items-center justify-center text-gray-400 font-semibold text-sm sm:text-base transition-colors duration-300 group-hover:border-gray-300 group-hover:bg-gray-100"
                      >
                        {i + 1}
                      </div>
                    {/if}
                  </div>

                  <!-- Content -->
                  <div class="pt-1 sm:pt-2">
                    <div
                      class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4"
                    >
                      <div>
                        <h4
                          class="text-sm sm:text-base font-semibold text-gray-900 flex items-center gap-2"
                        >
                          {step.label}
                          {#if i === currentIdx}
                            <span
                              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 animate-pulse"
                            >
                              Current
                            </span>
                          {/if}
                        </h4>
                        {#if step.sublabel}
                          <p
                            class="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed"
                          >
                            {step.sublabel}
                          </p>
                        {/if}
                      </div>

                      {#if step.timestamp}
                        <span
                          class="text-xs text-gray-400 font-medium whitespace-nowrap"
                        >
                          {step.timestamp}
                        </span>
                      {/if}
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-100">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500">Last updated</span>
              <span class="font-medium text-gray-900 flex items-center gap-1">
                <span
                  class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"
                ></span>
                Just now
              </span>
            </div>
          </div>
        </div>

        <!-- Timeline -->
      </section>

      <!-- Right Column -->
      <aside class="space-y-3 sm:space-y-4">
        <!-- Delivery Details -->
        <div
          class="bg-white border border-gray-200 p-3 sm:p-4 animate-fade-in-up"
          style="animation-delay: 0.3s;"
        >
          <div class="flex items-center justify-between mb-2.5">
            <h3
              class="text-xs font-medium text-gray-900 uppercase tracking-wide"
            >
              Delivery Details
            </h3>
          </div>
          <div class="space-y-2 text-xs">
            <div class="font-medium text-gray-900 flex items-center gap-2">
              <svg
                class="w-4 h-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 12C10.9 12 9.95833 11.6083 9.175 10.825C8.39167 10.0417 8 9.1 8 8C8 6.9 8.39167 5.95833 9.175 5.175C9.95833 4.39167 10.9 4 12 4C13.1 4 14.0417 4.39167 14.825 5.175C15.6083 5.95833 16 6.9 16 8C16 9.1 15.6083 10.0417 14.825 10.825C14.0417 11.6083 13.1 12 12 12ZM4 18V17.2C4 16.6333 4.146 16.1127 4.438 15.638C4.73 15.1633 5.11733 14.8007 5.6 14.55C6.63333 14.0333 7.68333 13.646 8.75 13.388C9.81667 13.13 10.9 13.0007 12 13C13.1 12.9993 14.1833 13.1287 15.25 13.388C16.3167 13.6473 17.3667 14.0347 18.4 14.55C18.8833 14.8 19.271 15.1627 19.563 15.638C19.855 16.1133 20.0007 16.634 20 17.2V18C20 18.55 19.8043 19.021 19.413 19.413C19.0217 19.805 18.5507 20.0007 18 20H6C5.45 20 4.97933 19.8043 4.588 19.413C4.19667 19.0217 4.00067 18.5507 4 18Z"
                  fill="currentColor"
                />
              </svg>
              <span class="break-words"
                >{order?.shipping_address?.receiver_name}</span
              >
            </div>
            <div class="text-gray-500 pt-0.5 flex items-center gap-2">
              <svg
                class="w-4 h-4 flex-shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19.23 15.26L16.69 14.97C16.3914 14.9349 16.0886 14.968 15.8046 15.0667C15.5206 15.1654 15.2626 15.3273 15.05 15.54L13.21 17.38C10.3714 15.9359 8.0641 13.6286 6.62004 10.79L8.47004 8.94001C8.90004 8.51001 9.11004 7.91001 9.04004 7.30001L8.75004 4.78001C8.69356 4.2921 8.45951 3.84204 8.0925 3.51561C7.7255 3.18918 7.25121 3.00921 6.76004 3.01001H5.03004C3.90004 3.01001 2.96004 3.95001 3.03004 5.08001C3.56004 13.62 10.39 20.44 18.92 20.97C20.05 21.04 20.99 20.1 20.99 18.97V17.24C21 16.23 20.24 15.38 19.23 15.26Z"
                  fill="currentColor"
                />
              </svg>
              <span class="break-all"
                >{order?.shipping_address?.receiver_phone}</span
              >
            </div>
            <div class="text-gray-600 leading-relaxed flex items-start gap-2">
              <svg
                class="w-4 h-4 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M11.262 22.134C11.262 22.134 4 16.018 4 10C4 7.87827 4.84285 5.84344 6.34315 4.34315C7.84344 2.84285 9.87827 2 12 2C14.1217 2 16.1566 2.84285 17.6569 4.34315C19.1571 5.84344 20 7.87827 20 10C20 16.018 12.738 22.134 12.738 22.134C12.334 22.506 11.669 22.502 11.262 22.134ZM12 13.5C12.4596 13.5 12.9148 13.4095 13.3394 13.2336C13.764 13.0577 14.1499 12.7999 14.4749 12.4749C14.7999 12.1499 15.0577 11.764 15.2336 11.3394C15.4095 10.9148 15.5 10.4596 15.5 10C15.5 9.54037 15.4095 9.08525 15.2336 8.66061C15.0577 8.23597 14.7999 7.85013 14.4749 7.52513C14.1499 7.20012 13.764 6.94231 13.3394 6.76642C12.9148 6.59053 12.4596 6.5 12 6.5C11.0717 6.5 10.1815 6.86875 9.52513 7.52513C8.86875 8.1815 8.5 9.07174 8.5 10C8.5 10.9283 8.86875 11.8185 9.52513 12.4749C10.1815 13.1313 11.0717 13.5 12 13.5Z"
                  fill="currentColor"
                />
              </svg>
              <span class="break-words"
                >{order?.shipping_address?.shipping_address}, {order
                  ?.shipping_address?.shipping_city}, {order?.shipping_address
                  ?.shipping_state}, {order?.shipping_address
                  ?.shipping_pincode}</span
              >
            </div>
          </div>
        </div>

        <!-- Price Details -->
        <div
          class="bg-white border border-gray-200 p-3 sm:p-4 animate-fade-in-up"
          style="animation-delay: 0.4s;"
        >
          <h3
            class="text-xs font-medium text-gray-900 mb-2.5 uppercase tracking-wide"
          >
            Price Details
          </h3>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-gray-600">
              <span>Items Total</span>
              <span
                >₹{order?.variation?.selling_price * order?.quantity || 0}</span
              >
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Discount</span>
              <span class="text-gray-900">-₹{order?.discount}</span>
            </div>
            <div class="border-t border-gray-200 pt-2 mt-2">
              <div
                class="flex justify-between text-sm font-medium text-gray-900"
              >
                <span>Total</span>
                <span
                  >₹{order?.variation?.selling_price * order?.quantity ||
                    0}</span
                >
              </div>
            </div>
            <div class="pt-1.5 text-xs text-gray-500">
              Payment method: <span
                class="inline-flex items-center px-2.5 py-0.5 text-xs font-medium {getPaymentMethodColor(
                  order?.payment_type,
                )} whitespace-nowrap"
              >
                {order?.payment_type}
                {order?.payment_method ? ` - ${order?.payment_method}` : ""}
              </span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div
          class="bg-white border border-gray-200 p-3 sm:p-4 animate-fade-in-up"
          style="animation-delay: 0.5s;"
        >
          <h3
            class="text-xs font-medium text-gray-900 mb-2.5 uppercase tracking-wide"
          >
            Actions
          </h3>

          <div class="grid grid-cols-2 gap-3 p-1">
            {#if order?.canCancel}
              <button
                onclick={cancleOrder}
                class="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 hover:border-rose-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg
                  class="w-4 h-4 transition-transform group-hover:scale-110"
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
                Cancel Order
              </button>
            {/if}

            <button
              class="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                class="w-4 h-4 transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
                />
              </svg>
              Chat Support
            </button>

            <button
              class="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              <svg
                class="w-4 h-4 transition-transform group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Return
            </button>

            {#if order?.item_status !== "DELIVERED"}
              <button
                onclick={() => (openRatingModal = true)}
                class="group relative flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-xl hover:bg-amber-100 hover:border-amber-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg
                  class="w-4 h-4 transition-transform group-hover:scale-110"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                Rate Product
              </button>
            {/if}
          </div>
        </div>
      </aside>
    </div>
  </div>
</div>

<RatingAndReviewModal
  open={openRatingModal}
  onClose={() => (openRatingModal = false)}
  onRatingAdded={() => {}}
  product={order?.product}
/>

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
