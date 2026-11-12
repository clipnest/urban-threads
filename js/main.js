/**
 * Urban Threads - Luxury Showcase Client-Side Architecture
 * Bilingual EN/HI, Quick-View Modal, Live IST Store Hours, DPDP Consent, Scroll Reveal
 */

const STORE_CONFIG = {
  phoneDisplay: "+91 98765 43210",
  whatsappDigits: "919876543210",
  mapsUrl: "https://maps.google.com/?q=Linking+Road+Bandra+West+Mumbai",
  openHour: 11,
  openMinute: 0,
  closeHour: 21,
  closeMinute: 30
};

const COLOR_HEX_MAP = {
  "Pure White": "#F4F2ED",
  "Chalk White": "#F2EFE9",
  "Ivory Silk": "#EFE9DC",
  "Sky Blue": "#A8C6DF",
  "Dusty Coastal Blue": "#6E8CA0",
  "Pale Pink": "#E8C5C8",
  "Royal Navy": "#1A2B4C",
  "Midnight Blue": "#131D33",
  "Midnight Navy": "#18243C",
  "Forest Olive": "#3E4A36",
  "Olive Drab": "#545E46",
  "Sage Green": "#8A9A84",
  "Bottle Green": "#1E4231",
  "Stealth Black": "#181818",
  "Deep Wine": "#591D26",
  "Charcoal Melange": "#3B3C3E",
  "Charcoal": "#353638",
  "Slate Grey": "#6A6E73",
  "Warm Khaki": "#B5A284",
  "Natural Sand": "#D6C5AA"
};

const i18nData = {
  en: {
    getDirections: "Get directions",
    chatWhatsapp: "Chat on WhatsApp",
    viewCollection: "View Collection",
    theCollection: "Collections",
    findInStore: "View Details",
    newArrivals: "New Arrivals",
    sizeGuide: "Size Guide",
    all: "All",
    shirts: "Shirts",
    polos: "Polo T-Shirts",
    tees: "T-Shirts",
    trousers: "Trousers",
    inclusiveTax: "Inclusive of all taxes",
    modelNote: "Model is 6 ft 0 in (183 cm) and wears size M",
    storeAddress: "Shop 4, Linking Road, Bandra West, Mumbai, Maharashtra 400050",
    inStock: "Available at Bandra store",
    selectSizePrompt: "Select a size to check Bandra store availability."
  },
  hi: {
    getDirections: "रास्ता देखें",
    chatWhatsapp: "व्हाट्सएप पर बात करें",
    viewCollection: "कलेक्शन देखें",
    theCollection: "कलेक्शन",
    findInStore: "विवरण देखें",
    newArrivals: "नए परिधान",
    sizeGuide: "साइज़ गाइड",
    all: "सभी",
    shirts: "शर्ट्स",
    polos: "पोलो टी-शर्ट्स",
    tees: "टी-शर्ट्स",
    trousers: "ट्राउज़र्स",
    inclusiveTax: "सभी कर सहित",
    modelNote: "मॉडल का कद 6 फीट (183 सेमी) है और साइज़ M पहना है",
    storeAddress: "दुकान 4, लिंकिंग रोड, बांद्रा वेस्ट, मुंबई, महाराष्ट्र 400050",
    inStock: "मुंबई स्टोर में उपलब्ध",
    selectSizePrompt: "स्टोर उपलब्धता देखने के लिए साइज़ चुनें।"
  }
};

let currentLang = localStorage.getItem("ut_lang") || "en";
let cachedProducts = null;
let lastFocusedElement = null;

document.addEventListener("DOMContentLoaded", () => {
  initLanguage();
  initHeaderScroll();
  initMobileNav();
  initAccordions();
  initWhatsAppLinks();
  updateStoreStatusBadge();
  initScrollReveal();
  initScrollProgress();
  initCustomCursor();
  initConsentBanner();
  ensureQuickViewModal();
});

/* ==========================================================================
   LANGUAGE TOGGLE (EN / HI)
   ========================================================================== */
function initLanguage() {
  applyLanguage(currentLang);
  document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      currentLang = currentLang === "en" ? "hi" : "en";
      localStorage.setItem("ut_lang", currentLang);
      applyLanguage(currentLang);
      if (typeof window.onLanguageChange === "function") {
        window.onLanguageChange(currentLang);
      }
    });
  });
}

