<script>

    let { value= $bindable(), ...props} = $props();
</script>

<div class="relative">
    <input
        {...props}
        placeholder=" "
        class="w-full peer h-10 block border rounded-md border-gray-300 focus:outline-none px-4 sm:text-sm"
        bind:value={value}
        />
    <label
        for={props.id}
        class="block text-xs text-gray-600 mb-1 absolute top-1/2 left-2 -translate-y-1/2
        peer-focus:-top-2
        peer-focus:-translate-y-1/2
        peer-focus:left-1
        peer-not-placeholder-shown:-top-2
        peer-not-placeholder-shown:-translate-y-1/2
        peer-not-placeholder-shown:left-1
        transition-all duration-300
        ">{props.label}</label
    >
</div>
