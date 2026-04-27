<script>
    import { goto } from "$app/navigation";
    import CheckBox from "$lib/components/CheckBox.svelte";
    // import { removeFromCart, updateCartItemQuantity } from "$lib/stores/cart";
    let { item, selectedItems = $bindable() } = $props();
    let isLoading = $state(false);
    let quantity = $state(item.quantity);
    function decreaseQuantity() {
        if (quantity == 1) {
            removeFromCart(item);
            fetch(`/api/cart`, {
                method: "DELETE",
                body: JSON.stringify({ id: item.id }),
            })
                .then(() => {
                    location.reload();
                })
                .catch((error) => {
                    quantity = 1;
                    addToCart(item);
                });
        } else {
            quantity--;
            fetch(`/api/cart`, {
                method: "PUT",
                body: JSON.stringify({ id: item.id, quantity: quantity }),
            })
                .then(() => {
                    location.reload();
                })
                .catch((error) => {
                    quantity++;
                });
        }
    }
    function increaseQuantity() {
        const prev = quantity;
        quantity += 1;

        fetch(`/api/cart`, {
            method: "PUT",
            body: JSON.stringify({ id: item.id, quantity }),
        }).catch(() => {
            quantity = prev;
        });
    }
    function removeFromCart(item) {
        isLoading = true;
        fetch(`/api/cart`, {
            method: "DELETE",
            body: JSON.stringify({ id: item.id }),
        })
            .then((response) => {
                response.json().then((data) => {
                    if (data.status) {
                        location.reload();
                    }
                });
            })
            .catch((error) => {
                isLoading = false;
            });
    }
    function addToWishlist(item) {}
</script>

<div
    class="border border-gray-200 w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
>
    <div class="flex gap-3 sm:gap-4 p-3 sm:p-4">
        <span class="pt-1 sm:pt-2 pl-1 sm:pl-0">
            <CheckBox
                checked={true}
                onChange={(check) => {
                    if (check) {
                        selectedItems = [...selectedItems, item];
                    } else {
                        selectedItems = selectedItems.filter(
                            (i) => i.id !== item.id,
                        );
                    }
                }}
            />
        </span>

        <div class="flex-shrink-0">
            <div
                class="md:w-24 md:h-24 w-20 h-20 bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center"
            >
                <img
                    src={item.image_url}
                    alt={item.title}
                    class="w-full h-full object-contain p-2"
                />
            </div>
        </div>

        <div class="flex-1 min-w-0 flex flex-col gap-2">
            <p
                class="text-sm sm:text-base font-medium text-gray-800 leading-snug line-clamp-2"
            >
                {item.title.length > 60
                    ? item.title.slice(0, 60) + "..."
                    : item.title}
            </p>
            <div class="flex items-center gap-2">
                <p class="text-sm sm:text-base font-semibold text-gray-900">
                    ₹{item.selling_price}
                </p>
                <p class="text-xs sm:text-sm text-gray-400 line-through">
                    ₹{item.compare_at_price}
                </p>
                <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full bg-green-50 text-[10px] sm:text-xs font-semibold text-green-600"
                >
                    {Math.round(
                        ((item.compare_at_price - item.selling_price) /
                            item.compare_at_price) *
                            100,
                    )}% off
                </span>
            </div>
        </div>

        <div class="flex items-center gap-3 mt-1">
            <button
                class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-lg
               hover:bg-gray-100 disabled:opacity-40"
                onclick={decreaseQuantity}
                disabled={isLoading}
            >
                −
            </button>

            <span class="min-w-[24px] text-center text-sm font-semibold">
                {quantity}
            </span>

            <button
                class="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-lg
               hover:bg-gray-100 disabled:opacity-40"
                onclick={increaseQuantity}
                disabled={isLoading}
            >
                +
            </button>
        </div>
    </div>
    <div
        class="flex border-t border-gray-100 divide-x divide-gray-100 text-xs sm:text-sm text-gray-600"
    >
        <button
            onclick={() => removeFromCart(item)}
            class="flex-1 py-3 sm:py-3.5 text-center hover:bg-red-50 hover:text-red-600 transition-colors"
        >
            Remove from cart
        </button>
        <button
            onclick={() => addToWishlist(item)}
            class="flex-1 py-3 sm:py-3.5 text-center hover:bg-blue-50 hover:text-blue-600 transition-colors"
        >
            Add to wishlist
        </button>
    </div>
</div>
