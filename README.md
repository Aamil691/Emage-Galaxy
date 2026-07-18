# EMAGE GALAXY - Premium Wallpaper Collection 🌌

Every Image Tells A Tale. A modern, fully-featured wallpaper platform with 100+ premium HD & 4K wallpapers.

## ✨ Features

- 🖼️ **100+ Premium Wallpapers** - Curated collections in stunning HD & 4K
- ⭐ **Rating System** - User ratings with star-based feedback
- 💬 **Comments** - Community engagement with wallpaper comments
- ❤️ **Favorites** - Save your favorite wallpapers
- 📥 **Downloads** - Download wallpapers in high resolution
- 🎨 **Dark/Light Theme** - Toggle between themes
- 👤 **User Authentication** - Demo login with dashboard
- 📱 **Responsive Design** - Works on all devices
- 🌈 **Beautiful UI** - Modern glassmorphism design

## 🚀 Live Demo

Visit the live site: [EMAGE GALAXY](https://yourusername.github.io/emage-galaxy/)

## 🛠️ Tech Stack

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with variables and animations
- **JavaScript** - Vanilla JS (no frameworks)
- **Bootstrap 5** - Responsive grid system
- **FontAwesome 6** - Icons
- **AOS Library** - Scroll animations
- **Swiper.js** - Image carousels
- **LocalStorage** - Client-side data persistence

## 📦 Installation

### Local Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/emage-galaxy.git
cd emage-galaxy
```

2. **Open in browser**
   - Simply open `index.html` in any modern web browser
   - Or use a local server (recommended):
     ```bash
     python -m http.server 8000
     # or with Node.js
     npx http-server
     ```

3. **Access the site**
   - Navigate to `http://localhost:8000`

## 🔐 Demo Credentials

- **Demo User:**
  - Email: `demo@emagegalaxy.com`
  - Password: `demo123`

- **Admin User:**
  - Email: `admin@emagegalaxy.com`
  - Password: `admin123`

## 📁 Project Structure

```
emage-galaxy/
├── index.html              # Home page
├── categories.html         # Wallpaper categories
├── login.html             # Login page
├── register.html          # Registration page
├── dashboard.html         # User dashboard
├── admin.html             # Admin panel
├── download.html          # Download history
├── subscription.html      # Premium plans
├── contact.html           # Contact form
├── about.html             # About page
├── privacy.html           # Privacy policy
├── terms.html             # Terms of service
│
├── js/
│   ├── main.js            # Main application logic
│   ├── components.js      # UI components (navbar, footer, etc.)
│   ├── wallpapers.js      # Wallpaper gallery logic
│   ├── wallpapers-data.js # 100+ wallpaper data
│   ├── storage.js         # LocalStorage utilities
│   ├── auth.js            # Authentication logic
│   ├── theme.js           # Theme management
│   └── access.js          # Access control
│
├── css/
│   ├── variables.css      # CSS custom properties
│   ├── main.css           # Main styles
│   ├── components.css     # Component styles
│   ├── pages.css          # Page-specific styles
│   ├── responsive.css     # Mobile responsive styles
│   ├── theme.css          # Theme overrides
│   └── animations.css     # Animation styles
│
├── assets/
│   ├── logo.png           # Site logo
│   ├── favicon.svg        # Favicon
│   ├── R.jpg              # Dark theme background
│   └── Nature-Wallpaper.jpg # Light theme background
│
└── README.md              # This file
```

## 🎨 Customization

### Change Site Colors

Edit `variables.css`:
```css
:root {
  --primary: #6366f1;           /* Change primary color */
  --primary-light: #818cf8;
  --accent: #a855f7;            /* Change accent color */
  --gold: #fbbf24;              /* Change gold color */
}
```

### Add More Wallpapers

Edit `wallpapers-data.js` and add to the `WALLPAPER_CATEGORIES` array and `TITLE_PREFIXES` object.

### Change Theme

Edit `theme.js` to modify default theme settings.

## 🚀 Deployment to GitHub Pages

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Sign in or create an account
3. Click **New Repository**
4. Name it: `emage-galaxy` (or any name)
5. Click **Create Repository**

### Step 2: Initialize Git & Push Code

```bash
cd "New folder (6)"

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: EMAGE GALAXY website"

# Add remote repository (replace with your repo URL)
git remote add origin https://github.com/yourusername/emage-galaxy.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under "Build and deployment":
   - Source: Select **Deploy from a branch**
   - Branch: Select **main**
   - Folder: Select **/(root)**
4. Click **Save**
5. Wait 1-2 minutes for the site to build

### Step 4: Access Your Live Site

Your site will be live at:
```
https://yourusername.github.io/emage-galaxy/
```

## 📝 Notes

- This is a **static website** - perfect for GitHub Pages
- All data is stored in **LocalStorage** (browser-based)
- No backend server required
- Works completely offline after first load

## 🤝 Contributing

Feel free to fork and submit pull requests!

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created by EMAGE Team

---

**Made with ❤️ by EMAGE Galaxy**
