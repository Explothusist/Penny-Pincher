<script lang="ts">
    import IconPerson from "virtual:icons/mdi/person";
    import IconShop from "virtual:icons/mdi/shop";
    import { commatizeNumber } from "$lib/util";

    export let income;
</script>


<income>
    <!-- HACK! -->
    <time>{new Date(income.date * 1000).toDateString().split(" ").slice(1, 4).join(" ")}</time>
    <sep>―</sep>
    <txt>Income of</txt>
    <dollars>${commatizeNumber(income.amountUsd)}</dollars>
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
