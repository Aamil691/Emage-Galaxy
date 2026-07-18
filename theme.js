/**
 * EMAGE GALAXY - Theme Management
 */

(function applyThemeEarly() {
  const saved = localStorage.getItem(StorageKeys.THEME);
  const theme = saved === 'light' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', theme);
})();

const ThemeManager = {
  init() {
    const saved = localStorage.getItem(StorageKeys.THEME) || 'dark';
    this.setTheme(saved, false);
    this.bindToggle();
    this.initDynamicBackground();
  },

  setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);

    if (save) {
      localStorage.setItem(StorageKeys.THEME, theme);
    }

    const icon = document.querySelector('.theme-toggle i');

    if (icon) {
      icon.className =
        theme === 'dark'
          ? 'fas fa-sun'
          : 'fas fa-moon';
    }

    // Update background instantly
    const layer = document.querySelector('.dynamic-bg__layer');

    if (layer) {
      layer.style.background =
        theme === 'dark'
          ? "url('R.jpg') center center / cover no-repeat fixed"
          : "url('Nature-Wallpaper.jpg') center center / cover no-repeat fixed";
    }
  },

  toggle() {
    const current =
      document.documentElement.getAttribute('data-theme') || 'dark';

    const next = current === 'dark' ? 'light' : 'dark';

    this.setTheme(next);
  },

  bindToggle() {
    if (this._toggleBound) return;

    this._toggleBound = true;

    document.addEventListener('click', (e) => {
      if (e.target.closest('.theme-toggle')) {
        this.toggle();
      }
    });
  },

  initDynamicBackground() {
    const container = document.querySelector('.dynamic-bg');

    if (!container) return;

    container.innerHTML = "";

    const layer = document.createElement("div");
    layer.className = "dynamic-bg__layer active";

    const theme =
      document.documentElement.getAttribute("data-theme") || "dark";

    layer.style.background =
      theme === "dark"
        ? "url('R.jpg') center center / cover no-repeat fixed"
        : "url('Nature-Wallpaper.jpg') center center / cover no-repeat fixed";

    container.appendChild(layer);

    const overlay = document.createElement("div");
    overlay.className = "dynamic-bg__overlay";
    container.appendChild(overlay);
  }
};

window.ThemeManager = ThemeManager;