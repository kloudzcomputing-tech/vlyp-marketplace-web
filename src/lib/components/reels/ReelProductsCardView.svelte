<script>
    import ReelProductCard from "./ReelProductCard.svelte";
    import { reelShopLockXScroll } from "$lib/stores/reelShop";
    let { products, isLoggedIn, user } = $props();
   
</script>

<div 
style="overflow-x: {$reelShopLockXScroll ? 'hidden' : 'auto'}"

 class="flex-1 flex  snap-x snap-mandatory scroll-smooth hide-scrollbar">
    {#each products as product, index}
        <ReelProductCard product={product} index={index} isLoggedIn={isLoggedIn} user={user}/>
    {/each}
</div>

