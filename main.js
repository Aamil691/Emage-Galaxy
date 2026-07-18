/**
 * EMAGE GALAXY - Main Application Entry
 */

document.addEventListener('DOMContentLoaded', () => {
  Auth.initUsers();
  Components.init();
  ThemeManager.init();

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 800, once: true, offset: 50 });
  }

  initPageSpecific();
  
  // Make page visible after all initialization
  setTimeout(() => {
    document.body.classList.add('page-loaded');
  }, 100);
});

function initPageSpecific() {
  const page = window.location.pathname.split('/').pop() || 'index.html';

  switch (page) {
    case 'index.html':
    case '':
      initHomePage();
      break;
    case 'categories.html':
      initCategoriesPage();
      break;
    case 'login.html':
      initLoginPage();
      break;
    case 'register.html':
      initRegisterPage();
      break;
    case 'forgot-password.html':
      initForgotPasswordPage();
      break;
    case 'subscription.html':
      initSubscriptionPage();
      break;
    case 'upload.html':
      initUploadPage();
      break;
    case 'dashboard.html':
      initDashboardPage();
      break;
    case 'admin.html':
      initAdminPage();
      break;
    case 'downloads.html':
      initDownloadsPage();
      break;
    case 'ratings.html':
      initRatingsPage();
      break;
    case 'contact.html':
      initContactPage();
      break;
  }
}

/** Home Page - Typing Effect & Sections */
function initHomePage() {
  const typingEl = document.getElementById('typingText');
  if (typingEl) {
    const phrases = [
      'Every Image Tells A Tale.',
      'Explore 100+ Premium Wallpapers.',
      'Download in Stunning 4K Quality.',
      'Discover Your Perfect Background.'
    ];
    let phraseIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
      const current = phrases[phraseIndex];
      if (isDeleting) {
        typingEl.innerHTML = current.substring(0, charIndex - 1) + '<span class="cursor"></span>';
        charIndex--;
      } else {
        typingEl.innerHTML = current.substring(0, charIndex + 1) + '<span class="cursor"></span>';
        charIndex++;
      }

      let speed = isDeleting ? 40 : 80;
      if (!isDeleting && charIndex === current.length) {
        speed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        speed = 500;
      }
      setTimeout(type, speed);
    }
    type();
  }

  const heroSearch = document.getElementById('heroSearch');
  heroSearch?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      window.location.href = `categories.html?search=${encodeURIComponent(heroSearch.value.trim())}`;
    }
  });
  document.getElementById('heroSearchBtn')?.addEventListener('click', () => {
    window.location.href = `categories.html?search=${encodeURIComponent(heroSearch?.value.trim() || '')}`;
  });

  WallpaperGallery.renderCategories(document.getElementById('categoryGrid'));

  ['trendingGrid', 'featuredGrid', 'newArrivalsGrid', 'editorPicksGrid'].forEach((id, i) => {
    const filters = ['trending', 'featured', 'new', 'editor'];
    const el = document.getElementById(id);
    if (el) WallpaperGallery.init({ container: `#${id}`, filter: filters[i], limit: 8, showFilters: false });
  });

  initHomeSwipers();
  initNewsletter('homeNewsletter');
}

function initHomeSwipers() {
  if (typeof Swiper === 'undefined') return;
  document.querySelectorAll('.swiper-galaxy').forEach(el => {
    new Swiper(el, {
      slidesPerView: 1,
      spaceBetween: 20,
      navigation: { nextEl: el.querySelector('.swiper-button-next'), prevEl: el.querySelector('.swiper-button-prev') },
      breakpoints: { 576: { slidesPerView: 2 }, 768: { slidesPerView: 3 }, 1200: { slidesPerView: 4 } }
    });
  });
}

function initCategoriesPage() {
  const params = new URLSearchParams(window.location.search);
  const searchInput = document.getElementById('pageSearch');
  if (searchInput && params.get('search')) searchInput.value = params.get('search');

  searchInput?.addEventListener('input', debounce(() => {
    WallpaperGallery.searchQuery = searchInput.value.trim();
    WallpaperGallery.render();
  }, 300));

  WallpaperGallery.init({ container: '#wallpaperGrid', showFilters: true });
}

