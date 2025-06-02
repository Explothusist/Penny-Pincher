# For self-referential type annotations (THIS ANNOYING "TEMPORARY" THING HAS
# BEEN NEEDED SINCE I WAS IN MIDDLE SCHOOL)
from __future__ import annotations

import json
import numpy as np
from enum import Enum
import matplotlib
import matplotlib.pyplot as plt
from scipy.ndimage import gaussian_filter
from dataclasses import dataclass

print("Matplotlib using ", matplotlib.get_backend())

# We squish movements down into chunks to make it easier to compute and make it
# more likely for patterns to emerge
BIN_SIZE_PX = 20
GAUSSIAN_SIGMA = 2.0

class HeatmapEventType(Enum):
    NONE = 0
    MOVE = 1
    LEFT_CLICK = 2

@dataclass
class HeatmapPoint:
    time_ms: float
    mouse_x: int
    mouse_y: int
    event_type: HeatmapEventType

    @staticmethod
    def from_json(d: dict) -> HeatmapPoint:
        return HeatmapPoint(
            time_ms=d["timeMs"],
            mouse_x=d["mouseX"],
            mouse_y=d["mouseY"],
            event_type=HeatmapEventType(d["eventType"])
        )


while True:
    target_path = input("Heatmap Path> ")

    if not target_path:
        print("Blank input. Defaulting to 'heatmap.json'...")
        target_path = "heatmap.json"

    try:
        with open(target_path) as file:
            j = json.load(file)

        break
    except FileNotFoundError:
        print(
            "Please supply a valid file. This can be a global path or a local path."
        )
    except json.JSONDecodeError:
        print("Please supply a valid json file.")

# Ok we're good here
points = list(map(HeatmapPoint.from_json, j["points"]))
config = j["config"]

assert points

# The reference im using for the heatmap rendering does this -1 and I'm not
# really sure why... probably to make it fall down a bin in the ceiling division?
grid_width = (config["width"] + BIN_SIZE_PX - 1) // BIN_SIZE_PX
grid_height = (config["height"] + BIN_SIZE_PX - 1) // BIN_SIZE_PX

heatmap = np.zeros((grid_height, grid_width), dtype=float)

for point in points:
    # TODO: Visualize clicks somehow, maybe just like motions but weighed crazily?
    if point.event_type == HeatmapEventType.LEFT_CLICK: continue

    x, y, = point.mouse_x, point.mouse_y
    assert x > 0
    assert y > 0
    assert x <= config["width"]
    assert y <= config["height"]

    # Apparently int division can push em outta bounds
    grid_x = min(x // BIN_SIZE_PX, grid_width - 1)
    grid_y = min(y // BIN_SIZE_PX, grid_height - 1)

    # TODO: Should this be weighted by dwell time? Currently we discard that...
    heatmap[grid_y, grid_x] += 1.0

if GAUSSIAN_SIGMA > 0:
    # Smoooooooth
    heatmap = gaussian_filter(heatmap, sigma=GAUSSIAN_SIGMA)

assert np.sum(heatmap) > 0, "Ok wheres all the data"

plt.figure(figsize=(10, 8 * (config["height"] / config["width"])))
plt.imshow(
    heatmap,
    cmap="afmhot",
    origin="upper",
    extent=[0, config["width"], config["height"], 0], # type: ignore
    aspect="auto"
)
plt.colorbar(label="Cursor Visits")
plt.title("Cursor Movement")

plt.xlabel("X")
plt.ylabel("y")
plt.xlim(0, config["width"])
plt.ylim(config["height"], 0)

plt.tight_layout()
plt.show()