<script lang="ts">
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
    import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    import type { Expense } from '$lib/db.server.js';
    export let form, data;
    
    let minDate = data.minDate;
    let maxDate = data.maxDate;
    if (data.recentToggle) {
        minDate = data.recentExpense[data.recentExpense.length-1].date;
        maxDate = data.recentExpense[0].date;
    }

    let number_of_boxes = data.numBoxes;
    let base = minDate*1000;
    let increment = ((maxDate-minDate)/number_of_boxes) * 1000;
    let boxes = [];
    for (let i = 0; i < number_of_boxes+1; i++) {
        boxes.push({x: base + (increment * i), y: 0});
    }

    data.recentExpense.forEach((expense) => boxes[Math.floor(((expense.date*1000)-base)/increment)].y += expense.amountUsd);

    let old_boxes = [...boxes];
    // Average over last four intervals
    for (let i = 0; i < number_of_boxes; i++) {
        boxes[i].y = (old_boxes[i].y+old_boxes[Math.max(0, i-1)].y+old_boxes[Math.max(0, i-2)].y+old_boxes[Math.max(0, i-3)].y)/4;
    }

    onMount(() => {
        if(data.message){
            alert(data.message);
        }
        
        (async function() {
            const xyValues = boxes;

            new Chart(
                "chart_canvas",
                {
                    type: "line",
                    data: {
                        labels: boxes.map((box) => box.x),
                        datasets: [
                            {
                                label: 'Expense',
                                data: boxes,
                                borderColor: "rgb(0,0,255)",
                                backgroundColor: "rgba(0,0,255, 0.3)",
                                fill: "start"
                            }
                        ]
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
    <h1>Recent Expense - Average</h1>
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
