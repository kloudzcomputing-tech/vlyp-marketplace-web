<script>
    let {title,data} = $props()
</script>

<div class="space-y-3">
    <div class="flex items-center justify-between">
        <h3
            class="text-sm font-medium text-gray-900 uppercase tracking-wide"
        >
            Categories
        </h3>
        <button>
            <ArrowDownIcon size={16} class="text-gray-600" />
        </button>
    </div>

    <div class="space-y-2 {accordianOpen.categories ? 'block' : 'hidden'}">
        {#each categories as category}
            <div class="flex items-center gap-2">
                <input
                    type="checkbox"
                    id={category.id}
                    name="Categories"
                    onchange={(e) => {
                        if (e.target.checked) {
                            selectedFilters["Categories"] = [
                                ...selectedFilters["Categories"],
                                category.id,
                            ];
                        } else {
                            selectedFilters["Categories"] =
                                selectedFilters[
                                    "Categories"
                                ].filter((v) => v !== category.id);
                        }
                        parseUrlParams();
                    }}
                    checked={selectedFilters["Categories"].includes(
                        category.id,
                    )}
                />
                <label
                    for={category.id}
                    class="text-sm text-gray-600"
                    >{category.name}</label
                >
            </div>
        {/each}
    </div>
</div>