/* Motor: escalado del escenario, pasos (builds), navegación, notas y cinta de progreso. */
(function () {
  const STAGE_W = 1920, STAGE_H = 1080;
  const stage = document.getElementById("stage");
  const slidesEl = document.getElementById("slides");
  const fx = document.getElementById("fx");
  const ribbonFill = document.querySelector("#ribbon .fill");
  const notesEl = document.getElementById("notes");

  function fit() {
    const s = Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H);
    const x = (window.innerWidth - STAGE_W * s) / 2, y = (window.innerHeight - STAGE_H * s) / 2;
    stage.style.left = "0"; stage.style.top = "0";
    stage.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
  }
  window.addEventListener("resize", fit);
  fit();

  /* Cada diapositiva construye UNA línea de tiempo. S.step() marca el inicio de un nuevo paso.
     Todo lo anterior al primer step() es la "entrada", que se reproduce al llegar a la diapositiva. */
  class Run {
    constructor(def, i) {
      this.def = def;
      this.i = i;
      this.el = L.h("section", { class: "slide" + (def.spread ? " spread" : ""), id: "s" + String(i + 1).padStart(2, "0") }, slidesEl);
      this.tl = gsap.timeline({ paused: true });
      this.B = [0];
      this.ambients = [];
      this.live = [];
      const S = {
        tl: this.tl,
        el: this.el,
        step: () => {
          this.tl.to({}, { duration: 0.02 });
          this.B.push(this.tl.duration());
          this.tl.to({}, { duration: 0.02 });
        },
        ambient: (fn) => this.ambients.push(fn),
        run: this,
      };
      def.build(this.el, S);
      this.B.push(Math.max(this.tl.duration(), this.B[this.B.length - 1] + 0.02));
    }
    get last() { return this.B.length - 1; }
    startAmbient() { this.stopAmbient(); this.live = this.ambients.map((f) => f()).flat().filter(Boolean); }
    stopAmbient() { this.live.forEach((t) => t.kill && t.kill()); this.live = []; }
  }

  const Deck = Object.assign(window.Deck, {
    runs: [],
    idx: 0,
    k: 0,
    anim: null,
    busy: null, // transición activa {tl, finish}

    build() {
      this.runs = this.defs.map((d, i) => new Run(d, i));
    },

    show(i, atEnd = false, playEntrance = true) {
      this.killAnim();
      this.runs.forEach((r, j) => { if (j !== i) { r.el.classList.remove("on"); r.stopAmbient(); } });
      const r = this.runs[i];
      this.idx = i;
      r.el.classList.add("on");
      gsap.set(r.el, { clearProps: "transform,opacity,visibility,zIndex,clipPath,filter" });
      r.startAmbient();
      if (atEnd) { r.tl.seek(r.B[r.last], true); this.k = r.last; }
      else {
        r.tl.seek(0, true); this.k = 0;
        if (playEntrance) this.playSeg();
      }
      this.update();
    },

    playSeg(startAt) {
      const r = this.runs[this.idx];
      if (this.k >= r.last) return false;
      const a = startAt != null ? startAt : r.B[this.k], b = r.B[this.k + 1];
      this.k++;
      r.tl.seek(a, true);
      this.anim = r.tl.tweenFromTo(a, b, { ease: "none" });
      this.update();
      return true;
    },

    killAnim() {
      if (this.busy) { const b = this.busy; this.busy = null; b.tl.progress(1); b.finish(); }
      if (this.anim) { this.anim.kill(); this.anim = null; }
    },

    next() {
      if (this.busy) { const b = this.busy; this.busy = null; b.tl.progress(1); b.finish(); return; }
      if (this.anim && this.anim.isActive()) { this.anim.progress(1); return; }
      const r = this.runs[this.idx];
      if (this.k < r.last) { this.playSeg(); return; }
      if (this.idx < this.runs.length - 1) this.transition(this.idx + 1);
    },

    prev() {
      if (this.busy) { this.killAnim(); }
      if (this.anim) { this.anim.kill(); this.anim = null; }
      const r = this.runs[this.idx];
      if (this.k > 1) {
        this.k--;
        r.tl.seek(r.B[this.k], true);
        this.update();
      } else if (this.idx > 0) {
        this.show(this.idx - 1, true);
      } else {
        r.tl.seek(r.B[Math.min(1, r.last)], true);
      }
    },

    replay() { this.show(this.idx, false); },

    transition(j) {
      this.killAnim();
      const from = this.runs[this.idx], to = this.runs[j];
      to.tl.seek(0, true);
      to.el.classList.add("on");
      to.startAmbient();
      const make = from.def.out || Transitions[to.def.transition || "pageTurn"] || Transitions.pageTurn;
      const tr = make(from.el, to.el, fx, { from, to });
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        this.busy = null;
        tr.cleanup && tr.cleanup();
        from.el.classList.remove("on");
        from.stopAmbient();
        gsap.set([from.el, to.el], { clearProps: "transform,opacity,visibility,zIndex,clipPath,filter" });
        this.idx = j;
        this.k = 0;
        this.playSeg(tr.entranceFrom); // la transición puede haber adelantado la entrada
      };
      tr.tl.eventCallback("onComplete", finish);
      this.busy = { tl: tr.tl, finish };
      this.idx = j; this.k = 0; this.update(); this.idx = from.i;
    },

    update() {
      const r = this.runs[this.idx];
      const n = this.runs.length;
      const frac = (this.idx + (r.last ? this.k / r.last : 1)) / n;
      gsap.to(ribbonFill, { scaleY: frac, duration: 0.6, ease: "power2.out", overwrite: true });
      document.getElementById("pageno").textContent = `${this.idx + 1} / ${n}`;
      document.getElementById("fsbtn").classList.toggle("show", this.idx === 0);
      // color del resultado: cinta, número de hoja, rótulos e insights
      stage.style.setProperty("--accent", r.def.accent || "#7A4E8C");
      stage.style.setProperty("--pageno", r.def.accent || "#6B6875");
      notesEl.querySelector(".meta").textContent = `Diapositiva ${this.idx + 1} de ${n} · paso ${this.k} de ${r.last}`;
      notesEl.querySelector(".txt").textContent = r.def.notes || "";
      try { history.replaceState(null, "", `#${this.idx + 1}.${this.k}`); } catch (e) { /* file:// */ }
    },

    goto(i, step) {
      if (i < 0 || i >= this.runs.length) return;
      if (step == null) { this.show(i, false); return; }
      this.show(i, false, false);
      const r = this.runs[i];
      this.k = Math.max(0, Math.min(step, r.last));
      r.tl.seek(r.B[this.k], true);
      this.update();
    },
  });

  function toggleFullscreen() {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
    else document.exitFullscreen && document.exitFullscreen();
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === " " || k === "ArrowRight" || k === "PageDown" || k === "Enter" || k === "ArrowDown") { e.preventDefault(); Deck.next(); }
    else if (k === "ArrowLeft" || k === "Backspace" || k === "PageUp" || k === "ArrowUp") { e.preventDefault(); Deck.prev(); }
    else if (k === "f" || k === "F") toggleFullscreen();
    else if (k === "r" || k === "R") Deck.replay();
    else if (k === "n" || k === "N") notesEl.classList.toggle("show");
    else if (/^[0-9]$/.test(k)) { const n = k === "0" ? 10 : +k; Deck.goto(n - 1); }
  }

  async function start() {
    L.makeGrain();
    const faces = ["600 50px Fraunces", "700 50px Fraunces", "italic 400 40px Fraunces", "400 30px Nunito", "700 30px Nunito",
      "600 30px Nunito", "800 30px Nunito", "400 30px Caveat", "700 30px Caveat", '400 40px "Pinyon Script"'];
    try {
      await Promise.race([
        Promise.all(faces.map((f) => document.fonts.load(f, "Aáñ¿"))),
        new Promise((r) => setTimeout(r, 4000)),
      ]);
    } catch (e) { /* sigue con fuentes del sistema */ }
    Deck.build();
    document.getElementById("loading").remove();
    document.addEventListener("keydown", onKey);
    const fsbtn = document.getElementById("fsbtn");
    fsbtn.addEventListener("click", (e) => { e.stopPropagation(); fsbtn.blur(); toggleFullscreen(); });
    document.addEventListener("fullscreenchange", () => {
      fsbtn.querySelector("span").textContent = document.fullscreenElement ? "Salir de pantalla completa" : "Pantalla completa";
    });
    const m = /^#(\d+)(?:\.(\d+))?/.exec(location.hash);
    if (m) Deck.goto(+m[1] - 1, m[2] != null ? +m[2] : undefined);
    else Deck.show(0);
  }
  start();
})();
