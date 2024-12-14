<script>
    import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
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
    <balance>
        <h1>Balance: $12,793,983</h1>
    </balance>
    <div id="links">
        <h1>Balance: $12,793,983</h1>
    </div>
    <div id="entries">
        <div id="income">
            <h1>Balance: $12,793,983</h1>
        </div>
        <div id="expense">
            <h1>Balance: $12,793,983</h1>
        </div>
    </div>
</div>

<style>
    #topbar {
        width: 100%;
        display: flex;
        justify-content: left;
        margin-left: 30px;
    }

    #mainstuff {
        /* width: max(80%, min(800px, 90%)); */
        /* margin-left: 10%; */
        margin: 50px;
        margin-top: 50px;
        width: 100%;
        
        /* background-color: white;
        justify-self: center;
        justify-content: center;
        margin-top: 15%;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 20px; */
    }
    balance {
        display: flex;
        color: var(--accent0);
        align-items: center;
        justify-content: center;
        height: 130px;

        position: relative;
        top: 4px;

        font-size: 30px;
        text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }
    #links {
        background-color: white;
        width: 100%;
        margin: 20px;
    }
    #entries {
        background-color: blue;
        width: 100%;
        margin: 20px;
    }
    #income {
        background-color: green;
        display: flex;
        width: 45%;
        margin: 20px;
        
        float: left;
    }
    #expense {
        background-color: yellow;
        display: flex;
        width: 45%;
        margin: 20px;

        float: right;
    }
</style>
