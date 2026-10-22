/* Diapositiva 5 · Base de datos (MOLEC) */
(function () {
  const { C } = L;

  Deck.add({
    transition: "inkSpread",
    notes: "Las preguntas y códigos de 2019 a 2024 son iguales, así que las seis bases se pudieron unir.",
    build(el, S) {
      const tl = S.tl;
      const MX = window.MEXICO;
      const head = L.head(el, "Módulo sobre Lectura (MOLEC) · INEGI", "Se levanta cada febrero desde 2015 como módulo de la Encuesta Nacional sobre Confianza del Consumidor (ENCO).");

      // ---- Paso 1 (entrada): el mapa se dibuja solo ----
      const svg = L.svg(el);
      const ms = 0.98;
      const map = L.s("g", {}, svg);
      gsap.set(map, { x: 960 - (MX.width * ms) / 2, y: 255, scale: ms, transformOrigin: "0 0" });
      const wash = L.s("path", { d: MX.outline, fill: C.amberL, opacity: 0.35, filter: "url(#wc2)" }, map);
      const fills = [C.blueL, C.amberL, C.plumL, "#D7E8C8"];
      const states = MX.states.map((st, i) => L.s("path", { d: st.d, fill: fills[i % 4], "fill-opacity": 0.0, stroke: C.ink, "stroke-width": 1.6, "stroke-linejoin": "round", filter: "url(#ink)" }, map));
      const cdmx = MX.states.find((s) => s.id === "MX-CMX").city;
      const cities = MX.states.map((st) => {
        const g = L.s("g", { transform: `translate(${st.city[0]},${st.city[1]})` }, map);
        const ring = L.s("circle", { r: 9, fill: "none", stroke: C.plum, "stroke-width": 2.5, style: "opacity:0" }, g);
        const dot = L.s("circle", { r: 7.5, fill: C.plum, stroke: "#fff", "stroke-width": 2 }, g);
        return { g, ring, dot, d: Math.hypot(st.city[0] - cdmx[0], st.city[1] - cdmx[1]) };
      }).sort((a, b) => a.d - b.d);

      L.pop(tl, head, 0, { from: { y: -20 } });
      tl.fromTo(wash, { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 1.2 }, 0.2);
      L.draw(tl, states, 0.2, { duration: 1.6, stagger: 0.035, ease: "power1.inOut" });
      tl.to(states, { attr: { "fill-opacity": 0.55 }, duration: 0.8, stagger: 0.02 }, ">-0.8");
      cities.forEach((c, i) => {
        const t = 2.4 + c.d / 420;
        tl.fromTo(c.dot, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, t);
        tl.fromTo(c.ring, { scale: 0.8, opacity: 1, transformOrigin: "50% 50%" }, { scale: 3.2, opacity: 0, duration: 0.9, ease: "power2.out", immediateRender: false }, t);
      });

      // ---- Paso 2: el mapa a la izquierda; contadores ----
      S.step();
      const rows = [
        ["6", `${L.num(6)} levantamientos: 2019–2024`],
        ["#", `${L.num(11966)} personas entrevistadas`],
        ["≡", `${L.num(108)} variables por año`],
        ["●", `${L.num(32)} áreas urbanas de 100 mil habitantes o más`],
        ["18", "Personas de 18 años o más que saben leer y escribir"],
        ["1", "Unidad de análisis: una persona"],
      ];
      const icons = ["cal", "people", "list", "pin", "adult", "one"];
      const box = L.h("div", { class: "abs", style: { left: "1110px", top: "255px", width: "740px" } }, el);
      const rEls = rows.map((r, i) => {
        const row = L.h("div", { style: { position: "relative", paddingLeft: "86px", minHeight: "66px", marginBottom: "16px", fontSize: "31px", lineHeight: 1.25 } }, box, r[1]);
        const ic = L.s("svg", { width: 62, height: 62, viewBox: "0 0 62 62", style: "position:absolute;left:0;top:-6px" }, row);
        L.s("circle", { cx: 31, cy: 31, r: 27, fill: [C.blueL, C.amberL, C.plumL, C.plumL, "#D7E8C8", C.blueL][i], stroke: C.ink, "stroke-width": 2.5 }, ic);
        const st = { fill: "none", stroke: C.ink, "stroke-width": 2.6, "stroke-linecap": "round", "stroke-linejoin": "round" };
        const k = icons[i];
        if (k === "cal") { L.s("rect", Object.assign({ x: 18, y: 20, width: 26, height: 24, rx: 3 }, st), ic); L.s("path", Object.assign({ d: "M18,28 H44 M24,16 V22 M38,16 V22" }, st), ic); }
        if (k === "people") { L.s("circle", Object.assign({ cx: 24, cy: 24, r: 5 }, st), ic); L.s("circle", Object.assign({ cx: 38, cy: 24, r: 5 }, st), ic); L.s("path", Object.assign({ d: "M15,44 q9,-14 18,0 M29,44 q9,-14 18,0" }, st), ic); }
        if (k === "list") L.s("path", Object.assign({ d: "M20,22 H42 M20,31 H42 M20,40 H36" }, st), ic);
        if (k === "pin") L.s("path", Object.assign({ d: "M31,46 C22,34 20,30 20,26 a11,11 0 0 1 22,0 C42,30 40,34 31,46 Z M31,22 a4,4 0 1 0 0.1,0" }, st), ic);
        if (k === "adult") { L.s("path", Object.assign({ d: "M20,40 V22 l5,0 M33,22 a5,5 0 1 1 0,9 a5,5 0 1 1 0,9 a5,5 0 1 1 0,-9 a5,5 0 1 1 0,-9" }, st), ic); }
        if (k === "one") { L.s("circle", Object.assign({ cx: 31, cy: 24, r: 6 }, st), ic); L.s("path", Object.assign({ d: "M21,45 q10,-16 20,0" }, st), ic); }
        return row;
      });
      gsap.set(box, { autoAlpha: 0 });
      tl.to(map, { x: 70, y: 280, scale: 0.92, duration: 1.2, ease: "power3.inOut" }, ">");
      tl.set(box, { autoAlpha: 1 }, ">-0.4");
      rEls.forEach((r, i) => {
        tl.fromTo(r, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, i ? ">-0.2" : ">");
        if (r.querySelector(".num")) L.counts(tl, r, "<", 1.2);
      });

      // ---- Paso 3: estante con 6 libros; 2025 queda fuera ----
      S.step();
      const sh = L.svg(el);
      const shelfY = 948;
      const plank = L.s("path", { d: `M1130,${shelfY} H1700`, stroke: "#8A6A48", "stroke-width": 12, "stroke-linecap": "round" }, sh);
      const bracket = L.s("path", { d: `M1170,${shelfY + 6} v26 M1660,${shelfY + 6} v26`, stroke: "#8A6A48", "stroke-width": 8, "stroke-linecap": "round" }, sh);
      const cols = [C.blueM, C.amberM, C.plum, C.blueD, C.amberD, "#7FA77A"];
      const mkBook = (x, year, col, h = 168) => {
        const g = L.s("g", {}, sh);
        gsap.set(g, { x, y: shelfY - 6 - h });
        L.s("rect", { x: 0, y: 0, width: 66, height: h, rx: 5, fill: col, stroke: C.ink, "stroke-width": 3 }, g);
        L.s("line", { x1: 8, x2: 58, y1: 18, y2: 18, stroke: "#fff", "stroke-width": 2.5, opacity: 0.7 }, g);
        L.s("line", { x1: 8, x2: 58, y1: h - 20, y2: h - 20, stroke: "#fff", "stroke-width": 2.5, opacity: 0.7 }, g);
        L.s("text", { x: 33, y: h / 2, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 24, fill: "#fff", transform: `rotate(-90 33 ${h / 2})`, "dominant-baseline": "middle" }, g, year);
        return g;
      };
      const books = [2019, 2020, 2021, 2022, 2023, 2024].map((y, i) => mkBook(1160 + i * 72, String(y), cols[i], 160 + (i % 3) * 8));
      const b25 = mkBook(1600, "2025", "#B9B4AA", 150);
      const cap = L.h("div", { class: "abs hand", style: { left: "1110px", top: "985px", width: "760px", fontSize: "36px", color: C.crimson } }, el, "Excluimos 2025: cambió el cuestionario y el diseño de la muestra.");
      gsap.set([sh, cap], { autoAlpha: 0 });
      tl.set(sh, { autoAlpha: 1 }, ">");
      L.draw(tl, plank, ">", { duration: 0.5 });
      tl.fromTo(bracket, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<");
      books.forEach((b, i) => tl.fromTo(b, { x: 1960, rotation: 0 }, { x: 1160 + i * 72, duration: 0.55, ease: "power3.out" }, i ? "<0.12" : ">"));
      tl.fromTo(b25, { x: 1980, autoAlpha: 1 }, { x: 1600, duration: 0.6, ease: "power2.out" }, ">0.3");
      tl.to(b25, { x: 1640, rotation: 14, transformOrigin: "100% 100%", duration: 0.25, ease: "power2.out" }, ">");
      tl.to(b25, { x: 1830, y: shelfY + 60, rotation: 70, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, ">0.15");
      L.write(tl, cap, { pos: "<0.2", dur: 1.6 });
    },
  });
})();
