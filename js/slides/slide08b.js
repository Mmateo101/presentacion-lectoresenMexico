/* Resultado 1 · Proporción de lectores por nivel de acceso: hogar (naranja) vs. escuela (azul) */
(function () {
  const { C } = L;
  const { person } = Chars;
  const D = window.DATA;

  /* Cambio de escena dentro de la diapositiva: la anterior se va como hoja, la nueva entra */
  function sceneSwap(tl, out, inn) {
    tl.to(out, { x: -120, autoAlpha: 0, rotationY: -12, transformOrigin: "0% 50%", transformPerspective: 1600, duration: 0.7, ease: "power2.in" }, ">");
    tl.fromTo(inn, { autoAlpha: 0, x: 120 }, { autoAlpha: 1, x: 0, duration: 0.7, ease: "power2.out" }, ">-0.15");
  }

  const P = L.RES[0]; // color de este resultado

  Deck.add({
    accent: L.RES[0].a,
    transition: "pageTurn",
    notes: "Todas las pruebas z entre niveles rechazan H₀ con α = 0.04 (valor frontera z = ±2.054).",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 1");
      const head = L.head(el, `Proporción de lectores: acceso en el <span style="color:${C.amberM}">hogar</span> vs. en la <span style="color:${C.blueM}">escuela</span>`);
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Escena 1: intervalos por nivel =================
      const s1 = L.h("div", { class: "layer" }, el);
      const sv1 = L.svg(s1);
      const toRows = (arr) => arr.map((r) => ({ label: r.nivel, p: r.p, li: r.li, ls: r.ls }));
      const iH = Charts.intervals(sv1, { x: 80, y: 150, w: 870, h: 760, rows: toRows(D.niveles.hogar), xDomain: [0.2, 0.7], xTicks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7], color: [C.amberL, C.amberL, C.amberL], lineColor: C.amberD, title: "Acceso en el hogar", xTitle: "Proporción de lectores" });
      const iE = Charts.intervals(sv1, { x: 980, y: 150, w: 870, h: 760, rows: toRows(D.niveles.escuela), xDomain: [0.2, 0.7], xTicks: [0.2, 0.3, 0.4, 0.5, 0.6, 0.7], color: [C.blueL, C.blueL, C.blueL], lineColor: C.blueD, title: "Acceso en la escuela", xTitle: "Proporción de lectores" });
      iH.title.setAttribute("fill", C.amberD);
      iE.title.setAttribute("fill", C.blueD);
      gsap.set([s1], { autoAlpha: 0 });
      tl.set(s1, { autoAlpha: 1 }, ">");
      iH.play(tl, ">");
      iE.play(tl, "<0.4");

    },
  });
})();
