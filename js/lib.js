/* Utilidades compartidas: DOM/SVG, texto que se escribe solo, acuarelas, contadores. */
(function () {
  const SVGNS = "http://www.w3.org/2000/svg";
  const C = {
    paper: "#FBF8F1", paper2: "#F4EEE1", ink: "#2B2A33", ink2: "#6B6875",
    blueL: "#BFD7EA", blueM: "#6FA3CF", blueD: "#2F5D8A",
    amberL: "#F6D3A8", amberM: "#E59A4F", amberD: "#B5651D",
    plum: "#7A4E8C", plumL: "#D9C6E2", plumM: "#A983BA", crimson: "#B23A48", band: "#E4E0D8",
    grey: "#B9B4AA", skin: "#F3D2B3", skin2: "#E2B48E",
  };

  gsap.registerPlugin(CustomEase, MotionPathPlugin);
  CustomEase.create("ink", "M0,0 C0.2,0 0.1,1 1,1");
  CustomEase.create("drop", "M0,0 C0.3,0 0.4,1.25 0.62,1.04 0.78,0.94 0.88,1 1,1");

  /* Contador numérico como plugin: se dibuja en cada render, así que funciona al
     retroceder la línea de tiempo con seek(). */
  gsap.registerPlugin({
    name: "count",
    init(target, v) {
      this._ct = target;
      this._ca = v.from || 0;
      this._cb = v.to;
      this._cf = L.fmt[v.fmt] || L.fmt.int; // nombre del formato (GSAP evaluaría una función)
    },
    render(r, d) { if (d._cf) d._ct.textContent = d._cf(d._ca + (d._cb - d._ca) * r); },
  });

  /* Letras que giran: muestra la secuencia seq (texto) según el avance; termina en la última */
  gsap.registerPlugin({
    name: "letters",
    init(target, v) { this._lt = target; this._ls = String(v.seq); },
    render(r, d) { if (d._ls) d._lt.textContent = d._ls[Math.min(d._ls.length - 1, Math.floor(r * d._ls.length))]; },
  });

  /* Plugin para el atributo "d" interpolando números (misma estructura de comandos). */
  gsap.registerPlugin({
    name: "morphD",
    init(target, v) {
      this.t = target;
      const nums = (s) => s.match(/-?\d*\.?\d+(e-?\d+)?/g).map(Number);
      this.parts = v.to.split(/-?\d*\.?\d+(?:e-?\d+)?/g);
      this.a = nums(v.from || target.getAttribute("d"));
      this.b = nums(v.to);
    },
    render(r, d) {
      let s = d.parts[0];
      for (let i = 0; i < d.b.length; i++) s += (d.a[i] + (d.b[i] - d.a[i]) * r).toFixed(1) + d.parts[i + 1];
      d.t.setAttribute("d", s);
    },
  });

  const L = {
    C,
    rng(seed = 1) {
      let s = seed >>> 0 || 1;
      return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
    },

    h(tag, attrs = {}, parent, html) {
      const e = document.createElement(tag);
      for (const k in attrs) {
        if (k === "style" && typeof attrs[k] === "object") Object.assign(e.style, attrs[k]);
        else if (k === "class") e.className = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
      if (html != null) e.innerHTML = html;
      if (parent) parent.appendChild(e);
      return e;
    },
    s(tag, attrs = {}, parent, text) {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
      if (text != null) e.textContent = text;
      if (parent) parent.appendChild(e);
      return e;
    },
    svg(parent, attrs = {}) {
      return L.s("svg", Object.assign({ class: "full", viewBox: "0 0 1920 1080" }, attrs), parent);
    },
    /* Bloque de texto HTML posicionado */
    text(parent, html, style = {}, cls = "") {
      return L.h("div", { class: "abs " + cls, style }, parent, html);
    },

    fmt: {
      int: (x) => Math.round(x).toLocaleString("en-US"),
      d1: (x) => x.toFixed(1),
      d2: (x) => x.toFixed(2),
      d3: (x) => x.toFixed(3),
      pct1: (x) => x.toFixed(1) + "%",
      pctR: (x) => (+x.toFixed(1)).toString() + "%", // como R: 29% / 18.2%
    },

    /* Envuelve cada letra en <span class="ch"> (palabras sin cortar). Devuelve las letras. */
    splitChars(el, { cal = false } = {}) {
      const chars = [];
      const walk = (node) => {
        [...node.childNodes].forEach((n) => {
          if (n.nodeType === 3) {
            const frag = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach((w) => {
              if (!w) return;
              if (/^\s+$/.test(w)) { frag.appendChild(document.createTextNode(w)); return; }
              const word = L.h("span", { class: "word" });
              [...w].forEach((c) => {
                const sp = L.h("span", { class: "ch" }, word);
                sp.appendChild(document.createTextNode(c));
                if (cal) L.h("span", { class: "cal" }, sp).textContent = c;
                chars.push(sp);
              });
              frag.appendChild(word);
            });
            n.replaceWith(frag);
          } else if (n.nodeType === 1 && !n.classList.contains("num") && !n.classList.contains("ins")) walk(n);
          else if (n.nodeType === 1) chars.push(n);
        });
      };
      walk(el);
      return chars;
    },

    /* "Se escribe solo": cada letra se revela de izquierda a derecha como un trazo de pluma. */
    write(tl, el, { pos = ">", speed = 0.035, dur, ease = "power1.out" } = {}) {
      const chars = el._chars || (el._chars = L.splitChars(el));
      const each = dur ? dur / chars.length : speed;
      tl.fromTo(chars,
        { clipPath: "inset(-90% 100% -70% 0%)", opacity: 0, y: 3 },
        { clipPath: "inset(-90% -30% -70% 0%)", opacity: 1, y: 0, duration: 0.28, ease, stagger: each },
        pos);
      tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.01 }, "<");
      tl.set(chars, { clipPath: "none" }, ">" + (each * chars.length + 0.3));
      return tl;
    },

    /* Aparición simple */
    pop(tl, el, pos = ">", vars = {}) {
      return tl.fromTo(el, Object.assign({ autoAlpha: 0, y: 24 }, vars.from || {}),
        Object.assign({ autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, vars.to || {}), pos);
    },
    fadeOut(tl, el, pos = ">", d = 0.5) {
      return tl.to(el, { autoAlpha: 0, duration: d, ease: "power1.inOut" }, pos);
    },

    /* Contadores: cada <span class="num" data-to data-fmt data-from> del elemento */
    counts(tl, el, pos = "<", dur = 1.4) {
      const nums = el.classList && el.classList.contains("num") ? [el] : [...el.querySelectorAll(".num")];
      nums.forEach((n, i) => {
        const to = parseFloat(n.dataset.to);
        const fmt = n.dataset.fmt || "int";
        const from = parseFloat(n.dataset.from || 0);
        n.textContent = L.fmt[fmt](from);
        tl.to(n, { count: { from, to, fmt }, duration: dur, ease: "power2.out" }, i ? "<" : pos);
      });
      return tl;
    },
    num(to, fmt = "int", from = 0) {
      return `<span class="num" data-to="${to}" data-fmt="${fmt}" data-from="${from}">${L.fmt[fmt](to)}</span>`;
    },

    /* Trazo de tinta: anima stroke-dashoffset */
    draw(tl, paths, pos = ">", vars = {}) {
      const arr = paths.length != null && !(paths instanceof Element) ? [...paths] : [paths];
      arr.forEach((p) => {
        const len = Math.ceil(p.getTotalLength ? p.getTotalLength() : 1000) + 2;
        p.style.strokeDasharray = len + " " + len;
        p._len = len;
      });
      return tl.fromTo(arr, { strokeDashoffset: (i, t) => t._len, autoAlpha: 1 },
        Object.assign({ strokeDashoffset: 0, duration: 1, ease: "power1.inOut" }, vars), pos);
    },

    /* Mancha de acuarela: contorno irregular + filtro de desplazamiento */
    blobPath(cx, cy, rx, ry, rnd, n = 14, wob = 0.18) {
      const pts = [];
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2;
        const k = 1 + (rnd() - 0.5) * 2 * wob;
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
      }
      return d3.line().curve(d3.curveCatmullRomClosed.alpha(0.5))(pts);
    },
    wash(parent, { cx, cy, rx, ry, color, opacity = 0.55, seed = 1, filter = "wc1", layers = 2 }) {
      const g = L.s("g", { class: "wash", filter: `url(#${filter})` }, parent);
      const r = L.rng(seed);
      for (let i = 0; i < layers; i++) {
        const k = 1 - i * 0.22;
        L.s("path", {
          d: L.blobPath(cx + (r() - 0.5) * rx * 0.15, cy + (r() - 0.5) * ry * 0.15, rx * k, ry * k, r),
          fill: color, opacity: i ? opacity * 0.6 : opacity,
        }, g);
      }
      return g;
    },
    /* Aparición de acuarela: florece desde el centro */
    bloom(tl, g, pos = ">", dur = 1.4) {
      return tl.fromTo(g, { scale: 0.3, autoAlpha: 0, transformOrigin: "50% 50%" },
        { scale: 1, autoAlpha: 1, duration: dur, ease: "power2.out" }, pos);
    },

    /* Rectángulo y línea "a mano" */
    roughRect(x, y, w, h, rnd = L.rng(7), j = 3) {
      const p = (a, b) => `${(a + (rnd() - 0.5) * j).toFixed(1)},${(b + (rnd() - 0.5) * j).toFixed(1)}`;
      return `M${p(x, y)} L${p(x + w * 0.5, y)} L${p(x + w, y)} L${p(x + w, y + h * 0.5)} L${p(x + w, y + h)} L${p(x + w * 0.5, y + h)} L${p(x, y + h)} L${p(x, y + h * 0.5)} Z`;
    },
    roughLine(x1, y1, x2, y2, rnd = L.rng(5), j = 2.5, seg = 4) {
      let d = `M${x1},${y1}`;
      for (let i = 1; i <= seg; i++) {
        const t = i / seg;
        const jj = i === seg ? 0 : j;
        d += ` L${(x1 + (x2 - x1) * t + (rnd() - 0.5) * jj).toFixed(1)},${(y1 + (y2 - y1) * t + (rnd() - 0.5) * jj).toFixed(1)}`;
      }
      return d;
    },
    /* Círculo dibujado a mano (elipse que no cierra exactamente) */
    handCircle(cx, cy, rx, ry, rnd = L.rng(9)) {
      const pts = [];
      const n = 26;
      for (let i = 0; i <= n + 3; i++) {
        const a = -2.2 + (i / n) * Math.PI * 2;
        const k = 1 + (rnd() - 0.5) * 0.07 + i * 0.004;
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
      }
      return d3.line().curve(d3.curveCatmullRom)(pts);
    },
    /* Flecha a mano: curva + punta */
    handArrow(parent, x1, y1, x2, y2, { bend = 0.25, color = C.ink, width = 3.5 } = {}) {
      const mx = (x1 + x2) / 2 - (y2 - y1) * bend, my = (y1 + y2) / 2 + (x2 - x1) * bend;
      const g = L.s("g", { fill: "none", stroke: color, "stroke-width": width, "stroke-linecap": "round", "stroke-linejoin": "round" }, parent);
      const body = L.s("path", { d: `M${x1},${y1} Q${mx},${my} ${x2},${y2}` }, g);
      const ang = Math.atan2(y2 - my, x2 - mx);
      const a1 = ang + 2.6, a2 = ang - 2.6, s = 18;
      const head = L.s("path", { d: `M${x2 + Math.cos(a1) * s},${y2 + Math.sin(a1) * s} L${x2},${y2} L${x2 + Math.cos(a2) * s},${y2 + Math.sin(a2) * s}` }, g);
      return { g, body, head };
    },
    arrowIn(tl, a, pos = ">", dur = 0.7) {
      L.draw(tl, a.body, pos, { duration: dur });
      L.draw(tl, a.head, ">-0.05", { duration: 0.2 });
      return tl;
    },

    /* Libro (rectángulo con lomo) */
    book(parent, { x = 0, y = 0, w = 40, h = 56, color = C.blueM, open = false, sw = 2.5 } = {}) {
      const g = L.s("g", { transform: `translate(${x},${y})` }, parent);
      if (!open) {
        L.s("rect", { x: 0, y: 0, width: w, height: h, rx: 3, fill: color, stroke: C.ink, "stroke-width": sw }, g);
        L.s("line", { x1: w * 0.18, y1: 2, x2: w * 0.18, y2: h - 2, stroke: C.ink, "stroke-width": sw * 0.7, opacity: 0.6 }, g);
      } else {
        L.s("path", { d: `M0,4 Q${w * 0.25},-2 ${w / 2},4 L${w / 2},${h} Q${w * 0.25},${h - 6} 0,${h} Z`, fill: "#fffdf8", stroke: C.ink, "stroke-width": sw }, g);
        L.s("path", { d: `M${w},4 Q${w * 0.75},-2 ${w / 2},4 L${w / 2},${h} Q${w * 0.75},${h - 6} ${w},${h} Z`, fill: "#fffdf8", stroke: C.ink, "stroke-width": sw }, g);
        for (let i = 1; i < 4; i++) {
          L.s("line", { x1: w * 0.08, x2: w * 0.42, y1: 4 + i * h / 5, y2: 4 + i * h / 5, stroke: C.ink2, "stroke-width": 1.2, opacity: 0.5 }, g);
          L.s("line", { x1: w * 0.58, x2: w * 0.92, y1: 4 + i * h / 5, y2: 4 + i * h / 5, stroke: C.ink2, "stroke-width": 1.2, opacity: 0.5 }, g);
        }
        L.s("rect", { x: -w * 0.06, y: h - 2, width: w * 1.12, height: 5, rx: 2, fill: color, stroke: C.ink, "stroke-width": sw * 0.8 }, g);
      }
      return g;
    },

    /* Marcador de acuarela detrás de una palabra (HTML) */
    marker(word, color = C.plum) {
      word.style.position = "relative";
      const m = L.h("span", {
        style: {
          position: "absolute", left: "-6%", right: "-6%", top: "50%", height: "48%", zIndex: 0, mixBlendMode: "multiply",
          background: color, opacity: 0.38, borderRadius: "40% 12% 46% 10% / 60% 30% 70% 30%",
          transformOrigin: "0 50%", transform: "scaleX(0) rotate(-1.5deg)", filter: "url(#wc2)",
        },
      }, word);
      return m;
    },

    /* Textura de papel generada una vez en un canvas */
    makeGrain() {
      const c = document.createElement("canvas");
      c.width = c.height = 256;
      const x = c.getContext("2d");
      const img = x.createImageData(256, 256);
      const r = L.rng(42);
      for (let i = 0; i < img.data.length; i += 4) {
        const v = 200 + r() * 55;
        img.data[i] = v; img.data[i + 1] = v * 0.97; img.data[i + 2] = v * 0.9;
        img.data[i + 3] = r() < 0.5 ? 10 : 18;
      }
      x.putImageData(img, 0, 0);
      for (let i = 0; i < 140; i++) { // fibras
        x.strokeStyle = `rgba(150,120,80,${0.04 + r() * 0.05})`;
        x.lineWidth = 0.6;
        x.beginPath();
        const px = r() * 256, py = r() * 256, a = r() * Math.PI;
        x.moveTo(px, py);
        x.lineTo(px + Math.cos(a) * (4 + r() * 10), py + Math.sin(a) * (4 + r() * 10));
        x.stroke();
      }
      document.documentElement.style.setProperty("--grain", `url(${c.toDataURL()})`);
    },

    /* Insight numerado: círculo morado con el número */
    ins(n) { return `<span class="ins">${n}</span>`; },
    /* Rótulo "Resultados" arriba del título de la página */
    kicker(parent, text = "Resultados") {
      return L.h("div", { class: "kicker" }, parent, text);
    },

    /* Encabezado de página */
    head(parent, text, sub) {
      const el = L.h("div", { class: "page-head" }, parent, text);
      if (sub) L.h("div", { class: "page-sub", style: { marginTop: "10px" } }, el, sub);
      return el;
    },
  };

  window.L = L;
  // registro de diapositivas (el motor en main.js lo completa)
  window.Deck = { defs: [], add(def) { this.defs.push(def); } };
})();
