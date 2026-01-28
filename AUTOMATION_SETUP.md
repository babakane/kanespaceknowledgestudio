# 🚀 Kanespace Knowledge Studio - Automated Deployment Guide

## 📌 What's Automated?

You now have a **fully automated deployment pipeline** that handles:

✅ **GitHub Actions CI/CD** - Automatic build & test on every push
✅ **Cloudflare Pages Deployment** - Auto-deploy to production
✅ **Environment Variables** - Secure API key management
✅ **Google Site Integration** - Embed code & setup guide
✅ **Pre-deployment Checks** - Build validation before deployment

---

## 🎯 Quick Start

### 1️⃣ Add GitHub Secrets (One-time setup)

Go to: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/settings/secrets/actions

**Add 4 secrets:**

| Secret Name             | Value                      | Where to get                                   |
| ----------------------- | -------------------------- | ---------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Your Cloudflare API Token  | https://dash.cloudflare.com/profile/api-tokens |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare Account ID | https://dash.cloudflare.com (top right)        |
| `VITE_API_KEY`          | Your Google Gemini API Key | https://ai.google.dev/                         |
| `VITE_HF_API_KEY`       | Your HuggingFace API Key   | https://huggingface.co/settings/tokens         |

**How to add secrets:**

1. Click "New repository secret"
2. Enter name & value
3. Click "Add secret"

---

### 2️⃣ Make Changes & Push (Automatic deployment!)

```bash
# Make any changes to your code
# Then:
git add .
git commit -m "Your changes"
git push origin main

# That's it! Cloudflare deploys automatically in 1-2 minutes
```

---

### 3️⃣ Check Deployment Status

**GitHub Actions:**

- https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/actions
- See build logs & any errors

**Cloudflare Pages:**

- https://dash.cloudflare.com/pages
- See live app & deployment history

**Your Live App:**

- https://kanespace-knowledge-studio.pages.dev

---

## 📁 New Files Created

```
.github/workflows/
  └── deploy.yml              # GitHub Actions pipeline
scripts/
  ├── setup-dev.sh           # Linux/Mac development setup
  ├── setup-dev.bat          # Windows development setup
  └── setup-env.sh           # Environment variables setup
DEPLOYMENT_AUTOMATION.md      # Complete automation guide
GOOGLE_SITE_INTEGRATION.md    # Google Site embed instructions
```

---

## 🔄 Deployment Workflow

### Current Automatic Process:

```
You push to GitHub
        ↓
GitHub Actions triggers
        ↓
Install dependencies
        ↓
Build React app
        ↓
Validate build output
        ↓
Deploy to Cloudflare
        ↓
Live at https://kanespace-knowledge-studio.pages.dev
```

---

## 🌐 Embed in Google Site

### Quick Setup:

1. Go to your Google Site
2. Click **Insert** → **Embed**
3. Paste this code:

```html
<iframe
  src="https://kanespace-knowledge-studio.pages.dev"
  width="100%"
  height="800"
  frameborder="0"
  allow="microphone; speaker; camera"
  style="border: none; border-radius: 8px;"
>
</iframe>
```

📖 More options: See [GOOGLE_SITE_INTEGRATION.md](GOOGLE_SITE_INTEGRATION.md)

---

## 🛠️ Local Development

### Start Development Server:

```bash
npm run dev
```

Opens at: http://localhost:5173

### Build for Production:

```bash
npm run build
```

### Preview Production Build:

```bash
npm run preview
```

---

## 📊 Monitoring & Logs

### GitHub Actions Logs:

1. Go to: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/actions
2. Click on any workflow run
3. View build log & see what happened

### Cloudflare Logs:

1. Go to: https://dash.cloudflare.com
2. Click **Pages** → **kanespace-knowledge-studio**
3. View Analytics, Deployments, and Logs

---

## 🚨 Troubleshooting

### Build Fails?

```
Check GitHub Actions logs:
https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/actions

Common issues:
- Missing environment variables (check GitHub Secrets)
- Node dependencies not installed
- TypeScript errors in code
```

### App Not Loading?

```
1. Verify URL: https://kanespace-knowledge-studio.pages.dev
2. Check Cloudflare Pages: https://dash.cloudflare.com/pages
3. Clear cache: Ctrl+Shift+Delete
4. Check browser console: F12 → Console tab
```

### API/Audio Not Working?

```
1. Verify API keys in GitHub Secrets
2. Check browser permissions for microphone
3. Review browser console for error messages (F12)
4. Check Cloudflare logs for API errors
```

---

## 📋 Pre-Deployment Checklist

Before pushing to GitHub:

- [ ] Code changes tested locally (`npm run dev`)
- [ ] No console errors (`F12` → Console)
- [ ] Build succeeds (`npm run build`)
- [ ] All files added (`git add .`)
- [ ] Commit message is descriptive

---

## 🔐 Security Best Practices

### Environment Variables:

- ✅ Stored securely in GitHub Secrets
- ✅ Never commit `.env` file with real keys
- ✅ API keys visible only to GitHub Actions

### Deployment:

- ✅ Automatic HTTPS
- ✅ Security headers configured
- ✅ Global CDN with DDoS protection
- ✅ Cache headers optimized

---

## 🎨 Customize Your Deployment

### Change Cloudflare URL:

1. Add custom domain in Cloudflare Dashboard
2. Update embed code with your domain
3. Google Site automatically uses new URL

### Modify Build Settings:

Edit `.github/workflows/deploy.yml` if needed

### Add Custom Environment Variables:

1. Add to GitHub Secrets
2. Reference in `.github/workflows/deploy.yml`

---

## 📞 Support Resources

| Resource              | Link                                                |
| --------------------- | --------------------------------------------------- |
| Cloudflare Pages Docs | https://developers.cloudflare.com/pages/            |
| GitHub Actions Docs   | https://docs.github.com/en/actions                  |
| Vite Documentation    | https://vitejs.dev/                                 |
| React Documentation   | https://react.dev/                                  |
| Wrangler CLI          | https://developers.cloudflare.com/workers/wrangler/ |

---

## ✨ Summary

You now have:

- ✅ **Automated CI/CD** with GitHub Actions
- ✅ **Automatic deployments** to Cloudflare Pages
- ✅ **Secure API key** management
- ✅ **Google Site** integration ready
- ✅ **Pre-deployment validation**
- ✅ **Production monitoring**

### Next Steps:

1. ✅ Add GitHub Secrets (from Step 1)
2. ✅ Make a change & push to GitHub
3. ✅ Watch it deploy automatically!
4. ✅ Embed in Google Site (Step 3)

**You're all set! Just push to GitHub and let automation handle the rest.** 🚀
