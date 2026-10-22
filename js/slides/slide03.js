/* Diapositiva 3 · Pregunta de investigación */
(function () {
  const { C } = L;

  // Formas de cuantificar el acceso a los libros, agrupadas por dónde ocurre
  const HOGAR = [
    "¿Cuántos libros había en casa?", "¿Sus padres leían?", "¿Le leían cuentos?", "¿Lo llevaban a bibliotecas?",
    "¿Lo llevaban a librerías?", "¿Había dinero para comprar libros?", "¿Cuánto ganaba su familia?", "¿Tenían internet?",
    "¿Leía libros digitales?", "¿Tenía tiempo libre para leer?", "¿Le regalaban libros?", "¿Había un lugar tranquilo para leer?",
    "¿Qué estudiaron sus padres?", "¿Había una biblioteca cerca?", "¿Había una librería cerca?",
  ];
  const ESCUELA = [
    "¿Sus maestros lo motivaban a leer?", "¿Le pedían leer otros libros?", "¿Comentaban lo leído?", "¿Lo animaban a ir a bibliotecas?",
    "¿Había biblioteca escolar?", "¿Leían en voz alta en clase?", "¿Había club de lectura?", "¿Asistió a la primaria?",
    "¿Escuela pública o privada?", "¿Cuántos alumnos por salón?", "¿Había libros además de los de texto?", "¿Hasta qué grado estudió?",
    "¿Había ferias del libro?", "¿Tenían hora de lectura?",
  ];
  const CEN = { h: [495, 655], e: [1435, 655] };
  const RINGS = [{ n: 5, rx: 245, ry: 150 }, { n: 10, rx: 340, ry: 300 }];

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

      // ---- Paso 1: la pregunta general, con "acceso" enorme ----
      const q = L.h("div", { class: "abs h-title", style: { left: "170px", width: "1580px", top: "250px", fontSize: "62px", textAlign: "center", lineHeight: 1.22 } }, el,
        `¿Cómo se relaciona la desigualdad en el <span class="acc" style="font-size:2.1em;color:${C.plum};font-weight:700;line-height:1">acceso</span> a la lectura durante la infancia con los hábitos de lectura de libros en la edad adulta?`);
      gsap.set(q, { autoAlpha: 0 });
      S.step();
      L.write(tl, q, { pos: ">", dur: 3.2 });
      const acc = q.querySelector(".acc");
      const mark = L.marker(acc, C.plum);
      tl.to(mark, { scaleX: 1, duration: 0.7, ease: "power2.out" }, ">-0.2");
      tl.fromTo(acc, { scale: 1 }, { scale: 1.08, duration: 0.35, yoyo: true, repeat: 1, ease: "power1.inOut" }, "<0.3");

      // ---- Nube de preguntas (paso 2) que luego orbita hogar y escuela (paso 3) ----
      const cloud = L.h("div", { class: "layer" }, el);
      const tones = [C.ink, C.ink2, C.blueD, C.amberD, C.plum, C.ink];
      const rr = L.rng(17);
      // posiciones dispersas de la nube (rejilla con ruido para no encimarse)
      const cells = [];
      for (let row = 0; row < 8; row++) for (let col = 0; col < 4; col++) cells.push([300 + col * 440 + (row % 2 ? 60 : -60) + (rr() - 0.5) * 40, 325 + row * 88 + (rr() - 0.5) * 16]);
      cells.sort(() => rr() - 0.5);
      const slots = (key, n) => {
        const out = [];
        let k = 0;
        RINGS.forEach((ring, ri) => {
          for (let i = 0; i < ring.n && k < n; i++, k++) {
            const a0 = (i / ring.n) * Math.PI * 2 + (ri ? 0.35 : 0) + (key === "e" ? 0.5 : 0);
            out.push({ ring, a0, dir: ri ? 1 : -1 });
          }
        });
        return out;
      };
      const items = [];
      [["h", HOGAR], ["e", ESCUELA]].forEach(([key, list]) => {
        const sl = slots(key, list.length);
        list.forEach((t, i) => {
          const w = L.h("div", { class: "abs", style: { left: 0, top: 0, whiteSpace: "nowrap" } }, cloud);
          const inner = L.h("div", { style: { fontSize: 24 + ((i * 7) % 6) + "px", fontWeight: 700, color: tones[(i + (key === "e" ? 3 : 0)) % tones.length] } }, w, t);
          const [cx, cy] = cells[items.length];
          const s = sl[i];
          const [ox, oy] = CEN[key];
          const tx = ox + s.ring.rx * Math.cos(s.a0), ty = oy + s.ring.ry * Math.sin(s.a0);
          gsap.set(w, { x: cx, y: cy, xPercent: -50, yPercent: -50 });
          items.push({ w, inner, key, cx, cy, tx, ty, s, ox, oy });
        });
      });
      // centros de los grupos
      const nodes = ["h", "e"].map((key) => {
        const [x, y] = CEN[key];
        const n = L.h("div", { class: "abs h-title", style: { left: x - 95 + "px", top: y - 95 + "px", width: "190px", height: "190px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "46px", color: key === "h" ? C.amberD : C.blueD, background: key === "h" ? "rgba(246,211,168,.75)" : "rgba(191,215,234,.8)", border: `4px solid ${key === "h" ? C.amberD : C.blueD}`, boxShadow: "0 10px 30px rgba(120,90,50,.15)" } }, cloud, key === "h" ? "Hogar" : "Escuela");
        cloud.insertBefore(n, cloud.firstChild);
        const halo = L.h("div", { class: "abs", style: { left: x - 470 + "px", top: y - 360 + "px", width: "940px", height: "720px", borderRadius: "50%", background: key === "h" ? C.amberL : C.blueL, opacity: 0.3, filter: "url(#wc2)" } }, cloud);
        cloud.insertBefore(halo, cloud.firstChild);
        return { n, halo };
      });
      // órbita: el timeline controla cuánto orbitan (0 en la nube, 1 ya agrupadas)
      const orbit = { v: 0 };
      S.ambient(() => {
        const ph0 = { a: 0 };
        return gsap.to(ph0, {
          a: Math.PI * 2, duration: 140, repeat: -1, ease: "none",
          onUpdate() {
            items.forEach((it) => {
              const a = it.s.a0 + ph0.a * it.s.dir;
              const dx = (it.ox + it.s.ring.rx * Math.cos(a)) - it.tx, dy = (it.oy + it.s.ring.ry * Math.sin(a)) - it.ty;
              gsap.set(it.inner, { x: (dx * orbit.v) / 0.8, y: (dy * orbit.v) / 0.8 }); // compensa la escala del contenedor
            });
          },
        });
      });

      gsap.set([cloud, ...nodes.map((n) => n.n), ...nodes.map((n) => n.halo)], { autoAlpha: 0 });
      S.step();
      tl.to(ph, { autoAlpha: 0, duration: 0.5 }, ">");
      tl.to(q, { y: -200, scale: 0.52, transformOrigin: "50% 0%", duration: 1.1, ease: "power3.inOut" }, "<");
      tl.set(cloud, { autoAlpha: 1 }, "<0.4");
      items.forEach((it, i) => {
        const fromX = it.cx < 960 ? -800 : 800;
        tl.fromTo(it.w, { autoAlpha: 0, x: it.cx + fromX, y: it.cy + (i % 3 - 1) * 140, rotation: i % 2 ? 9 : -9 }, { autoAlpha: 1, x: it.cx, y: it.cy, rotation: 0, duration: 1.3, ease: "power3.out" }, i ? "<0.05" : "<0.2");
      });

      // ---- Paso 3: se separan en dos nubes que orbitan Hogar y Escuela ----
      S.step();
      tl.fromTo(nodes.map((n) => n.halo), { autoAlpha: 0, scale: 0.4 }, { autoAlpha: 0.3, scale: 1, duration: 1.2, ease: "power2.out" }, ">");
      tl.fromTo(nodes.map((n) => n.n), { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.8, ease: "back.out(2)" }, "<0.2");
      items.forEach((it, i) => {
        tl.to(it.w, { x: it.tx, y: it.ty, scale: 0.8, duration: 1.4, ease: "power3.inOut" }, i ? "<0.03" : "<0.3");
        tl.to(it.inner, { color: it.key === "h" ? (i % 2 ? C.amberD : "#8A4E16") : (i % 2 ? C.blueD : "#24476B"), duration: 0.6 }, "<0.4");
      });
      tl.to(orbit, { v: 1, duration: 1.5, ease: "power1.inOut" }, ">-0.4");

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
