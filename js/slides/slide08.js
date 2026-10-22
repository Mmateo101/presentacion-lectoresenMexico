/* Diapositiva 8 · El acceso en el hogar se asocia más con leer que el de la escuela */
(function () {
  const { C } = L;
  const { person, walk, mood } = Chars;
  const D = window.DATA;

  /* Cambio de escena dentro de la diapositiva: la anterior se va como hoja, la nueva entra */
  function sceneSwap(tl, out, inn) {
    tl.to(out, { x: -120, autoAlpha: 0, rotationY: -12, transformOrigin: "0% 50%", transformPerspective: 1600, duration: 0.7, ease: "power2.in" }, ">");
    tl.fromTo(inn, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power2.out" }, ">-0.15");
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Todas las pruebas z rechazan H₀ con α = 0.04 (valor frontera z = ±2.054).",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el);
      const head = L.head(el, "El acceso en el hogar se asocia más con leer que el de la escuela");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Escena 1: intervalos por nivel =================
      const s1 = L.h("div", { class: "layer" }, el);
      const sv1 = L.svg(s1);
      const toRows = (arr) => arr.map((r) => ({ label: r.nivel, p: r.p, li: r.li, ls: r.ls }));
      const iH = Charts.intervals(sv1, { x: 80, y: 150, w: 870, h: 760, rows: toRows(D.niveles.hogar), xDomain: [0.2, 0.7], xTicks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7], color: [C.amberL, C.amberM, C.amberD], lineColor: C.ink, title: "Acceso en el hogar", xTitle: "Proporción de lectores" });
      const iE = Charts.intervals(sv1, { x: 980, y: 150, w: 870, h: 760, rows: toRows(D.niveles.escuela), xDomain: [0.2, 0.7], xTicks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7], color: [C.blueL, C.blueM, C.blueD], lineColor: C.ink, title: "Acceso en la escuela", xTitle: "Proporción de lectores" });
      iH.title.setAttribute("fill", C.amberD);
      iE.title.setAttribute("fill", C.blueD);
      const n1 = L.h("div", { class: "abs hand", style: { left: "0", width: "1920px", top: "975px", textAlign: "center", fontSize: "42px", color: C.plum } }, s1, `${L.ins(1)}Los intervalos no se traslapan: cada nivel es distinto en la población`);
      gsap.set([s1, n1], { autoAlpha: 0 });
      S.step();
      tl.set(s1, { autoAlpha: 1 }, ">");
      iH.play(tl, ">");
      iE.play(tl, "<0.4");
      L.write(tl, n1, { pos: ">", dur: 1.6 });

      // ================= Escena 2: diferencia de proporciones solo escuela vs. solo hogar =================
      S.step();
      const s2 = L.h("div", { class: "layer" }, el);
      const t2 = L.h("div", { class: "abs h-title", style: { left: "110px", top: "128px", fontSize: "36px", color: C.plum } }, s2, "Diferencia de proporciones entre solo escuela y solo hogar");
      const sv2 = L.svg(s2);
      const PER = 20; // 1 punto ≈ 20 personas
      const key2 = L.h("div", { class: "abs", style: { left: "1500px", top: "136px", fontSize: "24px", fontWeight: 700, color: C.ink2 } }, s2, `<span style="display:inline-block;width:14px;height:14px;border-radius:50%;background:${C.ink2};margin-right:8px"></span>1 punto ≈ 20 personas`);
      // tabla hogar × escuela donde se acomodan los puntos
      const GX = 520, GY = 250, CW2 = 200, CH2 = 102;
      const grid = L.s("g", {}, sv2);
      const gl = [];
      for (let k = 0; k <= 5; k++) {
        gl.push(L.s("line", { x1: GX, x2: GX + 5 * CW2, y1: GY + k * CH2, y2: GY + k * CH2, stroke: "#D8CDB8", "stroke-width": 2 }, grid));
        gl.push(L.s("line", { x1: GX + k * CW2, x2: GX + k * CW2, y1: GY, y2: GY + 5 * CH2, stroke: "#D8CDB8", "stroke-width": 2 }, grid));
      }
      const gt = (x, y, t, col, a = {}) => L.s("text", Object.assign({ x, y, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 26, fill: col }, a), grid, t);
      for (let k = 0; k < 5; k++) {
        gt(GX + k * CW2 + CW2 / 2, GY - 14, String(k), C.blueD);
        gt(GX - 26, GY + k * CH2 + CH2 / 2 + 9, String(k), C.amberD);
      }
      gt(GX + 2.5 * CW2, GY - 52, "Índice de la escuela", C.blueD, { "font-size": 28 });
      gt(GX - 70, GY + 2.5 * CH2, "Índice del hogar", C.amberD, { "font-size": 28, transform: `rotate(-90 ${GX - 70} ${GY + 2.5 * CH2})` });
      // un punto por cada ~20 personas en cada celda
      const dots2 = [];
      const r8 = L.rng(88);
      D.contingencia.forEach((row, i) => row.forEach((n, j) => {
        const m = Math.round(n / PER);
        for (let k = 0; k < m; k++) {
          const gx = GX + j * CW2 + 13 + (k % 14) * 13.4, gy = GY + i * CH2 + 13 + Math.floor(k / 14) * 13.4;
          const c = L.s("circle", { cx: 0, cy: 0, r: 5.4, fill: C.ink2 }, sv2);
          const d = { c, i, j, gx, gy, sx: 140 + r8() * 1640, sy: 220 + r8() * 560 };
          gsap.set(c, { x: d.sx, y: d.sy });
          dots2.push(d);
        }
      }));
      const esc = dots2.filter((d) => d.i === 0 && d.j >= 1);   // solo escuela
      const hog = dots2.filter((d) => d.j === 0 && d.i >= 1);   // solo hogar
      const rest = dots2.filter((d) => !esc.includes(d) && !hog.includes(d));
      const popL = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "800px", textAlign: "center", fontSize: "40px" } }, s2, "Población: 10,384 personas con ambos índices");

      // ---- destino de los grupos ----
      const place = (arr, x0, y0, cols) => arr.forEach((d, k) => { d.tx = x0 + (k % cols) * 25; d.ty = y0 + Math.floor(k / cols) * 25; });
      place(esc, 150, 300, 25);
      place(hog, 1180, 300, 13);
      const gE = L.h("div", { class: "abs", style: { left: "130px", top: "200px", width: "720px" } }, s2,
        `<div class="h-title" style="font-size:34px;color:${C.blueD}">Solo escuela <span style="font-size:24px;color:${C.ink2}">(como Héctor)</span></div><div style="font-size:24px;font-weight:700;color:${C.ink2}">hogar = 0 y escuela ≥ 1 · n = 1,977</div>`);
      const gH = L.h("div", { class: "abs", style: { left: "1160px", top: "200px", width: "700px" } }, s2,
        `<div class="h-title" style="font-size:34px;color:${C.amberD}">Solo hogar <span style="font-size:24px;color:${C.ink2}">(como Eduardo)</span></div><div style="font-size:24px;font-weight:700;color:${C.ink2}">escuela = 0 y hogar ≥ 1 · n = 500</div>`);
      const excl = L.h("div", { class: "abs hand", style: { left: "760px", top: "420px", width: "400px", textAlign: "center", fontSize: "36px", color: C.plum, lineHeight: 1.05 } }, s2, "Grupos mutuamente excluyentes: nadie está en los dos");
      // lectores (color fuerte) vs. no lectores (claro)
      const readE = Math.round(esc.length * D.soloEscuela.p), readH = Math.round(hog.length * D.soloHogar.p);
      const legend = L.h("div", { class: "abs", style: { left: "760px", top: "540px", width: "400px", textAlign: "center", fontSize: "24px", fontWeight: 700 } }, s2,
        `<span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${C.ink};margin-right:6px"></span>lee &nbsp;&nbsp; <span style="display:inline-block;width:16px;height:16px;border-radius:50%;background:${C.band};border:2px solid ${C.ink2};margin-right:6px"></span>no lee`);
      const pE = L.h("div", { class: "abs", style: { left: "130px", top: "470px", width: "720px" } }, s2,
        `<span class="h-title" style="font-size:64px;color:${C.blueD}">${L.num(27.0, "pct1")}</span><span style="font-size:26px;font-weight:700;color:${C.ink2}"> &nbsp;lee · 533 de 1,977</span>`);
      const pH = L.h("div", { class: "abs", style: { left: "1160px", top: "470px", width: "700px" } }, s2,
        `<span class="h-title" style="font-size:64px;color:${C.amberD}">${L.num(46.4, "pct1")}</span><span style="font-size:26px;font-weight:700;color:${C.ink2}"> &nbsp;lee · 232 de 500</span>`);

      // ---- prueba de hipótesis (abajo, en la misma diapositiva) ----
      const test = L.h("div", { class: "card", style: { left: "110px", top: "610px", width: "1700px", height: "360px", padding: "26px 40px" } }, s2);
      L.h("div", { style: { fontWeight: 800, letterSpacing: ".16em", textTransform: "uppercase", fontSize: "22px", color: C.plum, marginBottom: "10px" } }, test, "Prueba de hipótesis · diferencia de proporciones (z) · <span style=\"text-transform:none\">α</span> = 0.04");
      const cols2 = L.h("div", { style: { display: "grid", gridTemplateColumns: "1fr 1.25fr", gap: "40px" } }, test);
      const hyp = L.h("div", { style: { fontSize: "30px", lineHeight: 1.45 } }, cols2,
        `<div><b>H₀:</b> p<sub>hogar</sub> = p<sub>escuela</sub></div><div><b>H₁:</b> p<sub>hogar</sub> ≠ p<sub>escuela</sub></div><div style="font-size:24px;color:${C.ink2};margin-top:8px">Muestras independientes y mutuamente excluyentes · n·p ≥ 5 en ambos grupos</div>`);
      const res = L.h("div", { style: { fontSize: "30px", lineHeight: 1.45 } }, cols2,
        `<div>Diferencia: <b>19.4 puntos</b></div><div>IC 96%: <b>[14.3, 24.6]</b> — no incluye el 0</div><div>z ≈ 8.41 &nbsp;·&nbsp; p &lt; 2.2×10⁻¹⁶</div>`);
      const stamp = L.h("div", { class: "stamp", style: { left: "1380px", top: "870px", fontSize: "32px", transform: "rotate(-3deg)" } }, s2, "Se rechaza H₀");
      const n2 = L.h("div", { class: "abs hand", style: { left: "0", width: "1920px", top: "990px", textAlign: "center", fontSize: "42px", color: C.amberD } }, s2, `${L.ins(2)}Quienes solo tuvieron estímulos en casa leen 1.7 veces más`);

      gsap.set([s2, t2, key2, grid, popL, gE, gH, excl, legend, pE, pH, test, stamp, n2], { autoAlpha: 0 });
      gsap.set(dots2.map((d) => d.c), { autoAlpha: 0 });
      // 2a · la población; se acomoda en la tabla hogar × escuela
      sceneSwap(tl, s1, s2);
      L.write(tl, t2, { pos: ">-0.3", dur: 1.0 });
      tl.fromTo(dots2.map((d) => d.c), { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: { amount: 1.0, from: "random" } }, "<0.2");
      L.pop(tl, popL, "<0.3", { from: { y: 10 } });
      L.pop(tl, key2, "<", { from: { y: -6 } });
      tl.fromTo(grid, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, ">0.2");
      tl.to(dots2.map((d) => d.c), { x: (k) => dots2[k].gx, y: (k) => dots2[k].gy, duration: 1.2, ease: "power3.inOut", stagger: { amount: 0.4, from: "random" } }, "<");

      // 2b · se separan los dos grupos mutuamente excluyentes
      S.step();
      tl.to(esc.map((d) => d.c), { attr: { fill: C.blueM }, duration: 0.4 }, ">");
      tl.to(hog.map((d) => d.c), { attr: { fill: C.amberM }, duration: 0.4 }, "<0.2");
      tl.to(rest.map((d) => d.c), { autoAlpha: 0.12, duration: 0.5 }, "<");
      tl.to(rest.map((d) => d.c), { autoAlpha: 0, scale: 0, duration: 0.5 }, ">0.6");
      tl.to([grid, popL], { autoAlpha: 0, duration: 0.5 }, "<");
      tl.to(esc.map((d) => d.c), { x: (k) => esc[k].tx, y: (k) => esc[k].ty, scale: 1.7, duration: 1.0, ease: "power3.inOut", stagger: 0.004 }, "<0.2");
      tl.to(hog.map((d) => d.c), { x: (k) => hog[k].tx, y: (k) => hog[k].ty, scale: 1.7, duration: 1.0, ease: "power3.inOut", stagger: 0.01 }, "<");
      L.pop(tl, gE, ">-0.4", { from: { y: -10 } });
      L.pop(tl, gH, "<", { from: { y: -10 } });
      L.write(tl, excl, { pos: ">", dur: 1.2 });

      // 2c · lectores vs. no lectores y la proporción de cada grupo
      S.step();
      const eRead = esc.slice(0, readE).map((d) => d.c), eNo = esc.slice(readE).map((d) => d.c);
      const hRead = hog.slice(0, readH).map((d) => d.c), hNo = hog.slice(readH).map((d) => d.c);
      L.pop(tl, legend, ">", { from: { y: 10 } });
      tl.to(eRead, { attr: { fill: C.blueD }, scale: 2, duration: 0.3, stagger: 0.01 }, "<");
      tl.to(eNo, { attr: { fill: C.band }, duration: 0.4 }, "<");
      tl.to(hRead, { attr: { fill: C.amberD }, scale: 2, duration: 0.3, stagger: 0.02 }, "<");
      tl.to(hNo, { attr: { fill: C.band }, duration: 0.4 }, "<");
      tl.fromTo([pE, pH], { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.2 }, ">-0.2");
      L.counts(tl, pE, "<", 1.2);
      L.counts(tl, pH, "<0.2", 1.2);

      // 2d · la prueba de hipótesis
      S.step();
      tl.to([excl, legend], { autoAlpha: 0, duration: 0.3 }, ">");
      tl.fromTo(test, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" }, "<");
      tl.fromTo(hyp, { autoAlpha: 0, x: -20 }, { autoAlpha: 1, x: 0, duration: 0.5 }, ">-0.1");
      tl.fromTo(res, { autoAlpha: 0, x: 20 }, { autoAlpha: 1, x: 0, duration: 0.5 }, ">0.2");
      tl.fromTo(stamp, { autoAlpha: 0, scale: 2.2, rotation: -12 }, { autoAlpha: 1, scale: 1, rotation: -3, duration: 0.45, ease: "power4.in" }, ">0.3");
      tl.fromTo(s2, { x: 0 }, { x: 6, duration: 0.05, repeat: 3, yoyo: true }, ">");
      L.write(tl, n2, { pos: ">0.2", dur: 1.4 });

      // ================= Escena 3: ¿la escuela compensa? =================
      S.step();
      const s4 = L.h("div", { class: "layer" }, el);
      const t4 = L.h("div", { class: "abs h-title", style: { left: "420px", width: "1400px", top: "180px", fontSize: "40px", lineHeight: 1.2 } }, s4, "Escuela alta – escuela baja, entre quienes tuvieron acceso bajo en casa");
      const v4 = L.h("div", { class: "abs", style: { left: "420px", top: "280px", fontSize: "34px", fontWeight: 700, color: C.blueD } }, s4, `+${L.num(7.8, "d1")} puntos · IC 96% [5.1, 10.5]`);
      const sv4 = L.svg(s4);
      const hi = Charts.hinterval(sv4, { x: 420, y: 360, w: 1380, h: 400, xDomain: [-0.01, 0.13], xTicks: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12], fmt: (v) => v.toFixed(2), li: D.compensacion.li, ls: D.compensacion.ls, point: D.compensacion.dif, zero: 0, color: C.blueD, wash: C.blueL, xTitle: "Diferencia de proporciones" });
      const hec4 = person(sv4, { who: "hector", age: "adult", shirt: C.blueM, pants: "#4F5866", x: 200, y: 900, s: 1.2 });
      const m4 = L.h("div", { class: "abs h-title", style: { left: "420px", width: "1400px", top: "880px", fontSize: "50px", fontStyle: "italic", color: C.plum, textAlign: "center" } }, s4, `${L.ins(3)}La escuela sí ayuda… pero compensa solo una parte.`);
      gsap.set([s4, t4, v4, m4, hec4.g], { autoAlpha: 0 });
      sceneSwap(tl, s2, s4);
      L.write(tl, t4, { pos: ">-0.2", dur: 1.2 });
      hi.play(tl, ">");
      tl.fromTo(v4, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<0.8");
      L.counts(tl, v4, "<", 1.2);
      tl.fromTo(hec4.g, { autoAlpha: 0, y: 960 }, { autoAlpha: 1, y: 900, duration: 0.6, ease: "back.out(2)" }, ">-0.4");
      Chars.arm(tl, hec4, 1, -120, ">", 0.4);
      Chars.arm(tl, hec4, 1, -100, ">", 0.2);
      L.write(tl, m4, { pos: ">", dur: 1.6 });
    },
  });
})();
