/**
 * EMAGE GALAXY - Authentication (LocalStorage Demo)
 */

const Auth = {
  initUsers() {
    if (!Storage.get(StorageKeys.USERS)) {
      Storage.set(StorageKeys.USERS, [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@emagegalaxy.com',
          password: 'admin123',
          role: 'admin',
          createdAt: new Date().toISOString()
        },
        {
          id: 2,
          name: 'Demo User',
          email: 'demo@emagegalaxy.com',
          password: 'demo123',
          role: 'user',
          createdAt: new Date().toISOString()
        }
      ]);
    }
  },

  register(name, email, password) {
    const users = Storage.get(StorageKeys.USERS, []);
    if (users.find(u => u.email === email)) {
      return { success: false, message: 'Email already registered.' };
    }
    const user = {
      id: Date.now(),
      name,
      email,
      password,
      role: 'user',
      createdAt: new Date().toISOString()
    };
    users.push(user);
    Storage.set(StorageKeys.USERS, users);
    return { success: true, message: 'Registration successful! Please login.' };
  },

  login(email, password, remember = false) {
    const users = Storage.get(StorageKeys.USERS, []);
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    const session = { id: user.id, name: user.name, email: user.email, role: user.role };
    Storage.set(StorageKeys.SESSION, session);
    if (remember) Storage.set(StorageKeys.REMEMBER, email);
    Storage.addActivity('login', `Logged in as ${user.name}`);
    return { success: true, user: session };
  },

  logout() {
    Storage.remove(StorageKeys.SESSION);
    window.location.href = 'index.html';
  },

  socialLogin(provider) {
    const session = {
      id: Date.now(),
      name: `${provider} User`,
      email: `${provider.toLowerCase()}@emagegalaxy.com`,
      role: 'user'
    };
    Storage.set(StorageKeys.SESSION, session);
    Storage.addActivity('login', `Logged in via ${provider}`);
    return { success: true, user: session };
  },

  resetPassword(email, newPassword) {
    const users = Storage.get(StorageKeys.USERS, []);
    const index = users.findIndex(u => u.email === email);
    if (index === -1) return { success: false, message: 'Email not found.' };
    users[index].password = newPassword;
    Storage.set(StorageKeys.USERS, users);
    return { success: true, message: 'Password reset successfully!' };
  },

  requireAuth(redirect = 'login.html') {
    if (!Storage.isLoggedIn()) {
      window.location.href = redirect;
      return false;
    }
    return true;
  },

  requireAdmin(redirect = 'index.html') {
    const user = Storage.getCurrentUser();
    if (!user || user.role !== 'admin') {
      window.location.href = redirect;
      return false;
    }
    return true;
  },

  updateProfile(updates) {
    const session = Storage.getCurrentUser();
    if (!session) return false;
    const users = Storage.get(StorageKeys.USERS, []);
    const index = users.findIndex(u => u.id === session.id);
    if (index > -1) {
      Object.assign(users[index], updates);
      Object.assign(session, { name: updates.name || session.name, email: updates.email || session.email });
      Storage.set(StorageKeys.USERS, users);
      Storage.set(StorageKeys.SESSION, session);
      Storage.addActivity('profile', 'Updated profile settings');
      return true;
    }
    return false;
  },

  getAllUsers() {
    return Storage.get(StorageKeys.USERS, []);
  }
};

window.Auth = Auth;
