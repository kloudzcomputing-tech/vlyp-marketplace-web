<script>
    import SidePanel from '$lib/components/admin/SidePanel.svelte';
    import '../../app.css'
    let { children } = $props();
</script>
<div class="flex">
    <SidePanel/>
    <div class="flex-1">
        {@render children?.()}
    </div>
</div>