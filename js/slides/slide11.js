/* Diapositiva 11 · Homogeneidad: ¿el hogar y la escuela van de la mano? (ji-cuadrada de independencia) */
(function () {
  const { C } = L;
  const D = window.DATA;

  /* Densidad de ln(x) para χ² con k gl: x·f(x) (igual que la gráfica de R en escala log) */
  function chiLogDensity(x, k) {
    const h = k / 2;
    let lg = 0; for (let i = 2; i < h; i++) lg += Math.log(i); // ln Γ(h) para h entero
    const lf = (h - 1) * Math.log(x) - x / 2 - h * Math.LN2 - lg;
    return Math.exp(Math.log(x) + lf);
  }

  Deck.add({
    transition: "watercolor",
    notes: "Con n = 10,384 el valor p tiende a cero incluso con diferencias moderadas: la prueba indica dependencia, no qué tan fuerte es.",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Homogeneidad: ¿el hogar y la escuela van de la mano?", "Prueba ji-cuadrada de independencia");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Paso 1: tabla 5×5 → mapa de calor =================
      const sv = L.svg(el);
      const X0 = 90, Y0 = 290, HW = 130, CW = 116, CH = 78;
      const tab = L.s("g", {}, sv);
      const hdrT = (x, y, t, a = {}) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 26, fill: C.ink }, a), tab, t);
      const corner = hdrT(X0 + HW / 2, Y0 - 24, "Hogar \\ Escuela", { "font-size": 19, fill: C.ink2 });
      const colH = [0, 1, 2, 3, 4, "Total"].map((c, j) => hdrT(X0 + HW + j * CW + CW / 2, Y0 - 24, String(c), { fill: j < 5 ? C.blueD : C.ink }));
      const rowH = [0, 1, 2, 3, 4, "Total"].map((r, i) => hdrT(X0 + HW / 2, Y0 + i * CH + CH / 2 + 9, String(r), { fill: i < 5 ? C.amberD : C.ink }));
      const lines = L.s("path", { d: `M${X0},${Y0} H${X0 + HW + 6 * CW} M${X0 + HW},${Y0 - 60} V${Y0 + 6 * CH} M${X0},${Y0 + 5 * CH} H${X0 + HW + 6 * CW} M${X0 + HW + 5 * CW},${Y0 - 60} V${Y0 + 6 * CH}`, stroke: C.ink, "stroke-width": 2.5, fill: "none" }, tab);
      const max = 1390;
      const heat = d3.scaleSqrt().domain([0, max]).range([0, 1]);
      const col = (v) => d3.interpolateRgb("#FBF3E6", "#4E2E5B")(heat(v));
      const cells = [];
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) {
        const inner = i < 5 && j < 5;
        const v = inner ? D.contingencia[i][j] : i === 5 && j === 5 ? D.totalTabla : i === 5 ? D.totalesColumna[j] : D.totalesFila[i];
        const g = L.s("g", {}, tab);
        const x = X0 + HW + j * CW, y = Y0 + i * CH;
        const r = L.s("rect", { x: x + 3, y: y + 3, width: CW - 6, height: CH - 6, rx: 8, fill: inner ? "#fffdf8" : "none", stroke: inner ? "#E4DCCB" : "none", "stroke-width": 1.5 }, g);
        const t = L.s("text", { x: x + CW / 2, y: y + CH / 2 + 9, "text-anchor": "middle", "font-family": "Nunito", "font-weight": inner ? 700 : 800, "font-size": 25, fill: C.ink }, g, L.fmt.int(v));
        cells.push({ i, j, g, r, t, v, inner, x, y });
      }
      const inner = cells.filter((c) => c.inner);
      gsap.set([tab], { autoAlpha: 0 });
      S.step();
      tl.set(tab, { autoAlpha: 1 }, ">");
      L.draw(tl, lines, ">", { duration: 0.8 });
      tl.fromTo([corner, ...colH, ...rowH], { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.04 }, "<0.2");
      tl.fromTo(cells.map((c) => c.g), { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)", stagger: { each: 0.035, grid: [6, 6], from: "start" } }, ">");
      inner.forEach((c, k) => {
        tl.to(c.r, { attr: { fill: col(c.v), stroke: col(c.v) }, duration: 0.5 }, k ? "<0.02" : ">0.2");
        if (heat(c.v) > 0.55) tl.to(c.t, { attr: { fill: "#fff" }, duration: 0.3 }, "<");
      });

      // ================= Paso 2: hipótesis =================
      S.step();
      const hyp = L.h("div", { class: "abs", style: { left: "1010px", top: "200px", width: "840px", fontSize: "31px", lineHeight: 1.35 } }, el);
      const h0 = L.h("div", { style: { fontWeight: 700 } }, hyp, "H₀: el índice del hogar y el de la escuela son independientes");
      const h1 = L.h("div", { style: { fontWeight: 700, color: C.crimson, marginTop: "6px" } }, hyp, "H₁: no son independientes");
      gsap.set(hyp, { autoAlpha: 0 });
      tl.set(hyp, { autoAlpha: 1 }, ">");
      L.write(tl, h0, { pos: ">", dur: 1.4 });
      L.write(tl, h1, { pos: ">0.1", dur: 0.8 });

      // ================= Paso 3: la distribución χ² con 16 gl =================
      S.step();
      const csv = L.svg(el);
      const P = Charts.plot(csv, { x: 990, y: 340, w: 880, h: 470, m: { l: 90, r: 20, t: 20, b: 80 } });
      const { g, iw, ih } = P;
      const x = d3.scaleLog().domain([0.5, 5000]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, 1.3]).range([ih, 0]);
      const frame = L.s("rect", { x: 0, y: 0, width: iw, height: ih, fill: "none", stroke: C.ink, "stroke-width": 2, opacity: 0.85 }, g);
      const ax = Charts.axis(g, x, { orient: "bottom", at: ih, ticks: [1, 10, 100, 1000], fmt: (v) => String(v), title: "χ² (escala logarítmica)", titleOff: 66 });
      const ay = Charts.axis(g, y, { orient: "left", at: 0, ticks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2], fmt: (v) => v.toFixed(1), title: "Densidad", titleOff: 70 });
      const pts = d3.range(0, 401).map((i) => { const xv = 0.5 * Math.pow(10000, i / 400); return [x(xv), y(chiLogDensity(xv, 16))]; });
      const curve = L.s("path", { d: d3.line()(pts), fill: "none", stroke: C.plum, "stroke-width": 4 }, g);
      const fr = D.chi.frontera;
      const rej = pts.filter(([px]) => px >= x(fr));
      const area = L.s("path", { d: `M${x(fr)},${ih} L${x(fr)},${y(chiLogDensity(fr, 16))} ` + rej.map((p) => `L${p[0]},${p[1]}`).join(" ") + ` L${iw},${ih} Z`, fill: C.crimson, opacity: 0.28 }, g);
      const fLine = L.s("line", { x1: x(fr), x2: x(fr), y1: 0, y2: ih, stroke: C.crimson, "stroke-width": 3.5, "stroke-dasharray": "12 8" }, g);
      const fLab = L.s("text", { x: x(fr) - 12, y: 40, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 25, fill: C.crimson }, g, "Valor frontera = 27.14");
      const obs = L.s("line", { x1: x(D.chi.x2), x2: x(D.chi.x2), y1: 0, y2: ih, stroke: C.ink, "stroke-width": 5 }, g);
      const oLab = L.s("text", { x: x(D.chi.x2) - 12, y: 90, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 25, fill: C.ink }, g, "Observada = 2414.77");
      const stamp = L.h("div", { class: "stamp", style: { left: "1180px", top: "830px", fontSize: "34px", transform: "rotate(-3deg)" } }, el, "Se rechaza H₀ · p &lt; 2.2×10⁻¹⁶");
      gsap.set([csv, stamp], { autoAlpha: 0 });
      tl.set(csv, { autoAlpha: 1 }, ">");
      tl.fromTo(frame, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.4 }, ">");
      Charts.axisIn(tl, ax, "<");
      Charts.axisIn(tl, ay, "<");
      L.draw(tl, curve, ">-0.2", { duration: 1.4 });
      tl.fromTo(fLine, { x: -240, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, ">");
      tl.fromTo(area, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scaleY: 1, duration: 0.6 }, ">-0.2");
      tl.fromTo(fLab, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
      tl.fromTo(obs, { x: -x(D.chi.x2), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out" }, ">0.3");
      tl.fromTo(oLab, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      tl.fromTo(stamp, { autoAlpha: 0, scale: 2.2, rotation: -12 }, { autoAlpha: 1, scale: 1, rotation: -3, duration: 0.45, ease: "power4.in" }, ">0.3");

      // ================= Paso 4: celdas destacadas =================
      S.step();
      const c00 = cells.find((c) => c.i === 0 && c.j === 0), c40 = cells.find((c) => c.i === 4 && c.j === 0);
      const ring = (c) => L.s("rect", { x: c.x - 2, y: c.y - 2, width: CW + 4, height: CH + 4, rx: 12, fill: "none", stroke: C.plum, "stroke-width": 6 }, tab);
      const r00 = ring(c00), r40 = ring(c40);
      const hl = L.h("div", { class: "abs", style: { left: "90px", top: "800px", width: "880px", fontSize: "27px", lineHeight: 1.3 } }, el);
      const hl1 = L.h("div", {}, hl, `<span style="display:inline-block;width:16px;height:16px;border:4px solid ${C.plum};border-radius:4px;margin-right:10px"></span>De quienes no tuvieron ningún estímulo en casa, <b>33.4%</b> tampoco tuvo ninguno en la escuela.`);
      const hl2 = L.h("div", { style: { marginTop: "10px" } }, hl, `<span style="display:inline-block;width:16px;height:16px;border:4px solid ${C.plum};border-radius:4px;margin-right:10px"></span>De quienes tuvieron los cuatro en casa, solo <b>2.2%</b>.`);
      const concl = L.h("div", { class: "abs h-title", style: { left: "1000px", width: "860px", top: "945px", fontSize: "36px", fontStyle: "italic", color: C.plum, lineHeight: 1.2 } }, el, "La escuela tiende a reforzar el acceso que ya existía en el hogar.");
      gsap.set([r00, r40, hl, concl], { autoAlpha: 0 });
      tl.set(hl, { autoAlpha: 1 }, ">");
      tl.fromTo(r00, { autoAlpha: 0, scale: 1.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4 }, ">");
      tl.to(c00.g, { scale: 1.12, transformOrigin: "50% 50%", duration: 0.3, yoyo: true, repeat: 3 }, "<");
      L.pop(tl, hl1, "<", { from: { y: 10 } });
      tl.fromTo(r40, { autoAlpha: 0, scale: 1.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4 }, ">0.3");
      tl.to(c40.g, { scale: 1.12, transformOrigin: "50% 50%", duration: 0.3, yoyo: true, repeat: 3 }, "<");
      L.pop(tl, hl2, "<", { from: { y: 10 } });
      L.write(tl, concl, { pos: ">0.2", dur: 1.6 });

      // ================= Paso 5 (opcional): estabilidad entre años =================
      S.step();
      const ysv = L.svg(el);
      const YP = Charts.plot(ysv, { x: 990, y: 230, w: 880, h: 450, m: { l: 90, r: 30, t: 30, b: 80 } });
      const yx = d3.scalePoint().domain(D.general.anios).range([30, YP.iw - 30]);
      const yy = d3.scaleLinear().domain([0, 60]).range([YP.ih, 0]);
      const yax = Charts.axis(YP.g, yx, { orient: "bottom", at: YP.ih, labels: D.general.anios.map((a) => [a, String(a)]) });
      const yay = Charts.axis(YP.g, yy, { orient: "left", at: 0, ticks: [0, 20, 40, 60], title: "% de lectores", titleOff: 66 });
      const lp = D.anios.pct.map((p, i) => [yx(D.general.anios[i]), yy(p)]);
      const yline = L.s("path", { d: d3.line()(lp), fill: "none", stroke: C.plum, "stroke-width": 4.5 }, YP.g);
      const ydots = lp.map(([px, py], i) => {
        const gg = L.s("g", {}, YP.g);
        L.s("circle", { cx: px, cy: py, r: 9, fill: C.plum, stroke: "#fff", "stroke-width": 2.5 }, gg);
        L.s("text", { x: px, y: py - 20, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 23, fill: C.ink }, gg, D.anios.pct[i].toFixed(1));
        return gg;
      });
      const ytext = L.h("div", { class: "abs", style: { left: "1010px", top: "720px", width: "840px", fontSize: "28px", fontWeight: 600, lineHeight: 1.3 } }, el, "Homogeneidad entre años: χ² = 2.26 &lt; 11.64, p = 0.81 → la proporción de lectores fue estable de 2019 a 2024.");
      gsap.set([ysv, ytext], { autoAlpha: 0 });
      tl.to([csv, stamp, hyp], { autoAlpha: 0, y: -30, duration: 0.6, ease: "power2.in" }, ">");
      tl.set(ysv, { autoAlpha: 1 }, ">");
      Charts.axisIn(tl, yax, ">");
      Charts.axisIn(tl, yay, "<");
      L.draw(tl, yline, ">-0.2", { duration: 1.2 });
      tl.fromTo(ydots, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.15, ease: "back.out(3)" }, "<0.1");
      L.pop(tl, ytext, ">", { from: { y: 10 } });
    },
  });
})();
