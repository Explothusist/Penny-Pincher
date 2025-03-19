<script lang="ts">
    import { onMount } from "svelte";
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
    
    const one_week = 43200 * 14;

    let DateToggle: HTMLElement;
    let RecentToggle: HTMLElement;

    function flip_date() {
        DateToggle.checked = !DateToggle.checked;
    };
    function flip_recent() {
        RecentToggle.checked = !RecentToggle.checked;
    };

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <slot />
    <form id="actionStuff" action="?/applySettings" method="POST">
        <content>
            <content>
                <input type="text" form="actionStuff" name="categories" value={getCategoryIds()} hidden>
                {#each nonzero_categories as category}
                    <category>
                        <CategoryCheckbox category={category} form="actionStuff" />
                    </category>
                {/each}
            </content>
            <content>
                <!-- <input type="checkbox" form="actionStuff" name="dateToggle" id="dateToggle" checked on:change={flip_recent} bind:this={DateToggle} > -->
                <input type="checkbox" form="actionStuff" name="dateToggle" id="dateToggle" checked={data.dateToggle} on:change={flip_recent} bind:this={DateToggle} >
                <label for="dateToggle">Dates from </label>
                <!-- <input type="date" form="actionStuff" name="minDate" value={new Date(Date.now()-(one_week*1000)).toISOString().slice(0, 10)} > -->
                <input type="date" form="actionStuff" name="minDate" value={new Date(data.minDate*1000).toISOString().slice(0, 10)} >
                <label for="minDate"> To </label>
                <!-- <input type="date" form="actionStuff" name="maxDate" value={new Date(Date.now()).toISOString().slice(0, 10)} > -->
                <input type="date" form="actionStuff" name="maxDate" value={new Date(data.maxDate*1000).toISOString().slice(0, 10)} >
            </content>
            <content>
                <!-- <input type="checkbox" form="actionStuff" name="recentToggle" id="recentToggle" on:change={flip_date} bind:this={RecentToggle} > -->
                <input type="checkbox" form="actionStuff" name="recentToggle" id="recentToggle" checked={data.recentToggle} on:change={flip_date} bind:this={RecentToggle} >
                <label for="recentToggle">Most Recent from </label>
                <!-- <input type="number" form="actionStuff" name="minRecent" value=0 > -->
                <input type="number" form="actionStuff" name="minRecent" value={data.minRecent} >
                <label for="minRecent"> To </label>
                <!-- <input type="number" form="actionStuff" name="maxRecent" value=50 > -->
                <input type="number" form="actionStuff" name="maxRecent" value={data.maxRecent} >
            </content>
        </content>
        <input type="submit" class="big-button" value="Apply">
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