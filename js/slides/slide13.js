/* Diapositiva 13 · Líneas futuras de investigación + cierre del libro */
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

  Deck.add({
    transition: "pageTurn",
    notes: "",
    build(el, S) {
      const tl = S.tl;
      // ---- Hoja de cuaderno ----
      const page = L.h("div", { class: "layer", style: { background: "repeating-linear-gradient(180deg, transparent 0 61px, rgba(111,163,207,.35) 61px 63px)", backgroundPosition: "0 22px" } }, el);
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

      // ---- Cierre: el cuaderno se cierra en la tapa original del libro ----
      S.step();
      const cover = L.h("div", { class: "layer", style: { transformOrigin: "0% 50%" } }, el);
      const lea = window.Leather(cover, { inset: "0px", borderRadius: "0" });
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
      gsap.set([cover, logo, gr, pq, eq], { autoAlpha: 0 });
      tl.to(page, { rotationY: -100, transformOrigin: "0% 50%", transformPerspective: 2600, duration: 1.0, ease: "power2.in" }, ">");
      tl.to(page, { autoAlpha: 0, duration: 0.01 }, ">");
      tl.set(cover, { autoAlpha: 1 }, "<");
      tl.fromTo(cover, { rotationY: 100, transformPerspective: 2600 }, { rotationY: 0, duration: 1.1, ease: "power2.out" }, "<");
      tl.fromTo(plate, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6 }, ">-0.4");
      L.pop(tl, logo, ">", { from: { y: -10 } });
      tl.fromTo(gr, { autoAlpha: 0, clipPath: "inset(0% 100% 0% 0%)" }, { autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "power1.inOut" }, ">");
      L.write(tl, pq, { pos: ">", dur: 0.9 });
      L.draw(tl, ornP, ">", { duration: 0.8 });
      L.pop(tl, eq, "<0.2", { from: { y: 12 } });
    },
  });
})();
