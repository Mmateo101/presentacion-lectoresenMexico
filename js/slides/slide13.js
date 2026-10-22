/* Diapositiva 13 · Líneas futuras de investigación + cierre del libro (portada con post-its dibujados a lápiz) */
(function () {
  const { C } = L;

  /* Garabatos a mano (se dibujan con trazo) */
  function doodle(parent, k, x, y) {
    const g = L.s("g", { transform: `translate(${x},${y})`, fill: "none", stroke: C.plum, "stroke-width": 3.2, "stroke-linecap": "round", "stroke-linejoin": "round" }, parent);
    const P = (d) => L.s("path", { d }, g);
    const ds = [
      ["M20,20 m-14,0 a14,14 0 1 0 28,0 a14,14 0 1 0 -28,0", "M30,30 L44,44", "M6,48 h10 v-10 h10 v-8"],                 // lupa
      ["M8,40 L24,8 L40,40 Z", "M48,8 a6,6 0 1 0 0.1,0 M48,14 v14 M42,20 h12", "M2,46 h52"],                               // hombres/mujeres, estados
      ["M4,44 L4,4 M4,44 L52,44", "M8,38 C20,36 24,12 48,8", "M12,30 l4,4 M26,20 l4,4 M38,12 l4,4"],                      // modelo
      ["M28,28 m-22,0 a22,22 0 1 0 44,0 a22,22 0 1 0 -44,0", "M6,28 h44 M28,6 c-12,12 -12,32 0,44 M28,6 c12,12 12,32 0,44"], // nacional
      ["M6,8 h20 q6,0 6,6 v32 q0,-4 -6,-4 h-20 Z", "M32,14 q0,-6 6,-6 h14 v34 h-14 q-6,0 -6,4", "M40,18 l6,6 l-6,6"],     // nuevo cuestionario
      ["M6,10 h44 v26 h-44 Z", "M2,42 h52", "M16,18 h8 M16,26 h20"],                                                       // lectura digital
    ][k];
    const paths = ds.map(P);
    return { g, paths };
  }

  /* ---------- Dibujitos a lápiz de personajes de libros (para los post-its de la portada final) ---------- */
  const PENCIL = "#3B3946";
  const star = (cx, cy, r) => {
    let d = "";
    for (let k = 0; k < 10; k++) {
      const a = -Math.PI / 2 + (k * Math.PI) / 5, rr = k % 2 ? r * 0.45 : r;
      d += (k ? "L" : "M") + (cx + rr * Math.cos(a)).toFixed(1) + "," + (cy + rr * Math.sin(a)).toFixed(1);
    }
    return d + "Z";
  };
  const tw = (cx, cy, r) => `M${cx},${cy - r} V${cy + r} M${cx - r},${cy} H${cx + r} M${cx - r * 0.5},${cy - r * 0.5} L${cx + r * 0.5},${cy + r * 0.5} M${cx + r * 0.5},${cy - r * 0.5} L${cx - r * 0.5},${cy + r * 0.5}`;
  const circ = (cx, cy, r) => `M${cx - r},${cy} a${r},${r} 0 1 0 ${2 * r},0 a${r},${r} 0 1 0 ${-2 * r},0`;
  // utilidades de animación continua
  const sway = (g, origin, a, dur) => { gsap.set(g, { svgOrigin: origin }); return gsap.fromTo(g, { rotation: -a }, { rotation: a, duration: dur, yoyo: true, repeat: -1, ease: "sine.inOut" }); };
  const blink = (gs, dur = 0.8) => gs.map((g, i) => gsap.fromTo(g, { scale: 0.35, opacity: 0.25, transformOrigin: "50% 50%" }, { scale: 1.15, opacity: 1, duration: dur, yoyo: true, repeat: -1, delay: i * 0.37, ease: "sine.inOut" }));

  const KINDS = {
    mago(G, P) {
      const b = G();
      ["M58,96 C78,62 96,32 122,12 C112,42 120,72 136,96", "M38,99 C70,90 126,90 158,99 C126,108 70,108 38,99 Z", "M70,104 C70,126 126,126 126,104",
        "M86,111 v2 M110,111 v2", "M70,114 C72,150 90,172 98,184 C106,172 126,150 126,114", "M84,138 l6,8 l6,-8 l6,8 l6,-8", star(98, 66, 7), star(116, 42, 5)].forEach((d) => P(b, d));
      const w = G(); P(w, "M136,154 L174,116"); P(w, star(179, 110, 9));
      const sp = [tw(160, 86, 6), tw(193, 136, 5), tw(150, 104, 4)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [sway(w, "136 154", 9, 0.9), ...blink(sp, 0.6)];
    },
    cohete(G, P) {
      const rk = G();
      ["M100,18 C130,44 136,100 126,134 L74,134 C64,100 70,44 100,18 Z", circ(100, 70, 14), "M76,108 L52,140 L77,134", "M124,108 L148,140 L123,134", "M78,100 C92,105 108,105 122,100"].forEach((d) => P(rk, d));
      const fl = G(rk); P(fl, "M82,138 C86,158 96,168 100,184 C104,168 114,158 118,138"); P(fl, "M92,140 C95,152 100,158 100,168 C100,158 105,152 108,140");
      const sp = G(); ["M30,60 h20", "M24,84 h24", "M152,46 h20", "M160,70 h16"].forEach((d) => P(sp, d));
      const st = [star(36, 150, 7), star(170, 160, 6)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [
        gsap.fromTo(rk, { y: -7 }, { y: 7, duration: 1.1, yoyo: true, repeat: -1, ease: "sine.inOut" }),
        sway(rk, "100 100", 4, 1.7),
        gsap.fromTo(fl, { scaleY: 0.7, transformOrigin: "50% 0%" }, { scaleY: 1.2, duration: 0.14, yoyo: true, repeat: -1, ease: "none" }),
        gsap.fromTo(sp, { x: 6, opacity: 1 }, { x: -12, opacity: 0.2, duration: 0.7, repeat: -1, ease: "power1.in" }),
        ...blink(st),
      ];
    },
    galaxia(G, P) {
      const gx = G();
      const arm = "M100,100 C110,90 126,96 126,110 C126,136 94,146 74,130 C50,110 60,70 96,58 C136,46 172,82 160,122";
      P(gx, arm);
      const a2 = G(gx); a2.setAttribute("transform", "rotate(180 100 100)"); P(a2, arm);
      P(gx, circ(100, 100, 5));
      [circ(140, 62, 1.5), circ(58, 136, 1.5), circ(132, 140, 1.5), circ(66, 70, 1.5)].forEach((d) => P(gx, d));
      const st = [star(26, 28, 8), tw(178, 172, 6), tw(20, 176, 5), star(178, 26, 6)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [(gsap.set(gx, { svgOrigin: "100 100" }), gsap.to(gx, { rotation: 360, duration: 24, repeat: -1, ease: "none" })), ...blink(st)];
    },
    planeta(G, P) {
      const pl = G();
      P(pl, circ(105, 100, 35)); P(pl, "M76,86 C95,80 115,80 134,86"); P(pl, "M72,106 C95,112 115,112 138,106");
      const ring = G(pl); ring.setAttribute("transform", "rotate(-16 105 100)"); P(ring, "M38,100 a67,17 0 1 0 134,0 a67,17 0 1 0 -134,0");
      const mo = G(); P(mo, circ(105, 26, 8)); P(mo, "M101,22 l2,2");
      const st = [star(26, 40, 7), tw(178, 172, 6), tw(172, 42, 4), tw(24, 168, 4)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [(gsap.set(mo, { svgOrigin: "105 100" }), gsap.to(mo, { rotation: 360, duration: 8, repeat: -1, ease: "none" })), sway(pl, "105 100", 6, 2.2), ...blink(st)];
    },
    castillo(G, P) {
      const c = G();
      ["M42,180 V100 H158 V180", "M42,100 v-12 h13 v12 h13 v-12 h13 v12 h13 v-12 h13 v12 h13 v-12 h13 v12", "M30,180 V70 H62 V180", "M138,180 V70 H170 V180",
        "M26,70 L46,30 L66,70", "M134,70 L154,30 L174,70", "M46,30 V12", "M154,30 V12", "M88,180 V152 C88,136 112,136 112,152 V180", "M46,90 v14", "M154,90 v14", "M18,180 H182"].forEach((d) => P(c, d));
      const f1 = G(); P(f1, "M46,12 L68,17 L46,22");
      const f2 = G(); P(f2, "M154,12 L176,17 L154,22");
      const st = [star(100, 42, 8), tw(18, 30, 5), tw(186, 64, 4)].map((d) => { const g = G(); P(g, d); return g; });
      const flag = (g, o) => { gsap.set(g, { svgOrigin: o }); return gsap.fromTo(g, { scaleX: 0.65, skewY: -12 }, { scaleX: 1.08, skewY: 10, duration: 0.45, yoyo: true, repeat: -1, ease: "sine.inOut" }); };
      return () => [flag(f1, "46 17"), flag(f2, "154 17"), ...blink(st)];
    },
    barco(G, P) {
      const sh = G();
      ["M28,128 H172 L152,160 H48 Z", "M100,128 V28", "M104,36 C140,52 140,100 104,114 Z", "M96,48 C72,60 72,96 96,108 Z", circ(64, 142, 4), circ(94, 142, 4), circ(124, 142, 4)].forEach((d) => P(sh, d));
      const fg = G(sh); P(fg, "M100,28 L124,22 L100,16");
      const wv = G();
      P(wv, "M6,172 C21,162 31,182 46,172 C61,162 71,182 86,172 C101,162 111,182 126,172 C141,162 151,182 166,172 C176,166 186,170 196,172");
      P(wv, "M20,188 C35,180 45,194 60,188 C75,180 85,194 100,188 C115,180 125,194 140,188");
      const st = [tw(30, 40, 6), star(170, 40, 6)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [sway(sh, "100 150", 5, 1.5), gsap.fromTo(wv, { x: -8 }, { x: 8, duration: 1.2, yoyo: true, repeat: -1, ease: "sine.inOut" }), ...blink(st)];
    },
    ovni(G, P) {
      const u = G();
      ["M74,80 C74,54 126,54 126,80", "M38,90 C54,70 146,70 162,90 C146,110 54,110 38,90 Z", circ(100, 72, 8), "M96,65 l-5,-9 M104,65 l5,-9", circ(65, 92, 3), circ(100, 97, 3), circ(135, 92, 3)].forEach((d) => P(u, d));
      const bm = G(u); ["M80,106 L56,178", "M120,106 L144,178", "M56,178 C80,186 120,186 144,178", "M88,132 h24 M78,156 h44"].forEach((d) => P(bm, d));
      const st = [star(28, 30, 7), tw(176, 40, 5), tw(20, 150, 5), tw(180, 150, 4)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [
        gsap.fromTo(u, { x: -12 }, { x: 12, duration: 1.8, yoyo: true, repeat: -1, ease: "sine.inOut" }),
        gsap.fromTo(u, { y: -4 }, { y: 4, duration: 0.9, yoyo: true, repeat: -1, ease: "sine.inOut" }),
        gsap.fromTo(bm, { opacity: 0.25 }, { opacity: 1, duration: 0.5, yoyo: true, repeat: -1 }),
        ...blink(st),
      ];
    },
    luna(G, P) {
      const m = G();
      ["M118,36 C78,42 62,94 82,130 C98,156 134,162 156,146 C120,140 98,110 103,80 C106,60 112,46 118,36 Z", "M90,96 c4,-4 9,-4 12,0", "M92,120 c5,5 11,5 15,0"].forEach((d) => P(m, d));
      const cl = G(); P(cl, "M28,178 C22,162 42,154 54,162 C58,146 84,148 88,164 C100,160 112,170 104,180 Z");
      const zz = G(); P(zz, "M150,36 h12 l-12,14 h12"); P(zz, "M170,16 h9 l-9,11 h9");
      const st = [star(176, 88, 7), star(36, 56, 6), tw(150, 176, 5), tw(60, 112, 4)].map((d) => { const g = G(); P(g, d); return g; });
      return () => [
        sway(m, "110 100", 5, 2.4),
        gsap.fromTo(cl, { x: -6 }, { x: 6, duration: 2.2, yoyo: true, repeat: -1, ease: "sine.inOut" }),
        gsap.fromTo(zz, { y: 6, opacity: 1 }, { y: -14, opacity: 0, duration: 1.6, repeat: -1, ease: "power1.out" }),
        ...blink(st, 0.7),
      ];
    },
  };

  /* Un dibujito a lápiz: cada trazo va doble (uno fino desplazado) para que parezca lápiz */
  function pencil(svg, kind) {
    const root = L.s("g", { fill: "none", stroke: PENCIL, "stroke-width": 3.2, "stroke-linecap": "round", "stroke-linejoin": "round", filter: "url(#ink)" }, svg);
    const paths = [];
    const G = (parent = root) => L.s("g", {}, parent);
    const P = (parent, d) => {
      paths.push(L.s("path", { d }, parent));
      paths.push(L.s("path", { d, transform: "translate(1.6,1.1)", "stroke-width": 1.4, "stroke-opacity": 0.45 }, parent));
    };
    const anim = KINDS[kind](G, P);
    return { root, paths, anim };
  }

  /* Post-it pegado con cinta, con un dibujito adentro */
  function postit(parent, { x, y, rot, color, kind, tape }) {
    const note = L.h("div", { class: "abs", style: { left: x + "px", top: y + "px", width: "230px", height: "230px", transform: `rotate(${rot}deg)` } }, parent);
    const inner = L.h("div", { style: { position: "absolute", inset: 0, transformOrigin: "50% 0%" } }, note);
    L.h("div", { style: { position: "absolute", inset: 0, background: `linear-gradient(172deg, ${color} 0%, ${color} 72%, ${d3.color(color).darker(0.3)} 100%)`, borderRadius: "2px 2px 4px 22px / 2px 2px 4px 12px", boxShadow: "0 14px 22px rgba(20,8,24,.45), 0 2px 4px rgba(0,0,0,.25)" } }, inner);
    L.h("div", { style: { position: "absolute", inset: 0, backgroundImage: "var(--grain)", mixBlendMode: "multiply", opacity: 0.6, borderRadius: "2px 2px 4px 22px / 2px 2px 4px 12px" } }, inner);
    L.h("div", { style: { position: "absolute", left: "66px", top: "-16px", width: "98px", height: "30px", background: "rgba(255,255,255,.5)", boxShadow: "0 1px 3px rgba(0,0,0,.18)", transform: `rotate(${tape}deg)` } }, inner);
    const sv = L.svg(inner, { viewBox: "0 0 200 200", style: "position:absolute;left:15px;top:15px;width:200px;height:200px;overflow:visible" });
    const d = pencil(sv, kind);
    return { note, inner, d, rot };
  }

  Deck.add({
    transition: "pageTurn",
    notes: "",
    build(el, S) {
      const tl = S.tl;
      // ---- Hoja de cuaderno ----
      const page = L.h("div", { class: "layer", style: { background: `repeating-linear-gradient(180deg, transparent 0 61px, rgba(111,163,207,.35) 61px 63px) 0 22px, ${C.paper} var(--grain)`, boxShadow: "inset 0 0 30px rgba(150,120,80,.18)" } }, el);
      L.h("div", { class: "abs", style: { left: "250px", top: 0, bottom: 0, width: "3px", background: "rgba(178,58,72,.45)" } }, page);
      const holes = L.svg(page);
      for (let i = 0; i < 11; i++) L.s("circle", { cx: 95, cy: 70 + i * 95, r: 18, fill: C.paper2, stroke: "#D8CDB8", "stroke-width": 2, opacity: 0.9 }, holes);
      const title = L.h("div", { class: "abs hand", style: { left: "290px", top: "58px", fontSize: "76px", fontWeight: 700, color: C.ink } }, page, "Líneas futuras de investigación");
      L.write(tl, title, { pos: 0.3, dur: 1.4 });

      const items = [
        "¿Qué estímulo del hogar pesa más: libros en casa, padres lectores, que le lean o ir a bibliotecas?",
        "¿La brecha es igual entre hombres y mujeres, o entre estados?",
        "Un modelo que combine acceso y escolaridad (regresión logística).",
        "Incorporar el factor de expansión de la encuesta para estimar a nivel nacional.",
        "Analizar el MOLEC 2025 con su nuevo cuestionario.",
        "Estudiar la lectura digital y la asistencia a bibliotecas como acceso actual.",
      ];
      const dsvg = L.svg(page);
      const rows = items.map((t, i) => {
        const y = 210 + i * 126;
        const tx = L.h("div", { class: "abs hand", style: { left: "380px", top: y + "px", width: "1440px", fontSize: "46px", lineHeight: "63px", color: [C.ink, C.blueD, C.ink, C.amberD, C.ink, C.blueD][i] } }, page, t);
        const d = doodle(dsvg, i, 290, y + 6);
        return { tx, d };
      });
      gsap.set(rows.map((r) => r.d.g), { autoAlpha: 0 });
      rows.forEach((r) => {
        S.step();
        tl.set(r.d.g, { autoAlpha: 1 }, ">");
        L.draw(tl, r.d.paths, "<", { duration: 0.5, stagger: 0.15 });
        L.write(tl, r.tx, { pos: "<0.2", dur: Math.min(2.4, r.tx.textContent.length * 0.03) });
      });

      // ---- Cierre: el cuaderno se vuelve un libro abierto, las hojas pasan hacia atrás y se cierra en la portada ----
      S.step();
      const SC = 0.84, PW = 960 * SC, PH = 1080 * SC, X0 = 960, Y0 = (1080 - PH) / 2, M = 16;
      const CW = PW + 2 * M, CH = PH + 2 * M;
      const desk = L.h("div", { class: "layer", style: { background: "radial-gradient(80% 80% at 50% 45%, #F7F1E4, #EADFC9)" } }, el);
      el.insertBefore(desk, page);
      const board = window.Leather(el, { left: `${960 - PW - M}px`, top: `${Y0 - M}px`, width: `${PW * 2 + 2 * M}px`, height: `${PH + 2 * M}px` });
      board.querySelectorAll(".gold1,.gold2").forEach((e) => e.remove());
      el.insertBefore(board, page);
      const bookEl = L.h("div", { class: "layer" }, el);
      const face = (parent, bg, back) => L.h("div", { style: { position: "absolute", inset: 0, backfaceVisibility: "hidden", overflow: "hidden", background: bg, transform: back ? "rotateY(180deg)" : "none" } }, parent);
      const paperBg = (t) => `${t} var(--grain)`;
      // hojas (empiezan del lado derecho y pasan a la izquierda, como al terminar un libro)
      const pages = [];
      for (let i = 0; i < 7; i++) {
        const pg = L.h("div", { style: { position: "absolute", left: X0 + "px", top: Y0 + "px", width: PW + "px", height: PH + "px", transformStyle: "preserve-3d", transformOrigin: "0% 50%", zIndex: 30 - i } }, bookEl);
        const f = face(pg, paperBg(i % 2 ? "#FBF8F1" : "#FAF5EA"));
        const b = face(pg, paperBg("#F6F0E3"), true);
        [f, b].forEach((fc, k) => {
          const sv = L.s("svg", { width: "100%", height: "100%", viewBox: `0 0 ${PW} ${PH}`, style: "position:absolute;inset:0" }, fc);
          for (let j = 0; j < 9; j++) L.s("line", { x1: 110, x2: PW - 120 - ((i * 37 + j * 53 + k * 19) % 150), y1: 520 + j * 34, y2: 520 + j * 34, stroke: "#CFC6B6", "stroke-width": 3, "stroke-linecap": "round" }, sv);
        });
        pg._sh = L.h("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(60,40,20,.28), rgba(60,40,20,0) 45%, rgba(255,255,255,.15))", opacity: 0, backfaceVisibility: "hidden" } }, f);
        pages.push(pg);
      }
      // contratapa: abierta del lado derecho; al final se cierra hacia la izquierda y su piel queda al frente
      const bc = L.h("div", { style: { position: "absolute", left: X0 - M + "px", top: Y0 - M + "px", width: CW + "px", height: CH + "px", transformStyle: "preserve-3d", transformOrigin: "0% 50%", zIndex: 5 } }, bookEl);
      const bcF = face(bc, "none", true);
      const bcLea = window.Leather(bcF, { inset: 0 });
      const mp = L.h("div", { class: "abs", style: { left: (CW - 600) / 2 + "px", top: (CH - 615) / 2 + "px", width: "600px", height: "615px", background: "#FBF8F1 var(--grain)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 4px #D8B66A, 0 0 0 10px rgba(216,182,106,.35), 0 18px 40px rgba(0,0,0,.35)" } }, bcF);
      const mpv = L.svg(mp, { viewBox: "0 0 800 820", preserveAspectRatio: "none", style: "position:absolute;left:0;top:0;width:100%;height:100%" });
      L.wash(mpv, { cx: 60, cy: 80, rx: 260, ry: 200, color: C.blueL, opacity: 0.55, seed: 4 });
      L.wash(mpv, { cx: 760, cy: 760, rx: 260, ry: 200, color: C.amberL, opacity: 0.6, seed: 12 });
      const bcB = face(bc, "#EADCF0");
      Object.assign(bcB.style, { backgroundImage: "radial-gradient(circle at 30% 30%, rgba(122,78,140,.18) 0 7px, transparent 8px), radial-gradient(circle at 70% 70%, rgba(229,154,79,.16) 0 5px, transparent 6px), var(--grain)", backgroundSize: "60px 60px, 46px 46px, auto", borderRadius: "10px 18px 18px 10px" });

      // portada final (misma tapa, a pantalla completa)
      const cover = L.h("div", { class: "layer" }, el);
      window.Leather(cover, { inset: "0px", borderRadius: "0" });
      const sky = L.svg(cover);
      const plate = L.h("div", { class: "abs", style: { left: "560px", top: "130px", width: "800px", height: "820px", background: "#FBF8F1 var(--grain)", borderRadius: "16px", overflow: "hidden", boxShadow: "0 0 0 4px #D8B66A, 0 0 0 10px rgba(216,182,106,.35), 0 18px 40px rgba(0,0,0,.35)" } }, cover);
      const pv = L.svg(plate, { viewBox: "0 0 800 820", style: "position:absolute;left:0;top:0;width:800px;height:820px" });
      L.wash(pv, { cx: 60, cy: 80, rx: 260, ry: 200, color: C.blueL, opacity: 0.55, seed: 4 });
      L.wash(pv, { cx: 760, cy: 760, rx: 260, ry: 200, color: C.amberL, opacity: 0.6, seed: 12 });
      const logo = L.h("img", { src: "assets/tec_logo.png", alt: "Tecnológico de Monterrey", style: { position: "absolute", left: "50%", marginLeft: "-188px", width: "376px", top: "60px", height: "80px" } }, plate);
      logo.onerror = () => { logo.style.visibility = "hidden"; };
      const gr = L.h("div", { class: "abs", style: { left: 0, width: "800px", top: "200px", textAlign: "center", fontFamily: "var(--f-script)", fontSize: "190px", lineHeight: 1.1, color: C.plum } }, plate, "Gracias");
      const pq = L.h("div", { class: "abs h-title", style: { left: 0, width: "800px", top: "470px", textAlign: "center", fontSize: "78px", color: C.ink } }, plate, "¿Preguntas?");
      const orn = L.s("svg", { width: 420, height: 30, viewBox: "0 0 420 30", style: "position:absolute;left:190px;top:600px" }, plate);
      const ornP = L.s("path", { d: "M10,15 C90,15 120,2 180,12 S200,26 210,15 S230,2 250,12 S330,15 410,15", fill: "none", stroke: "#D8B66A", "stroke-width": 3 }, orn);
      const eq = L.h("div", { class: "abs h-title", style: { left: 0, width: "800px", top: "660px", textAlign: "center", fontSize: "52px", color: C.plum } }, plate, "Equipo 7");

      // estrellitas doradas a lápiz sobre la piel
      const SKY = [[420, 92, 12, 1], [250, 268, 9, 0], [508, 530, 8, 0], [188, 520, 11, 1], [470, 770, 9, 0], [66, 880, 8, 1], [1460, 112, 11, 1], [1826, 330, 9, 0],
        [1512, 560, 8, 1], [1866, 800, 9, 0], [1720, 1010, 11, 1], [960, 64, 10, 1], [760, 1010, 9, 0], [1160, 1010, 10, 1], [300, 1010, 8, 0], [1080, 70, 7, 0]];
      const skyG = SKY.map(([x, y, r, s]) => {
        const g = L.s("g", { fill: "none", stroke: "#EBD292", "stroke-width": 2.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, sky);
        const p = L.s("path", { d: s ? star(x, y, r) : tw(x, y, r) }, g);
        return { g, p };
      });
      // post-its con personajes de libros
      const NOTES = [
        { x: 70, y: 70, rot: -6, color: "#FFE98A", kind: "mago", tape: -4 },
        { x: 300, y: 300, rot: 5, color: "#C7E3F7", kind: "galaxia", tape: 3 },
        { x: 60, y: 560, rot: 4, color: "#FFC4D6", kind: "cohete", tape: -2 },
        { x: 290, y: 800, rot: -5, color: "#C9F0D5", kind: "castillo", tape: 4 },
        { x: 1600, y: 60, rot: 6, color: "#FFD3A6", kind: "planeta", tape: 2 },
        { x: 1390, y: 300, rot: -4, color: "#FFE98A", kind: "barco", tape: -3 },
        { x: 1630, y: 545, rot: -6, color: "#C9F0D5", kind: "ovni", tape: 3 },
        { x: 1400, y: 790, rot: 5, color: "#C7E3F7", kind: "luna", tape: -4 },
      ].map((o) => postit(cover, o));

      gsap.set([desk, board, cover, logo, gr, pq, eq, ...NOTES.map((n) => n.note)], { autoAlpha: 0 });
      gsap.set(pages, { rotationY: 0, transformPerspective: 3200, opacity: 0 });
      gsap.set(bc, { rotationY: 0, transformPerspective: 3200, opacity: 0 });

      tl.addLabel("close", ">");
      tl.to(desk, { autoAlpha: 1, duration: 0.4 }, "close")
        .to(page, { scale: SC, transformOrigin: "50% 50%", duration: 1.0, ease: "power2.inOut" }, "close")
        .to(board, { autoAlpha: 1, duration: 0.5 }, "close+=0.4")
        .to([bc, ...pages], { opacity: 1, duration: 0.3 }, "close+=0.9");
      // las hojas pasan de derecha a izquierda (hacia el final del libro)
      pages.forEach((pg, i) => {
        const t0 = 1.35 + i * 0.22;
        tl.to(pg, { rotationY: -180, duration: 0.72, ease: "power2.inOut" }, `close+=${t0}`)
          .to(pg, { keyframes: [{ skewY: -5, duration: 0.36 }, { skewY: 0, duration: 0.36 }], ease: "sine.inOut" }, `close+=${t0}`)
          .to(pg._sh, { keyframes: [{ opacity: 1, duration: 0.36 }, { opacity: 0, duration: 0.36 }] }, `close+=${t0}`)
          .set(pg, { zIndex: 40 + i }, `close+=${t0 + 0.36}`);
      });
      const tc = 1.35 + 6 * 0.22 + 0.8;
      tl.set(page, { autoAlpha: 0 }, `close+=${tc}`)
        .set(bc, { zIndex: 100 }, `close+=${tc}`)
        .to(bc, { rotationY: -180, duration: 1.1, ease: "power2.inOut" }, `close+=${tc}`);
      // el libro cerrado crece hasta ser la portada (girada 180°, su caja visible va de left − width a left)
      const tz = tc + 1.3;
      tl.to(bc, { left: 1920, top: 0, width: 1920, height: 1080, duration: 1.1, ease: "power3.inOut" }, `close+=${tz}`)
        .to(bcLea, { borderRadius: 0, duration: 1.1 }, `close+=${tz}`)
        .to(mp, { left: 560, top: 130, width: 800, height: 820, duration: 1.1, ease: "power3.inOut" }, `close+=${tz}`)
        .to([board, desk], { autoAlpha: 0, duration: 0.5 }, `close+=${tz}`)
        .set(pages, { opacity: 0 }, `close+=${tz}`)
        .set(cover, { autoAlpha: 1 }, `close+=${tz + 1.1}`)
        .set(bookEl, { autoAlpha: 0 }, `close+=${tz + 1.15}`);
      L.pop(tl, logo, ">", { from: { y: -10 } });
      tl.fromTo(gr, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power1.inOut" }, ">");
      L.write(tl, pq, { pos: ">", dur: 0.9 });
      L.draw(tl, ornP, ">", { duration: 0.8 });
      L.pop(tl, eq, "<0.2", { from: { y: 12 } });
      // se pegan los post-its y se dibujan a lápiz
      tl.addLabel("notes", "<0.4");
      NOTES.forEach((n, i) => {
        const t = `notes+=${i * 0.3}`;
        tl.fromTo(n.note, { autoAlpha: 0, scale: 1.35, y: -50, rotation: n.rot + 14 }, { autoAlpha: 1, scale: 1, y: 0, rotation: n.rot, duration: 0.5, ease: "back.out(2.2)" }, t);
        L.draw(tl, n.d.paths, `notes+=${i * 0.3 + 0.3}`, { duration: 1.1, stagger: 0.012 });
      });
      L.draw(tl, skyG.map((s) => s.p), "notes+=0.2", { duration: 0.6, stagger: 0.08 });

      // movimiento continuo: los dibujitos viven y las estrellas titilan
      S.ambient(() => [
        ...NOTES.flatMap((n, i) => [gsap.fromTo(n.inner, { rotation: -1.4 }, { rotation: 1.4, duration: 2.2 + (i % 3) * 0.4, yoyo: true, repeat: -1, ease: "sine.inOut", delay: i * 0.2 }), ...n.d.anim()]),
        ...blink(skyG.map((s) => s.g), 1.1),
      ]);
    },
  });
})();
