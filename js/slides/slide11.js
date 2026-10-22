/* Resultado 2 · Independencia entre el índice del hogar y el de la escuela (ji-cuadrada).
   Igual que el Resultado 3: cada paso se presenta centrado y al terminar se guarda en un rectángulo arriba. */
(function () {
  const { C } = L;
  const D = window.DATA;
  const PAL = L.RES[1]; // color de este resultado
  const RECT = { x: 110, w: 1700, h: 122, gap: 14, top: 118 };
  const rectY = (i) => RECT.top + i * (RECT.h + RECT.gap);

  /* Densidad de ln(x) para χ² con k gl: x·f(x) (igual que la gráfica de R en escala log) */
  function chiLogDensity(x, k) {
    const h = k / 2;
    let lg = 0; for (let i = 2; i < h; i++) lg += Math.log(i); // ln Γ(h) para h entero
    const lf = (h - 1) * Math.log(x) - x / 2 - h * Math.LN2 - lg;
    return Math.exp(Math.log(x) + lf);
  }

  // Frecuencias esperadas y aportaciones (O − E)²/E, calculadas de la tabla observada
  const O = D.contingencia, RT = D.totalesFila, CT = D.totalesColumna, N = D.totalTabla;
  const E = O.map((row, i) => row.map((_, j) => (RT[i] * CT[j]) / N));
  const Q = O.map((row, i) => row.map((o, j) => ((o - E[i][j]) ** 2) / E[i][j]));
  /* Fracción tipográfica: numerador sobre denominador con una raya */
  const frac = (num, den, size) => `<span style="display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.05;${size ? `font-size:${size}px;` : ""}"><span style="padding:0 6px 3px">${num}</span><span style="border-top:3px solid currentColor;padding:3px 6px 0;align-self:stretch;text-align:center">${den}</span></span>`;
  const f1 = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  Deck.add({
    accent: PAL.a,
    transition: "watercolor",
    washColors: [PAL.l, PAL.m, "#E3F0E5", PAL.a, PAL.l],
    notes: "H₀: el índice del hogar y el de la escuela son independientes. Frecuencias esperadas: (total del renglón × total de la columna) / n; la menor es 184.8 ≥ 5, así que se cumple el supuesto. χ² = Σ(O − E)²/E = 2414.77 con (5−1)(5−1) = 16 gl; valor frontera 27.14 (α = 0.04); p < 2.2×10⁻¹⁶. La prueba ji-cuadrada no da un intervalo de confianza. Con n = 10,384 la prueba indica dependencia, no qué tan fuerte es.",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 2");
      const head = L.head(el, "Independencia entre índice hogar y escuela");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const svg = L.svg(el);

      /* Rectángulo-resumen de un paso */
      const mkRect = (i, label) => {
        const y = rectY(i);
        const box = L.s("rect", { x: RECT.x, y, width: RECT.w, height: RECT.h, rx: 18, fill: PAL.l, "fill-opacity": 0.35, stroke: PAL.a, "stroke-width": 4 }, svg);
        const lab = L.h("div", { class: "abs h-title", style: { left: RECT.x + 30 + "px", top: y + "px", height: RECT.h + "px", width: "580px", display: "flex", alignItems: "center", fontSize: "31px", color: PAL.d, lineHeight: 1.1 } }, el, label);
        gsap.set([box, lab], { autoAlpha: 0 });
        return { box, lab, y };
      };
      const showRect = (r, pos) => {
        tl.fromTo(r.box, { autoAlpha: 0, scaleX: 0.15, transformOrigin: "0% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.55, ease: "power3.out" }, pos);
        tl.fromTo(r.lab, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      };
      const title = (top, text) => L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: top + "px", textAlign: "center", fontSize: "44px", color: PAL.a } }, el, text);

      /* Tabla 5×5 (con totales opcionales) coloreada como mapa de calor */
      const mkTable = ({ Y0, M, fmt, max, totals, CW = 150, CH = 70, size = 26 }) => {
        const HW = 120, cols = totals ? 6 : 5;
        const X0 = (1920 - (HW + cols * CW)) / 2;
        const g = L.s("g", {}, svg);
        const txt = (x, y, t, a = {}) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": size, fill: C.ink }, a), g, t);
        const hdr = [txt(X0 + HW / 2, Y0 - 18, "Hogar \\ Escuela", { "font-size": 18, fill: C.ink2 })];
        for (let j = 0; j < cols; j++) hdr.push(txt(X0 + HW + j * CW + CW / 2, Y0 - 18, j < 5 ? String(j) : "Total", { fill: j < 5 ? C.blueD : C.ink }));
        for (let i = 0; i < cols; i++) hdr.push(txt(X0 + HW / 2, Y0 + i * CH + CH / 2 + 9, i < 5 ? String(i) : "Total", { fill: i < 5 ? C.amberD : C.ink }));
        const heat = d3.scaleSqrt().domain([0, max]).range([0, 1]);
        const col = (v) => d3.interpolateRgb("#FBF3E6", PAL.d)(heat(v));
        const cells = [];
        for (let i = 0; i < cols; i++) for (let j = 0; j < cols; j++) {
          const inner = i < 5 && j < 5;
          const v = inner ? M[i][j] : i === 5 && j === 5 ? N : i === 5 ? CT[j] : RT[i];
          const x = X0 + HW + j * CW, y = Y0 + i * CH;
          const cg = L.s("g", {}, g);
          const r = L.s("rect", { x: x + 3, y: y + 3, width: CW - 6, height: CH - 6, rx: 8, fill: inner ? col(v) : "none", stroke: inner ? col(v) : "none" }, cg);
          L.s("text", { x: x + CW / 2, y: y + CH / 2 + 9, "text-anchor": "middle", "font-family": "Nunito", "font-weight": inner ? 700 : 800, "font-size": size, fill: inner && heat(v) > 0.55 ? "#fff" : C.ink }, cg, inner ? fmt(v) : L.fmt.int(v));
          cells.push({ i, j, g: cg, r, x, y, inner });
        }
        gsap.set(g, { autoAlpha: 0 });
        const play = (pos) => {
          tl.set(g, { autoAlpha: 1 }, pos);
          tl.fromTo(hdr, { autoAlpha: 0, y: -10 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.03 }, "<");
          tl.fromTo(cells.map((c) => c.g), { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(2)", stagger: { each: 0.025, grid: [cols, cols], from: "start" } }, "<0.2");
        };
        const ring = (i, j) => {
          const c = cells.find((k) => k.i === i && k.j === j);
          return L.s("rect", { x: c.x - 1, y: c.y - 1, width: CW + 2, height: CH + 2, rx: 12, fill: "none", stroke: C.crimson, "stroke-width": 5 }, g);
        };
        return { g, cells, play, ring, col };
      };

      /* Mini mapa de calor para el rectángulo-resumen */
      const mini = (y, M, max) => {
        const heat = d3.scaleSqrt().domain([0, max]).range([0, 1]);
        const g = L.s("g", {}, svg);
        M.forEach((row, i) => row.forEach((v, j) => L.s("rect", { x: 720 + j * 22, y: y + 8 + i * 22, width: 19, height: 19, rx: 3, fill: d3.interpolateRgb("#FBF3E6", PAL.d)(heat(v)) }, g)));
        gsap.set(g, { autoAlpha: 0 });
        return g;
      };
      const sumText = (y, html, left = 870) => {
        const d = L.h("div", { class: "abs", style: { left: left + "px", top: y + "px", height: RECT.h + "px", width: 1810 - left - 20 + "px", display: "flex", alignItems: "center", gap: "40px", fontSize: "30px", fontWeight: 800, color: C.ink } }, el, html);
        gsap.set(d, { autoAlpha: 0 });
        return d;
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

      // =============== Paso 1 · Frecuencias observadas ===============
      const t1 = title(140, "Paso 1 · Frecuencias observadas");
      const T1 = mkTable({ Y0: 270, M: O, fmt: L.fmt.int, max: 1390, totals: true, CW: 160, CH: 72 });
      gsap.set(t1, { autoAlpha: 0 });
      L.pop(tl, t1, ">", { from: { y: -10 } });
      T1.play(">-0.1");

      // =============== Paso 2 · Frecuencias esperadas ===============
      S.step();
      const R1 = mkRect(0, "Paso 1 · Frecuencias observadas");
      const m1 = mini(R1.y, O, 1390);
      const s1 = sumText(R1.y, `<span>n = 10,384</span><span style="color:${C.ink2};font-weight:700">índice hogar × índice escuela</span>`);
      tl.to([t1, T1.g], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R1, "<0.1");
      tl.fromTo(m1, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4 }, ">-0.2");
      tl.fromTo(s1, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, "<");

      const t2 = title(262, "Paso 2 · Frecuencias esperadas");
      const T2 = mkTable({ Y0: 360, M: E, fmt: f1, max: 1390, totals: true, CW: 160, CH: 70, size: 26 });
      gsap.set(t2, { autoAlpha: 0 });
      L.pop(tl, t2, ">0.1", { from: { y: -10 } });
      T2.play(">-0.1");

      // =============== Paso 3 · Diferencia al cuadrado ===============
      S.step();
      const R2 = mkRect(1, "Paso 2 · Frecuencias esperadas");
      const m2 = mini(R2.y, E, 1390);
      tl.to([t2, T2.g], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R2, "<0.1");
      tl.fromTo(m2, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4 }, ">-0.2");

      const t3 = title(398, "Paso 3 · Diferencia al cuadrado");
      const fm3 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "450px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "44px" } }, el,
        `χ² = Σ&nbsp;${frac(`<span style="color:${PAL.a}">(O − E)²</span>`, `<span style="color:${PAL.a}">E</span>`)}`);
      const sm3 = L.h("div", { class: "abs", style: { left: 0, width: "1920px", top: "568px", textAlign: "center", fontSize: "24px", fontWeight: 700, color: C.ink2 } }, el,
        "se distribuye como ji-cuadrada con (5 − 1)(5 − 1) = 16 grados de libertad");
      const T3 = mkTable({ Y0: 650, M: Q, fmt: f1, max: 750, totals: false, CW: 160, CH: 58, size: 25 });
      const tot3 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "960px", textAlign: "center", fontSize: "50px", color: PAL.d } }, el, "χ² = 2414.77");
      gsap.set([t3, fm3, sm3, tot3], { autoAlpha: 0 });
      L.pop(tl, t3, ">0.1", { from: { y: -10 } });
      tl.fromTo(fm3, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ">-0.1");
      tl.fromTo(sm3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">");
      T3.play(">");
      tl.fromTo(tot3, { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ">0.3");

      // =============== Paso 4 · Prueba de hipótesis (gráfica) ===============
      S.step();
      const R3 = mkRect(2, "Paso 3 · Diferencia al cuadrado");
      const m3 = mini(R3.y, Q, 750);
      const s3 = sumText(R3.y, `<span style="display:flex;align-items:center">χ² = Σ&nbsp;${frac("(O − E)²", "E", 30)}&nbsp;= <span style="color:${PAL.d}">&nbsp;2414.77</span></span>`);
      tl.to([t3, fm3, sm3, tot3, T3.g], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R3, "<0.1");
      tl.fromTo(m3, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4 }, ">-0.2");
      tl.fromTo(s3, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, "<");

      const t4 = title(534, "Paso 4 · Prueba de hipótesis");
      const hyp = L.h("div", { class: "abs", style: { left: "110px", top: "660px", width: "500px", fontSize: "28px", lineHeight: 1.35 } }, el,
        `<div style="font-weight:700">H₀: el índice del hogar y el de la escuela son independientes</div><div style="font-weight:700;color:${C.crimson};margin-top:14px">H₁: no son independientes</div><div style="margin-top:14px;color:${C.ink2};font-weight:700">α = 0.04 · 16 gl</div>`);
      const csv = L.svg(el);
      const PL = Charts.plot(csv, { x: 640, y: 600, w: 1180, h: 450, m: { l: 90, r: 20, t: 20, b: 80 } });
      const { g, iw, ih } = PL;
      const x = d3.scaleLog().domain([0.5, 5000]).range([0, iw]);
      const y = d3.scaleLinear().domain([0, 1.3]).range([ih, 0]);
      const ax = Charts.axis(g, x, { orient: "bottom", at: ih, ticks: [1, 10, 100, 1000], fmt: (v) => String(v), title: "χ² (escala logarítmica)", titleOff: 66 });
      const ay = Charts.axis(g, y, { orient: "left", at: 0, ticks: [0, 0.4, 0.8, 1.2], fmt: (v) => v.toFixed(1), title: "Densidad", titleOff: 70 });
      const pts = d3.range(0, 401).map((i) => { const xv = 0.5 * Math.pow(10000, i / 400); return [x(xv), y(chiLogDensity(xv, 16))]; });
      const curve = L.s("path", { d: d3.line()(pts), fill: "none", stroke: PAL.a, "stroke-width": 4 }, g);
      const fr = D.chi.frontera;
      const rej = pts.filter(([px]) => px >= x(fr));
      const area = L.s("path", { d: `M${x(fr)},${ih} L${x(fr)},${y(chiLogDensity(fr, 16))} ` + rej.map((p) => `L${p[0]},${p[1]}`).join(" ") + ` L${iw},${ih} Z`, fill: C.crimson, opacity: 0.28 }, g);
      const fLine = L.s("line", { x1: x(fr), x2: x(fr), y1: 0, y2: ih, stroke: C.crimson, "stroke-width": 3.5, "stroke-dasharray": "12 8" }, g);
      const fLab = L.s("text", { x: x(fr) + 12, y: 34, "font-family": "Nunito", "font-weight": 800, "font-size": 25, fill: C.crimson }, g, "Valor frontera = 27.14");
      const rLab = L.s("text", { x: x(300), y: ih - 60, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 25, fill: C.crimson }, g, "Región de rechazo");
      const obs = L.s("line", { x1: x(D.chi.x2), x2: x(D.chi.x2), y1: 0, y2: ih, stroke: C.ink, "stroke-width": 5 }, g);
      const oLab = L.s("text", { x: x(D.chi.x2) - 12, y: 90, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 27, fill: C.ink }, g, "χ² = 2414.77");
      gsap.set([t4, hyp, csv], { autoAlpha: 0 });
      L.pop(tl, t4, ">0.1", { from: { y: -10 } });
      L.pop(tl, hyp, ">-0.1", { from: { x: -20 } });
      tl.set(csv, { autoAlpha: 1 }, "<");
      Charts.axisIn(tl, ax, "<");
      Charts.axisIn(tl, ay, "<");
      L.draw(tl, curve, ">-0.2", { duration: 1.2 });
      tl.fromTo(fLine, { x: -240, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.8, ease: "power3.out" }, ">");
      tl.fromTo(area, { autoAlpha: 0, scaleY: 0, transformOrigin: "50% 100%" }, { autoAlpha: 1, scaleY: 1, duration: 0.6 }, ">-0.2");
      tl.fromTo([fLab, rLab], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
      tl.fromTo(obs, { x: -x(D.chi.x2), autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.9, ease: "power4.out" }, ">0.3");
      tl.fromTo(oLab, { autoAlpha: 0, x: -30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");

      // =============== Paso 4 guardado + Conclusión ===============
      S.step();
      const R4 = mkRect(3, "Paso 4 · Prueba de hipótesis");
      const s4 = sumText(R4.y, `<span class="h-title" style="font-size:38px">χ² = 2414.77 &gt; 27.14 &nbsp;·&nbsp; p &lt; 2.2×10⁻¹⁶</span>`, 720);
      const R5 = mkRect(4, "Conclusión");
      const s5 = sumText(R5.y, `<span class="stamp" style="position:static;font-size:34px;transform:rotate(-3deg)">Se rechaza H₀</span><span class="h-title" style="font-size:40px;color:${PAL.d}">No son independientes</span>`, 720);
      tl.to([t4, hyp, csv], { autoAlpha: 0, duration: 0.35 }, ">");
      showRect(R4, "<0.1");
      tl.fromTo(s4, { autoAlpha: 0, x: 30 }, { autoAlpha: 1, x: 0, duration: 0.4 }, ">-0.2");
      showRect(R5, ">0.3");
      tl.fromTo(s5, { autoAlpha: 0, scale: 1.6 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "power4.in" }, ">-0.1");
      Object.assign(R1, { move: [m1], fit: [s1] }); R2.move = [m2]; Object.assign(R3, { move: [m3], fit: [s3] }); R4.fit = [s4]; R5.fit = [s5];
      expand([R1, R2, R3, R4, R5], ">0.5");
    },
  });
})();
