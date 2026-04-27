<script>
    import { goto } from "$app/navigation";

    let { item, from } = $props();
    let product_media = JSON.parse(item.product_media)
    
    let product_media_index = $state(0);
    function handleHover() {
        if(product_media?.length > 0){
            let index = product_media_index + 1;
            if (index >= product_media.length) {
                index = 0;
            }
            product_media_index = index;
        }
    }
    function handleLeave() {
        product_media_index = 0;
    }
</script>

<a href={`/items/${item.slug}`} data-sveltekit-reload  class=" block">
    <div class="space-y-3 border border-gray-200 p-4">
        <!-- Image -->
        <div class="aspect-square overflow-hidden rounded-lg bg-white">
            {#if product_media.length > 0}
                <img
                    src={product_media[product_media_index]?.original_url}
                    alt={item.title}
                    onmouseenter={() => handleHover()}
                    onmouseleave={() => handleLeave()}
                    class="w-[90%] h-[90%]  object-contain  transition-transform duration-300"
                    loading="lazy"
                />
            {/if}
        </div>

        <!-- Product Info -->
        <div class="space-y-1">
            <p
                class="text-sm height-[50px] text-gray-900 font-normal line-clamp-2 group-hover:text-gray-700 transition-colors"
            >
                {item.title.length > 20
                    ? item.title.slice(0, 20) + "..."
                    : item.title}
            </p>

            <div class="flex items-baseline gap-2">
                {#if item.compare_at_price && item.compare_at_price > item.selling_price}
                    <span class="text-xs text-gray-400 line-through">
                        ₹{item.compare_at_price}
                    </span>
                {/if}
                <span class="text-sm font-medium text-gray-900">
                    ₹{item.selling_price}
                </span>
                <span class="text-xs font-bold text-green-600">
                    {Math.ceil(
                        ((item.compare_at_price - item.selling_price) /
                            item.compare_at_price) *
                            100,
                    )}% off
                </span>
            </div>
            {#if item.rating}
                <div class="flex items-center gap-1.5 pt-1">
                    <div
                        class="flex items-center gap-1 bg-green-800 text-white rounded-md px-2 py-0.5"
                    >
                        <span class="text-xs">{item.rating}</span>
                    </div>

                    <span class="text-xs text-gray-400"
                        >({item.review_count})</span
                    >
                </div>
            {/if}
        </div>
    </div>
</a>
