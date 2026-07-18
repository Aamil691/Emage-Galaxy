/**
 * EMAGE GALAXY - Access Control (Guest / Login / Prime)
 */

const AccessControl = {
  TIERS: {
    GUEST: 'guest',
    USER: 'user',
    PRIME: 'prime'
  },

  getTier() {
    if (!Storage.isLoggedIn()) return this.TIERS.GUEST;
    if (Storage.getSubscription() === 'prime') return this.TIERS.PRIME;
    return this.TIERS.USER;
  },

  getTierLabel() {
    const labels = {
      guest: 'Guest User',
      user: 'Login User',
      prime: 'Prime User'
    };
    return labels[this.getTier()];
  },

  canBrowse() { return true; },
  canView() { return true; },
  canDownload() { return true; },
  canRate() { return true; },
  canComment() { return Storage.isLoggedIn(); },
  canUpload() { return Storage.isLoggedIn() && Storage.getSubscription() === 'prime'; },

  requireComment(message = 'Please login to post comments.') {
    if (this.canComment()) return true;
    UI.showToast(message);
    return false;
  },

  requireUpload() {
    if (!Storage.isLoggedIn()) {
      UI.showToast('Please login to access upload.');
      setTimeout(() => { window.location.href = 'login.html'; }, 800);
      return false;
    }
    if (!this.canUpload()) {
      UI.showToast('Prime membership required to upload wallpapers.');
      return false;
    }
    return true;
  }
};

window.AccessControl = AccessControl;
