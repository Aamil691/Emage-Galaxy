# 🚀 GitHub Live Deployment Guide

## Quick Deployment Steps (5 minutes)

### Step 1: Install Git (if not already installed)
- Download from: https://git-scm.com/
- Install and restart your computer

### Step 2: Create GitHub Account
- Go to: https://github.com/signup
- Create an account (if you don't have one)

### Step 3: Create a New Repository

1. Log in to GitHub
2. Click the **+** icon in the top-right corner
3. Select **New repository**
4. Fill in:
   - **Repository name:** `emage-galaxy`
   - **Description:** "Premium HD & 4K Wallpaper Collection"
   - **Visibility:** Public
5. Click **Create repository**

### Step 4: Push Your Code to GitHub

Open Command Prompt/PowerShell in your project folder and run:

```bash
# Navigate to your project folder
cd "C:\Users\arbaz\Downloads\New folder (6)"

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: EMAGE GALAXY website"

# Add remote (replace USERNAME with your GitHub username)
git remote add origin https://github.com/USERNAME/emage-galaxy.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**Enter your GitHub credentials when prompted**

### Step 5: Enable GitHub Pages

1. Go to your repository: https://github.com/USERNAME/emage-galaxy
2. Click **Settings** (top menu)
3. Click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select "Deploy from a branch"
   - **Branch:** Select "main"
   - **Folder:** Select "/(root)"
5. Click **Save**

### Step 6: Access Your Live Site

After 1-2 minutes, your site will be live at:

```
https://USERNAME.github.io/emage-galaxy/
```

Replace **USERNAME** with your actual GitHub username.

---

## 📱 Troubleshooting

### "fatal: not a git repository"
```bash
git init
```

### "fatal: Authentication failed"
- Go to GitHub Settings → Developer settings → Personal access tokens
- Create a new token with "repo" access
- Use the token as password instead of your GitHub password

### Site not loading
- Wait 2-3 minutes for GitHub Pages to build
- Clear browser cache (Ctrl + Shift + Delete)
- Check if repository is public (Settings → Visibility)

### Want to use a custom domain?
In GitHub Pages settings, add your custom domain under "Custom domain"

---

## 🔄 Updating Your Site After Changes

When you make changes locally:

```bash
git add .
git commit -m "Your commit message"
git push origin main
```

Changes will be live in 1-2 minutes!

---

## ✨ Additional Features You Can Add

1. **Custom Domain** - Map your own domain name
2. **SSL Certificate** - Automatic HTTPS (included with GitHub Pages)
3. **GitHub Actions** - Automate deployments
4. **Analytics** - Track visitor statistics

---

Need help? Visit: https://docs.github.com/en/pages
