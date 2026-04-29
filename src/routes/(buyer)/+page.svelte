<script>
  import {
    ChevronLast,
    ChevronsRight,
    Component,
    Heart,
    IndianRupeeIcon,
  } from "@lucide/svelte";
  let { data } = $props();
  let masterCat = data?.masterCat;
  import productA from "$lib/assets/product-1.jpeg";
  import productB from "$lib/assets/product-2.png";
  import productC from "$lib/assets/product-3.png";
  import productD from "$lib/assets/product-4.png";
  import bannerA from "$lib/assets/banner-1.jpg";
  import productE from "$lib/assets/banner-2.png";
  import TopPics from "$lib/components/ui-components/CardSectionComp.svelte";
  // ========Book========

  import BookA from "$lib/assets/Product/toys-1.png";
  import BookB from "$lib/assets/Product/toys-3.png";
  import BookC from "$lib/assets/Product/books-2.webp";
  import BookD from "$lib/assets/Product/books-1.webp";

  //====Banner======
  import bannerB from "$lib/assets/banner-3.png";
  import bannerC from "$lib/assets/banner-4.jpeg";
  //====Banner======

  //====Categories======
  import CategoriesA from "$lib/assets/categories/cat-kurti.png";
  import CategoriesB from "$lib/assets/categories/cat-saree.png";
  import CategoriesC from "$lib/assets/categories/cat-jeans.png";
  import CategoriesD from "$lib/assets/categories/cat-tops.png";
  import CategoriesE from "$lib/assets/categories/Categories-5.png";
  import CategoriesF from "$lib/assets/categories/cat-men-shirt.png";
  import CategoriesG from "$lib/assets/categories/cat-man-snek.png";
  import CategoriesH from "$lib/assets/categories/cat-heels.png";
  import CategoriesI from "$lib/assets/categories/cat-bra.png";
  import CategoriesJ from "$lib/assets/categories/cat-lipstic.png";
  import CategoriesK from "$lib/assets/categories/cat-handbug.png";

  import videoA from "$lib/assets/live-video/live-1.mp4";
  import videoB from "$lib/assets/live-video/live-2.mp4";
  import videoC from "$lib/assets/live-video/live-3.mp4";
  import videoD from "$lib/assets/live-video/live-4.mp4";
  import videoE from "$lib/assets/live-video/live-5.mp4";

  import Banner from "$lib/components/Banner.svelte";
  import RecentlyViewed from "$lib/components/ui-components/RecentlyViewed.svelte";
  import CardSectionComp from "$lib/components/ui-components/CardSectionComp.svelte";
  import AdCardSectionCom from "$lib/components/ui-components/AdCardSectionCom.svelte";
  import HorizontalSectionComp from "$lib/components/ui-components/HorizontalSectionComp.svelte";
  import CategoriesSectionCom from "$lib/components/ui-components/CategoriesSectionCom.svelte";
  import HorizentelReelsSectionCom from "$lib/components/ui-components/HorizentelReelsSectionCom.svelte";
  import HorizontalStoreSectionComp from "$lib/components/ui-components/HorizontalStoreSectionComp.svelte";

  //====Categories======
  const sections = [
    {
      id: 2,
      type: "top-categories",
      label: "Top Categories",
      items: [
        {
          id: 1,
          img: CategoriesA,
          href: "/sarees/cat",
          title: "Churidar",
        },
        {
          id: 2,
          img: CategoriesB,
          href: "/books/cat",
          title: "Saree",
        },
        {
          id: 3,
          img: CategoriesC,
          title: "Jeans",
        },
        {
          id: 4,
          img: CategoriesD,
          title: "Tops",
        },
        {
          id: 5,
          img: CategoriesE,
          title: "Jwelary",
        },
        {
          id: 6,
          img: CategoriesF,
          title: "Shirt",
        },
        {
          id: 7,
          img: CategoriesG,
          title: "Sneakers",
        },
        {
          id: 8,
          img: CategoriesH,
          title: "Heels",
        },
        {
          id: 9,
          img: CategoriesI,
          title: "Bra",
        },

        {
          id: 10,
          img: CategoriesJ,
          title: "Lipstic",
        },
        {
          id: 11,
          img: CategoriesK,
          title: "Bags",
        },
      ],
    },
    {
      id: 1,
      type: "horizontal-reels",
      label: "Reels",
      items: [
        {
          id: 1,
          video: videoA,
          href: "/reels/10",
        },
        {
          id: 2,
          video: videoB,
        },
        {
          id: 3,
          video: videoC,
        },
        {
          id: 4,
          video: videoD,
        },
        {
          id: 5,
          video: videoE,
        },
      ],
    },

    {
      id: 3,
      type: "card",
      label: "Trending Now",
      items: [
        {
          id: 1,
          type: "card",
          href: "/mens-jacket?type=collection&d=30",
          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQAJ1opeJuQxM5xg3wmrqQfTtALcaKFmcCtvySNKNjSSKEVqx9DIfSPlDGW90P68raeUjkYMll1Cca61x___4u3I8Z90K795fU53DZB4gCwk2nNMts07zkueA",
          title: "Men's Jackets",
          subtitle: "30% off",
        },
        {
          id: 2,
          type: "card",
          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTGvrmmo8C9iJSqwoFpvWFOIBajvUXdN4Uus8cnQCeaK7wrKs4sAx4lTAIUtNykR5hnyi7h6LCpfztl-qp4qeAPwgCk8PqeSplh7avaBN1iTG7MI6U3vkwf1A",
          title: "Unisex Hoodies",
          subtitle: "Top Picks",
        },
        {
          id: 3,
          type: "card",
          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR3noO2mxPvitIpe-07fROgkV3dvcrCDrlkqHiizHiNraxK-f5GMO0v5chdSwbvHq7VN6gnRetjjcX6nxTN8PzutfzNvY7tBNPv0VvsrjVDJj9WB9_SH2WqMA",
          title: "Women's Winter Coats",
          subtitle: "Top Picks",
        },
        {
          id: 4,
          type: "card",
          img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQskFN4DAUaxHeauPTB6EsJ5cwnL2tqDhJMY0AdZLqcpmFCvzBQokHz4AmOPpO5E1nPc5b2zE42cXSmGKOI-Ni4PLMKwymKi4X5YRoaS5c",
          title: "Sweaters",
          subtitle: "Top Picks",
        },
                {
          id: 5,
          type: "card",
          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcR3noO2mxPvitIpe-07fROgkV3dvcrCDrlkqHiizHiNraxK-f5GMO0v5chdSwbvHq7VN6gnRetjjcX6nxTN8PzutfzNvY7tBNPv0VvsrjVDJj9WB9_SH2WqMA",
          title: "Women's Winter Coats",
          subtitle: "Top Picks",
        },
        {
          id: 6,
          type: "card",
          img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQskFN4DAUaxHeauPTB6EsJ5cwnL2tqDhJMY0AdZLqcpmFCvzBQokHz4AmOPpO5E1nPc5b2zE42cXSmGKOI-Ni4PLMKwymKi4X5YRoaS5c",
          title: "Sweaters",
          subtitle: "Top Picks",
        },
      ],
    },

    {
      id: 4,
      type: "card",
      label: "Deels Of The Week",
      items: [
        {
          id: 1,

          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSuS7PL9pXbtL6tNxfDoeRAA0fXSyp_U50CMj1pOpNuxGqDGMa8MBkjx8MSiCsTun4sLuOyUjhJEj3spDvAZ75y-8Eqe3Hg8ygczbmeOqdLhVmvG6nMx9L5",
          title: "Sherwani",
          subtitle: "Top Picks",
        },
        {
          id: 2,

          img: "https://manyavar.scene7.com/is/image/manyavar/131222-1-272_11-05-2021-13-31-2:650x900?&dpr=on,2",
          title: "Silk Sarees",
          subtitle: "Top Picks",
        },
        {
          id: 3,

          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTFdJTWdvo9Whb8kFpZpW7DmWEzBbmiIsJLDo8QqeGeVSTRYG1bS_1sN2Mf71ZRwOZ4PFgA7AhflTpkKQY30abYNzvQewBhEWqPjnZJrJeJTR-PIWZkqsBibw",
          title: "Anarkali Suits",
          subtitle: "Top Picks",
        },
        {
          id: 4,
          img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQS7-QD9Mdre12ZHIFjPhPWiCJTiP1pmPUHUyzWSLHNCpye3PufdihKUOY5rcF6l6r2Zk73pfE_DVIbk-pJeHvLegvJsFt7lv2IS3fzs5nD",
          title: "Kurtis",
          subtitle: "Top Picks",
        },
      ],
    },

    {
      id: 5,
      type: "ad-card",
      image:
        "https://img.freepik.com/premium-photo/pair-sneakers-vibrant-pink-background-black-friday-sale-promotion-banner-ecommerce-concept_174533-110222.jpg?semt=ais_hybrid&w=740&q=80",
      title: "Banner",
    },

    {
      id: 6,
      type: "horizontal",
      label: "Shoe Collection",
      items: [
        {
          id: 1,
          img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSOnxjQ2aa1_GUOjr2ZiwnqIzNE8z4IDDRR_dgeMW6Yu9XDS705HMXXUNTk4Gip3EndEPbhpzzrxE3bmoCwhW8Z_2FKs76DeTJ203qHyjhhvn-W1jY_gaQRZQ",
          title: "Asian Men's Mexico-02 Casual Sneaker Shoes",
          price: "₹ 1099",
        },
        {
          id: 2,
          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRjggXGvd4qv3SeBGaNQS56pCq9o0yBoeFQOp-1gLpsLmPr_6itk4MsRRFy_ysyIXYgKFydfZng0dH6zbT_1ZSvl4tXcgdHHFzxwC2mGTriWqn1Ine-MeQ-320",
          title: "HRX by Hrithik Roshan Women White & Beige Colourblocked",
          price: "₹ 1099",
        },
        {
          id: 1,
          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRqVs2L1_uXZZZrc4ClqN1B-Kv-52XTnl-QMEWaSenYKHz9zMP47UeM_vj1gsScGzgP511JHYa0YtmKTkiR8MkBh1OQ8fR2tr6HKkU4vBDJWs-0SWNDZjbyi3I",
          title: "LATWOSCA Men's Textured Leather Everyday Loafers",
          price: "₹ 1099",
        },
        {
          id: 2,
          img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcTQh3evWiNMM-6_O5nevuo9jpB17exSz58gOjT2YmlgvSzS50V7xlejqwtcyqf0vPHccgOo1WR6rLjeMeJ-w2smoh4nj6XYkJ_w48rQwYlL7PEZMdR0pVn5",
          title: "Crosshunt Breathable High-Fitting Leather Hunting Boots",
          price: "₹ 1099",
        },
        {
          id: 3,
          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQVpo78MDOfQ4oiqyzqGiijBct6eqXgMBVfv9HDsGycw5DMJhIIzZ6FHBhCKqnflP6wqWcQvwk0Qrzrzrgk_gq1wzvkCLgS9mgxPbRhDw8ZiVmfhOJr1NGo93Ca",
          title: "decathlon Running Shoes for Men JOGFLOW 100.1 M",
          price: "₹ 1099",
        },
        {
          id: 5,
          img: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcRAb_dIS1E83CAjTrilZ6c1xbMaIbGCWkDyl3-h7GQ8lm8dHSXQIQQr41VamXnuuN8nWN0Th_Q3OoRU0OwlXYqnIrmzgZS5DlMpMo_Pam77_yJfwlbfFAB4Xw",
          title: "Adidas Men's Aerostride Running Shoe",
          price: "₹ 2349",
        },
      ],
    },

    {
      id: 7,
      type: "horizontal-store",
      label: "Popular Store",
      items: [
        {
          id: 1,
          img: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/g/6870da14ef4805cf7f5118e1/books-500x375.jpg",
          name: "Store 1",
          slug: "store-1",
        },
        {
          id: 2,
          img: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/66b9fe8bc030bd002b06e02f/amazing-india-500x375.png",
          name: "Store 2",
          slug: "store-1",
        },
        {
          id: 3,
          img: "https://www.mystore.in/s/62ea2c599d1398fa16dbae0a/g/6870da14ef4805cf7f5118e1/books-500x375.jpg",
          name: "Store 3",
          slug: "store-1",
        },
      ],
    },

    {
      id: 8,
      type: "card",
      label: "Men's Fashion",
      items: [
        {
          id: 1,

          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcSnMqZkj4EOvIGjkkFujQowVdPbCimMc0y7-43Ku5HAD9yFrF1PMHVFOLT4AdOi08ejZ35uHp7SNnOYwm_FiB5NuTKmpPfhTYx8xzO8bLE",
          title: "Casual Shirts",
          subtitle: "Top Picks",
        },
        {
          id: 2,

          img: "https://jewelor.co/cdn/shop/files/BLT021SLR_dc3cc240-5e1c-42d6-9bca-1f1e28aeeed1.jpg?v=1759324153&width=1400",
          title: "Men's Jewellery",
          subtitle: "Top Picks",
        },
        {
          id: 3,

          img: "https://bananaclub.co.in/cdn/shop/files/KoiBlueWrinkleFreeShirt_3.jpg?v=1738819805&width=1000",
          title: "Office Wear",
          subtitle: "Top Picks",
        },
        {
          id: 4,
          img: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQ79WCCt1Ym1BmrJssgn7tQCugGBKaKR1DuUAr0cWZANOMIeRmyoyFfsx__RSiuv40u1LOlVjZYfpBHHbKnvyM1hXlGJHJ1xBleLEgNNtA9xsO5NRHd3t4n",
          title: "Loose Fit Jeans",
          subtitle: "Top Picks",
        },
      ],
    },

    {
      id: 9,
      type: "card",
      label: "Home Electronics",
      items: [
        {
          id: 1,

          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQmiiNkgeK71P-eXWq4agG5K9RAzVC0h2tDggfWUXoEqJ3uYHhWtEesNVHyedR2lT3JIr5xSUnTP7k1g3qyeyqLezSccGyunUavwQFtFOkzHY7vSVg7m7ax2g",
          title: "TVs",
          subtitle: "Top Picks",
        },
        {
          id: 2,

          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcRqb0d9xFYGMhTmwvSNdFvuIis-0xtujmLAmC2BNq72pmSqYyPIllpaWtav5Fe6snCsTgrwZTEo84Spt2kpTs1s5cEGKKJ8OZSPTSAEqLrVIVni-2gTIC5X",
          title: "Refrigerators",
          subtitle: "Top Picks",
        },
        {
          id: 3,

          img: "https://encrypted-tbn3.gstatic.com/shopping?q=tbn:ANd9GcTTbnKew3S9kNTFUpno4o8dxdn9EndjLOQO5OedX7e7Ap-_GNFII0bsu33TkxGR0f6Y80jnkV57gnHKFF4Gp6IQNWuqzdh19mr8tqYwts2DrVx5PvXQ8c3Nl60",
          title: "Geyesers",
          subtitle: "Top Picks",
        },
        {
          id: 4,

          img: "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcQ80OJLBajukTFT9ZmjwGLXYCcHuM92WI8T4N40BNk04LlbmaHC2B8Dxe2VkAu4aeNlp-GngRb6CwBjmErqkgLjmrZfFRtlNm5U7bECjJDlzCuGumJGnymMYw",
          title: "Irons",
          subtitle: "Top Picks",
        },
      ],
    },

    {
      id: 10,
      type: "ad-card",
      image:
        "https://img.freepik.com/free-psd/new-smartphone-17-pro-social-media-banner-design-template_47987-32600.jpg?semt=ais_hybrid&w=740&q=80",
      title: "Banner",
    },

    {
      id: 11,
      type: "horizontal",
      label: "Books Toys & More",
      items: [
        {
          id: 1,
          img: BookA,
          title: "Fascista Men's Print...",
        },
        {
          id: 2,
          img: BookB,
          title: "Fascista Men's Print...",
        },
        {
          id: 3,
          img: BookC,
          title: "Fascista Men's Print...",
        },
        {
          id: 4,
          img: BookD,
          title: "Fascista Men's Print...",
        },
      ],
    },
  ];
