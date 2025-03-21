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
            {#each data.objects as object}
                {#if object.isIncome}
                    <Income income={object} category={get_category(object.category)} show_edit_delete={false} />
                {:else}
                    <Expense expense={object} category={get_category(object.category)} show_edit_delete={false} />
                {/if}
            {/each}
        {/if}
    </content>
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