/* Transiciones entre páginas del "libro". Cada una devuelve { tl, cleanup }. */
(function () {
  const { C } = L;

  const Transitions = {
    /* Vuelta de hoja: la página gira sobre su borde izquierdo con sombra y curvatura */
    pageTurn(from, to, fx) {
      const shade = L.h("div", { style: { position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none", opacity: 0, background: "linear-gradient(90deg, rgba(60,40,20,.05), rgba(60,40,20,.35) 70%, rgba(255,255,255,.25))" } }, from);
      const cast = L.h("div", { style: { position: "absolute", inset: 0, zIndex: 60, pointerEvents: "none", background: "linear-gradient(90deg, rgba(60,40,20,.35), rgba(60,40,20,0) 60%)" } }, to);
      gsap.set(from, { zIndex: 5, transformOrigin: "0% 50%" });
      gsap.set(to, { zIndex: 1 });
      const tl = gsap.timeline();
      tl.to(from, { rotationY: -96, skewY: -1.5, duration: 1.15, ease: "power2.in" }, 0)
        .to(shade, { opacity: 1, duration: 1.15, ease: "power1.in" }, 0)
        .fromTo(cast, { opacity: 0.9 }, { opacity: 0, duration: 1.3, ease: "power1.out" }, 0.1);
      return { tl, cleanup() { shade.remove(); cast.remove(); } };
    },

    /* Gota de tinta que se extiende y se aclara revelando la siguiente página */
    inkSpread(from, to, fx, opt = {}) {
      const color = opt.color || C.plum;
      const svg = L.svg(fx, { style: "position:absolute;left:0;top:0" });
      const g = L.s("g", { filter: "url(#inkspread)" }, svg);
      const blobs = [];
      const r = L.rng(31);
      for (let i = 0; i < 5; i++) {
        blobs.push(L.s("path", { d: L.blobPath(960 + (r() - 0.5) * 400, 540 + (r() - 0.5) * 240, 260, 230, r, 16, 0.3), fill: i ? C.plumL : color, opacity: i ? 0.9 : 1 }, g));
      }
      gsap.set(to, { zIndex: 1, autoAlpha: 0 });
      gsap.set(from, { zIndex: 2 });
      const tl = gsap.timeline();
      tl.fromTo(blobs, { scale: 0, transformOrigin: "50% 50%" }, { scale: (i) => (i ? 5.2 : 2.6), duration: 1.0, ease: "power2.in", stagger: 0.06 }, 0)
        .to(from, { autoAlpha: 0, duration: 0.01 }, 0.95)
        .set(to, { autoAlpha: 1 }, 0.95)
        .to(blobs, { opacity: 0, duration: 0.8, ease: "power1.inOut", stagger: 0.04 }, 1.05);
      return { tl, cleanup() { svg.remove(); } };
    },

    /* Acuarelas que florecen sobre la página y se secan dejando la nueva */
    watercolor(from, to, fx, ctx) {
      const svg = L.svg(fx, { style: "position:absolute;left:0;top:0" });
      // la diapositiva destino puede pedir sus propios colores (p. ej. el color de su resultado)
      const cols = (ctx && ctx.to.def.washColors) || [C.blueL, C.amberL, C.plumL, C.blueM, C.amberM];
      const r = L.rng(77);
      const ws = [];
      for (let i = 0; i < 9; i++) {
        ws.push(L.wash(svg, { cx: 200 + r() * 1520, cy: 120 + r() * 840, rx: 380 + r() * 260, ry: 300 + r() * 220, color: cols[i % cols.length], opacity: 0.9, seed: i + 3, filter: i % 2 ? "wc1" : "wc2", layers: 1 }));
      }
      const veil = L.s("rect", { x: 0, y: 0, width: 1920, height: 1080, fill: C.paper, opacity: 0 }, svg);
      svg.insertBefore(veil, svg.firstChild);
      gsap.set(to, { zIndex: 1, autoAlpha: 0 });
      gsap.set(from, { zIndex: 2 });
      const tl = gsap.timeline();
      tl.fromTo(ws, { scale: 0.1, autoAlpha: 0, transformOrigin: "50% 50%" }, { scale: 1.25, autoAlpha: 1, duration: 0.9, ease: "power2.out", stagger: 0.05 }, 0)
        .to(veil, { opacity: 1, duration: 0.3 }, 0.6)
        .to(from, { autoAlpha: 0, duration: 0.01 }, 0.9)
        .set(to, { autoAlpha: 1 }, 0.9)
        .to(veil, { opacity: 0, duration: 0.01 }, 0.9)
        .to(ws, { autoAlpha: 0, scale: 1.4, duration: 0.9, ease: "power1.inOut", stagger: 0.03 }, 1.0);
      return { tl, cleanup() { svg.remove(); } };
    },
  };

  window.Transitions = Transitions;
})();
