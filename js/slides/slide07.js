/* Diapositiva 7 · Cómo construimos los índices de acceso */
(function () {
  const { C } = L;
  const { person } = Chars;
  const D = window.DATA;

  Deck.add({
    transition: "pageTurn",
    notes: "En el hogar la desigualdad es mucho mayor: la distribución es casi plana, con un 29% sin ningún estímulo.",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Variables construidas: los índices de acceso");
      L.pop(tl, head, 0, { from: { y: -20 } });

      const hogar = ["lo llevaban a bibliotecas o librerías", "veía leer a sus padres", "le leían", "había libros en casa"];
      const escuela = ["le pedían leer otros libros", "comentaba lo leído", "lo motivaban a leer", "lo animaban a ir a bibliotecas"];
      const qs = [...hogar.map((t) => ["h", t]), ...escuela.map((t) => ["e", t])];

      // ---- Cajas (paso 2) ----
      const boxH = L.h("div", { class: "abs", style: { left: "230px", top: "180px", width: "690px", height: "330px", borderRadius: "26px", border: `3px solid ${C.amberD}`, background: "rgba(246,211,168,.35)" } }, el);
      const boxE = L.h("div", { class: "abs", style: { left: "1000px", top: "180px", width: "690px", height: "330px", borderRadius: "26px", border: `3px solid ${C.blueD}`, background: "rgba(191,215,234,.4)" } }, el);
      L.h("div", { class: "h-title", style: { position: "absolute", left: 0, right: 0, top: "16px", textAlign: "center", fontSize: "32px", color: C.amberD } }, boxH, "Índice de acceso en el hogar (p34a–d)");
      L.h("div", { class: "h-title", style: { position: "absolute", left: 0, right: 0, top: "16px", textAlign: "center", fontSize: "32px", color: C.blueD } }, boxE, "Índice de acceso en la escuela (p36a–d)");
      gsap.set([boxH, boxE], { autoAlpha: 0 });

      // ---- Entrada: las 8 preguntas que forman los índices, enumeradas en post-its ----
      const CODES = ["p34a", "p34b", "p34c", "p34d", "p36a", "p36b", "p36c", "p36d"];
      const cw = 320, ch = 104;
      const cards = qs.map(([g, t], i) => {
        const c = L.h("div", { class: "card", style: { left: "0px", top: "0px", width: cw + "px", height: ch + "px", padding: "0", fontSize: "23px", lineHeight: 1.15, transformStyle: "preserve-3d", background: "transparent", border: "none", boxShadow: "none" } }, el);
        const f = L.h("div", { style: { position: "absolute", inset: 0, background: g === "h" ? "#FBE3BF" : "#D7E7F4", borderRadius: "2px 2px 16px 2px", display: "flex", alignItems: "center", gap: "12px", padding: "10px 14px", backfaceVisibility: "hidden", boxShadow: "4px 7px 12px rgba(80,60,30,.22)" } }, c);
        L.h("div", { style: { position: "absolute", left: "50%", top: "-10px", width: "70px", height: "20px", marginLeft: "-35px", background: "rgba(255,255,255,.6)", transform: "rotate(-3deg)" } }, f);
        L.h("div", { class: "h-title", style: { flex: "none", width: "46px", height: "46px", borderRadius: "50%", background: C.plum, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" } }, f, String(i + 1));
        L.h("div", {}, f, `${t}<div style="font-size:18px;font-weight:800;color:${g === "h" ? C.amberD : C.blueD};margin-top:3px">${CODES[i]}</div>`);
        const b = L.h("div", { style: { position: "absolute", inset: 0, background: g === "h" ? C.amberM : C.blueM, border: `2.5px solid ${C.ink}`, borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "50px", color: "#fff", backfaceVisibility: "hidden", transform: "rotateY(180deg)" } }, c, "Sí");
        const sx = 170 + (i % 4) * 400, sy = 300 + Math.floor(i / 4) * 230 + (i % 2) * 30;
        const k = g === "h" ? i : i - 4;
        const bx = (g === "h" ? 230 : 1000) + 20 + (k % 2) * 330, by = 180 + 74 + Math.floor(k / 2) * 120;
        c._s = { sx, sy, rot: ((i * 37) % 13) - 6 };
        c._b = { bx, by };
        gsap.set(c, { x: sx, y: sy, rotation: c._s.rot, transformPerspective: 1000 });
        return c;
      });
      // se pegan uno por uno, como post-its
      cards.forEach((c, i) => tl.fromTo(c, { autoAlpha: 0, scale: 1.5, rotation: c._s.rot * 3 }, { autoAlpha: 1, scale: 1, rotation: c._s.rot, duration: 0.4, ease: "back.out(1.6)" }, 0.4 + i * 0.18));

      // ---- Paso 1: se separan en dos cajas; Eduardo y Héctor ----
      S.step();
      const csvg = L.svg(el);
      const edu = person(csvg, { who: "eduardo", age: "child", shirt: C.amberM, style: "curly", x: 120, y: 500, s: 0.95 });
      const hec = person(csvg, { who: "hector", age: "child", shirt: C.blueM, x: 1790, y: 500, s: 0.95 });
      gsap.set([edu.g, hec.g], { autoAlpha: 0 });
      tl.fromTo(boxH, { autoAlpha: 0, x: 200 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" }, ">");
      tl.fromTo(boxE, { autoAlpha: 0, x: -200 }, { autoAlpha: 1, x: 0, duration: 0.8, ease: "power3.out" }, "<");
      cards.forEach((c, i) => tl.to(c, { x: c._b.bx, y: c._b.by, rotation: 0, duration: 0.8, ease: "power3.inOut" }, i ? "<0.05" : "<0.2"));
      tl.fromTo(edu.g, { autoAlpha: 0, x: 40 }, { autoAlpha: 1, x: 120, duration: 0.7 }, ">-0.2");
      tl.fromTo(hec.g, { autoAlpha: 0, x: 1870 }, { autoAlpha: 1, x: 1790, duration: 0.7 }, "<");

      // ---- Paso 3: fórmula; se voltean las preguntas con "Sí" ----
      S.step();
      const formula = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "600px", textAlign: "center", fontSize: "48px" } }, el, "Índice = número de respuestas 'Sí' (de 0 a 4)");
      const yesH = [0, 1, 3]; // ejemplo: 3 de 4 en el hogar
      const yesE = [0, 1, 2, 3]; // 4 de 4 en la escuela
      gsap.set(formula, { autoAlpha: 0 });
      L.write(tl, formula, { pos: ">", dur: 1.4 });
      // las preguntas con "Sí" se voltean (cada una suma 1 al índice)
      const flip = (idxs, base) => idxs.forEach((k) => tl.to(cards[base + k], { rotationY: 180, duration: 0.45, ease: "power2.inOut" }, ">-0.15"));
      flip(yesH, 0);
      flip(yesE, 4);
      tl.to(cards[2], { opacity: 0.45, duration: 0.3 }, "<");

      // ---- Paso 4: las dos gráficas de barras ----
      S.step();
      const chart = L.svg(el);
      const lv = (i) => (i <= 1 ? 0 : i === 2 ? 1 : 2);
      const colsH = [0, 1, 2, 3, 4].map((i) => [C.amberL, C.amberM, C.amberD][lv(i)]);
      const colsE = [0, 1, 2, 3, 4].map((i) => [C.blueL, C.blueM, C.blueD][lv(i)]);
      const base = { cats: ["0", "1", "2", "3", "4"], yMax: 50, yTicks: [0, 10, 20, 30, 40, 50], xTitle: "Número de estímulos", yTitle: "% de personas", m: { l: 110, r: 20, t: 70, b: 110 } };
      const cH = Charts.vbars(chart, Object.assign({}, base, { x: 170, y: 170, w: 760, h: 700, values: D.distribucion.hogar, color: colsH, title: "Acceso en el hogar" }));
      const cE = Charts.vbars(chart, Object.assign({}, base, { x: 1000, y: 170, w: 760, h: 700, values: D.distribucion.escuela, color: colsE, title: "Acceso en la escuela" }));
      cH.title.setAttribute("fill", C.amberD);
      cE.title.setAttribute("fill", C.blueD);
      const ann = L.svg(el);
      const nH = L.h("div", { class: "abs hand", style: { left: "520px", top: "250px", width: "330px", fontSize: "36px", color: C.amberD, lineHeight: 1.05 } }, el, "29% no tuvo ningún estímulo en casa");
      const aH = L.handArrow(ann, 515, 290, 395, 360, { color: C.amberD, bend: 0.2 });
      const nE = L.h("div", { class: "abs hand", style: { left: "1130px", top: "250px", width: "320px", fontSize: "36px", color: C.blueD, lineHeight: 1.05 } }, el, "44% tuvo los cuatro en la escuela");
      const aE = L.handArrow(ann, 1440, 280, 1585, 330, { color: C.blueD, bend: -0.25 });
      const note = L.h("div", { class: "abs hand", style: { left: "0", width: "1920px", top: "990px", textAlign: "center", fontSize: "40px", color: C.plum } }, el, "Los estímulos van juntos: el índice no se comporta como una binomial");
      gsap.set([chart, ann, nH, nE, note], { autoAlpha: 0 });
      tl.to([...cards, boxH, boxE, formula], { autoAlpha: 0, y: "-=40", duration: 0.6, stagger: 0.02, ease: "power2.in" }, ">");
      tl.to(edu.g, { x: 95, y: 1010, scale: 0.75, duration: 0.9, ease: "power3.inOut" }, "<0.2");
      tl.to(hec.g, { x: 1820, y: 1010, scale: 0.75, duration: 0.9, ease: "power3.inOut" }, "<");
      tl.set([chart, ann], { autoAlpha: 1 }, ">-0.3");
      cH.play(tl, "<");
      cE.play(tl, "<0.3");
      tl.set(aH.g, { autoAlpha: 1 }, ">");
      L.pop(tl, nH, "<", { from: { y: 10 } });
      L.arrowIn(tl, aH, "<0.2");
      tl.set(aE.g, { autoAlpha: 1 }, ">");
      L.pop(tl, nE, "<", { from: { y: 10 } });
      L.arrowIn(tl, aE, "<0.2");
      L.write(tl, note, { pos: ">0.2", dur: 1.6 });
    },
  });
})();
