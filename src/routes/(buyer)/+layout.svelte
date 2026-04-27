<script>
	import "../../app.css";
	import favicon from "$lib/assets/faviconn.ico";
	import Header from "$lib/components/Header.svelte";
	import LogoAnimation from "$lib/components/LogoAnimation.svelte";
    import { navigating } from "$app/state";
    import Footer from "$lib/components/Footer.svelte";
    import { setCart } from "$lib/stores/cart";
  

	let { children, data } = $props();
	let cart_items = $state(data?.cart?.cart_items || []);
	let customer = $state(data?.customer || null);
	$effect(() => {
		setCart(cart_items);
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Vlyp : Products</title>
</svelte:head>
{#if navigating.type == 'link'}
    <div class="flex justify-center items-center bg-white">
        <LogoAnimation />
    </div>
{/if}
<div class="min-h-screen flex flex-col bg-[#f4f6f3] text-slate-900">
    <Header isLoggedIn={data?.isLoggedIn} customer={customer} />
    
    <main class="flex-1 w-full pb-20 sm:pb-0">
        {@render children?.()}
    </main>
    
    <Footer/>
</div>