function applyLanguage(lang) {
  document.body.classList.toggle("lang-hi", lang === "hi");
  document.documentElement.lang = lang;

  document.querySelectorAll(".lang-toggle-btn").forEach((btn) => {
    btn.textContent = lang === "en" ? "हिन्दी" : "English";
    btn.setAttribute("aria-pressed", lang === "hi" ? "true" : "false");
  });

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18nData[lang] && i18nData[lang][key]) {
      el.textContent = i18nData[lang][key];
    }
  });

  document.querySelectorAll(".i18n-en").forEach((el) => {
    el.style.display = lang === "en" ? "" : "none";
  });
  document.querySelectorAll(".i18n-hi").forEach((el) => {
    el.style.display = lang === "hi" ? "" : "none";
  });

  updateStoreStatusBadge();
}

/* ==========================================================================
   LIVE MUMBAI (IST) STORE STATUS BADGE
   ========================================================================== */
function updateStoreStatusBadge() {
  const statusEls = document.querySelectorAll("[data-store-status]");
  if (!statusEls.length) return;

  const now = new Date();
  const utcMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
  const istMinutes = (utcMinutes + 330) % 1440;
  const openMins = STORE_CONFIG.openHour * 60 + STORE_CONFIG.openMinute;
  const closeMins = STORE_CONFIG.closeHour * 60 + STORE_CONFIG.closeMinute;
  const isOpen = istMinutes >= openMins && istMinutes < closeMins;

  statusEls.forEach((el) => {
    const dot = el.querySelector(".status-dot");
    const label = el.querySelector(".status-text") || el;
    if (isOpen) {
      if (dot) {
        dot.style.backgroundColor = "var(--success)";
        dot.style.boxShadow = "0 0 10px rgba(123, 196, 154, 0.8)";
      }
      label.textContent =
        currentLang === "hi"
          ? "अभी खुला है • रात 9:30 बजे तक (मुंबई)"
          : "Open Now • Closes 9:30 PM IST";
    } else {
      if (dot) {
        dot.style.backgroundColor = "var(--warning)";
        dot.style.boxShadow = "0 0 10px rgba(229, 185, 78, 0.7)";
      }
      label.textContent =
        currentLang === "hi"
          ? "अभी बंद है • कल सुबह 11:00 बजे खुलेगा"
          : "Closed Now • Opens 11:00 AM IST";
    }
  });
}

/* ==========================================================================
   STICKY HEADER & MOBILE DRAWER
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  window.addEventListener(
    "scroll",
    () => {
      header.classList.toggle("scrolled", window.scrollY > 40);
    },
    { passive: true }
  );
}

function initMobileNav() {
  const toggleBtn = document.querySelector(".mobile-nav-toggle");
  const drawer = document.querySelector(".mobile-nav-drawer");
  const closeBtn = document.querySelector(".mobile-nav-close");
  if (!toggleBtn || !drawer) return;

  const closeDrawer = () => {
    drawer.classList.remove("open");
    toggleBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
    toggleBtn.focus();
  };

  toggleBtn.addEventListener("click", () => {
    drawer.classList.add("open");
    toggleBtn.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (closeBtn) closeBtn.focus();
  });

  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) {
      closeDrawer();
    }
  });
}

/* ==========================================================================
   ACCESSIBLE ACCORDIONS
   ========================================================================== */
function initAccordions() {
  document.querySelectorAll(".accordion-header").forEach((header) => {
    const item = header.closest(".accordion-item");
    header.setAttribute("aria-expanded", item.classList.contains("open") ? "true" : "false");
    header.addEventListener("click", () => {
      const isOpen = item.classList.toggle("open");
      header.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });
}

/* ==========================================================================
   WHATSAPP CONCIERGE LINKS
   ========================================================================== */
function initWhatsAppLinks() {
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-wa-product]");
    if (!btn) return;
    const prodName = btn.getAttribute("data-wa-product");
    const size = btn.getAttribute("data-wa-size") || "any";
    const text = encodeURIComponent(
      `Hello Urban Threads Mumbai, I'm interested in "${prodName}" (Size: ${size}). Is this available at your Bandra store?`
    );
    window.open(`https://wa.me/${STORE_CONFIG.whatsappDigits}?text=${text}`, "_blank", "noopener");
  });
}

window.selectSize = function (buttonElement, sizeLabel) {
  const parent = buttonElement.closest(".size-selector-group");
  if (parent) {
    parent.querySelectorAll(".size-btn").forEach((btn) => {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
    });
  }
  buttonElement.classList.add("active");
  buttonElement.setAttribute("aria-pressed", "true");

  const container = buttonElement.closest(".modal-dialog") || document;
  const waBtn = container.querySelector("[data-wa-product]");
  if (waBtn) waBtn.setAttribute("data-wa-size", sizeLabel);

  const availabilityText = container.querySelector("#size-availability-note, #qv-availability-note");
  if (availabilityText) {
    availabilityText.textContent =
      currentLang === "hi"
        ? `साइज़ ${sizeLabel} हमारे बांद्रा स्टोर में उपलब्ध है।`
        : `Size ${sizeLabel} is available to try at our Bandra store.`;
    availabilityText.style.color = "var(--accent)";
  }
};

