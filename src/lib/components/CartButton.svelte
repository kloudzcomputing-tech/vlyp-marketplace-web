<script>
    import { goto } from "$app/navigation";
    import { cart } from "$lib/stores/cart";
</script>

<div>
    <p>
        Cart : <span class="text-blue-500">{$cart.length}</span>
    </p>
    <button
        onclick={() => {
            goto("/checkout");
        }}
    >
        Checkout
    </button>
</div>
