<script>
    import Logo from "$lib/components/Logo.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import GraphLinkButton from "$lib/components/GraphLinkButton.svelte";
    export let form, data;

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    })                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="topbar">
    <Logo />
</div>
<div id="mainstuff">
    <labeled-box>
        <box-label>Balance Over Time</box-label>
        <graphs>
            <graph class="col1">
                <GraphLinkButton text="Line" link="/graphs/balance-line" image="/line_graph.png" />
            </graph>
            <graph class="col2">
                <GraphLinkButton text="Average" link="/graphs/balance-average" image="/average_graph.png" />
            </graph>
        </graphs>
    </labeled-box>
    <labeled-box>
        <box-label>Expenses Over Time</box-label>
        <graphs>
            <graph class="col1">
                <GraphLinkButton text="Dot" link="/graphs/expense-dot" image="/dot_graph.png" />
            </graph>
            <graph class="col2">
                <GraphLinkButton text="Average" link="/graphs/expense-average" image="/average_graph.png" />
            </graph>
            <graph class="col3">
                <GraphLinkButton text="Histogram" link="/graphs/expense-histogram" image="/histogram_graph.png" />
            </graph>
        </graphs>
    </labeled-box>
    <labeled-box>
        <box-label>Income Over Time</box-label>
        <graphs>
            <graph class="col1">
                <GraphLinkButton text="Dot" link="/graphs/income-dot" image="/dot_graph.png" />
            </graph>
            <graph class="col2">
                <GraphLinkButton text="Average" link="/graphs/income-average" image="/average_graph.png" />
            </graph>
            <graph class="col3">
                <GraphLinkButton text="Histogram" link="/graphs/income-histogram" image="/histogram_graph.png" />
            </graph>
        </graphs>
    </labeled-box>
</div>

<style>
    #topbar {
        width: 98%;
        display: flex;
        justify-content: left;
        margin-left: 2%;
    }

    #mainstuff {
        /* width: max(80%, min(800px, 90%)); */
        /* margin-left: 10%; */
        margin: 5%;
        width: 90%;
        
        /* background-color: white;
        justify-self: center;
        justify-content: center;
        margin-top: 15%;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 20px; */
    }


    
    labeled-box {
        display: block;
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;
        /* height: 100px; */
    }

    graphs {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        gap: 10px;
        grid-auto-rows: minmax(100px, auto);
        width: 100%;
        flex-grow: 1;
        margin-bottom: 12px;

        /* padding-left: 40px; */
    }

    graph {

    }
    
    .col1 {
        grid-column: 1;
        grid-row: 1;
    }
    .col2 {
        grid-column: 2;
        grid-row: 1;
    }
    .col3 {
        grid-column: 3;
        grid-row: 1;
    }

    box-label {
        display: block;
        width: 100%-12px;
        /* text-align: center; */
        font-weight: bold;
        font-size: 20px;

        background-color: #00000022;
        padding-top: 12px;
        padding-bottom: 12px;
        padding-left: 12px;
    }

    box-content {
        padding: 12px;
        padding: 0px;
    }
</style>
