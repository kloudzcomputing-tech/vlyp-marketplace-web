<script>
    import dayjs from "dayjs";

    let {matrix=$bindable()} = $props();
    console.log(matrix, "MATRIX");
</script>

<div class="fixed top-6 right-6 z-50 p-4 rounded-md bg-white/50 backdrop-blur-sm shadow-md hidden">
    <p class="text-sm font-bold  pb-2">User Category Matrix</p>
    <div class="flex flex-col ">
        {#each Object.entries(matrix) as [key,value]}
            <div class="flex items-center gap-2">
                <p class="text-xs w-[100px] text-gray-500">{key}</p>
                <p class="text-xs w-[100px] text-gray-500">{value.score}</p>
                <p class="text-xs w-[100px] text-gray-500">{dayjs(value.lastUpdatedAt).format("hh:mm A")}</p>
            </div>
        {/each}
    </div>
</div>