/* Diapositiva 4 · Objetivos */
(function () {
  const { C } = L;

  /* Íconos a mano (64×64) */
  function icon(parent, k) {
    const s = L.s("svg", { width: 62, height: 62, viewBox: "0 0 64 64", style: "position:absolute;left:0;top:-8px;overflow:visible" }, parent);
    const st = { fill: "none", stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
    const S = (tag, a) => L.s(tag, Object.assign({}, st, a), s);
    if (k === 0) {
      S("path", { d: "M8,22 h18 v30 q0,6 -6,6 h-6 q-6,0 -6,-6 Z", fill: C.amberL });
      S("path", { d: "M38,22 h18 v30 q0,6 -6,6 h-6 q-6,0 -6,-6 Z", fill: C.blueL });
      S("circle", { cx: 17, cy: 48, r: 4, fill: C.amberM }); S("circle", { cx: 47, cy: 48, r: 4, fill: C.blueM }); S("circle", { cx: 47, cy: 38, r: 4, fill: C.blueM });
    } else if (k === 1) {
      S("circle", { cx: 18, cy: 18, r: 8, fill: C.plumL }); S("circle", { cx: 46, cy: 46, r: 8, fill: C.plumL }); S("path", { d: "M50,10 L14,54" });
    } else if (k === 2) {
      S("path", { d: "M6,32 L18,20 L30,32 V54 H6 Z", fill: C.amberL });
      S("path", { d: "M34,54 V28 H58 V54 Z M40,28 L46,18 L52,28", fill: C.blueL });
    } else if (k === 3) { // casa con libros
      S("path", { d: "M6,30 L32,8 L58,30 V58 H6 Z", fill: C.amberL });
      S("rect", { x: 16, y: 34, width: 8, height: 20, fill: C.plumL }); S("rect", { x: 26, y: 34, width: 8, height: 20, fill: C.blueM }); S("rect", { x: 36, y: 38, width: 8, height: 16, fill: C.amberM });
    } else { // dos barras con su media
      S("rect", { x: 10, y: 30, width: 16, height: 26, fill: C.amberM }); S("rect", { x: 36, y: 18, width: 16, height: 38, fill: C.blueM });
      S("path", { d: "M4,58 H60" }); S("path", { d: "M6,24 H58", "stroke-dasharray": "5 5" });
    }
    return s;
  }

  /* Máquina de escribir dibujada a mano; devuelve piezas animables */
  function typewriter(parent, x, y) {
    const g = L.s("g", {}, parent);
    gsap.set(g, { x, y });
    const st = { stroke: C.ink, "stroke-width": 4, "stroke-linejoin": "round", "stroke-linecap": "round" };
    const carriage = L.s("g", {}, g);
    L.s("rect", Object.assign({ x: -300, y: -40, width: 600, height: 46, rx: 22, fill: "#5E6B7D" }, st), carriage);
    L.s("circle", Object.assign({ cx: -318, cy: -17, r: 22, fill: "#8A97A8" }, st), carriage);
    L.s("circle", Object.assign({ cx: 318, cy: -17, r: 22, fill: "#8A97A8" }, st), carriage);
    L.s("path", Object.assign({ d: "M-360,-17 h-50 l-10,-30", fill: "none" }, st), carriage); // palanca
    L.s("path", Object.assign({ d: "M-330,10 L330,10 L380,190 Q380,214 356,214 L-356,214 Q-380,214 -380,190 Z", fill: C.plum }, st), g);
    L.s("path", { d: "M-300,40 H300", stroke: "#D8B66A", "stroke-width": 3 }, g);
    const keys = [];
    [[12, -230, 70], [11, -210, 112], [10, -190, 154]].forEach(([n, x0, yy]) => {
      for (let i = 0; i < n; i++) {
        const k = L.s("circle", Object.assign({ cx: x0 + i * 42, cy: yy, r: 15, fill: "#FBF8F1" }, st, { "stroke-width": 3 }), g);
        keys.push(k);
      }
    });
    L.s("rect", Object.assign({ x: -150, y: 180, width: 300, height: 22, rx: 11, fill: "#FBF8F1" }, st, { "stroke-width": 3 }), g);
    return { g, carriage, keys };
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Supuestos: n·p ≥ 5 en todos los grupos; frecuencias esperadas ≥ 5; para medias usamos el Teorema del Límite Central porque el número de libros está muy sesgado (sesgo ≈ 7.3). Herramientas: α = 0.04; IC de proporciones (z) y diferencia de medias (t de Welch); pruebas z de diferencia de proporciones y ji-cuadrada; R (Quarto / R Markdown).",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Objetivos");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const LAB = { fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontSize: "24px", color: C.plum };

      // ---- Paso 1: una máquina de escribir teclea el objetivo general ----
      const sv = L.svg(el);
      const tw = typewriter(sv, 960, 780);
      const paper = L.h("div", { class: "abs", style: { left: "210px", top: "180px", width: "1500px", padding: "30px 46px 34px", background: "#FFFDF8 var(--grain)", border: `2px solid #D8CDB8`, borderRadius: "6px", boxShadow: "0 12px 30px rgba(120,90,50,.15)" } }, el);
      const pLab = L.h("div", { style: Object.assign({ marginBottom: "14px" }, LAB) }, paper, "Objetivo general");
      const pTxt = L.h("div", { style: { fontFamily: "'Courier New', Courier, monospace", fontSize: "38px", lineHeight: 1.32, color: C.ink } }, paper,
        "Analizar cómo la desigualdad en el acceso a la lectura en el hogar y en la escuela durante la infancia se relaciona con la decisión de leer libros y con el número de libros leídos por los adultos alfabetos de México (MOLEC 2019–2024).");
      const chars = L.splitChars(pTxt);
      gsap.set([paper, tw.g], { autoAlpha: 0 });
      gsap.set(chars, { opacity: 0 });
      S.step();
      tl.fromTo(tw.g, { autoAlpha: 0, y: 960 }, { autoAlpha: 1, y: 780, duration: 0.7, ease: "back.out(1.4)" }, ">");
      tl.fromTo(paper, { autoAlpha: 0, clipPath: "inset(100% 0% 0% 0%)", y: 120 }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", y: 0, duration: 0.8, ease: "power2.out" }, ">-0.1");
      tl.addLabel("type", ">");
      const per = 0.026;
      tl.to(chars, { opacity: 1, duration: 0.01, stagger: per }, "type");
      const T = chars.length * per;
      // las teclas brincan y el carro avanza; "ding" al cambiar de renglón
      const kr = L.rng(8);
      for (let t = 0; t < T; t += 0.09) {
        tl.to(tw.keys[Math.floor(kr() * tw.keys.length)], { y: 6, duration: 0.045, yoyo: true, repeat: 1 }, `type+=${t.toFixed(3)}`);
      }
      const lines = 4;
      for (let i = 0; i < lines; i++) {
        tl.fromTo(tw.carriage, { x: 150 }, { x: -150, duration: T / lines - 0.15, ease: "steps(30)" }, `type+=${(T / lines) * i}`);
        tl.to(tw.carriage, { x: 150, duration: 0.15, ease: "power2.out" }, ">");
      }

      // ---- Paso 2: el objetivo se ensancha arriba; objetivos específicos ----
      // dos grupos: la decisión de leer (a) y la cantidad de libros (b)
      const groups = [
        ["a) Leer o no leer libros", [
          "Construir un índice de acceso a la lectura en el hogar y otro en la escuela.",
          "Evaluar si el acceso en el hogar y el de la escuela son independientes.",
          "Comparar la proporción de lectores con estímulos solo en casa vs. solo en la escuela.",
        ]],
        ["b) Cantidad de libros leídos", [
          "Analizar cómo se relaciona el número de libros en casa con los libros leídos.",
          "Comparar la media de libros leídos según el nivel de acceso.",
        ]],
      ];
      const list = L.h("div", { class: "abs", style: { left: "110px", top: "340px", width: "1700px" } }, el);
      const lLab = L.h("div", { style: Object.assign({ marginBottom: "10px" }, LAB) }, list, "Objetivos específicos");
      const subs = [];
      const items = [];
      groups.forEach(([gt, objs]) => {
        subs.push(L.h("div", { class: "h-title", style: { fontSize: "27px", color: C.ink2, margin: "6px 0 8px" } }, list, gt));
        objs.forEach((t) => {
          const it = L.h("div", { style: { position: "relative", paddingLeft: "84px", minHeight: "50px", fontSize: "29px", lineHeight: 1.25, marginBottom: "8px", display: "flex", alignItems: "center" } }, list, t);
          it._ic = icon(it, items.length);
          it._sub = subs.length - 1;
          items.push(it);
        });
      });
      gsap.set(list, { autoAlpha: 0 });
      S.step();
      tl.to(tw.g, { y: 1300, autoAlpha: 0, duration: 0.7, ease: "power2.in" }, ">");
      tl.to(paper, { left: 110, top: 128, width: 1700, padding: "16px 30px 18px", boxShadow: "0 4px 12px rgba(120,90,50,.10)", duration: 0.9, ease: "power3.inOut" }, "<0.2");
      tl.to(pTxt, { fontSize: "27px", lineHeight: 1.3, duration: 0.9, ease: "power3.inOut" }, "<");
      tl.to(pLab, { marginBottom: "6px", fontSize: "20px", duration: 0.9 }, "<");
      tl.set(list, { autoAlpha: 1 }, ">-0.2");
      L.pop(tl, lLab, "<");
      items.forEach((it, i) => {
        if (i === 0 || items[i - 1]._sub !== it._sub) L.pop(tl, subs[it._sub], i ? ">-0.1" : ">", { from: { x: -20 } });
        tl.fromTo(it, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: "power2.out" }, ">-0.25");
        tl.fromTo(it._ic, { scale: 0, rotation: -30, transformOrigin: "50% 50%" }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2.5)" }, "<0.1");
      });

      // ---- Paso 3: metodología debajo, solo la línea del tiempo ----
      const metLab = L.h("div", { class: "abs", style: Object.assign({ left: "110px", top: "780px" }, LAB) }, el, "Metodología");
      const path = L.svg(el);
      const Y = 860;
      const rib = L.s("path", { d: `M180,${Y} C500,${Y - 30} 700,${Y + 30} 960,${Y} S1450,${Y - 30} 1740,${Y}`, fill: "none", stroke: C.plum, "stroke-width": 20, "stroke-linecap": "round", opacity: 0.85 }, path);
      const ribEnd = L.s("path", { d: `M1740,${Y - 22} L1785,${Y - 22} L1768,${Y} L1785,${Y + 22} L1740,${Y + 22} Z`, fill: C.plum, opacity: 0.85 }, path);
      const etapas = ["Etapa 1 · Contexto y pregunta", "Etapa 2 · Preparación y análisis descriptivo", "Etapa 3 · Análisis inferencial", "Etapa 4 · Conclusiones"];
      const sx = [260, 740, 1220, 1690];
      const st = etapas.map((t, i) => {
        const c = L.s("circle", { cx: sx[i], cy: Y, r: 28, fill: "#fffdf8", stroke: C.ink, "stroke-width": 4 }, path);
        const n = L.s("text", { x: sx[i], y: Y + 10, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 30, fill: C.ink }, path, String(i + 1));
        const lab = L.h("div", { class: "abs", style: { left: sx[i] - 190 + "px", top: Y + 42 + "px", width: "380px", textAlign: "center", fontSize: "28px", lineHeight: 1.2, fontWeight: 700 } }, el, t);
        return { c, n, lab };
      });
      gsap.set([path, metLab, ...st.map((s) => s.lab)], { autoAlpha: 0 });
      S.step();
      tl.set(path, { autoAlpha: 1 }, ">");
      L.pop(tl, metLab, "<", { from: { y: 10 } });
      tl.addLabel("rib", "<");
      L.draw(tl, rib, "rib", { duration: 1.6, ease: "power1.inOut" });
      tl.fromTo(ribEnd, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.3 }, ">-0.1");
      st.forEach((s, i) => {
        tl.fromTo([s.c, s.n], { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, `rib+=${0.15 + i * 0.42}`);
        tl.to(s.c, { attr: { fill: [C.amberL, C.blueL, C.plumL, "#D7E8C8"][i] }, duration: 0.4 }, ">");
        tl.fromTo(s.lab, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<");
      });
    },
  });
})();
