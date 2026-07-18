/**
 * EMAGE GALAXY - Wallpaper Gallery Logic
 */

const WallpaperGallery = {
  currentFilter: 'all',
  searchQuery: '',

  init(options = {}) {
    this.container = document.querySelector(options.container || '#wallpaperGrid');
    this.limit = options.limit || null;
    this.filter = options.filter || null;
    this.showFilters = options.showFilters !== false;

    if (options.category) this.currentFilter = options.category;
    if (options.search) this.searchQuery = options.search;

    this.parseURLParams();
    if (this.showFilters) this.renderFilterBar();
    this.render();
    this.bindEvents();
  },

  parseURLParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('category')) this.currentFilter = params.get('category');
    if (params.get('search')) this.searchQuery = params.get('search');
  },

  getFilteredWallpapers() {
    let wallpapers = [...WALLPAPERS_DATA];

    if (this.filter === 'trending') wallpapers = wallpapers.filter(w => w.trending);
    else if (this.filter === 'featured') wallpapers = wallpapers.filter(w => w.featured);
    else if (this.filter === 'new') wallpapers = wallpapers.filter(w => w.isNew);
    else if (this.filter === 'editor') wallpapers = wallpapers.filter(w => w.editorPick);

    if (this.currentFilter !== 'all') {
      wallpapers = wallpapers.filter(w => w.category === this.currentFilter);
    }

    if (this.searchQuery) {
      const q = this.searchQuery.toLowerCase();
      wallpapers = wallpapers.filter(w =>
        w.title.toLowerCase().includes(q) ||
        w.category.toLowerCase().includes(q) ||
        w.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    if (this.limit) wallpapers = wallpapers.slice(0, this.limit);
    return wallpapers;
  },

  renderFilterBar() {
    const bar = document.querySelector('#filterBar');
    if (!bar) return;

    let html = `<button class="filter-btn ${this.currentFilter === 'all' ? 'active' : ''}" data-filter="all">All</button>`;
    WALLPAPER_CATEGORIES.forEach(cat => {
      html += `<button class="filter-btn ${this.currentFilter === cat ? 'active' : ''}" data-filter="${cat}">${cat}</button>`;
    });
    bar.innerHTML = html;

    bar.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentFilter = btn.dataset.filter;
        bar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render();
      });
    });
  },

  renderCard(wallpaper) {
    const isFav = Storage.isFavorite(wallpaper.id);
    const { average, count } = Storage.getWallpaperRating(wallpaper.id);
    const ratingHtml = count > 0
      ? UI.renderStars(average)
      : '<span class="rating-value rating-value--empty">Not rated yet</span>';

    return `
      <div class="wallpaper-card hover-lift" data-id="${wallpaper.id}" data-aos="fade-up">
        <div class="wallpaper-card__img-wrap">
          <img class="lazy" data-src="${wallpaper.image}" alt="${wallpaper.title}" loading="lazy">
          <div class="wallpaper-card__actions">
            <button class="wallpaper-action-btn fav-btn ${isFav ? 'active' : ''}" data-id="${wallpaper.id}" title="Favourite">
              <i class="fas fa-heart"></i>
            </button>
            <button class="wallpaper-action-btn download-btn" data-id="${wallpaper.id}" title="Download">
              <i class="fas fa-download"></i>
            </button>
          </div>
          <div class="wallpaper-card__overlay">
            <button class="btn-galaxy btn-sm preview-btn" data-id="${wallpaper.id}"><i class="fas fa-eye"></i> Preview</button>
          </div>
        </div>
        <div class="wallpaper-card__body">
          <h4 class="wallpaper-card__title">${wallpaper.title}</h4>
          <div class="wallpaper-card__meta">
            <span class="wallpaper-card__category">${wallpaper.category}</span>
            ${ratingHtml}
          </div>
        </div>
      </div>
    `;
  },

  render() {
    if (!this.container) return;
    const wallpapers = this.getFilteredWallpapers();

    if (wallpapers.length === 0) {
      this.container.innerHTML = `<div class="col-12 text-center py-5"><i class="fas fa-search fa-3x mb-3" style="color:var(--text-muted);"></i><p style="color:var(--text-secondary);">No wallpapers found.</p></div>`;
      return;
    }

    this.container.innerHTML = wallpapers.map(w => this.renderCard(w)).join('');
    this.initLazyLoad();
    if (typeof AOS !== 'undefined') AOS.refresh();
  },

  initLazyLoad() {
    const images = this.container.querySelectorAll('img.lazy');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.add('loaded');
            img.classList.remove('lazy');
            observer.unobserve(img);
          }
        });
      }, { rootMargin: '100px' });
      images.forEach(img => observer.observe(img));
    } else {
      images.forEach(img => { img.src = img.dataset.src; img.classList.add('loaded'); });
    }
  },

  bindEvents() {
    document.addEventListener('click', (e) => {
      const previewBtn = e.target.closest('.preview-btn');
      const card = e.target.closest('.wallpaper-card');
      const favBtn = e.target.closest('.fav-btn');
      const downloadBtn = e.target.closest('.download-btn');

      if (favBtn) {
        e.stopPropagation();
        const id = parseInt(favBtn.dataset.id);
        const isFav = Storage.toggleFavorite(id);
        favBtn.classList.toggle('active', isFav);
        UI.showToast(isFav ? 'Added to favourites!' : 'Removed from favourites');
        return;
      }

      if (downloadBtn) {
        e.stopPropagation();
        const wallpaper = WALLPAPERS_DATA.find(w => w.id === parseInt(downloadBtn.dataset.id));
        if (wallpaper) this.downloadWallpaper(wallpaper);
        return;
      }

      const id = previewBtn?.dataset.id || card?.dataset.id;
      if (id) this.openDetailModal(parseInt(id));
    });
  },

  downloadWallpaper(wallpaper) {
    Storage.addDownload(wallpaper);
    const link = document.createElement('a');
    link.href = wallpaper.imageHD;
    link.download = `${wallpaper.title.replace(/\s+/g, '-')}.jpg`;
    link.target = '_blank';
    link.click();
    UI.showToast(`Downloading "${wallpaper.title}"...`);
  },

  renderCommentsHTML(wallpaperId) {
    const storedComments = Storage.getComments(wallpaperId);
    const demoComments = DEMO_COMMENTS.map(c => ({
      author: c.author,
      text: c.text,
      time: c.time,
      isDemo: true
    }));
    const allComments = [...storedComments, ...demoComments];
    const canComment = AccessControl.canComment();

    const commentForm = canComment
      ? `<div class="mt-3 mb-3">
          <textarea class="form-glass" rows="2" placeholder="Write a comment..." id="commentInput"></textarea>
          <button class="btn-galaxy btn-sm mt-2" id="postCommentBtn"><i class="fas fa-paper-plane"></i> Post Comment</button>
        </div>`
      : `<div class="comment-login-prompt mt-3 mb-3">
          <i class="fas fa-lock mb-2" style="color:var(--primary-light);"></i>
          <p class="mb-2">Comments are available for <strong>Login Users</strong> only.</p>
          <a href="login.html" class="btn-galaxy btn-sm"><i class="fas fa-sign-in-alt"></i> Login to Comment</a>
        </div>`;

    const commentsList = allComments.length
      ? allComments.map(c => `
          <div class="comment-item">
            <div class="comment-avatar">${c.author.charAt(0)}</div>
            <div class="comment-content">
              <div class="comment-author">${c.author}</div>
              <div class="comment-text">${c.text}</div>
              <div class="comment-time">${c.isDemo ? c.time : UI.formatDate(c.time)}</div>
            </div>
          </div>`).join('')
      : '<p style="color:var(--text-muted);font-size:0.9rem;">No comments yet. Be the first!</p>';

    return `
      <div class="comments-section" id="commentsSection">
        <h6><i class="fas fa-comments"></i> Comments (${allComments.length})</h6>
        ${commentForm}
        <div id="commentsList">${commentsList}</div>
      </div>`;
  },

  openDetailModal(id) {
    const wallpaper = WALLPAPERS_DATA.find(w => w.id === id);
    if (!wallpaper) return;

    let modal = document.getElementById('wallpaperDetailModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'modal fade modal-galaxy';
      modal.id = 'wallpaperDetailModal';
      modal.innerHTML = `<div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"></h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body" id="wallpaperDetailBody"></div></div></div>`;
      document.body.appendChild(modal);
    }

    const related = WALLPAPERS_DATA
      .filter(w => w.category === wallpaper.category && w.id !== wallpaper.id)
      .slice(0, 3);

    const isFav = Storage.isFavorite(wallpaper.id);

    modal.querySelector('.modal-title').textContent = wallpaper.title;
    modal.querySelector('#wallpaperDetailBody').innerHTML = `
      <img src="${wallpaper.imageHD}" alt="${wallpaper.title}" class="wallpaper-detail-img">
      <div class="row mt-3">
        <div class="col-md-8">
          <p style="color:var(--text-secondary);margin-bottom:0.5rem;">
            <strong>Category:</strong> ${wallpaper.category} |
            <strong>Resolution:</strong> ${wallpaper.resolution} |
            <strong>Downloads:</strong> ${UI.formatNumber(wallpaper.downloads)}
          </p>
          <div class="wallpaper-detail-tags">
            ${wallpaper.tags.map(t => `<span>${t}</span>`).join('')}
          </div>
          ${UI.renderRatingSummary(wallpaper.id)}
        </div>
        <div class="col-md-4 d-flex flex-column gap-2 mt-3 mt-md-0">
          <button class="btn-galaxy modal-download-btn" data-id="${wallpaper.id}"><i class="fas fa-download"></i> Download HD</button>
          <button class="btn-outline-galaxy modal-fav-btn ${isFav ? 'active' : ''}" data-id="${wallpaper.id}">
            <i class="fas fa-heart"></i> ${isFav ? 'Favourited' : 'Add to Favourites'}
          </button>
        </div>
      </div>
      ${this.renderCommentsHTML(wallpaper.id)}
      <div class="mt-4">
        <h6><i class="fas fa-images"></i> Related Wallpapers</h6>
        <div class="related-wallpapers">
          ${related.map(r => `<img src="${r.image}" alt="${r.title}" data-id="${r.id}" class="related-img">`).join('')}
        </div>
      </div>
    `;

    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();

    modal.querySelector('.modal-download-btn')?.addEventListener('click', () => this.downloadWallpaper(wallpaper));
    modal.querySelector('.modal-fav-btn')?.addEventListener('click', (e) => {
      const isFavNow = Storage.toggleFavorite(wallpaper.id);
      e.currentTarget.innerHTML = `<i class="fas fa-heart"></i> ${isFavNow ? 'Favourited' : 'Add to Favourites'}`;
      UI.showToast(isFavNow ? 'Added to favourites!' : 'Removed from favourites');
    });

    this.bindCommentHandler(modal, wallpaper.id);

    modal.querySelectorAll('.related-img').forEach(img => {
      img.addEventListener('click', () => {
        bsModal.hide();
        setTimeout(() => this.openDetailModal(parseInt(img.dataset.id)), 300);
      });
    });

    this.bindRatingStars(modal, wallpaper.id);
  },

  bindCommentHandler(modal, wallpaperId) {
    const btn = modal.querySelector('#postCommentBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      if (!AccessControl.requireComment()) return;
      const input = modal.querySelector('#commentInput');
      const text = input?.value.trim();
      if (!text) {
        UI.showToast('Please write a comment first.');
        return;
      }
      Storage.addComment(wallpaperId, text);
      const section = modal.querySelector('#commentsSection');
      if (section) section.outerHTML = this.renderCommentsHTML(wallpaperId);
      this.bindCommentHandler(modal, wallpaperId);
      UI.showToast('Comment posted successfully!');
    });
  },

  bindRatingStars(modal, wallpaperId) {
    const container = modal.querySelector('.interactive-rating');
    if (!container) return;

    const updateStars = (value) => {
      container.querySelectorAll('.star-btn').forEach(star => {
        const starValue = parseInt(star.dataset.value, 10);
        star.classList.remove('far', 'fas', 'empty', 'fa-star', 'fa-star-half-alt');
        if (starValue <= value) {
          star.classList.add('fas', 'fa-star');
        } else {
          star.classList.add('far', 'fa-star', 'empty');
        }
      });
    };

    container.querySelectorAll('.star-btn').forEach(star => {
      star.addEventListener('mouseenter', () => updateStars(parseInt(star.dataset.value, 10)));

      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value, 10);
        const result = Storage.setWallpaperRating(wallpaperId, value);
        const block = modal.querySelector('.wallpaper-rating-block');
        if (block) block.outerHTML = UI.renderRatingSummary(wallpaperId);
        this.bindRatingStars(modal, wallpaperId);
        UI.showToast(`Thanks! You rated ${value} star${value > 1 ? 's' : ''}.`);
        this.refreshVisibleRatings(wallpaperId, result);
      });
    });

    container.addEventListener('mouseleave', () => {
      const userRating = Storage.getUserWallpaperRating(wallpaperId) || 0;
      updateStars(userRating);
    });
  },

  refreshVisibleRatings(wallpaperId, ratingInfo) {
    document.querySelectorAll(`.wallpaper-card[data-id="${wallpaperId}"] .wallpaper-card__meta`).forEach(meta => {
      const category = meta.querySelector('.wallpaper-card__category');
      const categoryHtml = category ? category.outerHTML : '';
      const ratingHtml = ratingInfo.count > 0
        ? UI.renderStars(ratingInfo.average)
        : '<span class="rating-value rating-value--empty">Not rated yet</span>';
      meta.innerHTML = `${categoryHtml}${ratingHtml}`;
    });
  },

  renderCategories(container) {
    if (!container) return;
    container.innerHTML = WALLPAPER_CATEGORIES.map((cat, i) => {
      const count = WALLPAPERS_DATA.filter(w => w.category === cat).length;
      const seed = cat.toLowerCase();
      return `
        <div class="col-6 col-md-4 col-lg-3" data-aos="fade-up" data-aos-delay="${i * 50}">
          <a href="categories.html?category=${encodeURIComponent(cat)}" class="category-card d-block">
            <img src="https://picsum.photos/seed/cat-${seed}/400/300" alt="${cat}" loading="lazy">
            <div class="category-card__overlay">
              <span class="category-card__name"><i class="fas ${CATEGORY_ICONS[cat]}"></i> ${cat}</span>
              <span class="category-card__count">${count} wallpapers</span>
            </div>
          </a>
        </div>
      `;
    }).join('');
  }
};

window.WallpaperGallery = WallpaperGallery;
