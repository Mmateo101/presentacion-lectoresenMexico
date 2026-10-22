/* Diapositiva 9 · Lectores por nivel de acceso y compensación de la escuela */
(function () {
  const { C } = L;
  const { person } = Chars;
  const D = window.DATA;

  /* Cambio de escena dentro de la diapositiva: la anterior se va como hoja, la nueva entra */
  function sceneSwap(tl, out, inn) {
    tl.to(out, { x: -120, autoAlpha: 0, rotationY: -12, transformOrigin: "0% 50%", transformPerspective: 1600, duration: 0.7, ease: "power2.in" }, ">");
    tl.fromTo(inn, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power2.out" }, ">-0.15");
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Todas las pruebas z entre niveles rechazan H₀ con α = 0.04 (valor frontera z = ±2.054).",
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
      const n1 = L.h("div", { class: "abs hand", style: { left: "0", width: "1920px", top: "975px", textAlign: "center", fontSize: "42px", color: C.plum } }, s1, `${L.ins(2)}Los intervalos no se traslapan: cada nivel es distinto en la población`);
      gsap.set([s1, n1], { autoAlpha: 0 });
      S.step();
      tl.set(s1, { autoAlpha: 1 }, ">");
      iH.play(tl, ">");
      iE.play(tl, "<0.4");
      L.write(tl, n1, { pos: ">", dur: 1.6 });

      // ================= Escena 2: ¿la escuela compensa? =================
      S.step();
      const s4 = L.h("div", { class: "layer" }, el);
      const t4 = L.h("div", { class: "abs h-title", style: { left: "420px", width: "1400px", top: "180px", fontSize: "40px", lineHeight: 1.2 } }, s4, "Escuela alta – escuela baja, entre quienes tuvieron acceso bajo en casa");
      const v4 = L.h("div", { class: "abs", style: { left: "420px", top: "280px", fontSize: "34px", fontWeight: 700, color: C.blueD } }, s4, `+${L.num(7.8, "d1")} puntos · IC 96% [5.1, 10.5]`);
      const sv4 = L.svg(s4);
      const hi = Charts.hinterval(sv4, { x: 420, y: 360, w: 1380, h: 400, xDomain: [-0.01, 0.13], xTicks: [0, 0.02, 0.04, 0.06, 0.08, 0.1, 0.12], fmt: (v) => v.toFixed(2), li: D.compensacion.li, ls: D.compensacion.ls, point: D.compensacion.dif, zero: 0, color: C.blueD, wash: C.blueL, xTitle: "Diferencia de proporciones" });
      const hec4 = person(sv4, { who: "hector", age: "adult", shirt: C.blueM, pants: "#4F5866", x: 200, y: 900, s: 1.2 });
      const m4 = L.h("div", { class: "abs h-title", style: { left: "420px", width: "1400px", top: "880px", fontSize: "50px", fontStyle: "italic", color: C.plum, textAlign: "center" } }, s4, `${L.ins(3)}La escuela sí ayuda… pero compensa solo una parte.`);
      gsap.set([s4, t4, v4, m4, hec4.g], { autoAlpha: 0 });
      sceneSwap(tl, s1, s4);
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
