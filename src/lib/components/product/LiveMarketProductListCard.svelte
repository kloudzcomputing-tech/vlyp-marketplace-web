<script>
    import { cart } from "$lib/stores/cart";
    let { product } = $props();
    let selectedImageIndex = $state(0);
    let selectedOptionValue = $state(product?.variations[0]?.optionvalues);
    let availableOptions = $derived(getAvailableOptions());
    let selectedVariation = $derived(findVariation());
    let selling_price = $derived(
        product.variations.length > 0
            ? selectedVariation?.selling_price
            : product?.selling_price,
    );

    function getAvailableOptions() {
        let t = [];
        product?.variations.forEach((v) => {
            let on = v.optionname;
            let ov = v.optionvalues;
            ov.forEach((o) => {
                if (!t.includes(o)) {
                    t.push(o);
                }
            });
        });

        return t;
    }

    function toggleSelectedOptionValue(index, optionValue) {
        if (selectedOptionValue[index] === optionValue) {
            selectedOptionValue[index] = null;
        } else {
            selectedOptionValue[index] = optionValue;
        }
    }

    function findVariation() {
        let f = product?.variations.find((v) =>
            v.optionvalues.every((o) => selectedOptionValue.includes(o)),
        );
        return f;
    }
</script>
<div>
    <div class=" h-[300px] overflow-hidden rounded-lg bg-gray-50">
        <img
            src={product?.images?.[selectedImageIndex] ||
                product?.images?.[0]}
            alt={product?.title}
            class="w-full h-full object-cover"
        />
    </div>
    <div class="space-y-1">
        <h1 class="text-lg font-normal py-2 text-gray-900 tracking-tight">
            {product?.title}
        </h1>
        <div class="flex items-center gap-3 text-sm text-gray-500">
            <span class="flex items-center gap-1">
                <span class="text-gray-900 font-medium"
                    >{product?.rating}</span
                >
                <span>⭐</span>
            </span>
            <span>•</span>
            <span>{product?.reviews} reviews</span>
        </div>
        <!-- Price -->
        <div class="space-y-1">
            <div class="flex items-baseline gap-3">
                <span class="text-4xl font-light text-gray-900">
                    ₹{product.variations.length > 0 && selectedVariation
                        ? selectedVariation?.selling_price
                        : product?.selling_price}
                </span>
                {#if (product.variations.length > 0 && selectedVariation?.original_price) || product?.original_price}
                    <span class="text-lg text-gray-400 line-through">
                        ₹{product.variations.length > 0 && selectedVariation
                            ? selectedVariation?.original_price
                            : product?.original_price}
                    </span>
                {/if}
            </div>
            {#if (product.variations.length > 0 && selectedVariation?.discount) || product?.discount}
                <p class="text-sm text-gray-600">
                    {product.variations.length > 0 && selectedVariation
                        ? selectedVariation?.discount
                        : product?.discount}{product?.discount_type ===
                    "percentage"
                        ? "%"
                        : "₹"} off
                </p>
            {/if}
        </div>

        <!-- Options -->
        {#if product?.options && product.options.length > 0}
            <div class="space-y-6 pt-4 border-t border-gray-200">
                {#each product.options as option, index}
                    <div class="space-y-3">
                        <p class="text-sm font-medium text-gray-900">
                            {option?.name}
                        </p>
                        <div class="flex flex-wrap gap-2">
                            {#each option?.options as optionValue}
                                <button
                                    onclick={() =>
                                        toggleSelectedOptionValue(
                                            index,
                                            optionValue,
                                        )}
                                    class="px-4 py-2 text-sm rounded-md border transition-all {availableOptions.includes(
                                        optionValue,
                                    )
                                        ? selectedOptionValue[index] ===
                                          optionValue
                                            ? 'border-gray-900 bg-gray-900 text-white'
                                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                                        : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'}"
                                    disabled={!availableOptions.includes(
                                        optionValue,
                                    )}
                                >
                                    {optionValue}
                                </button>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}

        <!-- Stock & Actions -->
        <div class="space-y-4 pt-4 border-t border-gray-200">
            {#if selectedVariation?.stock !== undefined}
                <p class="text-sm text-gray-600">
                    {selectedVariation?.stock > 0
                        ? `${selectedVariation?.stock} in stock`
                        : "Out of stock"}
                </p>
            {/if}
            <div class="flex gap-3">
                {#if $cart.some((i) => i.id === product?.id)}
                    <button
                        onclick={() => goto("/checkout")}
                        class="flex-1 px-6 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        View Cart
                    </button>
                {:else}
                    <button
                        onclick={() =>
                            addToCart({ ...product, quantity: 1 })}
                        class="flex-1 px-6 py-3 text-sm font-medium text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                        Add to Cart
                    </button>
                {/if}
                <button
                    onclick={() => {}}
                    class="flex-1 px-6 py-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors"
                >
                    Buy Now
                </button>
            </div>
        </div>
    </div>
</div>