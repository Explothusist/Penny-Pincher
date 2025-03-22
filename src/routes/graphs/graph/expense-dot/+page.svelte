<script lang="ts">
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
    import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    import type { Expense } from '$lib/db.server.js';
    export let form, data;

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
        
        (async function() {
            const xyValues = data.recentExpense.map((function(expense: Expense) { return{x: expense.date*1000, y: expense.amountUsd}; }));

            new Chart(
                "chart_canvas",
                {
                    type: "scatter",
                    data: {
                        datasets: [{
                            pointRadius: 4,
                            pointBackgroundColor: "rgb(0,0,255)",
                            data: xyValues
                        }]
                    },
                    options: {
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: (data.dateToggle) ?
                            {
                                type: "time",
                                min: data.minDate*1000,
                                max: data.maxDate*1000
                            } :
                            {
                                type: "time"
                            },
                            y: {
                                min: 0
                            }
                        }
                    }
                }
            );
        })();
    })                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <h1>Recent Expense - Dot</h1>
    <chart-container>
        <canvas id="chart_canvas"></canvas>
    </chart-container>
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

    canvas {
        width: auto;
        height: auto;
    }
</style>
