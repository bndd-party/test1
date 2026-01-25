document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".search-toggle");
  const form   = document.querySelector(".header-search");
  const input  = form?.querySelector("input, [type='search']");

  // --- Search UI ---
  if (header && toggle && form) {
    const open = () => {
      header.classList.add("is-search-open");
      toggle.setAttribute("aria-expanded", "true");
      setTimeout(() => input?.focus(), 50);
    };

    const close = () => {
      header.classList.remove("is-search-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      header.classList.contains("is-search-open") ? close() : open();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    document.addEventListener("click", (e) => {
      const t = e.target;
      if (!(t instanceof Element)) return;
      if (!header.classList.contains("is-search-open")) return;
      if (header.contains(t)) return;
      close();
    });
  }

  // --- Brand width sync + title letter-spacing（測定時だけ max-content）---
  const link    = document.querySelector(".site-header .site-brand a");
  const title   = document.querySelector(".site-header .site-title");
  const tagline = document.querySelector(".site-header .site-tagline");

  if (!link || !title || !tagline) return;

  const syncBrandWidth = () => {
    // リセット
    link.style.setProperty("--brand-w", "max-content");
    title.style.setProperty("--title-track", "0px");

    // 測定用に一瞬だけ自然幅へ
    const prevTitleW = title.style.width;
    const prevTagW   = tagline.style.width;

    title.style.width = "max-content";
    tagline.style.width = "max-content";

    const wTitle = Math.ceil(title.getBoundingClientRect().width);
    const wTag   = Math.ceil(tagline.getBoundingClientRect().width);

    // 元に戻す
    title.style.width = prevTitleW;
    tagline.style.width = prevTagW;

    const w = Math.max(wTitle, wTag);
    link.style.setProperty("--brand-w", `${w}px`);

    // タイトルを letter-spacing で伸ばす
    const text = (title.textContent || "").trim();
    const gaps = Math.max(1, text.length - 1);

    const extra = Math.max(0, w - wTitle);
    const track = extra / gaps;

    // 伸びすぎ防止（必要なら 1.8 とかに下げてOK）
    const capped = Math.min(track, 2.5);
    title.style.setProperty("--title-track", `${capped}px`);
  };

  // 初回（フォント適用後のズレ対策で2回）
  requestAnimationFrame(() => {
    syncBrandWidth();
    requestAnimationFrame(syncBrandWidth);
  });

  // リサイズ追従
  window.addEventListener("resize", syncBrandWidth);

  // ResizeObserver
  if ("ResizeObserver" in window) {
    const ro = new ResizeObserver(() => syncBrandWidth());
    ro.observe(title);
    ro.observe(tagline);
  }
});
