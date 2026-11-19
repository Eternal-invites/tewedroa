/* ==========================================================
   ETHIOPIAN ORTHODOX BAPTISM INVITATION — script.js
   ========================================================== */

/* ================= EDIT HERE =================
   Set the baptism date & time for the countdown.
   Format: "YYYY-MM-DDTHH:MM:SS" (24-hour time).  */
const CONFIG = {
  baptismDate: "2026-11-21T00:00:00+03:00", // Nov 21, 2026 (ህዳር 12, 2019) — Addis Ababa time
};
/* ============================================== */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ==========================================================
   GOLD PARTICLES (opening overlay)
   ========================================================== */
(function particles() {
  const canvas = $("#particles");
  const ctx = canvas.getContext("2d");
  let W, H, dots = [], raf;

  function resize() {
    W = canvas.width = canvas.offsetWidth * devicePixelRatio;
    H = canvas.height = canvas.offsetHeight * devicePixelRatio;
  }
  resize();
  window.addEventListener("resize", resize);

  const COUNT = Math.min(60, Math.floor(innerWidth / 22));
  for (let i = 0; i < COUNT; i++) {
    dots.push({
      x: Math.random(), y: Math.random(),
      r: 1 + Math.random() * 2.4,
      vy: 0.15 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.12,
      a: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const d of dots) {
      d.y -= d.vy * 0.0009;
      d.x += d.vx * 0.0009;
      d.tw += 0.02;
      if (d.y < -0.02) { d.y = 1.02; d.x = Math.random(); }
      if (d.x < -0.02) d.x = 1.02;
      if (d.x > 1.02) d.x = -0.02;
      const alpha = d.a * (0.6 + 0.4 * Math.sin(d.tw));
      const r = d.r * devicePixelRatio;
      const g = ctx.createRadialGradient(d.x * W, d.y * H, 0, d.x * W, d.y * H, r * 3.4);
      g.addColorStop(0, `rgba(212,175,55,${alpha})`);
      g.addColorStop(1, "rgba(212,175,55,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, r * 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `rgba(240,223,168,${alpha})`;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  }

  if (!reduceMotion) draw();
  window.__stopParticles = () => cancelAnimationFrame(raf);
})();

/* ==========================================================
   OPENING → REVEAL
   ========================================================== */
(function opening() {
  const overlay = $("#opening");
  const main = $("#main");
  const btn = $("#openBtn");

  btn.addEventListener("click", () => {
    window.__playMusic && window.__playMusic();
    overlay.classList.add("opened");
    window.__stopParticles && window.__stopParticles();
    main.hidden = false;
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    setTimeout(() => {
      overlay.style.display = "none";
      document.body.style.overflow = "";
      initReveals();
    }, reduceMotion ? 50 : 1500);
  });
})();

/* ==========================================================
   SCROLL REVEAL
   ========================================================== */
let revealObserver;
function initReveals() {
  if (revealObserver) return;
  if (reduceMotion) {
    $$(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          e.target.style.transitionDelay = `${(i % 4) * 90}ms`;
          e.target.classList.add("visible");
          revealObserver.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  $$(".reveal").forEach((el) => revealObserver.observe(el));
}

/* ==========================================================
   COUNTDOWN
   ========================================================== */
(function countdown() {
  const target = new Date(CONFIG.baptismDate).getTime();
  const els = {
    d: $("#cdDays"), h: $("#cdHours"), m: $("#cdMins"), s: $("#cdSecs"),
  };
  const done = $("#countdownDone");
  const grid = $("#countdownGrid");

  function set(el, val) {
    const v = String(val).padStart(2, "0");
    if (el.textContent !== v) {
      el.textContent = v;
      el.classList.remove("tick");
      void el.offsetWidth;
      el.classList.add("tick");
    }
  }

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) {
      grid.hidden = true;
      done.hidden = false;
      clearInterval(timer);
      return;
    }
    set(els.d, Math.floor(diff / 864e5));
    set(els.h, Math.floor(diff / 36e5) % 24);
    set(els.m, Math.floor(diff / 6e4) % 60);
    set(els.s, Math.floor(diff / 1e3) % 60);
  }

  let timer = null;
  update();
  timer = setInterval(update, 1000);
})();

/* ==========================================================
   LIGHTBOX
   ========================================================== */
(function lightbox() {
  const box = $("#lightbox");
  const img = $("#lightboxImg");
  const close = $(".lightbox-close");
  const hint = $("#lightboxHint");

  function show(src, alt, withHint) {
    img.src = src;
    img.alt = alt;
    hint.hidden = !withHint;
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }
  window.__showImage = show;

  $$(".framed-photo img").forEach((el) => {
    el.closest("figure").addEventListener("click", () => show(el.src, el.alt, false));
  });

  function hide() {
    box.hidden = true;
    document.body.style.overflow = "";
  }
  close.addEventListener("click", hide);
  box.addEventListener("click", (e) => { if (e.target === box) hide(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) hide(); });
})();

/* ==========================================================
   MUSIC
   ========================================================== */
(function music() {
  const audio = $("#bgMusic");
  const btn = $("#musicBtn");

  function setState(playing) {
    btn.classList.toggle("playing", playing);
    btn.setAttribute("aria-label", playing ? "Pause background music" : "Play background music");
  }

  window.__playMusic = () =>
    audio.play().then(() => setState(true)).catch((err) => console.warn("Audio playback blocked:", err));

  btn.addEventListener("click", () => {
    if (audio.paused) window.__playMusic();
    else { audio.pause(); setState(false); }
  });
})();

/* ==========================================================
   THANK-YOU CARD — images/photo8.jpg
   iPhone / phones: share sheet -> "Save Image" (saves to Photos).
   If the share sheet is unavailable (e.g. Telegram's browser),
   show the card with a "press and hold -> Save to Photos" hint.
   Computers: direct download.
   ========================================================== */
(function thankYouCard() {
  const btn = $("#cardBtn");
  const name = btn.getAttribute("download");
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isTouch = matchMedia("(pointer: coarse)").matches;
  let file = null;

  // Pre-load so the share sheet opens instantly (iOS requires it to
  // open right after the tap).
  fetch(btn.href)
    .then((r) => (r.ok ? r.blob() : Promise.reject(r.status)))
    .then((b) => { file = new File([b], name, { type: b.type || "image/jpeg" }); })
    .catch(() => {});

  const showForSaving = () => window.__showImage(btn.href, "Thank you card", true);

  btn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (file && isTouch && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file] });
        return;
      } catch (err) {
        if (err.name === "AbortError") return;
      }
    }

    if (isIOS || isTouch || !file) return showForSaving();

    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  });
})();
