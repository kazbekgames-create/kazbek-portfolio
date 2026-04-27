const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const prefersReducedMotion = () =>
  Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);

function setYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const toggle = $(".nav__toggle");
  const menu = $("#nav-menu");
  if (!toggle || !menu) return;

  const setOpen = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.classList.toggle("is-open", open);
  };

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    setOpen(!open);
  });

  $$(".nav__link", menu).forEach((a) => a.addEventListener("click", () => setOpen(false)));

  document.addEventListener("click", (e) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (toggle.contains(t) || menu.contains(t)) return;
    setOpen(false);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
}

function setupRevealOnScroll() {
  const items = $$(".reveal");
  if (!items.length) return;

  if (prefersReducedMotion()) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    { threshold: 0.14, rootMargin: "0px 0px -12% 0px" }
  );

  items.forEach((el) => io.observe(el));
}

function setupCursorGlow() {
  const glow = $(".cursor-glow");
  if (!glow) return;
  if (prefersReducedMotion()) return;

  let raf = 0;
  let x = 50;
  let y = 20;

  const update = () => {
    glow.style.setProperty("--x", `${x}%`);
    glow.style.setProperty("--y", `${y}%`);
    glow.style.opacity = "1";
    raf = 0;
  };

  const onMove = (clientX, clientY) => {
    x = (clientX / window.innerWidth) * 100;
    y = (clientY / window.innerHeight) * 100;
    if (raf) return;
    raf = window.requestAnimationFrame(update);
  };

  window.addEventListener(
    "mousemove",
    (e) => {
      onMove(e.clientX, e.clientY);
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      onMove(t.clientX, t.clientY);
    },
    { passive: true }
  );
}

function setupProjectShine() {
  const cards = $$(".project");
  if (!cards.length) return;
  if (prefersReducedMotion()) return;

  for (const card of cards) {
    card.addEventListener(
      "pointermove",
      (e) => {
        const rect = card.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
      },
      { passive: true }
    );
  }
}

function setupTilt() {
  const els = $$("[data-tilt]");
  if (!els.length) return;
  if (prefersReducedMotion()) return;

  const max = 7; // degrees
  const perspective = 900;

  for (const el of els) {
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rx = (py - 0.5) * -2 * max;
      const ry = (px - 0.5) * 2 * max;
      el.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(
        2
      )}deg) rotateY(${ry.toFixed(2)}deg) translateZ(0)`;
    };

    const reset = () => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) translateZ(0)`;
    };

    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", reset);
    el.addEventListener("blur", reset);
  }
}

function setupCTA() {
  const cta = $('[data-cta="contact"]');
  const contact = $("#contact");
  if (!cta || !contact) return;

  cta.addEventListener("click", () => {
    window.setTimeout(() => {
      contact.animate(
        [
          { transform: "translateY(0)", filter: "brightness(1)" },
          { transform: "translateY(-2px)", filter: "brightness(1.08)" },
          { transform: "translateY(0)", filter: "brightness(1)" },
        ],
        { duration: 520, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)" }
      );
    }, 280);
  });
}

setYear();
setupMobileMenu();
setupRevealOnScroll();
setupCursorGlow();
setupProjectShine();
setupTilt();
setupCTA();

