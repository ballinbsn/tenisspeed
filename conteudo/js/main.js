/**
 * Advertorial — Tênis Speed
 * JS mínimo, sem dependências. Cuida de:
 *  - aplicar PRODUCT_URL (config.js) em todos os CTAs
 *  - fallback elegante para imagens ausentes
 *  - eventos de tracking (dataLayer) prontos para GTM/GA4
 *  - CTA fixo (mobile) que aparece após o hero
 */
(function () {
  "use strict";

  var PRODUCT_URL = (window.SITE_CONFIG && window.SITE_CONFIG.PRODUCT_URL) || "#";

  /* ---------------- Repasse de UTM/click-id ----------------
     Preserva a origem do clique (utm_*, fbclid, gclid, ttclid) do
     anúncio até a página de produto, mesmo que o link de destino não
     tenha esses parâmetros configurados manualmente. */

  var TRACKED_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"];

  function appendTrackingParams(url) {
    var current = new URLSearchParams(window.location.search);
    var extra = new URLSearchParams();
    TRACKED_PARAMS.forEach(function (k) {
      if (current.has(k)) extra.set(k, current.get(k));
    });
    var query = extra.toString();
    if (!query) return url;
    return url + (url.indexOf("?") > -1 ? "&" : "?") + query;
  }

  /* ---------------- Tracking ---------------- */

  window.dataLayer = window.dataLayer || [];

  function trackEvent(eventName, payload) {
    var data = Object.assign({ event: eventName }, payload || {});
    window.dataLayer.push(data);
    if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
      console.info("[tracking]", data);
    }
  }

  /* ---------------- Imagens: fallback de placeholder ---------------- */

  function initMediaFallbacks() {
    var slots = document.querySelectorAll(".media-slot img[data-media-check]");
    slots.forEach(function (img) {
      function markMissing() {
        var slot = img.closest(".media-slot");
        if (slot) slot.classList.add("img-missing");
        img.style.display = "none";
      }
      if (img.complete) {
        if (!img.naturalWidth) markMissing();
      } else {
        img.addEventListener("error", markMissing);
      }
    });
  }

  /* ---------------- CTAs: URL central + tracking ---------------- */

  function initCtas() {
    var ctas = document.querySelectorAll("[data-cta]");
    var trackedUrl = appendTrackingParams(PRODUCT_URL);
    ctas.forEach(function (el) {
      el.setAttribute("href", trackedUrl);
      el.addEventListener("click", function () {
        var label = el.getAttribute("data-cta-label") || "cta";
        trackEvent("cta_click", { cta_label: label });
        trackEvent("product_page_click", { destination: trackedUrl, cta_label: label });
      });
    });
  }

  /* ---------------- Sticky mobile CTA ---------------- */

  function initStickyCta() {
    var sticky = document.querySelector(".sticky-cta");
    var trigger = document.querySelector("[data-sticky-trigger]");
    if (!sticky || !trigger) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          sticky.classList.toggle("is-visible", !entry.isIntersecting && entry.boundingClientRect.top < 0);
        });
      },
      { threshold: 0 }
    );
    observer.observe(trigger);
  }

  /* ---------------- Scroll depth ---------------- */

  function initScrollTracking() {
    var fired = { 25: false, 50: false, 75: false };

    function onScroll() {
      var scrollTop = window.scrollY || document.documentElement.scrollTop;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      var pct = (scrollTop / docHeight) * 100;

      [25, 50, 75].forEach(function (mark) {
        if (!fired[mark] && pct >= mark) {
          fired[mark] = true;
          trackEvent("scroll_" + mark, { percent: mark });
        }
      });
    }

    var ticking = false;
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(function () {
            onScroll();
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  /* ---------------- Init ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initMediaFallbacks();
    initCtas();
    initStickyCta();
    initScrollTracking();
    trackEvent("advertorial_view", { path: window.location.pathname });
  });
})();
