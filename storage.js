/**
 * EMAGE GALAXY - LocalStorage Utilities
 */

const StorageKeys = {
  THEME: 'emage_theme',
  USER: 'emage_user',
  USERS: 'emage_users',
  SESSION: 'emage_session',
  FAVORITES: 'emage_favorites',
  DOWNLOADS: 'emage_downloads',
  SUBSCRIPTION: 'emage_subscription',
  WELCOME_SHOWN: 'emage_welcome_shown',
  VISITED_IPS: 'emage_visited_ips',
  COMMENTS: 'emage_comments',
  UPLOADS: 'emage_uploads',
  PENDING_UPLOADS: 'emage_pending_uploads',
  ACTIVITY: 'emage_activity',
  REMEMBER: 'emage_remember',
  RATINGS: 'emage_ratings'
};

const Storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  remove(key) {
    localStorage.removeItem(key);
  },

  getFavorites() {
    return this.get(StorageKeys.FAVORITES, []);
  },

  toggleFavorite(wallpaperId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(wallpaperId);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(wallpaperId);
    }
    this.set(StorageKeys.FAVORITES, favorites);
    return favorites.includes(wallpaperId);
  },

  isFavorite(wallpaperId) {
    return this.getFavorites().includes(wallpaperId);
  },

  addDownload(wallpaper) {
    const downloads = this.get(StorageKeys.DOWNLOADS, []);
    const existing = downloads.find(d => d.id === wallpaper.id);
    if (!existing) {
      downloads.unshift({
        id: wallpaper.id,
        title: wallpaper.title,
        category: wallpaper.category,
        image: wallpaper.image,
        resolution: wallpaper.resolution,
        date: new Date().toISOString()
      });
    }
    this.set(StorageKeys.DOWNLOADS, downloads.slice(0, 100));
    this.addActivity('download', `Downloaded "${wallpaper.title}"`);
  },

  getDownloads() {
    return this.get(StorageKeys.DOWNLOADS, []);
  },

  addActivity(type, message) {
    const activity = this.get(StorageKeys.ACTIVITY, []);
    activity.unshift({
      type,
      message,
      date: new Date().toISOString()
    });
    this.set(StorageKeys.ACTIVITY, activity.slice(0, 50));
  },

  getActivity() {
    return this.get(StorageKeys.ACTIVITY, []);
  },

  getSubscription() {
    return this.get(StorageKeys.SUBSCRIPTION, 'guest');
  },

  setSubscription(plan) {
    this.set(StorageKeys.SUBSCRIPTION, plan);
    this.addActivity('subscription', `Subscribed to ${plan} plan`);
  },

  getCurrentUser() {
    return this.get(StorageKeys.SESSION, null);
  },

  getLoggedInUser() {
    return this.getCurrentUser();
  },

  isLoggedIn() {
    return !!this.getCurrentUser();
  },

  logout() {
    this.remove(StorageKeys.SESSION);
  },

  _getRatingUserKey() {
    const user = this.getCurrentUser();
    return user ? `user_${user.email}` : 'guest';
  },

  getRatings() {
    return this.get(StorageKeys.RATINGS, {});
  },

  getWallpaperRating(wallpaperId) {
    const data = this.getRatings()[wallpaperId];
    const userRating = this.getUserWallpaperRating(wallpaperId);

    if (!data?.scores?.length) {
      return { average: 0, count: 0, userRating };
    }

    const sum = data.scores.reduce((total, score) => total + score, 0);
    return {
      average: sum / data.scores.length,
      count: data.scores.length,
      userRating
    };
  },

  getUserWallpaperRating(wallpaperId) {
    const data = this.getRatings()[wallpaperId];
    if (!data?.byUser) return null;
    return data.byUser[this._getRatingUserKey()] ?? null;
  },

  getComments(wallpaperId) {
    const all = this.get(StorageKeys.COMMENTS, {});
    return all[wallpaperId] || [];
  },

  addComment(wallpaperId, text) {
    const user = this.getCurrentUser();
    if (!user) return null;

    const all = this.get(StorageKeys.COMMENTS, {});
    if (!all[wallpaperId]) all[wallpaperId] = [];

    const comment = {
      id: Date.now(),
      author: user.name,
      text: text.trim(),
      time: new Date().toISOString(),
      userId: user.id
    };

    all[wallpaperId].unshift(comment);
    this.set(StorageKeys.COMMENTS, all);
    this.addActivity('comment', `Commented on wallpaper #${wallpaperId}`);
    return comment;
  },

  hasVisitedIP(ip) {
    const visited = this.get(StorageKeys.VISITED_IPS, []);
    return visited.includes(ip);
  },

  markIPVisited(ip) {
    const visited = this.get(StorageKeys.VISITED_IPS, []);
    if (!visited.includes(ip)) {
      visited.push(ip);
      this.set(StorageKeys.VISITED_IPS, visited);
    }
    this.set(StorageKeys.WELCOME_SHOWN, true);
  },

  setWallpaperRating(wallpaperId, value) {
    const rating = Math.min(5, Math.max(1, Math.round(Number(value))));
    const all = this.getRatings();
    const userKey = this._getRatingUserKey();

    if (!all[wallpaperId]) {
      all[wallpaperId] = { scores: [], byUser: {} };
    }

    const entry = all[wallpaperId];
    const previous = entry.byUser[userKey];

    if (previous) {
      const index = entry.scores.indexOf(previous);
      if (index > -1) entry.scores[index] = rating;
    } else {
      entry.scores.push(rating);
    }

    entry.byUser[userKey] = rating;
    this.set(StorageKeys.RATINGS, all);
    this.addActivity('rating', `Rated wallpaper #${wallpaperId} ${rating} stars`);
    return this.getWallpaperRating(wallpaperId);
  }
};

window.StorageKeys = StorageKeys;
window.Storage = Storage;
