<script lang="ts">
    import IconEdit from "virtual:icons/mdi/pencil-box-outline";
    import IconDelete from "virtual:icons/mdi/trash-can-outline";
    import { commatizeNumber } from "$lib/util";

    export let expense;
    export let category;
    export let onClickDelete = function(income_id: number) {};
    export let onClickEdit = function(income_id: number) {};
    export let show_edit_delete = true;
    
    // console.log("Expense");
    // console.log(expense.category);
    // console.log(expense);
    // console.log(category);
    // console.log(category.name);
</script>

{#if expense.id !== -1}
    <color style={"background-color: "+category.color+"40;"}>
        <expense>
            <!-- HACK! -->
            <time>{new Date(expense.date * 1000).toDateString().split(" ").slice(1, 4).join(" ")}</time>
            <sep>―</sep>
            <txt>Expense of</txt>
            <dollars>${commatizeNumber(expense.amountUsd)}</dollars>
            <txt>from</txt>
            <category>{category.name}</category>
            {#if show_edit_delete}
                <icon on:click={() => onClickEdit(expense.id)}>
                    <IconEdit />
                </icon>
                <icon on:click={() => onClickDelete(expense.id)}>
                    <IconDelete />
                </icon>
            {/if}
        </expense>
    </color>
{/if}

<style>
    color {
        display: block;
    }
    
    expense {
        display: block;
        background-color: #00000010;
        transition: background-color 200ms;
        padding: 12px;
    }

    expense:hover {
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

    category {
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
