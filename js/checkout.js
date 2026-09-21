/**
 * Página de checkout (checkout.html) — Pix via backend api-tenis-speed.
 * Depende de js/config.js: API_URL, OFFER_TOTAL_LABEL, COLOR_OPTIONS,
 * PRODUCT_IMAGES, AVAILABLE_SIZES, SHIPPING_*, RETURNS_*, TRUST_BADGE_IMAGE.
 *
 * Etapas: 1 dados+entrega -> 2 Pix (QR + copia e cola, polling) -> 3 confirmação.
 * Recebe os pares escolhidos da loja via sessionStorage ("speed_order") ou,
 * como reserva, via URL (?pairs=preto.38,rosa.40).
 */
(function () {
  "use strict";

  var OFFER_VALUE = 149.9;
  var POLL_MS = 5000;
  var REQUEST_TIMEOUT_MS = 30000;
  var KEY_ORDER = "speed_order";
  var KEY_PIX = "speed_pix";
  var TRACKED = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid", "gclid", "ttclid"];
  var UFS = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

  var order = null; // { pairs: [{color,label,size}], tracking: {} }
  var pix = null; // { transactionId, qrCode, qrImage, expirationDate, email, firstName }
  var pollTimer = null;
  var expiresAt = 0;
  var busy = false;
  var lastZip = "";

  window.dataLayer = window.dataLayer || [];
  function track(event, extra) {
    window.dataLayer.push(Object.assign({ event: event }, extra || {}));
  }

  function $(id) { return document.getElementById(id); }
  function digits(v) { return String(v || "").replace(/\D/g, ""); }

  /* ---------------- Armazenamento (pode falhar em modo privado) ---------------- */

  function store(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* segue sem persistir */ }
  }
  function load(key) {
    try { return JSON.parse(sessionStorage.getItem(key)); } catch (e) { return null; }
  }
  function drop(key) {
    try { sessionStorage.removeItem(key); } catch (e) { /* noop */ }
  }

  /* ---------------- Pedido (pares escolhidos) ---------------- */

  function colorLabel(id) {
    var c = COLOR_OPTIONS.filter(function (o) { return o.id === id; })[0];
    return c ? c.label : null;
  }

  function normalizePairs(list) {
    if (!Array.isArray(list) || list.length !== 2) return null;
    var out = [];
    for (var i = 0; i < list.length; i++) {
      var label = list[i] && colorLabel(list[i].color);
      var size = Number(list[i] && list[i].size);
      if (!label || AVAILABLE_SIZES.indexOf(size) === -1) return null;
      out.push({ color: list[i].color, label: label, size: size });
    }
    return out;
  }

  function trackingFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var out = {};
    TRACKED.forEach(function (k) { if (params.has(k)) out[k] = params.get(k); });
    return out;
  }

  function readOrder() {
    var saved = load(KEY_ORDER);
    var pairs = saved && normalizePairs(saved.pairs);
    var tracking = (saved && saved.tracking) || {};

    if (!pairs) {
      var raw = new URLSearchParams(window.location.search).get("pairs");
      if (raw) {
        pairs = normalizePairs(
          raw.split(",").map(function (p) {
            var parts = p.split(".");
            return { color: parts[0], size: parts[1] };
          })
        );
      }
    }
    if (!pairs) return null;
    if (!Object.keys(tracking).length) tracking = trackingFromUrl();
    return { pairs: pairs, tracking: tracking };
  }

  /* ---------------- Resumo do pedido ---------------- */

  var comboOk = false;

  function comboSrc() {
    var file = COMBO_IMAGES[order.pairs[0].color + "|" + order.pairs[1].color];
    return file ? COMBO_IMAGE_DIR + file : null;
  }

  function comboAlt() {
    return "Tênis SPEED: par 1 " + order.pairs[0].label + " e par 2 " + order.pairs[1].label;
  }

  // Foto da combinação escolhida; se faltar/falhar, volta às miniaturas por cor.
  function applyCombo(wrapId, imgId) {
    var wrap = $(wrapId);
    var img = $(imgId);
    var src = comboSrc();
    if (!src) return false;
    img.onerror = function () {
      comboOk = false;
      wrap.hidden = true;
      $("co-combo-thumb").hidden = true;
      renderItems();
    };
    img.alt = comboAlt();
    img.src = src;
    wrap.hidden = false;
    return true;
  }

  function renderItems() {
    $("co-items").innerHTML = order.pairs.map(function (p, i) { return itemHtml(p, i, true, !comboOk); }).join("");
  }

  function itemHtml(pair, index, withNote, withThumb) {
    var imgs = PRODUCT_IMAGES[pair.color] || [];
    var img = withThumb && imgs[0] ? '<span class="co-item-img"><img src="' + imgs[0] + '" alt="" loading="lazy"><span class="co-item-qty">1</span></span>' : "";
    return (
      '<li class="co-item">' +
      img +
      '<span class="co-item-info"><span class="co-item-name">Tênis SPEED</span>' +
      '<span class="co-item-meta">Par ' + (index + 1) + " · " + pair.label + " · Tam. " + pair.size + "</span></span>" +
      (withNote ? '<span class="co-item-note">Na oferta</span>' : "") +
      "</li>"
    );
  }

  function renderSummary() {
    comboOk = applyCombo("co-combo", "co-combo-img");
    if (comboOk) {
      var thumb = $("co-combo-thumb");
      thumb.src = comboSrc();
      thumb.hidden = false;
    }
    renderItems();
    $("co-subtotal").textContent = OFFER_TOTAL_LABEL;
    $("co-total").textContent = OFFER_TOTAL_LABEL;
    $("co-total-mini").textContent = OFFER_TOTAL_LABEL;
    $("co-assure-ship").innerHTML =
      "<strong>" + SHIPPING_BOLD + "</strong> · " + SHIPPING_NORMAL + " " + SHIPPING_HIGHLIGHT + ", com entrega em 3 a 7 dias.";
    $("co-assure-return").innerHTML =
      "<strong>" + RETURNS_TITLE + "</strong> · " + RETURNS_LINE_1 + ". " + RETURNS_LINE_2;
    $("co-ship-note").textContent = SHIPPING_BOLD + " · " + SHIPPING_NORMAL + " " + SHIPPING_HIGHLIGHT + ".";
    $("co-submit-label").textContent = "Finalizar pedido · " + OFFER_TOTAL_LABEL;

    var badge = $("co-badge");
    if (TRUST_BADGE_IMAGE) {
      badge.onerror = function () { badge.hidden = true; };
      badge.src = TRUST_BADGE_IMAGE;
      badge.hidden = false;
    }
  }

  function toggleSummary() {
    var box = $("co-summary");
    var open = !box.classList.contains("is-open");
    box.classList.toggle("is-open", open);
    $("co-summary-toggle").setAttribute("aria-expanded", open ? "true" : "false");
  }

  /* ---------------- Etapas ---------------- */

  function setStep(n) {
    var steps = document.querySelectorAll(".co-step");
    Array.prototype.forEach.call(steps, function (el, i) {
      var num = i + 1;
      var done = num < n || n === 3;
      el.classList.toggle("is-done", done);
      el.classList.toggle("is-current", !done && num === n);
      el.querySelector(".co-step-dot").textContent = done ? "✓" : String(num);
    });
  }

  function show(which) {
    $("co-form").hidden = which !== "form";
    $("co-pix").hidden = which !== "pix";
    $("co-paid").hidden = which !== "paid";
    $("co-empty").hidden = which !== "empty";
    $("co-layout").classList.toggle("is-paid", which === "paid");
    $("co-layout").classList.toggle("is-empty", which === "empty");
    window.scrollTo(0, 0);
    var h = { form: "co-h1-form", pix: "co-h1-pix", paid: "co-h1-paid" }[which];
    if (h) $(h).focus({ preventScroll: true });
  }

  /* ---------------- Máscaras e validação ---------------- */

  function maskCpf(v) {
    return digits(v).slice(0, 11)
      .replace(/^(\d{3})(\d)/, "$1.$2")
      .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1-$2");
  }
  function maskPhone(v) {
    var d = digits(v).slice(0, 11);
    if (d.length <= 2) return d ? "(" + d : "";
    if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
    if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
    return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
  }
  function maskZip(v) {
    var d = digits(v).slice(0, 8);
    return d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
  }

  function validCpf(raw) {
    var cpf = digits(raw);
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    for (var t = 9; t < 11; t++) {
      var sum = 0;
      for (var i = 0; i < t; i++) sum += Number(cpf[i]) * (t + 1 - i);
      if (((sum * 10) % 11) % 10 !== Number(cpf[t])) return false;
    }
    return true;
  }

  var VALIDATORS = {
    name: function (v) {
      v = v.trim();
      return v.length >= 5 && v.split(/\s+/).length >= 2 ? "" : "Informe seu nome e sobrenome.";
    },
    email: function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Confira o e-mail digitado.";
    },
    phone: function (v) {
      var d = digits(v);
      return (d.length === 10 || d.length === 11) && /^[1-9][1-9]/.test(d) ? "" : "Informe o celular com DDD.";
    },
    cpf: function (v) { return validCpf(v) ? "" : "CPF inválido."; },
    zip: function (v) { return digits(v).length === 8 ? "" : "Informe o CEP com 8 números."; },
    street: function (v) { return v.trim() ? "" : "Informe a rua."; },
    number: function (v) { return v.trim() ? "" : "Informe o número."; },
    neighborhood: function (v) { return v.trim() ? "" : "Informe o bairro."; },
    city: function (v) { return v.trim() ? "" : "Informe a cidade."; },
    state: function (v) { return UFS.indexOf(v) > -1 ? "" : "Escolha o estado."; }
  };

  function paint(el, msg, touched) {
    var wrap = el.closest(".co-field");
    wrap.classList.toggle("has-error", !!msg);
    wrap.classList.toggle("is-valid", !msg && touched && !!el.value.trim());
    wrap.querySelector(".co-field-msg").textContent = msg || "";
    if (msg) el.setAttribute("aria-invalid", "true");
    else el.removeAttribute("aria-invalid");
  }

  function checkField(el, touched) {
    var fn = VALIDATORS[el.name];
    if (!fn) return "";
    var msg = fn(el.value);
    paint(el, msg, touched);
    return msg;
  }

  function validateAll() {
    var first = null;
    Object.keys(VALIDATORS).forEach(function (name) {
      var el = $("co-form").elements[name];
      if (checkField(el, true) && !first) first = el;
    });
    return first;
  }

  /* ---------------- CEP automático (ViaCEP) ---------------- */

  function lookupZip(zip) {
    if (zip === lastZip) return;
    lastZip = zip;
    var wrap = $("co-zip").closest(".co-field");
    wrap.classList.add("is-loading");
    fetch("https://viacep.com.br/ws/" + zip + "/json/")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (zip !== lastZip) return;
        if (!d || d.erro) {
          paint($("co-zip"), "CEP não encontrado. Confira ou preencha o endereço.", true);
          return;
        }
        var f = $("co-form").elements;
        if (d.logradouro) f.street.value = d.logradouro;
        if (d.bairro) f.neighborhood.value = d.bairro;
        if (d.localidade) f.city.value = d.localidade;
        if (d.uf && UFS.indexOf(d.uf) > -1) f.state.value = d.uf;
        ["zip", "street", "neighborhood", "city", "state"].forEach(function (n) { checkField(f[n], true); });
        (d.logradouro ? f.number : f.street).focus();
      })
      .catch(function () { /* sem conexão com o ViaCEP: o cliente preenche manualmente */ })
      .then(function () { wrap.classList.remove("is-loading"); });
  }

  /* ---------------- Envio do pedido ---------------- */

  function showBanner(msg) {
    var b = $("co-banner");
    b.textContent = msg || "";
    b.hidden = !msg;
  }

  function setBusy(on) {
    busy = on;
    var btn = $("co-submit");
    btn.disabled = on;
    btn.classList.toggle("is-loading", on);
    $("co-submit-label").textContent = on ? "Gerando seu Pix…" : "Finalizar pedido · " + OFFER_TOTAL_LABEL;
  }

  function buildPayload() {
    var f = $("co-form").elements;
    return {
      customer: {
        name: f.name.value.trim(),
        email: f.email.value.trim(),
        phone: digits(f.phone.value),
        cpf: digits(f.cpf.value),
        address: {
          zip: digits(f.zip.value),
          street: f.street.value.trim(),
          number: f.number.value.trim(),
          complement: f.complement.value.trim(),
          neighborhood: f.neighborhood.value.trim(),
          city: f.city.value.trim(),
          state: f.state.value
        }
      },
      pairs: order.pairs.map(function (p) { return { color: p.color, size: p.size }; }),
      tracking: order.tracking
    };
  }

  function onSubmit(e) {
    e.preventDefault();
    if (busy) return;
    showBanner("");

    var firstBad = validateAll();
    if (firstBad) {
      showBanner("Confira os campos destacados para continuar.");
      firstBad.scrollIntoView({ behavior: "smooth", block: "center" });
      firstBad.focus({ preventScroll: true });
      return;
    }

    setBusy(true);
    track("add_payment_info", { currency: "BRL", value: OFFER_VALUE, payment_type: "pix" });

    var payload = buildPayload();
    var ctrl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, REQUEST_TIMEOUT_MS);

    fetch(API_URL + "/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) {
        return r.json().catch(function () { return {}; }).then(function (body) { return { ok: r.ok, body: body }; });
      })
      .then(function (res) {
        if (!res.ok) throw new Error(res.body.error || "Não foi possível gerar o Pix agora. Tente novamente.");
        var saved = {
          transactionId: res.body.transactionId,
          qrCode: res.body.qrCode,
          qrImage: res.body.qrImage,
          expirationDate: res.body.expirationDate,
          email: payload.customer.email,
          firstName: payload.customer.name.split(/\s+/)[0]
        };
        store(KEY_PIX, saved);
        showPix(saved, false);
      })
      .catch(function (err) {
        var network = err instanceof TypeError || (err && err.name === "AbortError");
        showBanner(network ? "Não conseguimos conectar ao servidor de pagamento. Verifique sua internet e tente de novo." : err.message);
        $("co-banner").scrollIntoView({ behavior: "smooth", block: "center" });
      })
      .then(function () {
        clearTimeout(timer);
        setBusy(false);
      });
  }

  /* ---------------- Tela do Pix ---------------- */

  function showPix(p, resumed) {
    pix = p;
    var t = Date.parse(p.expirationDate);
    expiresAt = isNaN(t) ? Date.now() + 30 * 60 * 1000 : t;

    $("co-pix-amount").textContent = OFFER_TOTAL_LABEL;
    $("co-pix-valid").textContent =
      "Código válido até " + new Date(expiresAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) + ".";
    $("co-qr").src = p.qrImage;
    $("co-code").value = p.qrCode;
    $("co-copy").textContent = "Copiar código Pix";
    $("co-copy").disabled = false;
    $("co-wait").hidden = false;
    $("co-pix-note").hidden = false;
    $("co-expired").hidden = true;
    $("co-wait-text").textContent = "Aguardando a confirmação do pagamento…";

    setStep(2);
    show("pix");
    if (!resumed) track("pix_generated", { currency: "BRL", value: OFFER_VALUE, transaction_id: p.transactionId });

    stopPolling();
    if (resumed) poll();
    else pollTimer = setTimeout(poll, POLL_MS);
  }

  function stopPolling() {
    if (pollTimer) clearTimeout(pollTimer);
    pollTimer = null;
  }

  function poll() {
    stopPolling();
    if (!pix) return;
    if (Date.now() > expiresAt) return markExpired();
    var id = pix.transactionId;

    fetch(API_URL + "/api/pix/" + encodeURIComponent(id) + "/status")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (!pix || pix.transactionId !== id) return;
        if (d.status === "paid") return onPaid();
        if (d.status === "failed" || d.status === "expired" || d.status === "refunded") return markExpired();
        pollTimer = setTimeout(poll, POLL_MS);
      })
      .catch(function () {
        if (pix && pix.transactionId === id) pollTimer = setTimeout(poll, POLL_MS);
      });
  }

  function markExpired() {
    stopPolling();
    drop(KEY_PIX);
    $("co-wait").hidden = true;
    $("co-pix-note").hidden = true;
    $("co-copy").disabled = true;
    $("co-expired").hidden = false;
    pix = null;
  }

  function copyCode() {
    var input = $("co-code");
    var btn = $("co-copy");
    function done() {
      btn.textContent = "Código copiado!";
      setTimeout(function () { btn.textContent = "Copiar código Pix"; }, 2500);
    }
    function fallback() {
      input.select();
      input.setSelectionRange(0, input.value.length);
      try { document.execCommand("copy"); done(); } catch (e) { btn.textContent = "Selecione e copie o código acima"; }
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(input.value).then(done, fallback);
    } else {
      fallback();
    }
  }

  function newPix() {
    drop(KEY_PIX);
    pix = null;
    setStep(1);
    show("form");
  }

  /* ---------------- Confirmação ---------------- */

  function onPaid() {
    stopPolling();
    var p = pix;
    pix = null;
    drop(KEY_PIX);
    drop(KEY_ORDER);

    $("co-paid-lead").textContent = "Obrigado, " + p.firstName + "! Recebemos o seu pagamento via Pix.";
    $("co-paid-code").textContent = p.transactionId.slice(0, 8).toUpperCase();
    $("co-paid-total").textContent = OFFER_TOTAL_LABEL;
    $("co-paid-email").textContent = p.email;
    var paidCombo = comboOk && applyCombo("co-paid-combo", "co-paid-combo-img");
    $("co-paid-items").innerHTML = order.pairs.map(function (pair, i) { return itemHtml(pair, i, false, !paidCombo); }).join("");

    setStep(3);
    show("paid");

    var flag = "speed_purchase_" + p.transactionId;
    var already = false;
    try { already = !!sessionStorage.getItem(flag); sessionStorage.setItem(flag, "1"); } catch (e) { /* noop */ }
    if (!already) {
      track("purchase", {
        transaction_id: p.transactionId,
        currency: "BRL",
        value: OFFER_VALUE,
        shipping: 0,
        items: order.pairs.map(function (pair) {
          return { item_id: "speed-" + pair.color, item_name: "Tênis SPEED", item_variant: pair.label + " " + pair.size, price: OFFER_VALUE / 2, quantity: 1 };
        })
      });
    }
  }

  /* ---------------- Init ---------------- */

  function bindForm() {
    var form = $("co-form");
    var uf = $("co-state");
    UFS.forEach(function (s) {
      var o = document.createElement("option");
      o.value = s;
      o.textContent = s;
      uf.appendChild(o);
    });

    form.addEventListener("input", function (e) {
      var el = e.target;
      if (el.name === "cpf") el.value = maskCpf(el.value);
      if (el.name === "phone") el.value = maskPhone(el.value);
      if (el.name === "zip") {
        el.value = maskZip(el.value);
        if (digits(el.value).length === 8) lookupZip(digits(el.value));
        else lastZip = "";
      }
      // corrige a mensagem enquanto digita, sem marcar erro antes da hora
      if (el.closest(".co-field") && el.closest(".co-field").classList.contains("has-error")) checkField(el, false);
    });
    form.addEventListener("focusout", function (e) {
      if (e.target.name && VALIDATORS[e.target.name] && e.target.value !== "") checkField(e.target, true);
    });
    form.addEventListener("change", function (e) {
      if (e.target.name && VALIDATORS[e.target.name]) checkField(e.target, true);
    });
    form.addEventListener("submit", onSubmit);
  }

  function init() {
    order = readOrder();
    var saved = load(KEY_PIX);

    if (!order) {
      $("co-summary").hidden = true;
      show("empty");
      return;
    }

    renderSummary();
    bindForm();
    $("co-summary-toggle").addEventListener("click", toggleSummary);
    $("co-copy").addEventListener("click", copyCode);
    $("co-new-pix").addEventListener("click", newPix);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden && pix) poll();
    });

    if (saved && saved.transactionId && Date.parse(saved.expirationDate) > Date.now()) {
      showPix(saved, true);
    } else {
      drop(KEY_PIX);
      setStep(1);
      show("form");
      track("begin_checkout", {
        currency: "BRL",
        value: OFFER_VALUE,
        items: order.pairs.map(function (pair) {
          return { item_id: "speed-" + pair.color, item_name: "Tênis SPEED", item_variant: pair.label + " " + pair.size, price: OFFER_VALUE / 2, quantity: 1 };
        })
      });
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
