<script>
    import { BadgePercentIcon, CheckIcon } from "@lucide/svelte";
    let { coupon,isSelected,removeCoupon,applyCoupon } = $props();
</script>

<div
    class="flex items-center space-x-2 border border-gray-200 px-2 py-2 rounded-md"
>
    <div>
        {#if isSelected}
            <span
                class="bg-green-500 rounded-full w-5 h-5 flex items-center justify-center"
            >
                <CheckIcon color="white" size={14} />
            </span>
        {:else}
            <BadgePercentIcon color="gray" size={26} />
        {/if}
    </div>

    <div class=" flex-1">
        {#if isSelected}
            <p class="text-sm font-medium text-green-600">
                You saved {coupon.discount_type === 'percentage' ? coupon.discount_value + '%' : '₹' + coupon.discount_value} on this product
            </p>
        {:else}
            <p class="text-sm font-semibold text-gray-800">
                {coupon.title}
            </p>
        {/if}
        <p class="text-gray-500 text-xs">
            Code : {coupon.code}
        </p>
    </div>
    <div>
        {#if isSelected}
            <button
                onclick={() => removeCoupon(coupon)}
                class="px-2 py-1 border border-red-200 bg-red-50 hover:bg-gray-100 transition-all duration-200 rounded-md text-xs font-medium text-red-400"
                >Remove</button
            >
        {:else}
            <button
                onclick={() => applyCoupon(coupon)}
                class="px-2 py-1 border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-all duration-200 rounded-md text-xs font-medium text-gray-900"
                >Apply</button
            >
        {/if}
    </div>
</div>
