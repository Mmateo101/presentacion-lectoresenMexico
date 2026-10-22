/* Diapositiva 1 · Portada + transición insignia (caligrafía → libro de piel → hojas que pasan) */
(function () {
  const { C } = L;

  /* Tapa de piel con marco dorado (se reutiliza en la diapositiva 13) */
  function leather(parent, style = {}) {
    const d = L.h("div", {
      class: "leather",
      style: Object.assign({
        position: "absolute", borderRadius: "10px 18px 18px 10px",
        background: "radial-gradient(120% 90% at 40% 35%, #8A5C9C 0%, #6A4179 45%, #4E2E5B 100%)",
        boxShadow: "inset 0 0 40px rgba(20,8,24,.45), inset 0 0 0 3px rgba(255,255,255,.06), 0 24px 50px rgba(50,30,20,.35)",
        overflow: "hidden",
      }, style),
    }, parent);
    L.h("div", { style: { position: "absolute", inset: 0, backgroundImage: "var(--grain)", mixBlendMode: "multiply", opacity: 0.9 } }, d);
    L.h("div", { class: "gold1", style: { position: "absolute", inset: "26px", border: "3px solid #D8B66A", borderRadius: "8px", boxShadow: "0 0 0 1px rgba(80,50,10,.3), inset 0 0 0 1px rgba(80,50,10,.3)" } }, d);
    L.h("div", { class: "gold2", style: { position: "absolute", inset: "40px", border: "1.5px solid rgba(216,182,106,.8)", borderRadius: "5px" } }, d);
    // ornamentos en las esquinas
    const orn = L.h("div", { style: { position: "absolute", inset: "26px" } }, d);
    ["0,0,0", "100%,0,90", "100%,100%,180", "0,100%,270"].forEach((s) => {
      const [x, y, r] = s.split(",");
      const sv = L.s("svg", { width: 70, height: 70, viewBox: "0 0 70 70", style: `position:absolute;left:${x};top:${y};transform:translate(-50%,-50%) rotate(${r}deg) translate(35px,35px)` }, orn);
      L.s("path", { d: "M4,4 C30,4 40,14 40,40 M4,4 C4,30 14,40 40,40 M14,14 q14,-2 16,16 q-16,-2 -16,-16 Z", fill: "none", stroke: "#D8B66A", "stroke-width": 2.4 }, sv);
      L.s("circle", { cx: 4, cy: 4, r: 4, fill: "#D8B66A" }, sv);
    });
    return d;
  }

  function paperFace(parent, tint = "#FBF8F1", lines = false, seed = 1) {
    const f = L.h("div", { class: "face", style: { background: `${tint} var(--grain)`, boxShadow: "inset 0 0 30px rgba(150,120,80,.18)" } }, parent);
    if (lines) { // ilustraciones tenues en las hojas que pasan
      const sv = L.s("svg", { width: "100%", height: "100%", viewBox: "0 0 806 907", style: "position:absolute;inset:0" }, f);
      const r = L.rng(seed);
      const cols = [C.blueL, C.amberL, C.plumL];
      L.wash(sv, { cx: 200 + r() * 400, cy: 250 + r() * 300, rx: 200, ry: 150, color: cols[seed % 3], opacity: 0.5, seed, layers: 1 });
      for (let i = 0; i < 9; i++) L.s("line", { x1: 120, x2: 680 - r() * 160, y1: 560 + i * 34, y2: 560 + i * 34, stroke: "#CFC6B6", "stroke-width": 3, "stroke-linecap": "round" }, sv);
    }
    return f;
  }

  Deck.add({
    notes: "Presentación del equipo y del título.",
    build(el, S) {
      const tl = S.tl;
      const svg = L.svg(el);
      // acuarela tenue en las esquinas: azul a la izquierda, ámbar a la derecha
      const w1 = L.wash(svg, { cx: 40, cy: 60, rx: 420, ry: 300, color: C.blueL, opacity: 0.55, seed: 4 });
      const w2 = L.wash(svg, { cx: 0, cy: 1040, rx: 360, ry: 260, color: C.blueM, opacity: 0.28, seed: 9, filter: "wc2" });
      const w3 = L.wash(svg, { cx: 1900, cy: 40, rx: 400, ry: 280, color: C.amberL, opacity: 0.6, seed: 12 });
      const w4 = L.wash(svg, { cx: 1920, cy: 1050, rx: 380, ry: 260, color: C.amberM, opacity: 0.26, seed: 15, filter: "wc2" });

      const wrap = L.h("div", { class: "abs cover-text", style: { left: "170px", right: "170px", top: "70px", textAlign: "center" } }, el);
      const logo = L.h("img", { src: "assets/tec_logo.png", alt: "Tecnológico de Monterrey", style: { height: "92px", display: "block", margin: "0 auto 46px" } }, wrap);
      logo.onerror = () => { logo.style.visibility = "hidden"; };
      const title = L.h("div", { class: "h-title", style: { fontSize: "58px", color: C.ink, lineHeight: 1.16 } }, wrap,
        "Análisis estadístico de la desigualdad en el acceso a la lectura en la infancia y su impacto en los hábitos de lectura en la vida adulta");
      const rule = L.h("div", { style: { width: "220px", height: "3px", margin: "38px auto 30px", background: C.plum, opacity: 0.6, borderRadius: "2px" } }, wrap);
      const course = L.h("div", { style: { fontSize: "30px", fontWeight: 600, color: C.ink2 } }, wrap, "MA1001B. Modelación estadística para la toma de decisiones (Grupo 202)");
      const team = L.h("div", { class: "h-title", style: { fontSize: "40px", marginTop: "26px", color: C.plum } }, wrap, "Equipo 7");
      const names = [
        "Fernando Isaac Martínez García · A00837933",
        "Mateo Rodolfo Flores Torres · A01783438",
        "Eliel Silva Morales · A00844569",
        "César Julián Leal Salazar · A00842112",
      ].map((n, i) => L.h("div", { style: { fontSize: "30px", marginTop: i ? "6px" : "14px" } }, wrap, n));
      const profs = L.h("div", { style: { fontSize: "27px", marginTop: "30px", color: C.ink2, fontStyle: "italic" } }, wrap, "Dra. Blanca Rosa Ruiz Hernández · Dra. María Guadalupe Tobías Lara");

      // pre-separar en letras con su versión caligráfica (para la transición)
      [title, course, team, ...names, profs].forEach((e) => { e._chars = L.splitChars(e, { cal: true }); });

      // ---- Entrada ----
      tl.fromTo([w1, w2, w3, w4], { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 1.6, stagger: 0.12, ease: "power2.out" }, 0);
      L.pop(tl, logo, 0.3, { from: { y: -10 } });
      L.write(tl, title, { pos: 0.7, dur: 3.2 });
      tl.fromTo(rule, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out" }, ">-0.2");
      [course, team, ...names, profs].forEach((e, i) => L.pop(tl, e, i ? ">-0.38" : ">", { from: { y: 14 }, to: { duration: 0.55 } }));
    },

    /* ---------- Transición 1 → 2 ---------- */
    out(from, to, fx) {
      const slidesEl = from.parentNode;
      const tl = gsap.timeline();
      const SC = 0.84, PW = 960 * SC, PH = 1080 * SC; // tamaño de una página del libro abierto
      const X0 = 960, Y0 = (1080 - PH) / 2;           // la tapa cerrada ocupa la mitad derecha
      const M = 16;                                   // sobresale la piel

      // escritorio + tapa trasera (debajo de la diapositiva 2)
      const desk = L.h("div", { style: { position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(80% 80% at 50% 45%, #F7F1E4, #EADFC9)" } }, slidesEl);
      const board = leather(slidesEl, { left: `${960 - PW - M}px`, top: `${Y0 - M}px`, width: `${PW * 2 + 2 * M}px`, height: `${PH + 2 * M}px`, zIndex: 1, opacity: 0 });
      board.querySelectorAll(".gold1,.gold2").forEach((e) => e.remove());
      gsap.set(to, { zIndex: 2, scale: SC, transformOrigin: "50% 50%", clipPath: "inset(0% 0% 0% 50%)", autoAlpha: 0 });
      gsap.set(from, { autoAlpha: 0 });

      // copia de la portada sobre la que se hace toda la magia
      const book = L.h("div", { style: { position: "absolute", inset: 0, transformStyle: "preserve-3d" } }, fx);
      const cover = L.h("div", { class: "fx-page", style: { left: 0, top: 0, width: "1920px", height: "1080px", transformOrigin: "0% 50%", zIndex: 30 } }, book);
      const front = L.h("div", { class: "face" }, cover);
      const lea = leather(front, { inset: 0, opacity: 0 });
      const plate = from.cloneNode(true);
      plate.removeAttribute("id");
      plate.classList.add("on");
      Object.assign(plate.style, { position: "absolute", left: 0, top: 0, width: "1920px", height: "1080px", transformOrigin: "0 0", visibility: "visible", opacity: 1, borderRadius: "6px", boxShadow: "0 0 0 0 rgba(0,0,0,0)" });
      front.appendChild(plate);
      const back = L.h("div", { class: "face", style: { transform: "rotateY(180deg)", background: "#EADCF0", backgroundImage: "radial-gradient(circle at 30% 30%, rgba(122,78,140,.25) 0 18px, transparent 19px), radial-gradient(circle at 70% 70%, rgba(229,154,79,.22) 0 14px, transparent 15px), var(--grain)", backgroundSize: "60px 60px, 46px 46px, auto", borderRadius: "10px 18px 18px 10px" } }, cover);

      // hojas que pasan rápido
      const pages = [];
      for (let i = 0; i < 7; i++) {
        const pg = L.h("div", { class: "fx-page", style: { left: `${X0}px`, top: `${Y0}px`, width: `${PW}px`, height: `${PH}px`, transformOrigin: "0% 50%", zIndex: 20 - i, opacity: 0 } }, book);
        const f = paperFace(pg, i % 2 ? "#FBF8F1" : "#FAF5EA", i % 2 === 0, i + 2);
        const b = paperFace(pg, "#F6F0E3", i % 2 === 1, i + 9);
        b.style.transform = "rotateY(180deg)";
        const sh = L.h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(60,40,20,.28), rgba(60,40,20,0) 45%, rgba(255,255,255,.15))", opacity: 0, backfaceVisibility: "hidden" } }, f);
        pg._sh = sh;
        pages.push(pg);
      }

      // --- A · las letras se vuelven caligrafía con tinta que se extiende ---
      const chars = [...plate.querySelectorAll(".ch")];
      const cals = chars.map((c) => c.querySelector(".cal")).filter(Boolean);
      const textBox = plate.querySelector(".cover-text");
      textBox.style.filter = "url(#calink)";
      const disp = document.getElementById("calinkDisp");
      const blur = document.getElementById("calinkBlur");
      tl.to(chars, { color: "rgba(43,42,51,0)", duration: 0.45, stagger: { each: 0.0045, from: "start" }, ease: "power1.in" }, 0)
        .fromTo(cals, { opacity: 0, scale: 1.5, y: -6, color: C.ink }, { opacity: 1, scale: 1.12, y: 0, duration: 0.55, stagger: { each: 0.0045, from: "start" }, ease: "power2.out" }, 0.08)
        .fromTo(disp, { attr: { scale: 0 } }, { attr: { scale: 7 }, duration: 0.9, ease: "power1.out" }, 0)
        .fromTo(blur, { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: 0.7 }, duration: 0.9 }, 0)
        .to(disp, { attr: { scale: 2.5 }, duration: 0.9 }, 1.1)
        .to(blur, { attr: { stdDeviation: 0 }, duration: 0.9 }, 1.1);

      // --- B · aparece la piel con oro y la portada se vuelve la tapa del libro ---
      const s1 = 0.88;
      tl.fromTo(lea, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power2.out" }, 1.7)
        .to(plate, { scale: s1, x: (1920 - 1920 * s1) / 2, y: (1080 - 1080 * s1) / 2, boxShadow: "0 6px 24px rgba(0,0,0,.35)", duration: 0.9, ease: "power2.inOut" }, 1.7);
      const CW = PW + 2 * M, CH = PH + 2 * M, s2 = (CW - 150) / 1920;
      tl.to(cover, { left: X0 - M, top: Y0 - M, width: CW, height: CH, duration: 1.1, ease: "power3.inOut" }, 2.75)
        .to(plate, { scale: s2, x: (CW - 1920 * s2) / 2, y: CH * 0.44 - (1080 * s2) / 2, duration: 1.1, ease: "power3.inOut" }, 2.75)
        .to(board, { opacity: 1, duration: 0.6 }, 3.3)
        .to(pages, { opacity: 1, duration: 0.01 }, 3.85)
        .set(to, { autoAlpha: 1 }, 3.85);

      // --- C · se abre la tapa ---
      tl.to(cover, { rotationY: -180, duration: 1.25, ease: "power2.inOut" }, 4.0)
        .set(to, { clipPath: "inset(0% 0% 0% 0%)" }, 4.65);

      // --- D · pasan las hojas (física de papel: curvatura y sombra) ---
      pages.forEach((pg, i) => {
        const t0 = 4.9 + i * 0.2;
        tl.to(pg, { rotationY: -180, duration: 0.72, ease: "power2.inOut" }, t0)
          .to(pg, { keyframes: [{ skewY: -5, duration: 0.36 }, { skewY: 0, duration: 0.36 }], ease: "sine.inOut" }, t0)
          .to(pg._sh, { keyframes: [{ opacity: 1, duration: 0.36 }, { opacity: 0, duration: 0.36 }] }, t0)
          .set(pg, { zIndex: 40 + i }, t0 + 0.36);
      });

      // --- E · zoom a la doble página (diapositiva 2) ---
      const tz = 4.9 + 6 * 0.2 + 0.75;
      tl.to(book, { scale: 1 / SC, transformOrigin: "50% 50%", duration: 1.0, ease: "power2.inOut" }, tz)
        .to([cover, ...pages], { opacity: 0, duration: 0.45 }, tz + 0.1)
        .to(board, { scale: 1 / SC, opacity: 0, transformOrigin: "50% 50%", duration: 1.0, ease: "power2.inOut" }, tz)
        .to(to, { scale: 1, duration: 1.0, ease: "power2.inOut" }, tz)
        .to(desk, { opacity: 0, duration: 0.6 }, tz + 0.4);

      return {
        tl,
        cleanup() {
          book.remove(); desk.remove(); board.remove();
          gsap.set(disp, { attr: { scale: 0 } });
          gsap.set(blur, { attr: { stdDeviation: 0 } });
        },
      };
    },
  });

  window.Leather = leather;
})();