function initLoginPage() {
  if (Storage.isLoggedIn()) { window.location.href = 'dashboard.html'; return; }

  const remembered = Storage.get(StorageKeys.REMEMBER);
  if (remembered) {
    document.getElementById('loginEmail').value = remembered;
    document.getElementById('rememberMe').checked = true;
  }

  document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const remember = document.getElementById('rememberMe').checked;
    const result = Auth.login(email, password, remember);
    if (result.success) {
      UI.showToast('Welcome back!');
      setTimeout(() => window.location.href = result.user.role === 'admin' ? 'admin.html' : 'dashboard.html', 500);
    } else {
      UI.showToast(result.message);
    }
  });

  document.querySelectorAll('.social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const provider = btn.dataset.provider;
      Auth.socialLogin(provider);
      UI.showToast(`Logged in with ${provider}!`);
      setTimeout(() => window.location.href = 'dashboard.html', 500);
    });
  });
}

function initRegisterPage() {
  if (Storage.isLoggedIn()) { window.location.href = 'dashboard.html'; return; }

  document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const terms = document.getElementById('regTerms').checked;

    if (password !== confirm) { UI.showToast('Passwords do not match!'); return; }
    if (!terms) { UI.showToast('Please accept the terms and conditions.'); return; }

    const result = Auth.register(name, email, password);
    UI.showToast(result.message);
    if (result.success) setTimeout(() => window.location.href = 'login.html', 1000);
  });
}

function initForgotPasswordPage() {
  let currentEmail = '';
  const steps = ['stepEmail', 'stepOTP', 'stepReset'];

  function showStep(stepId) {
    steps.forEach(id => document.getElementById(id)?.classList.toggle('active', id === stepId));
  }

  document.getElementById('emailForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    currentEmail = document.getElementById('forgotEmail').value;
    UI.showToast('OTP sent to your email! (Demo: use 123456)');
    showStep('stepOTP');
  });

  document.getElementById('otpForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const otp = [...document.querySelectorAll('.otp-input')].map(i => i.value).join('');
    if (otp === '123456') { showStep('stepReset'); }
    else { UI.showToast('Invalid OTP. Try 123456'); }
  });

  document.getElementById('resetForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newPass = document.getElementById('newPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
    if (newPass !== confirm) { UI.showToast('Passwords do not match!'); return; }
    Auth.resetPassword(currentEmail, newPass);
    UI.showToast('Password reset successfully!');
    setTimeout(() => window.location.href = 'login.html', 1000);
  });

  document.querySelectorAll('.otp-input').forEach((input, i, arr) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1 && arr[i + 1]) arr[i + 1].focus();
    });
  });
}

function initSubscriptionPage() {
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plan = btn.dataset.plan;
      if (plan === 'guest') { UI.showToast('You are on the Guest plan.'); return; }
      showPaymentModal(plan);
    });
  });
}

function showPaymentModal(plan) {
  const modal = document.createElement('div');
  modal.className = 'modal fade modal-galaxy';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header"><h5>Complete Payment</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>
        <div class="modal-body">
          <p>Subscribe to <strong>${plan.charAt(0).toUpperCase() + plan.slice(1)}</strong> plan</p>
          <div class="form-group mb-3"><label class="form-label-galaxy">Card Number</label><input class="form-glass" value="4111 1111 1111 1111" readonly></div>
          <div class="row"><div class="col-6"><label class="form-label-galaxy">Expiry</label><input class="form-glass" value="12/28" readonly></div>
          <div class="col-6"><label class="form-label-galaxy">CVV</label><input class="form-glass" value="123" readonly></div></div>
          <button class="btn-galaxy w-100 mt-3" id="confirmPayment"><i class="fas fa-lock"></i> Pay Now</button>
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  modal.querySelector('#confirmPayment').addEventListener('click', () => {
    bsModal.hide();
    Storage.setSubscription(plan);
    showSuccessModal(plan);
  });
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}

