<script lang="ts">
    import IconPlus from "virtual:icons/mdi/plus-box-outline";
    import IconEdit from "virtual:icons/mdi/pencil-box-outline";
    import IconDelete from "virtual:icons/mdi/trash-can-outline";
    import { commatizeNumber } from "$lib/util";
</script>


<expense>
    <half>
        <txt>Expenses</txt>
    </half>
    <half class="right">
        <icon>
            <IconPlus />
        </icon>
    </half>
</expense>

<style>
    expense {
        display: block;

        font-size: 25px;
    }
    half {
        display: inline-flex;
    }

    .left {
        align-items: left;
        justify-content: left;
    }
    .right {
        margin-left: auto;
        margin-right: 0;
        /* width: auto; */
        text-align: right;
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

    icon {
        position: relative;
        top: 4px;

        display: inline-flex;
        gap: 2px;
        align-items: center;

        font-weight: bold;
        font-size: 20px;

        background-color: #00000000;
        transition: background-color 200ms;
        padding: 4px;
    }
    icon:hover {
        background-color: #ffffff20;
    }

    dollars {
        color: darkgreen;
        font-weight: bold;
    }
</style>
