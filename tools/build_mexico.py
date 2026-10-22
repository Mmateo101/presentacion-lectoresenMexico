"""Genera js/mexico.js (rutas SVG de los 32 estados, contorno y puntos de la multitud)
a partir de un GeoJSON de estados de México.  Uso: python3 tools/build_mexico.py estados.geojson"""
import json, math, sys
from shapely.geometry import shape, Point, mapping
from shapely.ops import unary_union

src = json.load(open(sys.argv[1]))
K = math.cos(math.radians(23))
LON0, LAT1 = -118.5, 32.8
W = 1000
SC = W / ((-86.6 - LON0) * K)

def proj(lon, lat):
    return ((lon - LON0) * K * SC, (LAT1 - lat) * SC)

def ring_d(coords):
    pts = [proj(*c) for c in coords]
    return "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + "Z"

def geom_d(g, tol):
    g = g.simplify(tol, preserve_topology=True)
    polys = [g] if g.geom_type == "Polygon" else list(g.geoms)
    out = []
    for p in polys:
        if p.area < 0.02:   # descarta islas diminutas
            continue
        out.append(ring_d(p.exterior.coords))
    return "".join(out)

CAPITALES = {  # capital / área urbana principal de cada estado (lon, lat)
 "MX-AGU": (-102.29, 21.88), "MX-BCN": (-115.45, 32.62), "MX-BCS": (-110.31, 24.14),
 "MX-CAM": (-90.53, 19.85), "MX-COA": (-101.00, 25.42), "MX-COL": (-103.72, 19.24),
 "MX-CHP": (-93.12, 16.75), "MX-CHH": (-106.07, 28.63), "MX-CMX": (-99.13, 19.43),
 "MX-DUR": (-104.66, 24.02), "MX-GUA": (-101.68, 21.12), "MX-GRO": (-99.50, 17.55),
 "MX-HID": (-98.73, 20.10), "MX-JAL": (-103.35, 20.67), "MX-MEX": (-99.66, 19.29),
 "MX-MIC": (-101.19, 19.70), "MX-MOR": (-99.23, 18.92), "MX-NAY": (-104.89, 21.50),
 "MX-NLE": (-100.31, 25.67), "MX-OAX": (-96.73, 17.06), "MX-PUE": (-98.21, 19.04),
 "MX-QUE": (-100.39, 20.59), "MX-ROO": (-88.30, 18.50), "MX-SLP": (-100.98, 22.15),
 "MX-SIN": (-107.39, 24.80), "MX-SON": (-110.96, 29.07), "MX-TAB": (-92.93, 17.99),
 "MX-TAM": (-99.14, 23.74), "MX-TLA": (-98.24, 19.32), "MX-VER": (-96.13, 19.18),
 "MX-YUC": (-89.62, 20.97), "MX-ZAC": (-102.58, 22.77),
}

states, geoms = [], []
for f in src["features"]:
    g = shape(f["geometry"])
    geoms.append(g)
    cx, cy = proj(*CAPITALES[f["properties"]["id"]])
    states.append({"id": f["properties"]["id"], "name": f["properties"]["name"],
                   "d": geom_d(g, 0.03), "city": [round(cx, 1), round(cy, 1)]})

union = unary_union([g.buffer(0.02) for g in geoms]).buffer(-0.02)
outline = geom_d(union, 0.05)

# puntos de la multitud: rejilla hexagonal dentro del contorno
minx, miny, maxx, maxy = union.bounds
crowd, step = [], 0.62
row = 0
lat = maxy
while lat > miny:
    off = (step / 2) if row % 2 else 0
    lon = minx + off
    while lon < maxx:
        if union.contains(Point(lon, lat)):
            x, y = proj(lon, lat)
            crowd.append([round(x, 1), round(y, 1)])
        lon += step / K
    lat -= step * 0.87
    row += 1

xs = [p[0] for s in states for p in [s["city"]]]
H = round((LAT1 - miny) * SC + 5)
out = {"width": W, "height": H, "states": states, "outline": outline, "crowd": crowd}
open("js/mexico.js", "w").write("/* Generado por tools/build_mexico.py — no editar a mano */\nwindow.MEXICO = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
print(len(crowd), "puntos;", H, "alto")
