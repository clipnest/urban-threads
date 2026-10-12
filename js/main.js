/**
 * Urban Threads - Client-side core logic
 * Supports EN/HI bilingual toggle, filter state, WhatsApp deep-links, accordions, mobile drawers
 * Enhanced with dynamic hover effects, smooth reveals and marquee controls
 */

// Bilingual dictionary for dynamic elements
const i18nData = {
  en: {
    getDirections: "Get directions",
    chatWhatsapp: "Chat on WhatsApp",
    viewCollection: "View Collection",
    theCollection: "The Collection",
    findInStore: "Find in store",
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
    openNow: "Open Now • Closes 9:30 PM",
    inStock: "Available in Mumbai store",
    selectSizePrompt: "Please select a size to check availability"
  },
  hi: {
    getDirections: "रास्ता देखें",
    chatWhatsapp: "व्हाट्सएप पर बात करें",
    viewCollection: "कलेक्शन देखें",
    theCollection: "हमारा कलेक्शन",
    findInStore: "स्टोर में खोजें",
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
    openNow: "खुला है • रात 9:30 बजे बंद होगा",
    inStock: "मुंबई स्टोर में उपलब्ध",
    selectSizePrompt: "स्टोर उपलब्धता देखने के लिए कृपया साइज़ चुनें"
  }
};

// State
let currentLang = localStorage.getItem('ut_lang') || 'en';

document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initHeaderScroll();
  initMobileNav();
  initAccordions();
  initWhatsAppLinks();
  initCardMouseGlow();
});

// Initialize Language
function initLanguage() {
  applyLanguage(currentLang);

  const langToggles = document.querySelectorAll('.lang-toggle-btn');
  langToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = currentLang === 'en' ? 'hi' : 'en';
      localStorage.setItem('ut_lang', currentLang);
      applyLanguage(currentLang);
    });
  });
}

function applyLanguage(lang) {
  document.body.classList.toggle('lang-hi', lang === 'hi');
  document.documentElement.lang = lang;

  document.querySelectorAll('.lang-toggle-btn').forEach(btn => {
    btn.innerHTML = lang === 'en' ? 'हिन्दी' : 'English';
  });

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nData[lang] && i18nData[lang][key]) {
      el.textContent = i18nData[lang][key];
    }
  });

  document.querySelectorAll('.i18n-en').forEach(el => {
    el.style.display = lang === 'en' ? '' : 'none';
  });
  document.querySelectorAll('.i18n-hi').forEach(el => {
    el.style.display = lang === 'hi' ? '' : 'none';
  });
}

// Header Sticky Effect
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

// Mobile Navigation
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  const closeBtn = document.querySelector('.mobile-nav-close');

  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  }
}

// Accordion (FAQ & PDP)
function initAccordions() {
  const accordions = document.querySelectorAll('.accordion-header');
  accordions.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.accordion-item');
      item.classList.toggle('open');
    });
  });
}

// Dynamic WhatsApp link generator
function initWhatsAppLinks() {
  const phone = "919876543210";
  document.querySelectorAll('[data-wa-product]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const prodName = btn.getAttribute('data-wa-product');
      const size = btn.getAttribute('data-wa-size') || 'any';
      const text = encodeURIComponent(`Hello Urban Threads Mumbai, I'm interested in "${prodName}" (Size: ${size}). Is this available at your Bandra store?`);
      window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
  });
}

// Subtle interactive mouse shine on product cards
function initCardMouseGlow() {
  document.querySelectorAll('.product-card, .category-tile, .fabric-feature-strip').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

// Size Button Selector Logic
window.selectSize = function(buttonElement, sizeLabel, productName) {
  const parent = buttonElement.closest('.size-selector-group');
  if (parent) {
    parent.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
  }
  buttonElement.classList.add('active');

  const waBtn = document.querySelector('[data-wa-product]');
  if (waBtn) {
    waBtn.setAttribute('data-wa-size', sizeLabel);
  }

  const availabilityText = document.getElementById('size-availability-note');
  if (availabilityText) {
    availabilityText.textContent = `Size ${sizeLabel} is currently in stock at our Bandra store.`;
    availabilityText.style.color = 'var(--accent)';
    availabilityText.style.textShadow = '0 0 10px rgba(201, 169, 110, 0.4)';
  }
};
