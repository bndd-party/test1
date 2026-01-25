let lastY = window.scrollY;
let ticking = false;

const header = document.querySelector(".site-header");

function updateHeader() {
  if (!header) return;

  const y = window.scrollY;

  // ① 下スクロールで隠す（ある程度進んでから）
  const shouldHide = y > lastY && y > 80;
  if (shouldHide) header.classList.add("is-hidden");
  else header.classList.remove("is-hidden");

  // ② スクロール量が一定を超えたら「縮む」
  const shouldCompact = y > 24;
  header.classList.toggle("is-compact", shouldCompact);

  lastY = y;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  },
  { passive: true }
);

// 初期状態も反映（リロード時にスクロール位置がある場合）
updateHeader();

const headerEl = document.querySelector(".site-header");
if (headerEl) {
  document.documentElement.style.setProperty("--header-h", `${headerEl.offsetHeight}px`);
}

window.addEventListener("load", () => {
  const headerEl = document.querySelector(".site-header");
  if (headerEl) {
    document.documentElement.style.setProperty("--header-h", `${headerEl.offsetHeight}px`);
  }
});
