/* Personajes y utilería dibujados en SVG (estilo libro ilustrado: tinta + acuarela). */
(function () {
  const { C } = L;
  const OUT = { stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round", "stroke-linecap": "round" };
  const o = (extra) => Object.assign({}, OUT, extra);

  const HAIR = {
    hector: "#3A2E2A", eduardo: "#7A4A26", mom: "#5B3A2A", dad: "#2E2622", teacher: "#4A3B5C",
    kid1: "#2E2622", kid2: "#9A5B2E", kid3: "#C9A26B", kid4: "#3A2E2A",
  };

  /* Persona: origen en los pies. opts: who, age ('child'|'adult'), shirt, pants, hair, style, pose, dress */
  function person(parent, opts = {}) {
    const age = opts.age || "child";
    const P = age === "child"
      ? { legH: 74, torsoH: 70, headR: 37, sw: 27, hw: 21, armL: 62, legW: 12 }
      : { legH: 128, torsoH: 112, headR: 31, sw: 35, hw: 27, armL: 100, legW: 15 };
    const shirt = opts.shirt || C.blueM;
    const pants = opts.pants || "#5E6B7D";
    const hairC = opts.hair || HAIR[opts.who] || "#3A2E2A";
    const style = opts.style || "short";
    const pose = opts.pose || "stand";
    const skin = opts.skin || C.skin;

    const g = L.s("g", { class: "person" }, parent);
    const body = L.s("g", {}, g); // se balancea al caminar
    const hipY = -P.legH, shY = hipY - P.torsoH, headY = shY - P.headR * 0.95;

    // Piernas
    const legs = [];
    [-1, 1].forEach((sgn) => {
      const lg = L.s("g", { class: "leg" }, body);
      const x = sgn * (P.hw * 0.5);
      if (pose === "sit") {
        const knX = x * 0.4 + P.legH * 0.62, knY = hipY + 6;
        const d = `M${x},${hipY} L${knX},${knY} L${knX + 2},${-4}`;
        L.s("path", o({ d, fill: "none", stroke: C.ink, "stroke-width": P.legW * 1.6 + 6 }), lg);
        L.s("path", { d, fill: "none", stroke: pants, "stroke-width": P.legW * 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, lg);
        L.s("ellipse", o({ cx: knX + 10, cy: -3, rx: P.legW * 1.15, ry: P.legW * 0.6, fill: C.ink }), lg);
      } else if (opts.dress) {
        L.s("rect", o({ x: x - P.legW * 0.4, y: hipY + 20, width: P.legW * 0.8, height: P.legH - 22, fill: skin }), lg);
        L.s("ellipse", o({ cx: x + sgn * 3, cy: -3, rx: P.legW * 0.95, ry: P.legW * 0.55, fill: C.ink }), lg);
      } else {
        L.s("rect", o({ x: x - P.legW * 0.6, y: hipY - 4, width: P.legW * 1.2, height: P.legH, rx: P.legW * 0.5, fill: pants }), lg);
        L.s("ellipse", o({ cx: x + sgn * 4, cy: -3, rx: P.legW * 1.05, ry: P.legW * 0.6, fill: C.ink }), lg);
      }
      legs.push(lg);
    });

    // Torso (camisa o vestido)
    const torso = opts.dress
      ? `M${-P.sw * 0.8},${shY + 6} Q0,${shY - 6} ${P.sw * 0.8},${shY + 6} L${P.hw * 1.7},${hipY + 26} Q0,${hipY + 36} ${-P.hw * 1.7},${hipY + 26} Z`
      : `M${-P.sw * 0.8},${shY + 6} Q0,${shY - 6} ${P.sw * 0.8},${shY + 6} L${P.hw},${hipY + 4} Q0,${hipY + 10} ${-P.hw},${hipY + 4} Z`;
    L.s("path", o({ d: torso, fill: shirt }), body);
    if (opts.collar !== false) L.s("path", o({ d: `M${-8},${shY + 1} L0,${shY + 12} L8,${shY + 1}`, fill: "none", "stroke-width": 2 }), body);

    // Brazos (pivote en el hombro)
    const arms = [];
    [-1, 1].forEach((sgn) => {
      const ag = L.s("g", { class: "arm" }, body);
      const x = sgn * P.sw * 0.78;
      L.s("path", o({ d: `M${x},${shY + 8} L${x + sgn * 6},${shY + 8 + P.armL}`, fill: "none", stroke: C.ink, "stroke-width": 15 }), ag);
      L.s("path", { d: `M${x},${shY + 8} L${x + sgn * 6},${shY + 8 + P.armL}`, fill: "none", stroke: shirt, "stroke-width": 10, "stroke-linecap": "round" }, ag);
      L.s("circle", o({ cx: x + sgn * 6, cy: shY + 12 + P.armL, r: 7.5, fill: skin, "stroke-width": 2.5 }), ag);
      ag._pivot = [x, shY + 8];
      arms.push(ag);
    });

    // Cabeza
    const head = L.s("g", { class: "head" }, body);
    L.s("rect", o({ x: -6, y: shY - 12, width: 12, height: 16, fill: skin, "stroke-width": 2.5 }), head);
    // pelo de atrás
    if (style === "bun") L.s("circle", o({ cx: 0, cy: headY - P.headR * 0.95, r: P.headR * 0.42, fill: hairC }), head);
    if (style === "long") L.s("path", o({ d: `M${-P.headR * 1.05},${headY} Q${-P.headR * 1.2},${headY + P.headR * 1.5} ${-P.headR * 0.5},${headY + P.headR * 1.4} L${P.headR * 0.5},${headY + P.headR * 1.4} Q${P.headR * 1.2},${headY + P.headR * 1.5} ${P.headR * 1.05},${headY} Z`, fill: hairC }), head);
    L.s("circle", o({ cx: 0, cy: headY, r: P.headR, fill: skin }), head);
    // pelo
    const R = P.headR;
    if (style === "curly") {
      const hg = L.s("g", {}, head);
      for (let i = 0; i < 7; i++) {
        const a = Math.PI * (1.05 + i * 0.15);
        L.s("circle", o({ cx: Math.cos(a) * R * 0.86, cy: headY + Math.sin(a) * R * 0.86 - 2, r: R * 0.33, fill: hairC, "stroke-width": 2.2 }), hg);
      }
    } else if (style === "bald") {
      L.s("path", o({ d: `M${-R},${headY - 2} Q${-R * 0.95},${headY - R * 0.7} ${-R * 0.55},${headY - R * 0.62} M${R},${headY - 2} Q${R * 0.95},${headY - R * 0.7} ${R * 0.55},${headY - R * 0.62}`, fill: "none", stroke: hairC, "stroke-width": 5 }), head);
    } else {
      L.s("path", o({ d: `M${-R * 1.02},${headY + 2} Q${-R * 1.1},${headY - R * 1.15} 0,${headY - R * 1.08} Q${R * 1.1},${headY - R * 1.15} ${R * 1.02},${headY + 2} Q${R * 0.7},${headY - R * 0.45} ${R * 0.1},${headY - R * 0.5} Q${-R * 0.3},${headY - R * 0.25} ${-R * 0.75},${headY - R * 0.45} Q${-R * 0.95},${headY - R * 0.2} ${-R * 1.02},${headY + 2} Z`, fill: hairC }), head);
    }
    // cara
    const eyes = L.s("g", {}, head);
    L.s("circle", { cx: -R * 0.33, cy: headY + R * 0.05, r: R * 0.085, fill: C.ink }, eyes);
    L.s("circle", { cx: R * 0.33, cy: headY + R * 0.05, r: R * 0.085, fill: C.ink }, eyes);
    const closedEyes = L.s("path", { d: `M${-R * 0.45},${headY + R * 0.06} q${R * 0.12},${R * 0.1} ${R * 0.24},0 M${R * 0.21},${headY + R * 0.06} q${R * 0.12},${R * 0.1} ${R * 0.24},0`, fill: "none", stroke: C.ink, "stroke-width": 2.4, "stroke-linecap": "round", opacity: 0 }, head);
    L.s("circle", { cx: -R * 0.55, cy: headY + R * 0.38, r: R * 0.16, fill: "#E89A8E", opacity: 0.45 }, head);
    L.s("circle", { cx: R * 0.55, cy: headY + R * 0.38, r: R * 0.16, fill: "#E89A8E", opacity: 0.45 }, head);
    if (opts.mustache) L.s("path", o({ d: `M${-R * 0.35},${headY + R * 0.42} Q0,${headY + R * 0.25} ${R * 0.35},${headY + R * 0.42} Q0,${headY + R * 0.36} ${-R * 0.35},${headY + R * 0.42}`, fill: hairC, "stroke-width": 2 }), head);
    if (opts.glasses) {
      L.s("circle", o({ cx: -R * 0.33, cy: headY + R * 0.05, r: R * 0.24, fill: "none", "stroke-width": 2.2 }), head);
      L.s("circle", o({ cx: R * 0.33, cy: headY + R * 0.05, r: R * 0.24, fill: "none", "stroke-width": 2.2 }), head);
      L.s("line", o({ x1: -R * 0.09, x2: R * 0.09, y1: headY + R * 0.05, y2: headY + R * 0.05, "stroke-width": 2.2 }), head);
    }
    const my = headY + R * 0.5;
    const mouths = {
      smile: L.s("path", { d: `M${-R * 0.28},${my - 3} Q0,${my + R * 0.32} ${R * 0.28},${my - 3}`, fill: "none", stroke: C.ink, "stroke-width": 2.6, "stroke-linecap": "round" }, head),
      big: L.s("path", { d: `M${-R * 0.32},${my - 5} Q0,${my + R * 0.5} ${R * 0.32},${my - 5} Z`, fill: "#9C3B3B", stroke: C.ink, "stroke-width": 2.4, "stroke-linejoin": "round" }, head),
      flat: L.s("path", { d: `M${-R * 0.2},${my + 2} L${R * 0.2},${my + 2}`, fill: "none", stroke: C.ink, "stroke-width": 2.6, "stroke-linecap": "round" }, head),
      sad: L.s("path", { d: `M${-R * 0.24},${my + 6} Q0,${my - R * 0.18} ${R * 0.24},${my + 6}`, fill: "none", stroke: C.ink, "stroke-width": 2.6, "stroke-linecap": "round" }, head),
      o: L.s("ellipse", { cx: 0, cy: my + 2, rx: R * 0.12, ry: R * 0.16, fill: "#9C3B3B", stroke: C.ink, "stroke-width": 2.2 }, head),
    };
    const mood = opts.mood || "smile";
    Object.entries(mouths).forEach(([k, m]) => m.setAttribute("opacity", k === mood ? 1 : 0));

    const p = { g, body, head, arms, legs, eyes, closedEyes, mouths, P, headY, shY, hipY };
    // origen de transformación en los pies (centro inferior de la caja): escalar o voltear no los mueve
    gsap.set(g, { x: opts.x || 0, y: opts.y || 0, scale: opts.s || 1, transformOrigin: "50% 100%" });
    return p;
  }

  /* Cambia la expresión dentro de una línea de tiempo */
  function mood(tl, p, m, pos = ">") {
    Object.entries(p.mouths).forEach(([k, el]) => {
      tl.to(el, { opacity: k === m ? 1 : 0, duration: 0.2 }, pos);
      pos = "<";
    });
    return tl;
  }

  /* Rota un brazo (grados) desde el hombro */
  function arm(tl, p, i, deg, pos = ">", dur = 0.5) {
    const [x, y] = p.arms[i]._pivot;
    return tl.to(p.arms[i], { rotation: deg, svgOrigin: `${x} ${y}`, duration: dur, ease: "power2.inOut" }, pos);
  }

  /* Caminar de x0 a x1 */
  function walk(tl, p, x0, x1, { dur = 2, pos = ">", y, ir = true } = {}) {
    const steps = Math.max(2, Math.round(dur / 0.32));
    const facing = x1 >= x0 ? 1 : -1;
    const sc = gsap.getProperty(p.g, "scaleY") || 1;
    tl.fromTo(p.g, { x: x0, scaleX: sc * facing }, { x: x1, scaleX: sc * facing, duration: dur, ease: "none", immediateRender: ir }, pos);
    if (y != null) tl.set(p.g, { y }, "<");
    const hip = p.hipY;
    p.legs.forEach((lg, i) => {
      tl.fromTo(lg, { rotation: i ? -18 : 18, svgOrigin: `0 ${hip}` },
        { rotation: i ? 18 : -18, svgOrigin: `0 ${hip}`, duration: dur / steps, ease: "sine.inOut", repeat: steps - 1, yoyo: true, immediateRender: false }, "<");
    });
    p.arms.forEach((ag, i) => {
      const [x, yy] = ag._pivot;
      tl.fromTo(ag, { rotation: i ? 14 : -14, svgOrigin: `${x} ${yy}` },
        { rotation: i ? -14 : 14, svgOrigin: `${x} ${yy}`, duration: dur / steps, ease: "sine.inOut", repeat: steps - 1, yoyo: true, immediateRender: false }, "<");
    });
    tl.fromTo(p.body, { y: 0 }, { y: -4, duration: dur / steps / 2, ease: "sine.inOut", repeat: steps * 2 - 1, yoyo: true, immediateRender: false }, "<");
    // termina de pie
    tl.to([...p.legs, ...p.arms], { rotation: 0, duration: 0.25 }, ">");
    tl.to(p.body, { y: 0, duration: 0.25 }, "<");
    return tl;
  }

  /* ---------------- Utilería ---------------- */
  const Props = {
    shelf(parent, { x, y, w = 180, h = 220, rows = 3, books = 0, seed = 3, colors } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: 0, width: w, height: h, fill: "#E8D2B0", rx: 4 }), g);
      const r = L.rng(seed);
      const pal = colors || [C.blueM, C.amberM, C.plum, C.blueL, C.amberL, "#9DBF9A", C.crimson, C.amberD, C.blueD];
      const bookEls = [];
      for (let i = 1; i <= rows; i++) {
        const sy = (h / rows) * i;
        L.s("line", o({ x1: 0, x2: w, y1: sy - 4, y2: sy - 4, "stroke-width": 4 }), g);
        let bx = 10;
        const shelfTop = sy - h / rows + 10;
        while (books && bx < w - 18) {
          const bw = 11 + r() * 9, bh = (h / rows) * (0.55 + r() * 0.3);
          const b = L.s("rect", o({ x: bx, y: sy - 6 - bh, width: bw, height: bh, fill: pal[Math.floor(r() * pal.length)], "stroke-width": 2, rx: 1.5 }), g);
          bookEls.push(b);
          bx += bw + 1.5;
          if (r() > books) bx += 14 + r() * 20; // huecos según densidad
        }
        if (!books && i === 1) { // telaraña en el estante vacío
          L.s("path", { d: `M${w - 4},${shelfTop - 6} q-24,4 -30,30 M${w - 4},${shelfTop + 8} q-16,0 -26,16 M${w - 22},${shelfTop - 4} l0,30`, fill: "none", stroke: C.ink2, "stroke-width": 1.2, opacity: 0.7 }, g);
        }
      }
      g._books = bookEls;
      return g;
    },
    window(parent, { x, y, w = 120, h = 110, night = false } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: 0, width: w, height: h, fill: night ? "#5D6E96" : "#DCEBF5", rx: 4 }), g);
      if (night) {
        L.s("circle", { cx: w * 0.68, cy: h * 0.32, r: 14, fill: "#FFF3C4" }, g);
        L.s("circle", { cx: w * 0.74, cy: h * 0.27, r: 12, fill: "#5D6E96" }, g);
        [[0.2, 0.25], [0.35, 0.6], [0.8, 0.7]].forEach(([a, b]) => L.s("circle", { cx: w * a, cy: h * b, r: 2.4, fill: "#FFF3C4" }, g));
      }
      L.s("line", o({ x1: w / 2, x2: w / 2, y1: 0, y2: h, "stroke-width": 2.5 }), g);
      L.s("line", o({ x1: 0, x2: w, y1: h / 2, y2: h / 2, "stroke-width": 2.5 }), g);
      return g;
    },
    door(parent, { x, y, w = 90, h = 170 } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: 0, width: w, height: h, fill: "#C99A6B", rx: 4 }), g);
      L.s("circle", { cx: w - 16, cy: h * 0.55, r: 5, fill: C.ink }, g);
      return g;
    },
    sofa(parent, { x, y, w = 220, color = "#B9B4AA" } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: -80, width: w, height: 50, rx: 14, fill: color }), g);
      L.s("rect", o({ x: -10, y: -40, width: w + 20, height: 34, rx: 10, fill: color }), g);
      L.s("rect", o({ x: -22, y: -64, width: 28, height: 58, rx: 10, fill: color }), g);
      L.s("rect", o({ x: w - 6, y: -64, width: 28, height: 58, rx: 10, fill: color }), g);
      return g;
    },
    blackboard(parent, { x, y, w = 260, h = 130 } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: 0, width: w, height: h, fill: "#4E6B5C", rx: 4, "stroke-width": 5, stroke: "#8A6A48" }), g);
      const r = L.rng(x + y);
      for (let i = 0; i < 4; i++) // garabatos de gis
        L.s("path", { d: L.roughLine(20, 28 + i * 26, 40 + r() * (w - 80), 28 + i * 26, r, 6, 8), fill: "none", stroke: "#F4F1E6", "stroke-width": 3, opacity: 0.7, "stroke-linecap": "round" }, g);
      return g;
    },
    desk(parent, { x, y, w = 110, book = null, open = false } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: -w / 2, y: -58, width: w, height: 12, fill: "#C99A6B", rx: 3 }), g);
      L.s("line", o({ x1: -w / 2 + 10, x2: -w / 2 + 10, y1: -46, y2: 0 }), g);
      L.s("line", o({ x1: w / 2 - 10, x2: w / 2 - 10, y1: -46, y2: 0 }), g);
      if (book) L.book(g, { x: -22, y: open ? -84 : -72, w: 44, h: open ? 26 : 14, color: book, open });
      return g;
    },
    bed(parent, { x, y, w = 260 } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: -110, width: 22, height: 110, rx: 6, fill: "#C99A6B" }), g);
      L.s("rect", o({ x: w - 18, y: -78, width: 18, height: 78, rx: 6, fill: "#C99A6B" }), g);
      L.s("rect", o({ x: 10, y: -58, width: w - 20, height: 34, rx: 8, fill: "#FFFDF8" }), g);
      return g;
    },
    lamp(parent, { x, y } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      const glow = L.s("circle", { cx: 0, cy: -96, r: 90, fill: "#FFE7A8", opacity: 0.5, filter: "url(#wc2)" }, g);
      L.s("line", o({ x1: 0, x2: 0, y1: -90, y2: 0 }), g);
      L.s("path", o({ d: "M-30,-90 L-18,-128 L18,-128 L30,-90 Z", fill: "#F6D3A8" }), g);
      L.s("rect", o({ x: -20, y: -6, width: 40, height: 6, fill: C.ink }), g);
      g._glow = glow;
      return g;
    },
    store(parent, { x, y, w = 300, h = 240 } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("rect", o({ x: 0, y: -h, width: w, height: h, fill: "#F0E2CC", rx: 4 }), g);
      const stripes = L.s("g", {}, g);
      for (let i = 0; i < 6; i++)
        L.s("path", o({ d: `M${i * w / 6},${-h + 6} h${w / 6} v34 q${-w / 12},16 ${-w / 6},0 Z`, fill: i % 2 ? "#FFFDF8" : C.amberM, "stroke-width": 2.5 }), stripes);
      L.s("rect", o({ x: 20, y: -h + 70, width: w * 0.55, height: h * 0.5, fill: "#DCEBF5" }), g);
      Props.shelf(g, { x: 30, y: -h + 80, w: w * 0.55 - 20, h: h * 0.42, rows: 2, books: 0.95, seed: 21 });
      Props.door(g, { x: w - 92, y: -150, w: 70, h: 150 });
      return g;
    },
    chair(parent, { x, y } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      L.s("path", o({ d: "M-40,-74 L-40,-160 M-40,-74 L40,-74 M-34,-74 L-34,0 M34,-74 L34,0", fill: "none", stroke: "#8A6A48", "stroke-width": 7 }), g);
      L.s("path", o({ d: "M-44,-80 L44,-80", fill: "none", "stroke-width": 3 }), g);
      return g;
    },
    /* Gran signo de interrogación dibujado a mano */
    question(parent, { x, y, size = 120, color = C.ink } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      const s = size / 120;
      const p = L.s("path", { d: `M${-30 * s},${-40 * s} C${-30 * s},${-90 * s} ${40 * s},${-95 * s} ${38 * s},${-45 * s} C${36 * s},${-10 * s} ${0},${-8 * s} ${0},${22 * s}`, fill: "none", stroke: color, "stroke-width": 9 * s, "stroke-linecap": "round" }, g);
      const dot = L.s("circle", { cx: 0, cy: 52 * s, r: 7 * s, fill: color }, g);
      g._p = p; g._dot = dot;
      return g;
    },
  };

  window.Chars = { person, mood, arm, walk, Props, HAIR };
})();