</script>

<div class="relative">
  <Banner />
  <div class="mx-auto w-full max-w-7xl px-3 py-4 md:px-4">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
      {#each sections as section}
        {#if section.type === "horizontal-reels"}
          <HorizentelReelsSectionCom card={section} />
        {/if}

        {#if section.type === "top-categories"}
          <CategoriesSectionCom card={section} />
        {/if}
        {#if section.type === "card"}
          <CardSectionComp card={section} />
        {/if}
        {#if section.type === "ad-card"}
          <AdCardSectionCom card={section} />
        {/if}
        {#if section.type === "horizontal"}
          <HorizontalSectionComp card={section} />
        {/if}
        {#if section.type === "horizontal-store"}
          <HorizontalStoreSectionComp card={section} />
        {/if}
      {/each}
    </div>
  </div>
  <section class="mt-2 bg-white px-3 py-10 text-gray-900 antialiased md:px-4">
    <div class="mx-auto w-full max-w-7xl">
      <div
        class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
      >
        <h2 class="text-2xl sm:text-3xl font-semibold tracking-tight">
          Trend On Vlyp
        </h2>
        <div class="flex gap-2 items-center w-full sm:w-auto">
          <span
            class="font-medium text-gray-500 text-xs sm:text-sm whitespace-nowrap"
            >Sort:</span
          >
          <button
            id="sort-asc"
            class="px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
            >A-Z</button
          >
          <button
            id="sort-desc"
            class="px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
            >Z-A</button
          >
        </div>
      </div>
      <div class="mb-5 flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
        <div class="font-medium text-base text-gray-800 flex-shrink-0">
          Vylp - Brand Directory
        </div>
        <div class="text-xs sm:text-sm text-gray-500">
          Most Searched · Brand Tags
        </div>
      </div>
      <div id="tag-area" class="space-y-5">
        <!-- Tag Categories -->
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6"
        >
          <div
            class="w-28 font-semibold text-gray-600 text-xs uppercase tracking-widest flex-shrink-0"
          >
            Most Searched
          </div>
          <div class="flex-1 flex flex-wrap gap-2">
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Wedding Sale</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Winter Sale</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Google Pixel 10</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >iPhone 17</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Airpods</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Galaxy S25</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Realme 10</a
            >
          </div>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6"
        >
          <div
            class="w-28 font-semibold text-gray-600 text-xs uppercase tracking-widest flex-shrink-0"
          >
            Mobiles
          </div>
          <div class="flex-1 flex flex-wrap gap-2">
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Infinix SMART 10</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >OPPO Reno 14 Pro</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Vivo V30</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Galaxy S24</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Realme 12+</a
            >
          </div>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6"
        >
          <div
            class="w-28 font-semibold text-gray-600 text-xs uppercase tracking-widest flex-shrink-0"
          >
            Camera
          </div>
          <div class="flex-1 flex flex-wrap gap-2">
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >GoPro Action</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Nikon</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Canon DSLR</a
            >
          </div>
        </div>
        <div
          class="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6"
        >
          <div
            class="w-28 font-semibold text-gray-600 text-xs uppercase tracking-widest flex-shrink-0"
          >
            Laptops
          </div>
          <div class="flex-1 flex flex-wrap gap-2">
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >MacBook Pro M2</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >Asus ROG Strix</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >ThinkPad</a
            >
            <a
              href="#"
              class="tag px-3 py-1 rounded bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all text-xs"
              >HP Laptops</a
            >
          </div>
        </div>
      </div>
      <!-- About/Info Section -->
      <div class="mt-10 w-full space-y-4 text-sm">
        <div>
          <p class="font-semibold text-gray-900 text-base">
            Your Online Shopping Destination
          </p>
          <p class="text-gray-500 mt-1">
            Welcome to <span class="font-semibold text-gray-900">Vylp</span> - find
            gadgets, decor, fashion, and more. Discover deals and essentials for
            every need.
          </p>
        </div>
        <div>
          <h3 class="font-medium text-gray-800 text-xs mb-1">Highlights</h3>
          <ul class="list-none pl-0 flex flex-wrap gap-3 text-gray-600">
            <li>
              <span class="font-semibold text-gray-700">Shop:</span>
              <a href="#" class="text-sky-600 hover:underline">Smartphones</a>,
              <a href="#" class="text-sky-600 hover:underline">Laptops</a>,
              <a href="#" class="text-sky-600 hover:underline">Appliances</a>,
              <a href="#" class="text-sky-600 hover:underline">Fashion</a>
            </li>
            <li>
              <span class="font-semibold text-gray-700">Compare & Save:</span> Top
              brands, fast shipping, trending products.
            </li>
            <li>
              <span class="font-semibold text-gray-700">Curated:</span> Easy returns,
              secure checkout, minimalist shopping.
            </li>
          </ul>
        </div>
      </div>
      <div class="mt-8 text-xs text-gray-400 text-center">
        Inspired by modern e-commerce trends. Brand adapted as <strong
          class="font-semibold">Vylp</strong
        >.
      </div>
    </div>
  </section>
</div>
