<script>
    import Topbar from "$lib/components/Topbar.svelte";
    // import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    export let form, data;

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    })                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<Topbar />

<div id="mainstuff">
    <div id="logo">
        <img src="/logo.png" alt="Piggy Bank with coins">
    </div>
    <logo-container>
        <h1>Penny Pincher</h1>
    </logo-container>
    <div id="motto">
        <p>Keep hold of every dollar.</p>
    </div>
    <div id="brag">
        <p>
            Tired of complex interfaces and high fees? Always finding yourself short a dollar
            or two? Use Penny Pincher-a free online service designed to help the commoner to do
            more with less. Simple interfaces and insightful statistics help even the least
            experienced to track and optimize every dollar. Take control of your finances and
            take control of your future.
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
