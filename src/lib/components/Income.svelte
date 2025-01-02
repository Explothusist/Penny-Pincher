<script lang="ts">
    import IconEdit from "virtual:icons/mdi/pencil-box-outline";
    import IconDelete from "virtual:icons/mdi/trash-can-outline";
    import { commatizeNumber } from "$lib/util";

    export let income;
    export let onClickDelete = function(income_id: number) {

    };
    export let show_edit_delete = true;
</script>


<income>
    <!-- HACK! -->
    <time>{new Date(income.date * 1000).toDateString().split(" ").slice(1, 4).join(" ")}</time>
    <sep>―</sep>
    <txt>Income of</txt>
    <dollars>${commatizeNumber(income.amountUsd)}</dollars>
    {#if show_edit_delete}
        <icon>
            <IconEdit />
        </icon>
        <icon on:click={() => onClickDelete(income.id)}>
            <IconDelete />
        </icon>
    {/if}
</income>

<style>
    income {
        display: block;
        background-color: #00000010;
        transition: background-color 200ms;
        padding: 12px;
    }

    income:hover {
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

    org, person {
        position: relative;
        top: 4px;

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
