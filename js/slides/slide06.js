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

  // Variables del cuestionario (Etapa 1, Tabla 1) y cuáles se quedan
  const VARS = [
    ["p1 · sabe leer y escribir", 0], ["p3_1 · leyó libros", 1], ["p3_2 · revistas", 0], ["p3_3 · periódicos", 0],
    ["p3_4 · historietas", 0], ["p3_5 · páginas de internet", 0], ["p4 · número de libros", 1], ["p5–p9 · sobre los libros", 0],
    ["p10–p15 · revistas", 0], ["p16–p21 · periódicos", 0], ["p22–p23 · historietas", 0], ["p24–p25 · internet", 0],
    ["p26–p31 · características", 0], ["p32 · motivo de no lectura", 0], ["p33 · bibliotecas y librerías", 0], ["p34a–d · estímulos en casa", 1],
    ["p34d1 · libros en casa", 1], ["p35 · asistió a la primaria", 1], ["p36a–d · estímulos en la escuela", 1], ["nivel · escolaridad", 1],
    ["edad", 1], ["sexo", 0], ["entidad", 0], ["año", 1],
  ];

  Deck.add({
    transition: "pageTurn",
    notes: "Ninguna variable tenía NA: la falta de respuesta venía codificada. El 0 es un 'blanco por pase', no un faltante. p4 = 99 se conservó (rango válido 01–99). Las 21 filas repetidas son personas distintas y se conservaron. Verificamos celda por celda contra los archivos del INEGI.",
    build(el, S) {
      const tl = S.tl;
      const head = L.head(el, "Preparación de los datos");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ---- La máquina ----
      const svg = L.svg(el);
      const body = L.s("path", { d: L.roughRect(70, 150, 1780, 850, L.rng(3), 3), fill: "rgba(255,253,248,.85)", stroke: C.ink, "stroke-width": 5, "stroke-linejoin": "round", filter: "url(#ink)" }, svg);
      const divider = L.s("path", { d: "M850,190 V960", stroke: C.ink, "stroke-width": 3, "stroke-dasharray": "10 10", fill: "none", opacity: 0.5 }, svg);
      const pipes = L.s("path", { d: "M860,150 V112 H1080 V150 M1260,150 V100 H1480 V150", fill: "none", stroke: C.ink, "stroke-width": 8, "stroke-linejoin": "round" }, svg);
      const chute = L.s("path", { d: "M300,1000 L330,1060 H520 L550,1000", fill: C.band, stroke: C.ink, "stroke-width": 4 }, svg);
      const bin = L.s("path", { d: "M1560,1000 L1580,1070 H1780 L1800,1000", fill: C.band, stroke: C.ink, "stroke-width": 4 }, svg);
      const gears = [[1700, 128, 46, C.plumL], [1790, 170, 30, C.amberL], [1615, 175, 32, C.blueL]].map(([x, y, rr, col]) => {
        const g = L.s("g", { "data-role": "gear" }, svg);
        gsap.set(g, { x, y });
        L.s("path", { d: gearPath(rr, rr > 40 ? 12 : 9, 10), fill: col, stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round" }, g);
        L.s("circle", { r: rr * 0.32, fill: "#fffdf8", stroke: C.ink, "stroke-width": 3 }, g);
        return g;
      });

      // ---- Personas (izquierda) ----
      const ctr = flipCounter(el, "11,966", "11,685", { left: "175px", top: "200px" });
      const lab0 = L.h("div", { class: "abs", style: { left: "640px", top: "240px", fontSize: "34px", fontWeight: 800 } }, el, "personas");
      const lab1 = L.h("div", { class: "abs", style: { left: "640px", top: "222px", fontSize: "32px", fontWeight: 800, color: C.plum, lineHeight: 1.05 } }, el, "personas<br>alfabetas");
      const years = D.general.anios.map((y, i) => L.h("div", { class: "abs", style: { left: 110 + i * 120 + "px", top: "320px", width: "110px", textAlign: "center", borderRadius: "12px", border: `2px solid ${C.ink}`, background: [C.blueL, C.amberL, C.plumL, "#D7E8C8", C.blueL, C.amberL][i], padding: "6px 0" } }, el,
        `<div class="h-title" style="font-size:28px">${y}</div><div style="font-size:21px;font-weight:700;color:${C.ink2}">${L.fmt.int(D.general.registrosPorAnio[i])}</div>`));
      const dots = [];
      const COLS = 24, ROWS = 10;
      for (let rI = 0; rI < ROWS; rI++) for (let c = 0; c < COLS; c++) {
        dots.push(L.s("circle", { cx: 130 + c * 29, cy: 470 + rI * 46, r: 10.5, fill: C.ink, opacity: 0.78 }, svg));
      }
      const rnd = L.rng(11);
      const order = dots.map((d, i) => i).sort(() => rnd() - 0.5);
      const illit = order.slice(0, 6).map((i) => dots[i]);           // ≈ 281 de 11,966
      const missing = order.slice(6, 23).map((i) => dots[i]);        // ≈ 7% con "No recuerda"
      const noPrim = order.slice(23, 26).map((i) => dots[i]);        // ≈ 124 personas
      const badges = noPrim.map((d) => {
        const g = L.s("g", {}, svg);
        L.s("circle", { cx: +d.getAttribute("cx") + 12, cy: +d.getAttribute("cy") - 14, r: 13, fill: C.blueM, stroke: C.ink, "stroke-width": 2 }, g);
        L.s("text", { x: +d.getAttribute("cx") + 12, y: +d.getAttribute("cy") - 7, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 19, fill: "#fff" }, g, "0");
        return g;
      });
      const qs = missing.map((d) => L.s("text", { x: +d.getAttribute("cx"), y: +d.getAttribute("cy") - 16, "text-anchor": "middle", "font-family": "Caveat", "font-weight": 700, "font-size": 30, fill: C.crimson }, svg, "?"));
      const msg = (t, col, top) => L.h("div", { class: "abs hand", style: { left: "110px", width: "720px", top: top + "px", fontSize: "38px", color: col, lineHeight: 1.05 } }, el, t);
      const m1 = msg("– 281 personas que no saben leer", C.crimson, 940);
      const m2 = msg("'No recuerda' y 'No sabe' → datos faltantes", C.crimson, 940);
      const m4 = msg("124 personas que no fueron a la primaria: 0 estímulos escolares", C.blueD, 912);
      m4.style.fontSize = "33px";

      // ---- Variables (derecha) ----
      const vHead = L.h("div", { class: "abs h-title", style: { left: "900px", top: "190px", fontSize: "38px" } }, el, `${L.num(108)} variables por año`);
      const chips = VARS.map(([t, keep], i) => {
        const c = L.h("div", { class: "abs", style: { left: 900 + (i % 3) * 312 + "px", top: 258 + Math.floor(i / 3) * 76 + "px", width: "298px", height: "62px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", fontSize: "21px", fontWeight: 700, lineHeight: 1.1, border: `2px solid ${C.ink}`, borderRadius: "12px", background: "#fffdf8", padding: "0 8px" } }, el, t);
        c._keep = keep;
        return c;
      });
      const kept = chips.filter((c) => c._keep), drop = chips.filter((c) => !c._keep);
      const keepMsg = L.h("div", { class: "abs hand", style: { left: "900px", top: "190px", fontSize: "44px", color: C.plum } }, el, "Solo nos enfocamos en estas variables");
      const why = L.h("div", { class: "abs hand", style: { left: "900px", top: "690px", width: "900px", fontSize: "34px", color: C.ink2, lineHeight: 1.2 } }, el,
        "p33: puede ser causa o consecuencia de leer<br>p8 y p32: solo las contestan algunas personas<br>entidad: 32 categorías difíciles de comparar");

      // ---- Base final ----
      const fin = L.h("div", { class: "card", style: { left: "250px", top: "250px", width: "1420px", height: "640px", padding: "36px 48px", textAlign: "center" } }, el);
      L.h("div", { class: "h-title", style: { fontSize: "56px" } }, fin, "Base final: 11,685 personas");
      const finVars = [["lee", "p3_1", C.plumL], ["libros", "p4", C.plumL], ["ind_hogar", "p34a–d", C.amberL], ["ind_escuela", "p36a–d", C.blueL], ["libros_casa", "p34d1", C.amberL], ["escolaridad", "nivel", "#D7E8C8"], ["edad", "edad", "#E4E0D8"], ["año", "2019–2024", "#E4E0D8"]];
      const grid = L.h("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "22px", marginTop: "40px" } }, fin);
      const fChips = finVars.map(([n, src, bgc]) => L.h("div", { style: { border: `2.5px solid ${C.ink}`, borderRadius: "14px", background: bgc, padding: "16px 8px" } }, grid,
        `<div class="h-title" style="font-size:36px">${n}</div><div style="font-size:22px;font-weight:700;color:${C.ink2}">${src}</div>`));
      const t1 = L.h("div", { class: "tag", style: { left: "330px", top: "760px", color: C.amberD } }, el, "Índice del hogar: 658 faltantes (5.6%)");
      const t2 = L.h("div", { class: "tag", style: { left: "1000px", top: "760px", color: C.blueD } }, el, "Índice de la escuela: 858 faltantes (7.3%)");
      fin.dataset.role = "final";

      // ================= Entrada: la máquina se arma con todo adentro =================
      gsap.set([lab1, m1, m2, m4, keepMsg, why, fin, t1, t2, ...qs, ...badges], { autoAlpha: 0 });
      L.draw(tl, body, 0.2, { duration: 1.2 });
      tl.fromTo([pipes, chute, bin, divider], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, stagger: 0.1 }, "<0.6");
      tl.fromTo(gears, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.1 }, "<");
      tl.fromTo(ctr.wrap, { autoAlpha: 0, y: -30 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "back.out(1.6)" }, ">-0.2");
      tl.fromTo(lab0, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.3");
      tl.fromTo(years, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, "<0.2");
      tl.fromTo(dots, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, stagger: { amount: 1.2, grid: [ROWS, COLS], from: "start" } }, "<0.3");
      tl.fromTo(vHead, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<");
      L.counts(tl, vHead, "<", 1.2);
      tl.fromTo(chips, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.3, stagger: 0.04, ease: "back.out(2)" }, "<0.2");

      const spin = (pos, turns = 1) => tl.to(gears, { rotation: `+=${360 * turns}`, duration: 1.2, ease: "power1.inOut" }, pos);

      // ================= 1: fuera quienes no saben leer =================
      S.step();
      spin(">");
      L.pop(tl, m1, "<", { from: { y: 10 } });
      tl.to(illit, { attr: { fill: C.crimson }, opacity: 1, duration: 0.3 }, "<");
      tl.to(illit, { x: (i, t) => 420 - +t.getAttribute("cx"), y: (i, t) => 1100 - +t.getAttribute("cy"), duration: 1.1, ease: "power2.in", stagger: 0.08 }, ">0.3");
      tl.to(illit, { autoAlpha: 0, duration: 0.2 }, ">-0.2");
      ctr.flip(tl, "<-0.4");
      tl.to(lab0, { autoAlpha: 0, duration: 0.3 }, "<");
      tl.fromTo(lab1, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, ">-0.1");

      // ================= 2: "No recuerda" y "No sabe" → faltantes =================
      S.step();
      tl.to(m1, { autoAlpha: 0, duration: 0.3 }, ">");
      L.pop(tl, m2, ">", { from: { y: 10 } });
      tl.fromTo(qs, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "back.out(3)" }, "<");
      tl.to(missing, { attr: { fill: "#fffdf8", stroke: C.crimson, "stroke-width": 3 }, duration: 0.4, stagger: 0.04 }, ">0.2");
      tl.to(qs, { autoAlpha: 0, y: -14, duration: 0.4 }, ">0.3");

      // ================= 3: solo nos quedamos con estas variables =================
      S.step();
      spin(">", 2);
      tl.to(vHead, { autoAlpha: 0, duration: 0.3 }, "<");
      drop.forEach((c, i) => {
        tl.to(c, { x: 1680 - (parseFloat(c.style.left) + 149), y: 1120 - parseFloat(c.style.top), rotation: (i % 2 ? 1 : -1) * (20 + i * 3), scale: 0.4, autoAlpha: 0, duration: 0.8, ease: "power2.in" }, i ? "<0.07" : "<0.2");
      });
      kept.forEach((c, i) => {
        tl.to(c, { x: 900 + (i % 2) * 312 - parseFloat(c.style.left), y: 268 + Math.floor(i / 2) * 76 - parseFloat(c.style.top), background: C.plumL, duration: 0.8, ease: "power3.inOut" }, i ? "<0.05" : ">-0.2");
      });
      L.pop(tl, keepMsg, "<", { from: { y: -10 } });
      L.pop(tl, why, ">", { from: { x: 30, y: 0 }, to: { x: 0 } });

      // ================= 4: sin primaria → 0 estímulos escolares =================
      S.step();
      tl.to(m2, { autoAlpha: 0, duration: 0.3 }, ">");
      L.pop(tl, m4, ">", { from: { y: 10 } });
      tl.to(noPrim, { attr: { fill: C.blueD }, opacity: 1, duration: 0.3 }, "<");
      tl.fromTo(badges, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.15, ease: "back.out(3)" }, ">");
      tl.to(kept.find((c) => c.textContent.startsWith("p36")), { scale: 1.08, duration: 0.25, yoyo: true, repeat: 3 }, "<");

      // ================= 5: la máquina entrega la base final =================
      S.step();
      spin(">", 2);
      tl.to([why, keepMsg, m4, ctr.wrap, lab1, divider, ...years], { autoAlpha: 0, duration: 0.4 }, "<");
      tl.to(dots, { x: (i, t) => 960 - +t.getAttribute("cx"), y: (i, t) => 560 - +t.getAttribute("cy"), scale: 0.3, autoAlpha: 0, duration: 0.9, ease: "power3.in", stagger: { amount: 0.4, from: "random" } }, "<0.1");
      tl.to(badges, { autoAlpha: 0, duration: 0.3 }, "<");
      tl.to(kept, { x: (i, t) => 960 - (parseFloat(t.style.left) + 149), y: (i, t) => 560 - parseFloat(t.style.top), scale: 0.3, autoAlpha: 0, duration: 0.9, ease: "power3.in", stagger: 0.04 }, "<");
      tl.fromTo(fin, { autoAlpha: 0, scale: 0.3 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(1.4)" }, ">-0.1");
      tl.fromTo(fChips, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.08 }, ">-0.2");
      tl.fromTo([t1, t2], { autoAlpha: 0, y: 20, rotation: -3 }, { autoAlpha: 1, y: 0, rotation: -1, duration: 0.5, stagger: 0.2, ease: "back.out(2)" }, ">");
    },

    /* ---------- Súper transición 6 → 7: la máquina imprime la siguiente página ---------- */
    out(from, to, fx) {
      const tl = gsap.timeline();
      const gears = [...from.querySelectorAll("[data-role=gear]")];
      const fin = from.querySelector("[data-role=final]");
      const svg = L.svg(fx, { style: "position:absolute;left:0;top:0" });
      const puffs = [];
      const r = L.rng(5);
      for (let i = 0; i < 10; i++) puffs.push(L.s("circle", { cx: [410, 1430][i % 2] + (r() - 0.5) * 120, cy: 100, r: 30 + r() * 30, fill: "#fffdf8", stroke: "#D8CDB8", "stroke-width": 3 }, svg));
      const chipCols = [C.amberM, C.blueM, C.plum, C.amberL, C.blueL, C.plumL, "#9DBF9A"];
      const bits = [];
      for (let i = 0; i < 36; i++) bits.push(L.s("rect", { x: 940, y: 540, width: 26 + r() * 30, height: 16 + r() * 12, rx: 4, fill: chipCols[i % chipCols.length], stroke: C.ink, "stroke-width": 2 }, svg));

      gsap.set(to, { zIndex: 6, autoAlpha: 0, transformOrigin: "50% 50%", transformPerspective: 2200 });
      gsap.set(from, { zIndex: 2, transformOrigin: "50% 52%" });
      // 1 · engranes a toda velocidad, la máquina tiembla y echa vapor
      tl.to(gears, { rotation: "+=900", duration: 1.6, ease: "power2.in" }, 0)
        .to(from, { keyframes: [{ x: -6, y: 2 }, { x: 6, y: -2 }, { x: -4, y: 3 }, { x: 5, y: -1 }, { x: -3, y: 2 }, { x: 0, y: 0 }], duration: 1.2, ease: "none" }, 0.3)
        .fromTo(puffs, { scale: 0.2, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 2.2, autoAlpha: 0.9, y: -60, duration: 0.9, stagger: 0.08, ease: "power2.out" }, 0.2)
        .to(puffs, { autoAlpha: 0, duration: 0.5, stagger: 0.05 }, 1.0)
        .to(fin, { scale: 1.06, boxShadow: "0 0 0 8px rgba(122,78,140,.45), 0 20px 60px rgba(122,78,140,.4)", duration: 0.4, yoyo: true, repeat: 1 }, 0.9);
      // 2 · estallido de fichas (las variables se transforman)
      tl.fromTo(bits, { autoAlpha: 0, x: 0, y: 0, rotation: 0 }, { autoAlpha: 1, x: () => (r() - 0.5) * 1800, y: () => (r() - 0.6) * 1100, rotation: () => (r() - 0.5) * 720, duration: 1.1, ease: "power3.out" }, 1.6)
        .to(bits, { autoAlpha: 0, duration: 0.4 }, 2.4);
      // 3 · de la máquina sale la nueva hoja, gira y llena la pantalla
      tl.to(from, { scale: 1.6, autoAlpha: 0, duration: 1.2, ease: "power2.in" }, 1.6)
        .fromTo(to, { autoAlpha: 1, scale: 0.06, y: 20, rotation: -540, rotationX: 50 }, { scale: 1, y: 0, rotation: 0, rotationX: 0, duration: 1.6, ease: "power3.inOut" }, 1.7);
      return { tl, cleanup() { svg.remove(); gsap.set(gears, { rotation: 0 }); gsap.set(fin, { clearProps: "boxShadow,scale" }); } };
    },
  });
})();
