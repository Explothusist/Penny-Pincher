<script lang="ts">

    import Abe from "$lib/components/Abe.svelte"
    import Topbar from "$lib/components/Topbar.svelte";
    import { onMount } from "svelte";
    import { registerHeatmapHooks } from "$lib/heatmap-telemetry";

    onMount(() => {
        registerHeatmapHooks();
    });

</script>

<svelte:head>
    <title>Penny Pincher</title>
</svelte:head>

<page>
    <content>
        <div id="topbar">
            <Topbar />
        </div>
        <slot />
        
    </content>
    <!-- <div id="gemini-div" class="ai-helper">
        <div id="gemini-box">

        </div>
        <button id="gemini-button" on:click={openai}>?</button>
    </div> -->
    <Abe />
</page>



<style> 
    #topbar {
        display: flex;
        justify-content: left;
    }
    
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

    #gemini-div {
        position: absolute;
        right: 15px;
        bottom: 15px;
    }

    #gemini-button {
        width: 40px;
        height: 40px;
        border-radius: 100%;
        background-color: var(--accent1);
        font-weight: 1000;
        color: white;
    }
</style>
