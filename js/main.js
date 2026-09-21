/**
 * Landing Page — Tênis Speed
 * Depende de js/config.js (carregado antes deste arquivo).
 */
(function () {
  "use strict";

  var state = {
    pair1: { color: null, size: null },
    pair2: { color: null, size: null },
    hasInteracted: false,
    galleryIndex: 0,
    galleryList: GALLERY_IMAGES,
  };

  /* ---------------- Media fallback (imagens ausentes) ---------------- */

  function initMediaFallbacks(root) {
    var imgs = (root || document).querySelectorAll("[data-media-check]");
    imgs.forEach(function (img) {
      function markMissing() {
        var wrap = img.closest(".media");
        if (wrap) wrap.classList.add("img-missing");
      }
      if (img.complete) {
        if (!img.naturalWidth) markMissing();
      } else {
        img.addEventListener("error", markMissing);
      }
    });
  }

  /* ---------------- Galeria ---------------- */

  function renderGallery() {
    var thumbsWrap = document.getElementById("gallery-thumbs");
    if (!thumbsWrap) return;

    thumbsWrap.innerHTML = "";
    state.galleryList.forEach(function (item, i) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "gallery-thumb" + (i === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", "Ver foto " + (i + 1));
      btn.innerHTML =
        '<span class="media"><img data-media-check src="' +
        item.src +
        '" alt="' +
        item.alt +
        '" loading="lazy"><span class="media-placeholder"><span class="ph-icon">🖼️</span></span></span>';
      btn.addEventListener("click", function () {
        setGalleryIndex(i);
      });
      thumbsWrap.appendChild(btn);
    });

    initMediaFallbacks(thumbsWrap);
    setGalleryIndex(0);
  }

  function setGalleryIndex(i) {
    var count = state.galleryList.length;
    state.galleryIndex = (i + count) % count;
    var item = state.galleryList[state.galleryIndex];

    var mainImg = document.getElementById("gallery-main-img");
    var mainWrap = document.getElementById("gallery-main-wrap");
    mainWrap.classList.remove("img-missing");
    mainImg.onerror = function () {
      mainWrap.classList.add("img-missing");
    };
    mainImg.onload = function () {
      mainWrap.classList.remove("img-missing");
    };
    mainImg.src = item.src;
    mainImg.alt = item.alt;

    document.querySelectorAll(".gallery-thumb").forEach(function (thumb, idx) {
      thumb.classList.toggle("is-active", idx === state.galleryIndex);
    });
  }

  function initGalleryArrows() {
    var prev = document.getElementById("gallery-prev");
    var next = document.getElementById("gallery-next");
    if (prev) prev.addEventListener("click", function () { setGalleryIndex(state.galleryIndex - 1); });
    if (next) next.addEventListener("click", function () { setGalleryIndex(state.galleryIndex + 1); });
  }

  /**
   * Ajuda visual: ao escolher a cor do Par 1, a galeria passa a mostrar as
   * fotos dessa variante primeiro. Não afeta a seleção do Par 2 de nenhuma forma.
   */
  function updateGalleryForColor(colorId) {
    var paths = PRODUCT_IMAGES[colorId];
    if (!paths || !paths.length) return;
    var label = colorLabel(colorId);
    state.galleryList = paths.map(function (src, i) {
      return { src: src, alt: "Tênis SPEED " + label + " — foto " + (i + 1) };
    });
    renderGallery();
  }

  /**
   * Ao carregar a página, o Branco/Turquesa já vem marcado como cor do
   * Par 1 e a galeria abre só com as fotos dessa cor — clicar em outra cor
   * troca a galeria normalmente (mesmo caminho de updateGalleryForColor).
   * Não conta como interação real (não mostra o sticky CTA nem exige
   * escolher o tamanho antes da hora) — isso só acontece com um clique de
   * verdade, via selectColor().
   */
  function preselectDefaultColor() {
    var defaultColorId = "branco-turquesa";
    var hasPhotos = PRODUCT_IMAGES[defaultColorId] && PRODUCT_IMAGES[defaultColorId].length;

    if (!hasPhotos) {
      renderGallery();
      return;
    }

    state.pair1.color = defaultColorId;

    var wrap = document.getElementById("colors-pair1");
    var btn = wrap ? wrap.querySelector('[data-color-id="' + defaultColorId + '"]') : null;
    if (btn) {
      btn.classList.add("is-selected");
      btn.setAttribute("aria-pressed", "true");
    }

    updateGalleryForColor(defaultColorId);
  }

  /* ---------------- Seletores de cor e tamanho (Par 1 e Par 2) ---------------- */

  function buildColorSwatch(colorOpt, pairKey) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "swatch-item";
    btn.setAttribute("data-color-id", colorOpt.id);
    btn.setAttribute("aria-pressed", "false");
    btn.title = colorOpt.label;
    btn.innerHTML =
      '<span class="swatch-media media">' +
      '<img data-media-check src="' + colorOpt.image + '" alt="Tênis Speed — ' + colorOpt.label + '" loading="lazy">' +
      '<span class="media-placeholder swatch-fallback" style="background:' + colorOpt.swatch + '"></span>' +
      "</span>" +
      '<span class="swatch-label">' + colorOpt.label + "</span>";

    btn.addEventListener("click", function () {
      selectColor(pairKey, colorOpt.id, btn);
    });
    return btn;
  }

  function renderColorOptions(pairKey) {
    var wrap = document.getElementById("colors-" + pairKey);
    if (!wrap) return;
    wrap.innerHTML = "";
    COLOR_OPTIONS.forEach(function (opt) {
      wrap.appendChild(buildColorSwatch(opt, pairKey));
    });
    initMediaFallbacks(wrap);
  }

  function selectColor(pairKey, colorId, btnEl) {
    state[pairKey].color = colorId;
    state.hasInteracted = true;

    var wrap = document.getElementById("colors-" + pairKey);
    wrap.querySelectorAll(".swatch-item").forEach(function (el) {
      var isSelected = el === btnEl;
      el.classList.toggle("is-selected", isSelected);
      el.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    if (pairKey === "pair1") updateGalleryForColor(colorId);

    updateSummary();
  }

  function renderSizeOptions(pairKey) {
    var wrap = document.getElementById("sizes-" + pairKey);
    if (!wrap) return;
    wrap.innerHTML = "";

    if (!AVAILABLE_SIZES.length) {
      var note = document.createElement("p");
      note.className = "size-empty-note";
      note.textContent = "Tamanhos serão adicionados em breve.";
      wrap.appendChild(note);
      return;
    }

    AVAILABLE_SIZES.forEach(function (size) {
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "size-option";
      btn.textContent = size;
      btn.setAttribute("aria-pressed", "false");
      btn.addEventListener("click", function () {
        selectSize(pairKey, size, btn);
      });
      wrap.appendChild(btn);
    });
  }

  function selectSize(pairKey, size, btnEl) {
    state[pairKey].size = size;
    state.hasInteracted = true;

    var wrap = document.getElementById("sizes-" + pairKey);
    wrap.querySelectorAll(".size-option").forEach(function (el) {
      var isSelected = el === btnEl;
      el.classList.toggle("is-selected", isSelected);
      el.setAttribute("aria-pressed", isSelected ? "true" : "false");
    });

    updateSummary();
  }

  function colorLabel(colorId) {
    var found = COLOR_OPTIONS.find(function (c) { return c.id === colorId; });
    return found ? found.label : colorId;
  }

  function pairIsComplete(pair) {
    return !!(pair.color && pair.size);
  }

  /* ---------------- Resumo (dentro do card de oferta) + CTA ---------------- */

  function isComplete() {
    return pairIsComplete(state.pair1) && pairIsComplete(state.pair2);
  }

  function updateSummary() {
    var p1Done = pairIsComplete(state.pair1);
    var p2Done = pairIsComplete(state.pair2);
    var statusEl = document.getElementById("offer-status");

    if (p1Done && p2Done) {
      statusEl.innerHTML =
        '<p class="offer-status-line">Par 1 — ' + colorLabel(state.pair1.color) + " · " + state.pair1.size + "</p>" +
        '<p class="offer-status-line">Par 2 — ' + colorLabel(state.pair2.color) + " · " + state.pair2.size + "</p>";
    } else if (p1Done && !p2Done) {
      statusEl.innerHTML = '<p class="offer-status-pending">Agora configure o Par 2.</p>';
    } else if (!p1Done && p2Done) {
      statusEl.innerHTML = '<p class="offer-status-pending">Agora configure o Par 1.</p>';
    } else {
      statusEl.innerHTML = '<p class="offer-status-pending">Selecione a cor e o tamanho dos dois pares.</p>';
    }

    var complete = p1Done && p2Done;
    var ctaMain = document.getElementById("cta-main");
    var ctaSticky = document.getElementById("cta-sticky");
    [ctaMain, ctaSticky].forEach(function (btn) {
      if (!btn) return;
      btn.disabled = !complete;
    });

    updateStickyVisibility();
  }

  function updateStickyVisibility() {
    var sticky = document.getElementById("sticky-cta");
    if (!sticky) return;
    sticky.classList.toggle("is-visible", state.hasInteracted);
  }

  /* Origem do clique (utm_*, fbclid, gclid, ttclid) vai junto com o pedido
     pro backend, pra a venda poder ser atribuída à campanha. */
  var TRACKED_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"];
  function getTrackingParams() {
    var current = new URLSearchParams(window.location.search);
    var out = {};
    TRACKED_PARAMS.forEach(function (k) {
      if (current.has(k)) out[k] = current.get(k);
    });
    return out;
  }

  function initCtaClicks() {
    ["cta-main", "cta-sticky"].forEach(function (id) {
      var btn = document.getElementById(id);
      if (!btn) return;
      btn.addEventListener("click", function () {
        if (btn.disabled) return;
        var pairs = [state.pair1, state.pair2].map(function (p) {
          return { color: p.color, size: p.size };
        });
        var tracking = getTrackingParams();
        try {
          sessionStorage.setItem("speed_order", JSON.stringify({ pairs: pairs, tracking: tracking }));
        } catch (e) { /* o checkout também lê os pares pela URL */ }

        var query = new URLSearchParams(tracking);
        query.set("pairs", pairs.map(function (p) { return p.color + "." + p.size; }).join(","));
        window.location.href = "checkout.html?" + query.toString();
      });
    });
  }

  /* ---------------- Avaliações ---------------- */

  function initReviews() {
    var summaryWrap = document.getElementById("reviews-summary");
    var emptyWrap = document.getElementById("reviews-empty");
    var filterEmptyWrap = document.getElementById("reviews-filter-empty");
    var gridWrap = document.getElementById("reviews-grid");
    var moreBtn = document.getElementById("reviews-more");
    var distWrap = document.getElementById("reviews-distribution");
    var filterSelect = document.getElementById("reviews-filter-select");

    if (!REVIEWS.length) {
      summaryWrap.style.display = "none";
      emptyWrap.style.display = "block";
      filterEmptyWrap.style.display = "none";
      gridWrap.style.display = "none";
      moreBtn.style.display = "none";
      return;
    }

    summaryWrap.style.display = "grid";
    emptyWrap.style.display = "none";
    gridWrap.style.display = "grid";

    var avg = REVIEWS.reduce(function (sum, r) { return sum + (r.rating || 0); }, 0) / REVIEWS.length;
    document.getElementById("reviews-score").textContent = avg.toFixed(1).replace(".", ",");
    document.getElementById("reviews-stars").textContent = "★★★★★".slice(0, Math.round(avg)) + "☆☆☆☆☆".slice(0, 5 - Math.round(avg));
    document.getElementById("reviews-count").textContent = REVIEWS.length + (REVIEWS.length === 1 ? " avaliação" : " avaliações");

    /* ---- distribuição por nota (5 a 1 estrelas), calculada a partir de REVIEWS ---- */
    var counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    REVIEWS.forEach(function (r) {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    var maxCount = Math.max(counts[5], counts[4], counts[3], counts[2], counts[1], 1);
    distWrap.innerHTML = "";
    [5, 4, 3, 2, 1].forEach(function (n) {
      var row = document.createElement("div");
      row.className = "reviews-distribution-row";
      var pct = (counts[n] / maxCount) * 100;
      row.innerHTML =
        '<span class="reviews-distribution-label">' + n + '<span class="star">★</span></span>' +
        '<span class="reviews-distribution-track"><span class="reviews-distribution-fill" style="width:' + pct + '%"></span></span>' +
        '<span class="reviews-distribution-count">' + counts[n] + "</span>";
      distWrap.appendChild(row);
    });

    var activeRatingFilter = "todas";
    var shown = 0;

    function filteredReviews() {
      if (activeRatingFilter === "todas") return REVIEWS;
      var n = Number(activeRatingFilter);
      return REVIEWS.filter(function (r) { return r.rating === n; });
    }

    /* ---- lightbox das fotos do review (0, 1 ou várias por avaliação) ---- */
    var reviewLightbox = document.getElementById("review-lightbox");
    var reviewLightboxImg = document.getElementById("review-lightbox-img");
    var reviewLightboxClose = document.getElementById("review-lightbox-close");
    var reviewLightboxBackdrop = document.getElementById("review-lightbox-backdrop");
    var reviewLightboxPrev = document.getElementById("review-lightbox-prev");
    var reviewLightboxNext = document.getElementById("review-lightbox-next");
    var reviewLightboxPhotos = [];
    var reviewLightboxIndex = 0;

    function showReviewLightboxImage() {
      reviewLightboxImg.src = reviewLightboxPhotos[reviewLightboxIndex];
      reviewLightboxImg.alt = "Foto ampliada da avaliação";
    }

    function openReviewLightbox(photos, index) {
      reviewLightboxPhotos = photos;
      reviewLightboxIndex = index;
      showReviewLightboxImage();
      var hasMultiple = photos.length > 1;
      reviewLightboxPrev.style.display = hasMultiple ? "flex" : "none";
      reviewLightboxNext.style.display = hasMultiple ? "flex" : "none";
      reviewLightbox.classList.add("is-open");
      reviewLightbox.setAttribute("aria-hidden", "false");
    }

    function closeReviewLightbox() {
      reviewLightbox.classList.remove("is-open");
      reviewLightbox.setAttribute("aria-hidden", "true");
    }

    function stepReviewLightbox(dir) {
      if (!reviewLightboxPhotos.length) return;
      reviewLightboxIndex = (reviewLightboxIndex + dir + reviewLightboxPhotos.length) % reviewLightboxPhotos.length;
      showReviewLightboxImage();
    }

    if (reviewLightbox) {
      reviewLightboxClose.addEventListener("click", closeReviewLightbox);
      reviewLightboxBackdrop.addEventListener("click", closeReviewLightbox);
      reviewLightboxPrev.addEventListener("click", function () { stepReviewLightbox(-1); });
      reviewLightboxNext.addEventListener("click", function () { stepReviewLightbox(1); });
      document.addEventListener("keydown", function (e) {
        if (!reviewLightbox.classList.contains("is-open")) return;
        if (e.key === "Escape") closeReviewLightbox();
        if (e.key === "ArrowLeft") stepReviewLightbox(-1);
        if (e.key === "ArrowRight") stepReviewLightbox(1);
      });
    }

    function renderCard(r) {
      var card = document.createElement("div");
      card.className = "review-card";
      var photos = r.images || [];
      var photosHtml = photos.length
        ? '<div class="review-card-photos" style="grid-template-columns: repeat(' + photos.length + ', 1fr);">' +
          photos.map(function (src, i) {
            return '<div class="review-card-photo media"><img data-media-check data-photo-index="' + i + '" src="' + src + '" alt="Foto de ' + r.name + '" loading="lazy"><span class="media-placeholder"><span class="ph-icon">🖼️</span></span></div>';
          }).join("") +
          "</div>"
        : "";
      var stars = "★★★★★".slice(0, r.rating || 0) + "☆☆☆☆☆".slice(0, 5 - (r.rating || 0));
      card.innerHTML =
        photosHtml +
        '<div class="review-card-body">' +
        '<div class="review-stars">' + stars + "</div>" +
        '<div class="review-name">' + r.name + "</div>" +
        '<p class="review-text is-clamped">' + r.text + "</p>" +
        '<button type="button" class="review-more-btn" style="display:none;">Mostrar mais</button>' +
        "</div>";
      gridWrap.appendChild(card);
      initMediaFallbacks(card);

      if (photos.length && reviewLightbox) {
        card.querySelectorAll("[data-photo-index]").forEach(function (imgEl) {
          imgEl.addEventListener("click", function () {
            openReviewLightbox(photos, Number(imgEl.getAttribute("data-photo-index")));
          });
        });
      }

      var textEl = card.querySelector(".review-text");
      var moreBtnEl = card.querySelector(".review-more-btn");
      if (textEl.scrollHeight > textEl.clientHeight + 1) {
        moreBtnEl.style.display = "inline-block";
        moreBtnEl.addEventListener("click", function () {
          var isClamped = textEl.classList.toggle("is-clamped");
          moreBtnEl.textContent = isClamped ? "Mostrar mais" : "Mostrar menos";
        });
      }
    }

    function renderPage() {
      var list = filteredReviews();
      gridWrap.style.display = list.length ? "grid" : "none";
      filterEmptyWrap.style.display = list.length ? "none" : "block";
      var next = list.slice(shown, shown + REVIEWS_PAGE_SIZE);
      next.forEach(renderCard);
      shown += next.length;
      moreBtn.style.display = shown < list.length ? "block" : "none";
    }

    function resetGrid() {
      gridWrap.innerHTML = "";
      shown = 0;
      renderPage();
    }

    renderPage();
    moreBtn.addEventListener("click", renderPage);
    filterSelect.addEventListener("change", function () {
      activeRatingFilter = filterSelect.value;
      resetGrid();
    });
  }

  /* ---------------- Na vida real (galeria geral de vídeos, sem cor/filtro) ---------------- */

  function initReallife() {
    var gridWrap = document.getElementById("reallife-grid");
    if (!gridWrap) return;
    if (!REALLIFE_VIDEOS.length) return;

    gridWrap.innerHTML = "";
    REALLIFE_VIDEOS.forEach(function (v) {
      var card = document.createElement("div");
      card.className = "reallife-video-card";

      var posterAttr = v.poster ? ' poster="' + v.poster + '"' : "";
      var sourceHtml = v.src ? '<source src="' + v.src + '" type="video/mp4">' : "";
      var placeholderLabel = v.src || "vídeo ainda não enviado";

      card.innerHTML =
        '<div class="reallife-video-media media">' +
        '<video class="reallife-video" preload="metadata" playsinline' + posterAttr + ' aria-label="' + v.caption + '">' +
        sourceHtml +
        "</video>" +
        '<button type="button" class="reallife-video-play" aria-label="Reproduzir vídeo — ' + v.caption + '">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"></path></svg>' +
        "</button>" +
        '<span class="media-placeholder"><span class="ph-icon">🎬</span><span class="ph-label">' + placeholderLabel + '</span></span>' +
        "</div>" +
        '<p class="reallife-video-caption">' + v.caption + '</p>';

      var mediaEl = card.querySelector(".reallife-video-media");
      var video = card.querySelector(".reallife-video");
      var playBtn = card.querySelector(".reallife-video-play");

      if (!v.src) {
        /* Sem arquivo configurado ainda — mostra o placeholder direto,
           sem tentar tocar nada. */
        mediaEl.classList.add("img-missing");
      } else {
        function markMissing() {
          mediaEl.classList.add("img-missing");
        }

        function startPlayback() {
          if (mediaEl.classList.contains("img-missing")) return;
          card.classList.add("has-controls");
          video.controls = true;
          /* play() sem fonte válida às vezes nem resolve nem rejeita a
             Promise (fica pendurada) — por isso essa checagem roda
             independente do resultado da Promise, não só no .catch(). */
          video.play().catch(markMissing);
          setTimeout(function () {
            if (video.paused) return;
            if (video.error || video.networkState === 3 || video.readyState === 0) {
              markMissing();
            }
          }, 1200);
        }

        playBtn.addEventListener("click", function (e) {
          e.stopPropagation();
          startPlayback();
        });
        video.addEventListener("error", markMissing);
        video.addEventListener("ended", function () {
          video.currentTime = 0;
        });
      }

      gridWrap.appendChild(card);
    });
  }

  /* ---------------- Guia de tamanhos (modal) ---------------- */

  function initSizeGuide() {
    var modal = document.getElementById("size-guide-modal");
    var openBtn = document.getElementById("size-guide-open");
    var closeBtn = document.getElementById("size-guide-close");
    var backdrop = document.getElementById("size-guide-backdrop");
    if (!modal || !openBtn) return;

    function open() {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
    }

    /* mais de um botão pode abrir o mesmo modal (link perto da oferta +
       bloco "Escolha o tamanho ideal" antes da seção de vídeos) */
    var openTriggers = [openBtn].concat(
      Array.prototype.slice.call(document.querySelectorAll(".size-guide-open-trigger"))
    );
    openTriggers.forEach(function (btn) {
      btn.addEventListener("click", open);
    });
    closeBtn.addEventListener("click", close);
    backdrop.addEventListener("click", close);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  /* ---------------- Blocos pós-CTA: estoque / pagamento / frete / trocas ---------------- */

  function initTrustBlocks() {
    var stockText = document.getElementById("stock-card-text");
    var stockBar = document.getElementById("stock-card-bar");
    var stockFill = document.getElementById("stock-card-bar-fill");
    if (stockText) {
      if (typeof STOCK_QUANTITY === "number" && STOCK_QUANTITY > 0) {
        stockText.innerHTML = "Restam apenas <strong>" + STOCK_QUANTITY + "</strong> unidades disponíveis";
        if (stockBar) stockBar.style.display = "block";
        if (stockFill) stockFill.style.width = (STOCK_BAR_PERCENT || 12) + "%";
      } else {
        stockText.textContent = "Em estoque";
        if (stockBar) stockBar.style.display = "none";
      }
    }

    var paymentStrip = document.getElementById("payment-strip");
    var paymentList = document.getElementById("payment-strip-list");
    if (paymentStrip && paymentList && PAYMENT_METHODS.length) {
      paymentList.innerHTML = "";
      PAYMENT_METHODS.forEach(function (method) {
        var chip = document.createElement("span");
        chip.className = "payment-chip";
        chip.textContent = method.label;
        paymentList.appendChild(chip);
      });
      paymentStrip.style.display = "flex";
    }

    var shippingBold = document.getElementById("shipping-bold");
    var shippingNormal = document.getElementById("shipping-normal");
    var shippingHighlight = document.getElementById("shipping-highlight");
    if (shippingBold) shippingBold.textContent = SHIPPING_BOLD;
    if (shippingNormal) shippingNormal.textContent = SHIPPING_NORMAL;
    if (shippingHighlight) shippingHighlight.textContent = SHIPPING_HIGHLIGHT;

    var returnsTitle = document.getElementById("returns-title");
    var returnsLine1 = document.getElementById("returns-line1");
    var returnsLine2 = document.getElementById("returns-line2");
    if (returnsTitle) returnsTitle.textContent = RETURNS_TITLE;
    if (returnsLine1) returnsLine1.textContent = RETURNS_LINE_1;
    if (returnsLine2) returnsLine2.textContent = RETURNS_LINE_2;
  }

  /* ---------------- Selo de credibilidade ---------------- */

  function initTrustBadge() {
    var img = document.getElementById("trust-badge-img");
    if (!img || !TRUST_BADGE_IMAGE) return;
    img.src = TRUST_BADGE_IMAGE;
  }

  /* ---------------- Init ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    renderColorOptions("pair1");
    renderColorOptions("pair2");
    preselectDefaultColor();
    initGalleryArrows();
    renderSizeOptions("pair1");
    renderSizeOptions("pair2");
    initReviews();
    initReallife();
    initTrustBlocks();
    initTrustBadge();
    initCtaClicks();
    initSizeGuide();
    updateSummary();
    initMediaFallbacks(document);
  });
})();
