<script lang="ts">
    export let text;
    export let link = '/';
    export let image = '/line_graph.png';
</script>

<a href={link} class="link-button">
    <div>
        <img src={image}>
    </div>
    <div id="below">
        {text}
    </div>
</a>

<style>
    .link-button {
        display: block;
        text-decoration: none;

        cursor: pointer;

        color: black;
        font-size: 18px;
        font-weight: bold;

        justify-content: center;
        align-items: center;
        text-align: center;

        padding: 8px;
        padding-top: 16px;
        padding-bottom: 16px;

        transition: background-color 200ms;
        background-color: #00000000;

        /* width: 50px; */
        height: 70px;
    }

    .link-button:hover {
        background-color: #00000088;
    }
</style>