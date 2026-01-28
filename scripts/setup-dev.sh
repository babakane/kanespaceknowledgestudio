#!/bin/bash

# Local Development & Testing Script

echo "=================================="
echo "Kanespace Development Setup"
echo "=================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi

echo "✅ Node.js: $(node --version)"
echo "✅ NPM: $(npm --version)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm ci || npm install

echo ""
echo "=================================="
echo "Development Commands"
echo "=================================="
echo ""
echo "🚀 Start development server:"
echo "   npm run dev"
echo ""
echo "🔨 Build for production:"
echo "   npm run build"
echo ""
echo "👁️ Preview production build:"
echo "   npm run preview"
echo ""
echo "🧪 Run tests (if configured):"
echo "   npm test"
echo ""
echo "=================================="
echo "Deployment"
echo "=================================="
echo ""
echo "📤 Push to GitHub (auto-deploys to Cloudflare):"
echo "   git add ."
echo "   git commit -m 'Your message'"
echo "   git push origin main"
echo ""
echo "📋 Check deployment status:"
echo "   - GitHub Actions: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/actions"
echo "   - Cloudflare Pages: https://dash.cloudflare.com/pages"
echo ""
echo "✨ Setup complete! Run 'npm run dev' to start."
