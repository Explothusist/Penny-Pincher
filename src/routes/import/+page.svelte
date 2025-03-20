<script lang="ts">
    import { onMount } from "svelte";
    
    export let form, data;

    let IncomeToggle: HTMLElement;
    let ExpenseToggle: HTMLElement;

    function flip_income() {
        IncomeToggle.checked = !IncomeToggle.checked;
    };
    function flip_expense() {
        ExpenseToggle.checked = !ExpenseToggle.checked;
    };

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <h1>Select a CSV file.</h1>
    <form id="importCSV" enctype="multipart/form-data" action="?/importCSV" method="POST">
        <content>
            <link-box>
                <input type="checkbox" form="importCSV" name="asIncome" id="asIncome" checked bind:this={IncomeToggle} on:change={flip_expense} >
                <label for="asIncome">As Income</label>
            </link-box>
            <link-box>
                <input type="checkbox" form="importCSV" name="asExpense" id="asExpense" bind:this={ExpenseToggle} on:change={flip_income} >
                <label for="asExpense">As Expense</label>
            </link-box>
        </content>
        <content>
            <link-box>
                <input type="file" form="importCSV" name="CSVfile" >
            </link-box>
        </content>
        <input type="submit" class="big-button" value="Confirm">
    </form>
</div>

<style>

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

    category {
        margin: 10px;
    }

    content {
        display: block;
        margin: 12px;

        padding: 5px;
    }
    
    link-box {
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;

        padding: 5px;
    }
    
    input, textarea, select {
        font-size: 16px;
    }
    
    big-button, .big-button {
        appearance: auto;
        user-select: none;
        text-align: center;
        box-sizing: border-box;
        white-space: pre;
        padding-block: 1px;
        padding-inline: 6px;
        border-width: 2px;
        border-style: outset;
        border-color: buttonborder;
        border-image: initial;

        background-color: var(--accent-1);
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px;
        margin: 12px;
        border-radius: 8px;
        cursor: pointer;
        color: white;
        font-weight: bold;
        width: 95%;
    }
    
    block-cont {
        display: block;
    }

    faint {
        opacity: 0.7;
        font-size: 16px;
    }
</style>