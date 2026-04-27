<script>
    import { CheckIcon } from "@lucide/svelte";

    let { checked = $bindable(false), label,onChange } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
    onclick={() => {
        checked = !checked;
        onChange(checked);
    }}
    class="flex cursor-default items-center gap-2"
>
    <span 
        class="w-5 h-5 border-2 rounded-sm flex items-center justify-center"
        style="background-color: {checked
            ? 'var(--primary-color)'
            : 'white'}; 
border-color: {checked
            ? 'var(--primary-color)'
            : 'var(--border)'};
"
    >
        {#if checked}
            <CheckIcon size={16} color="var(--primary-color-text)" />
        {/if}
    </span>
    <span class="text-sm font-medium text-gray-700">
        {label}
    </span>
</div>
