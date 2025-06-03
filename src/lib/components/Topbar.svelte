<script>
    import Logo from "./Logo.svelte"
    import TopbarButton from "./TopbarButton.svelte";
</script>


<nav>
    <div id="logo_container">
        <div id="logo">
            <Logo />
        </div>

        <div id="graphs">
            <TopbarButton text="Graphs" link="/graphs" />
        </div>
        <div id="categories">
            <TopbarButton text="Categories" link="/categories" />
        </div>
        <div id="search">
            <TopbarButton text="Search" link="/search" />
        </div>
        <div id="actions">
            <TopbarButton text="Actions" link="/action" />
        </div>
        <div id="import">
            <TopbarButton text="Import" link="/import" />
        </div>
    </div>
</nav>

<style>
    nav {
        display: grid;
        background-color: var(--accent0);
        background-color: var(--accent1);
        background: linear-gradient(135deg, var(--accent0), 60%, #1e1e64);
    }

    #logo_container {
        justify-self: left;
        margin-left: 10px;
        margin-bottom: 10px;
        margin-top: 4px;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
        gap: 10px;
        grid-auto-rows: minmax(50px, auto);
    }
    #logo {
        grid-column: 1;
    }
    #graphs {
        grid-column: 4;
    }
    #categories {
        grid-column: 5;
    }
    #search {
        grid-column: 6;
    }
    #actions {
        grid-column: 7;
    }
    #import {
        grid-column: 8;
    }
</style>