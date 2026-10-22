/* Diapositiva 6 · Preparación de los datos: una máquina que va filtrando la base */
(function () {
  const { C } = L;
  const D = window.DATA;

  /* Contador tipo "hoja que se voltea": un dígito por tarjeta */
  function flipCounter(parent, from, to, style) {
    const wrap = L.h("div", { class: "abs", style: Object.assign({ display: "flex", gap: "6px", perspective: "600px" }, style) }, parent);
    const cells = [];
    [...from].forEach((ch, i) => {
      const isSep = ch === ",";
      const c = L.h("div", { style: { position: "relative", width: isSep ? "20px" : "66px", height: "96px" } }, wrap);
      const mk = (txt) => L.h("div", {
        style: {
          position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--f-head)", fontWeight: 700, fontSize: "70px", color: C.ink,
          background: isSep ? "transparent" : "#fffdf8", border: isSep ? "none" : `2.5px solid ${C.ink}`, borderRadius: "10px",
          boxShadow: isSep ? "none" : "inset 0 -48px 0 rgba(43,42,51,.04), 3px 4px 0 rgba(43,42,51,.1)", backfaceVisibility: "hidden",
        },
      }, c, txt);
      const a = mk(ch), b = mk(to[i]);
      cells.push({ a, b, changed: ch !== to[i] });
    });
    cells.forEach((c) => gsap.set(c.b, { rotationX: c.changed ? -90 : 0, autoAlpha: c.changed ? 1 : 0 }));
    return {
      wrap,
      flip(tl, pos = ">") {
        const ch = cells.filter((c) => c.changed);
        tl.fromTo(ch.map((c) => c.a), { rotationX: 0 }, { rotationX: 90, duration: 0.28, ease: "power2.in", stagger: 0.12 }, pos);
        tl.fromTo(ch.map((c) => c.b), { rotationX: -90 }, { rotationX: 0, duration: 0.32, ease: "back.out(2)", stagger: 0.12 }, "<0.28");
        return tl;
      },
    };
  }

  function gearPath(r, teeth = 10, depth = 10) {
    let d = "";
    for (let i = 0; i < teeth * 2; i++) {
      const a0 = (i / (teeth * 2)) * Math.PI * 2, a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
      const rr = i % 2 ? r : r + depth;
      d += `${i ? "L" : "M"}${(Math.cos(a0) * rr).toFixed(1)},${(Math.sin(a0) * rr).toFixed(1)} L${(Math.cos(a1) * rr).toFixed(1)},${(Math.sin(a1) * rr).toFixed(1)} `;
    }
    return d + "Z";
  }

  // Secciones del cuestionario MOLEC (Etapa 1, Tabla 1) con sus variables; 1 = la usamos
  const SECTIONS = [
    ["I · Preguntas generales", "p1–p3", [["p1", 0], ["p2", 0], ["p3_1", 1], ["p3_2", 0], ["p3_3", 0], ["p3_4", 0], ["p3_5", 0]]],
    ["II · Libros", "p4–p9", [["p4", 1], ["p5", 0], ["p6", 0], ["p7", 0], ["p8", 0], ["p9", 0]]],
    ["III · Revistas", "p10–p15", [["p10–p15", 0]]],
    ["IV · Periódicos", "p16–p21", [["p16–p21", 0]]],
    ["V · Historietas", "p22–p23", [["p22–p23", 0]]],
    ["VI · Internet, foros o blogs", "p24–p25", [["p24–p25", 0]]],
    ["VII · Características de la lectura", "p26–p31", [["p26–p31", 0]]],
    ["VIII · Razones para no leer", "p32", [["p32", 0]]],
    ["IX · Asistencia a establecimientos", "p33a–d", [["p33", 0]]],
    ["X · Estímulos en la infancia", "p34–p36", [["p34a", 1], ["p34b", 1], ["p34c", 1], ["p34c1", 0], ["p34d", 1], ["p34d1", 1], ["p35", 1], ["p36a", 1], ["p36b", 1], ["p36c", 1], ["p36d", 1]]],
    ["Datos de la persona", "nivel, edad, sexo, entidad, año", [["nivel", 1], ["edad", 1], ["sexo", 0], ["entidad", 0], ["año", 1]]],
  ];

  Deck.add({
    transition: "pageTurn",
    notes: "Ninguna variable tenía NA: la falta de respuesta venía codificada. El 0 es un 'blanco por pase', no un faltante. p4 = 99 se conservó (rango válido 01–99). Las 21 filas repetidas son personas distintas y se conservaron. Verificamos celda por celda contra los archivos del INEGI.",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Preparación de los datos");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ---- La máquina (más chica: abajo queda la bandeja de lo que sale) ----
      const svg = L.svg(el);
      const body = L.s("path", { d: L.roughRect(150, 130, 1620, 720, L.rng(3), 3), fill: "rgba(255,253,248,.85)", stroke: C.ink, "stroke-width": 5, "stroke-linejoin": "round", filter: "url(#ink)" }, svg);
      const pipes = L.s("path", { d: "M1010,130 V100 H1190 V130 M1300,130 V92 H1480 V130", fill: "none", stroke: C.ink, "stroke-width": 8, "stroke-linejoin": "round" }, svg);
      const chute = L.s("path", { d: "M870,850 L900,900 H1020 L1050,850", fill: C.band, stroke: C.ink, "stroke-width": 4, "stroke-linejoin": "round" }, svg);
      const gears = [[1690, 122, 40, C.plumL], [1770, 160, 26, C.amberL], [1610, 160, 28, C.blueL]].map(([x, y, rr, col]) => {
        const g = L.s("g", {}, svg);
        gsap.set(g, { x, y });
        L.s("path", { d: gearPath(rr, rr > 34 ? 12 : 9, 9), fill: col, stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round" }, g);
        L.s("circle", { r: rr * 0.32, fill: "#fffdf8", stroke: C.ink, "stroke-width": 3 }, g);
        return g;
      });
      const CH = [960, 860]; // boca de la salida

      // ---- Arriba: un chorro de puntitos (las personas) con el total al centro ----
      const COLS = 48, ROWS = 6;
      const dots = [];
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const d = L.s("circle", { cx: 250 + c * 30, cy: 178 + r * 24, r: 8, fill: C.ink, opacity: 0.75 }, svg);
        d._c = c;
        dots.push(d);
      }
      const pill = L.h("div", { class: "abs", style: { left: "640px", top: "180px", width: "640px", height: "116px", background: "rgba(251,248,241,.95)", borderRadius: "22px", boxShadow: "0 6px 20px rgba(120,90,50,.15)" } }, el);
      const ctr = flipCounter(el, "11,966", "11,685", { left: "668px", top: "190px" });
      const lab0 = L.h("div", { class: "abs", style: { left: "1080px", top: "220px", fontSize: "36px", fontWeight: 800 } }, el, "personas");
      const lab1 = L.h("div", { class: "abs", style: { left: "1080px", top: "204px", fontSize: "33px", fontWeight: 800, color: C.plum, lineHeight: 1.05 } }, el, "personas<br>alfabetas");
      // los años: cada uno pinta su columna de puntitos por un instante
      const YC = [C.blueM, C.amberM, C.plum, "#7FA77A", C.blueD, C.amberD];
      const years = D.general.anios.map((y, i) => L.h("div", { class: "abs", style: { left: 250 + i * 240 + 30 + "px", top: "330px", width: "150px", textAlign: "center", borderRadius: "12px", border: `2px solid ${C.ink}`, background: "#fffdf8", padding: "4px 0" } }, el,
        `<div class="h-title" style="font-size:28px">${y}</div><div style="font-size:20px;font-weight:700;color:${C.ink2}">${L.fmt.int(D.general.registrosPorAnio[i])}</div>`));
      const rnd = L.rng(11);
      const order = dots.map((d, i) => i).sort(() => rnd() - 0.5);
      const illit = order.slice(0, 7).map((i) => dots[i]);          // ≈ 281 de 11,966
      const missing = order.slice(7, 26).map((i) => dots[i]);       // ≈ 7% con "No recuerda"
      const noPrim = order.slice(26, 29).map((i) => dots[i]);       // ≈ 124 personas
      const badges = noPrim.map((d) => {
        const g = L.s("g", {}, svg);
        L.s("circle", { cx: +d.getAttribute("cx") + 9, cy: +d.getAttribute("cy") - 10, r: 11, fill: C.blueM, stroke: C.ink, "stroke-width": 2 }, g);
        L.s("text", { x: +d.getAttribute("cx") + 9, y: +d.getAttribute("cy") - 4, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 16, fill: "#fff" }, g, "0");
        return g;
      });

      // ---- Abajo: las variables por secciones del cuestionario ----
      const vHead = L.h("div", { class: "abs h-title", style: { left: "190px", top: "330px", fontSize: "36px" } }, el, `${L.num(108)} variables por año`);
      const secs = SECTIONS.map(([title, range, vars], i) => {
        const keepS = vars.some((v) => v[1]);
        const c = L.h("div", { class: "abs", style: { left: 190 + (i % 4) * 390 + "px", top: 392 + Math.floor(i / 4) * 92 + "px", width: "375px", height: "80px", overflow: "hidden", border: `2px solid ${C.ink}`, borderRadius: "14px", background: "#fffdf8", padding: "10px 16px" } }, el);
        L.h("div", { class: "h-title", style: { fontSize: "23px", lineHeight: 1.1, whiteSpace: "nowrap" } }, c, title);
        const sub = L.h("div", { style: { fontSize: "18px", color: C.ink2, fontWeight: 700, marginTop: "6px", whiteSpace: "nowrap" } }, c, range);
        const row = L.h("div", { style: { display: "flex", flexWrap: "wrap", marginTop: "6px" } }, c);
        const chips = vars.map(([v, keep]) => {
          const ch = L.h("span", { style: { display: "inline-block", whiteSpace: "nowrap", overflow: "hidden", fontSize: "21px", fontWeight: 800, padding: "3px 12px", marginRight: "8px", marginBottom: "6px", borderRadius: "999px", border: `2px solid ${C.ink}`, background: keep ? C.plumL : C.band } }, row, v);
          ch._keep = keep;
          return ch;
        });
        return { c, sub, chips, keepS };
      });
      secs.forEach((s) => s.chips.forEach((ch) => { ch.style.width = ch.offsetWidth + "px"; }));
      gsap.set(secs.flatMap((s) => s.chips), { autoAlpha: 0 });
      const keptS = secs.filter((s) => s.keepS), dropS = secs.filter((s) => !s.keepS);
      const keepMsg = L.h("div", { class: "abs hand", style: { left: "190px", top: "326px", fontSize: "44px", color: C.plum } }, el, "Solo nos enfocamos en estas variables");
      const finT = L.h("div", { class: "abs h-title", style: { left: "190px", top: "330px", fontSize: "40px" } }, el, "Base final: 11,685 personas");

      // ---- La bandeja: aquí se ve qué sale de la máquina ----
      // ---- Debajo de la máquina: un mensaje grande por paso (lo que sale) ----
      const big = (html, col) => L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "918px", textAlign: "center", fontSize: "56px", lineHeight: 1.05, color: col } }, el, html);
      const s1 = big("– 281 personas que no saben leer", C.crimson);
      const s2 = big("'No recuerda' y 'No sabe' → datos faltantes", C.crimson);
      const s3 = big("Fuera: secciones III–IX y otras 14 variables", C.ink);
      const s4 = big("124 personas sin primaria → 0 estímulos escolares", C.blueD);
      const via = (x, y, tx, ty) => [{ x: CH[0] - x, y: CH[1] - 20 - y, duration: 0.5, ease: "power2.in" }, { x: tx - x, y: ty - y, duration: 0.45, ease: "power2.out" }];

      // ================= Entrada: puntitos, total, los años (2–3 s) y las variables =================
      gsap.set([lab1, keepMsg, finT, s1, s2, s3, s4, ...badges], { autoAlpha: 0 });
      L.draw(tl, body, 0.2, { duration: 1.0 });
      tl.fromTo([pipes, chute], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4, stagger: 0.1 }, "<0.5");
      tl.fromTo(gears, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1 }, "<");
      tl.fromTo(dots, { y: -200, autoAlpha: 0 }, { y: 0, autoAlpha: 0.75, duration: 0.5, ease: "bounce.out", stagger: { amount: 1.0, from: "random" } }, "<0.1");
      tl.fromTo([pill, ctr.wrap], { autoAlpha: 0, scale: 0.7 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(1.8)" }, ">-0.3");
      tl.fromTo(lab0, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, "<0.2");
      // los años: todos se encienden a la vez (cada uno pinta sus columnas) y luego se van
      tl.fromTo(years, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.06 }, ">0.1");
      years.forEach((y, i) => {
        const col = dots.filter((d) => Math.floor(d._c / 8) === i);
        tl.to(col, { attr: { fill: YC[i] }, opacity: 1, duration: 0.35 }, i ? "<" : ">");
        tl.to(y, { background: YC[i], color: "#fff", duration: 0.35 }, "<");
      });
      tl.to(dots, { attr: { fill: C.ink }, opacity: 0.75, duration: 0.4 }, ">1.8");
      tl.to(years, { autoAlpha: 0, y: -10, duration: 0.4, stagger: 0.04 }, "<");
      tl.fromTo(vHead, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">-0.1");
      L.counts(tl, vHead, "<", 1.0);
      tl.fromTo(secs.map((s) => s.c), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(2)" }, "<0.1");

      const spin = (pos, turns = 1) => tl.to(gears, { rotation: `+=${360 * turns}`, duration: 1.2, ease: "power1.inOut" }, pos);

      // ================= 1: salen quienes no saben leer =================
      S.step();
      spin(">");
      tl.to(illit, { attr: { fill: C.crimson }, opacity: 1, duration: 0.3 }, "<");
      illit.forEach((d, k) => tl.to(d, { keyframes: [...via(+d.getAttribute("cx"), +d.getAttribute("cy"), 960, 1000), { autoAlpha: 0, duration: 0.1 }] }, k ? "<0.08" : ">0.2"));
      ctr.flip(tl, ">-0.3");
      tl.to(lab0, { autoAlpha: 0, duration: 0.3 }, "<");
      tl.fromTo(lab1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">-0.1");
      tl.fromTo(s1, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "<");

      // ================= 2: "No recuerda" y "No sabe" → faltantes =================
      S.step();
      tl.to(s1, { autoAlpha: 0, y: 30, duration: 0.35 }, ">");
      spin(">");
      const qs = missing.slice(0, 6).map((d) => L.s("text", { x: +d.getAttribute("cx"), y: +d.getAttribute("cy") + 9, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 30, fill: C.crimson }, svg, "?"));
      gsap.set(qs, { autoAlpha: 0 });
      tl.to(missing, { attr: { fill: "#fffdf8", stroke: C.crimson, "stroke-width": 2.5 }, opacity: 1, duration: 0.4, stagger: 0.03 }, "<");
      tl.fromTo(qs, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(3)" }, ">-0.2");
      qs.forEach((q, k) => tl.to(q, { keyframes: [...via(+q.getAttribute("x"), +q.getAttribute("y"), 960, 1000), { autoAlpha: 0, duration: 0.1 }] }, k ? "<0.07" : ">0.1"));
      tl.fromTo(s2, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, ">-0.3");

      // ================= 3: caen las secciones sin variables útiles; las demás se abren y sueltan lo que sobra =================
      S.step();
      tl.to(s2, { autoAlpha: 0, y: 30, duration: 0.35 }, ">");
      spin(">", 2);
      tl.to(vHead, { autoAlpha: 0, duration: 0.3 }, "<");
      dropS.forEach((s, i) => {
        const x0 = parseFloat(s.c.style.left) + 187, y0 = parseFloat(s.c.style.top) + 40;
        tl.to(s.c, { keyframes: [{ x: CH[0] - x0, y: CH[1] - 40 - y0, scale: 0.3, rotation: (i % 2 ? 1 : -1) * 25, duration: 0.55, ease: "power2.in" }, { y: 1000 - y0, x: 960 - x0, scale: 0.05, autoAlpha: 0, duration: 0.35 }] }, i ? "<0.06" : "<0.2");
      });
      let top = 392;
      keptS.forEach((s, i) => {
        tl.to(s.c, { left: 190, top, width: 1540, height: 84, duration: 0.7, ease: "power3.inOut" }, i ? "<0.05" : ">-0.3");
        tl.to(s.sub, { autoAlpha: 0, height: 0, marginTop: 0, duration: 0.3 }, "<");
        top += 94;
      });
      tl.fromTo(keptS.flatMap((s) => s.chips), { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.025, ease: "back.out(2)" }, ">-0.1");
      const unused = keptS.flatMap((s) => s.chips.filter((c) => !c._keep));
      tl.to(unused, { y: 40, rotation: 20, autoAlpha: 0, duration: 0.4, stagger: 0.04, ease: "power2.in" }, ">0.4");
      tl.to(unused, { width: 0, paddingLeft: 0, paddingRight: 0, marginRight: 0, borderWidth: 0, duration: 0.4, ease: "power2.inOut" }, ">-0.1");
      L.pop(tl, keepMsg, "<", { from: { y: -10 } });
      tl.fromTo(s3, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "<");

      // ================= 4: sin primaria → 0 estímulos escolares (se quedan) =================
      S.step();
      const secX = keptS.find((s) => s.chips.some((c) => c.textContent === "p35"));
      tl.to(s3, { autoAlpha: 0, y: 30, duration: 0.35 }, ">");
      tl.to(noPrim, { attr: { fill: C.blueD }, opacity: 1, duration: 0.3 }, ">");
      tl.fromTo(badges, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: "back.out(3)" }, ">");
      tl.to(secX.chips.filter((c) => /p35|p36/.test(c.textContent)), { background: C.blueL, scale: 1.12, duration: 0.25, yoyo: true, repeat: 3 }, "<");
      tl.fromTo(s4, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, "<");

      // ================= 5: la máquina entrega la base final =================
      S.step();
      spin(">", 2);
      tl.to([keepMsg, s4], { autoAlpha: 0, duration: 0.3 }, "<");
      tl.fromTo(finT, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "back.out(1.6)" }, ">");
      tl.to(keptS.map((s) => s.c), { background: "#F3ECF6", borderColor: C.plum, duration: 0.5, stagger: 0.08 }, "<");
      tl.to(body, { attr: { stroke: C.plum }, duration: 0.5 }, "<");
    },
  });
})();
