# Google Site Integration Guide

## Overview
This guide explains how to embed your Kanespace Knowledge Studio app into your Google Site.

---

## Option 1: Embed using Google Sites Embed Element (Recommended)

### Step 1: Get Your App URL
Your Cloudflare Pages URL: `https://kanespace-knowledge-studio.pages.dev`

### Step 2: Add to Google Site
1. Open your Google Site (https://sites.google.com)
2. Edit the page where you want to embed the app
3. Click **Insert** → **Embed** (or search for "Embed")
4. Paste this code:

```html
<iframe 
  src="https://kanespace-knowledge-studio.pages.dev" 
  width="100%" 
  height="800" 
  frameborder="0" 
  allow="microphone; speaker; camera"
  style="border: none; border-radius: 8px;">
</iframe>
```

### Step 3: Customize (Optional)
- Adjust `height="800"` to your preferred height (in pixels)
- Change `width="100%"` for custom width
- Add `allowfullscreen` if you want full-screen capability

---

## Option 2: Link to App (Simple Alternative)

If embedding doesn't work, create a link:

1. Click **Insert** → **Link**
2. Enter: `https://kanespace-knowledge-studio.pages.dev`
3. Display text: "Open Kanespace Knowledge Studio"

---

## Option 3: Multiple Pages/Tabs

Create separate pages for different features:

**Main Tab:**
```html
<iframe 
  src="https://kanespace-knowledge-studio.pages.dev" 
  width="100%" 
  height="1000" 
  frameborder="0" 
  allow="microphone; speaker; camera">
</iframe>
```

**Documentation Tab:**
```html
<iframe 
  src="https://your-documentation-url.com" 
  width="100%" 
  height="800" 
  frameborder="0">
</iframe>
```

---

## Troubleshooting

### App Not Loading?
- Check URL is correct: `https://kanespace-knowledge-studio.pages.dev`
- Ensure Cloudflare deployment is complete
- Clear browser cache (Ctrl+Shift+Delete)

### Audio/Microphone Not Working?
- Add this to iframe: `allow="microphone; speaker; camera"`
- Ensure browser permissions are granted
- Check browser console for errors (F12)

### Sizing Issues?
- Adjust `height` value (try 800-1200 pixels)
- Use `height="100vh"` for full viewport height

---

## Advanced: Custom Domain

Once you add a custom domain to Cloudflare Pages:

1. Go to Cloudflare Dashboard → Pages → kanespace-knowledge-studio
2. Custom domain → Add domain
3. Update iframe URL to your custom domain:

```html
<iframe 
  src="https://your-custom-domain.com" 
  width="100%" 
  height="800" 
  frameborder="0" 
  allow="microphone; speaker; camera">
</iframe>
```

---

## Mobile Optimization

For mobile-responsive embedding:

```html
<div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe 
    src="https://kanespace-knowledge-studio.pages.dev" 
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
    allow="microphone; speaker; camera">
  </iframe>
</div>
```

---

## Need Help?

- Cloudflare Status: https://dash.cloudflare.com
- Check Deployment: https://github.com/babakane/KaneSpace-Knowledge-Base-Studio/deployments
- View App Logs: Cloudflare Dashboard → Pages → Analytics
