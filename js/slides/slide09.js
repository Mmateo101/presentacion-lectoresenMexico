/* Diapositiva 9 · Escolaridad: la diferencia aparece hasta la media superior */
(function () {
  const { C } = L;
  const D = window.DATA;
  const PLUMS = ["#D9C6E2", "#A983BA", "#7A4E8C", "#4E2E5B"];

  Deck.add({
    transition: "inkSpread",
    notes: "Primaria vs. secundaria tampoco difiere dentro de ningún nivel de acceso (p = 0.62, 0.22 y 0.98).",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el);
      const head = L.head(el, "Escolaridad: la diferencia aparece hasta la media superior");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Paso 1: % de lectores por escolaridad =================
      const s1 = L.h("div", { class: "layer" }, el);
      const sub = L.h("div", { class: "abs", style: { left: "110px", top: "128px", fontSize: "27px", color: C.ink2, fontWeight: 600 } }, s1, "La escolaridad funciona como indicador indirecto del nivel socioeconómico (el MOLEC no mide ingreso).");
      const sv = L.svg(s1);
      const cats = D.escolaridad.map((e) => e.nivel);
      const bars = Charts.vbars(sv, { x: 130, y: 190, w: 1660, h: 760, cats, values: D.escolaridad.map((e) => e.pct), yMax: 80, yTicks: [0, 20, 40, 60, 80], color: PLUMS, labelFmt: "pct1", yTitle: "% de lectores", pad: 0.42, catSize: 28, labelSize: 32, m: { l: 110, r: 20, t: 40, b: 80 } });
      gsap.set([s1, sub], { autoAlpha: 0 });
      S.step();
      tl.set(s1, { autoAlpha: 1 }, ">");
      L.pop(tl, sub, ">", { from: { y: 10 } });
      bars.play(tl, "<");

      // ================= Paso 2: flechas con las pruebas z =================
      S.step();
      const g0x = 130 + 110, g0y = 190 + 40; // origen del área de la gráfica
      const top = (i) => g0y + bars.y(D.escolaridad[i].pct);
      const cx = (i) => g0x + bars.x(cats[i]) + bars.x.bandwidth() / 2;
      const ar = L.svg(s1);
      const notes = [
        ["+1.9 pts · z = 1.47 &lt; 2.054 · p = 0.14", "→ no significativa", C.ink2, false],
        ["+14.3 pts · z = 11.76", "→ significativa", C.plum, true],
        ["+23.6 pts · z = 19.48", "→ significativa", C.plum, true],
      ];
      const arrows = notes.map(([a, b, col, sig], i) => {
        const x1 = cx(i) + 30, y1 = top(i) - 55, x2 = cx(i + 1) - 30, y2 = top(i + 1) - 55;
        const arw = L.handArrow(ar, x1, y1, x2, y2, { bend: -0.35, color: sig ? C.plum : "#A8A398", width: 4 });
        if (!sig) arw.body.setAttribute("stroke-dasharray", "10 8");
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2 - 60;
        const eq = !sig ? L.s("text", { x: midX, y: midY + 20, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 54, fill: "#A8A398" }, ar, "=") : null;
        const lab = L.h("div", { class: "abs hand", style: { left: midX - 190 + "px", width: "380px", top: midY - (sig ? 100 : 140) + "px", textAlign: "center", fontSize: "33px", lineHeight: 1.05, color: col } }, s1, `${a}<br>${b}`);
        return { arw, eq, lab };
      });
      const n2 = L.h("div", { class: "abs hand", style: { left: "0", top: "1010px", width: "1920px", textAlign: "center", fontSize: "40px", color: C.plum, lineHeight: 1.1 } }, s1, `${L.ins(4)}Terminar la secundaria no cambia la proporción de lectores; el salto empieza en la media superior.`);
      gsap.set([ar, n2, ...arrows.map((a) => a.lab), ...arrows.map((a) => a.arw.g), ...arrows.filter((a) => a.eq).map((a) => a.eq)], { autoAlpha: 0 });
      tl.set(ar, { autoAlpha: 1 }, ">");
      arrows.forEach((a, i) => {
        tl.set(a.arw.g, { autoAlpha: 1 }, i ? ">0.3" : ">");
        L.arrowIn(tl, a.arw, "<", 0.8);
        if (a.eq) tl.fromTo(a.eq, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, ">-0.2");
        L.pop(tl, a.lab, "<", { from: { y: 10 } });
      });
      L.write(tl, n2, { pos: ">0.3", dur: 2.0 });

      // ================= Paso 3: IC Superior – Primaria o menos =================
      S.step();
      const s2 = L.h("div", { class: "layer" }, el);
      const t3 = L.h("div", { class: "abs h-title", style: { left: "200px", top: "140px", fontSize: "38px" } }, s2, "Superior – Primaria o menos · IC 96% [0.369, 0.422]");
      const sv2 = L.svg(s2);
      const [li, ls] = D.icSuperiorPrimaria;
      const hi = Charts.hinterval(sv2, { x: 130, y: 190, w: 1140, h: 290, xDomain: [0.34, 0.45], xTicks: [0.34, 0.36, 0.38, 0.4, 0.42, 0.44], fmt: (v) => v.toFixed(2), li, ls, color: C.plum, wash: C.plumL, xTitle: "Diferencia de proporciones", yLabel: "Diferencia" });
      const l3 = L.h("div", { class: "abs hand", style: { left: "1320px", top: "250px", width: "520px", fontSize: "42px", color: C.plum, lineHeight: 1.1 } }, s2, `${L.ins(5)}Entre 37 y 42 puntos más lectores con estudios superiores`);
      gsap.set([s2, t3, l3], { autoAlpha: 0 });
      tl.to(s1, { autoAlpha: 0, y: -60, duration: 0.6, ease: "power2.in" }, ">");
      tl.set(s2, { autoAlpha: 1 }, ">");
      L.write(tl, t3, { pos: ">", dur: 1.2 });
      hi.play(tl, "<0.4");
      L.write(tl, l3, { pos: ">", dur: 1.4 });

      // ================= Paso 4: escolaridad × acceso en el hogar =================
      S.step();
      const sv3 = L.svg(s2);
      const gr = Charts.grouped(sv3, {
        x: 130, y: 540, w: 1700, h: 520, cats, rows: D.escolaridadAcceso, yMax: 80, yTicks: [0, 20, 40, 60, 80],
        colors: [C.amberL, C.amberM, C.amberD], legendTitle: "Acceso en el hogar", legend: ["Bajo (0–1)", "Medio (2)", "Alto (3–4)"],
        yTitle: "% de lectores", m: { l: 110, r: 380, t: 20, b: 70 },
      });
      const n4 = L.h("div", { class: "abs hand", style: { left: "1500px", top: "750px", width: "360px", fontSize: "38px", color: C.amberD, lineHeight: 1.08 } }, s2, `${L.ins(6)}Con la misma escolaridad, el acceso alto en casa suma entre 19 y 24 puntos de lectores.`);
      gsap.set([sv3, n4], { autoAlpha: 0 });
      tl.set(sv3, { autoAlpha: 1 }, ">");
      gr.play(tl, ">");
      L.write(tl, n4, { pos: ">", dur: 1.8 });
    },
  });
})();
