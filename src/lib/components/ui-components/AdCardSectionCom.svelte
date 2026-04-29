<script>

 let {card} = $props();

</script>

<div class="col-span-3 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm md:col-span-1 sm:block hidden">
  <a href="#">
    <img src={card.image} alt={card.title} class="h-full w-full object-cover transition duration-300 hover:scale-[1.01]"/>
  </a>
</div>
