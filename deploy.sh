#!/bin/bash
# EMAGE GALAXY - GitHub Pages Deployment Script
# Run this script from your project root directory

echo "🚀 EMAGE GALAXY GitHub Pages Deployment"
echo "======================================="
echo ""

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "❌ Git is not installed. Download from: https://git-scm.com/"
    exit 1
fi

echo "✅ Git found"
echo ""

# Initialize git repository
if [ ! -d .git ]; then
    echo "📁 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📝 Configuring git..."

# Add all files
echo "Adding files..."
git add .

# Create initial commit
if git diff --cached --quiet; then
    echo "✅ Repository up to date"
else
    echo "Creating commit..."
    git commit -m "EMAGE GALAXY: Premium Wallpaper Collection Website"
    echo "✅ Commit created"
fi

echo ""
echo "🌐 Next Steps:"
echo "=============="
echo ""
echo "1. Create a GitHub account: https://github.com/signup"
echo "2. Create a new repository named 'emage-galaxy'"
echo "3. Run these commands:"
echo ""
echo "   git remote add origin https://github.com/YOUR_USERNAME/emage-galaxy.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Go to Settings → Pages"
echo "5. Enable GitHub Pages with main branch"
echo ""
echo "✨ Your site will be live at:"
echo "   https://YOUR_USERNAME.github.io/emage-galaxy/"
echo ""
