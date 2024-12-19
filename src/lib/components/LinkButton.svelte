<script lang="ts">
    export let text;
    export let link = '/';
</script>

<a href={link} class="link-button">
    {text}
</a>

<style>
    .link-button {
        display: flex;
        text-decoration: none;

        cursor: pointer;

        color: black;
        font-size: 18px;
        font-weight: bold;

        justify-content: center;
        align-items: center;

        padding: 8px;
        padding-top: 16px;
        padding-bottom: 16px;

        transition: background-color 200ms;
        background-color: #00000000;
    }

    .link-button:hover {
        background-color: #00000088;
    }
</style>