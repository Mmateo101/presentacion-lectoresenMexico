/* Gráficas D3 (SVG) que replican las de R del equipo, con la paleta del libro.
   Cada función dibuja el estado final y devuelve { g, ..., play(tl, pos) } que anima la entrada. */
(function () {
  const { C } = L;
  const FONT = "Nunito, sans-serif";
  const T = (parent, x, y, txt, a = {}) => L.s("text", Object.assign({ x, y, "font-family": FONT, "font-size": 24, fill: C.ink }, a), parent, txt);
  const fmtTick = (v) => (Math.abs(v) < 1e-9 ? "0" : (+v.toFixed(3)).toString().replace("-", "−"));

  function plot(parent, { x, y, w, h, m = {} }) {
    const mm = Object.assign({ l: 90, r: 30, t: 50, b: 80 }, m);
    const g = L.s("g", { transform: `translate(${x + mm.l},${y + mm.t})` }, parent);
    return { g, iw: w - mm.l - mm.r, ih: h - mm.t - mm.b, m: mm };
  }

  /* Ejes dibujados a mano (línea + marcas + etiquetas) */
  function axis(g, scale, { orient = "bottom", at = 0, ticks, fmt = fmtTick, labels, title, titleOff = 62, size = 24, box = null } = {}) {
    const a = L.s("g", { class: "axis" }, g);
    const [r0, r1] = scale.range();
    const line = orient === "bottom"
      ? L.s("path", { d: `M${Math.min(r0, r1)},${at} H${Math.max(r0, r1)}`, stroke: C.ink, "stroke-width": 2.5, fill: "none" }, a)
      : L.s("path", { d: `M${at},${Math.max(r0, r1)} V${Math.min(r0, r1)}`, stroke: C.ink, "stroke-width": 2.5, fill: "none" }, a);
    const tks = [];
    const vals = labels ? labels.map((l) => l[0]) : (ticks || scale.ticks(5));
    vals.forEach((v, i) => {
      const p = scale(v) + (scale.bandwidth ? scale.bandwidth() / 2 : 0);
      const tg = L.s("g", {}, a);
      const txt = labels ? labels[i][1] : fmt(v);
      if (orient === "bottom") {
        L.s("line", { x1: p, x2: p, y1: at, y2: at + 9, stroke: C.ink, "stroke-width": 2.2 }, tg);
        T(tg, p, at + 38, txt, { "text-anchor": "middle", "font-size": size });
      } else {
        L.s("line", { x1: at, x2: at - 9, y1: p, y2: p, stroke: C.ink, "stroke-width": 2.2 }, tg);
        T(tg, at - 16, p + 8, txt, { "text-anchor": "end", "font-size": size });
      }
      tks.push(tg);
    });
    let tt = null;
    if (title) {
      if (orient === "bottom") tt = T(a, (r0 + r1) / 2, at + titleOff, title, { "text-anchor": "middle", "font-size": size + 2, fill: C.ink2 });
      else tt = T(a, 0, 0, title, { "text-anchor": "middle", "font-size": size + 2, fill: C.ink2, transform: `translate(${at - titleOff},${(r0 + r1) / 2}) rotate(-90)` });
    }
    return { g: a, line, tks, tt };
  }
  function axisIn(tl, ax, pos = ">", d = 0.7) {
    L.draw(tl, ax.line, pos, { duration: d, ease: "power2.inOut" });
    tl.fromTo(ax.tks, { autoAlpha: 0, y: ax.line.getAttribute("d").includes("V") ? 0 : -6 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: d / Math.max(ax.tks.length, 1) }, "<0.1");
    if (ax.tt) tl.fromTo(ax.tt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.2");
    return tl;
  }
  function chartTitle(g, iw, txt, size = 30) {
    return L.s("text", { x: iw / 2, y: -18, "text-anchor": "middle", "font-family": "Fraunces, serif", "font-weight": 600, "font-size": size, fill: C.ink }, g, txt);
  }
  function box(g, iw, ih) { // marco de la gráfica estilo R (base)
    return L.s("rect", { x: 0, y: 0, width: iw, height: ih, fill: "none", stroke: C.ink, "stroke-width": 2, opacity: 0.85 }, g);
  }

  const Charts = {
    plot, axis, axisIn, T,

    /* Barras verticales con % encima (estilo barplot de R) */
    vbars(parent, o) {
      const P = plot(parent, o);
      const { g, iw, ih } = P;
      const x = d3.scaleBand().domain(o.cats).range([0, iw]).padding(o.pad ?? 0.22);
      const y = d3.scaleLinear().domain([0, o.yMax]).range([ih, 0]);
      if (o.title) P.title = chartTitle(g, iw, o.title);
      P.ay = axis(g, y, { orient: "left", at: -14, ticks: o.yTicks || y.ticks(5), title: o.yTitle, titleOff: 70 });
      P.ax = axis(g, x, { orient: "bottom", at: ih, labels: o.cats.map((c, i) => [c, (o.catLabels || o.cats)[i]]), title: o.xTitle, titleOff: o.xTitleOff || 76, size: o.catSize || 24 });
      P.ax.tks.forEach((t) => t.querySelector("line").remove());
      P.bars = []; P.labels = [];
      o.values.forEach((v, i) => {
        const col = Array.isArray(o.color) ? o.color[i] : o.color;
        const b = L.s("rect", { x: x(o.cats[i]), y: y(v), width: x.bandwidth(), height: ih - y(v), fill: col, stroke: C.ink, "stroke-width": 2.2, rx: 3 }, g);
        const lab = T(g, x(o.cats[i]) + x.bandwidth() / 2, y(v) - 12, "", { "text-anchor": "middle", "font-weight": 700, "font-size": o.labelSize || 26 });
        L.s("tspan", { class: "num", "data-to": v, "data-fmt": o.labelFmt || "pctR" }, lab, L.fmt[o.labelFmt || "pctR"](v));
        P.bars.push(b); P.labels.push(lab);
      });
      P.x = x; P.y = y;
      P.play = (tl, pos = ">") => {
        if (P.title) tl.fromTo(P.title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, pos);
        axisIn(tl, P.ay, P.title ? "<" : pos);
        axisIn(tl, P.ax, "<");
        tl.fromTo(P.bars, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 1.0, ease: "power3.out", stagger: 0.12 }, ">-0.2");
        tl.fromTo(P.labels, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.12 }, "<0.4");
        P.labels.forEach((l, i) => L.counts(tl, l.querySelector(".num"), i ? "<" : "<", 1.0));
        return tl;
      };
      return P;
    },

    /* Intervalos horizontales por nivel (Bajo/Medio/Alto) con punto y % */
    intervals(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 120, r: 30, t: 60, b: 100 } }, o));
      const { g, iw, ih } = P;
      const x = d3.scaleLinear().domain(o.xDomain).range([0, iw]);
      const y = d3.scalePoint().domain(o.rows.map((r) => r.label)).range([ih - 70, 70]);
      box(g, iw, ih);
      if (o.title) P.title = chartTitle(g, iw, o.title, 32);
      P.ax = axis(g, x, { orient: "bottom", at: ih, ticks: o.xTicks, title: o.xTitle, titleOff: 72 });
      P.ay = axis(g, y, { orient: "left", at: 0, labels: o.rows.map((r) => [r.label, r.label]), size: 26 });
      P.rows = o.rows.map((r, i) => {
        const col = Array.isArray(o.color) ? o.color[i] : o.color;
        const rg = L.s("g", { transform: `translate(0,${y(r.label)})` }, g);
        const wash = L.s("rect", { x: x(r.li) - 10, y: -22, width: x(r.ls) - x(r.li) + 20, height: 44, rx: 22, fill: col, opacity: 0.18 }, rg);
        const armL = L.s("line", { x1: x(r.p), x2: x(r.li), y1: 0, y2: 0, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, rg);
        const armR = L.s("line", { x1: x(r.p), x2: x(r.ls), y1: 0, y2: 0, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, rg);
        const capL = L.s("line", { x1: x(r.li), x2: x(r.li), y1: -16, y2: 16, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, rg);
        const capR = L.s("line", { x1: x(r.ls), x2: x(r.ls), y1: -16, y2: 16, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, rg);
        const dot = L.s("circle", { cx: x(r.p), cy: 0, r: 11, fill: C.ink, stroke: "#fff", "stroke-width": 2.5 }, rg);
        const lab = T(rg, x(r.p), -30, "", { "text-anchor": "middle", "font-weight": 800, "font-size": 26, fill: o.labelColor || C.ink });
        L.s("tspan", { class: "num", "data-to": r.p * 100, "data-fmt": "pct1" }, lab, (r.p * 100).toFixed(1) + "%");
        return { rg, wash, armL, armR, capL, capR, dot, lab, x0: x(r.p) };
      });
      P.x = x; P.y = y;
      P.play = (tl, pos = ">") => {
        if (P.title) tl.fromTo(P.title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, pos);
        tl.fromTo(g.querySelector("rect"), { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.5 }, "<");
        axisIn(tl, P.ax, "<");
        axisIn(tl, P.ay, "<");
        // los puntos caen
        P.rows.forEach((r, i) => tl.fromTo(r.dot, { attr: { cy: -300 }, autoAlpha: 0 }, { attr: { cy: 0 }, autoAlpha: 1, duration: 0.7, ease: "bounce.out" }, i ? "<0.15" : ">"));
        // los brazos del intervalo se extienden desde la estimación
        P.rows.forEach((r, i) => {
          tl.fromTo(r.armL, { attr: { x2: r.x0 } }, { attr: { x2: +r.capL.getAttribute("x1") }, duration: 0.8, ease: "power2.out" }, i ? "<0.1" : ">");
          tl.fromTo(r.armR, { attr: { x2: r.x0 } }, { attr: { x2: +r.capR.getAttribute("x1") }, duration: 0.8, ease: "power2.out" }, "<");
          tl.fromTo([r.capL, r.capR], { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.25 }, ">-0.1");
          tl.fromTo(r.wash, { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.6 }, "<");
          tl.fromTo(r.lab, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
          L.counts(tl, r.lab.querySelector(".num"), "<", 0.8);
        });
        return tl;
      };
      return P;
    },

    /* Diferencias vs. valor frontera: banda gris ± frontera y punto observado */
    diffs(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 110, r: 40, t: 60, b: 90 } }, o));
      const { g, iw, ih } = P;
      const x = d3.scaleBand().domain(o.items.map((d) => d.comp)).range([0, iw]).padding(0.28);
      const y = d3.scaleLinear().domain(o.yDomain).range([ih, 0]);
      box(g, iw, ih);
      if (o.title) P.title = chartTitle(g, iw, o.title, 30);
      P.ay = axis(g, y, { orient: "left", at: 0, ticks: o.yTicks, title: o.yTitle, titleOff: 82 });
      P.ax = axis(g, x, { orient: "bottom", at: ih, labels: o.items.map((d) => [d.comp, d.comp]) });
      P.zero = L.s("line", { x1: 0, x2: iw, y1: y(0), y2: y(0), stroke: C.ink2, "stroke-width": 1.8 }, g);
      P.items = o.items.map((d) => {
        const cx = x(d.comp) + x.bandwidth() / 2;
        const ig = L.s("g", {}, g);
        const band = L.s("rect", { x: x(d.comp), y: y(d.frontera), width: x.bandwidth(), height: y(-d.frontera) - y(d.frontera), fill: C.band, stroke: "none" }, ig);
        const up = L.s("line", { x1: x(d.comp), x2: x(d.comp) + x.bandwidth(), y1: y(d.frontera), y2: y(d.frontera), stroke: C.crimson, "stroke-width": 3, "stroke-dasharray": "10 7" }, ig);
        const dn = L.s("line", { x1: x(d.comp), x2: x(d.comp) + x.bandwidth(), y1: y(-d.frontera), y2: y(-d.frontera), stroke: C.crimson, "stroke-width": 3, "stroke-dasharray": "10 7" }, ig);
        const lu = T(ig, x(d.comp) + x.bandwidth() + 8, y(d.frontera) + 2, "±" + d.frontera.toFixed(3), { "font-size": 20, fill: C.crimson, "font-weight": 700 });
        const dot = L.s("circle", { cx, cy: y(d.dif), r: 13, fill: C.ink, stroke: "#fff", "stroke-width": 2.5 }, ig);
        const lab = T(ig, cx - 24, y(d.dif) + 8, d.dif.toFixed(3), { "text-anchor": "end", "font-weight": 800, "font-size": 26 });
        return { band, up, dn, lu, dot, lab, cx, cy: y(d.dif), y0: y(0) };
      });
      P.x = x; P.y = y;
      P.bandsIn = (tl, pos = ">") => {
        if (P.title) tl.fromTo(P.title, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, pos);
        tl.fromTo(g.querySelector("rect"), { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.5 }, "<");
        axisIn(tl, P.ay, "<");
        axisIn(tl, P.ax, "<");
        tl.fromTo(P.zero, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
        P.items.forEach((it, i) => {
          tl.fromTo(it.band, { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, i ? "<0.1" : ">");
          tl.fromTo(it.up, { attr: { y1: it.y0, y2: it.y0 } }, { attr: { y1: +it.up.getAttribute("y1"), y2: +it.up.getAttribute("y1") }, duration: 0.6, ease: "power2.out" }, "<");
          tl.fromTo(it.dn, { attr: { y1: it.y0, y2: it.y0 } }, { attr: { y1: +it.dn.getAttribute("y1"), y2: +it.dn.getAttribute("y1") }, duration: 0.6, ease: "power2.out" }, "<");
          tl.fromTo(it.lu, { autoAlpha: 0, x: -10 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
        });
        return tl;
      };
      P.pointsIn = (tl, pos = ">") => {
        P.items.forEach((it, i) => {
          tl.fromTo(it.dot, { attr: { cy: it.y0 }, scale: 0.4, transformOrigin: "50% 50%" }, { attr: { cy: it.cy }, scale: 1, duration: 0.8, ease: "back.out(1.6)" }, i ? "<0.18" : pos);
          tl.fromTo(it.lab, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">-0.3");
        });
        return tl;
      };
      P.play = (tl, pos) => { P.bandsIn(tl, pos); P.pointsIn(tl, ">0.2"); return tl; };
      return P;
    },

    /* Barras con barras de error (IC 96 %) */
    barsCI(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 100, r: 30, t: 40, b: 110 } }, o));
      const { g, iw, ih } = P;
      const x = d3.scaleBand().domain(o.cats).range([0, iw]).padding(0.2);
      const y = d3.scaleLinear().domain([0, 1]).range([ih, 0]);
      P.ay = axis(g, y, { orient: "left", at: -14, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1], fmt: (v) => v.toFixed(1), title: o.yTitle, titleOff: 76 });
      P.ax = axis(g, x, { orient: "bottom", at: ih, labels: o.cats.map((c, i) => [c, o.catLabels ? o.catLabels[i] : c]), size: 26 });
      P.ax.tks.forEach((t) => t.querySelector("line").remove());
      const defs = L.s("defs", {}, g);
      P.bars = o.cats.map((c, i) => {
        const bx = x(c), bw = x.bandwidth(), p = o.p[i], [li, ls] = o.ci[i];
        const cp = L.s("clipPath", { id: o.id + "c" + i }, defs);
        const clipR = L.s("rect", { x: bx, y: y(p), width: bw, height: ih - y(p) }, cp);
        const bg = L.s("g", { "clip-path": `url(#${o.id}c${i})` }, g);
        const fill = L.s("rect", { x: bx - 20, y: y(p) - 30, width: bw + 40, height: ih - y(p) + 30, fill: o.colors[i] }, bg);
        const wave = L.s("path", { d: `M${bx - 20},${y(p)} q${bw / 8},-14 ${bw / 4},0 t${bw / 4},0 t${bw / 4},0 t${bw / 4},0 t${bw / 4},0 V${y(p) + 40} H${bx - 20} Z`, fill: o.colors[i] }, bg);
        const outline = L.s("rect", { x: bx, y: y(p), width: bw, height: ih - y(p), fill: "none", stroke: C.ink, "stroke-width": 2.4 }, g);
        const cx = bx + bw / 2;
        const err = L.s("g", { stroke: C.ink, "stroke-width": 4, "stroke-linecap": "round" }, g);
        const vl = L.s("line", { x1: cx, x2: cx, y1: y(li), y2: y(ls) }, err);
        const c1 = L.s("line", { x1: cx - 26, x2: cx + 26, y1: y(li), y2: y(li) }, err);
        const c2 = L.s("line", { x1: cx - 26, x2: cx + 26, y1: y(ls), y2: y(ls) }, err);
        return { bx, bw, p, fill, wave, outline, err, vl, c1, c2, cx, yp: y(p), y0: ih, yli: y(li), yls: y(ls) };
      });
      P.x = x; P.y = y;
      P.play = (tl, pos = ">") => {
        axisIn(tl, P.ay, pos);
        axisIn(tl, P.ax, "<");
        P.bars.forEach((b, i) => {
          const dy = b.y0 - b.yp + 30;
          tl.fromTo([b.fill, b.wave], { y: dy }, { y: 0, duration: 1.8, ease: "power2.out" }, i ? "<0.3" : ">");
          tl.fromTo(b.wave, { x: -b.bw / 2 }, { x: 0, duration: 1.8, ease: "none" }, "<");
          tl.fromTo(b.outline, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, "<1.2");
        });
        P.bars.forEach((b, i) => {
          tl.fromTo(b.vl, { attr: { y1: b.yp, y2: b.yp } }, { attr: { y1: b.yli, y2: b.yls }, duration: 0.6, ease: "power2.out" }, i ? "<" : ">");
          tl.fromTo([b.c1, b.c2], { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.3 }, ">-0.1");
        });
        return tl;
      };
      return P;
    },

    /* Intervalo horizontal único (estilo R: eje, marco, línea de referencia opcional) */
    hinterval(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 70, r: 40, t: 30, b: 100 } }, o));
      const { g, iw, ih } = P;
      const x = d3.scaleLinear().domain(o.xDomain).range([0, iw]);
      const cy = ih / 2;
      P.frame = box(g, iw, ih);
      P.axG = L.s("g", {}, g);
      P.ax = axis(P.axG, x, { orient: "bottom", at: ih, ticks: o.xTicks, title: o.xTitle, titleOff: 74, fmt: o.fmt || fmtTick });
      if (o.yLabel) P.yl = T(g, 0, 0, o.yLabel, { "text-anchor": "middle", "font-size": 24, fill: C.ink2, transform: `translate(-30,${cy}) rotate(-90)` });
      const col = o.color || C.ink;
      P.zero = o.zero != null ? L.s("line", { x1: x(o.zero), x2: x(o.zero), y1: 0, y2: ih, stroke: C.ink2, "stroke-width": 2.5, "stroke-dasharray": "6 6" }, g) : null;
      P.ref = o.ref != null ? L.s("line", { x1: x(o.ref), x2: x(o.ref), y1: 0, y2: ih, stroke: o.refColor || C.crimson, "stroke-width": 3.5 }, g) : null;
      const mid = o.point != null ? o.point : (o.li + o.ls) / 2;
      P.wash = L.s("rect", { x: x(o.li) - 12, y: cy - 24, width: x(o.ls) - x(o.li) + 24, height: 48, rx: 24, fill: o.wash || C.plumL, opacity: 0.45 }, g);
      P.arm = L.s("line", { x1: x(o.li), x2: x(o.ls), y1: cy, y2: cy, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, g);
      P.c1 = L.s("line", { x1: x(o.li), x2: x(o.li), y1: cy - 18, y2: cy + 18, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, g);
      P.c2 = L.s("line", { x1: x(o.ls), x2: x(o.ls), y1: cy - 18, y2: cy + 18, stroke: col, "stroke-width": 5, "stroke-linecap": "round" }, g);
      P.dot = o.point != null ? L.s("circle", { cx: x(o.point), cy, r: 11, fill: C.ink, stroke: "#fff", "stroke-width": 2.5 }, g) : null;
      P.lLab = T(g, x(o.li), cy + 52, o.liLabel || "", { "text-anchor": "middle", "font-weight": 700, "font-size": 24, fill: col });
      P.rLab = T(g, x(o.ls), cy + 52, o.lsLabel || "", { "text-anchor": "middle", "font-weight": 700, "font-size": 24, fill: col });
      P.x = x; P.cy = cy; P.mid = x(mid);
      P.play = (tl, pos = ">") => {
        tl.fromTo(P.frame, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.4 }, pos);
        axisIn(tl, P.ax, "<");
        if (P.yl) tl.fromTo(P.yl, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
        if (P.zero) tl.fromTo(P.zero, { autoAlpha: 0, attr: { y2: 0 } }, { autoAlpha: 1, attr: { y2: ih }, duration: 0.6 }, ">-0.2");
        if (P.ref) tl.fromTo(P.ref, { x: -iw * 0.3, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, ">-0.1");
        if (P.dot) tl.fromTo(P.dot, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, ">");
        tl.fromTo(P.arm, { attr: { x1: P.mid, x2: P.mid } }, { attr: { x1: +P.c1.getAttribute("x1"), x2: +P.c2.getAttribute("x1") }, duration: 0.9, ease: "power2.out" }, ">");
        tl.fromTo([P.c1, P.c2], { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scaleY: 1, duration: 0.3 }, ">-0.15");
        tl.fromTo(P.wash, { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.7 }, "<-0.3");
        tl.fromTo([P.lLab, P.rLab], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.2");
        if (P.dot) tl.to(P.dot, { autoAlpha: 1 }, "<");
        return tl;
      };
      return P;
    },

    /* Diagramas de caja horizontales con la media como rombo */
    boxplots(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 170, r: 40, t: 30, b: 100 } }, o));
      const { g, iw, ih } = P;
      const x = d3.scaleLinear().domain(o.xDomain).range([0, iw]);
      const y = d3.scaleBand().domain(o.rows.map((r) => r.cat)).range([ih, 0]).padding(0.3);
      P.frame = box(g, iw, ih);
      P.ax = axis(g, x, { orient: "bottom", at: ih, ticks: o.xTicks, title: o.xTitle, titleOff: 74 });
      P.ay = axis(g, y, { orient: "left", at: 0, labels: o.rows.map((r) => [r.cat, r.cat]), size: 24 });
      P.rows = o.rows.map((r, i) => {
        const yc = y(r.cat) + y.bandwidth() / 2, bh = y.bandwidth();
        const col = Array.isArray(o.color) ? o.color[i] : o.color;
        const rg = L.s("g", {}, g);
        const iqr = r.q3 - r.q1;
        const lo = Math.max(1, r.q1 - 1.5 * iqr), hi = Math.floor(r.q3 + 1.5 * iqr);
        const wL = L.s("line", { x1: x(lo), x2: x(r.q1), y1: yc, y2: yc, stroke: C.ink, "stroke-width": 2.4, "stroke-dasharray": "6 5" }, rg);
        const wR = L.s("line", { x1: x(r.q3), x2: x(hi), y1: yc, y2: yc, stroke: C.ink, "stroke-width": 2.4, "stroke-dasharray": "6 5" }, rg);
        const cL = L.s("line", { x1: x(lo), x2: x(lo), y1: yc - bh * 0.25, y2: yc + bh * 0.25, stroke: C.ink, "stroke-width": 2.4 }, rg);
        const cR = L.s("line", { x1: x(hi), x2: x(hi), y1: yc - bh * 0.25, y2: yc + bh * 0.25, stroke: C.ink, "stroke-width": 2.4 }, rg);
        const bx = L.s("rect", { x: x(r.q1), y: yc - bh / 2, width: x(r.q3) - x(r.q1), height: bh, fill: col, stroke: C.ink, "stroke-width": 2.4 }, rg);
        const med = L.s("line", { x1: x(r.mediana), x2: x(r.mediana), y1: yc - bh / 2, y2: yc + bh / 2, stroke: C.ink, "stroke-width": 5 }, rg);
        const dia = L.s("path", { d: `M${x(r.media)},${yc - 13} l11,13 l-11,13 l-11,-13 Z`, fill: C.ink, stroke: "#fff", "stroke-width": 1.5 }, rg);
        return { rg, wL, wR, cL, cR, bx, med, dia, xm: x(r.mediana), r };
      });
      P.x = x; P.y = y;
      P.frameIn = (tl, pos = ">") => {
        tl.fromTo(P.frame, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.4 }, pos);
        axisIn(tl, P.ax, "<");
        axisIn(tl, P.ay, "<");
        return tl;
      };
      P.rowIn = (tl, i, pos = ">") => {
        const rw = P.rows[i];
        tl.fromTo(rw.med, { scaleY: 0, transformOrigin: "50% 50%" }, { scaleY: 1, duration: 0.3 }, pos);
        tl.fromTo(rw.bx, { attr: { x: rw.xm, width: 0 } }, { attr: { x: +rw.bx.getAttribute("x"), width: +rw.bx.getAttribute("width") }, duration: 0.7, ease: "power2.out" }, ">");
        tl.fromTo(rw.wL, { attr: { x1: +rw.wL.getAttribute("x2") } }, { attr: { x1: +rw.wL.getAttribute("x1") }, duration: 0.5 }, ">-0.2");
        tl.fromTo(rw.wR, { attr: { x2: +rw.wR.getAttribute("x1") } }, { attr: { x2: +rw.wR.getAttribute("x2") }, duration: 0.5 }, "<");
        tl.fromTo([rw.cL, rw.cR], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, ">");
        tl.fromTo(rw.dia, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, "<");
        return tl;
      };
      return P;
    },

    /* Barras agrupadas (3 por categoría) con leyenda */
    grouped(parent, o) {
      const P = plot(parent, Object.assign({ m: { l: 100, r: 300, t: 40, b: 110 } }, o));
      const { g, iw, ih } = P;
      const x0 = d3.scaleBand().domain(o.cats).range([0, iw]).padding(0.18);
      const x1 = d3.scaleBand().domain([0, 1, 2]).range([0, x0.bandwidth()]).padding(0.06);
      const y = d3.scaleLinear().domain([0, o.yMax]).range([ih, 0]);
      P.ay = axis(g, y, { orient: "left", at: -14, ticks: o.yTicks, title: o.yTitle, titleOff: 70 });
      P.ax = axis(g, x0, { orient: "bottom", at: ih, labels: o.cats.map((c) => [c, c]), title: o.xTitle, titleOff: 80, size: 25 });
      P.ax.tks.forEach((t) => t.querySelector("line").remove());
      P.groups = o.rows.map((row) => {
        const gg = L.s("g", { transform: `translate(${x0(row.nivel)},0)` }, g);
        const bars = row.v.map((v, j) => L.s("rect", { x: x1(j), y: y(v), width: x1.bandwidth(), height: ih - y(v), fill: o.colors[j], stroke: C.ink, "stroke-width": 2, rx: 2 }, gg));
        const labs = row.v.map((v, j) => {
          const t = T(gg, x1(j) + x1.bandwidth() / 2, y(v) - 10, "", { "text-anchor": "middle", "font-size": 22, "font-weight": 700 });
          L.s("tspan", { class: "num", "data-to": v, "data-fmt": "d1" }, t, v.toFixed(1));
          return t;
        });
        return { gg, bars, labs };
      });
      // leyenda
      const lg = L.s("g", { transform: `translate(${iw + 40},${20})` }, g);
      T(lg, 0, 0, o.legendTitle, { "font-weight": 700, "font-size": 24 });
      o.legend.forEach((t, j) => {
        L.s("rect", { x: 0, y: 22 + j * 44, width: 30, height: 30, rx: 4, fill: o.colors[j], stroke: C.ink, "stroke-width": 2 }, lg);
        T(lg, 44, 46 + j * 44, t, { "font-size": 24 });
      });
      P.legend = lg;
      P.play = (tl, pos = ">") => {
        axisIn(tl, P.ay, pos);
        axisIn(tl, P.ax, "<");
        tl.fromTo(P.legend, { autoAlpha: 0, x: "+=20" }, { autoAlpha: 1, x: "-=20", duration: 0.5 }, "<");
        P.groups.forEach((gr, i) => {
          tl.fromTo(gr.bars, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.8, ease: "power3.out", stagger: 0.1 }, i ? "<0.25" : ">");
          tl.fromTo(gr.labs, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.1 }, "<0.4");
          gr.labs.forEach((l) => L.counts(tl, l.querySelector(".num"), "<", 0.8));
        });
        return tl;
      };
      return P;
    },
  };

  window.Charts = Charts;
})();
