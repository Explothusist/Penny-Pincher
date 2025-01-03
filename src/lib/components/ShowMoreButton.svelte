<script lang="ts">

    export let link;
</script>

<a href={link}>
    <show-more>
        <txt>Show More</txt>
    </show-more>
</a>

<style>
    show-more {
        display: block;
        background-color: #00000010;
        transition: background-color 200ms;
        color: #000000;
        padding: 12px;

        text-align: center;
    }

    show-more:hover {
        background-color: #ffffff20;
    }

    txt {
        user-select: none;
    }

    a {
        text-decoration: none;
    }
</style>
