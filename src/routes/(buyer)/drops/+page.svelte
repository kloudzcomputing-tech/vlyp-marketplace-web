<script>
  import DropsCart from "$lib/components/drops/DropsCart.svelte";
  // import "../../app.css"
  let { data } = $props();
  let reels = $derived(data?.reels ?? []);
  let user = $derived(data?.user ?? null);

  let limit = $state(20);
  let offset = $state(0);
  let matrix = $state({});
  function updateMatrix(data) {
    matrix = data;
  }
  async function loadMore() {
    return;
    offset += limit;

    const response = await fetch(`/api/reels/next-feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: limit,
        offset: offset,
      }),
    });
    const data = await response.json();
    reels = [...reels, ...data.data];
  }
</script>

<div
  class=" h-[calc(100dvh-73px)] sm:h-[calc(100dvh-113px)] md:h-[calc(100dvh-72px)]
    overflow-y-scroll
    snap-y
    snap-mandatory
    scroll-smooth
    bg-black
    touch-pan-y
    overscroll-contain relative scrollbar-hide"
>
  {#each reels as reel}
    <DropsCart {reel} {updateMatrix} user />
  {/each}
  <div class="h-[100px] snap-end flex justify-center items-center">
    <button
      onclick={loadMore}
      class="bg-blue-500 text-white px-4 py-2 rounded-md">Load More</button
    >
  </div>
</div>
