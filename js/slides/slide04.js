/* Diapositiva 4 · Objetivos y metodología */
(function () {
  const { C } = L;

  /* Íconos a mano (64×64) */
  function icon(parent, k) {
    const s = L.s("svg", { width: 70, height: 70, viewBox: "0 0 64 64", style: "position:absolute;left:0;top:-6px;overflow:visible" }, parent);
    const st = { fill: "none", stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round", "stroke-linejoin": "round" };
    const S = (tag, a) => L.s(tag, Object.assign({}, st, a), s);
    if (k === 0) { // dos frascos: hogar y escuela
      S("path", { d: "M8,22 h18 v30 q0,6 -6,6 h-6 q-6,0 -6,-6 Z", fill: C.amberL });
      S("path", { d: "M38,22 h18 v30 q0,6 -6,6 h-6 q-6,0 -6,-6 Z", fill: C.blueL });
      S("circle", { cx: 17, cy: 48, r: 4, fill: C.amberM }); S("circle", { cx: 47, cy: 48, r: 4, fill: C.blueM }); S("circle", { cx: 47, cy: 38, r: 4, fill: C.blueM });
    } else if (k === 1) { // porcentaje
      S("circle", { cx: 18, cy: 18, r: 8, fill: C.plumL }); S("circle", { cx: 46, cy: 46, r: 8, fill: C.plumL }); S("path", { d: "M50,10 L14,54" });
    } else if (k === 2) { // casa vs escuela
      S("path", { d: "M6,32 L18,20 L30,32 V54 H6 Z", fill: C.amberL });
      S("path", { d: "M34,54 V28 H58 V54 Z M40,28 L46,18 L52,28", fill: C.blueL });
      S("path", { d: "M26,12 q6,-6 12,0", stroke: C.plum });
    } else if (k === 3) { // birrete
      S("path", { d: "M4,24 L32,12 L60,24 L32,36 Z", fill: C.plumL }); S("path", { d: "M16,30 V44 q16,10 32,0 V30" }); S("path", { d: "M58,25 V42" });
    } else { // libros y dispersión
      S("rect", { x: 8, y: 40, width: 30, height: 9, fill: C.blueM }); S("rect", { x: 11, y: 31, width: 26, height: 9, fill: C.amberM }); S("rect", { x: 8, y: 22, width: 30, height: 9, fill: C.plumL });
      S("path", { d: "M46,52 V18 M40,24 L46,16 L52,24 M40,46 L46,54 L52,46" });
    }
    return s;
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Supuestos: n·p ≥ 5 en todos los grupos; frecuencias esperadas ≥ 5; para medias usamos el Teorema del Límite Central porque el número de libros está muy sesgado (sesgo ≈ 7.3).",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Objetivos y metodología");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ---- Paso 1: objetivo general como epígrafe ----
      const ep = L.h("div", { class: "abs", style: { left: "230px", width: "1460px", top: "300px", textAlign: "center" } }, el);
      const epLab = L.h("div", { style: { fontFamily: "var(--f-body)", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontSize: "24px", color: C.plum, marginBottom: "22px" } }, ep, "Objetivo general");
      const orn = L.s("svg", { width: 600, height: 30, viewBox: "0 0 600 30", style: "display:block;margin:0 auto 18px" }, ep);
      const ornP = L.s("path", { d: "M10,15 C120,15 170,2 250,12 S290,26 300,15 S330,2 350,12 S480,15 590,15", fill: "none", stroke: C.plum, "stroke-width": 2.5 }, orn);
      const epT = L.h("div", { style: { fontFamily: "var(--f-head)", fontStyle: "italic", fontSize: "48px", lineHeight: 1.3, color: C.ink } }, ep,
        "Analizar cómo la desigualdad en el acceso a la lectura en el hogar y en la escuela durante la infancia se relaciona con la decisión de leer libros y con el número de libros leídos por los adultos alfabetos de México (MOLEC 2019–2024).");
      gsap.set(ep, { autoAlpha: 0 });
      S.step();
      tl.set(ep, { autoAlpha: 1 }, ">");
      L.pop(tl, epLab, ">", { from: { y: 10 } });
      L.draw(tl, ornP, "<", { duration: 1 });
      tl.fromTo(epT, { autoAlpha: 0, y: 20, filter: "blur(4px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.4, ease: "power2.out" }, "<0.2");

      // ---- Paso 2: objetivos específicos ----
      const objs = [
        "Medir el acceso a la lectura en la infancia con dos índices: hogar y escuela.",
        "Estimar la proporción de lectores según el nivel de acceso.",
        "Comparar si el hogar o la escuela se asocia más con volverse lector, y si ambos están relacionados.",
        "Explorar el papel de la escolaridad como indicador del nivel socioeconómico.",
        "Estimar las diferencias en la cantidad de libros y su variabilidad.",
      ];
      const list = L.h("div", { class: "abs", style: { left: "380px", top: "350px", width: "1160px" } }, el);
      const lLab = L.h("div", { style: { fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontSize: "24px", color: C.plum, marginBottom: "18px" } }, list, "Objetivos específicos");
      const items = objs.map((t) => {
        const it = L.h("div", { style: { position: "relative", paddingLeft: "96px", minHeight: "70px", fontSize: "32px", lineHeight: 1.28, marginBottom: "24px" } }, list, t);
        it._ic = icon(it, objs.indexOf(t));
        return it;
      });
      gsap.set(list, { autoAlpha: 0 });
      S.step();
      tl.to(ep, { y: -175, scale: 0.6, transformOrigin: "50% 0%", duration: 1, ease: "power3.inOut" }, ">");
      tl.set(list, { autoAlpha: 1 }, ">-0.3");
      L.pop(tl, lLab, "<");
      items.forEach((it, i) => {
        tl.fromTo(it, { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.55, ease: "power2.out" }, i ? ">-0.25" : ">");
        tl.fromTo(it._ic, { scale: 0, rotation: -30, transformOrigin: "50% 50%" }, { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.5)" }, "<0.1");
      });

      // ---- Paso 3: metodología como cinta con 4 estaciones ----
      const path = L.svg(el);
      const rib = L.s("path", { d: "M990,450 C1150,420 1250,480 1400,450 S1650,420 1800,450", fill: "none", stroke: C.plum, "stroke-width": 22, "stroke-linecap": "round", opacity: 0.85 }, path);
      const ribEnd = L.s("path", { d: "M1800,428 L1840,428 L1824,450 L1840,472 L1800,472 Z", fill: C.plum, opacity: 0.85 }, path);
      const metLab = L.h("div", { class: "abs", style: { left: "990px", top: "330px", fontWeight: 800, letterSpacing: ".18em", textTransform: "uppercase", fontSize: "24px", color: C.plum } }, el, "Metodología");
      const etapas = ["Etapa 1 · Contexto y pregunta", "Etapa 2 · Preparación y análisis descriptivo", "Etapa 3 · Análisis inferencial", "Etapa 4 · Conclusiones"];
      const sx = [1020, 1270, 1520, 1770];
      const st = etapas.map((t, i) => {
        const y = 450 + (i % 2 ? 4 : -6);
        const c = L.s("circle", { cx: sx[i], cy: y, r: 26, fill: "#fffdf8", stroke: C.ink, "stroke-width": 4 }, path);
        const n = L.s("text", { x: sx[i], y: y + 10, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 28, fill: C.ink }, path, String(i + 1));
        const lab = L.h("div", { class: "abs", style: { left: sx[i] - 115 + "px", top: "495px", width: "230px", textAlign: "center", fontSize: "24px", lineHeight: 1.2, fontWeight: 600 } }, el, t);
        return { c, n, lab };
      });
      gsap.set([path, metLab, ...st.map((s) => s.lab)], { autoAlpha: 0 });
      S.step();
      tl.to(list, { x: -300, scale: 0.72, transformOrigin: "0% 0%", duration: 1, ease: "power3.inOut" }, ">");
      tl.to(ep, { y: -195, scale: 0.5, duration: 1, ease: "power3.inOut" }, "<");
      tl.set(path, { autoAlpha: 1 }, ">-0.2");
      L.pop(tl, metLab, "<");
      tl.addLabel("rib", "<");
      L.draw(tl, rib, "rib", { duration: 1.6, ease: "power1.inOut" });
      tl.fromTo(ribEnd, { autoAlpha: 0 }, { autoAlpha: 0.85, duration: 0.3 }, ">-0.1");
      st.forEach((s, i) => {
        tl.fromTo([s.c, s.n], { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, `rib+=${0.2 + i * 0.42}`);
        tl.to(s.c, { attr: { fill: [C.amberL, C.blueL, C.plumL, "#D7E8C8"][i] }, duration: 0.4 }, ">");
        tl.fromTo(s.lab, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<");
      });

      // ---- Paso 4: caja de herramientas ----
      const tools = [
        ["α", "Nivel de significancia: α = 0.04 (96% de confianza)"],
        ["IC", "Intervalos de confianza: proporciones (z), diferencia de medias (t de Welch), varianza (χ²)"],
        ["H₀", "Pruebas de hipótesis: diferencia de proporciones (z), ji-cuadrada de independencia"],
        ["R", "Software: R (Quarto / R Markdown)"],
      ];
      const cards = tools.map(([sym, t], i) => {
        const c = L.h("div", { class: "card", style: { left: 990 + (i % 2) * 425 + "px", top: 640 + Math.floor(i / 2) * 200 + "px", width: "405px", height: "180px", fontSize: "24px", padding: "20px 22px 20px 92px", lineHeight: 1.28 } }, el, t);
        L.h("div", { style: { position: "absolute", left: "18px", top: "20px", width: "58px", height: "58px", borderRadius: "50%", background: [C.plumL, C.amberL, C.blueL, "#D7E8C8"][i], border: `2.5px solid ${C.ink}`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "26px" } }, c, sym);
        return c;
      });
      gsap.set(cards, { autoAlpha: 0 });
      S.step();
      tl.fromTo(cards, { autoAlpha: 0, rotationX: -90, transformOrigin: "50% 0%", transformPerspective: 900 }, { autoAlpha: 1, rotationX: 0, duration: 0.8, ease: "back.out(1.4)", stagger: 0.18 }, ">");
    },
  });
})();
