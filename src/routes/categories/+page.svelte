<script lang="ts">
    import Logo from "$lib/components/Logo.svelte";
    import LinkButton from "$lib/components/LinkButton.svelte";
    import { onMount } from "svelte";
    import Category from "$lib/components/Category.svelte";
    import CategoryTitleBar from "$lib/components/CategoryTitleBar.svelte";
    
    export let form, data;

    function getCategoryByID(id: number) {
        return data.categories.map((category) => category.id).indexOf(id);
    };
    
    let addCategoryModalBind: HTMLElement;
    let addCategoryModalHidden = true;
    let editCategoryModalBind: HTMLElement;
    let editCategoryModalHidden = true;
    let editCategoryID = 1;
    let deleteCategoryModalBind: HTMLElement;
    let deleteCategoryModalHidden = true;
    let deleteCategoryID = 1;
    let actCategoryModalBind: HTMLElement;
    let actCategoryModalHidden = true;
    let actCategoryID = 1;
    
    function addCategoryClickRaise() {
        addCategoryModalHidden = false;
    };
    function addCategoryClickDismiss(event: PointerEvent) {
        if (event.target !== addCategoryModalBind) return;
        addCategoryModalHidden = true;
    };
    function editCategoryClickRaise(income_id: number) {
        editCategoryModalHidden = false;
        editCategoryID = income_id;
    };
    function editCategoryClickDismiss(event: PointerEvent) {
        if (event.target !== editCategoryModalBind) return;
        editCategoryModalHidden = true;
    };
    function deleteCategoryClickRaise(income_id: number) {
        deleteCategoryModalHidden = false;
        deleteCategoryID = income_id;
    };
    function deleteCategoryClickDismiss(event: PointerEvent) {
        if (event.target !== deleteCategoryModalBind) return;
        deleteCategoryModalHidden = true;
    };
    function actCategoryClickRaise(income_id: number) {
        actCategoryModalHidden = false;
        actCategoryID = income_id;
    };
    function actCategoryClickDismiss(event: PointerEvent) {
        if (event.target !== actCategoryModalBind) return;
        actCategoryModalHidden = true;
    };

    let nonzero_categories = data.categories.filter((category) => (category.id !== 0));

    onMount(() => {
        document.body.appendChild(addCategoryModalBind);
        document.body.appendChild(editCategoryModalBind);
        document.body.appendChild(deleteCategoryModalBind);
        document.body.appendChild(actCategoryModalBind);
        if(data.message){
            alert(data.message);
        }
    });                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <CategoryTitleBar onClickAdd={addCategoryClickRaise} />
    {#each nonzero_categories as category}
        <Category {category} onClickEdit={editCategoryClickRaise} onClickDelete={deleteCategoryClickRaise} />
    {/each}
</div>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<modal bind:this={addCategoryModalBind} class:hidden={addCategoryModalHidden} on:click={addCategoryClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Add Category</modal-label>
        <form id="addCategory" action="?/addCategory" method="POST">
            <content>
                <block-cont>
                    <faint>Name:</faint>
                    <input form="addCategory" name="name" placeholder="Name" >
                </block-cont>
                <block-cont>
                    <faint>Color:</faint>
                    <input type="color" form="addCategory" name="color" value="#cc0000" >
                    <!-- <select form="addCategory" name="category">
                        <option value=1>Red</option>
                        <option value=2>Orange</option>
                        <option value=3>Yellow</option>
                        <option value=4>Green</option>
                        <option value=5>Blue</option>
                        <option value=6>Indigo</option>
                        <option value=7>Violet</option>
                    </select> -->
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => addCategoryModalHidden=true}>Cancel</big-button>
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
<modal bind:this={editCategoryModalBind} class:hidden={editCategoryModalHidden} on:click={editCategoryClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Edit Category</modal-label>
        <form id="editCategory" action="?/editCategory" method="POST">
            <content>
                <input form="editCategory" name="id" type="number" value={editCategoryID} hidden>
                <!-- <h3>Are you sure you want to edit this Category?</h3> -->
                <Category category={data.categories[getCategoryByID(editCategoryID)]} show_edit_delete={false}/>

                <block-cont>
                    <faint>Name:</faint>
                    <input form="editCategory" name="name" placeholder="Name" value={data.categories[getCategoryByID(editCategoryID)].name} >
                </block-cont>
                <block-cont>
                    <faint>Color:</faint>
                    <input type="color" form="editCategory" name="color" value={data.categories[getCategoryByID(editCategoryID)].color} >
                    <!-- <select form="addCategory" name="category">
                        <option value=1>Red</option>
                        <option value=2>Orange</option>
                        <option value=3>Yellow</option>
                        <option value=4>Green</option>
                        <option value=5>Blue</option>
                        <option value=6>Indigo</option>
                        <option value=7>Violet</option>
                    </select> -->
                </block-cont>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => editCategoryModalHidden=true}>Cancel</big-button>
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
<modal bind:this={deleteCategoryModalBind} class:hidden={deleteCategoryModalHidden} on:click={deleteCategoryClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Confirm Delete Category</modal-label>
        <form id="deleteCategory" action="?/deleteCategory" method="POST">
            <content>
                <input form="deleteCategory" name="id" type="number" value={deleteCategoryID} hidden>
                <h3>Are you sure you want to delete this Category?</h3>
                <Category category={data.categories[getCategoryByID(deleteCategoryID)]} show_edit_delete={false}/>
                <h3>What to do with Expenses/Incomes in this Category?</h3>
                <select form="deleteCategory" name="cleanup">
                    <option value=-1>Delete All</option>
                    {#each nonzero_categories as category}
                        {#if category.id !== deleteCategoryID}
                            <option value={category.id}>Move to {category.name}</option>
                        {/if}
                    {/each}
                </select>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => deleteCategoryModalHidden=true}>Cancel</big-button>
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
<modal bind:this={actCategoryModalBind} class:hidden={actCategoryModalHidden} on:click={actCategoryClickDismiss}>
    <editor class="confirm_modal">
        <modal-label>Confirm Act Category</modal-label>
        <form id="actCategory" action="?/actCategory" method="POST">
            <content>
                <input form="actCategory" name="id" type="number" value={actCategoryID} hidden>
                <h3>Are you sure you want to act this Category?</h3>
                <Category category={data.categories[getCategoryByID(actCategoryID)]} show_edit_delete={false}/>
            </content>
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <input type="submit" class="big-button" value="Confirm">
            <big-button on:click={() => actCategoryModalHidden=true}>Cancel</big-button>
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
        
        /* background-color: white;
        justify-self: center;
        justify-content: center;
        margin-top: 15%;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 20px; */
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

    modal-label.error {

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
        border-radius: 8px;
        cursor: pointer;
        color: white;
        font-weight: bold;
        margin-top: 0px;
    }
    
    block-cont {
        display: block;
    }

    faint {
        opacity: 0.7;
        font-size: 16px;
    }

    editor > form {
        display: flex;
        flex-direction: column;
    }
</style>