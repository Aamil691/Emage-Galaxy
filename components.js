/**
 * EMAGE GALAXY - Components & UI System
 */

const Components = {
  init() {
    this.injectNavbar();
    this.injectFooter();
    this.initScrollProgress();
    this.initScrollTop();
    this.initWelcomePopup();
  },

  injectNavbar() {
    const navbar = document.getElementById('navbar-placeholder');
    if (!navbar) return;
    
    const tier = AccessControl.getTier();
    const user = Storage.getLoggedInUser();
    const isLoggedIn = Storage.isLoggedIn();

    navbar.innerHTML = `
      <nav class="navbar navbar-expand-lg navbar-galaxy">
        <div class="container-fluid">
          <a class="navbar-brand" href="index.html">
            <i class="fas fa-galaxy"></i> <strong>EMAGE</strong><span style="margin-left: 4px;">GALAXY</span>
          </a>
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link" href="categories.html">Browse</a></li>
              <li class="nav-item"><a class="nav-link" href="about.html">About</a></li>
              <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
            </ul>
            <div class="navbar-actions">
              <button class="btn-icon theme-toggle" title="Toggle Theme">
                <i class="fas fa-moon"></i>
              </button>
              ${isLoggedIn ? `
                <div class="dropdown">
                  <button class="btn btn-sm btn-outline-light dropdown-toggle" style="color: #cbd5e1;" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    <i class="fas fa-user" style="margin-right: 6px;"></i>${user?.name || 'User'}
                  </button>
                  <ul class="dropdown-menu dropdown-menu-dark dropdown-menu-end">
                    <li><a class="dropdown-item" href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Dashboard</a></li>
                    <li><a class="dropdown-item" href="downloads.html"><i class="fas fa-download"></i> Downloads</a></li>
                    ${user?.role === 'admin' ? '<li><a class="dropdown-item" href="admin.html"><i class="fas fa-crown"></i> Admin</a></li>' : ''}
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
                  </ul>
                </div>
              ` : `
                <a href="login.html" class="btn btn-sm" style="background: var(--primary); color: white; border: none;">
                  <i class="fas fa-sign-in-alt" style="margin-right: 6px;"></i> Login
                </a>
              `}
            </div>
          </div>
        </div>
      </nav>
    `;

    document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
      e.preventDefault();
      Storage.logout();
      window.location.href = 'index.html';
    });
  },

  injectFooter() {
    const footer = document.getElementById('footer-placeholder');
    if (!footer) return;

    footer.innerHTML = `
      <footer class="footer-galaxy">
        <div class="container">
          <div class="row py-5">
            <div class="col-md-3 mb-4">
              <h5 class="mb-3"><i class="fas fa-galaxy"></i> EMAGE GALAXY</h5>
              <p class="footer-text">Every Image Tells A Tale. Premium HD & 4K wallpapers for everyone.</p>
            </div>
            <div class="col-md-3 mb-4">
              <h6>Quick Links</h6>
              <ul class="footer-links">
                <li><a href="categories.html">Browse</a></li>
                <li><a href="subscription.html">Premium</a></li>
                <li><a href="about.html">About</a></li>
                <li><a href="ratings.html">Ratings</a></li>
              </ul>
            </div>
            <div class="col-md-3 mb-4">
              <h6>Legal</h6>
              <ul class="footer-links">
                <li><a href="terms.html">Terms</a></li>
                <li><a href="privacy.html">Privacy</a></li>
                <li><a href="disclaimer.html">Disclaimer</a></li>
              </ul>
            </div>
            <div class="col-md-3 mb-4">
              <h6>Follow Us</h6>
              <div class="footer-socials">
                <a href="#"><i class="fab fa-facebook"></i></a>
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-instagram"></i></a>
              </div>
            </div>
          </div>
          <div class="footer-bottom border-top pt-4">
            <div class="row">
              <div class="col-md-6">
                <p class="mb-0">&copy; 2024 EMAGE GALAXY. All rights reserved.</p>
              </div>
              <div class="col-md-6 text-md-end">
                <p class="mb-0">Made with <i class="fas fa-heart" style="color:var(--primary);"></i> by EMAGE Team</p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    `;
  },

  initScrollProgress() {
    const progress = document.createElement('div');
    progress.id = 'scrollProgress';
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);

    window.addEventListener('scroll', () => {
      const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      progress.style.width = scrolled + '%';
    });
  },

  initScrollTop() {
    const btn = document.createElement('button');
    btn.id = 'scrollTopBtn';
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    btn.style.display = 'none';
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  initWelcomePopup() {
    if (Storage.get(StorageKeys.WELCOME_SHOWN)) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal modal-welcome show';
    modal.innerHTML = `
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body text-center">
            <i class="fas fa-galaxy fa-4x mb-3" style="color:var(--primary-light);"></i>
            <h3 class="mb-3">Welcome to EMAGE GALAXY</h3>
            <p style="color:var(--text-secondary);">Discover 100+ premium wallpapers in stunning HD & 4K quality.</p>
            <button class="btn-galaxy w-100 mt-3" id="welcomeCloseBtn">Get Started</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('welcomeCloseBtn')?.addEventListener('click', () => {
      modal.remove();
      Storage.set(StorageKeys.WELCOME_SHOWN, true);
    });
  }
};

const UI = {
  showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      padding: 12px 20px;
      background: var(--${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'primary'});
      color: white;
      border-radius: 4px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideInRight 0.3s ease;
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), duration);
  },

  renderStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    let html = '';
    
    for (let i = 0; i < fullStars; i++) {
      html += '<i class="fas fa-star" style="color:var(--gold);"></i>';
    }
    if (hasHalf) {
      html += '<i class="fas fa-star-half-alt" style="color:var(--gold);"></i>';
    }
    const empty = 5 - Math.ceil(rating);
    for (let i = 0; i < empty; i++) {
      html += '<i class="fas fa-star" style="color:var(--text-muted);"></i>';
    }
    
    return `<span class="rating-value">${html} (${rating.toFixed(1)})</span>`;
  },

  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    
    return date.toLocaleDateString();
  },

  formatNumber(num) {
    return new Intl.NumberFormat().format(num);
  },

  renderRatingSummary(wallpaperId) {
    const { average, count, userRating } = Storage.getWallpaperRating(wallpaperId);
    
    // Display current rating
    const ratingDisplay = count === 0 
      ? `<p style="color:var(--text-muted); font-size: 0.9rem;">No ratings yet</p>`
      : `
          <div style="margin-bottom: 1rem;">
            <div class="rating-value">${this.renderStars(average)}</div>
            <div style="color:var(--text-secondary); font-size: 0.85rem;">${count} ${count === 1 ? 'rating' : 'ratings'}</div>
          </div>
        `;
    
    // Interactive rating section
    const isLoggedIn = Storage.isLoggedIn();
    const rateIt = isLoggedIn
      ? `
        <div class="interactive-rating" style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-glass);">
          <p style="font-size: 0.9rem; margin-bottom: 0.75rem; color: var(--text-secondary);"><strong>Rate this wallpaper:</strong></p>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${[1, 2, 3, 4, 5].map(i => `<button class="star-btn" data-value="${i}" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: var(--text-muted); transition: all 0.2s ease; padding: 0;"><i class="far fa-star"></i></button>`).join('')}
          </div>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.5rem;">${userRating ? `You rated: ${userRating} star${userRating > 1 ? 's' : ''}` : 'Click to rate'}</p>
        </div>
      `
      : `
        <div style="margin-top: 1rem; padding: 0.75rem; background: rgba(99, 102, 241, 0.1); border-radius: 6px;">
          <p style="margin: 0; font-size: 0.9rem; color: var(--primary-light);">
            <i class="fas fa-lock"></i> <a href="login.html" style="color: var(--primary-light); text-decoration: underline;">Login to rate</a>
          </p>
        </div>
      `;
    
    return `
      <div class="wallpaper-rating-block">
        <h6 style="margin-bottom: 1rem;"><i class="fas fa-star" style="color: var(--gold);"></i> Ratings</h6>
        ${ratingDisplay}
        ${rateIt}
      </div>
    `;
  }
};

window.Components = Components;
window.UI = UI;
