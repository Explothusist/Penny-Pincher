<script lang="ts">

    export let category;
    export let toggle_category = function(category_id: number) {};
    export let form = "none";
    export let prechecked = true;
</script>

<link-box style={"background-color: "+category.color+"40;"}>
    <input type="checkbox" form={form} name={"cat_"+category.id+"_checked"} id={"cat_"+category.id} on:click={() => toggle_category(category.id)} checked={prechecked} >
    <label for={"cat_"+category.id}>{category.name}</label>
</link-box>

<style>

    link-box {
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;

        padding: 5px;
    }
    
    input {
        font-size: 16px;
    }
</style>
