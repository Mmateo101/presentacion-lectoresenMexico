/* Propuestas: personitas cargan libros enormes y arman una torre; cada libro lleva una libreta con una fase */
(function () {
  const { C } = L;
  const { person, mood, walk } = Chars;

  const FASES = [
    "Encuestar a estudiantes por medio de sus profesores para enlistar los estímulos que reciben.",
    "Identificar a los alumnos con estímulos bajos en casa.",
    "Identificar las regiones con menos acceso y ponerles énfasis.",
    "Invitar personalmente a los talleres a los padres y a quien quiera participar.",
  ];
  const BOOKS = ["#7A4E8C", "#2E7D86", "#B5507A", "#4B5AA8"];
  const SHIRTS = [[C.amberM, C.blueM], ["#86B58F", C.plum], [C.blueM, "#D488A8"], [C.amberD, "#6FB0B7"]];

  const FLOOR = 1030, TABLE = 860, BW = 1250, BH = 140, STEP = 146, CARRY = 866;

  /* Caminar cargando: piernas y cuerpo se mueven, los brazos se quedan arriba sosteniendo el libro */
  function carry(tl, p, x0, x1, dur, pos) {
    const steps = Math.max(2, Math.round(dur / 0.32));
    p.arms.forEach((a, j) => tl.set(a, { rotation: j ? -150 : 150, svgOrigin: a._pivot.join(" ") }, pos));
    tl.fromTo(p.g, { x: x0 }, { x: x1, duration: dur, ease: "none" }, pos);
    p.legs.forEach((lg, i) => tl.fromTo(lg, { rotation: i ? -18 : 18, svgOrigin: `0 ${p.hipY}` },
      { rotation: i ? 18 : -18, svgOrigin: `0 ${p.hipY}`, duration: dur / steps, ease: "sine.inOut", repeat: steps - 1, yoyo: true, immediateRender: false }, "<"));
    tl.fromTo(p.body, { y: 0 }, { y: -4, duration: dur / steps / 2, ease: "sine.inOut", repeat: steps * 2 - 1, yoyo: true, immediateRender: false }, "<");
    tl.to([...p.legs, p.body], { rotation: 0, y: 0, duration: 0.25 }, ">");
  }

  Deck.add({
    transition: "pageTurn",
    notes: "Propuestas en cuatro fases: (1) encuestar a estudiantes por medio de profesores para enlistar estímulos; (2) identificar a los alumnos con estímulos bajos en casa; (3) identificar regiones y ponerles énfasis; (4) invitar personalmente a los talleres a los padres y a quien quiera.",
    build(el, S) {
      const tl = S.tl;
      const svg = L.svg(el);
      const WOOD = "#9C6B43", WOOD_D = "#6E4627";

      // ---- Título: PROPUESTAS en lomos de libros ----
      const WORD = "PROPUESTAS", LW = 84, LG = 6;
      const x0 = 960 - (WORD.length * (LW + LG) - LG) / 2;
      const plank = L.s("rect", { x: x0 - 30, y: 232, width: WORD.length * (LW + LG) + 54, height: 14, rx: 3, fill: WOOD, stroke: WOOD_D, "stroke-width": 3 }, svg);
      const letters = [...WORD].map((ch, i) => {
        const h = 128 + ((i * 37) % 4) * 9;
        const g = L.s("g", {}, svg);
        gsap.set(g, { x: x0 + i * (LW + LG), y: 232 - h });
        L.s("rect", { x: 0, y: 0, width: LW, height: h, rx: 4, fill: ["#4E2E5B", C.plum][i % 2], stroke: C.ink, "stroke-width": 2.5 }, g);
        L.s("rect", { x: 5, y: 12, width: LW - 10, height: 6, fill: "rgba(255,255,255,.5)" }, g);
        L.s("rect", { x: 5, y: h - 20, width: LW - 10, height: 6, fill: "rgba(255,255,255,.5)" }, g);
        L.s("text", { x: LW / 2, y: h / 2 + 18, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 50, fill: "#F2D48A" }, g, ch);
        return g;
      });

      // ---- Mesa donde se arma la torre y piso ----
      const table = L.s("g", {}, svg);
      L.s("rect", { x: 300, y: TABLE, width: 1320, height: 20, rx: 4, fill: WOOD, stroke: WOOD_D, "stroke-width": 3 }, table);
      [330, 1570].forEach((x) => L.s("rect", { x, y: TABLE + 20, width: 22, height: FLOOR - TABLE - 20, fill: WOOD, stroke: WOOD_D, "stroke-width": 3 }, table));
      const floor = L.s("line", { x1: 0, x2: 1920, y1: FLOOR, y2: FLOOR, stroke: C.ink, "stroke-width": 3, opacity: 0.5 }, svg);

      // entrada: piso y mesa, luego caen los libros del título
      tl.fromTo([floor, table], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
      tl.fromTo(plank, { scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.fromTo(letters, { y: "-=320", autoAlpha: 0 }, { y: "+=320", autoAlpha: 1, duration: 0.6, ease: "bounce.out", stagger: 0.09 }, 0.35);
      tl.to(letters.map((g) => g.querySelector("text")), { attr: { fill: "#FFF3C4" }, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.06 }, ">");

      // ---- Cada fase: dos personitas traen un libro gigante, lo suben a la torre y encima queda una libreta ----
      const fg = L.s("g", {}, svg); // personas al frente
      FASES.forEach((txt, i) => {
        S.step();
        const bottom = TABLE - i * STEP, top = bottom - BH;
        const book = L.s("g", {}, svg);
        svg.insertBefore(book, fg);
        L.s("rect", { x: 0, y: 0, width: BW, height: BH, rx: 10, fill: BOOKS[i], stroke: C.ink, "stroke-width": 3 }, book);
        L.s("rect", { x: 26, y: 0, width: 16, height: BH, fill: "rgba(255,255,255,.35)" }, book);
        L.s("rect", { x: BW - 42, y: 0, width: 16, height: BH, fill: "rgba(255,255,255,.35)" }, book);
        L.s("rect", { x: 60, y: BH - 12, width: BW - 120, height: 6, fill: "#F2D48A", opacity: 0.8 }, book);
        const bx = 960 - BW / 2, startX = -BW - 260;
        gsap.set(book, { x: startX, y: CARRY - BH });
        const kids = SHIRTS[i].map((shirt, k) => {
          const p = person(fg, { age: "child", shirt, style: k ? "curly" : "short", mood: "flat", x: startX + (k ? BW - 220 : 220), y: FLOOR, s: 0.8 });
          p.arms.forEach((a, j) => gsap.set(a, { rotation: j ? -150 : 150, svgOrigin: a._pivot.join(" ") }));
          return p;
        });
        // llegan cargando
        const D = 2.4;
        tl.addLabel(`f${i}`, ">");
        tl.fromTo(book, { x: startX }, { x: bx, duration: D, ease: "none" }, `f${i}`);
        kids.forEach((p, k) => carry(tl, p, startX + (k ? BW - 220 : 220), bx + (k ? BW - 220 : 220), D, `f${i}`));
        // ¡arriba! el libro sube a su lugar en la torre
        tl.to(book, { y: top, duration: 0.7, ease: "back.out(1.6)" }, `f${i}+=${D + 0.15}`);
        kids.forEach((p) => mood(tl, p, "big", "<"));
        tl.to(kids.map((p) => p.g), { y: FLOOR - 26, duration: 0.18, yoyo: true, repeat: 1, ease: "power1.out" }, "<");
        // se van caminando
        kids.forEach((p, k) => walk(tl, p, bx + (k ? BW - 220 : 220), 2150 + k * 120, { dur: 1.8, pos: k ? "<" : ">0.1", ir: false }));
        // libreta con la fase
        const pad = L.h("div", { class: "abs", style: { left: 960 - 500 + "px", top: top + 12 + "px", width: "1000px", height: BH - 24 + "px", background: "#FFFDF6 var(--grain)", borderRadius: "6px", boxShadow: "0 8px 16px rgba(30,20,10,.3)", transform: `rotate(${i % 2 ? 1.2 : -1.2}deg)`, display: "flex", alignItems: "center", gap: "22px", padding: "18px 32px 10px", backgroundImage: "radial-gradient(circle at 50% 4px, #6B6875 0 5px, transparent 6px)", backgroundSize: "34px 14px", backgroundRepeat: "repeat-x" } }, el);
        const num = L.h("div", { class: "h-title", style: { flex: "none", width: "58px", height: "58px", borderRadius: "50%", background: BOOKS[i], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" } }, pad, String(i + 1));
        const tx = L.h("div", { class: "hand", style: { fontSize: "36px", lineHeight: 1.08, color: C.ink } }, pad, txt);
        gsap.set([pad, num], { autoAlpha: 0 });
        tl.fromTo(pad, { autoAlpha: 0, y: -60, scale: 1.15 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: "back.out(2)" }, "<0.3");
        tl.fromTo(num, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "back.out(3)" }, ">-0.1");
        L.write(tl, tx, { pos: ">", dur: Math.min(2.2, txt.length * 0.025) });
      });
    },
  });
})();
