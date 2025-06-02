let recordingHeatmap = false;

// Can't define an enum inside a class........ litele weird.....
enum HeatmapEventType {
    NONE,
    MOVE,
    LEFT_CLICK,
};

// LEARNED: v8's hidden classes/SpiderMonkey's shapes/JavaScriptCore's structures
// will cluster this and probably make storage more optimized than arrays
class HeatmapPoint {
    static points: Array<HeatmapPoint> = [];

    timeMs: number;
    mouseX: number;
    mouseY: number;
    eventType: HeatmapEventType;

    constructor(
        timeMs: number,
        mouseX: number,
        mouseY: number,
        eventType: HeatmapEventType,
    ) {
        this.timeMs = timeMs;
        this.mouseX = mouseX;
        this.mouseY = mouseY;
        this.eventType = eventType;
    }

    toJSON(): Object {
        return { ...this };
    }
};

export function recordHeatmap() {
    recordingHeatmap = true;
}

export function registerHeatmapHooks() {
    console.log("Registering heatmap hook...");

    document.addEventListener("mousemove", function (event) {
        if (!recordingHeatmap) return;

        HeatmapPoint.points.push(new HeatmapPoint(
            performance.now(),
            event.clientX,
            event.clientY,
            HeatmapEventType.MOVE
        ));
    });

    document.addEventListener("click", function (event) {
        if (!recordingHeatmap) return;

        HeatmapPoint.points.push(new HeatmapPoint(
            performance.now(),
            event.clientX,
            event.clientY,
            HeatmapEventType.LEFT_CLICK
        ));
    });
}

export function downloadHeatmapData() {
    // NOTE: Does NOT stop recording!! BEWARE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    // FOR EVEN    A WHOLE BILLION YEARS!!!!!

    if (!HeatmapPoint.points.length) {
        alert("Collect some data first? Pls :-)")
        return;
    }

    const serializable = {
        config: {
            width: window.innerWidth,
            height: window.innerHeight,
        },
        points: HeatmapPoint.points.map(x => x.toJSON())
    };

    const blob = new Blob([JSON.stringify(serializable)], { type: "application/json" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "heatmap.json";
    a.style.display = "none";

    // Maybe no reflow because its display none
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    URL.revokeObjectURL(a.href);
}