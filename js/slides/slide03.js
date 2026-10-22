/* Diapositiva 3 · Pregunta de investigación */
(function () {
  const { C } = L;

  // Formas de cuantificar el acceso a los libros, agrupadas por dónde ocurre
  const HOGAR = [
    "¿Libros en casa?", "¿Padres lectores?", "¿Le leían?", "¿Cuentos?", "¿Bibliotecas?", "¿Librerías?", "¿Dinero?",
    "¿Ingreso?", "¿Internet?", "¿E-books?", "¿Tiempo libre?", "¿Libros de regalo?", "¿Un librero?", "¿Revistas?",
    "¿Periódicos?", "¿Celular?", "¿Hermanos lectores?", "¿Rincón para leer?", "¿Biblioteca cerca?", "¿Leer juntos?",
  ];
  const ESCUELA = [
    "¿Maestros?", "¿Biblioteca escolar?", "¿Lecturas en clase?", "¿Comentar lo leído?", "¿Club de lectura?", "¿Hora de lectura?",
    "¿Ferias del libro?", "¿Primaria?", "¿Libros de texto?", "¿Pública o privada?", "¿Grupos grandes?", "¿Tareas de lectura?",
    "¿Préstamo de libros?", "¿Visitas a bibliotecas?", "¿Concursos?", "¿Leer en voz alta?", "¿Motivación?", "¿Grado escolar?",
  ];

  Deck.add({
    transition: "watercolor",
    notes: "Retomamos la sugerencia de la profesora: separar la decisión de leer de la cantidad de libros.",
    build(el, S) {
      const tl = S.tl;

      // ---- Fondo: libros abiertos y letras que flotan (muy tenue) ----
      const bg = L.svg(el, { style: "opacity:.16" });
      const r = L.rng(5);
      const floaters = [];
      for (let i = 0; i < 12; i++) {
        const b = L.book(bg, { x: 0, y: 0, w: 70 + r() * 40, h: 44 + r() * 20, color: [C.blueM, C.amberM, C.plum][i % 3], open: true });
        gsap.set(b, { x: r() * 1800, y: r() * 1000, rotation: (r() - 0.5) * 30 });
        floaters.push(b);
      }
      "aábcdeéfghiíjklmnñoópqrstuúvwxyz¿?".split("").forEach((ch, i) => {
        if (i % 2) return;
        const t = L.s("text", { "font-family": "Fraunces, serif", "font-size": 40 + r() * 50, fill: C.ink }, bg, ch);
        gsap.set(t, { x: r() * 1850, y: 60 + r() * 1000, rotation: (r() - 0.5) * 40 });
        floaters.push(t);
      });
      S.ambient(() => floaters.map((f, i) => gsap.to(f, {
        x: `+=${(i % 2 ? 1 : -1) * (40 + (i * 13) % 60)}`, y: `-=${50 + (i * 17) % 70}`, rotation: `+=${(i % 3 - 1) * 12}`,
        duration: 9 + (i % 5) * 2, repeat: -1, yoyo: true, ease: "sine.inOut",
      })));

      const ph = L.h("div", { class: "page-head", style: { fontSize: "30px", color: C.ink2, fontWeight: 600 } }, el, "Pregunta de investigación");

      // ---- Paso 1: la pregunta general ----
      const q = L.h("div", { class: "abs h-title", style: { left: "170px", width: "1580px", top: "330px", fontSize: "64px", textAlign: "center", lineHeight: 1.2 } }, el,
        `¿Cómo se relaciona la desigualdad en el <span class="acc" style="display:inline-block;line-height:1">acceso</span> a la lectura durante la infancia con los hábitos de lectura de libros en la edad adulta?`);
      gsap.set(q, { autoAlpha: 0 });
      S.step();
      L.write(tl, q, { pos: ">", dur: 3.0 });
      const acc = q.querySelector(".acc");
      const mark = L.marker(acc, C.plum);

      // ---- Nube de palabras (estilo "welcome"): preguntas cortas, tamaños y tipografías mezcladas ----
      const cloud = L.h("div", { class: "layer" }, el);
      const FONTS = ["var(--f-head)", "var(--f-body)", "var(--f-hand)", "var(--f-head)", "var(--f-body)"];
      const SIZES = [66, 36, 50, 28, 58, 34, 44, 26, 62, 40, 30, 52, 28, 42, 34, 46];
      const mixTones = [C.blueD, C.amberD, C.plum, C.ink, C.blueM, C.amberM, "#5E8C5A", C.crimson, C.ink2];
      const hTones = [C.amberD, C.amberM, "#8A4E16", "#C97B3A", C.crimson, "#A0522D"];
      const eTones = [C.blueD, C.blueM, "#24476B", "#4A7FB0", C.plum, "#3D6E8F"];
      const words = [];
      [["h", HOGAR], ["e", ESCUELA]].forEach(([key, list]) => list.forEach((t, i) => {
        const k = words.length;
        const w = L.h("div", { class: "abs", style: { left: 0, top: 0, whiteSpace: "nowrap", lineHeight: 1 } }, cloud);
        const inner = L.h("div", { style: { fontFamily: FONTS[k % FONTS.length], fontSize: SIZES[(k * 7) % SIZES.length] + "px", fontWeight: k % 3 ? 700 : 600, color: mixTones[k % mixTones.length], padding: "2px 6px" } }, w, t);
        words.push({ w, inner, key, i, tone: (key === "h" ? hTones : eTones)[i % 6] });
      }));
      // palabras centrales enormes
      const bigs = { h: "Hogar", e: "Escuela" };
      const centerEls = {};
      Object.entries(bigs).forEach(([key, t]) => {
        const w = L.h("div", { class: "abs h-title", style: { left: 0, top: 0, whiteSpace: "nowrap", lineHeight: 0.95, fontSize: key === "h" ? "180px" : "160px", fontWeight: 700, color: key === "h" ? C.amberD : C.blueD, padding: "0 10px" } }, cloud, t);
        centerEls[key] = w;
      });
      // medidas reales (el escenario está sin escalar dentro de la diapositiva)
      const size = (e) => [e.offsetWidth, e.offsetHeight];
      words.forEach((o) => { [o.bw, o.bh] = size(o.w); });

      /* Acomodo en espiral sin encimar (como d3-cloud, con cajas) */
      function pack(items, cx, cy, box, fixed = []) {
        const placed = fixed.slice();
        const hit = (a) => placed.some((b) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y);
        const inside = (a) => a.x >= box[0] && a.y >= box[1] && a.x + a.w <= box[2] && a.y + a.h <= box[3];
        const asp = (box[2] - box[0]) / (box[3] - box[1]);
        const out = new Map();
        items.forEach((o, n) => {
          let t = n * 0.9, r = { w: o.bw, h: o.bh };
          for (let it = 0; it < 6000; it++, t += 0.12) {
            const rad = 3.2 * t;
            r.x = cx + rad * Math.cos(t) * Math.sqrt(asp) - o.bw / 2;
            r.y = cy + rad * Math.sin(t) / Math.sqrt(asp) - o.bh / 2;
            if (inside(r) && !hit(r)) break;
          }
          placed.push({ ...r });
          out.set(o, [r.x + o.bw / 2, r.y + o.bh / 2]);
        });
        return out;
      }
      const bySize = (a, b) => b.bw * b.bh - a.bw * a.bh;
      const all = [...words].sort(bySize);
      const mixed = pack(all, 960, 650, [70, 300, 1850, 1015]);
      const CEN = { h: [490, 650], e: [1430, 650] };
      const BOX = { h: [55, 290, 935, 1020], e: [985, 290, 1865, 1020] };
      const split = new Map();
      ["h", "e"].forEach((key) => {
        const [cw, ch] = size(centerEls[key]);
        const [cx, cy] = CEN[key];
        gsap.set(centerEls[key], { x: cx, y: cy, xPercent: -50, yPercent: -50 });
        const fixed = [{ x: cx - cw / 2, y: cy - ch / 2, w: cw, h: ch }];
        pack(words.filter((o) => o.key === key).sort(bySize), cx, cy, BOX[key], fixed).forEach((v, k) => split.set(k, v));
      });
      words.forEach((o) => { o.m = mixed.get(o); o.s = split.get(o); gsap.set(o.w, { x: o.m[0], y: o.m[1], xPercent: -50, yPercent: -50 }); });
      // flotación suave de cada palabra
      S.ambient(() => words.map((o, i) => gsap.fromTo(o.inner, { y: -3 }, { y: 3, duration: 2 + (i % 5) * 0.4, repeat: -1, yoyo: true, ease: "sine.inOut", delay: (i % 7) * 0.2 })));

      // ---- Paso 2: la pregunta sube y "acceso" crece; aparece la nube ----
      gsap.set([cloud, centerEls.h, centerEls.e], { autoAlpha: 0 });
      S.step();
      tl.to(ph, { autoAlpha: 0, duration: 0.4 }, ">");
      tl.to(q, { y: -280, scale: 0.55, transformOrigin: "50% 0%", duration: 1.0, ease: "power3.inOut" }, "<");
      tl.to(acc, { fontSize: "2.2em", color: C.plum, duration: 0.8, ease: "back.out(1.6)" }, "<0.5");
      tl.to(mark, { scaleX: 1, duration: 0.6, ease: "power2.out" }, ">-0.2");
      tl.set(cloud, { autoAlpha: 1 }, "<");
      tl.fromTo(all.map((o) => o.w), { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: { each: 0.03, from: "random" } }, "<");

      // ---- Paso 3: se separa rápido en dos nubes: Hogar y Escuela ----
      S.step();
      tl.fromTo([centerEls.h, centerEls.e], { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.8)" }, ">");
      words.forEach((o, i) => {
        tl.to(o.w, { x: o.s[0], y: o.s[1], duration: 0.7, ease: "power3.inOut" }, i ? "<0.008" : "<0.05");
        tl.to(o.inner, { color: o.tone, duration: 0.4 }, "<");
      });

      // ---- Paso 4: la nube se disuelve; las dos preguntas específicas ----
      S.step();
      const qa = L.h("div", { class: "abs h-title", style: { left: "120px", width: "800px", top: "330px", fontSize: "46px", lineHeight: 1.2 } }, el, "a) ¿Cómo se relaciona con la decisión de leer o no leer libros?");
      const qb = L.h("div", { class: "abs h-title", style: { left: "1000px", width: "800px", top: "330px", fontSize: "46px", lineHeight: 1.2 } }, el, "b) ¿Cómo se relaciona con la cantidad de libros leídos?");
      gsap.set([qa, qb], { autoAlpha: 0 });
      tl.to(cloud, { autoAlpha: 0, scale: 1.08, filter: "blur(6px)", duration: 0.9, ease: "power2.in" }, ">");
      L.write(tl, qa, { pos: ">-0.1", dur: 1.6 });
      L.write(tl, qb, { pos: ">0.1", dur: 1.6 });

      // ---- Paso 5: cada pregunta define su variable ----
      S.step();
      const A = L.h("div", { class: "abs", style: { left: "120px", top: "580px", width: "800px", height: "300px" } }, el);
      const sw = L.s("svg", { width: 800, height: 260, viewBox: "0 0 800 260", style: "position:absolute;left:0;top:0" }, A);
      const track = L.s("rect", { x: 260, y: 70, width: 280, height: 120, rx: 60, fill: C.band, stroke: C.ink, "stroke-width": 4 }, sw);
      const knob = L.s("circle", { cx: 320, cy: 130, r: 48, fill: "#fff", stroke: C.ink, "stroke-width": 4 }, sw);
      const no = L.s("text", { x: 230, y: 142, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 40, fill: C.ink2 }, sw, "No leyó");
      const si = L.s("text", { x: 570, y: 142, "font-family": "Nunito", "font-weight": 800, "font-size": 40, fill: C.ink2 }, sw, "Sí leyó");

      const B = L.h("div", { class: "abs", style: { left: "1000px", top: "580px", width: "800px", height: "300px" } }, el);
      const st = L.s("svg", { width: 800, height: 260, viewBox: "0 0 800 260", style: "position:absolute;left:0;top:0" }, B);
      L.s("line", { x1: 250, x2: 550, y1: 250, y2: 250, stroke: C.ink, "stroke-width": 4, "stroke-linecap": "round" }, st);
      const stack = [];
      const cols = [C.blueM, C.amberM, C.plum, C.blueL, C.amberD, "#9DBF9A", C.blueD, C.amberL, C.crimson, C.plumL];
      for (let i = 0; i < 10; i++) {
        const w = 170 + ((i * 37) % 50);
        stack.push(L.s("rect", { x: 400 - w / 2 + ((i * 23) % 16) - 8, y: 226 - i * 24, width: w, height: 22, rx: 4, fill: cols[i], stroke: C.ink, "stroke-width": 3 }, st));
      }
      gsap.set([A, B], { autoAlpha: 0 });
      tl.set(A, { autoAlpha: 1 }, ">");
      tl.fromTo([track, knob], { autoAlpha: 0, scale: 0.5, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, ">");
      tl.fromTo([no, si], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.2");
      for (let i = 0; i < 3; i++) {
        tl.to(knob, { attr: { cx: 480 }, duration: 0.35, ease: "power2.inOut" }, ">0.15")
          .to(track, { attr: { fill: C.plumL }, duration: 0.3 }, "<")
          .to(si, { attr: { fill: C.plum }, duration: 0.3 }, "<")
          .to(no, { attr: { fill: C.ink2 }, duration: 0.3 }, "<");
        if (i < 2) tl.to(knob, { attr: { cx: 320 }, duration: 0.35, ease: "power2.inOut" }, ">0.25")
          .to(track, { attr: { fill: C.band }, duration: 0.3 }, "<")
          .to(si, { attr: { fill: C.ink2 }, duration: 0.3 }, "<")
          .to(no, { attr: { fill: C.ink }, duration: 0.3 }, "<");
      }
      tl.set(B, { autoAlpha: 1 }, "<");
      tl.fromTo(stack, { y: -320, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.45, ease: "bounce.out", stagger: 0.18 }, "<");
    },
  });
})();
