console.log("[menu.js] loaded");

const btn = document.getElementById("menu-toggle");
const menu = document.getElementById("mobile-menu");

if (!btn || !menu) {
  console.warn("[menu.js] missing elements", { btn, menu });
} else {
  const setOpen = (open) => {
    menu.classList.toggle("is-open", open);
    menu.hidden = !open; // ← hidden運用なら必須（A方式ならあっても害なし）
    btn.setAttribute("aria-expanded", String(open));
  };

  btn.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    setOpen(open);
  });

  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a) return;
    setOpen(false);
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 636px)").matches) setOpen(false);
  });
}
