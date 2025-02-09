<script lang="ts">
    import IconEdit from "virtual:icons/mdi/pencil-box-outline";
    import IconDelete from "virtual:icons/mdi/trash-can-outline";
    import { commatizeNumber } from "$lib/util";

    export let category;
    export let onClickDelete = function(category_id: number) {};
    export let onClickEdit = function(category_id: number) {};
    export let show_edit_delete = true;
</script>

<color style={"background-color: "+category.color+"40;"}>
    <category>
        <title>{category.name}</title>
        {#if show_edit_delete}
            <icon on:click={() => onClickEdit(category.id)}>
                <IconEdit />
            </icon>
            <icon on:click={() => onClickDelete(category.id)}>
                <IconDelete />
            </icon>
        {/if}
    </category>
</color>

<style>

    color {
        display: block;
    }
    category {
        display: block;
        background-color: #00000010;
        transition: background-color 200ms;
        padding: 12px;
    }
    category:hover {
        background-color: #ffffff20;
    }
    
    icon {
        position: relative;
        top: 4px;

        display: inline-flex;
        gap: 2px;
        align-items: center;

        font-weight: bold;
        /* font-size: 20px; */

        background-color: #00000000;
        transition: background-color 200ms;
        padding: 3px;
    }
    icon:hover {
        background-color: #00000020;
    }

    time {
        font-weight: bold;
        font-size: 0.9em;
        display: inline-block;
    }

    sep {
        user-select: none;
        display: inline-block;
        opacity: 0.5;
        font-weight: bold;
    }

    txt {
        user-select: none;
    }

    title {
        position: relative;
        /* top: 4px; */

        display: inline-flex;
        gap: 2px;
        align-items: center;

        font-weight: bold;
    }

    dollars {
        color: darkgreen;
        font-weight: bold;
    }
</style>
