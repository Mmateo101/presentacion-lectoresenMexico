/* Diapositiva 2 · Gancho: Héctor y Eduardo, y la lectura en México */
(function () {
  const { C } = L;
  const { person, mood, arm, walk, Props } = Chars;

  /* Viñeta con marco de tinta y recorte */
  function vignette(svg, id, x, y, w, h, bg) {
    const defs = L.s("defs", {}, svg);
    const cp = L.s("clipPath", { id }, defs);
    L.s("rect", { x: 0, y: 0, width: w, height: h, rx: 18 }, cp);
    const g = L.s("g", { transform: `translate(${x},${y})` }, svg);
    const inner = L.s("g", { "clip-path": `url(#${id})` }, g);
    L.s("rect", { x: 0, y: 0, width: w, height: h, fill: bg }, inner);
    const content = L.s("g", {}, inner);
    const frame = L.s("path", { d: L.roughRect(0, 0, w, h, L.rng(x + y), 4), fill: "none", stroke: C.ink, "stroke-width": 3.5, "stroke-linejoin": "round", filter: "url(#ink)" }, g);
    return { g, content, frame, w, h };
  }

  /* Ondas de "leer en voz alta" */
  function voice(parent, x, y, color = C.ink) {
    const g = L.s("g", { transform: `translate(${x},${y})`, fill: "none", stroke: color, "stroke-width": 3, "stroke-linecap": "round" }, parent);
    [10, 20, 30].forEach((r) => L.s("path", { d: `M${r * 0.6},${-r * 0.8} Q${r * 1.1},0 ${r * 0.6},${r * 0.8}` }, g));
    return g;
  }
  function sparkle(parent, x, y, s = 1, color = C.amberM) {
    const g = L.s("g", { transform: `translate(${x},${y}) scale(${s})` }, parent);
    L.s("path", { d: "M0,-14 L3,-3 L14,0 L3,3 L0,14 L-3,3 L-14,0 L-3,-3 Z", fill: color, stroke: C.ink, "stroke-width": 1.5 }, g);
    return g;
  }
  function tiredLines(parent, x, y) {
    const g = L.s("g", { transform: `translate(${x},${y})`, fill: "none", stroke: C.ink2, "stroke-width": 2.5, "stroke-linecap": "round" }, parent);
    L.s("path", { d: "M0,0 q8,-10 0,-20 q-8,-10 0,-20" }, g);
    L.s("path", { d: "M16,4 q6,-8 0,-16" }, g);
    return g;
  }

  Deck.add({
    spread: true,
    notes: "Gancho: una de nuestras pruebas compara a personas que recibieron estímulos solo en la escuela (como Héctor) contra solo en el hogar (como Eduardo). La respuesta se revela en la diapositiva 8.",
    build(el, S) {
      const tl = S.tl;
      const story = L.h("div", { class: "layer" }, el);       // la doble página
      const svg = L.svg(story);
      const pageL = L.wash(svg, { cx: 480, cy: 540, rx: 520, ry: 600, color: C.blueL, opacity: 0.38, seed: 3, layers: 1 });
      const pageR = L.wash(svg, { cx: 1440, cy: 540, rx: 520, ry: 600, color: C.amberL, opacity: 0.45, seed: 8, layers: 1 });

      // ================= Página izquierda: Héctor =================
      const hA = vignette(svg, "s2hA", 70, 66, 820, 410, "#EEF4F9");
      const hB = vignette(svg, "s2hB", 70, 500, 820, 400, "#EAF2F8");
      {
        const c = hA.content;
        L.s("rect", { x: 0, y: 340, width: 820, height: 70, fill: "#D9E5EF" }, c);
        L.s("line", { x1: 0, x2: 820, y1: 340, y2: 340, stroke: C.ink, "stroke-width": 3 }, c);
        hA.win = Props.window(c, { x: 50, y: 60, w: 130, h: 110 });
        hA.shelf = Props.shelf(c, { x: 225, y: 118, w: 170, h: 222, rows: 3, books: 0 });
        Props.door(c, { x: 700, y: 170, w: 90, h: 170 });
        Props.sofa(c, { x: 470, y: 340, w: 170, color: "#C5CFD9" });
        hA.hector = person(c, { who: "hector", age: "child", shirt: C.blueM, mood: "flat", x: 160, y: 340, s: 0.85 });
        hA.dad = person(c, { who: "dad", age: "adult", shirt: "#8C9AAB", pants: "#4F5866", style: "bald", mustache: true, mood: "flat", x: 900, y: 340, s: 0.78 });
        hA.mom = person(c, { who: "mom", age: "adult", shirt: "#9FB7C9", dress: true, style: "bun", mood: "flat", x: 960, y: 340, s: 0.76 });
        hA.t1 = tiredLines(c, 560, 70); hA.t2 = tiredLines(c, 640, 80);
      }
      {
        const c = hB.content;
        const pan = L.s("g", {}, c); hB.pan = pan;
        // salón
        L.s("rect", { x: 0, y: 330, width: 1700, height: 70, fill: "#D9E5EF" }, pan);
        L.s("line", { x1: 0, x2: 1700, y1: 330, y2: 330, stroke: C.ink, "stroke-width": 3 }, pan);
        Props.blackboard(pan, { x: 40, y: 50, w: 250, h: 120 });
        hB.d1 = Props.desk(pan, { x: 430, y: 330 });
        Props.desk(pan, { x: 590, y: 330, book: C.amberM, open: true });
        Props.desk(pan, { x: 740, y: 330, book: "#9DBF9A", open: true });
        hB.k1 = person(pan, { who: "kid2", age: "child", shirt: "#E8B7C8", style: "long", hair: "#9A5B2E", x: 590, y: 300, s: 0.72 });
        hB.k2 = person(pan, { who: "kid3", age: "child", shirt: "#B9D3A8", hair: "#C9A26B", x: 740, y: 300, s: 0.72 });
        hB.hector = person(pan, { who: "hector", age: "child", shirt: C.blueM, mood: "flat", x: 430, y: 300, s: 0.72 });
        hB.teacher = person(pan, { who: "teacher", age: "adult", shirt: C.plum, dress: true, style: "bun", glasses: true, x: 230, y: 330, s: 0.72 });
        // mesas dibujadas delante de los niños
        [430, 590, 740].forEach((x) => L.s("rect", { x: x - 55, y: 272, width: 110, height: 12, rx: 3, fill: "#C99A6B", stroke: C.ink, "stroke-width": 3 }, pan));
        hB.book = L.book(pan, { x: 238, y: 230, w: 34, h: 46, color: C.blueM });
        hB.bookOpen = L.book(pan, { x: 408, y: 238, w: 46, h: 28, color: C.blueM, open: true });
        hB.v1 = voice(pan, 612, 200); hB.v2 = voice(pan, 762, 200); hB.v3 = voice(pan, 452, 200);
        // biblioteca escolar (a la derecha, se llega con un paneo)
        const lib = L.s("g", { transform: "translate(860,0)" }, pan);
        L.s("rect", { x: 0, y: 0, width: 820, height: 330, fill: "#E6EEF5" }, lib);
        Props.shelf(lib, { x: 60, y: 60, w: 200, h: 270, rows: 4, books: 0.97, seed: 5 });
        Props.shelf(lib, { x: 290, y: 60, w: 200, h: 270, rows: 4, books: 0.97, seed: 6 });
        Props.shelf(lib, { x: 520, y: 60, w: 200, h: 270, rows: 4, books: 0.97, seed: 7 });
        hB.sp = [sparkle(pan, 400, 150, 1), sparkle(pan, 470, 120, 0.7, C.blueM), sparkle(pan, 500, 175, 0.8)];
      }
      const capH = L.text(el, "Héctor: en su casa no había libros… pero en la escuela sus maestros lo motivaban a leer.",
        { left: "80px", top: "918px", width: "800px", fontSize: "37px", lineHeight: 1.1, color: C.blueD }, "hand");

      // ================= Página derecha: Eduardo =================
      const eA = vignette(svg, "s2eA", 1030, 66, 820, 410, "#FBF1E4");
      const eB = vignette(svg, "s2eB", 1030, 500, 820, 400, "#FAEEDF");
      {
        const c = eA.content;
        const pan = L.s("g", {}, c); eA.pan = pan;
        L.s("rect", { x: 0, y: 340, width: 1700, height: 70, fill: "#EFDCC4" }, pan);
        L.s("line", { x1: 0, x2: 1700, y1: 340, y2: 340, stroke: C.ink, "stroke-width": 3 }, pan);
        Props.window(pan, { x: 330, y: 50, w: 120, h: 105, night: true });
        Props.shelf(pan, { x: 30, y: 90, w: 140, h: 250, rows: 4, books: 0.97, seed: 11 });
        Props.shelf(pan, { x: 640, y: 90, w: 140, h: 250, rows: 4, books: 0.97, seed: 12 });
        eA.lamp = Props.lamp(pan, { x: 230, y: 340 });
        Props.bed(pan, { x: 300, y: 340, w: 280 });
        eA.kid = person(pan, { who: "eduardo", age: "child", shirt: C.amberM, style: "curly", x: 450, y: 300, s: 0.72 });
        L.s("path", { d: "M318,262 Q450,236 572,262 L572,300 L318,300 Z", fill: "#F6D3A8", stroke: C.ink, "stroke-width": 3, "stroke-linejoin": "round" }, pan); // cobija
        Props.chair(pan, { x: 236, y: 340 });
        eA.mom = person(pan, { who: "mom", age: "adult", shirt: "#C98A5A", dress: true, style: "long", pose: "sit", x: 248, y: 340, s: 0.7 });
        eA.momBook = L.book(pan, { x: 268, y: 196, w: 54, h: 32, color: C.amberD, open: true });
        // librería (a la derecha)
        const st = L.s("g", { transform: "translate(860,0)" }, pan);
        L.s("rect", { x: 0, y: 0, width: 820, height: 340, fill: "#FCEFD9" }, st);
        L.s("circle", { cx: 120, cy: 70, r: 34, fill: "#FFE7A8", stroke: C.ink, "stroke-width": 3 }, st);
        Props.store(st, { x: 330, y: 340, w: 360, h: 270 });
        eA.dad = person(pan, { who: "dad", age: "adult", shirt: "#C27A3E", pants: "#5E5148", mustache: true, x: 900, y: 340, s: 0.7 });
        eA.kid2 = person(pan, { who: "eduardo", age: "child", shirt: C.amberM, style: "curly", x: 960, y: 340, s: 0.62 });
        eA.kidBook = L.book(pan, { x: 1360, y: 150, w: 32, h: 44, color: C.blueM });
        eA.sp = [sparkle(pan, 1340, 140, 0.9), sparkle(pan, 1420, 120, 0.6, C.blueM)];
      }
      {
        const c = eB.content;
        L.s("rect", { x: 0, y: 330, width: 820, height: 70, fill: "#EFDCC4" }, c);
        L.s("line", { x1: 0, x2: 820, y1: 330, y2: 330, stroke: C.ink, "stroke-width": 3 }, c);
        eB.board = Props.blackboard(c, { x: 270, y: 30, w: 300, h: 110 });
        eB.teacher = person(c, { who: "dad", age: "adult", shirt: "#9C8E7E", pants: "#5E5148", style: "bald", glasses: true, mood: "flat", x: 640, y: 210, s: 0.55 });
        eB.kids = [];
        const r = L.rng(4);
        const shirts = ["#B9D3A8", "#E8B7C8", "#C5CFD9", "#D9C6E2", "#F0D9A0", "#BFD7EA"];
        // tres filas apretadas, cada pupitre con su libro de texto
        [[230, 0.5, 6, 100], [290, 0.58, 6, 70], [345, 0.66, 5, 40]].forEach(([y, s, n, x0], row) => {
          for (let i = 0; i < n; i++) {
            const x = x0 + i * (740 / n) + 40;
            const isE = row === 2 && i === 2;
            const k = person(c, { who: "kid" + (i % 4), age: "child", shirt: isE ? C.amberM : shirts[(i + row) % shirts.length], style: isE ? "curly" : ["short", "long", "curly", "short"][(i + row) % 4], hair: isE ? Chars.HAIR.eduardo : undefined, mood: "flat", x, y: y, s });
            L.s("rect", { x: x - 46 * s, y: y - 66 * s, width: 92 * s, height: 10 * s, fill: "#C99A6B", stroke: C.ink, "stroke-width": 2.5 }, c);
            L.s("rect", { x: x - 22 * s, y: y - 78 * s, width: 44 * s, height: 12 * s, rx: 2, fill: "#A9B4BE", stroke: C.ink, "stroke-width": 2 }, c);
            if (isE) eB.eduardo = k;
            eB.kids.push(k);
          }
        });
        eB.clock = L.s("g", { transform: "translate(140,70)" }, c);
        L.s("circle", { r: 30, fill: "#FFFDF8", stroke: C.ink, "stroke-width": 3 }, eB.clock);
        eB.hand = L.s("line", { x1: 0, y1: 0, x2: 0, y2: -22, stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round" }, eB.clock);
        L.s("line", { x1: 0, y1: 0, x2: 14, y2: 0, stroke: C.ink, "stroke-width": 3, "stroke-linecap": "round" }, eB.clock);
      }
      const capE = L.text(el, "Eduardo: en su escuela nadie le hablaba de libros… pero en su casa le leían todas las noches.",
        { left: "1040px", top: "918px", width: "800px", fontSize: "37px", lineHeight: 1.1, color: C.amberD }, "hand");

      // ================= Estado inicial: doble página en blanco =================
      gsap.set([pageL, pageR, hA.g, hB.g, eA.g, eB.g], { autoAlpha: 0 });
      S.step();

      // ================= Paso 1: Héctor =================
      {
        const t = gsap.timeline();
        L.bloom(t, pageL, 0, 1.2);
        t.fromTo(hA.g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.3);
        // la casa: el estante vacío; llegan los papás cansados
        t.fromTo(hA.shelf, { scale: 0.9, transformOrigin: "50% 100%" }, { scale: 1, duration: 0.4 }, 0.6);
        walk(t, hA.hector, 160, 300, { dur: 1.1, pos: 0.8 });
        walk(t, hA.dad, 900, 520, { dur: 2.0, pos: 1.4 });
        walk(t, hA.mom, 960, 610, { dur: 2.0, pos: 1.6 });
        t.to([hA.dad.head, hA.mom.head], { rotation: 12, svgOrigin: "0 -240", duration: 0.5 }, ">");
        t.to([hA.dad.closedEyes, hA.mom.closedEyes], { opacity: 1, duration: 0.2 }, "<");
        t.to([hA.dad.eyes, hA.mom.eyes], { opacity: 0, duration: 0.2 }, "<");
        t.fromTo([hA.t1, hA.t2], { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.15 }, "<");
        t.to(hA.hector.g, { scaleX: -0.85, duration: 0.2 }, ">-0.2");  // voltea a verlos
        arm(t, hA.hector, 1, -40, ">", 0.4);
        arm(t, hA.hector, 1, 0, ">0.5", 0.4);
        mood(t, hA.hector, "sad", "<");
        t.to(hA.hector.g, { scaleX: 0.85, duration: 0.2 }, ">0.2");
        // la escuela: la maestra le da un libro, leen en voz alta, van a la biblioteca
        t.fromTo(hB.g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, ">0.1");
        gsap.set([hB.bookOpen, hB.v1, hB.v2, hB.v3, ...hB.sp], { autoAlpha: 0 });
        walk(t, hB.teacher, 230, 330, { dur: 0.9, pos: ">" });
        arm(t, hB.teacher, 1, -60, ">", 0.4);
        t.to(hB.book, { x: 90, y: 18, rotation: 20, duration: 0.6, ease: "power2.inOut" }, ">");
        t.to(hB.book, { autoAlpha: 0, duration: 0.2 }, ">-0.1");
        t.fromTo(hB.bookOpen, { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 100%" }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, "<");
        arm(t, hB.teacher, 1, 0, ">", 0.4);
        mood(t, hB.hector, "smile", "<");
        [hB.k1, hB.k2, hB.hector].forEach((k) => mood(t, k, "o", "<"));
        t.fromTo([hB.v1, hB.v2, hB.v3], { autoAlpha: 0, scale: 0.6, transformOrigin: "0% 50%" }, { autoAlpha: 1, scale: 1.1, duration: 0.35, repeat: 3, yoyo: true, stagger: 0.1 }, ">");
        t.to([hB.v1, hB.v2, hB.v3], { autoAlpha: 0, duration: 0.2 }, ">");
        [hB.k1, hB.k2, hB.hector].forEach((k) => mood(t, k, "smile", "<"));
        // paneo a la biblioteca escolar
        t.to(hB.pan, { x: -820, duration: 1.6, ease: "power2.inOut" }, ">0.2");
        t.to(hB.teacher.g, { x: 980, duration: 1.6, ease: "power2.inOut" }, "<");
        t.to(hB.hector.g, { x: 1180, y: 330, duration: 1.6, ease: "power2.inOut" }, "<");
        t.to(hB.k1.g, { x: 1330, y: 330, duration: 1.6, ease: "power2.inOut" }, "<");
        t.to(hB.k2.g, { x: 1480, y: 330, duration: 1.6, ease: "power2.inOut" }, "<");
        mood(t, hB.hector, "big", ">");
        // de vuelta en su pupitre: Héctor sonríe leyendo
        t.to(hB.pan, { x: 0, duration: 1.3, ease: "power2.inOut" }, ">0.6");
        t.set(hB.teacher.g, { x: 230 }, "<");
        t.set(hB.hector.g, { x: 430, y: 300 }, "<");
        t.set(hB.k1.g, { x: 590, y: 300 }, "<");
        t.set(hB.k2.g, { x: 740, y: 300 }, "<");
        t.fromTo(hB.sp, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, rotation: 90, duration: 0.6, stagger: 0.12, ease: "back.out(2)" }, ">");
        L.write(t, capH, { pos: ">-0.3", dur: 2.4 });
        tl.add(t);
      }
      S.step();

      // ================= Paso 2: Eduardo (Héctor se congela) =================
      {
        const t = gsap.timeline();
        L.bloom(t, pageR, 0, 1.2);
        t.fromTo(eA.g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, 0.3);
        gsap.set([...eA.sp, eA.kidBook], { autoAlpha: 0 });
        t.fromTo(eA.lamp._glow, { opacity: 0.1 }, { opacity: 0.6, duration: 0.8, repeat: 1, yoyo: true }, 0.6);
        // mamá lee el cuento: las hojas pasan
        arm(t, eA.mom, 1, -70, 0.9, 0.5);
        arm(t, eA.mom, 0, -40, "<", 0.5);
        t.fromTo(eA.momBook, { scaleX: 1 }, { scaleX: -1, transformOrigin: "50% 50%", duration: 0.4, repeat: 3, yoyo: true, ease: "sine.inOut" }, ">");
        mood(t, eA.kid, "big", "<");
        t.to(eA.kid.eyes, { opacity: 0, duration: 0.3 }, ">0.2");
        t.to(eA.kid.closedEyes, { opacity: 1, duration: 0.3 }, "<");
        mood(t, eA.kid, "smile", "<");
        // papá lo lleva a la librería
        t.to(eA.pan, { x: -820, duration: 1.6, ease: "power2.inOut" }, ">0.4");
        walk(t, eA.dad, 900, 1150, { dur: 1.6, pos: ">-0.4" });
        walk(t, eA.kid2, 960, 1240, { dur: 1.6, pos: "<" });
        arm(t, eA.kid2, 1, -150, ">", 0.4);
        t.fromTo(eA.kidBook, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, x: -105, duration: 0.5, ease: "back.out(2)" }, "<");
        mood(t, eA.kid2, "big", "<");
        t.fromTo(eA.sp, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, rotation: 90, duration: 0.6, stagger: 0.12 }, ">-0.1");
        // escuela: salón lleno, solo libros de texto
        t.fromTo(eB.g, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, ">0.2");
        t.fromTo(eB.kids.map((k) => k.g), { autoAlpha: 0, y: "+=12" }, { autoAlpha: 1, y: "-=12", duration: 0.35, stagger: 0.05 }, "<");
        arm(t, eB.teacher, 0, 110, ">", 0.4);
        t.to(eB.teacher.arms[0], { rotation: 95, duration: 0.25, repeat: 5, yoyo: true }, ">");
        t.to(eB.hand, { rotation: 360, svgOrigin: "0 0", duration: 2, ease: "none" }, "<");
        t.to(eB.eduardo.head, { rotation: -14, svgOrigin: "0 -150", duration: 0.6 }, "<0.3");
        mood(t, eB.eduardo, "sad", "<");
        L.write(t, capE, { pos: ">", dur: 2.4 });
        tl.add(t);
      }
      S.step();

      // ================= Paso 3: crecen; ¿quién leerá más? =================
      const adults = L.h("div", { class: "layer" }, el);
      const asvg = L.svg(adults);
      const riff = L.s("g", {}, asvg);
      const riffles = [];
      for (let i = 0; i < 6; i++) {
        riffles.push(L.s("path", { d: `M1880,${120 + i * 6} Q1700,${100 + i * 4} 1500,${130 + i * 6} L1500,${1010 - i * 4} Q1700,${990 - i * 4} 1880,${1000 - i * 4} Z`, fill: "#FFFDF8", stroke: "#D8CDB8", "stroke-width": 2 }, riff));
        riffles.push(L.s("path", { d: `M40,${120 + i * 6} Q220,${100 + i * 4} 420,${130 + i * 6} L420,${1010 - i * 4} Q220,${990 - i * 4} 40,${1000 - i * 4} Z`, fill: "#FFFDF8", stroke: "#D8CDB8", "stroke-width": 2 }, riff));
      }
      const mk = (who, x, shirt, style) => {
        const g = L.s("g", {}, asvg);
        const glow = L.wash(g, { cx: x, cy: 640, rx: 280, ry: 300, color: who === "hector" ? C.blueL : C.amberL, opacity: 0.55, seed: x, layers: 1 });
        const child = person(g, { who, age: "child", shirt, style, x, y: 860, s: 1.35 });
        const chair = Props.chair(g, { x: x - 30, y: 860 });
        const adult = person(g, { who, age: "adult", shirt, style, pose: "sit", pants: who === "hector" ? "#4F5866" : "#5E5148", mood: "flat", x: x - 40, y: 860, s: 1.25 });
        gsap.set(adult.arms[0], { rotation: -60, svgOrigin: adult.arms[0]._pivot.join(" ") });
        gsap.set(adult.arms[1], { rotation: -60, svgOrigin: adult.arms[1]._pivot.join(" ") });
        const book = L.book(g, { x: x + 40, y: 588, w: 62, h: 82, color: who === "hector" ? C.blueD : C.amberD });
        const q = Props.question(g, { x: x - 10, y: 290, size: 150, color: who === "hector" ? C.blueD : C.amberD });
        return { g, glow, child, chair, adult, book, q };
      };
      const H = mk("hector", 470, C.blueM, "short");
      const E = mk("eduardo", 1430, C.amberM, "curly");
      const quien = L.text(el, "¿Quién leerá más de adulto?", { left: "0", width: "1920px", top: "56px", textAlign: "center", fontSize: "84px", color: C.ink }, "h-title");
      gsap.set([adults, quien], { autoAlpha: 0 });
      {
        const t = gsap.timeline();
        t.to([hA.g, hB.g, eA.g, eB.g], { autoAlpha: 0.1, duration: 0.8 }, 0);
        t.to([pageL, pageR], { autoAlpha: 0.35, duration: 0.8 }, 0);
        t.to([capH, capE], { autoAlpha: 0, duration: 0.5 }, 0);
        t.set(adults, { autoAlpha: 1 }, 0.2);
        [H, E].forEach((P) => {
          t.set([P.chair, P.adult.g, P.book, P.q], { autoAlpha: 0 }, 0.2);
          L.bloom(t, P.glow, 0.2, 1);
          t.fromTo(P.child.g, { autoAlpha: 0, y: 900 }, { autoAlpha: 1, y: 860, duration: 0.6 }, 0.4);
        });
        // los años pasan: hojas que se agitan
        t.fromTo(riffles, { autoAlpha: 0, scaleX: 1, transformOrigin: (i) => (i % 2 ? "100% 50%" : "0% 50%") }, { autoAlpha: 1, keyframes: [{ scaleX: -0.2, duration: 0.18 }, { scaleX: 1, duration: 0.18 }], stagger: 0.09, ease: "sine.inOut" }, 1.0);
        t.to(riffles, { autoAlpha: 0, duration: 0.3 }, ">");
        [H, E].forEach((P, j) => {
          const tt = 1.2 + j * 0.15;
          t.to(P.child.g, { scale: 1.75, autoAlpha: 0, duration: 1.3, ease: "power2.in" }, tt);
          t.fromTo(P.adult.g, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1.25, duration: 1.3, ease: "power2.out" }, tt + 0.5);
          t.fromTo(P.chair, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 }, tt + 0.7);
          t.fromTo(P.book, { autoAlpha: 0, scale: 0.6, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2)" }, tt + 1.5);
          t.fromTo(P.q._p, { strokeDasharray: "400 400", strokeDashoffset: 400 }, { strokeDashoffset: 0, duration: 0.9, ease: "power1.inOut" }, tt + 2.0);
          t.set(P.q, { autoAlpha: 1 }, tt + 2.0);
          t.fromTo(P.q._dot, { scale: 0, transformOrigin: "50% 50%" }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, tt + 2.8);
          t.to(P.q, { y: -10, duration: 1, repeat: 1, yoyo: true, ease: "sine.inOut" }, tt + 3.1);
        });
        L.write(t, quien, { pos: 2.6, dur: 1.6 });
        tl.add(t);
      }
      S.step();

      // ================= Paso 4: la multitud con la forma de México =================
      const mx = L.h("div", { class: "layer" }, el);
      const msvg = L.svg(mx);
      const MX = window.MEXICO;
      const ms = 0.98, mx0 = 70, my0 = 300;
      const defs = L.s("defs", {}, msvg);
      const sym = L.s("symbol", { id: "s2person", viewBox: "-10 -22 20 24", overflow: "visible" }, defs);
      L.s("circle", { cx: 0, cy: -15.5, r: 5 }, sym);
      L.s("path", { d: "M-8.5,2 Q-8.5,-8 0,-8.5 Q8.5,-8 8.5,2 Z" }, sym);
      const mapG = L.s("g", { transform: `translate(${mx0},${my0}) scale(${ms})` }, msvg);
      const outline = L.s("path", { d: MX.outline, fill: "#F1EBDD", stroke: C.ink2, "stroke-width": 1.5, opacity: 0.8 }, mapG);
      const r = L.rng(19);
      const crowd = MX.crowd.map(([x, y]) => {
        const v = r();
        const col = v < 0.36 ? C.blueM : v < 0.72 ? C.amberM : "#A8A398";
        const u = L.s("use", { href: "#s2person", x: x - 8, y: y - 10, width: 16, height: 19, fill: col }, mapG);
        u._d = Math.hypot(x - 560, y - 470);
        return u;
      });
      const sorted = [...crowd].sort((a, b) => a._d - b._d);
      const lit = new Set();
      const rr = L.rng(23);
      const shuffled = [...crowd].sort(() => rr() - 0.5);
      shuffled.slice(0, Math.round(crowd.length * 0.417)).forEach((u) => lit.add(u));
      const litArr = crowd.filter((u) => lit.has(u)), dimArr = crowd.filter((u) => !lit.has(u));

      const like = L.text(mx, "Como Héctor y Eduardo, millones de mexicanos crecieron con estímulos desiguales para la lectura.",
        { left: "110px", top: "70px", width: "1700px", fontSize: "50px", lineHeight: 1.15 }, "h-title");
      const cardStyle = (top) => ({ left: "1120px", top: top + "px", width: "690px" });
      const c1 = L.h("div", { class: "card", style: cardStyle(300) }, mx,
        `<span class="big" style="color:${C.plum}">${L.num(41.7, "pct1")}</span> de los adultos alfabetos leyó al menos un libro en el último año<span class="src">MOLEC 2019–2024</span>`);
      const c2 = L.h("div", { class: "card", style: cardStyle(540) }, mx,
        `Quienes leen, leen en promedio <span class="big" style="color:${C.plum}">${L.num(3.5, "d1")}</span> libros al año (mediana: ${L.num(2)})`);
      const c3 = L.h("div", { class: "card", style: Object.assign(cardStyle(730), { paddingRight: "200px" }) }, mx,
        `La población que lee algún material bajó de ${L.num(84.2, "pct1")} (2015) a ${L.num(69.6, "pct1", 84.2)} (2024)<span class="src">INEGI, 2024</span>`);
      const spark = L.s("svg", { width: 150, height: 110, viewBox: "0 0 150 110", style: "position:absolute;right:28px;top:40px" }, c3);
      L.s("line", { x1: 8, x2: 142, y1: 100, y2: 100, stroke: C.ink2, "stroke-width": 2 }, spark);
      const fall = L.s("path", { d: "M14,18 C50,26 70,40 92,58 S126,80 136,86", fill: "none", stroke: C.ink, "stroke-width": 4, "stroke-linecap": "round", filter: "url(#ink)" }, spark);
      const d1 = L.s("circle", { cx: 14, cy: 18, r: 6, fill: C.plum }, spark);
      const d2 = L.s("circle", { cx: 136, cy: 86, r: 6, fill: C.crimson }, spark);
      const closing = L.text(mx, "¿Cómo afecta esta desigualdad a nuestros hábitos de lectura?",
        { left: "0", width: "1920px", top: "975px", textAlign: "center", fontSize: "48px", color: C.plum, fontStyle: "italic" }, "h-title");
      gsap.set([mx, like, c1, c2, c3, closing], { autoAlpha: 0 });
      gsap.set(crowd, { autoAlpha: 0 });
      {
        const t = gsap.timeline();
        t.to(el, { "--spine": 0, duration: 0.8 }, 0);
        t.to(story, { scale: 0.5, autoAlpha: 0, duration: 1.1, ease: "power2.inOut", transformOrigin: "50% 50%" }, 0);
        t.to(quien, { autoAlpha: 0, y: -40, duration: 0.6 }, 0);
        t.to([H.glow, E.glow, H.chair, E.chair, H.book, E.book, H.q, E.q], { autoAlpha: 0, duration: 0.5 }, 0);
        // Héctor y Eduardo se encogen hacia el mapa
        t.to(H.adult.g, { x: mx0 + 520 * ms, y: my0 + 470 * ms, scale: 0.12, duration: 1.2, ease: "power2.inOut" }, 0.2);
        t.to(E.adult.g, { x: mx0 + 600 * ms, y: my0 + 470 * ms, scale: 0.12, duration: 1.2, ease: "power2.inOut" }, 0.2);
        t.set(mx, { autoAlpha: 1 }, 0.3);
        t.fromTo(outline, { autoAlpha: 0 }, { autoAlpha: 0.8, duration: 1 }, 0.6);
        t.to([H.adult.g, E.adult.g], { autoAlpha: 0, duration: 0.3 }, 1.3);
        t.fromTo(sorted, { autoAlpha: 0, scale: 0, transformOrigin: "50% 100%" }, { autoAlpha: 0.75, scale: 1, duration: 0.35, stagger: { amount: 1.8 }, ease: "back.out(2)" }, 1.2);
        L.write(t, like, { pos: 1.6, dur: 2.0 });
        tl.add(t);
      }
      S.step();
      // tarjeta 1: se encienden ~4 de cada 10
      {
        const t = gsap.timeline();
        L.pop(t, c1, 0, { from: { x: 60, y: 0, rotation: 2 }, to: { x: 0, rotation: 0 } });
        L.counts(t, c1, 0.2, 1.6);
        t.to(dimArr, { autoAlpha: 0.22, duration: 0.8 }, 0.4);
        t.to(litArr, { autoAlpha: 1, scale: 1.25, duration: 0.5, stagger: { amount: 1.2, from: "random" }, ease: "back.out(3)" }, 0.4);
        tl.add(t);
      }
      S.step();
      {
        const t = gsap.timeline();
        L.pop(t, c2, 0, { from: { x: 60, y: 0, rotation: -2 }, to: { x: 0, rotation: 0 } });
        L.counts(t, c2, 0.2, 1.4);
        tl.add(t);
      }
      S.step();
      {
        const t = gsap.timeline();
        L.pop(t, c3, 0, { from: { x: 60, y: 0, rotation: 2 }, to: { x: 0, rotation: 0 } });
        gsap.set(d2, { autoAlpha: 0 });
        L.counts(t, c3, 0.3, 1.8);
        L.draw(t, fall, 0.3, { duration: 1.6, ease: "power1.in" });
        t.fromTo(d2, { autoAlpha: 0, scale: 0 }, { autoAlpha: 1, scale: 1, transformOrigin: "50% 50%", duration: 0.3 }, ">");
        tl.add(t);
      }
      S.step();
      {
        const t = gsap.timeline();
        L.write(t, closing, { pos: 0, dur: 1.8 });
        tl.add(t);
      }
    },
  });
})();
