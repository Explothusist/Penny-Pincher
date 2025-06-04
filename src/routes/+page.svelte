<script lang="ts">
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import Income from "$lib/components/Income.svelte";
    import Expense from "$lib/components/Expense.svelte";
    import Balance from "$lib/components/Balance.svelte";
    import IncomeTitleBar from "$lib/components/IncomeTitleBar.svelte";
    import ExpenseTitleBar from "$lib/components/ExpenseTitleBar.svelte";
    import ShowMoreButton from "$lib/components/ShowMoreButton.svelte";
    import CategoryCheckbox from "$lib/components/CategoryCheckbox.svelte";
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
    
    export let form, data;

    // console.log(data);

    const Jan_1_1900 = "1900-01-01"; // Oldest person to ever live lived 122 years, then round to a convenient date
    const Now = new Date();
    const Now_Formatted = Now.getFullYear()+"-"+String(Now.getMonth()+1).padStart(2, "0")+"-"+String(Now.getDate()).padStart(2, "0");
    const Zero = 0;
    const Total_USD_In_Circulation = 2391000000000; // As of 6/3/2025

    function getIncomeByID(id: number) {
        return data.recentIncome.map((income) => income.id).indexOf(id);
    };
    function getExpenseByID(id: number) {
        return data.recentExpense.map((income) => income.id).indexOf(id);
    };
    
    let addIncomeModalBind: HTMLElement;
    let addIncomeModalHidden = true;
    let editIncomeModalBind: HTMLElement;
    let editIncomeModalHidden = true;
    let editIncomeID = data.recentIncome[0].id;
    let deleteIncomeModalBind: HTMLElement;
    let deleteIncomeModalHidden = true;
    let deleteIncomeID = data.recentIncome[0].id;
    
    let addExpenseModalBind: HTMLElement;
    let addExpenseModalHidden = true;
    let editExpenseModalBind: HTMLElement;
    let editExpenseModalHidden = true;
    let editExpenseID = data.recentExpense[0].id;
    let deleteExpenseModalBind: HTMLElement;
    let deleteExpenseModalHidden = true;
    let deleteExpenseID = data.recentExpense[0].id;
    
    function addIncomeClickRaise() {
        addIncomeModalHidden = false;
    };
    function addIncomeClickDismiss(event: PointerEvent) {
        if (event.target !== addIncomeModalBind) return;
        addIncomeModalHidden = true;
    };
    function editIncomeClickRaise(income_id: number) {
        editIncomeModalHidden = false;
        editIncomeID = income_id;
    };
    function editIncomeClickDismiss(event: PointerEvent) {
        if (event.target !== editIncomeModalBind) return;
        editIncomeModalHidden = true;
    };
    function deleteIncomeClickRaise(income_id: number) {
        deleteIncomeModalHidden = false;
        deleteIncomeID = income_id;
    };
    function deleteIncomeClickDismiss(event: PointerEvent) {
        if (event.target !== deleteIncomeModalBind) return;
        deleteIncomeModalHidden = true;
    };
    
    function addExpenseClickRaise() {
        addExpenseModalHidden = false;
    };
    function addExpenseClickDismiss(event: PointerEvent) {
        if (event.target !== addExpenseModalBind) return;
        addExpenseModalHidden = true;
    };
    function editExpenseClickRaise(expense_id: number) {
        editExpenseModalHidden = false;
        editExpenseID = expense_id;
    };
    function editExpenseClickDismiss(event: PointerEvent) {
        if (event.target !== editExpenseModalBind) return;
        editExpenseModalHidden = true;
    };
    function deleteExpenseClickRaise(expense_id: number) {
        deleteExpenseModalHidden = false;
        deleteExpenseID = expense_id;
    };
    function deleteExpenseClickDismiss(event: PointerEvent) {
        if (event.target !== deleteExpenseModalBind) return;
        deleteExpenseModalHidden = true;
    };
    
    data.recentIncome.sort((a, b) => b.date-a.date);
    data.recentExpense.sort((a, b) => b.date-a.date);

    let nonzero_categories = data.categories.filter((category) => (category.id !== 0));
    let category_display = [true];
    for (let cat of nonzero_categories) {
        category_display.push(true);
    }
    let toggled_income = data.recentIncome;
    let toggled_expense = data.recentExpense;

    function get_category(id: number) {
        for (let i = 0; i < data.categories.length; i++) {
            if (data.categories[i].id === id) {
                return data.categories[i];
            }
        }
        // console.log(id);
    }
    function get_category_index(id: number) {
        for (let i = 0; i < data.categories.length; i++) {
            if (data.categories[i].id === id) {
                return i;
            }
        }
    }

    function get_toggled_income() {
        toggled_income = data.recentIncome.filter((income) => category_display[income.category]);
    }
    function get_toggled_expense() {
        toggled_expense = data.recentExpense.filter((expense) => category_display[expense.category]);
    }

    function toggle_category(number: number) {
        category_display[number] = !category_display[number];
        get_toggled_expense();
        get_toggled_income();
    }

    let calc_balance = data.currentBalance.amountUsd;
    let data_points: {x: number, y: number}[] = [];

    data.recentOccurance.sort((a, b) => b.date-a.date);

    for (let occurance of data.recentOccurance) {
        data_points.push({x: occurance.date * 1000, y: calc_balance});
        if (occurance.isIncome) {
            calc_balance -= occurance.amountUsd;
        } else {
            calc_balance += occurance.amountUsd;
        }
    }

    let minDate = data.minDate;
    let maxDate = data.maxDate;

    let number_of_boxes = data.numBoxes;
    let base = minDate*1000;
    let increment = ((maxDate-minDate)/number_of_boxes) * 1000;
    let boxes = [];
    for (let i = 0; i < number_of_boxes; i++) {
        boxes.push({x: base + (increment * i), y: 0});
    }

    data_points.forEach((point) => boxes[Math.floor(((point.x)-base)/increment)].y += point.y);

    onMount(() => {
        document.body.appendChild(addIncomeModalBind);
        document.body.appendChild(editIncomeModalBind);
        document.body.appendChild(deleteIncomeModalBind);
        document.body.appendChild(addExpenseModalBind);
        document.body.appendChild(editExpenseModalBind);
        document.body.appendChild(deleteExpenseModalBind);
        if (data.message) {
            alert(data.message);
        }(async function() {
            const xyValues = boxes;

            new Chart(
                "chart_canvas",
                {
                    type: "line",
                    data: {
                        datasets: [{
                            pointRadius: 4,
                            pointBackgroundColor: "rgb(0,0,255)",
                            data: xyValues,
                            borderColor: "rgb(0,0,255)",
                            backgroundColor: "rgba(0,0,255, 0.3)",
                            fill: "start"
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: {
                                type: "time",
                                min: data.minDate*1000 - increment/2,
                                max: data.maxDate*1000 - increment/2
                            },
                            y: {
                                
                            }
                        }
                    }
                }
            );
        })();
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<left-right>
    <m-center>
        <balance>
            <Balance balance={data.currentBalance}/>
        </balance>

        <link-boxes class="links">
            {#each nonzero_categories as category}
                <CategoryCheckbox category={category} toggle_category={toggle_category} />
            {/each}
        </link-boxes> 
    </m-center>

    <div id="wrapper">
        <canvas id="chart_canvas"></canvas>
    </div>
</left-right>
<div id="mainstuff">
    <boxes>
        <labeled-box id="income">
            <box-label><IncomeTitleBar onClickAdd={addIncomeClickRaise}/></box-label>
            <box-content>
                {#each toggled_income as income}
                    <Income {income} category={get_category(income.category)} onClickDelete={deleteIncomeClickRaise} onClickEdit={editIncomeClickRaise} />
                {/each}
                <ShowMoreButton link={"/?income="+(data.income_loaded+50)+"&&expense="+(data.expense_loaded)} />
            </box-content>
        </labeled-box>

        <labeled-box id="expense">
            <box-label><ExpenseTitleBar onClickAdd={addExpenseClickRaise}/></box-label>
            <box-content>
                {#each toggled_expense as expense}
                    <Expense {expense} category={get_category(expense.category)} onClickDelete={deleteExpenseClickRaise} onClickEdit={editExpenseClickRaise} />
                {/each}
                <ShowMoreButton link={"/?expense="+(data.expense_loaded+50)+"&&income="+(data.income_loaded)} />
            </box-content>
        </labeled-box>
    </boxes>
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={addIncomeModalBind} class:hidden={addIncomeModalHidden} on:click={addIncomeClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Add Income</modal-label>
        <form id="addIncome" action="?/addIncome" method="POST">
            <content>
                <input form="addIncome" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <block-cont>
                    <faint>Amount:</faint>
                    <input form="addIncome" name="amount" type="number" min={Zero} max={Total_USD_In_Circulation} placeholder="Amount" >
                </block-cont>
                <block-cont>
                    <faint>Date:</faint>
                    <input form="addIncome" name="date" type="date" min={Jan_1_1900} max={Now_Formatted} value={new Date(Date.now()).toISOString().slice(0, 10)} >
                </block-cont>
                <block-cont>
                    <faint>Category:</faint>
                    <select form="addIncome" name="category">
                        {#each nonzero_categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => addIncomeModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={editIncomeModalBind} class:hidden={editIncomeModalHidden} on:click={editIncomeClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Edit Income</modal-label>
        <form id="editIncome" action="?/editIncome" method="POST">
            <content>
                <input form="editIncome" name="id" type="number" value={editIncomeID} hidden>
                <input form="editIncome" name="old_amount" type="number" value={data.recentIncome[getIncomeByID(editIncomeID)].amountUsd} hidden>
                <input form="editIncome" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <!-- <h3>Are you sure you want to edit this Income?</h3> -->
                <Income income={data.recentIncome[getIncomeByID(editIncomeID)]} category={get_category(data.recentIncome[getIncomeByID(editIncomeID)].category)} show_edit_delete={false}/>

                <block-cont>
                    <faint>Amount:</faint>
                    <input form="editIncome" name="amount" type="number" min={Zero} max={Total_USD_In_Circulation} value={data.recentIncome[getIncomeByID(editIncomeID)].amountUsd} >
                </block-cont>
                <block-cont>
                    <faint>Date:</faint>
                    <input form="editIncome" name="date" type="date" min={Jan_1_1900} max={Now_Formatted} value={new Date(data.recentIncome[getIncomeByID(editIncomeID)].date * 1000).toISOString().slice(0, 10)} >
                </block-cont>
                <block-cont>
                    <faint>Category:</faint>
                    <select form="editIncome" name="category">
                        {#each nonzero_categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => editIncomeModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={deleteIncomeModalBind} class:hidden={deleteIncomeModalHidden} on:click={deleteIncomeClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Confirm Delete Income</modal-label>
        <form id="deleteIncome" action="?/deleteIncome" method="POST">
            <content>
                <input form="deleteIncome" name="id" type="number" value={deleteIncomeID} hidden>
                <input form="deleteIncome" name="old_amount" type="number" value={data.recentIncome[getIncomeByID(deleteIncomeID)].amountUsd} hidden>
                <input form="deleteIncome" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <h3>Are you sure you want to delete this Income?</h3>
                <Income income={data.recentIncome[getIncomeByID(deleteIncomeID)]} category={get_category(data.recentIncome[getIncomeByID(deleteIncomeID)].category)} show_edit_delete={false}/>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => deleteIncomeModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={addExpenseModalBind} class:hidden={addExpenseModalHidden} on:click={addExpenseClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Add Expense</modal-label>
        <form id="addExpense" action="?/addExpense" method="POST">
            <content>
                <input form="addExpense" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <block-cont>
                    <faint>Amount:</faint>
                    <input form="addExpense" name="amount" type="number" min={Zero} max={Total_USD_In_Circulation} placeholder="Amount" >
                </block-cont>
                <block-cont>
                    <faint>Date:</faint>
                    <input form="addExpense" name="date" type="date" min={Jan_1_1900} max={Now_Formatted} value={new Date(Date.now()).toISOString().slice(0, 10)} >
                </block-cont>
                <block-cont>
                    <faint>Category:</faint>
                    <select form="addExpense" name="category">
                        {#each nonzero_categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => addExpenseModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={editExpenseModalBind} class:hidden={editExpenseModalHidden} on:click={editExpenseClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Edit Expense</modal-label>
        <form id="editExpense" action="?/editExpense" method="POST">
            <content>
                <input form="editExpense" name="id" type="number" value={editExpenseID} hidden>
                <input form="editExpense" name="old_amount" type="number" value={data.recentExpense[getExpenseByID(editExpenseID)].amountUsd} hidden>
                <input form="editExpense" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <!-- <h3>Are you sure you want to edit this Expense?</h3> -->
                <Expense expense={data.recentExpense[getExpenseByID(editExpenseID)]} category={get_category(data.recentExpense[getExpenseByID(editExpenseID)].category)} show_edit_delete={false}/>

                <block-cont>
                    <faint>Amount:</faint>
                    <input form="editExpense" name="amount" type="number" min={Zero} max={Total_USD_In_Circulation} value={data.recentExpense[getExpenseByID(editExpenseID)].amountUsd} >
                </block-cont>
                <block-cont>
                    <faint>Date:</faint>
                    <input form="editExpense" name="date" type="date" min={Jan_1_1900} max={Now_Formatted} value={new Date(data.recentExpense[getExpenseByID(editExpenseID)].date * 1000).toISOString().slice(0, 10)} >
                </block-cont>
                <block-cont>
                    <faint>Category:</faint>
                    <select form="editExpense" name="category">
                        {#each nonzero_categories as category}
                            <option value={category.id}>{category.name}</option>
                        {/each}
                    </select>
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => editExpenseModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={deleteExpenseModalBind} class:hidden={deleteExpenseModalHidden} on:click={deleteExpenseClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Confirm Delete Expense</modal-label>
        <form id="deleteExpense" action="?/deleteExpense" method="POST">
            <content>
                <input form="deleteExpense" name="id" type="number" value={deleteExpenseID} hidden>
                <input form="deleteExpense" name="old_amount" type="number" value={data.recentExpense[getExpenseByID(deleteExpenseID)].amountUsd} hidden>
                <input form="deleteExpense" name="former_balance" type="number" value={data.currentBalance.amountUsd} hidden>
                <h3>Are you sure you want to delete this Expense?</h3>
                <Expense expense={data.recentExpense[getExpenseByID(deleteExpenseID)]} category={get_category(data.recentExpense[getExpenseByID(deleteExpenseID)].category)} show_edit_delete={false}/>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => deleteExpenseModalHidden=true}>Cancel</big-button>
            <!-- {#if (form?.message) && form?.message !== "All Good!"} -->
            <!-- <p id="error"> -->
                <!-- {form?.message} -->
            <!-- </p> -->
            <!-- {/if} -->
        </form>
    </editor>
</modal>


<style>

    #mainstuff {
        /* width: max(80%, min(800px, 90%)); */
        /* margin-left: 10%; */
        margin: 5%;
        width: 90%;
        margin-top: 0%;
        
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

    .links {
        background-color: white;
        width: 80%;
        padding: 12px;
    }
    #entries {
        background-color: blue;
        width: 100%;
        margin: 20px;
    }
    #income {
        /* background-color: rgb(100, 200, 100); */
        /* display: flex; */
        /* width: 45%; */
        margin: 20px;
        
        /* float: left; */
        
        grid-column: 1;
        grid-row: 1 / 3;
    }
    #expense {
        /* background-color: rgb(200, 200, 100); */
        /* display: flex; */
        /* width: 45%; */
        margin: 20px;

        /* float: right; */
        
        grid-column: 2;
        grid-row: 1 / 3;
    }

    #search {
        /* background-color: green; */
        
        grid-column: 1;
        grid-row: 1;
    }
    #graphs {
        /* background-color: yellow; */
        
        grid-column: 2;
        grid-row: 1;
    }
    #categories {
        /* background-color: yellow; */
        
        grid-column: 3;
        grid-row: 1;
    }
    #actions {
        grid-column: 4;
        grid-row: 1;
    }

    #import {
        grid-column: 5;
        grid-row: 1;
    }
    
    labeled-box {
        display: flex;
        flex-direction: column;

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
        user-select: none;
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
        flex-grow: 1;
        min-height: 0;
        overflow-y: auto;
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
        gap: 10px;
        width: 100%;
        flex-grow: 1;
        margin-bottom: 12px;
        overflow-y: auto;
        min-height: 90px;
    }
    
    
    modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0px;
        top: 0px;
        background-color: #000000AA;
        width: 100%;
        height: 100%;
        font-family: helvetica;
        opacity: 1;
        transition: opacity 500ms;
    }
    modal.hidden {
        opacity: 0;
        pointer-events: none;
    }

    .confirm_modal {
    }

    editor {
        background-color: white;
        border-radius: 16px;
    }

    modal-label {
        display: block;
        background-color: var(--accent-1);
        color: white;
        text-align: center;
        padding: 12px;
        font-weight: bold;
    }

    content {
        display: block;
        margin: 12px;
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
        margin-top: 0px;
        border-radius: 8px;
        cursor: pointer;
        color: white;
        font-weight: bold;
    }
    
    block-cont {
        display: block;
    }

    faint {
        opacity: 0.7;
        font-size: 16px;
    }

    m-center {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-left: 3%;
    }

    left-right {
        display: flex;
        width: 100%;
        /* overflow: hidden; */
        margin-top: 2%;
        /* margin-right: 4%; */
    }

    left-right > * {
        flex: 1 1 0px;
        width: 0;
    }

    #wrapper {
        width: 100%;
        /* margin: 15px; */
        height: 270px;
        margin-right: 5%;
    }

    #chart_canvas {
        max-width: 100%;
    }

    editor > form {
        display: flex;
        flex-direction: column;
    }
</style>