/* ==========================================================================
   SWATCH HELPER & PRODUCT CARD RENDERER
   ========================================================================== */
window.renderSwatchesHtml = function (colors) {
  if (!Array.isArray(colors) || !colors.length) return "";
  const dots = colors
    .slice(0, 4)
    .map((c) => {
      const hex = COLOR_HEX_MAP[c] || "#8E857A";
      return `<span class="swatch-dot" style="background-color:${hex}" title="${c}"></span>`;
    })
    .join("");
  return `<div class="swatch-row">${dots}<span class="swatch-label">${colors.length} ${
    colors.length === 1 ? "shade" : "shades"
  }</span></div>`;
};

/* ==========================================================================
   QUICK-VIEW MODAL (Luxury E-Commerce Pattern)
   ========================================================================== */
async function getProductsData() {
  if (cachedProducts) return cachedProducts;
  const res = await fetch("data/products.json");
  cachedProducts = await res.json();
  return cachedProducts;
}

function ensureQuickViewModal() {
  if (document.getElementById("ut-quickview-modal")) return;
  const modal = document.createElement("div");
  modal.id = "ut-quickview-modal";
  modal.className = "modal-backdrop";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");
  modal.setAttribute("aria-labelledby", "qv-title");
  modal.innerHTML = `
    <div class="modal-dialog">
      <button type="button" class="modal-close-btn" id="qv-close-btn" aria-label="Close quick view">
        <svg class="icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.65"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="modal-body-grid">
        <div style="background:var(--surface-2); aspect-ratio:4/5; overflow:hidden;">
          <img id="qv-img" src="" alt="" style="width:100%; height:100%; object-fit:cover;">
        </div>
        <div style="padding:28px; display:flex; flex-direction:column;">
          <span id="qv-cat" class="product-category-tag"></span>
          <h3 id="qv-title" style="font-size:1.65rem; margin-bottom:8px;"></h3>
          <div id="qv-price" style="font-size:1.25rem; font-weight:600; color:var(--text); margin-bottom:12px;"></div>
          <p id="qv-desc" style="font-size:0.9rem; margin-bottom:16px;"></p>
          <div id="qv-fabric" style="font-size:0.8125rem; color:var(--accent); margin-bottom:16px; padding:10px 12px; background:var(--surface-2); border:1px solid var(--border); border-radius:var(--radius);"></div>
          <div style="font-size:0.78rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--muted);">Select Size</div>
          <div id="qv-sizes" class="size-selector-group"></div>
          <div id="qv-availability-note" style="font-size:0.8rem; color:var(--muted-2); margin-bottom:18px;">Select a size to verify Bandra store stock.</div>
          <div style="margin-top:auto; display:flex; flex-direction:column; gap:10px;">
            <button type="button" id="qv-wa-btn" class="btn btn-whatsapp btn-sm" data-wa-product="">Check Stock on WhatsApp</button>
            <a id="qv-full-link" href="#" class="btn btn-outline-gold btn-sm">View Full Fit & Details →</a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const close = () => {
    modal.classList.remove("open");
    document.body.style.overflow = "";
    if (lastFocusedElement) lastFocusedElement.focus();
  };

  modal.querySelector("#qv-close-btn").addEventListener("click", close);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) close();
  });
}

window.openQuickView = async function (productId) {
  try {
    const products = await getProductsData();
    const item = products.find((p) => String(p.id) === String(productId));
    if (!item) return;

    ensureQuickViewModal();
    lastFocusedElement = document.activeElement;

    const modal = document.getElementById("ut-quickview-modal");
    document.getElementById("qv-img").src = item.image;
    document.getElementById("qv-img").alt = item.name;
    document.getElementById("qv-cat").textContent = item.category_label;
    document.getElementById("qv-title").textContent = currentLang === "hi" ? item.name_hi : item.name;
    document.getElementById("qv-price").innerHTML = `₹ ${item.price.toLocaleString("en-IN")} <span style="font-size:0.75rem; color:var(--muted-2); font-weight:400;">${i18nData[currentLang].inclusiveTax}</span>`;
    document.getElementById("qv-desc").textContent = currentLang === "hi" ? item.description_hi : item.description;
    document.getElementById("qv-fabric").textContent = `${item.fabric} • ${item.fit}`;
    document.getElementById("qv-full-link").href = `product.html?id=${item.id}`;

    const waBtn = document.getElementById("qv-wa-btn");
    waBtn.setAttribute("data-wa-product", item.name);
    waBtn.setAttribute("data-wa-size", item.sizes[1] || item.sizes[0] || "M");

    const sizesWrap = document.getElementById("qv-sizes");
    sizesWrap.innerHTML = item.sizes
      .map(
        (s, idx) =>
          `<button type="button" class="size-btn ${idx === 1 ? "active" : ""}" aria-pressed="${
            idx === 1 ? "true" : "false"
          }" onclick="selectSize(this, '${s}')">${s}</button>`
      )
      .join("");

    document.getElementById("qv-availability-note").textContent =
      `Size ${item.sizes[1] || item.sizes[0]} is available to try at our Bandra store.`;
    document.getElementById("qv-availability-note").style.color = "var(--accent)";

    modal.classList.add("open");
    document.body.style.overflow = "hidden";
    document.getElementById("qv-close-btn").focus();
  } catch (err) {
    console.error("Quick view failed:", err);
  }
};

