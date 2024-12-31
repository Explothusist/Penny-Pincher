<script>
    import Logo from "$lib/components/Logo.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import Income from "$lib/components/Income.svelte";
    import Expense from "$lib/components/Expense.svelte";
    import Balance from "$lib/components/Balance.svelte";
    import IncomeTitleBar from "$lib/components/IncomeTitleBar.svelte";
    import ExpenseTitleBar from "$lib/components/ExpenseTitleBar.svelte";
    
    export let form, data;
    
    data.recentIncome.sort((a, b) => b.date-a.date);
    data.recentExpense.sort((a, b) => b.date-a.date);

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
        <Balance balance={data.currentBalance}/>
    </balance>
    <link-boxes id="links">
        <link-box id="search">
            <LinkButton text="Search" link="/search" />
        </link-box>
        <link-box id="graphs">
            <LinkButton link="/graphs" text="Graphs" />
        </link-box>
    </link-boxes>
    <boxes>
        <labeled-box id="income">
            <box-label><IncomeTitleBar /></box-label>
            <box-content>
                <div class="scroll">
                    {#each data.recentIncome as income}
                        <Income {income} />
                    {/each}
                </div>
            </box-content>
        </labeled-box>
        <labeled-box id="expense">
            <box-label><ExpenseTitleBar /></box-label>
            <box-content>
                <div class="scroll">
                    {#each data.recentExpense as expense}
                        <Expense {expense} />
                    {/each}
                </div>
            </box-content>
        </labeled-box>
    </boxes>
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
    balance {
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
    #links {
        background-color: white;
        width: 80%;
        margin-left: 10%;
        margin-top: 28px;
        margin-bottom: 28px;
        padding-left: 30px;
        padding-top: 5px;
        padding-bottom: 5px;
    }
    #entries {
        background-color: blue;
        width: 100%;
        margin: 20px;
    }
    #income {
        background-color: rgb(100, 200, 100);
        /* display: flex; */
        /* width: 45%; */
        margin: 20px;
        
        /* float: left; */
        
        grid-column: 1;
        grid-row: 1 / 3;
    }
    #expense {
        background-color: rgb(200, 200, 100);
        /* display: flex; */
        /* width: 45%; */
        margin: 20px;

        /* float: right; */
        
        grid-column: 2;
        grid-row: 1 / 3;
    }

    .scroll {
        height: 250px;
        overflow-y:scroll;
        margin-top: 0px;
        margin-bottom: 0px;
    }
    
    #search {
        /* background-color: green; */
        margin: 10px;
        
        grid-column: 2;
        grid-row: 1;
    }
    #graphs {
        /* background-color: yellow; */
        margin: 10px;
        
        grid-column: 3;
        grid-row: 1;
    }


    
    labeled-box {
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;
        height: 293px;
    }
    link-box {
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;
    }

    box-label {
        display: block;
        width: auto;
        /* text-align: center; */
        font-weight: bold;
        font-size: 20px;

        background-color: #00000022;
        padding-left: 12px;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    box-content {
        /* padding: 12px; */
        /* padding: 0px; */
        /* padding-left: 12px; */

        /* padding-bottom: 0px; */
    }
    boxes {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        grid-auto-rows: minmax(100px, auto);
        width: 100%;
        flex-grow: 1;
        margin-bottom: 12px;
    }
    link-boxes {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr;
        gap: 10px;
        /* grid-auto-columns: minmax(100px, auto); */
        grid-auto-rows: minmax(25px, auto);
        width: 100%;
        flex-grow: 1;
        margin-bottom: 12px;
    }
</style>
