<script>
    import { cart } from "$lib/stores/cart";
    import LiveMarketProductListCard from "./product/LiveMarketProductListCard.svelte";
    import ProductCard from "./ProductCard.svelte";
    let { products } = $props();
    let productIndex = $state(0);
    let showGridView = $state(true);
    const nextProduct = () => {
        if (productIndex < products.length - 1) {
            productIndex++;
        } else {
            productIndex = 0;
        }
    };
    const previousProduct = () => {
        if (productIndex > 0) {
            productIndex--;
        } else {
            productIndex = products.length - 1;
        }
    };
</script>

<div class="bg-white w-[400px] h-full relative overflow-y-auto">
    <div class="p-4 flex items-center justify-between">
        <p>Market Place</p>
        <button onclick={() => (showGridView = !showGridView)}>
            {#if !showGridView}
                <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3 6.75C3 4.982 3 4.098 3.55 3.55C4.097 3 4.981 3 6.75 3C8.519 3 9.402 3 9.95 3.55C10.5 4.098 10.5 4.982 10.5 6.75C10.5 8.518 10.5 9.402 9.95 9.95C9.402 10.5 8.518 10.5 6.75 10.5C4.982 10.5 4.098 10.5 3.55 9.95C3 9.403 3 8.519 3 6.75ZM3 17.257C3 15.489 3 14.605 3.55 14.057C4.098 13.507 4.982 13.507 6.75 13.507C8.518 13.507 9.402 13.507 9.95 14.057C10.5 14.605 10.5 15.489 10.5 17.257C10.5 19.025 10.5 19.909 9.95 20.457C9.402 21.007 8.518 21.007 6.75 21.007C4.982 21.007 4.098 21.007 3.55 20.457C3 19.91 3 19.025 3 17.257ZM13.5 6.75C13.5 4.982 13.5 4.098 14.05 3.55C14.598 3 15.482 3 17.25 3C19.018 3 19.902 3 20.45 3.55C21 4.098 21 4.982 21 6.75C21 8.518 21 9.402 20.45 9.95C19.902 10.5 19.018 10.5 17.25 10.5C15.482 10.5 14.598 10.5 14.05 9.95C13.5 9.402 13.5 8.518 13.5 6.75ZM13.5 17.257C13.5 15.489 13.5 14.605 14.05 14.057C14.598 13.507 15.482 13.507 17.25 13.507C19.018 13.507 19.902 13.507 20.45 14.057C21 14.605 21 15.489 21 17.257C21 19.025 21 19.909 20.45 20.457C19.902 21.007 19.018 21.007 17.25 21.007C15.482 21.007 14.598 21.007 14.05 20.457C13.5 19.909 13.5 19.025 13.5 17.257Z"
                        stroke="black"
                        stroke-width="1"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            {:else}
                <svg
                    width="21"
                    height="21"
                    viewBox="0 0 21 21"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M7.5 3.5H13.5C14.0304 3.5 14.5391 3.71071 14.9142 4.08579C15.2893 4.46086 15.5 4.96957 15.5 5.5V15.5C15.5 16.0304 15.2893 16.5391 14.9142 16.9142C14.5391 17.2893 14.0304 17.5 13.5 17.5H7.5C6.96957 17.5 6.46086 17.2893 6.08579 16.9142C5.71071 16.5391 5.5 16.0304 5.5 15.5V5.5C5.5 4.96957 5.71071 4.46086 6.08579 4.08579C6.46086 3.71071 6.96957 3.5 7.5 3.5ZM15.5 6H16.5C17.0304 6 17.5391 6.21071 17.9142 6.58579C18.2893 6.96086 18.5 7.46957 18.5 8V13C18.5 13.5304 18.2893 14.0391 17.9142 14.4142C17.5391 14.7893 17.0304 15 16.5 15H15.5V6ZM5.5 6H4.5C3.96957 6 3.46086 6.21071 3.08579 6.58579C2.71071 6.96086 2.5 7.46957 2.5 8V13C2.5 13.5304 2.71071 14.0391 3.08579 14.4142C3.46086 14.7893 3.96957 15 4.5 15H5.5V6Z"
                        stroke="black"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    />
                </svg>
            {/if}
        </button>
    </div>
    {#if !showGridView}
        <div class="w-[90%] mx-auto p-2">
            <LiveMarketProductListCard product={products[productIndex]} />
        </div>

        <!-- controls -->
        <div
            class=" sticky bottom-0 flex items-center justify-between left-0 right-0 bg-white p-4"
        >
            <button aria-label="Previous" onclick={previousProduct}>
                <svg
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20.5001 34.4401C12.7921 34.4401 6.56006 28.2081 6.56006 20.5001C6.56006 12.7921 12.7921 6.56006 20.5001 6.56006C28.2081 6.56006 34.4401 12.7921 34.4401 20.5001C34.4401 28.2081 28.2081 34.4401 20.5001 34.4401ZM20.5001 8.20006C13.6941 8.20006 8.20006 13.6941 8.20006 20.5001C8.20006 27.3061 13.6941 32.8001 20.5001 32.8001C27.3061 32.8001 32.8001 27.3061 32.8001 20.5001C32.8001 13.6941 27.3061 8.20006 20.5001 8.20006Z"
                        fill="black"
                    />
                    <path
                        d="M20.746 28.4539L12.792 20.4999L20.746 12.5459L21.894 13.6939L15.088 20.4999L21.894 27.3059L20.746 28.4539Z"
                        fill="black"
                    />
                    <path
                        d="M13.9399 19.6799H27.8799V21.3199H13.9399V19.6799Z"
                        fill="black"
                    />
                </svg>
            </button>
            <button aria-label="Next" onclick={nextProduct}>
                <svg
                    width="41"
                    height="41"
                    viewBox="0 0 41 41"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M20.4999 34.4401C28.2079 34.4401 34.4399 28.2081 34.4399 20.5001C34.4399 12.7921 28.2079 6.56006 20.4999 6.56006C12.7919 6.56006 6.55994 12.7921 6.55994 20.5001C6.55994 28.2081 12.7919 34.4401 20.4999 34.4401ZM20.4999 8.20006C27.3059 8.20006 32.7999 13.6941 32.7999 20.5001C32.7999 27.3061 27.3059 32.8001 20.4999 32.8001C13.6939 32.8001 8.19994 27.3061 8.19994 20.5001C8.19994 13.6941 13.6939 8.20006 20.4999 8.20006Z"
                        fill="black"
                    />
                    <path
                        d="M20.254 28.4539L28.208 20.4999L20.254 12.5459L19.106 13.6939L25.912 20.4999L19.106 27.3059L20.254 28.4539Z"
                        fill="black"
                    />
                    <path
                        d="M27.0601 19.6799H13.1201V21.3199H27.0601V19.6799Z"
                        fill="black"
                    />
                </svg>
            </button>
        </div>
    {:else}
        <div class="grid grid-cols-2 gap-4 px-4">
            {#each products as product}
                <ProductCard from="marketplace" item={product} />
            {/each}
            <div class=" px-4 py-8">
                <p class="text-4xl font-bold text-gray-500 opacity-30">
                    Shopping ke sath <span class="text-gray-900 text-6xl">Living</span>
                </p>
            </div>
        </div>
    {/if}
</div>
