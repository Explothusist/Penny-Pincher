<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import Category from "$lib/components/Category.svelte";
    import CategoryTitleBar from "$lib/components/CategoryTitleBar.svelte";
    import CategoryCheckbox from "$lib/components/CategoryCheckbox.svelte";
    import Income from "$lib/components/Income.svelte";
    import Expense from "$lib/components/Expense.svelte";
    
    export let form, data;

    function getCategoryByID(id: number) {
        return data.categories.map((category) => category.id).indexOf(id);
    };

    let nonzero_categories = data.categories.filter((category) => (category.id !== 0));

    function getCategoryIds() {
        let string = "";
        nonzero_categories.forEach((category) => string += category.id+", ");
        return string;
    };

    function get_category_toggle(id: number) {
        return data.category_toggles[data.category_ids.indexOf(id)];
    };
    function get_category(id: number) {
        for (let i = 0; i < data.categories.length; i++) {
            if (data.categories[i].id === id) {
                return data.categories[i];
            }
        }
        // console.log(id);
    }

    function commatizeNumber(n: number): string {
        return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    let reportElement;

    function redGreenLerp(scalar: number, value: number) {
        const h = scalar * 135;
        return `hsl(${h}, 100%, ${value * 50}%)`;
    }
    
    function toCleanStamp(time: number): string {
        const parts = new Date(time * 1000).toDateString().split(" ").slice(1, 4);
        return `${parts[0]} ${parts[1]}, ${parts[2]}`;
    
}
    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <h1>Actions</h1>
    <form id="actionStuff" action="?/doAction" method="POST">
        <content>
            <h3>What Expenses/Incomes?</h3>
            <content>
                <link-box>
                    <input type="checkbox" form="actionStuff" name="incomeToggle" id="incomeToggle" checked={data.incomeToggle} >
                    <label for="incomeToggle">Income</label>
                </link-box>
                <link-box>
                    <input type="checkbox" form="actionStuff" name="expenseToggle" id="expenseToggle" checked={data.expenseToggle} >
                    <label for="expenseToggle">Expense</label>
                </link-box>
            </content>
            <content>
                <input type="text" form="actionStuff" name="categories" value={getCategoryIds()} hidden>
                {#each nonzero_categories as category}
                    <category>
                        <CategoryCheckbox category={category} form="actionStuff" prechecked={get_category_toggle(category.id)} />
                    </category>
                {/each}
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="minValueToggle" id="minValueToggle" checked={data.minValueToggle} >
                <label for="minValueToggle">Amount Greater Than:</label>
                <input type="number" form="actionStuff" name="minValue" value={data.minValue} >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="maxValueToggle" id="maxValueToggle" checked={data.maxValueToggle} >
                <label for="maxValueToggle">Amount Less Than:</label>
                <input type="number" form="actionStuff" name="maxValue" value={data.maxValue} >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="minDateToggle" id="minDateToggle" checked={data.minDateToggle} >
                <label for="minDateToggle">Later Than:</label>
                <input type="date" form="actionStuff" name="minDate" value={new Date(data.minDate*1000).toISOString().slice(0, 10)} >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="maxDateToggle" id="maxDateToggle" checked={data.maxDateToggle} >
                <label for="maxDateToggle">Earlier Than:</label>
                <input type="date" form="actionStuff" name="maxDate" value={new Date(data.maxDate*1000).toISOString().slice(0, 10)} >
            </content>
            <!-- <input form="actionStuff" name="id" type="number" value={deleteCategoryID} hidden> -->
            <h3>What to do with these Expenses/Incomes?</h3>
            <select form="actionStuff" name="toDo">
                <option value=-2 selected={data.toDo === -2}>Print Table</option>
                <option value=-3 selected={data.toDo === -3}>Export CSV</option>
                <option value=-1 selected={data.toDo === -1}>Delete All</option>
                {#each nonzero_categories as category}
                    <option value={category.id} selected={data.toDo === category.id}>Move to {category.name}</option>
                {/each}
            </select>
        </content>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <input type="submit" class="big-button" formaction="?/previewAction" value="Preview">
        <input type="submit" class="big-button" formaction="?/doAction" value="Confirm">
        <!-- <big-button on:click={() => deleteCategoryModalHidden=true}>Cancel</big-button> -->
    </form>
    <content>
        {#if data.preview}
            <report bind:this={reportElement} >
                <!-- class:mono={monochrome} -->
                <top-bar>
                    <Logo />
                    <info>
                        Report generated
                        <b>{toCleanStamp(Date.now())}</b>
                        <!-- by <b>{data.user.firstName} {data.user.lastName}</b>. -->
                    </info>
                </top-bar>
                <hr>
                <r-content>
                    <h2>Transactions</h2>
                    <table>
                        <thead>
                            <tr>
                            <th scope="col">Category ID</th>
                            <th scope="col">Category Name</th>
                            <th scope="col">Amount</th>
                            <th scope="col">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each data.objects as transaction}
                                {#if transaction.id !== -1}
                                    <tr>
                                        <td style="text-align: center;">{transaction.category}</td>
                                        <td style="text-align: center;">{get_category(transaction.category).name}</td>
                                        <td class="money" style="color:{redGreenLerp(transaction.isIncome, 0.65)}">
                                            <!-- ${commatizeNumber(transaction.amountUsd)}  -->
                                            {commatizeNumber(transaction.amountUsd * ((transaction.isIncome ? 1 : -1)))}
                                        </td>
                                        <td>{toCleanStamp(transaction.date)}</td>
                                    </tr>
                                {/if}
                            {/each}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th scope="row" colspan="2">Aggregate Change</th>
                                <td class="money" style="font-weight:bold;color:{redGreenLerp(data.objects.map((x) => x.amountUsd).reduce((a, b) => a + b, 0) > 0, 0.65)}">${commatizeNumber(data.objects.map((x) => x.amountUsd).reduce((a, b) => a + b, 0))}</td>
                                <td>{toCleanStamp(Date.now())}</td>
                            </tr>
                        </tfoot>
                    </table>
                </r-content>
            </report>
                {/if}
    </content>
</div>

<style>

    #mainstuff {
        /* width: max(80%, min(800px, 90%)); */
        /* margin-left: 10%; */
        margin: 5%;
        width: 90%;
        margin-top: 3%;
        
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

    split {
        display: flex;
        width: calc(100% - 32px);
        height: 100%;
        font-family: sans-serif;
        gap: 12px;

        margin-left: 16px;
        margin-right: 16px;
    }

    report {
        flex-grow: 1;
        background-color: white;
        overflow-y: auto;
    }

    :global(report logo-container) {
        display: inline-flex !important;
        margin-left: 0px !important;
    }

    :global(report logo-container h1) {
        color: #660077;
        margin: 0px;
    }

    config {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 400px;
        border: 2px solid gray;
        border-radius: 8px;
        background-color: #00000022;
        margin-top: 6px;
        margin-bottom: 6px;
    }

    config-options {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 8px;
        flex-grow: 1;
    }

    config-options hr {
        width: 95%;
    }

    sect {
        display: block;
        font-weight: bold;
        text-align: center;
        font-size: 1.2em;
    }


    row {
        user-select: none;
        width: 95%;
        display: flex;
        justify-content: space-between;
        font-weight: bold;
        margin-bottom: 4px;
        background-color: transparent;
        transition: background-color 200ms;
        padding: 4px;
        border-radius: 4px;
    }

    row:hover {
        background-color: #00000022;
    }

    row label {
        flex-grow: 1;
    }

    print-button {
        color: white;
        background-color: var(--grape-green);
        width: calc(100% - 24px);
        height: 128px;
        margin: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 48px;
        font-weight: bold;
        border-radius: 8px;
        cursor: pointer;
    
        transition: filter 100ms, background-color 100ms;
    }

    print-button:hover {
        filter: drop-shadow(0 0 2px black);
        background-color: #279727;
    }

    box-label {
        display: block;
        width: 100%;
        text-align: center;
        font-weight: bold;

        background-color: #00000022;
        padding-top: 12px;
        padding-bottom: 12px;
    }

    top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
    }

    report hr {
        margin: 10px 6px;
        border-color: #000000aa;
    }


    @media print {
        :global(body *:not(.printable-ancestor, .printable *)) {
            display: none !important;
        }
    }

    r-content {
        display: block;
        margin: 12px;
    }

    r-content h2 {
        margin: 0px;
        margin-bottom: 18px;
    }

    c-cont {
        display: flex;
        flex-direction: column;
        border-radius: 8px;
        margin: 12px;
    }

    table {
        border-collapse:collapse;
        background-color: #00000022;
        border-spacing: 50px 0;
        padding-left: 8px;
        padding-right: 8px;
        width: 100%;
    }

    thead {
        border-bottom: 1px solid black;
    }

    tfoot {
        border-top: 1px solid black;
    }

    tr:nth-child(odd) {
        background-color: #00000033;
    }

    td, th {
        padding-left: 4px;
        padding-right: 20px;
        text-align: center;
    }

    .money {
        color: green;
        font-weight: bold;
        text-align: center;
        -webkit-text-stroke: 0.2px black;
    }

    .mono {
        filter: grayscale(1.0);
    }

    .faint {
        opacity: 0.5;
    }
</style>