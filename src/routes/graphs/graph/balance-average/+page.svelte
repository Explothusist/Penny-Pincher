<script lang="ts">
    import Chart from 'chart.js/auto';
    import 'chartjs-adapter-dayjs-4/dist/chartjs-adapter-dayjs-4.esm';
    import Logo from "$lib/components/Logo.svelte";
    import { onMount } from "svelte";
    import type { Expense } from '$lib/db.server.js';
    import { commatizeNumber, tooltipPlugin } from '$lib/util.js';
    export let form, data;

    let calc_balance = data.currBalance.amountUsd;
    let data_points: {x: number, y: number}[] = [];

    data.recentOccurance.sort((a, b) => b.date-a.date);

    for (let occurance of data.recentOccurance) {
        data_points.push({x: occurance.date * 1000, y: calc_balance});
        if (occurance.isIncome) {
            calc_balance -= occurance.amountUsd;
        }else {
            calc_balance += occurance.amountUsd;
        }
    }

    let minDate = data.minDate;
    let maxDate = data.maxDate;
    if (data.recentToggle) {
        minDate = data.recentOccurance[data.recentOccurance.length-1].date;
        maxDate = data.recentOccurance[0].date;
    }

    let number_of_boxes = data.numBoxes;
    let base = minDate*1000;
    let increment = ((maxDate-minDate)/number_of_boxes) * 1000;
    let boxes: {x: number, y: number, num: number}[] = [];
    for (let i = 0; i < number_of_boxes; i++) {
        boxes.push({x: base + (increment * i), y: 0, num: 0});
    }

    data_points.forEach((point) => { 
        boxes[Math.floor(((point.x)-base)/increment)].y += point.y;
        boxes[Math.floor(((point.x)-base)/increment)].num += 1;
    });
    boxes = boxes.map((box) => { return { x: box.x, y: box.y/box.num, num: box.num }; });


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
                                min: data.minDate*1000 - increment/2,
                                max: data.maxDate*1000 - increment/2
                            } :
                            {
                                type: "time"
                            },
                            y: {
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
    <h1>Recent Balance - Average</h1>
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
