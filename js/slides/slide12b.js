/* Propuestas: los libros llegan deslizándose y arman una torre (cada uno con una libreta y su fase);
   a la izquierda, una escena animada ilustra cada fase */
(function () {
  const { C } = L;
  const { person, mood, arm, walk, Props } = Chars;
  const MX = window.MEXICO;

  const FASES = [
    "Encuestar a estudiantes por medio de sus profesores para enlistar los estímulos que reciben.",
    "Identificar a los alumnos con estímulos bajos en casa.",
    "Identificar las regiones con menos acceso y ponerles énfasis.",
    "Invitar personalmente a los talleres a los padres y a quien quiera participar.",
  ];
  const BOOKS = ["#7A4E8C", "#2E7D86", "#B5507A", "#4B5AA8"];
  const TABLE = 990, BW = 940, BH = 150, STEP = 156, BX = 900; // torre a la derecha
  const PX = 60, PY = 300, FL = 640; // escena de la izquierda: origen y piso (coordenadas locales)

  const star = (cx, cy, r) => {
    let d = "";
    for (let k = 0; k < 10; k++) { const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r; d += (k ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1); }
    return d + "Z";
  };
  const house = (g, x, y, w, h, fill) => {
    const hg = L.s("g", { transform: `translate(${x},${y})` }, g);
    L.s("path", { d: `M0,${h * 0.42} L${w / 2},0 L${w},${h * 0.42} Z`, fill: "#B5507A", stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round" }, hg);
    L.s("rect", { x: w * 0.1, y: h * 0.42, width: w * 0.8, height: h * 0.58, fill: fill || "#F4EEE1", stroke: C.ink, "stroke-width": 3 }, hg);
    return hg;
  };

  /* ---------- Escenas de la izquierda (una por fase); cada una devuelve { g, play } ---------- */
  const SCENES = [
    // 1 · Encuesta por medio de los profesores
    (root, tl) => {
      const g = L.s("g", {}, root);
      Props.blackboard(g, { x: 10, y: 40, w: 300, h: 150 });
      const card = L.s("g", { transform: "translate(360,20)" }, g);
      L.s("rect", { x: 0, y: 0, width: 390, height: 270, rx: 10, fill: "#FFFDF6", stroke: C.ink, "stroke-width": 3 }, card);
      L.s("rect", { x: 150, y: -14, width: 90, height: 26, rx: 6, fill: "#A8A398", stroke: C.ink, "stroke-width": 2.5 }, card);
      L.s("text", { x: 195, y: 46, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 26, fill: C.ink }, card, "Encuesta");
      const ticks = ["¿Había libros en casa?", "¿Le leían?", "¿Iba a bibliotecas?"].map((t, i) => {
        const y = 92 + i * 60;
        L.s("rect", { x: 22, y: y - 22, width: 30, height: 30, rx: 5, fill: "#fff", stroke: C.ink, "stroke-width": 2.5 }, card);
        L.s("text", { x: 66, y, "font-family": "Nunito", "font-weight": 700, "font-size": 23, fill: C.ink }, card, t);
        return L.s("path", { d: `M27,${y - 8} l8,9 l15,-20`, fill: "none", stroke: "#2E7D86", "stroke-width": 5, "stroke-linecap": "round", "stroke-linejoin": "round" }, card);
      });
      const teacher = person(g, { age: "adult", shirt: C.plum, style: "bun", mood: "smile", x: 200, y: FL, s: 0.95 });
      const kids = [[420, C.amberM, "short"], [550, C.blueM, "curly"], [680, "#86B58F", "short"]].map(([x, shirt, style]) => person(g, { age: "child", shirt, style, mood: "smile", x, y: FL, s: 0.8 }));
      gsap.set(g, { autoAlpha: 0 });
      return {
        g,
        play(pos) {
          tl.fromTo(g, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, pos);
          arm(tl, teacher, 0, 110, ">", 0.4);
          tl.fromTo(card, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 0%" }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, "<");
          kids.forEach((k, i) => arm(tl, k, 1, -150, i ? "<0.15" : ">", 0.35));
          L.draw(tl, ticks, ">", { duration: 0.35, stagger: 0.35 });
          kids.forEach((k) => mood(tl, k, "big", "<"));
        },
      };
    },
    // 2 · Identificar a los alumnos con estímulos bajos en casa
    (root, tl) => {
      const g = L.s("g", {}, root);
      const nBooks = [4, 0, 3, 1, 2];
      const cols = [C.amberM, C.blueM, "#86B58F", C.plum, "#D488A8"];
      const items = nBooks.map((n, i) => {
        const x = 75 + i * 150;
        const hg = house(g, x - 60, 150, 120, 140);
        for (let b = 0; b < n; b++) L.s("rect", { x: 26 + b * 18, y: 88, width: 14, height: 40, rx: 2, fill: ["#4B5AA8", "#2E7D86", "#B5507A", "#D9A441"][b], stroke: C.ink, "stroke-width": 1.5 }, hg);
        const kid = person(g, { age: "child", shirt: cols[i], style: i % 2 ? "curly" : "short", mood: "smile", x, y: FL, s: 0.75 });
        const ring = L.s("ellipse", { cx: x, cy: 420, rx: 70, ry: 260, fill: "none", stroke: C.crimson, "stroke-width": 5, "stroke-dasharray": "14 9" }, g);
        gsap.set(ring, { autoAlpha: 0 });
        return { hg, kid, ring, low: n <= 1 };
      });
      const lens = L.s("g", {}, g);
      L.s("circle", { cx: 0, cy: 0, r: 52, fill: "rgba(199,227,229,.35)", stroke: C.ink, "stroke-width": 6 }, lens);
      L.s("line", { x1: 38, y1: 38, x2: 86, y2: 86, stroke: C.ink, "stroke-width": 12, "stroke-linecap": "round" }, lens);
      gsap.set([g, lens], { autoAlpha: 0 });
      return {
        g,
        play(pos) {
          tl.fromTo(g, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, pos);
          tl.fromTo(lens, { autoAlpha: 0, x: -60, y: 230 }, { autoAlpha: 1, x: 0, duration: 0.3 }, ">");
          items.forEach((it, i) => {
            tl.to(lens, { x: 75 + i * 150, duration: 0.45, ease: "power1.inOut" }, ">");
            if (it.low) {
              tl.fromTo(it.ring, { autoAlpha: 0, scale: 1.3, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: "back.out(2)" }, ">");
              mood(tl, it.kid, "o", "<");
            }
          });
          tl.to(lens, { autoAlpha: 0, duration: 0.3 }, ">");
          tl.to(items.filter((it) => !it.low).flatMap((it) => [it.hg, it.kid.g]), { opacity: 0.35, duration: 0.4 }, "<");
        },
      };
    },
    // 3 · Identificar regiones y ponerles énfasis
    (root, tl) => {
      const g = L.s("g", {}, root);
      const map = L.s("g", {}, g);
      const ms = 0.74;
      gsap.set(map, { x: 10, y: 120, scale: ms, transformOrigin: "0 0" });
      L.s("path", { d: MX.outline, fill: C.amberL, opacity: 0.35, filter: "url(#wc2)" }, map);
      MX.states.forEach((st) => L.s("path", { d: st.d, fill: "#FFFDF6", "fill-opacity": 0.6, stroke: C.ink, "stroke-width": 1.6, "stroke-linejoin": "round" }, map));
      // marcas ilustrativas en distintas zonas del país (no representan datos)
      const spots = ["MX-CHH", "MX-SLP", "MX-GRO", "MX-CHP"].map((id) => MX.states.find((s) => s.id === id)).filter(Boolean).map((st) => {
        const [cx, cy] = st.city;
        const pg = L.s("g", {}, map);
        const ring = L.s("circle", { cx, cy, r: 26, fill: "none", stroke: C.plum, "stroke-width": 5 }, pg);
        L.s("path", { d: `M${cx},${cy} c-14,-20 -18,-28 -18,-36 a18,18 0 1 1 36,0 c0,8 -4,16 -18,36 Z`, fill: C.plum, stroke: C.ink, "stroke-width": 2.5 }, pg);
        L.s("circle", { cx, cy: cy - 36, r: 6, fill: "#fff" }, pg);
        gsap.set(pg, { autoAlpha: 0 });
        return { pg, ring };
      });
      const scan = L.s("line", { x1: 0, x2: 0, y1: 100, y2: 600, stroke: "#2E7D86", "stroke-width": 6, opacity: 0.6, "stroke-linecap": "round" }, g);
      gsap.set([g, scan], { autoAlpha: 0 });
      return {
        g,
        play(pos) {
          tl.fromTo(g, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, pos);
          tl.fromTo(scan, { autoAlpha: 0, x: 0 }, { autoAlpha: 0.8, x: 750, duration: 1.4, ease: "power1.inOut" }, ">");
          tl.to(scan, { autoAlpha: 0, duration: 0.2 }, ">");
          spots.forEach((s, i) => {
            tl.fromTo(s.pg, { autoAlpha: 0, y: -40 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "bounce.out" }, i ? "<0.25" : "<-1.1");
            tl.fromTo(s.ring, { scale: 0.4, transformOrigin: "50% 50%" }, { scale: 1.6, opacity: 0, duration: 0.8, ease: "power1.out" }, "<0.2");
          });
        },
      };
    },
    // 4 · Invitar personalmente a los talleres
    (root, tl) => {
      const g = L.s("g", {}, root);
      house(g, 20, 300, 240, FL - 300, "#F4EEE1");
      Props.door(g, { x: 105, y: FL - 140, w: 70, h: 140 });
      const sign = L.s("g", { transform: "translate(470,240)" }, g);
      L.s("line", { x1: 130, x2: 130, y1: 90, y2: FL - 240, stroke: "#8A6A48", "stroke-width": 8 }, sign);
      L.s("rect", { x: 0, y: 0, width: 260, height: 96, rx: 10, fill: "#FFFDF6", stroke: C.ink, "stroke-width": 3 }, sign);
      L.s("text", { x: 130, y: 42, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 30, fill: C.plum }, sign, "Taller de");
      L.s("text", { x: 130, y: 80, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 30, fill: C.plum }, sign, "lectura");
      Props.desk(g, { x: 600, y: FL, w: 200, book: "#4B5AA8", open: true });
      const env = L.s("g", {}, g);
      L.s("rect", { x: -45, y: -30, width: 90, height: 60, rx: 5, fill: "#FFFDF6", stroke: C.ink, "stroke-width": 3 }, env);
      L.s("path", { d: "M-45,-30 L0,6 L45,-30", fill: "none", stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round" }, env);
      L.s("path", { d: "M-8,12 a8,8 0 0 1 16,0 a8,8 0 0 1 -16,0", fill: "#B5507A" }, env);
      const parent = person(g, { age: "adult", shirt: "#86B58F", style: "long", mood: "smile", x: 140, y: FL, s: 0.75 });
      const kid = person(g, { age: "child", shirt: C.amberM, style: "curly", mood: "smile", x: 190, y: FL, s: 0.7 });
      const sparks = [[560, 210, 12], [740, 220, 9], [700, 330, 8]].map(([x, y, r]) => L.s("path", { d: star(x, y, r), fill: "#F2D48A", stroke: C.ink, "stroke-width": 1.5 }, g));
      gsap.set([g, env, parent.g, kid.g, ...sparks], { autoAlpha: 0 });
      return {
        g,
        play(pos) {
          tl.fromTo(g, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, pos);
          // la invitación vuela hasta la puerta
          tl.fromTo(env, { autoAlpha: 0, x: 700, y: 60, rotation: 20 }, { autoAlpha: 1, x: 140, y: FL - 170, rotation: -8, duration: 1.1, ease: "power2.inOut" }, ">");
          tl.to(env, { scale: 0, autoAlpha: 0, duration: 0.3 }, ">");
          // salen de casa y van al taller
          tl.set([parent.g, kid.g], { autoAlpha: 1 }, ">");
          walk(tl, parent, 140, 470, { dur: 1.6, pos: "<", ir: false });
          walk(tl, kid, 190, 520, { dur: 1.6, pos: "<", ir: false });
          mood(tl, parent, "big", ">");
          mood(tl, kid, "big", "<");
          tl.fromTo(sparks, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, rotation: 90, duration: 0.4, stagger: 0.12, ease: "back.out(3)" }, "<");
        },
      };
    },
  ];

  Deck.add({
    transition: "pageTurn",
    notes: "Propuestas en cuatro fases: (1) encuestar a estudiantes por medio de profesores para enlistar estímulos; (2) identificar a los alumnos con estímulos bajos en casa; (3) identificar regiones y ponerles énfasis (las marcas del mapa son ilustrativas, no datos); (4) invitar personalmente a los talleres a los padres y a quien quiera.",
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

      // ---- Repisa de la torre (derecha) y marco de la escena (izquierda) ----
      const table = L.s("rect", { x: BX - 30, y: TABLE, width: BW + 60, height: 18, rx: 4, fill: WOOD, stroke: WOOD_D, "stroke-width": 3 }, svg);
      const frame = L.s("rect", { x: PX - 20, y: PY - 20, width: 800, height: FL + 70, rx: 24, fill: "#FFFDF8", stroke: "#E4DCCB", "stroke-width": 3 }, svg);
      const stage = L.s("g", { transform: `translate(${PX},${PY})` }, svg);
      L.s("line", { x1: 0, x2: 760, y1: FL, y2: FL, stroke: C.ink, "stroke-width": 3, opacity: 0.4 }, stage);

      tl.fromTo([frame, table], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0);
      tl.fromTo(plank, { scaleX: 0, transformOrigin: "50% 50%" }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.fromTo(letters, { y: "-=320", autoAlpha: 0 }, { y: "+=320", autoAlpha: 1, duration: 0.6, ease: "bounce.out", stagger: 0.09 }, 0.35);
      tl.to(letters.map((g) => g.querySelector("text")), { attr: { fill: "#FFF3C4" }, duration: 0.25, yoyo: true, repeat: 1, stagger: 0.06 }, ">");

      // ---- Cada fase: llega un libro deslizándose, cae la libreta y a la izquierda se anima la escena ----
      let prev = null;
      FASES.forEach((txt, i) => {
        S.step();
        const bottom = TABLE - i * STEP, top = bottom - BH;
        const book = L.s("g", {}, svg);
        svg.insertBefore(book, frame);
        L.s("rect", { x: 0, y: 0, width: BW, height: BH, rx: 10, fill: BOOKS[i], stroke: C.ink, "stroke-width": 3 }, book);
        L.s("rect", { x: 24, y: 0, width: 16, height: BH, fill: "rgba(255,255,255,.35)" }, book);
        L.s("rect", { x: BW - 40, y: 0, width: 16, height: BH, fill: "rgba(255,255,255,.35)" }, book);
        L.s("rect", { x: 60, y: BH - 12, width: BW - 120, height: 6, fill: "#F2D48A", opacity: 0.8 }, book);
        gsap.set(book, { x: 1940, y: top });
        // libreta con la fase: viaja pegada al libro
        const pad = L.h("div", { class: "abs", style: { left: BX + 50 + "px", top: top + 14 + "px", width: BW - 100 + "px", height: BH - 28 + "px", background: "#FFFDF6 var(--grain)", borderRadius: "6px", boxShadow: "0 8px 16px rgba(30,20,10,.3)", transform: `rotate(${i % 2 ? 1 : -1}deg)`, display: "flex", alignItems: "center", gap: "20px", padding: "18px 28px 10px", backgroundImage: "radial-gradient(circle at 50% 4px, #6B6875 0 5px, transparent 6px)", backgroundSize: "34px 14px", backgroundRepeat: "repeat-x" } }, el);
        L.h("div", { class: "h-title", style: { flex: "none", width: "56px", height: "56px", borderRadius: "50%", background: BOOKS[i], color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "30px" } }, pad, String(i + 1));
        L.h("div", { style: { fontSize: "29px", fontWeight: 700, lineHeight: 1.2, color: C.ink } }, pad, txt);
        gsap.set(pad, { x: 1940 - BX });
        tl.addLabel(`f${i}`, ">");
        tl.to(book, { x: BX, duration: 1.0, ease: "back.out(1.1)" }, `f${i}`);
        tl.to(pad, { x: 0, duration: 1.0, ease: "back.out(1.1)" }, `f${i}`);
        // escena de la izquierda
        const sc = SCENES[i](stage, tl);
        if (prev) tl.to(prev.g, { autoAlpha: 0, y: -20, duration: 0.4 }, `f${i}`);
        sc.play(`f${i}+=0.3`);
        prev = sc;
      });
    },
  });
})();
