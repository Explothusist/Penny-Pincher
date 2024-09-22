<script>
    import Topbar from "$lib/components/Topbar.svelte";
    import TopbarThermopylae from "$lib/components/TopbarThermopylae.svelte";
    // import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    export let form, data;

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    })                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<TopbarThermopylae />

<div id="mainstuff">
    <div id="logo">
        <img src="/thermopylae_logo.png" alt="Coin with Spartan Helmet">
    </div>
    <logo-container>
        <h1>Thermopylae</h1>
    </logo-container>
    <div id="motto">
        <p>Do more with less.</p>
    </div>
    <div id="brag">
        <p>
            An interface as simple and effective as the Spartans of old. No ridiculous bells and
            whistles. No obtuse interfaces. Just tried and true strategems and statistical
            analysis. Hold the pass with Thermopylae, managing great financial burdens with less
            effort and expenditure.
        </p>
    </div>
</div>

<style>
    #mainstuff {
        width: max(80%, min(800px, 90%));
        /* margin-left: 10%; */
        margin: auto;
        margin-top: 50px;
        
        /* background-color: white;
        justify-self: center;
        justify-content: center;
        margin-top: 15%;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 20px; */
    }
    #logo {
        display: flex;
        justify-content: center;
    }
    logo-container {
        display: flex;
        color: var(--accent0);
        align-items: center;
        justify-content: center;
        height: 130px;

        position: relative;
        top: 4px;

        font-size: 50px;
        text-shadow:
        -1px -1px 0 #000,
        1px -1px 0 #000,
        -1px 1px 0 #000,
        1px 1px 0 #000;
    }
    #motto {
        width: max(60%, min(600px, 90%));
        margin: auto;
        font-size: 35px;
        text-align: center;
    }
    #brag {
        width: max(60%, min(600px, 90%));
        margin: auto;
        font-size: 25px;
        text-align: justify;
    }
    img {
        width: 200px;
    }
</style>
