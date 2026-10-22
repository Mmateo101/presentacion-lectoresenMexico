/* Resultado 3 · Prueba de diferencia entre solo escuela y solo hogar.
   Cada paso se presenta centrado; al terminar se guarda en un rectángulo a todo lo ancho, arriba. */
(function () {
  const { C } = L;
  const D = window.DATA;
  const P = L.RES[2];                     // color de este resultado
  const READ = P.a;                       // color de "leen" (distinto de azul y naranja)
  const RECT = { x: 110, w: 1700, h: 122, gap: 14, top: 118 };
  const rectY = (i) => RECT.top + i * (RECT.h + RECT.gap);

  Deck.add({
    accent: P.a,
    transition: "watercolor",
    washColors: [P.l, P.m, P.l, P.a, P.m], // explosiones del color de este resultado
    notes: "Grupos mutuamente excluyentes: solo escuela (hogar = 0, escuela ≥ 1; n = 1,977) y solo hogar (escuela = 0, hogar ≥ 1; n = 500). H₀: p_hogar = p_escuela; α = 0.04. Diferencia 19.4 puntos, IC 96% [14.3, 24.6], z ≈ 8.41, p < 2.2×10⁻¹⁶.",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 2");
      const head = L.head(el, "Prueba de diferencia entre solo escuela y solo hogar");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const svg = L.svg(el);
      const T = (x, y, t, a = {}) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 30, fill: C.ink }, a), svg, t);

      /* Rectángulo-resumen de un paso: marco del color del resultado y etiqueta a la izquierda */
      const rects = [];
      const mkRect = (i, label) => {
        const y = rectY(i);
        const box = L.s("rect", { x: RECT.x, y, width: RECT.w, height: RECT.h, rx: 18, fill: P.l, "fill-opacity": 0.35, stroke: P.a, "stroke-width": 4 }, svg);
        const lab = L.h("div", { class: "abs h-title", style: { left: RECT.x + 30 + "px", top: y + "px", height: RECT.h + "px", width: "580px", display: "flex", alignItems: "center", fontSize: "31px", color: P.d, lineHeight: 1.1 } }, el, label);
        gsap.set([box, lab], { autoAlpha: 0 });
        rects.push({ box, lab });
        return { box, lab, y };
      };
      const showRect = (r, pos) => {
        tl.fromTo(r.box, { autoAlpha: 0, scaleX: 0.15, transformOrigin: "0% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "power3.out" }, pos);
        tl.fromTo(r.lab, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      };

      /* Al final los rectángulos se estiran verticalmente para llenar la hoja */
      const expand = (list, pos) => {
        const n = list.length, H = (1005 - RECT.top - (n - 1) * RECT.gap) / n;
        list.forEach((r, i) => {
          const ny = RECT.top + i * (H + RECT.gap), dy = ny + H / 2 - (r.y + RECT.h / 2);
          const v = { duration: 0.8, ease: "power3.inOut" };
          tl.to(r.box, Object.assign({ attr: { y: ny, height: H } }, v), i ? "<" : pos);
          [r.lab, ...(r.fit || [])].forEach((e) => tl.to(e, Object.assign({ top: ny, height: H }, v), "<"));
          (r.move || []).forEach((e) => tl.to(e, Object.assign({ y: "+=" + dy }, v), "<"));
        });
      };

      // =============== Paso 1 · Separar las poblaciones (centrado) ===============
      const t1 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "140px", textAlign: "center", fontSize: "44px", color: P.a } }, el, "Paso 1 · Separar las poblaciones");
      const GX = 460, GY = 270, CW = 200, CH = 100, PER = 20;
      const grid = L.s("g", {}, svg);
      for (let k = 0; k <= 5; k++) {
        L.s("line", { x1: GX, x2: GX + 5 * CW, y1: GY + k * CH, y2: GY + k * CH, stroke: "#D8CDB8", "stroke-width": 2 }, grid);
        L.s("line", { x1: GX + k * CW, x2: GX + k * CW, y1: GY, y2: GY + 5 * CH, stroke: "#D8CDB8", "stroke-width": 2 }, grid);
      }
      const gt = (x, y, t, a) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 26 }, a), grid, t);
      for (let k = 0; k < 5; k++) {
        gt(GX + k * CW + CW / 2, GY - 14, String(k), { fill: C.blueD });
        gt(GX - 24, GY + k * CH + CH / 2 + 9, String(k), { fill: C.amberD });
      }
      gt(GX + 2.5 * CW, GY - 48, "Escuela", { fill: C.blueD, "font-size": 28 });
      gt(GX - 70, GY + 2.5 * CH, "Hogar", { fill: C.amberD, "font-size": 28, transform: `rotate(-90 ${GX - 70} ${GY + 2.5 * CH})` });
      const dots = [];
      D.contingencia.forEach((row, i) => row.forEach((n, j) => {
        for (let k = 0; k < Math.round(n / PER); k++) {
          const c = L.s("circle", { cx: 0, cy: 0, r: 5.2, fill: C.ink2 }, svg);
          const d = { c, i, j, gx: GX + j * CW + 13 + (k % 14) * 13.2, gy: GY + i * CH + 12 + Math.floor(k / 14) * 13.2 };
          gsap.set(c, { x: d.gx, y: d.gy });
          dots.push(d);
        }
      }));
      const esc = dots.filter((d) => d.i === 0 && d.j >= 1), hog = dots.filter((d) => d.j === 0 && d.i >= 1);
      const rest = dots.filter((d) => !esc.includes(d) && !hog.includes(d));
      const lay = (arr, x0, y0, cols, sp) => arr.forEach((d, k) => { d.tx = x0 + (k % cols) * sp; d.ty = y0 + Math.floor(k / cols) * sp; });
      lay(esc, 330, 420, 14, 26);
      lay(hog, 1400, 420, 7, 26);
      const gE = L.h("div", { class: "abs", style: { left: "230px", top: "300px", width: "560px", textAlign: "center" } }, el,
        `<div class="h-title" style="font-size:42px;color:${C.blueD}">Solo escuela</div><div style="font-size:30px;font-weight:800">hogar = 0 · escuela ≥ 1</div>`);
      const gH = L.h("div", { class: "abs", style: { left: "1200px", top: "300px", width: "560px", textAlign: "center" } }, el,
        `<div class="h-title" style="font-size:42px;color:${C.amberD}">Solo hogar</div><div style="font-size:30px;font-weight:800">escuela = 0 · hogar ≥ 1</div>`);
      gsap.set([t1, grid, gE, gH], { autoAlpha: 0 });
      gsap.set(dots.map((d) => d.c), { autoAlpha: 0 });
      L.pop(tl, t1, ">", { from: { y: -10 } });
      tl.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.2");
      tl.fromTo(dots.map((d) => d.c), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: { amount: 0.9, from: "random" } }, "<");
      // se separan
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
      const R1 = mkRect(0, "Paso 1 · Separar las poblaciones");
      // los puntitos se guardan en el rectángulo, lado a lado
      const rx0 = 720, ry0 = R1.y + 24;
      esc.forEach((d, k) => { d.rx = rx0 + (k % 33) * 13; d.ry = ry0 + Math.floor(k / 33) * 13; });
      hog.forEach((d, k) => { d.rx = 1220 + (k % 9) * 13; d.ry = ry0 + Math.floor(k / 9) * 13; });
      const rE = L.h("div", { class: "abs", style: { left: "720px", top: R1.y + 70 + "px", fontSize: "24px", fontWeight: 800, color: C.blueD } }, el, "Solo escuela · hogar = 0, escuela ≥ 1");
      const rH = L.h("div", { class: "abs", style: { left: "1220px", top: R1.y + 70 + "px", fontSize: "24px", fontWeight: 800, color: C.amberD } }, el, "Solo hogar · escuela = 0, hogar ≥ 1");
      gsap.set([rE, rH], { autoAlpha: 0 });
      tl.to([t1, gE, gH], { autoAlpha: 0, duration: 0.3 }, ">");
      showRect(R1, "<");
      tl.to(esc.map((d) => d.c), { x: (k) => esc[k].rx, y: (k) => esc[k].ry, scale: 0.9, duration: 0.8, ease: "power3.inOut", stagger: 0.003 }, "<");
      tl.to(hog.map((d) => d.c), { x: (k) => hog[k].rx, y: (k) => hog[k].ry, scale: 0.9, duration: 0.8, ease: "power3.inOut", stagger: 0.01 }, "<");
      tl.fromTo([rE, rH], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, ">-0.2");
      // el paso 2, centrado debajo: el porcentaje arriba de los puntitos; los que leen en otro color
      const t2 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "275px", textAlign: "center", fontSize: "44px", color: P.a } }, el, "Paso 2 · Proporciones");
      const nE = esc.length, nH = hog.length;
      const kE = Math.round(nE * D.soloEscuela.p), kH = Math.round(nH * D.soloHogar.p);
      const dE = esc.map((_, k) => L.s("circle", { cx: 330 + (k % 14) * 26, cy: 560 + Math.floor(k / 14) * 26, r: 8.3, fill: C.blueL }, svg));
      const dH = hog.map((_, k) => L.s("circle", { cx: 1430 + (k % 7) * 26, cy: 560 + Math.floor(k / 7) * 26, r: 8.3, fill: C.amberL }, svg));
      const pE = L.h("div", { class: "abs", style: { left: "230px", top: "360px", width: "560px", textAlign: "center" } }, el,
        `<div style="font-size:30px;font-weight:800;color:${C.blueD}">Solo escuela</div><div class="h-title" style="font-size:84px;color:${READ};line-height:1.05">${L.num(27.0, "pct1")} <span style="font-size:36px">leen</span></div><div style="font-size:24px;font-weight:700;color:${C.ink2}">533 de 1,977</div>`);
      const pH = L.h("div", { class: "abs", style: { left: "1230px", top: "360px", width: "560px", textAlign: "center" } }, el,
        `<div style="font-size:30px;font-weight:800;color:${C.amberD}">Solo hogar</div><div class="h-title" style="font-size:84px;color:${READ};line-height:1.05">${L.num(46.4, "pct1")} <span style="font-size:36px">leen</span></div><div style="font-size:24px;font-weight:700;color:${C.ink2}">232 de 500</div>`);
      gsap.set([t2, pE, pH, ...dE, ...dH], { autoAlpha: 0 });
      L.pop(tl, t2, ">0.1", { from: { y: -10 } });
      tl.fromTo([...dE, ...dH], { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.25, stagger: 0.003 }, ">-0.1");
      tl.to(dE.slice(0, kE), { attr: { fill: READ }, duration: 0.25, stagger: 0.012 }, ">");
      tl.to(dH.slice(0, kH), { attr: { fill: READ }, duration: 0.25, stagger: 0.035 }, "<");
      tl.fromTo([pE, pH], { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, ">-0.3");
      L.counts(tl, pE, "<", 1.2);
      L.counts(tl, pH, "<0.2", 1.2);

      // =============== Paso 3 · Prueba de hipótesis ===============
      S.step();
      const R2 = mkRect(1, "Paso 2 · Proporciones");
      const sum2 = L.h("div", { class: "abs", style: { left: "720px", top: R2.y + "px", height: RECT.h + "px", display: "flex", alignItems: "center", gap: "70px" } }, el,
        `<div><span style="font-size:26px;font-weight:800;color:${C.blueD}">Solo escuela</span> <span class="h-title" style="font-size:54px;color:${READ}">27.0%</span></div><div><span style="font-size:26px;font-weight:800;color:${C.amberD}">Solo hogar</span> <span class="h-title" style="font-size:54px;color:${READ}">46.4%</span></div>`);
      gsap.set(sum2, { autoAlpha: 0 });
      tl.to([t2, pE, pH, ...dE, ...dH], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R2, "<0.1");
      tl.fromTo(sum2, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      const t3 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "410px", textAlign: "center", fontSize: "44px", color: P.a } }, el, "Paso 3 · Prueba de hipótesis");
      const sub = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "470px", textAlign: "center", fontSize: "46px" } }, el,
        `<span style="color:${C.amberD}">46.4%</span> − <span style="color:${C.blueD}">27.0%</span> = <span style="color:${P.a}">19.4 puntos</span>`);
      const PX = 360, PY = 600, PW = 1200, PHt = 330;
      const x = d3.scaleLinear().domain([-4, 10]).range([PX, PX + PW]);
      const y = d3.scaleLinear().domain([0, 0.42]).range([PY + PHt, PY]);
      const phi = (z) => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
      const gph = L.s("g", {}, svg);
      const axis = L.s("line", { x1: PX, x2: PX + PW, y1: PY + PHt, y2: PY + PHt, stroke: C.ink, "stroke-width": 2.5 }, gph);
      [-4, -2, 0, 2, 4, 6, 8, 10].forEach((v) => {
        L.s("line", { x1: x(v), x2: x(v), y1: PY + PHt, y2: PY + PHt + 9, stroke: C.ink, "stroke-width": 2 }, gph);
        L.s("text", { x: x(v), y: PY + PHt + 38, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 600, "font-size": 24, fill: C.ink }, gph, String(v).replace("-", "−"));
      });
      const curve = L.s("path", { d: d3.line()(d3.range(-4, 10.001, 0.05).map((z) => [x(z), y(phi(z))])), fill: "none", stroke: P.a, "stroke-width": 4.5 }, gph);
      const tail = (a, b) => `M${x(a)},${y(0)} ` + d3.range(a, b + 0.001, 0.05).map((z) => `L${x(z)},${y(phi(z))}`).join(" ") + ` L${x(b)},${y(0)} Z`;
      const rej = [L.s("path", { d: tail(-4, -2.054), fill: C.crimson, opacity: 0.35 }, gph), L.s("path", { d: tail(2.054, 10), fill: C.crimson, opacity: 0.35 }, gph)];
      const fr = [-2.054, 2.054].map((v) => L.s("line", { x1: x(v), x2: x(v), y1: PY + 20, y2: PY + PHt, stroke: C.crimson, "stroke-width": 3.5, "stroke-dasharray": "12 8" }, gph));
      const fLab = L.s("text", { x: x(2.054) + 14, y: PY + 50, "font-family": "Nunito", "font-weight": 800, "font-size": 26, fill: C.crimson }, gph, "Valor frontera = ±2.054");
      const rLab = L.s("text", { x: x(5.4), y: PY + PHt - 22, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 26, fill: C.crimson }, gph, "Región de rechazo");
      const obs = L.s("line", { x1: x(8.41), x2: x(8.41), y1: PY, y2: PY + PHt, stroke: C.ink, "stroke-width": 6 }, gph);
      const oLab = L.s("text", { x: x(8.41), y: PY - 14, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 32, fill: C.ink }, gph, "z = 8.41");
      gsap.set([t3, sub, gph], { autoAlpha: 0 });
      L.pop(tl, t3, ">0.1", { from: { y: -10 } });
      tl.fromTo(sub, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ">-0.1");
      tl.set(gph, { autoAlpha: 1 }, ">");
      L.draw(tl, axis, "<", { duration: 0.5 });
      L.draw(tl, curve, ">-0.1", { duration: 1.0 });
      tl.fromTo(fr, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scaleY: 1, duration: 0.5 }, ">");
      tl.fromTo(rej, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<0.2");
      tl.fromTo([fLab, rLab], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
      tl.fromTo(obs, { x: x(0) - x(8.41), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 1.0, ease: "power4.out" }, ">0.3");
      tl.fromTo(oLab, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.3");

      // =============== Paso 3 guardado + Conclusión ===============
      S.step();
      const R3 = mkRect(2, "Paso 3 · Prueba de hipótesis");
      const sum3 = L.h("div", { class: "abs h-title", style: { left: "720px", top: R3.y + "px", height: RECT.h + "px", display: "flex", alignItems: "center", fontSize: "40px" } }, el,
        `19.4 puntos &nbsp;·&nbsp; z = 8.41 &gt; 2.054 &nbsp;·&nbsp; p &lt; 2.2×10⁻¹⁶`);
      const R4 = mkRect(3, "Conclusión");
      const sum4 = L.h("div", { class: "abs", style: { left: "720px", top: R4.y + "px", height: RECT.h + "px", display: "flex", alignItems: "center", gap: "34px" } }, el,
        `<span class="stamp" style="position:static;font-size:38px;transform:rotate(-3deg);color:#fff;background:${P.a};border-color:#fff">Se rechaza H₀</span>`);
      gsap.set([sum3, sum4], { autoAlpha: 0 });
      tl.to([t3, sub, gph], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R3, "<0.1");
      tl.fromTo(sum3, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      showRect(R4, ">0.3");
      tl.fromTo(sum4, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power4.in" }, ">-0.1");
      Object.assign(R1, { move: [[...esc, ...hog].map((d) => d.c), rE, rH] });
      R2.fit = [sum2]; R3.fit = [sum3]; R4.fit = [sum4];
      expand([R1, R2, R3, R4], ">0.5");
    },
  });
})();
