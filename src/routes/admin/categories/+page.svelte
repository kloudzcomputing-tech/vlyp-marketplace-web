<script>
   import CatItem from "$lib/components/admin/CatItem.svelte";
   let { data } = $props();
   let categories = data?.categories;
   let selectedCategory = $state(null);
   let name = $state("");
   let slug = $derived(name.toLowerCase().replace(/ /g, "-"));
   function onSelect(category) {
      selectedCategory = category;
   }
   function onCreateCategory() {
   }
   function onCancel() {
      name = "";
      slug = "";
      selectedCategory = null;
   }
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<div class="p-4 flex h-screen" >
   <div class="flex-1 border-r border-gray-200 pr-4">
      <p class="text-lg font-medium">Categories</p>
   </div>
   <div class="space-y-4 w-[400px] max-w-[400px] p-4">
      <p class="text-lg font-medium">Create New Category</p>
      <div class="space-y-6 w-full max-w-sm ">
         <div class="flex flex-col gap-1">
            <label for="name" class="text-xs text-gray-600">Name</label>
            <input 
               class="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black bg-gray-50 text-sm transition" 
               type="text" 
               id="name" 
               name="name" 
               bind:value={name}
               placeholder="Category name"
               autocomplete="off"
            />
         </div>
         <div class="flex flex-col gap-1">
            <label for="slug" class="text-xs text-gray-600">Slug</label>
            <input 
               class="w-full read-only cursor-not-allowed disabled:bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-black bg-gray-50 text-sm transition" 
               type="text" 
               id="slug" 
               name="slug" 
               disabled
               bind:value={slug}
               placeholder=""
               autocomplete="off"
            />
         </div>
         <div class="flex flex-col gap-2">
            <!-- svelte-ignore a11y_label_has_associated_control -->
            <label class="text-xs text-gray-600">Parent Category</label>
            <div class="rounded-lg border border-gray-200 bg-white">
               {#if selectedCategory}
                  <div class="flex items-center gap-2 p-2 px-4 border-b border-gray-100">
                     <span class="text-sm  text-gray-900 font-medium">{selectedCategory?.name}</span>
                     <button
                        class="ml-auto rounded hover:bg-gray-100 text-gray-400 p-1 transition"
                        title="Clear selection"
                        tabindex="0"
                        onclick={() => (selectedCategory = null)}
                        type="button"
                     >
                        <svg
                           xmlns="http://www.w3.org/2000/svg"
                           fill="none"
                           viewBox="0 0 24 24"
                           stroke-width="2"
                           stroke="currentColor"
                           class="w-4 h-4"
                        >
                           <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                           />
                        </svg>
                     </button>
                  </div>
               {/if}
               <div class="max-h-64 overflow-y-auto px-2 py-1">
                  {#each categories as category}
                     <CatItem item={category} {onSelect} {selectedCategory} />
                  {/each}
               </div>
            </div>
         </div>
         <div class="flex justify-end gap-2">
            <button class="bg-gray-700 hover:bg-gray-800 text-white text-xs px-4 py-2 rounded-md" onclick={onCreateCategory}>Create Category</button>
            <button class="hover:bg-gray-100 border border-gray-600 text-gray-600 text-xs px-4 py-2 rounded-md" onclick={onCancel}>Cancel</button>
         </div>
      </div>
   </div>
</div>

