/* Diapositiva 10 · Varianza de los libros leídos */
(function () {
  const { C } = L;
  const D = window.DATA;

  /* Pila de libros: n libros completos + fracción del último */
  function stack(parent, x, base, value, col, label) {
    const g = L.s("g", {}, parent);
    const books = [];
    const full = Math.floor(value), frac = value - full;
    for (let i = 0; i < Math.ceil(value); i++) {
      const w = 150 - (i % 3) * 14, h = 40;
      const part = i < full ? 1 : frac;
      const b = L.s("g", {}, g);
      gsap.set(b, { x: x - w / 2 + ((i * 17) % 18) - 9, y: base - (i + 1) * (h + 2) });
      if (part < 1) {
        L.s("rect", { x: 0, y: 0, width: w, height: h, rx: 6, fill: "none", stroke: col, "stroke-width": 2.5, "stroke-dasharray": "7 6" }, b);
        L.s("rect", { x: 0, y: 0, width: w * part, height: h, rx: 6, fill: col, stroke: C.ink, "stroke-width": 3 }, b);
      } else {
        L.s("rect", { x: 0, y: 0, width: w, height: h, rx: 6, fill: col, stroke: C.ink, "stroke-width": 3 }, b);
        L.s("line", { x1: 14, x2: w - 14, y1: h / 2, y2: h / 2, stroke: "#fff", "stroke-width": 3, opacity: 0.6 }, b);
      }
      books.push(b);
    }
    const num = L.s("text", { x, y: base - Math.ceil(value) * 42 - 26, "text-anchor": "middle", "font-family": "Fraunces", "font-weight": 700, "font-size": 50, fill: C.ink }, g);
    L.s("tspan", { class: "num", "data-to": value, "data-fmt": "d2" }, num, value.toFixed(2));
    L.s("tspan", { "font-size": 30, "font-family": "Nunito", "font-weight": 700 }, num, " libros");
    const lab = L.s("text", { x, y: base + 44, "text-anchor": "middle", "font-family": "Nunito", "font-weight": 800, "font-size": 30, fill: col === C.amberL ? C.amberD : col }, g, label);
    return { g, books, num, lab };
  }

  const P = L.RES[4]; // color de este resultado

  Deck.add({
    accent: L.RES[4].a,
    transition: "pageTurn",
    notes: "Para las medias nos apoyamos en el Teorema del Límite Central; el intervalo de la varianza no tiene ese respaldo.",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 5");
      const head = L.head(el, "Varianza de los libros leídos");
      L.pop(tl, head, 0, { from: { y: -20 } });

      // ================= Paso 1: diferencia de medias =================
      const s1 = L.h("div", { class: "layer" }, el);
      const t1 = L.h("div", { class: "abs h-title", style: { left: "110px", top: "170px", width: "1100px", fontSize: "38px", lineHeight: 1.2 } }, s1, "Diferencia de medias de libros: acceso alto – bajo en el hogar");
      const ic1 = L.h("div", { class: "abs", style: { left: "110px", top: "230px", fontSize: "30px", fontWeight: 700, color: C.amberD } }, s1, "IC 96% [0.43, 1.13] (t de Welch)");
      const sv1 = L.svg(s1);
      const m = D.mediasHogar;
      const h1 = Charts.hinterval(sv1, { x: 110, y: 300, w: 1080, h: 380, xDomain: [-0.1, 1.5], xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4], fmt: (v) => v.toFixed(1), li: m.li, ls: m.ls, zero: 0, color: C.amberD, wash: C.amberL, xTitle: "Diferencia de medias de libros leídos", yLabel: "Diferencia" });
      const stA = stack(sv1, 1420, 800, m.alto, C.amberD, "Alto");
      const stB = stack(sv1, 1680, 800, m.bajo, C.amberL, "Bajo");
      const msg1 = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "900px", textAlign: "center", fontSize: "48px", fontStyle: "italic", color: P.a } }, s1, `${L.ins(7)}La diferencia existe, pero es menor a un libro al año.`);
      gsap.set([s1, t1, ic1, msg1, stA.num, stB.num, stA.lab, stB.lab], { autoAlpha: 0 });
      S.step();
      tl.set(s1, { autoAlpha: 1 }, ">");
      L.write(tl, t1, { pos: ">", dur: 1.2 });
      h1.play(tl, ">-0.2");
      L.pop(tl, ic1, "<0.6", { from: { y: 8 } });
      [stA, stB].forEach((st, j) => {
        tl.fromTo(st.books, { y: "-=300", autoAlpha: 0 }, { y: "+=300", autoAlpha: 1, duration: 0.5, ease: "bounce.out", stagger: 0.16 }, j ? "<0.2" : ">-0.4");
        tl.fromTo([st.num, st.lab], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, ">-0.2");
        L.counts(tl, st.num.querySelector(".num"), "<", 0.8);
      });
      L.write(tl, msg1, { pos: ">0.2", dur: 1.6 });

      // ================= Paso 2: boxplots por libros en casa =================
      S.step();
      const s2 = L.h("div", { class: "layer" }, el);
      const t2 = L.h("div", { class: "abs h-title", style: { left: "110px", top: "150px", fontSize: "38px" } }, s2, "Libros leídos según libros en casa durante la infancia");
      const sv2 = L.svg(s2);
      const shades = d3.quantize(d3.interpolateRgb(C.amberL, C.amberD), 6);
      const bp = Charts.boxplots(sv2, { x: 110, y: 200, w: 1380, h: 820, rows: D.librosEnCasa, xDomain: [0, 30], xTicks: [0, 5, 10, 15, 20, 25, 30], color: shades, xTitle: "Libros leídos", m: { l: 190, r: 30, t: 20, b: 100 } });
      const sdBox = L.h("div", { class: "card", style: { left: "1540px", top: "380px", width: "300px", textAlign: "center", padding: "24px 20px" } }, s2,
        `<div style="font-size:28px;font-weight:800;color:${C.ink2}">Desv. est.</div><div class="h-title sdv" style="font-size:84px;color:${C.amberD};line-height:1.1">4.72</div><div class="sdc" style="font-size:26px;font-weight:700;color:${C.ink2}">Ninguno</div>`);
      const sdv = sdBox.querySelector(".sdv"), sdc = sdBox.querySelector(".sdc");
      const meanKey = L.h("div", { class: "abs", style: { left: "1560px", top: "660px", fontSize: "26px", color: C.ink2, fontWeight: 700 } }, s2, `<span style="display:inline-block;width:18px;height:18px;background:${C.ink};transform:rotate(45deg);margin-right:12px"></span>media`);
      gsap.set([s2, t2, sdBox, meanKey], { autoAlpha: 0 });
      tl.to(s1, { autoAlpha: 0, x: -100, duration: 0.6, ease: "power2.in" }, ">");
      tl.set(s2, { autoAlpha: 1 }, ">");
      L.write(tl, t2, { pos: ">", dur: 1.0 });
      bp.frameIn(tl, "<");
      L.pop(tl, sdBox, ">-0.2", { from: { x: 30, y: 0 }, to: { x: 0 } });
      L.pop(tl, meanKey, "<", { from: { y: 10 } });
      let prev = D.librosEnCasa[0].sd;
      D.librosEnCasa.forEach((r, i) => {
        bp.rowIn(tl, i, i ? ">-0.1" : ">");
        tl.to(sdv, { count: { from: prev, to: r.sd, fmt: "d2" }, duration: 0.6, ease: "power1.out" }, "<");
        tl.set(sdc, { textContent: r.cat }, "<");
        prev = r.sd;
      });
      tl.to(sdBox, { scale: 1.08, duration: 0.25, yoyo: true, repeat: 1 }, ">");

      // ================= Paso 3: IC de la varianza → desviación estándar =================
      S.step();
      const s3 = L.h("div", { class: "layer" }, el);
      const v = D.varianzaMas100;
      const t3a = L.h("div", { class: "abs h-title", style: { left: "110px", top: "160px", width: "1700px", fontSize: "36px" } }, s3, "Varianza muestral 116.91, IC 96% [100.32, 137.93] (χ² con 334 gl, n = 335)");
      const t3b = L.h("div", { class: "abs h-title", style: { left: "110px", top: "160px", width: "1700px", fontSize: "36px" } }, s3, "s = 10.81, IC [10.01, 11.74] libros");
      const grp = L.h("div", { class: "abs", style: { left: "110px", top: "215px", fontSize: "26px", color: C.ink2, fontWeight: 700 } }, s3, "Libros en casa: Más de 100");
      const sv3 = L.svg(s3);
      const hv = Charts.hinterval(sv3, { x: 110, y: 260, w: 1700, h: 330, xDomain: [80, 155], xTicks: [80, 100, 120, 140], fmt: (x) => x.toFixed(0), li: v.li, ls: v.ls, ref: v.s2, refColor: C.crimson, color: P.a, wash: P.l, xTitle: "Varianza", yLabel: "Varianza" });
      const hs = Charts.hinterval(sv3, { x: 110, y: 260, w: 1700, h: 330, xDomain: [9.2, 12.6], xTicks: [9.5, 10, 10.5, 11, 11.5, 12, 12.5], fmt: (x) => x.toFixed(1), li: v.sLi, ls: v.sLs, ref: v.s, refColor: C.crimson, color: P.a, wash: P.l, xTitle: "Desviación estándar", yLabel: "Desv. est." });
      // las piezas de la varianza se deslizan a las posiciones de la desviación estándar
      const morphTo = (a, b) => ({ x1: +b.getAttribute("x1"), x2: +b.getAttribute("x2") });
      gsap.set([s3, t3a, t3b, grp, hs.frame, hs.ax.g, hs.yl, hs.arm, hs.c1, hs.c2, hs.wash, hs.ref], { autoAlpha: 0 });
      tl.to(s2, { autoAlpha: 0, x: -100, duration: 0.6, ease: "power2.in" }, ">");
      tl.set(s3, { autoAlpha: 1 }, ">");
      L.write(tl, t3a, { pos: ">", dur: 1.4 });
      L.pop(tl, grp, "<", { from: { y: 8 } });
      hv.play(tl, "<0.4");
      tl.addLabel("morph", ">0.8");
      tl.to(t3a, { autoAlpha: 0, y: -20, duration: 0.4 }, "morph");
      tl.fromTo(t3b, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.5 }, "morph+=0.3");
      tl.to([hv.ax.g, hv.yl], { autoAlpha: 0, duration: 0.4 }, "morph");
      tl.fromTo([hs.ax.g, hs.yl], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, "morph+=0.4");
      tl.to(hv.arm, { attr: morphTo(hv.arm, hs.arm), duration: 1, ease: "power3.inOut" }, "morph");
      tl.to(hv.c1, { attr: morphTo(hv.c1, hs.c1), duration: 1, ease: "power3.inOut" }, "morph");
      tl.to(hv.c2, { attr: morphTo(hv.c2, hs.c2), duration: 1, ease: "power3.inOut" }, "morph");
      tl.to(hv.ref, { attr: morphTo(hv.ref, hs.ref), duration: 1, ease: "power3.inOut" }, "morph");
      tl.to(hv.wash, { attr: { x: +hs.wash.getAttribute("x"), width: +hs.wash.getAttribute("width") }, duration: 1, ease: "power3.inOut" }, "morph");
      tl.to(hv.lLab, { autoAlpha: 0, duration: 0.3 }, "morph");

      // ================= Paso 4: mensaje y advertencia =================
      S.step();
      const msg = L.h("div", { class: "abs h-title", style: { left: "160px", width: "1600px", top: "690px", textAlign: "center", fontSize: "46px", fontStyle: "italic", color: P.a, lineHeight: 1.25 } }, s3, `${L.ins(8)}Crecer con muchos libros no hace que todos lean igual: en ese grupo conviven lectores ocasionales y lectores muy intensos.`);
      const tag = L.h("div", { class: "tag", style: { left: "360px", width: "1200px", top: "900px", textAlign: "center", color: C.crimson, borderColor: C.crimson, fontSize: "36px" } }, s3, "⚠ Este intervalo supone normalidad; los datos están muy sesgados, así que lo interpretamos con cautela.");
      gsap.set([msg, tag], { autoAlpha: 0 });
      L.write(tl, msg, { pos: ">", dur: 2.4 });
      tl.fromTo(tag, { autoAlpha: 0, rotation: -4, y: 30 }, { autoAlpha: 1, rotation: -1, y: 0, duration: 0.6, ease: "back.out(2)" }, ">0.2");
    },
  });
})();
