/* Diapositiva 6 · Preparación de los datos */
(function () {
  const { C } = L;

  /* Contador tipo "hoja que se voltea": un dígito por tarjeta */
  function flipCounter(parent, from, to, style) {
    const wrap = L.h("div", { class: "abs", style: Object.assign({ display: "flex", gap: "6px", perspective: "600px" }, style) }, parent);
    const cells = [];
    [...from].forEach((ch, i) => {
      const isSep = ch === ",";
      const c = L.h("div", { style: { position: "relative", width: isSep ? "22px" : "64px", height: "92px" } }, wrap);
      const mk = (txt) => L.h("div", {
        style: {
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "68px", color: C.ink,
          background: isSep ? "transparent" : "#fffdf8", border: isSep ? "none" : `2.5px solid ${C.ink}`, borderRadius: "10px",
          boxShadow: isSep ? "none" : "inset 0 -46px 0 rgba(43,42,51,.04), 3px 4px 0 rgba(43,42,51,.1)", backfaceVisibility: "hidden",
        },
      }, c, txt);
      const a = mk(ch), b = mk(to[i]);
      cells.push({ a, b, changed: ch !== to[i] });
    });
    return {
      wrap,
      flip(tl, pos = ">") {
        const ch = cells.filter((c) => c.changed);
        tl.fromTo(ch.map((c) => c.a), { rotationX: 0 }, { rotationX: 90, duration: 0.28, ease: "power2.in", stagger: 0.12 }, pos);
        tl.fromTo(ch.map((c) => c.b), { rotationX: -90 }, { rotationX: 0, duration: 0.32, ease: "back.out(2)", stagger: 0.12 }, "<0.28");
        return tl;
      },
      init() { cells.forEach((c) => gsap.set(c.b, { rotationX: c.changed ? -90 : 0, autoAlpha: c.changed ? 1 : 0 })); },
    };
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Ninguna variable tenía NA: la falta de respuesta venía codificada.",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Preparación de los datos");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ---- Embudo ----
      const svg = L.svg(el);
      const wide = "M110,220 L870,220 L640,640 L640,700 L340,700 L340,640 Z";
      const narrow = "M330,560 L650,560 L560,640 L560,690 L420,690 L420,640 Z";
      const fWash = L.s("path", { d: wide, fill: C.plumL, opacity: 0.35, filter: "url(#wc2)" }, svg);
      const funnel = L.s("path", { d: wide, fill: "none", stroke: C.ink, "stroke-width": 4.5, "stroke-linejoin": "round", filter: "url(#ink)" }, svg);
      L.draw(tl, funnel, 0.3, { duration: 1.2 });
      tl.fromTo(fWash, { autoAlpha: 0 }, { autoAlpha: 0.35, duration: 0.8 }, "<0.4");

      // ---- Paso 1: 11,966 → –281 → 11,685 ----
      S.step();
      const ctr = flipCounter(el, "11,966", "11,685", { left: "290px", top: "250px" });
      ctr.init();
      const lab1 = L.h("div", { class: "abs", style: { left: "0px", width: "980px", top: "352px", textAlign: "center", fontSize: "34px", fontWeight: 700 } }, el, "registros");
      const lab3 = L.h("div", { class: "abs", style: { left: "0px", width: "980px", top: "352px", textAlign: "center", fontSize: "34px", fontWeight: 700, color: C.plum } }, el, "personas alfabetas");
      const minus = L.h("div", { class: "abs", style: { left: "0px", width: "980px", top: "425px", textAlign: "center", fontSize: "30px", fontWeight: 700, color: C.crimson } }, el, "<span style=\"background:rgba(251,248,241,.92);padding:2px 10px;border-radius:8px\">– 281 personas que no saben leer</span>");
      const drops = [];
      for (let i = 0; i < 9; i++) drops.push(L.s("circle", { cx: 700 + (i % 3) * 22, cy: 470 + Math.floor(i / 3) * 16, r: 6, fill: C.crimson, opacity: 0.8 }, svg));
      gsap.set([ctr.wrap, lab1, lab3, minus, ...drops], { autoAlpha: 0 });
      tl.fromTo(ctr.wrap, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, ">");
      tl.fromTo(lab1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.3");
      tl.fromTo(minus, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5 }, ">0.4");
      tl.fromTo(drops, { autoAlpha: 0, x: 0, y: 0 }, { autoAlpha: 0.8, x: 220, y: 120, duration: 0.9, ease: "power2.in", stagger: 0.05 }, ">");
      tl.to(drops, { autoAlpha: 0, duration: 0.3 }, ">-0.2");
      ctr.flip(tl, "<");
      tl.to(lab1, { autoAlpha: 0, duration: 0.3 }, "<");
      tl.fromTo(lab3, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">-0.1");

      // ---- Paso 2: tarjetas de decisiones (de dos en dos) ----
      const dec = [
        ["0", "El 0 no es un dato faltante: es un 'blanco por pase' (la pregunta no le tocaba)."],
        ["?", "'No recuerda' y 'No sabe' se tomaron como datos faltantes."],
        ["99", "p4 = 99 libros se conservó: el diccionario de INEGI marca el rango 01–99 como válido."],
        ["≠", "21 filas repetidas, pero 0 duplicados en las bases originales completas: son personas distintas y se conservaron."],
        ["✎", "124 personas que no fueron a la primaria: 0 estímulos escolares."],
        ["✓", "Verificamos celda por celda nuestra base contra los archivos originales del INEGI."],
      ];
      const tints = [C.blueL, C.amberL, C.plumL, "#D7E8C8", C.amberL, C.blueL];
      const cards = dec.map(([sym, t], i) => {
        const c = L.h("div", { class: "card", style: { left: 960 + (i % 2) * 450 + "px", top: 215 + Math.floor(i / 2) * 262 + "px", width: "425px", height: "240px", fontSize: "26px", padding: "22px 24px 20px 24px", lineHeight: 1.3 } }, el);
        const top = L.h("div", { style: { display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" } }, c);
        L.h("div", { style: { width: "54px", height: "54px", flex: "none", borderRadius: "50%", background: tints[i], border: `2.5px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "24px" } }, top, sym);
        L.h("div", {}, c, t);
        return c;
      });
      gsap.set(cards, { autoAlpha: 0 });
      for (let p = 0; p < 3; p++) {
        S.step();
        const pair = cards.slice(p * 2, p * 2 + 2);
        tl.fromTo(pair, { autoAlpha: 0, rotationY: -100, transformOrigin: "0% 50%", transformPerspective: 1200 }, { autoAlpha: 1, rotationY: 0, duration: 0.8, ease: "back.out(1.2)", stagger: 0.2 }, ">");
        tl.fromTo(funnel, { scale: 1 }, { scale: 1.015, transformOrigin: "50% 50%", duration: 0.15, yoyo: true, repeat: 1 }, "<0.3");
      }

      // ---- Paso 3: el embudo se estrecha en un solo libro ----
      S.step();
      const book = L.s("g", {}, svg);
      gsap.set(book, { x: 330, y: 720 });
      L.s("path", { d: "M14,0 H300 Q320,0 320,20 V170 Q320,190 300,190 H14 Z", fill: C.plum, stroke: C.ink, "stroke-width": 4 }, book);
      L.s("path", { d: "M14,0 Q0,0 0,18 V172 Q0,190 14,190", fill: "#5E3A6E", stroke: C.ink, "stroke-width": 4 }, book);
      L.s("rect", { x: 40, y: 30, width: 250, height: 130, rx: 8, fill: "#FBF8F1", stroke: "#D8B66A", "stroke-width": 3 }, book);
      for (let i = 0; i < 4; i++) L.s("line", { x1: 64, x2: 266 - (i % 2) * 40, y1: 62 + i * 26, y2: 62 + i * 26, stroke: "#CFC6B6", "stroke-width": 4, "stroke-linecap": "round" }, book);
      const bLab = L.h("div", { class: "abs h-title", style: { left: "40px", width: "900px", top: "925px", textAlign: "center", fontSize: "38px" } }, el, "Base final: 11,685 personas × 12 variables");
      const t1 = L.h("div", { class: "tag", style: { left: "1010px", top: "560px", color: C.amberD } }, el, "Índice del hogar: 658 faltantes (5.6%)");
      const t2 = L.h("div", { class: "tag", style: { left: "1010px", top: "690px", color: C.blueD } }, el, "Índice de la escuela: 858 faltantes (7.3%)");
      const ar = L.svg(el);
      const a1 = L.handArrow(ar, 1000, 590, 725, 610, { bend: 0.12, color: C.amberD });
      const a2 = L.handArrow(ar, 1000, 720, 725, 700, { bend: -0.12, color: C.blueD });
      gsap.set([book, bLab, t1, t2, a1.g, a2.g], { autoAlpha: 0 });
      tl.to(cards, { autoAlpha: 0, x: 40, duration: 0.5, stagger: 0.05 }, ">");
      tl.to([ctr.wrap, lab3, minus], { autoAlpha: 0, y: 160, scale: 0.6, duration: 0.7, ease: "power2.in" }, "<");
      tl.to([funnel, fWash], { morphD: { to: narrow }, duration: 1.0, ease: "power3.inOut" }, "<0.2");
      tl.fromTo(book, { autoAlpha: 0, y: 640, scale: 0.4, transformOrigin: "50% 0%" }, { autoAlpha: 1, y: 720, scale: 1, duration: 0.8, ease: "back.out(1.5)" }, ">-0.2");
      tl.to([funnel, fWash], { autoAlpha: 0, duration: 0.5 }, "<");
      tl.to(book, { y: 520, scale: 1.35, duration: 0.8, ease: "power3.inOut" }, ">");
      tl.fromTo(bLab, { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: -130, duration: 0.6 }, "<0.3");
      tl.fromTo(t1, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5 }, ">");
      tl.set(a1.g, { autoAlpha: 1 }, "<");
      L.arrowIn(tl, a1, "<");
      tl.fromTo(t2, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 0, duration: 0.5 }, ">");
      tl.set(a2.g, { autoAlpha: 1 }, "<");
      L.arrowIn(tl, a2, "<");
    },
  });
})();
