<script lang="ts">
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
    import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    import type { Income } from '$lib/db.server.js';
    import { commatizeNumber, tooltipPlugin } from '$lib/util.js';
    export let form, data;
    
    let minDate = data.minDate;
    let maxDate = data.maxDate;
    if (data.recentToggle) {
        minDate = data.recentIncome[data.recentIncome.length-1].date;
        maxDate = data.recentIncome[0].date;
    }

    let number_of_boxes = data.numBoxes;
    let base = minDate*1000;
    let increment = ((maxDate-minDate)/number_of_boxes) * 1000;
    let boxes = [];
    for (let i = 0; i < number_of_boxes+1; i++) {
        boxes.push({x: base + (increment * i), y: 0});
    }

    data.recentIncome.forEach((income) => boxes[Math.floor(((income.date*1000)-base)/increment)].y += income.amountUsd);

    let old_boxes = [...boxes];
    // Average over last four intervals
    for (let i = 0; i < number_of_boxes+1; i++) {
        boxes[i].y = Math.round((old_boxes[i].y+old_boxes[Math.max(0, i-1)].y+old_boxes[Math.max(0, i-2)].y+old_boxes[Math.max(0, i-3)].y)/4);
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
                                label: 'Income',
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
                            },
                            tooltip: tooltipPlugin,
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
                                min: 0,
                                ticks: {
                                    callback: (v, _i, _v) => "$" + commatizeNumber(v),
                                }
                            }
                        }
                    }
                }
            );
        })();
    })                                      //  If you can move this to a +page.ts, please do. Also, why is the syntax highlighting making it red????
</script>

<div id="mainstuff">
    <h1>Recent Income - Average</h1>
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
        margin-top: 0%;
        
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
