/* Diapositiva 9 · Resultado 4: proporción de lectores por escolaridad (todo en una sola vista) */
(function () {
  const { C } = L;
  const D = window.DATA;

  const P = L.RES[3]; // color de este resultado

  Deck.add({
    accent: L.RES[3].a,
    transition: "watercolor",
    washColors: [P.l, P.m, P.l, P.a, P.m], // explosiones del color de este resultado
    notes: "Pruebas z entre niveles consecutivos (α = 0.04, valor frontera 2.054): Primaria → Secundaria +1.9 pts, z = 1.47, p = 0.14 (no significativa); Secundaria → Media superior +14.3 pts, z = 11.76; Media superior → Superior +23.6 pts, z = 19.48. Superior – Primaria o menos: IC 96% [0.369, 0.422]. La escolaridad es un indicador indirecto del nivel socioeconómico (el MOLEC no mide ingreso).",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 3");
      const head = L.head(el, "Proporción de lectores por escolaridad");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Barras: % de lectores por escolaridad =================
      const sv = L.svg(el);
      const cats = D.escolaridad.map((e) => e.nivel);
      const bars = Charts.vbars(sv, { x: 130, y: 190, w: 1660, h: 760, cats, values: D.escolaridad.map((e) => e.pct), yMax: 80, yTicks: [0, 20, 40, 60, 80], color: [P.l, P.m, P.a, P.d], labelFmt: "pct1", yTitle: "% de lectores", pad: 0.42, catSize: 28, labelSize: 32, m: { l: 110, r: 20, t: 40, b: 80 } });
      bars.play(tl, ">");

      // ================= Flechas: significativa / no significativa =================
      S.step();
      const g0x = 130 + 110, g0y = 190 + 40; // origen del área de la gráfica
      const top = (i) => g0y + bars.y(D.escolaridad[i].pct);
      const cx = (i) => g0x + bars.x(cats[i]) + bars.x.bandwidth() / 2;
      const ar = L.svg(el);
      const arrows = [false, true, true].map((sig, i) => {
        const x1 = cx(i) + 30, y1 = top(i) - 55, x2 = cx(i + 1) - 30, y2 = top(i + 1) - 55;
        const arw = L.handArrow(ar, x1, y1, x2, y2, { bend: -0.35, color: sig ? P.a : "#A8A398", width: 4 });
        if (!sig) arw.body.setAttribute("stroke-dasharray", "10 8");
        const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2 - 60;
        const eq = !sig ? L.s("text", { x: midX, y: midY + 20, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 54, fill: "#A8A398" }, ar, "=") : null;
        const lab = L.h("div", { class: "abs hand", style: { left: midX - 220 + "px", width: "440px", top: midY - (sig ? 80 : 120) + "px", textAlign: "center", fontSize: "58px", lineHeight: 1.05, color: sig ? P.a : C.ink2 } }, el, sig ? "significativa" : "no significativa");
        return { arw, eq, lab };
      });
      gsap.set([ar, ...arrows.map((a) => a.lab), ...arrows.map((a) => a.arw.g), ...arrows.filter((a) => a.eq).map((a) => a.eq)], { autoAlpha: 0 });
      tl.set(ar, { autoAlpha: 1 }, ">");
      arrows.forEach((a, i) => {
        tl.set(a.arw.g, { autoAlpha: 1 }, i ? ">0.3" : ">");
        L.arrowIn(tl, a.arw, "<", 0.8);
        if (a.eq) tl.fromTo(a.eq, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(3)" }, ">-0.2");
        L.pop(tl, a.lab, "<", { from: { y: 10 } });
      });

      // ================= Superior vs. primaria: intervalo de confianza =================
      S.step();
      // 1 · se van las flechas
      tl.to([ar, ...arrows.map((a) => a.lab)], { autoAlpha: 0, duration: 0.4 }, ">");
      // 2 · primaria a la izquierda, las otras tres a la derecha
      const piece = (i) => [bars.bars[i], bars.labels[i], bars.ax.tks[i]];
      const L0 = 560, R0 = 1360; // centros finales de primaria (a la izquierda) y superior (a la derecha)
      tl.to(piece(0), { x: L0 - cx(0), duration: 0.7, ease: "power3.inOut" }, ">");
      tl.to([1, 2, 3].flatMap(piece), { x: R0 - cx(3), duration: 0.7, ease: "power3.inOut" }, "<0.1");
      // 3 · fuera secundaria y media superior; entre las dos queda un "vs"
      tl.to([1, 2].flatMap(piece), { autoAlpha: 0, duration: 0.35 }, "<0.15");
      const vs = L.s("text", { x: (L0 + R0) / 2 - 130 - 110, y: 0, "text-anchor": "middle", "font-family": "Fraunces", "font-style": "italic", "font-weight": 700, "font-size": 96, fill: P.d }, bars.g, "vs");
      gsap.set(vs, { autoAlpha: 0 });
      // 4 · el eje X sube (se comprime el eje Y) y las barras se ensanchan para dejar lugar al intervalo
      const ih = bars.ih, bw = bars.x.bandwidth(), vals = D.escolaridad.map((e) => e.pct);
      const K = 0.46, WB = 1.55, h = ih * K, yy = (v) => h * (1 - v / 80);
      const v = { duration: 1.0, ease: "power3.inOut" };
      tl.addLabel("squeeze", ">0.1");
      tl.to(bars.ay.line, Object.assign({ scaleY: K, svgOrigin: "-14 0" }, v), "squeeze");
      bars.ay.tks.forEach((t, i) => { const tv = [0, 20, 40, 60, 80][i]; tl.to(t, Object.assign({ y: yy(tv) - ih * (1 - tv / 80) }, v), "squeeze"); });
      if (bars.ay.tt) tl.to(bars.ay.tt, Object.assign({ attr: { transform: `translate(-84,${h / 2}) rotate(-90)` } }, v), "squeeze");
      tl.to(bars.ax.g, Object.assign({ y: h - ih }, v), "squeeze");
      bars.bars.forEach((b, i) => {
        const c = bars.x(cats[i]) + bw / 2, w = bw * WB;
        tl.to(b, Object.assign({ attr: { x: c - w / 2, width: w, y: yy(vals[i]), height: h - yy(vals[i]) } }, v), "squeeze");
        tl.to(bars.labels[i], Object.assign({ attr: { y: yy(vals[i]) - 12 } }, v), "squeeze");
      });
      vs.setAttribute("y", h * 0.62);
      tl.fromTo(vs, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, ">-0.3");
      // 5 · el intervalo, centrado
      const [li, ls] = D.icSuperiorPrimaria;
      const mid = (li + ls) / 2;
      const t3 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "598px", textAlign: "center", fontSize: "40px" } }, el, "Diferencia entre primaria o menos y superior");
      const t3b = L.h("div", { class: "abs", style: { left: 0, width: "1920px", top: "650px", textAlign: "center", fontSize: "30px", fontWeight: 800, color: P.a } }, el, `IC 96% [${li.toFixed(3)}, ${ls.toFixed(3)}]`);
      const sv2 = L.svg(el);
      const hi = Charts.hinterval(sv2, { x: 280, y: 680, w: 1360, h: 270, m: { l: 70, r: 70, t: 30, b: 100 }, xDomain: [0.34, 0.45], xTicks: [0.34, 0.36, 0.38, 0.4, 0.42, 0.44], fmt: (v) => v.toFixed(2), li, ls, point: mid, color: P.a, wash: P.l, xTitle: "Diferencia de proporciones", liLabel: li.toFixed(3), lsLabel: ls.toFixed(3) });
      const midLab = Charts.T(hi.g, hi.x(mid), hi.cy - 30, `diferencia ≈ ${mid.toFixed(3)}`, { "text-anchor": "middle", "font-weight": 800, "font-size": 26, fill: C.ink });
      const l3 = L.h("div", { class: "abs hand", style: { left: 0, width: "1920px", top: "985px", textAlign: "center", fontSize: "46px", color: P.a } }, el, `${L.ins(1)}Entre 37 y 42 puntos más lectores con estudios superiores`);
      gsap.set([t3, t3b, l3, sv2, midLab], { autoAlpha: 0 });
      L.write(tl, t3, { pos: ">0.1", dur: 1.0 });
      L.pop(tl, t3b, ">", { from: { y: 8 } });
      tl.set(sv2, { autoAlpha: 1 }, "<");
      hi.play(tl, "<0.2");
      tl.fromTo(midLab, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.1");
      L.write(tl, l3, { pos: ">0.2", dur: 1.4 });
    },
  });
})();
