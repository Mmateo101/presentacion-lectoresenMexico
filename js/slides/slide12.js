/* Diapositiva 12 · Conclusiones: un librero de toda la hoja */
(function () {
  const { C } = L;

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
    },
  });
})();