function showSuccessModal(plan) {
  const modal = document.createElement('div');
  modal.className = 'modal fade modal-galaxy';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content text-center p-4">
        <i class="fas fa-check-circle fa-4x mb-3" style="color:#22c55e;"></i>
        <h4>Subscription Successful!</h4>
        <p style="color:var(--text-secondary);">You are now a ${plan.charAt(0).toUpperCase() + plan.slice(1)} member.</p>
        <a href="dashboard.html" class="btn-galaxy">Go to Dashboard</a>
      </div>
    </div>`;
  document.body.appendChild(modal);
  new bootstrap.Modal(modal).show();
}

function initUploadPage() {
  const uploadForm = document.getElementById('uploadForm');
  const uploadRestricted = document.getElementById('uploadRestricted');

  if (!Storage.isLoggedIn()) {
    if (uploadForm) uploadForm.classList.add('d-none');
    if (uploadRestricted) {
      uploadRestricted.classList.remove('d-none');
      uploadRestricted.innerHTML = `
        <i class="fas fa-sign-in-alt fa-3x mb-3" style="color:var(--primary-light);"></i>
        <h4>Login Required</h4>
        <p style="color:var(--text-secondary);">Login users can comment on wallpapers. Prime members can upload wallpapers.</p>
        <a href="login.html" class="btn-galaxy mt-3"><i class="fas fa-sign-in-alt"></i> Login Now</a>
      `;
    }
    return;
  }

  if (!AccessControl.canUpload()) {
    uploadRestricted?.classList.remove('d-none');
    uploadForm?.classList.add('d-none');
    return;
  }

  const zone = document.getElementById('uploadZone');
  const preview = document.getElementById('uploadPreview');
  const fileInput = document.getElementById('fileInput');

  zone?.addEventListener('click', () => fileInput.click());
  zone?.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('dragover'); });
  zone?.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone?.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dragover');
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  });
  fileInput?.addEventListener('change', () => { if (fileInput.files[0]) handleFile(fileInput.files[0]); });

  function handleFile(file) {
    if (!file.type.startsWith('image/')) { UI.showToast('Please upload an image file.'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.classList.add('visible');
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('uploadForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!AccessControl.requireUpload()) return;
    const pending = Storage.get(StorageKeys.PENDING_UPLOADS, []);
    pending.push({
      id: Date.now(),
      title: document.getElementById('uploadTitle').value,
      category: document.getElementById('uploadCategory').value,
      tags: document.getElementById('uploadTags').value,
      resolution: document.getElementById('uploadResolution').value,
      image: preview.src,
      status: 'pending',
      date: new Date().toISOString()
    });
    Storage.set(StorageKeys.PENDING_UPLOADS, pending);
    Storage.addActivity('upload', `Uploaded "${document.getElementById('uploadTitle').value}"`);

    const modal = document.createElement('div');
    modal.className = 'modal fade modal-galaxy';
    modal.innerHTML = `<div class="modal-dialog modal-dialog-centered"><div class="modal-content text-center p-4">
      <i class="fas fa-cloud-upload-alt fa-4x mb-3 text-gradient"></i><h4>Upload Successful!</h4>
      <p style="color:var(--text-secondary);">Your wallpaper is pending admin approval.</p>
      <button class="btn-galaxy" data-bs-dismiss="modal">OK</button></div></div>`;
    document.body.appendChild(modal);
    new bootstrap.Modal(modal).show();
    e.target.reset();
    preview.classList.remove('visible');
  });
}

function initDashboardPage() {
  if (!Auth.requireAuth()) return;
  const user = Storage.getCurrentUser();

  document.getElementById('dashWelcomeName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileNameDisplay').textContent = user.name;
  document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();

  const tier = AccessControl.getTier();
  const tierLabel = AccessControl.getTierLabel();
  const subStatus = document.getElementById('subStatus');
  if (subStatus) subStatus.textContent = tierLabel;

  const badge = document.getElementById('subBadge');
  const badgeLarge = document.getElementById('subBadgeLarge');
  [badge, badgeLarge].forEach(b => {
    if (b) {
      b.className = `subscription-badge ${tier}`;
      const icon = tier === 'prime' ? 'fa-crown' : tier === 'user' ? 'fa-user-circle' : 'fa-user';
      b.innerHTML = `<i class="fas ${icon}"></i> ${tierLabel}`;
    }
  });

  renderDashboardFavorites();
  renderDashboardDownloads();
  renderDashboardActivity();

  document.querySelectorAll('.dashboard-nav a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      document.querySelectorAll('.dashboard-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.dashboard-tab-content').forEach(t => t.classList.remove('active'));
      document.getElementById(tab)?.classList.add('active');
    });
  });

  document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    Auth.updateProfile({
      name: document.getElementById('settingsName').value,
      email: document.getElementById('settingsEmail').value
    });
    UI.showToast('Settings saved!');
  });
  document.getElementById('settingsName').value = user.name;
  document.getElementById('settingsEmail').value = user.email;
}

function renderDashboardFavorites() {
  const container = document.getElementById('dashFavorites');
  if (!container) return;
  const favs = Storage.getFavorites();
  const wallpapers = WALLPAPERS_DATA.filter(w => favs.includes(w.id));
  container.innerHTML = wallpapers.length
    ? `<div class="wallpaper-grid">${wallpapers.map(w => WallpaperGallery.renderCard(w)).join('')}</div>`
    : '<p style="color:var(--text-muted);">No favourites yet.</p>';
}

function renderDashboardDownloads() {
  const container = document.getElementById('dashDownloads');
  if (!container) return;
  const downloads = Storage.getDownloads();
  container.innerHTML = downloads.length
    ? downloads.map(d => `
      <div class="activity-item">
        <img src="${d.image}" alt="${d.title}" style="width:60px;height:40px;object-fit:cover;border-radius:6px;">
        <div><strong>${d.title}</strong><br><small style="color:var(--text-muted);">${d.resolution} · ${UI.formatDate(d.date)}</small></div>
      </div>`).join('')
    : '<p style="color:var(--text-muted);">No downloads yet.</p>';
  document.getElementById('downloadCount') && (document.getElementById('downloadCount').textContent = downloads.length);
}

function renderDashboardActivity() {
  const container = document.getElementById('dashActivity');
  if (!container) return;
  const activity = Storage.getActivity();
  container.innerHTML = activity.length
    ? activity.slice(0, 10).map(a => `
      <div class="activity-item">
        <div class="activity-icon"><i class="fas fa-${a.type === 'download' ? 'download' : a.type === 'login' ? 'sign-in-alt' : 'circle'}"></i></div>
        <div><span>${a.message}</span><br><small style="color:var(--text-muted);">${UI.formatDate(a.date)}</small></div>
      </div>`).join('')
    : '<p style="color:var(--text-muted);">No recent activity.</p>';
}

function initAdminPage() {
  if (!Auth.requireAdmin()) return;
  initAdminCharts();
  renderAdminTables();
  renderAdminNotifications();

  document.querySelectorAll('.admin-nav a[data-section]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.admin-nav a').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      document.querySelectorAll('.admin-section').forEach(s => s.classList.add('d-none'));
      document.getElementById(link.dataset.section)?.classList.remove('d-none');
    });
  });
}

function initAdminCharts() {
  if (typeof Chart === 'undefined') return;
  const chartDefaults = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#94a3b8' } } } };

  new Chart(document.getElementById('downloadsChart'), {
    type: 'line',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{ label: 'Downloads', data: [1200, 1900, 3000, 5000, 4200, 6800], borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.1)', fill: true, tension: 0.4 }]
    },
    options: { ...chartDefaults, scales: { y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } }, x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(255,255,255,0.05)' } } } }
  });

  new Chart(document.getElementById('categoryChart'), {
    type: 'doughnut',
    data: {
      labels: WALLPAPER_CATEGORIES.slice(0, 6),
      datasets: [{ data: [15, 12, 18, 10, 14, 11], backgroundColor: ['#6366f1', '#a855f7', '#ec4899', '#fbbf24', '#22c55e', '#3b82f6'] }]
    },
    options: chartDefaults
  });
}

function renderAdminTables() {
  const usersTable = document.getElementById('usersTable');
  if (usersTable) {
    const users = Auth.getAllUsers();
    usersTable.innerHTML = users.map(u => `
      <tr><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td><td>${UI.formatDate(u.createdAt)}</td>
      <td><button class="btn-glass btn-sm"><i class="fas fa-edit"></i></button></td></tr>`).join('');
  }

  const wallpapersTable = document.getElementById('wallpapersTable');
  if (wallpapersTable) {
    wallpapersTable.innerHTML = WALLPAPERS_DATA.slice(0, 20).map(w => `
      <tr><td><img src="${w.image}" style="width:50px;height:30px;object-fit:cover;border-radius:4px;"></td>
      <td>${w.title}</td><td>${w.category}</td><td>${w.downloads}</td>
      <td><span class="status-badge approved">Active</span></td></tr>`).join('');
  }

  const uploadsTable = document.getElementById('uploadsTable');
  if (uploadsTable) {
    const uploads = Storage.get(StorageKeys.PENDING_UPLOADS, []);
    uploadsTable.innerHTML = uploads.length ? uploads.map(u => `
      <tr><td>${u.title}</td><td>${u.category}</td><td>${UI.formatDate(u.date)}</td>
      <td><span class="status-badge pending">Pending</span></td>
      <td><button class="btn-galaxy btn-sm approve-btn" data-id="${u.id}"><i class="fas fa-check"></i></button>
      <button class="btn-glass btn-sm reject-btn" data-id="${u.id}"><i class="fas fa-times"></i></button></td></tr>`).join('')
      : '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No pending uploads</td></tr>';

    uploadsTable.querySelectorAll('.approve-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.showToast('Upload approved!');
        removePendingUpload(btn.dataset.id);
        renderAdminTables();
      });
    });
    uploadsTable.querySelectorAll('.reject-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        UI.showToast('Upload rejected.');
        removePendingUpload(btn.dataset.id);
        renderAdminTables();
      });
    });
  }
}

function removePendingUpload(id) {
  const uploads = Storage.get(StorageKeys.PENDING_UPLOADS, []).filter(u => u.id !== parseInt(id));
  Storage.set(StorageKeys.PENDING_UPLOADS, uploads);
}

function renderAdminNotifications() {
  const container = document.getElementById('adminNotificationsList');
  if (!container) return;
  const notifications = [
    { text: 'New user registration', time: '5 min ago', unread: true },
    { text: 'Wallpaper upload pending approval', time: '1 hour ago', unread: true },
    { text: 'Server backup completed', time: '3 hours ago', unread: false },
    { text: 'Monthly report generated', time: '1 day ago', unread: false }
  ];
  container.innerHTML = notifications.map(n => `
    <div class="notification-item ${n.unread ? 'unread' : ''}">
      <i class="fas fa-bell" style="color:var(--primary-light);"></i>
      <div><div>${n.text}</div><small style="color:var(--text-muted);">${n.time}</small></div>
    </div>`).join('');
}

function initDownloadsPage() {
  const downloads = Storage.getDownloads();
  const container = document.getElementById('downloadsGrid');
  if (!container) return;

  if (downloads.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5">
      <i class="fas fa-download fa-3x mb-3" style="color:var(--text-muted);"></i>
      <p style="color:var(--text-secondary);">No downloads yet. Start exploring!</p>
      <a href="categories.html" class="btn-galaxy mt-3">Browse Wallpapers</a></div>`;
    return;
  }

  const wallpapers = downloads.map(d => WALLPAPERS_DATA.find(w => w.id === d.id) || d);
  container.innerHTML = wallpapers.map(w => WallpaperGallery.renderCard(w)).join('');
  WallpaperGallery.container = container;
  WallpaperGallery.initLazyLoad();
}

