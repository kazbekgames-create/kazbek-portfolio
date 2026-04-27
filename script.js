const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function setYear() {
  const el = $("#year");
  if (el) el.textContent = String(new Date().getFullYear());
}

function setupMobileMenu() {
  const toggle = $(".nav-toggle");
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

  // Close on link click (mobile)
  $$(".nav-link", menu).forEach((a) => {
    a.addEventListener("click", () => setOpen(false));
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    if (!isOpen) return;
    const t = e.target;
    if (!(t instanceof Element)) return;
    if (toggle.contains(t) || menu.contains(t)) return;
    setOpen(false);
  });

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    setOpen(false);
  });
}

function setupRevealOnScroll() {
  const items = $$(".reveal");
  if (!items.length) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) {
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
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((el) => io.observe(el));
}

function setupContactCTA() {
  const cta = $('[data-scroll="contacts"]');
  const grid = $(".contacts-grid");
  if (!cta || !grid) return;

  cta.addEventListener("click", () => {
    // After smooth scroll, pulse contacts a bit
    window.setTimeout(() => {
      grid.classList.add("is-pulse");
      window.setTimeout(() => grid.classList.remove("is-pulse"), 950);
    }, 450);
  });
}

function setupCursorGlow() {
  const glow = $(".cursor-glow");
  if (!glow) return;

  const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  if (prefersReduced) return;

  let raf = 0;
  let x = 0;
  let y = 0;

  const onMove = (e) => {
    x = (e.clientX / window.innerWidth) * 100;
    y = (e.clientY / window.innerHeight) * 100;
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      glow.style.setProperty("--x", `${x}%`);
      glow.style.setProperty("--y", `${y}%`);
      glow.style.opacity = "1";
      raf = 0;
    });
  };

  window.addEventListener("mousemove", onMove, { passive: true });
  window.addEventListener(
    "touchmove",
    (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      onMove({ clientX: t.clientX, clientY: t.clientY });
    },
    { passive: true }
  );
}

setYear();
setupMobileMenu();
setupRevealOnScroll();
setupContactCTA();
setupCursorGlow();

