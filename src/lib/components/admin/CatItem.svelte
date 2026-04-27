<script>
    import CatItem from "./CatItem.svelte";
    export let item, onSelect, selectedCategory;

    let open = false;
    function onHandleSelect(category) {
        onSelect(category);
        open = false;
    }
</script>

<!-- wrapper that captures enter + leave -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
 <!-- svelte-ignore a11y_click_events_have_key_events -->


<div class=" relative" >
    <!-- parent item -->
    <div  class="flex items-center justify-between">
        
        <div
            onclick={() => {onSelect(item); open = false}}
            class="text-sm cursor-pointer h-8 hover:bg-gray-100 w-full rounded-md px-2 flex items-center"
        >
            {item.name}
            {#if selectedCategory?.id === item.id}
                <span class="text-green-200 px-2 text-xs">✔</span>
            {/if}
        </div>
        {#if item?.children?.length > 0}
            <button class="w-6 h-6 text-gray-500 text-xs rounded-md" onclick={() => open = !open}>
                { open ? "▲" : "▼"}
            </button>
        {/if}
    </div>

    <!-- child dropdown -->
    {#if open && item?.children?.length > 0}
        <div class=" pl-4">
            {#each item.children as child}
                <CatItem item={child} onSelect={onHandleSelect} selectedCategory={selectedCategory} />
            {/each}
        </div>
    {/if}
</div>