function initRatingsPage() {
  const rated = WALLPAPERS_DATA
    .map(w => ({ wallpaper: w, ...Storage.getWallpaperRating(w.id) }))
    .filter(item => item.count > 0)
    .sort((a, b) => b.average - a.average || b.count - a.count);

  const container = document.getElementById('ratingsGrid');
  if (!container) return;

  if (rated.length === 0) {
    container.innerHTML = `<div class="col-12 text-center py-5">
      <i class="fas fa-star fa-3x mb-3" style="color:var(--text-muted);"></i>
      <p style="color:var(--text-secondary);">No user ratings yet. Open a wallpaper and rate it!</p>
      <a href="categories.html" class="btn-galaxy mt-3">Browse Wallpapers</a></div>`;
    return;
  }

  container.innerHTML = rated.map(({ wallpaper, average, count }, i) => `
    <div class="wallpaper-card hover-lift" data-id="${wallpaper.id}">
      <div class="wallpaper-card__img-wrap">
        <span style="position:absolute;top:12px;left:12px;z-index:2;background:var(--gradient-primary);color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.85rem;">#${i + 1}</span>
        <img src="${wallpaper.image}" alt="${wallpaper.title}" loading="lazy">
      </div>
      <div class="wallpaper-card__body">
        <h4 class="wallpaper-card__title">${wallpaper.title}</h4>
        <div class="wallpaper-card__meta">${UI.renderStars(average)}<span class="rating-count">${count} ${count === 1 ? 'rating' : 'ratings'}</span></div>
      </div>
    </div>`).join('');

  container.querySelectorAll('.wallpaper-card').forEach(card => {
    card.addEventListener('click', () => WallpaperGallery.openDetailModal(parseInt(card.dataset.id)));
  });
}

function initContactPage() {
  document.getElementById('contactForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.showToast('Message sent successfully! We will get back to you soon.');
    e.target.reset();
  });
}

function initNewsletter(id) {
  document.getElementById(id)?.addEventListener('click', () => {
    const email = document.getElementById('newsletterEmail')?.value;
    if (email) { UI.showToast('Subscribed successfully!'); document.getElementById('newsletterEmail').value = ''; }
  });
}

function debounce(fn, delay) {
  let timer;
  return (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay); };
}
