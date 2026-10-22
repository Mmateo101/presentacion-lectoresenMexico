/* Diapositiva 12 · Conclusiones: un librero de toda la hoja */
(function () {
  const { C } = L;
  const { person, mood, Props } = Chars;

  // Las cuatro conclusiones (lenguaje de asociación, con los datos que las respaldan)
  const CONCL = [
    ["El acceso en el hogar pesa más que el acceso en la escuela."],
    ["El acceso en el hogar y el de la escuela van de la mano."],
    ["Terminar la primaria o la secundaria da una proporción de lectores parecida."],
    ["Entre más libros había en casa, más varía cuántos libros se leen."],
  ];
  // zona del librero donde aparece cada conclusión: [x0, x1, filas]
  const ZONES = [[60, 960, [1, 2]], [960, 1860, [3, 4]], [960, 1860, [1, 2]], [60, 960, [3, 4]]];

  Deck.add({
    transition: "pageTurn",
    notes: "Cuatro conclusiones. Todas son asociaciones con 96% de confianza; no implican causalidad.",
    build(el, S) {
      const tl = S.tl;
      const stage = L.h("div", { class: "layer" }, el);
      const svg = L.svg(stage);
      const WOOD = "#9C6B43", WOOD_D = "#6E4627";
      const ROW_TOP = [30, 234, 438, 642, 846], ROW_H = 180; // cada fila: libros apoyados en su tabla
      // armazón del librero
      L.s("rect", { x: 20, y: 20, width: 1880, height: 1040, rx: 10, fill: "#E9D6BC", stroke: WOOD_D, "stroke-width": 6 }, svg);
      L.s("rect", { x: 20, y: 20, width: 34, height: 1040, fill: WOOD, stroke: WOOD_D, "stroke-width": 4 }, svg);
      L.s("rect", { x: 1866, y: 20, width: 34, height: 1040, fill: WOOD, stroke: WOOD_D, "stroke-width": 4 }, svg);
      const booksG = L.s("g", {}, svg);
      ROW_TOP.forEach((t) => L.s("rect", { x: 20, y: t + ROW_H, width: 1880, height: 16, fill: WOOD, stroke: WOOD_D, "stroke-width": 3 }, svg));

      // libros: cada uno es un grupo (lomo + bandas + letra opcional)
      const PAL = [C.blueM, C.amberM, C.plum, C.blueD, C.amberD, "#7FA77A", C.crimson, "#4E2E5B", "#C97B3A", "#3D6E8F", "#A8A398", "#D9A441"];
      const r = L.rng(12);
      const books = [];
      const WORD = "CONCLUSIONES";
      ROW_TOP.forEach((top, row) => {
        const base = top + ROW_H;
        let x = 62;
        // fila 0: el título pintado en los lomos, centrado
        const wordStart = row === 0 ? 960 - (WORD.length * 84) / 2 : Infinity;
        let li = 0;
        while (x < 1856) {
          const isLetter = row === 0 && x >= wordStart - 40 && li < WORD.length && x + 84 <= 1856 && x >= wordStart;
          if (row === 0 && li < WORD.length && x < wordStart && x + 60 > wordStart) { x = wordStart; continue; }
          const w = isLetter ? 80 : 36 + Math.floor(r() * 40);
          if (x + w > 1856) break;
          const h = isLetter ? 168 : 112 + Math.floor(r() * 60);
          const col = isLetter ? ["#4E2E5B", C.plum][li % 2] : PAL[Math.floor(r() * PAL.length)];
          const g = L.s("g", {}, booksG);
          gsap.set(g, { x, y: base - h });
          const lean = !isLetter && r() < 0.06;
          L.s("rect", { x: 0, y: 0, width: w, height: h, rx: 4, fill: col, stroke: C.ink, "stroke-width": 2.5 }, g);
          L.s("rect", { x: 4, y: 14, width: w - 8, height: 6, fill: "rgba(255,255,255,.55)" }, g);
          L.s("rect", { x: 4, y: h - 22, width: w - 8, height: 6, fill: "rgba(255,255,255,.55)" }, g);
          if (isLetter) {
            L.s("text", { x: w / 2, y: h / 2 + 18, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 50, fill: "#F2D48A" }, g, WORD[li]);
            li++;
          } else if (w > 56 && r() < 0.5) {
            L.s("rect", { x: w / 2 - 8, y: h * 0.35, width: 16, height: h * 0.3, rx: 3, fill: "rgba(255,255,255,.35)" }, g);
          }
          if (lean) gsap.set(g, { rotation: -6, transformOrigin: "0% 100%" });
          books.push({ g, row, cx: x + w / 2, x, y: base - h, letter: isLetter });
          x += w + (isLetter ? 4 : 2);
        }
      });
      const letterBooks = books.filter((b) => b.letter);

      // ---- Entrada: el librero se llena; el título brilla en los lomos ----
      tl.fromTo(books.map((b) => b.g), { y: "-=60", autoAlpha: 0 }, { y: "+=60", autoAlpha: 1, duration: 0.45, ease: "bounce.out", stagger: { amount: 1.4, from: "random" } }, 0.2);
      tl.fromTo(letterBooks.map((b) => b.g.querySelector("text")), { attr: { fill: "#F2D48A" } }, { attr: { fill: "#FFF3C4" }, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.07 }, ">");

      // ---- Cada conclusión: caen los libros de una zona y aparece el texto ----
      const panels = CONCL.map(([t], i) => {
        const [x0, x1, rows] = ZONES[i];
        const y0 = ROW_TOP[rows[0]] + 8, y1 = ROW_TOP[rows[1]] + ROW_H;
        const p = L.h("div", { class: "abs", style: { left: x0 + 40 + "px", top: y0 + "px", width: x1 - x0 - 80 + "px", height: y1 - y0 + "px", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 44px", background: "rgba(251,248,241,.95)", borderRadius: "18px", boxShadow: "0 12px 30px rgba(80,50,20,.25)" } }, stage);
        const tt = L.h("div", { class: "h-title", style: { fontSize: "60px", lineHeight: 1.15, color: C.ink } }, p, `${L.ins(i + 1)}${t}`);
        const zone = books.filter((b) => rows.includes(b.row) && b.cx > x0 && b.cx < x1);
        return { p, tt, zone };
      });
      gsap.set(panels.map((p) => p.p), { autoAlpha: 0 });
      const fall = (zone, pos) => tl.to(zone.map((b) => b.g), {
        y: (k) => 1150 + (k % 5) * 30, x: (k) => zone[k].x + ((k % 3) - 1) * 60, rotation: (k) => ((k * 37) % 120) - 60,
        duration: 0.8, ease: "power2.in", stagger: { amount: 0.5, from: "random" },
      }, pos);
      const restore = (zone, pos) => tl.to(zone.map((b) => b.g), { x: (k) => zone[k].x, y: (k) => zone[k].y, rotation: 0, duration: 0.6, ease: "bounce.out", stagger: { amount: 0.5, from: "random" } }, pos);
      const dropText = (p, pos) => {
        const chars = [...p.tt.querySelectorAll(".ch, .ins")];
        tl.to(chars, { y: () => 700 + Math.random() * 300, rotation: () => (Math.random() - 0.5) * 240, autoAlpha: 0, duration: 0.9, ease: "power2.in", stagger: { amount: 0.4, from: "random" } }, pos);
        tl.to(p.p, { backgroundColor: "rgba(251,248,241,0)", boxShadow: "0 0 0 rgba(0,0,0,0)", duration: 0.4 }, "<");
      };
      panels.forEach((p) => { p.tt._chars = L.splitChars(p.tt); });
      panels.forEach((p, i) => {
        S.step();
        if (i > 0) {
          dropText(panels[i - 1], ">");
          restore(panels[i - 1].zone, ">-0.3");
        }
        fall(p.zone, i ? ">-0.2" : ">");
        tl.fromTo(p.p, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(1.6)" }, ">-0.2");
        gsap.set([p.tt], { autoAlpha: 0 });
        L.write(tl, p.tt, { pos: ">", dur: 1.4 });
      });
      // al final, la última conclusión también se cae y vuelven sus libros
      S.step();
      dropText(panels[3], ">");
      restore(panels[3].zone, ">-0.3");

      // ---- Paso final: Héctor y Eduardo, lectores en la misma biblioteca ----
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
