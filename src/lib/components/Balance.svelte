<script lang="ts">
    import IconPerson from "virtual:icons/mdi/person";
    import IconShop from "virtual:icons/mdi/shop";
    import { commatizeNumber } from "$lib/util";

    export let balance;
</script>


<balance>
    <dollars>Balance: ${commatizeNumber(balance.amountUsd)}</dollars>
</balance>

<style>
    balance {
        display: block;
        padding: 12px;
    }

    dollars {
        /* color: darkgreen; */
        /* font-weight: bold; */
    }
</style>
