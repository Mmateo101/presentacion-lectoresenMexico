/* Diapositivas 10 y 10b · Resultado 5 (diferencia de medias de libros) y Resultado 6 (libros en casa y varianza) */
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

  const P = L.RES[4]; // color del Resultado 5
  const P6 = L.RES[5]; // color del Resultado 6

  // ===================== Resultado 5: diferencia de medias =====================
  Deck.add({
    accent: P.a,
    transition: "watercolor",
    washColors: [P.l, P.m, P.l, P.a, P.m], // explosiones del color de este resultado
    notes: "Lectores con acceso alto vs. bajo en el hogar: IC 96% para la diferencia de medias [0.43, 1.13] libros (t de Welch, varianzas distintas). Nos apoyamos en el Teorema del Límite Central (más de 1,400 lectores por grupo).",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 4");
      const head = L.head(el, "Diferencia de medias de libros: acceso alto vs. bajo");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const t1 = L.h("div", { class: "abs h-title", style: { left: "110px", top: "170px", width: "1100px", fontSize: "38px", lineHeight: 1.2 } }, el, "Libros leídos al año: acceso alto – bajo en el hogar");
      const ic1 = L.h("div", { class: "abs", style: { left: "110px", top: "230px", fontSize: "30px", fontWeight: 700, color: C.amberD } }, el, "IC 96% [0.43, 1.13] (t de Welch)");
      const sv1 = L.svg(el);
      const m = D.mediasHogar;
      const h1 = Charts.hinterval(sv1, { x: 110, y: 300, w: 1080, h: 380, xDomain: [-0.1, 1.5], xTicks: [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4], fmt: (v) => v.toFixed(1), li: m.li, ls: m.ls, zero: 0, color: C.amberD, wash: C.amberL, xTitle: "Diferencia de medias de libros leídos", yLabel: "Diferencia" });
      const stA = stack(sv1, 1420, 800, m.alto, C.amberD, "Alto");
      const stB = stack(sv1, 1680, 800, m.bajo, C.amberL, "Bajo");
      const msg1 = L.h("div", { class: "abs h-title", style: { left: "0", width: "1920px", top: "900px", textAlign: "center", fontSize: "48px", fontStyle: "italic", color: P.a } }, el, `${L.ins(2)}La diferencia existe, pero es menor a un libro al año.`);
      gsap.set([t1, ic1, msg1, stA.num, stB.num, stA.lab, stB.lab], { autoAlpha: 0 });
      L.write(tl, t1, { pos: ">", dur: 1.2 });
      h1.play(tl, ">-0.2");
      L.pop(tl, ic1, "<0.6", { from: { y: 8 } });
      [stA, stB].forEach((st, j) => {
        tl.fromTo(st.books, { y: "-=300", autoAlpha: 0 }, { y: "+=300", autoAlpha: 1, duration: 0.5, ease: "bounce.out", stagger: 0.16 }, j ? "<0.2" : ">-0.4");
        tl.fromTo([st.num, st.lab], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, ">-0.2");
        L.counts(tl, st.num.querySelector(".num"), "<", 0.8);
      });
      L.write(tl, msg1, { pos: ">0.2", dur: 1.6 });
    },
  });

  // ===================== Resultado 6: libros en casa → varianza de "Más de 100" =====================
  Deck.add({
    accent: P6.a,
    transition: "watercolor",
    washColors: [P6.l, P6.m, P6.l, P6.a, P6.m], // explosiones del color de este resultado
    notes: "Diagramas de caja de libros leídos (lectores) según los libros que había en casa. Para el grupo de más de 100 libros: intervalo de confianza de la varianza con ji-cuadrada, n − 1 gl, α = 0.04 (datos: n = 342, s² = 115.0, IC 96% [98.84, 135.44], 341 gl). Supone normalidad; los datos están muy sesgados, así que se interpreta con cautela.",
    build(el, S) {
      const tl = S.tl;
      L.kicker(el, "Resultado 5");
      const head = L.head(el, "Libros en casa y cuántos libros se leen");
      L.pop(tl, head, 0, { from: { y: -20 } });
      const sv = L.svg(el);
      const rows = D.librosEnCasa, K = rows.length - 1; // la última fila es "Más de 100"
      const shades = d3.quantize(d3.interpolateRgb(P6.l, P6.d), 6);
      const bp = Charts.boxplots(sv, { x: 110, y: 150, w: 1700, h: 860, rows, xDomain: [0, 30], xTicks: [0, 5, 10, 15, 20, 25, 30], color: shades, xTitle: "Libros leídos", m: { l: 190, r: 30, t: 20, b: 100 } });
      const meanKey = L.h("div", { class: "abs", style: { left: "1640px", top: "120px", fontSize: "26px", color: C.ink2, fontWeight: 700 } }, el, `<span style="display:inline-block;width:18px;height:18px;background:${C.ink};transform:rotate(45deg);margin-right:12px"></span>media`);
      gsap.set(meanKey, { autoAlpha: 0 });
      bp.frameIn(tl, ">");
      L.pop(tl, meanKey, "<", { from: { y: 10 } });
      rows.forEach((r, i) => bp.rowIn(tl, i, i ? ">-0.1" : ">"));

      // ---- Espacio: se queda solo "Más de 100"; el eje se recorta y la caja crece ----
      S.step();
      const ih = 860 - 120, iw = 1700 - 220;
      const IH = 260, X2 = d3.scaleLinear().domain([0, 20]).range([0, iw]); // nuevo alto y nueva escala (0–20 libros)
      const rw = bp.rows[K], r = rw.r;
      const yc0 = bp.y(r.cat) + bp.y.bandwidth() / 2, bh0 = bp.y.bandwidth();
      const yc = IH / 2 + 10, bh = 120;
      const iqr = r.q3 - r.q1, lo = Math.max(1, r.q1 - 1.5 * iqr), hi = Math.floor(r.q3 + 1.5 * iqr);
      const v = { duration: 1.0, ease: "power3.inOut" };
      tl.to(bp.rows.filter((_, i) => i !== K).map((q) => q.rg), { autoAlpha: 0, duration: 0.4 }, ">");
      tl.to(bp.ay.tks.filter((_, i) => i !== K), { autoAlpha: 0, duration: 0.4 }, "<");
      tl.to(meanKey, { autoAlpha: 0, duration: 0.4 }, "<");
      tl.addLabel("squeeze", ">0.1");
      // recorte vertical: el marco y el eje X suben
      tl.to(bp.frame, Object.assign({ attr: { height: IH } }, v), "squeeze");
      tl.to(bp.ay.line, Object.assign({ scaleY: IH / ih, svgOrigin: "0 0" }, v), "squeeze");
      tl.to(bp.ax.g, Object.assign({ y: IH - ih }, v), "squeeze");
      tl.to(bp.ay.tks[K], Object.assign({ y: yc - yc0 }, v), "squeeze");
      // extensión horizontal: el eje X ahora va de 0 a 20 libros
      bp.ax.tks.forEach((t, i) => {
        const tv = [0, 5, 10, 15, 20, 25, 30][i];
        tl.to(t, Object.assign({ x: X2(Math.min(tv, 20)) - bp.x(tv), autoAlpha: tv > 20 ? 0 : 1 }, v), "squeeze");
      });
      // la caja crece
      tl.to(rw.bx, Object.assign({ attr: { x: X2(r.q1), width: X2(r.q3) - X2(r.q1), y: yc - bh / 2, height: bh } }, v), "squeeze");
      tl.to(rw.med, Object.assign({ attr: { x1: X2(r.mediana), x2: X2(r.mediana), y1: yc - bh / 2, y2: yc + bh / 2 } }, v), "squeeze");
      tl.to(rw.wL, Object.assign({ attr: { x1: X2(lo), x2: X2(r.q1), y1: yc, y2: yc } }, v), "squeeze");
      tl.to(rw.wR, Object.assign({ attr: { x1: X2(r.q3), x2: X2(hi), y1: yc, y2: yc } }, v), "squeeze");
      tl.to(rw.cL, Object.assign({ attr: { x1: X2(lo), x2: X2(lo), y1: yc - bh * 0.3, y2: yc + bh * 0.3 } }, v), "squeeze");
      tl.to(rw.cR, Object.assign({ attr: { x1: X2(hi), x2: X2(hi), y1: yc - bh * 0.3, y2: yc + bh * 0.3 } }, v), "squeeze");
      tl.to(rw.dia, Object.assign({ x: X2(r.media) - bp.x(r.media), y: yc - yc0, scale: 1.4, transformOrigin: "50% 50%" }, v), "squeeze");
      // símbolo de varianza: flecha de lado a lado de la dispersión
      const ga = L.s("g", { fill: "none", stroke: P6.d, "stroke-width": 3.5, "stroke-linecap": "round" }, bp.g);
      const ay = yc - bh / 2 - 34;
      L.s("path", { d: `M${X2(lo)},${ay} H${X2(hi)} M${X2(lo) + 14},${ay - 10} L${X2(lo)},${ay} L${X2(lo) + 14},${ay + 10} M${X2(hi) - 14},${ay - 10} L${X2(hi)},${ay} L${X2(hi) - 14},${ay + 10}` }, ga);
      const sig = L.s("text", { x: (X2(lo) + X2(hi)) / 2, y: ay - 18, "text-anchor": "middle", "font-family": "Fraunces", "font-style": "italic", "font-weight": 700, "font-size": 60, fill: P6.d }, bp.g, "σ²");
      gsap.set([ga, sig], { autoAlpha: 0 });
      tl.fromTo(ga, { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scaleX: 1, duration: 0.6, ease: "power2.out" }, ">-0.1");
      tl.fromTo(sig, { autoAlpha: 0, scale: 0, transformOrigin: "50% 50%" }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: "back.out(2.5)" }, ">-0.2");

      // ---- Abajo: intervalo de confianza de la varianza (ji-cuadrada) ----
      const vr = D.varianzaMas100;
      const t3 = L.h("div", { class: "abs h-title", style: { left: 0, width: "1920px", top: "598px", textAlign: "center", fontSize: "40px" } }, el, "Varianza de los libros leídos · más de 100 libros en casa");
      const t3b = L.h("div", { class: "abs", style: { left: 0, width: "1920px", top: "650px", textAlign: "center", fontSize: "30px", fontWeight: 800, color: P6.a } }, el, "Intervalo de confianza del 96% para σ²");
      const sv2 = L.svg(el);
      const hv = Charts.hinterval(sv2, { x: 160, y: 690, w: 1600, h: 370, m: { l: 150, r: 70, t: 30, b: 100 }, xDomain: [90, 145], xTicks: [90, 100, 110, 120, 130, 140], fmt: (x) => x.toFixed(0), li: vr.li, ls: vr.ls, point: vr.s2, color: P6.a, wash: P6.l, xTitle: "Varianza (libros²)", liLabel: vr.li.toFixed(2), lsLabel: vr.ls.toFixed(2) });
      const sLab = Charts.T(hv.g, hv.x(vr.s2), hv.cy - 30, `s² = ${vr.s2.toFixed(2)}`, { "text-anchor": "middle", "font-weight": 800, "font-size": 26, fill: C.ink });
      // distribución usada: ji-cuadrada, con sus grados de libertad en chiquito
      const chiLab = Charts.T(hv.g, -80, hv.cy + 8, "χ²", { "text-anchor": "middle", "font-family": "Fraunces", "font-style": "italic", "font-weight": 700, "font-size": 56, fill: P6.d });
      const glLab = Charts.T(hv.g, -80, hv.cy + 40, `${vr.gl} gl`, { "text-anchor": "middle", "font-weight": 700, "font-size": 20, fill: C.ink2 });
      gsap.set([t3, t3b, sv2, sLab, chiLab, glLab], { autoAlpha: 0 });
      L.write(tl, t3, { pos: ">0.1", dur: 1.0 });
      L.pop(tl, t3b, ">", { from: { y: 8 } });
      tl.set(sv2, { autoAlpha: 1 }, "<");
      hv.play(tl, "<0.2");
      tl.fromTo(sLab, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, ">-0.1");
      tl.fromTo([chiLab, glLab], { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.4, stagger: 0.15 }, ">-0.1");
    },

    /* ---------- Transición a Conclusiones: todo cae, una brocha pinta el fondo del librero y se vuelve mueble ---------- */
    out(from, to, fx) {
      const tl = gsap.timeline();
      const kids = [...from.children];
      const saved = kids.map((k) => ({ k, x: gsap.getProperty(k, "x"), y: gsap.getProperty(k, "y"), r: gsap.getProperty(k, "rotation") }));
      gsap.set(to, { autoAlpha: 0 });
      // 1 · todo lo de la diapositiva se cae
      tl.to(kids, { y: (i) => 1250 + (i % 3) * 80, rotation: (i) => ((i * 47) % 50) - 25, duration: 0.85, ease: "power2.in", stagger: { amount: 0.35, from: "random" } }, 0);
      // 2 · brochazos del color del fondo del librero, de arriba a abajo, de ida y vuelta
      const svg = L.svg(fx, { style: "position:absolute;left:0;top:0" });
      const PAINT = "#E9D6BC";
      // un solo grupo con el filtro de acuarela, del tamaño de la hoja (si no, el filtro recorta cada trazo)
      const paint = L.s("g", { filter: "url(#wc2)" }, svg);
      L.s("rect", { x: -40, y: -40, width: 2000, height: 1160, fill: "none" }, paint);
      const strokes = [0, 1, 2, 3, 4, 5, 6].map((i) => {
        const y = 40 + i * 168, w = (k) => (Math.sin(i * 1.7 + k) * 18).toFixed(0);
        const d = i % 2
          ? `M2040,${y} C1500,${+y + +w(1)} 900,${y - w(2)} 420,${+y + +w(3)} S-60,${y} -140,${y}`
          : `M-140,${y} C420,${+y + +w(1)} 1020,${y - w(2)} 1500,${+y + +w(3)} S1980,${y} 2060,${y}`;
        return L.s("path", { d, fill: "none", stroke: PAINT, "stroke-width": 250, "stroke-linecap": "round" }, paint);
      });
      L.draw(tl, strokes, 0.45, { duration: 0.42, stagger: 0.2, ease: "power1.inOut" });
      // 3 · el fondo pintado se "va hacia atrás" y se vuelve el librero (los libros llegan con la entrada de Conclusiones)
      const T = 0.45 + 6 * 0.2 + 0.45;
      tl.set(from, { autoAlpha: 0 }, T)
        .set(to, { autoAlpha: 1 }, T)
        .fromTo(to, { scale: 1.18, transformOrigin: "50% 50%" }, { scale: 1, duration: 1.1, ease: "power3.out" }, T)
        .to(svg, { opacity: 0, scale: 1.05, transformOrigin: "50% 50%", duration: 0.7, ease: "power1.out" }, T + 0.1);
      return {
        tl,
        cleanup() {
          svg.remove();
          saved.forEach((o) => gsap.set(o.k, { x: o.x, y: o.y, rotation: o.r }));
        },
      };
    },
  });
})();
