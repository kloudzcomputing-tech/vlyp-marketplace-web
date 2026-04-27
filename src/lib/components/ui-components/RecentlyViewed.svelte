<script>
  import { ChevronsRight } from "@lucide/svelte";
  import productD from "$lib/assets/product-4.png";
  import productA from "$lib/assets/product-1.jpeg";
  import productE from "$lib/assets/banner-2.png";
  import productB from "$lib/assets/product-2.png";
  import productC from "$lib/assets/product-3.png";
  const men_fashions = [
    {
      id: 1,
      title: "Fascista Men's Print...",
      price: 1099,
      image: productA,
    },
    {
      id: 2,
      title: "Stylish Latest Men...",
      price: 1099,
      image: productD,
    },
    {
      id: 3,
      title: "Stylish Men's Casu...",
      price: 1099,
      image: productE,
    },
    {
      id: 4,
      title: "Clothink India Men's...",
      price: 1099,
      image: productB,
    },
    {
      id: 5,
      title: "Stylish Men's Casu...",
      price: 1099,
      image: productC,
    },
  ];
</script>

<section class="py-[40px]">
  <div class="container-fluid">
    <div class="flex items-center justify-between mb-[20px]">
      <h2 class="text-3xl font-bold text-foreground">Recently Viewed</h2>
      <a
        href="#"
        class="text-[#5d3754] font-medium flex items-center gap-[10px]"
        >View All <ChevronsRight /></a
      >
    </div>
    <div
      class="w-full container-fluid grid grid-cols-1 md:grid-cols-7 gap-[10px]"
    >
      {#each men_fashions as fashion}
        <div
          class=" space-y-2 bg-[#ece9d826] shadow-[0px_1px_3px_0px_#1b1f2317,_0px_0px_0px_1px_#1b1f2317] p-2"
        >
          <img src={fashion.image} alt="banner" class="w-full" />
          <div>
            <p
              class="text-[rgb(139,139,163)] not-italic font-medium text-[16px] leading-[20px] mb-[5px]"
            >
              {fashion.title}
            </p>
            <p class="text-grey-600 text-[16px] font-bold">₹{fashion.price}</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
