<script>
    import { page } from "$app/stores";
</script>
<div>
    <p>{$page.status} : {$page.error.message}</p>
</div>