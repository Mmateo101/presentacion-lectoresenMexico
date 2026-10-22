/* Portada de resultados: los cinco resultados, en el orden en que se presentan */
(function () {
  const { C } = L;
  const ITEMS = [
    "Proporción de lectores según el índice de acceso",
    "Prueba de independencia: hogar y escuela",
    "Diferencia de proporciones: solo escuela vs. solo hogar",
    "Escolaridad: primaria vs. secundaria",
    "Libros en casa y cuántos libros se leen",
  ];
  const COLS = [C.amberM, C.plum, C.blueM, "#7FA77A", C.amberD];

  Deck.add({
    transition: "pageTurn",
    notes: "Orden de los resultados que vamos a presentar.",
    build(el, S) {
      const tl = S.tl;
      const svg = L.svg(el);
      const w1 = L.wash(svg, { cx: 120, cy: 120, rx: 420, ry: 300, color: C.plumL, opacity: 0.5, seed: 5 });
      const w2 = L.wash(svg, { cx: 1820, cy: 980, rx: 420, ry: 300, color: C.amberL, opacity: 0.5, seed: 9 });
      const title = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "90px", textAlign: "center", fontSize: "130px", color: C.plum } }, el, "Resultados");
      const orn = L.s("path", { d: "M610,300 C760,300 820,282 920,296 S960,318 980,300 S1040,282 1100,296 S1160,300 1310,300", fill: "none", stroke: C.plum, "stroke-width": 3 }, svg);
      const rows = ITEMS.map((t, i) => {
        const r = L.h("div", { class: "abs", style: { left: "290px", top: 360 + i * 128 + "px", width: "1340px", height: "104px", display: "flex", alignItems: "center", gap: "32px", background: "#FFFDF8", borderRadius: "10px 52px 52px 10px", boxShadow: "0 8px 22px rgba(120,90,50,.12)", borderLeft: `14px solid ${COLS[i]}`, padding: "0 30px" } }, el);
        L.h("div", { class: "h-title", style: { flex: "none", width: "72px", height: "72px", borderRadius: "50%", background: COLS[i], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" } }, r, String(i + 1));
        L.h("div", { class: "h-title", style: { fontSize: "40px", lineHeight: 1.1, color: C.ink } }, r, t);
        return r;
      });
      tl.fromTo([w1, w2], { autoAlpha: 0, scale: 0.5, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: "power2.out" }, 0);
      L.write(tl, title, { pos: 0.2, dur: 1.0 });
      L.draw(tl, orn, ">-0.2", { duration: 0.8 });
      tl.fromTo(rows, { autoAlpha: 0, x: -80 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power3.out", stagger: 0.22 }, ">-0.2");
    },
  });
})();