/* ==========================================================================
   DPDP CONSENT BANNER (PRD FR-015)
   ========================================================================== */
function initConsentBanner() {
  if (localStorage.getItem("ut_consent")) return;
  const banner = document.createElement("aside");
  banner.className = "consent-banner visible";
  banner.setAttribute("aria-label", "Privacy and cookie preferences");
  banner.innerHTML = `
    <div style="font-family:var(--font-heading); font-size:1.1rem; color:var(--text); margin-bottom:6px;">
      Your Privacy Preferences
    </div>
    <p style="font-size:0.8125rem; color:var(--muted); margin-bottom:14px;">
      We use essential storage to remember your language preference and optional analytics only with your consent.
    </p>
    <div style="display:flex; flex-wrap:wrap; gap:10px;">
      <button type="button" id="ut-consent-accept" class="btn btn-primary btn-sm" style="flex:1;">Accept</button>
      <button type="button" id="ut-consent-decline" class="btn btn-secondary btn-sm" style="flex:1;">Decline</button>
    </div>
  `;
  document.body.appendChild(banner);

  const dismiss = (choice) => {
    localStorage.setItem("ut_consent", choice);
    banner.classList.remove("visible");
  };
  document.getElementById("ut-consent-accept").addEventListener("click", () => dismiss("accepted"));
  document.getElementById("ut-consent-decline").addEventListener("click", () => dismiss("declined"));
}

/* ==========================================================================
   SCROLL REVEAL STAGGER (Respects prefers-reduced-motion)
   ========================================================================== */
function initScrollReveal() {
  const targets = document.querySelectorAll(".reveal");
  if (!targets.length) return;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("visible"));
    return;
  }

  // Assign subtle stagger delay to sibling .reveal cards inside grids
  document.querySelectorAll(".grid, .promise-strip, .faq-list").forEach((container) => {
    const children = container.querySelectorAll(".reveal");
    children.forEach((child, idx) => {
      child.style.transitionDelay = `${Math.min(idx % 4, 3) * 75}ms`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   TOP SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const bar = document.createElement("div");
  bar.className = "ut-scroll-progress";
  bar.setAttribute("aria-hidden", "true");
  document.body.appendChild(bar);

  let ticking = false;
  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
    bar.style.width = `${pct}%`;
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
  update();
}

/* ==========================================================================
   CUSTOM "U" POINTER (Desktop / Laptop with mouse or trackpad)
   ========================================================================== */
function initCustomCursor() {
  const hasFinePointer = window.matchMedia("(any-pointer: fine)").matches || navigator.maxTouchPoints === 0;
  if (!hasFinePointer) return;

  const cursor = document.createElement("div");
  cursor.className = "ut-cursor";
  cursor.setAttribute("aria-hidden", "true");
  cursor.textContent = "U";
  document.body.appendChild(cursor);
  document.body.classList.add("ut-custom-cursor");

  let mouseX = -100;
  let mouseY = -100;
  let rafId = null;

  const render = () => {
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    rafId = null;
  };

  const onMove = (e) => {
    if (e.pointerType && e.pointerType === "touch") return;
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add("visible");
    if (!rafId) {
      rafId = window.requestAnimationFrame(render);
    }
  };

  document.addEventListener("mousemove", onMove, { passive: true });
  document.addEventListener("pointermove", onMove, { passive: true });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("visible");
  });

  document.addEventListener("mousedown", () => {
    cursor.classList.add("active");
  });

  document.addEventListener("mouseup", () => {
    cursor.classList.remove("active");
  });

  const interactiveSelector = "a, button, input, select, textarea, .product-card, .category-tile, .size-btn, .accordion-header";
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.add("hover");
    }
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactiveSelector)) {
      cursor.classList.remove("hover");
    }
  });
}
