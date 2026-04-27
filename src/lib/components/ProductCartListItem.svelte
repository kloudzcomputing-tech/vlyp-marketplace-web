<script>
    let {item, onRemove, onDec, onInc} = $props()
     const rupee = (n) => `₹${(Number(n) || 0).toLocaleString('en-IN')}`;
     let quantity = $state(item.quantity);
    
     function inc() {
         onInc(item.product_id)
     }
 
     function dec() {
         onDec(item.product_id)
     }
 
     function remove() {
         onRemove(item.product_id)
     }
 
     
 </script>
 <div class="p-6 flex gap-6 border-b border-gray-100 last:border-b-0">
     <!-- Product Image -->
     <div class="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden shrink-0">
         {#if item.image_url}
             <img src={item.image_url} alt={item.product_title} class="w-full h-full object-cover" />
         {:else}
             <div
                 class="w-full h-full flex items-center justify-center text-gray-400 text-xs font-medium"
             >
                 No Image
             </div>
         {/if}
     </div>
 
     <!-- Product Details -->
     <div class="flex-1 min-w-0">
         <div class="flex items-start justify-between gap-4">
             <div class="flex-1 min-w-0">
                 <h3 class="text-base font-medium text-gray-900 line-clamp-2 mb-2">
                     {item.product_title}
                 </h3>
 
                 <!-- Price Display -->
                 <div class="flex items-center gap-3 mb-4">
                     <span class="text-lg font-semibold text-gray-900"
                         >{rupee(item.selling_price)}</span
                     >
                     <!-- {#if item.original_price && item.original_price > item.selling_price}
                         <span
                             class="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full"
                         >
                             {Math.round(
                                 ((item.original_price - item.selling_price) / item.original_price) * 100
                             )}% OFF
                         </span>
                     {/if} -->
                 </div>
 
                 <!-- Quantity Controls -->
                 <div class="flex items-center gap-4">
                     <div
                         class="inline-flex items-center border border-gray-200 rounded-lg overflow-hidden"
                     >
                         <button
                             class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                             onclick={() => dec()}
                             aria-label="Decrease quantity"
                         >
                             <svg
                                 class="w-4 h-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                             >
                                 <path
                                     stroke-linecap="round"
                                     stroke-linejoin="round"
                                     stroke-width="2"
                                     d="M20 12H4"
                                 />
                             </svg>
                         </button>
                         <input
                             class="w-14 text-center text-sm font-medium outline-none py-2"
                             value={item.quantity}
                             inputmode="numeric"
                             disabled
                         />
                         <button
                             class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
                             onclick={() => inc()}
                             aria-label="Increase quantity"
                         >
                             <svg
                                 class="w-4 h-4"
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                             >
                                 <path
                                     stroke-linecap="round"
                                     stroke-linejoin="round"
                                     stroke-width="2"
                                     d="M12 4v16m8-8H4"
                                 />
                             </svg>
                         </button>
                     </div>
 
                     <div class="text-sm text-gray-600">
                         Total: <span class="font-semibold text-gray-900"
                             >{rupee(Number(item.selling_price || 0) * Number(item.qty || 1))}</span
                         >
                     </div>
                 </div>
             </div>
 
             <!-- Remove Button -->
             <button
                 class="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                 onclick={() => remove()}
                 aria-label="Remove item"
                 title="Remove from cart"
             >
                 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                     <path
                         stroke-linecap="round"
                         stroke-linejoin="round"
                         stroke-width="2"
                         d="M6 18L18 6M6 6l12 12"
                     />
                 </svg>
             </button>
         </div>
     </div>
 </div>