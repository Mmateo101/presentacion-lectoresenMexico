/* Diapositiva 12 · Conclusiones: separadores que salen del libro */
(function () {
  const { C } = L;
  const { person, mood, Props } = Chars;

  Deck.add({
    transition: "pageTurn",
    notes: "",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Conclusiones");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ---- Libro casi cerrado ----
      const stage = L.h("div", { class: "layer" }, el);
      const PAGE_TOP = 800;
      const svg = L.svg(stage);
      const bookG = L.s("g", {}, svg);
      L.s("ellipse", { cx: 960, cy: 985, rx: 720, ry: 30, fill: "rgba(60,40,20,.12)" }, bookG);
      L.s("path", { d: `M300,${PAGE_TOP} Q960,${PAGE_TOP - 40} 1620,${PAGE_TOP} L1640,880 Q960,850 280,880 Z`, fill: "#FBF6EA", stroke: C.ink, "stroke-width": 3 }, bookG);
      for (let i = 1; i < 6; i++) L.s("path", { d: `M${300 - i * 3},${PAGE_TOP + i * 13} Q960,${PAGE_TOP - 40 + i * 12} ${1620 + i * 3},${PAGE_TOP + i * 13}`, fill: "none", stroke: "#D8CDB8", "stroke-width": 2 }, bookG);
      L.s("path", { d: "M260,880 Q960,846 1660,880 L1680,960 Q960,930 240,960 Z", fill: "#6A4179", stroke: C.ink, "stroke-width": 3.5 }, bookG);
      L.s("path", { d: "M300,900 Q960,870 1620,900", fill: "none", stroke: "#D8B66A", "stroke-width": 3 }, bookG);

      const concl = [
        "El acceso en la infancia se asocia sobre todo con volverse lector: con acceso alto en casa lee 59.7%; con acceso bajo, 28.1%.",
        "El hogar pesa más que la escuela: con estímulos solo en casa lee 46.4%; solo en la escuela, 27.0%.",
        "La escuela compensa solo en parte (+5 a +10 puntos) y suele reforzar el acceso del hogar.",
        "En cuántos libros se leen, la diferencia es pequeña (menos de un libro al año), pero la variabilidad es enorme.",
      ];
      const cols = [C.amberM, C.blueM, C.plum, "#7FA77A"];
      const W = 380, H = 600, TAB = 80;
      const marks = concl.map((t, i) => {
        const x = 205 + i * 400;
        // ventana que recorta: lo que está "dentro" del libro no se ve
        const win = L.h("div", { class: "abs", style: { left: x + "px", top: PAGE_TOP - H - 20 + "px", width: W + "px", height: H + 20 + "px", overflow: "hidden" } }, stage);
        const card = L.h("div", { style: { position: "absolute", left: 0, top: "20px", width: W + "px", height: H + "px", background: "#fffdf8", border: `3px solid ${C.ink}`, borderRadius: "14px 14px 0 0", boxShadow: "4px 6px 0 rgba(43,42,51,.08)" } }, win);
        L.h("div", { style: { height: TAB + "px", background: cols[i], borderBottom: `3px solid ${C.ink}`, borderRadius: "10px 10px 0 0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "40px", color: "#fff" } }, card, String(i + 1));
        const txt = L.h("div", { style: { padding: "24px 26px", fontSize: "35px", lineHeight: 1.28 } }, card, t);
        L.h("div", { style: { position: "absolute", left: "50%", bottom: "-2px", width: "56px", marginLeft: "-28px", height: "40px", background: cols[i], clipPath: "polygon(0 0,100% 0,100% 100%,50% 60%,0 100%)" } }, card);
        gsap.set(card, { y: H - TAB + 6 });
        return { win, card, txt };
      });
      tl.fromTo(bookG, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0.2);
      tl.fromTo(marks.map((m) => m.card), { y: H + 10 }, { y: H - TAB + 6, duration: 0.5, ease: "back.out(2)", stagger: 0.12 }, ">-0.2");

      marks.forEach((m) => {
        S.step();
        tl.to(m.card, { y: -4, duration: 0.9, ease: "power3.out" }, ">");
        tl.to(m.card, { y: 0, duration: 0.3, ease: "power2.inOut" }, ">");
        tl.fromTo(m.txt, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "<-0.4");
      });

      // ---- Paso final: Héctor y Eduardo, lectores en la misma biblioteca ----
      S.step();
      const lib = L.h("div", { class: "layer" }, el);
      const ls = L.svg(lib);
      const wash = L.wash(ls, { cx: 960, cy: 520, rx: 900, ry: 420, color: C.plumL, opacity: 0.35, seed: 31, layers: 1 });
      const shelves = [140, 420, 1280, 1560].map((x, i) => Props.shelf(ls, { x, y: 230, w: 230, h: 470, rows: 5, books: 0.97, seed: 40 + i }));
      L.s("rect", { x: 0, y: 700, width: 1920, height: 6, fill: C.ink, opacity: 0.6 }, ls);
      const mkReader = (who, x, shirt, style, pants, flip) => {
        const g = L.s("g", {}, ls);
        Props.chair(g, { x: x - 26, y: 700 });
        const p = person(g, { who, age: "adult", shirt, style, pose: "sit", pants, mood: "smile", x: x - 36, y: 700, s: 1.1 });
        gsap.set(p.arms[0], { rotation: -62, svgOrigin: p.arms[0]._pivot.join(" ") });
        gsap.set(p.arms[1], { rotation: -62, svgOrigin: p.arms[1]._pivot.join(" ") });
        L.book(g, { x: x + 20, y: 452, w: 110, h: 64, color: shirt, open: true });
        if (flip) gsap.set(g, { scaleX: -1, svgOrigin: `${x} 700` });
        return { g, p };
      };
      const rH = mkReader("hector", 800, C.blueM, "short", "#4F5866", false);
      const rE = mkReader("eduardo", 1120, C.amberM, "curly", "#5E5148", true);
      const sp = [[700, 330], [960, 300], [1220, 330]].map(([x, y], i) => {
        const g = L.s("g", { transform: `translate(${x},${y})` }, ls);
        L.s("path", { d: "M0,-16 L4,-4 L16,0 L4,4 L0,16 L-4,4 L-16,0 L-4,-4 Z", fill: [C.blueM, C.plum, C.amberM][i], stroke: C.ink, "stroke-width": 1.5 }, g);
        return g;
      });
      const cap = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "770px", textAlign: "center", fontSize: "50px", fontStyle: "italic", color: C.plum } }, lib, "La desigualdad en el acceso empieza en casa… y ahí también puede empezar la solución.");
      const foot = L.h("div", { class: "abs", style: { left: "0", width: "1920px", top: "985px", textAlign: "center", fontSize: "25px", color: C.ink2 } }, lib, "Resultados de asociación con 96% de confianza; no implican causalidad.");
      gsap.set([lib, cap, foot], { autoAlpha: 0 });
      tl.to(stage, { autoAlpha: 0, scale: 0.92, y: 40, duration: 0.8, ease: "power2.in" }, ">");
      tl.set(lib, { autoAlpha: 1 }, ">-0.1");
      L.bloom(tl, wash, "<", 1.2);
      tl.fromTo(shelves, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.1 }, "<0.2");
      tl.fromTo(rH.g, { autoAlpha: 0, x: -200 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" }, ">-0.2");
      tl.fromTo(rE.g, { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 0.9, ease: "power3.out" }, "<");
      mood(tl, rH.p, "big", ">");
      mood(tl, rE.p, "big", "<");
      tl.fromTo(sp, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, rotation: 90, duration: 0.6, stagger: 0.15, ease: "back.out(2)" }, "<");
      L.write(tl, cap, { pos: ">", dur: 2.4 });
      L.pop(tl, foot, ">0.2", { from: { y: 8 } });
    },
  });
})();
