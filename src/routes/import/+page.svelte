<script lang="ts">
    import { onMount } from "svelte";
    
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

<div id="mainstuff">
    <h1>Select a CSV file.</h1>
    <form id="importCSV" enctype="multipart/form-data" action="?/importCSV" method="POST">
        <p>Uses format: Amount(USD), Date(Unix Time), (Category(ID Number Optional), Expense/Income(1/0 Optional))</p>
        <content>
            <label for="importType">Import as:</label>
            <select form="importCSV" name="importType" id="importType">
                <option value=1>As Income</option>
                <option value=2>As Expense</option>
                <option value=3>As Indicated (Penny Pincher exports only)</option>
            </select>
        </content>
        <content>
            <label for="importCategory">Into Category:</label>
            <select form="importCSV" name="importCategory" id="importCategory">
                {#each nonzero_categories as category}
                    <option value={category.id}>All as {category.name}</option>
                {/each}
                <option value=-1>As Indicated (Penny Pincher exports only)</option>
            </select>
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