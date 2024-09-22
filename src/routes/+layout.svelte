<svelte:head>
    <title>Penny Pincher</title>
</svelte:head>

<page>
    <content>
        <slot />
    </content>
</page>



<style> 
    :global(:root) {
        --accent-1: #272785;
        --accent0: #3333e4;
        --accent1: #3d3dca;
        --bg: #e6e6ff;
    }

    :global(html, body) {
        height: 100%;
        width: 100%;
    }

    :global(body) {
        /* Slightly cool and dark background color */
        background-color: var(--bg);
        margin: 0px;
    }

    page {
        display: flex;
        flex-direction: row;

        font-family: helvetica;
        height: 100%;
        width: 100%;
    }
    
    page > * {
        flex: 1 1 0;
    }

    content {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        height: 100%;
        overflow-y: auto;
    }
</style>
