/* Diapositiva 8 · Prueba de diferencia entre solo escuela y solo hogar (3 pasos centrados que suben) */
(function () {
  const { C } = L;
  const D = window.DATA;
  const BW = 1600, BH = 700;           // tamaño de cada bloque de paso
  const ACTIVE = { x: 160, y: 300 };   // dónde se ve el paso activo
  const SUM = 0.3;                     // escala del paso ya terminado (arriba)

  /* Bloque de un paso: div con su propio SVG de 1600×700 */
  function block(el, title) {
    const b = L.h("div", { class: "abs", style: { left: 0, top: 0, width: BW + "px", height: BH + "px", transformOrigin: "0 0" } }, el);
    const lab = L.h("div", { class: "abs h-title", style: { left: 0, width: BW + "px", top: "0px", textAlign: "center", fontSize: "44px", color: C.plum } }, b, title);
    const svg = L.s("svg", { width: BW, height: BH, viewBox: `0 0 ${BW} ${BH}`, style: "position:absolute;left:0;top:0;overflow:visible" }, b);
    gsap.set(b, { x: ACTIVE.x, y: ACTIVE.y });
    return { b, lab, svg };
  }
  const tx = (svg, x, y, t, a = {}) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 30, fill: C.ink }, a), svg, t);

  Deck.add({
    transition: "pageTurn",
    notes: "Grupos mutuamente excluyentes: solo escuela (hogar = 0, escuela ≥ 1; n = 1,977) y solo hogar (escuela = 0, hogar ≥ 1; n = 500). H₀: p_hogar = p_escuela; α = 0.04. Diferencia 19.4 puntos, IC 96% [14.3, 24.6], z ≈ 8.41, p < 2.2×10⁻¹⁶.",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el);
      const head = L.head(el, "Prueba de diferencia entre solo escuela y solo hogar");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const moveUp = (blk, slot) => tl.to(blk.b, { x: 200 + slot * 540, y: 120, scale: SUM, duration: 0.9, ease: "power3.inOut" }, ">");

      // =============== Paso 1 · Separar la población ===============
      const P1 = block(el, "Paso 1 · Separar la población");
      gsap.set(P1.b, { y: 220 });
      const sv = P1.svg;
      const GX = 300, GY = 150, CW = 200, CH = 100, PER = 20;
      const grid = L.s("g", {}, sv);
      for (let k = 0; k <= 5; k++) {
        L.s("line", { x1: GX, x2: GX + 5 * CW, y1: GY + k * CH, y2: GY + k * CH, stroke: "#D8CDB8", "stroke-width": 2 }, grid);
        L.s("line", { x1: GX + k * CW, x2: GX + k * CW, y1: GY, y2: GY + 5 * CH, stroke: "#D8CDB8", "stroke-width": 2 }, grid);
      }
      for (let k = 0; k < 5; k++) {
        tx(grid, GX + k * CW + CW / 2, GY - 14, String(k), { fill: C.blueD, "font-size": 26 });
        tx(grid, GX - 24, GY + k * CH + CH / 2 + 9, String(k), { fill: C.amberD, "font-size": 26 });
      }
      tx(grid, GX + 2.5 * CW, GY - 48, "Escuela", { fill: C.blueD, "font-size": 28 });
      tx(grid, GX - 70, GY + 2.5 * CH, "Hogar", { fill: C.amberD, "font-size": 28, transform: `rotate(-90 ${GX - 70} ${GY + 2.5 * CH})` });
      const dots = [];
      D.contingencia.forEach((row, i) => row.forEach((n, j) => {
        const m = Math.round(n / PER);
        for (let k = 0; k < m; k++) {
          const c = L.s("circle", { cx: 0, cy: 0, r: 5.2, fill: C.ink2 }, sv);
          const d = { c, i, j, gx: GX + j * CW + 13 + (k % 14) * 13.2, gy: GY + i * CH + 12 + Math.floor(k / 14) * 13.2 };
          gsap.set(c, { x: d.gx, y: d.gy });
          dots.push(d);
        }
      }));
      const esc = dots.filter((d) => d.i === 0 && d.j >= 1);
      const hog = dots.filter((d) => d.j === 0 && d.i >= 1);
      const rest = dots.filter((d) => !esc.includes(d) && !hog.includes(d));
      const lay = (arr, x0, y0, cols) => arr.forEach((d, k) => { d.tx = x0 + (k % cols) * 26; d.ty = y0 + Math.floor(k / cols) * 26; });
      lay(esc, 120, 230, 14);
      lay(hog, 1220, 230, 7);
      const gE = L.h("div", { class: "abs", style: { left: "60px", top: "120px", width: "560px", textAlign: "center" } }, P1.b,
        `<div class="h-title" style="font-size:42px;color:${C.blueD}">Solo escuela</div><div style="font-size:30px;font-weight:800">hogar = 0 · escuela ≥ 1</div>`);
      const gH = L.h("div", { class: "abs", style: { left: "1050px", top: "120px", width: "540px", textAlign: "center" } }, P1.b,
        `<div class="h-title" style="font-size:42px;color:${C.amberD}">Solo hogar</div><div style="font-size:30px;font-weight:800">escuela = 0 · hogar ≥ 1</div>`);
      gsap.set([P1.lab, grid, gE, gH], { autoAlpha: 0 });
      gsap.set(dots.map((d) => d.c), { autoAlpha: 0 });
      // entrada: la población en la tabla; luego se separa
      L.pop(tl, P1.lab, ">", { from: { y: -10 } });
      tl.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.2");
      tl.fromTo(dots.map((d) => d.c), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: { amount: 0.9, from: "random" } }, "<");
      S.step();
      tl.to(esc.map((d) => d.c), { attr: { fill: C.blueM }, duration: 0.3 }, ">");
      tl.to(hog.map((d) => d.c), { attr: { fill: C.amberM }, duration: 0.3 }, "<0.15");
      tl.to(rest.map((d) => d.c), { autoAlpha: 0.12, duration: 0.4 }, "<");
      tl.to(rest.map((d) => d.c), { autoAlpha: 0, duration: 0.4 }, ">0.5");
      tl.to(grid, { autoAlpha: 0, duration: 0.4 }, "<");
      tl.to(esc.map((d) => d.c), { x: (k) => esc[k].tx, y: (k) => esc[k].ty, scale: 1.6, duration: 0.9, ease: "power3.inOut", stagger: 0.004 }, "<0.1");
      tl.to(hog.map((d) => d.c), { x: (k) => hog[k].tx, y: (k) => hog[k].ty, scale: 1.6, duration: 0.9, ease: "power3.inOut", stagger: 0.01 }, "<");
      tl.fromTo([gE, gH], { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, ">-0.3");

      // =============== Paso 2 · Proporciones ===============
      S.step();
      moveUp(P1, 0);
      const P2 = block(el, "Paso 2 · Proporciones");
      const sv2 = P2.svg;
      const dE = [], dH = [];
      const nE = esc.length, nH = hog.length;
      const rE = Math.round(nE * D.soloEscuela.p), rH = Math.round(nH * D.soloHogar.p);
      for (let k = 0; k < nE; k++) dE.push(L.s("circle", { cx: 120 + (k % 14) * 26, cy: 130 + Math.floor(k / 14) * 26, r: 8.3, fill: C.band }, sv2));
      for (let k = 0; k < nH; k++) dH.push(L.s("circle", { cx: 1220 + (k % 7) * 26, cy: 130 + Math.floor(k / 7) * 26, r: 8.3, fill: C.band }, sv2));
      const pE = L.h("div", { class: "abs", style: { left: "60px", top: "330px", width: "560px", textAlign: "center" } }, P2.b,
        `<div class="h-title" style="font-size:96px;color:${C.blueD};line-height:1">${L.num(27.0, "pct1")}</div><div style="font-size:30px;font-weight:700;color:${C.ink2}">533 de 1,977 leen</div>`);
      const pH = L.h("div", { class: "abs", style: { left: "1050px", top: "330px", width: "540px", textAlign: "center" } }, P2.b,
        `<div class="h-title" style="font-size:96px;color:${C.amberD};line-height:1">${L.num(46.4, "pct1")}</div><div style="font-size:30px;font-weight:700;color:${C.ink2}">232 de 500 leen</div>`);
      const key = L.h("div", { class: "abs", style: { left: "600px", top: "200px", width: "400px", textAlign: "center", fontSize: "30px", fontWeight: 700 } }, P2.b,
        `<span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${C.ink};margin-right:8px"></span>lee<br><span style="display:inline-block;width:20px;height:20px;border-radius:50%;background:${C.band};border:2px solid ${C.ink2};margin-right:8px"></span>no lee`);
      gsap.set([P2.b], { autoAlpha: 0 });
      gsap.set([pE, pH, key], { autoAlpha: 0 });
      tl.fromTo(P2.b, { autoAlpha: 0, y: ACTIVE.y + 80 }, { autoAlpha: 1, y: ACTIVE.y, duration: 0.6, ease: "power3.out" }, ">-0.3");
      tl.fromTo([...dE, ...dH], { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.25, stagger: 0.004 }, ">-0.2");
      L.pop(tl, key, "<", { from: { y: 10 } });
      tl.to(dE.slice(0, rE), { attr: { fill: C.blueD }, duration: 0.25, stagger: 0.015 }, ">");
      tl.to(dH.slice(0, rH), { attr: { fill: C.amberD }, duration: 0.25, stagger: 0.04 }, "<");
      tl.fromTo([pE, pH], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, ">-0.3");
      L.counts(tl, pE, "<", 1.2);
      L.counts(tl, pH, "<0.2", 1.2);

      // =============== Paso 3 · Prueba de hipótesis ===============
      S.step();
      moveUp(P2, 1);
      const P3 = block(el, "Paso 3 · Prueba de hipótesis");
      const sub = L.h("div", { class: "abs h-title", style: { left: 0, width: BW + "px", top: "70px", textAlign: "center", fontSize: "50px" } }, P3.b,
        `<span style="color:${C.amberD}">46.4%</span> − <span style="color:${C.blueD}">27.0%</span> = <span style="color:${C.plum}">19.4 puntos</span>`);
      const sv3 = P3.svg;
      // distribución normal estándar con la región de rechazo (α = 0.04, dos colas)
      const PX = 200, PY = 170, PW = 1200, PHt = 330;
      const x = d3.scaleLinear().domain([-4, 10]).range([PX, PX + PW]);
      const y = d3.scaleLinear().domain([0, 0.42]).range([PY + PHt, PY]);
      const phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
      const zs = d3.range(-4, 10.001, 0.05);
      const axis = L.s("line", { x1: PX, x2: PX + PW, y1: PY + PHt, y2: PY + PHt, stroke: C.ink, "stroke-width": 2.5 }, sv3);
      const ticks = [-4, -2, 0, 2, 4, 6, 8, 10].map((v) => {
        const g = L.s("g", {}, sv3);
        L.s("line", { x1: x(v), x2: x(v), y1: PY + PHt, y2: PY + PHt + 9, stroke: C.ink, "stroke-width": 2 }, g);
        tx(g, x(v), PY + PHt + 38, String(v).replace("-", "−"), { "font-size": 24, "font-weight": 600 });
        return g;
      });
      const zt = tx(sv3, x(3), PY + PHt + 76, "z", { "font-size": 26, fill: C.ink2, "font-style": "italic" });
      const curve = L.s("path", { d: d3.line()(zs.map((z) => [x(z), y(phi(z))])), fill: "none", stroke: C.plum, "stroke-width": 4.5 }, sv3);
      const tail = (a, b) => `M${x(a)},${y(0)} ` + d3.range(a, b + 0.001, 0.05).map((z) => `L${x(z)},${y(phi(z))}`).join(" ") + ` L${x(b)},${y(0)} Z`;
      const rejL = L.s("path", { d: tail(-4, -2.054), fill: C.crimson, opacity: 0.35 }, sv3);
      const rejR = L.s("path", { d: tail(2.054, 10), fill: C.crimson, opacity: 0.35 }, sv3);
      const fL = L.s("line", { x1: x(-2.054), x2: x(-2.054), y1: PY + 20, y2: PY + PHt, stroke: C.crimson, "stroke-width": 3.5, "stroke-dasharray": "12 8" }, sv3);
      const fR = L.s("line", { x1: x(2.054), x2: x(2.054), y1: PY + 20, y2: PY + PHt, stroke: C.crimson, "stroke-width": 3.5, "stroke-dasharray": "12 8" }, sv3);
      const fLab = tx(sv3, x(2.054) + 14, PY + 50, "Valor frontera = ±2.054", { "text-anchor": "start", fill: C.crimson, "font-size": 26 });
      const rLab = tx(sv3, x(5.4), PY + PHt - 22, "Región de rechazo", { fill: C.crimson, "font-size": 26 });
      const obs = L.s("line", { x1: x(8.41), x2: x(8.41), y1: PY, y2: PY + PHt, stroke: C.ink, "stroke-width": 6 }, sv3);
      const oLab = tx(sv3, x(8.41), PY - 14, "z = 8.41", { "font-size": 32 });
      const stamp = L.h("div", { class: "stamp", style: { left: "1110px", top: "245px", fontSize: "36px", transform: "rotate(-4deg)" } }, P3.b, "Se rechaza H₀");
      const ins = L.h("div", { class: "abs hand", style: { left: 0, width: BW + "px", top: "640px", textAlign: "center", fontSize: "42px", color: C.amberD } }, P3.b, `${L.ins(1)}Quienes solo tuvieron estímulos en casa leen 1.7 veces más`);
      gsap.set([P3.b, sub, rejL, rejR, fL, fR, fLab, rLab, obs, oLab, stamp, ins, zt, ...ticks], { autoAlpha: 0 });
      tl.fromTo(P3.b, { autoAlpha: 0, y: ACTIVE.y + 80 }, { autoAlpha: 1, y: ACTIVE.y, duration: 0.6, ease: "power3.out" }, ">-0.3");
      // restamos las proporciones
      tl.fromTo(sub, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ">-0.1");
      L.draw(tl, axis, ">0.2", { duration: 0.6 });
      tl.fromTo(ticks, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, stagger: 0.05 }, "<0.2");
      tl.fromTo(zt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
      L.draw(tl, curve, ">-0.2", { duration: 1.1 });
      tl.fromTo([fL, fR], { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scaleY: 1, duration: 0.5 }, ">");
      tl.fromTo([rejL, rejR], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.2");
      tl.fromTo([fLab, rLab], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
      tl.fromTo(obs, { x: x(0) - x(8.41), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.0, ease: "power4.out" }, ">0.3");
      tl.fromTo(oLab, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.3");
      tl.fromTo(stamp, { autoAlpha: 0, scale: 2.2, rotation: -14 }, { autoAlpha: 1, scale: 1, rotation: -4, duration: 0.45, ease: "power4.in" }, ">0.2");
      L.write(tl, ins, { pos: ">0.3", dur: 1.4 });
    },
  });
})();
