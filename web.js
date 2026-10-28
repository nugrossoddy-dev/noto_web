/**
 * NOTO — Marketing Website Controller
 * Public Landing Page Scripts & Seamless Cross-Repository Navigation to Apps
 */

// =============================================================================
// KONFIGURASI URL APLIKASI (BEDA REPOSITORY)
// =============================================================================
// Jika Anda memiliki URL Vercel aplikasi sendiri, Anda bisa isi di bawah ini:
// Contoh: const CUSTOM_APP_URL = 'https://noto-apps.vercel.app';
const CUSTOM_APP_URL = '';

const CONFIG = {
  getAppUrl(viewId = '', queryParams = {}) {
    // 1. Cek jika diisi manual di CUSTOM_APP_URL atau window
    if (CUSTOM_APP_URL) {
      return this.formatUrl(CUSTOM_APP_URL, viewId, queryParams);
    }
    if (window.NOTO_APP_URL) {
      return this.formatUrl(window.NOTO_APP_URL, viewId, queryParams);
    }

    const host = window.location.host;
    const proto = window.location.protocol;

    // 2. Auto-detect Vercel Beda Repository:
    // Jika web Anda di-deploy di: xxx-web.vercel.app -> otomatis ke: xxx-apps.vercel.app
    if (host.includes('-web.vercel.app')) {
      const appHost = host.replace('-web.vercel.app', '-apps.vercel.app');
      return this.formatUrl(`${proto}//${appHost}`, viewId, queryParams);
    }

    // 3. Auto-detect GitHub Pages Beda Repository:
    // Jika web Anda di: username.github.io/noto-web/ -> otomatis ke: username.github.io/noto-apps/
    if (host.includes('github.io') && (window.location.pathname.includes('noto-web') || window.location.pathname.includes('web'))) {
      const newPath = window.location.pathname.replace(/noto-web|web/, 'noto-apps');
      return this.formatUrl(`${proto}//${host}${newPath}`, viewId, queryParams);
    }

    // 4. Jika diakses dari folder lokal /web/
    if (window.location.pathname.includes('/web/') || window.location.pathname.endsWith('/web')) {
      return this.formatUrl('../apps/index.html', viewId, queryParams);
    }

    // 5. Default fallback lokal
    return this.formatUrl('../apps/index.html', viewId, queryParams);
  },

  formatUrl(base, viewId, queryParams) {
    let url = base;
    if (url.startsWith('http') && !url.endsWith('/') && !url.includes('.html')) {
      url += '/';
    }
    const params = new URLSearchParams(queryParams).toString();
    if (params) {
      url += (url.includes('?') ? '&' : '?') + params;
    }
    if (viewId) {
      url += '#' + viewId;
    }
    return url;
  }
};

// Smooth navigation to App
function goToApp(viewId = '', queryParams = {}) {
  const target = CONFIG.getAppUrl(viewId, queryParams);
  window.location.href = target;
}

// Plan selection from pricing cards
function selectPlan(planName, priceStr) {
  goToApp('app-premium', { plan: planName });
}

// Smooth scrolling to section
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
  }
  // Tutup menu mobile jika sedang terbuka
  const nav = document.querySelector('.marketing-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav && nav.classList.contains('open')) {
    nav.classList.remove('open');
    if (btn) btn.classList.remove('active');
  }
}

// Mobile Hamburger Menu Toggle
function toggleMarketingMenu() {
  const nav = document.querySelector('.marketing-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav) nav.classList.toggle('open');
  if (btn) btn.classList.toggle('active');
}

// FAQ Accordion Toggle
function toggleFaq(el) {
  const item = el.parentElement;
  if (item) {
    item.classList.toggle('active');
  }
}

// Theme handling (Light / Dark)
const WebTheme = {
  init() {
    const saved = localStorage.getItem('noto_theme') || 'light';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('noto_theme', theme);
    const btn = document.getElementById('web-theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀️' : '🌓';
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }
};

// Sync pricing if configured in shared localStorage
function syncPricing() {
  try {
    const cfg = JSON.parse(localStorage.getItem('noto_pricing_config') || 'null');
    if (cfg) {
      const mEl = document.getElementById('price-val-monthly');
      const yEl = document.getElementById('price-val-yearly');
      const sEl = document.getElementById('price-val-6month');
      if (mEl && cfg.monthly) mEl.textContent = `Rp${Number(cfg.monthly).toLocaleString('id-ID')}`;
      if (yEl && cfg.yearly) yEl.textContent = `Rp${Number(cfg.yearly).toLocaleString('id-ID')}`;
      if (sEl && cfg.sixMonth) sEl.textContent = `Rp${Number(cfg.sixMonth).toLocaleString('id-ID')}`;
    }
  } catch (e) {
    // ignore
  }
}

// Check logged in status to personalize landing page
function checkUserSession() {
  try {
    const session = JSON.parse(localStorage.getItem('noto_session') || 'null');
    let user = null;
    if (session && session.userId) {
      const accounts = JSON.parse(localStorage.getItem('noto_accounts') || '[]');
      user = accounts.find(a => a.id === session.userId);
    }
    if (!user) {
      user = JSON.parse(localStorage.getItem('noto_user') || 'null');
    }
    if (user && user.isLoggedIn) {
      const ctaContainer = document.getElementById('nav-user-actions');
      if (ctaContainer) {
        ctaContainer.innerHTML = `
          <button class="btn btn-primary btn-sm" onclick="goToApp('app-today')" style="font-weight: 700; width: 100%;">
            🚀 Buka Workspace (${user.name ? user.name.split(' ')[0] : 'Saya'}) →
          </button>
        `;
      }
      const heroDirectBtn = document.getElementById('hero-direct-app-btn');
      if (heroDirectBtn) {
        heroDirectBtn.style.display = 'inline-flex';
        heroDirectBtn.textContent = `Lanjutkan ke Workspace (${user.name || 'Saya'}) →`;
      }
    }
  } catch (e) {
    // ignore
  }
}

// Redirect hash if user loaded web with #app-... or #auth-...
function checkRedirectHash() {
  const hash = window.location.hash.replace('#', '');
  if (hash.startsWith('app-') || hash.startsWith('auth-')) {
    goToApp(hash);
  }
}

// PWA Installer prompt support on website
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById('btn-install-marketing');
  if (btn) btn.style.display = 'inline-flex';
});

const PWAInstaller = {
  promptInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(() => {
        deferredPrompt = null;
        const btn = document.getElementById('btn-install-marketing');
        if (btn) btn.style.display = 'none';
      });
    } else {
      goToApp('app-today');
    }
  }
};

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  const nav = document.querySelector('.marketing-nav');
  const btn = document.getElementById('mobile-menu-btn');
  if (nav && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('open');
      if (btn) btn.classList.remove('active');
    }
  }
});

// DOM Ready
window.addEventListener('DOMContentLoaded', () => {
  WebTheme.init();
  syncPricing();
  checkUserSession();
  checkRedirectHash();
});
