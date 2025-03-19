<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import Category from "$lib/components/Category.svelte";
    import CategoryTitleBar from "$lib/components/CategoryTitleBar.svelte";
    import CategoryCheckbox from "$lib/components/CategoryCheckbox.svelte";
    
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

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="topbar">
    <Logo />
</div>
<div id="mainstuff">
    <h1>Actions</h1>
    <form id="actionStuff" action="?/doAction" method="POST">
        <content>
            <h3>What Expenses/Incomes?</h3>
            <content>
                <link-box>
                    <input type="checkbox" form="actionStuff" name="incomeToggle" id="incomeToggle" checked >
                    <label for="incomeToggle">Income</label>
                </link-box>
                <link-box>
                    <input type="checkbox" form="actionStuff" name="expenseToggle" id="expenseToggle" checked >
                    <label for="expenseToggle">Expense</label>
                </link-box>
            </content>
            <content>
                <input type="text" form="actionStuff" name="categories" value={getCategoryIds()} hidden>
                {#each nonzero_categories as category}
                    <category>
                        <CategoryCheckbox category={category} form="actionStuff" />
                    </category>
                {/each}
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="minValueToggle" id="minValueToggle" >
                <label for="minValueToggle">Amount Greater Than:</label>
                <input type="number" form="actionStuff" name="minValue" >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="maxValueToggle" id="maxValueToggle" >
                <label for="maxValueToggle">Amount Less Than:</label>
                <input type="number" form="actionStuff" name="maxValue" >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="minDateToggle" id="minDateToggle" >
                <label for="minDateToggle">Later Than:</label>
                <input type="date" form="actionStuff" name="minDate" >
            </content>
            <content>
                <input type="checkbox" form="actionStuff" name="maxDateToggle" id="maxDateToggle" >
                <label for="maxDateToggle">Earlier Than:</label>
                <input type="date" form="actionStuff" name="maxDate" >
            </content>
            <!-- <input form="actionStuff" name="id" type="number" value={deleteCategoryID} hidden> -->
            <h3>What to do with these Expenses/Incomes?</h3>
            <select form="actionStuff" name="toDo">
                <option value=-1>Delete All</option>
                {#each nonzero_categories as category}
                    <option value={category.id}>Move to {category.name}</option>
                {/each}
                <option value=-2>Print Table</option>
                <option value=-3>Export CSV</option>
            </select>
        </content>
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-static-element-interactions -->
        <input type="submit" class="big-button" value="Confirm">
        <!-- <big-button on:click={() => deleteCategoryModalHidden=true}>Cancel</big-button> -->
    </form>
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