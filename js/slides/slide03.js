/* Diapositiva 3 · Pregunta de investigación */
(function () {
  const { C } = L;

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
      const q = L.h("div", { class: "abs h-title", style: { left: "200px", width: "1520px", top: "330px", fontSize: "68px", textAlign: "center", lineHeight: 1.18 } }, el,
        `¿Cómo se relaciona la desigualdad en el <span class="acc">acceso</span> a la lectura durante la infancia con los hábitos de lectura de libros en la edad adulta?`);
      gsap.set(q, { autoAlpha: 0 });
      S.step();
      L.write(tl, q, { pos: 0, dur: 3.2 });
      const acc = q.querySelector(".acc");
      const mark = L.marker(acc, C.plum);

      // ---- Paso 2: la pregunta sube; nube de formas de medir el acceso ----
      const words = [
        ["dinero", 230, 340], ["ingreso del hogar", 610, 320], ["precio de los libros", 1080, 330], ["bibliotecas cercanas", 1530, 360],
        ["librerías", 200, 480], ["libros en casa", 700, 460, "h", 3], ["libros digitales", 1180, 470], ["internet", 1640, 500],
        ["tiempo libre", 330, 600], ["lo llevaban a bibliotecas", 860, 590, "h", 0], ["padres lectores", 1390, 610, "h", 1],
        ["le leían de niño", 260, 720, "h", 2], ["lecturas en clase", 690, 730, "e", 0], ["comentar lo leído", 1130, 740, "e", 1], ["maestros que motivan", 1560, 740, "e", 2],
        ["visitas a bibliotecas escolares", 470, 860, "e", 3], ["escolaridad", 1050, 870], ["ciudad donde vive", 1490, 870],
      ];
      const tones = [C.ink, C.ink2, C.blueD, C.amberD, C.ink, C.ink2];
      const cloud = L.h("div", { class: "layer" }, el);
      const W = words.map(([t, x, y, grp, k], i) => {
        const w = L.h("div", { class: "abs", style: { left: x + "px", top: y + "px", fontSize: (30 + (i * 7) % 14) + "px", fontWeight: 700, color: tones[i % tones.length], whiteSpace: "nowrap" } }, cloud, t);
        gsap.set(w, { xPercent: -50, yPercent: -50 });
        return { w, x, y, grp, k };
      });
      // destinos de los grupos
      const hogar = ["lo llevaban a bibliotecas o librerías", "veía leer a sus padres", "le leían", "había libros en casa"];
      const escuela = ["le pedían leer otros libros", "comentaba lo leído", "lo motivaban a leer", "lo animaban a ir a bibliotecas"];
      const colX = { h: 530, e: 1390 };
      const hH = L.h("div", { class: "abs h-title", style: { left: colX.h + "px", top: "380px", fontSize: "50px", color: C.amberD } }, cloud, "En el hogar");
      const hE = L.h("div", { class: "abs h-title", style: { left: colX.e + "px", top: "380px", fontSize: "50px", color: C.blueD } }, cloud, "En la escuela");
      gsap.set([hH, hE], { xPercent: -50, yPercent: -50 });
      const targets = [];
      W.forEach((o) => {
        if (!o.grp) return;
        const tx = colX[o.grp], ty = 480 + o.k * 82;
        const txt = (o.grp === "h" ? hogar : escuela)[o.k];
        const t = L.h("div", { class: "abs", style: { left: tx + "px", top: ty + "px", fontSize: "38px", fontWeight: 700, color: o.grp === "h" ? C.amberD : C.blueD, whiteSpace: "nowrap" } }, cloud, txt);
        gsap.set(t, { xPercent: -50, yPercent: -50 });
        o.t = t; o.tx = tx; o.ty = ty;
        targets.push(t);
      });
      const pill = (x, color) => {
        const p = L.h("div", { class: "abs", style: { left: x - 400 + "px", top: "330px", width: "800px", height: "440px", borderRadius: "40px", background: color, opacity: 0.25, filter: "url(#wc2)" } }, cloud);
        cloud.insertBefore(p, cloud.firstChild);
        return p;
      };
      const pH = pill(colX.h, C.amberL), pE = pill(colX.e, C.blueL);
      gsap.set([cloud], { autoAlpha: 0 });
      gsap.set([hH, hE, pH, pE, ...targets], { autoAlpha: 0 });
      S.step();
      tl.to(ph, { autoAlpha: 0, duration: 0.5 }, ">");
      tl.to(q, { y: -275, scale: 0.6, transformOrigin: "50% 0%", duration: 1.1, ease: "power3.inOut" }, "<");
      tl.to(mark, { scaleX: 1, duration: 0.7, ease: "power2.out" }, ">-0.1");
      tl.to(acc, { color: C.plum, duration: 0.4 }, "<");
      tl.set(cloud, { autoAlpha: 1 }, "<");
      W.forEach((o, i) => {
        const fromX = o.x < 960 ? -700 : 700;
        tl.fromTo(o.w, { autoAlpha: 0, x: fromX, y: (i % 3 - 1) * 120, rotation: (i % 2 ? 8 : -8) }, { autoAlpha: 1, x: 0, y: 0, rotation: 0, duration: 1.4, ease: "power3.out" }, i ? "<0.07" : ">-0.2");
      });

      // ---- Paso 3: las 8 que usamos se encienden y se agrupan ----
      S.step();
      const used = W.filter((o) => o.grp), rest = W.filter((o) => !o.grp);
      tl.to(used.map((o) => o.w), { color: C.plum, scale: 1.12, duration: 0.5, stagger: 0.08 }, ">");
      tl.to(rest.map((o) => o.w), { autoAlpha: 0.2, duration: 0.6 }, "<");
      tl.to(rest.map((o) => o.w), { autoAlpha: 0, duration: 0.5 }, ">0.6");
      tl.fromTo([pH, pE], { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 0.25, scale: 1, duration: 0.9 }, "<");
      tl.fromTo([hH, hE], { autoAlpha: 0, y: -20 }, { autoAlpha: 1, y: 0, duration: 0.6 }, "<0.2");
      used.forEach((o, i) => {
        tl.to(o.w, { x: o.tx - o.x, y: o.ty - o.y, scale: 1, color: o.grp === "h" ? C.amberD : C.blueD, duration: 1.0, ease: "power3.inOut" }, i ? "<0.06" : ">-0.3");
        tl.to(o.w, { autoAlpha: 0, duration: 0.35 }, ">-0.3");
        tl.fromTo(o.t, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.4 }, "<");
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
      const A = L.h("div", { class: "abs", style: { left: "120px", top: "560px", width: "800px", height: "420px" } }, el);
      const sw = L.s("svg", { width: 800, height: 260, viewBox: "0 0 800 260", style: "position:absolute;left:0;top:0" }, A);
      const track = L.s("rect", { x: 260, y: 70, width: 280, height: 120, rx: 60, fill: C.band, stroke: C.ink, "stroke-width": 4 }, sw);
      const knob = L.s("circle", { cx: 320, cy: 130, r: 48, fill: "#fff", stroke: C.ink, "stroke-width": 4 }, sw);
      const no = L.s("text", { x: 230, y: 142, "text-anchor": "end", "font-family": "Nunito", "font-weight": 800, "font-size": 40, fill: C.ink2 }, sw, "No leyó");
      const si = L.s("text", { x: 570, y: 142, "font-family": "Nunito", "font-weight": 800, "font-size": 40, fill: C.ink2 }, sw, "Sí leyó");
      const la = L.h("div", { class: "abs hand", style: { left: "0", top: "270px", width: "800px", textAlign: "center", fontSize: "40px", color: C.plum } }, A, "p3_1: ¿Leyó libros en los últimos 12 meses?");

      const B = L.h("div", { class: "abs", style: { left: "1000px", top: "560px", width: "800px", height: "420px" } }, el);
      const st = L.s("svg", { width: 800, height: 260, viewBox: "0 0 800 260", style: "position:absolute;left:0;top:0" }, B);
      L.s("line", { x1: 250, x2: 550, y1: 250, y2: 250, stroke: C.ink, "stroke-width": 4, "stroke-linecap": "round" }, st);
      const stack = [];
      const cols = [C.blueM, C.amberM, C.plum, C.blueL, C.amberD, "#9DBF9A", C.blueD, C.amberL, C.crimson, C.plumL];
      for (let i = 0; i < 10; i++) {
        const w = 170 + ((i * 37) % 50);
        stack.push(L.s("rect", { x: 400 - w / 2 + ((i * 23) % 16) - 8, y: 226 - i * 24, width: w, height: 22, rx: 4, fill: cols[i], stroke: C.ink, "stroke-width": 3 }, st));
      }
      const lb = L.h("div", { class: "abs hand", style: { left: "0", top: "270px", width: "800px", textAlign: "center", fontSize: "40px", color: C.plum } }, B, "p4: número de libros leídos (solo lectores)");
      gsap.set([A, B], { autoAlpha: 0 });
      tl.set(A, { autoAlpha: 1 }, ">");
      tl.fromTo([track, knob], { autoAlpha: 0, scale: 0.5, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, ">");
      tl.fromTo([no, si], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 }, "<0.2");
      L.write(tl, la, { pos: "<", dur: 1.2 });
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
      L.write(tl, lb, { pos: "<0.4", dur: 1.2 });
    },
  });
})();
