# 🚀 Deployment Guide

## 📦 Build for Production

Before deploying, create an optimized production build:

```bash
npm run build
```

This creates a `dist` folder with optimized files.

---

## 🌐 Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Free hosting
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Perfect for React apps
- ✅ Easy deployment

**Steps:**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
vercel
```

4. **For production:**
```bash
vercel --prod
```

**Or use GitHub integration:**
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Click Deploy

---

### Option 2: Netlify

**Steps:**

1. **Install Netlify CLI:**
```bash
npm install -g netlify-cli
```

2. **Build the project:**
```bash
npm run build
```

3. **Deploy:**
```bash
netlify deploy --prod --dir=dist
```

**Or use drag-and-drop:**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `dist` folder to deploy

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages:**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "homepage": "https://yourusername.github.io/repo-name",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. **Update vite.config.js:**
```javascript
export default defineConfig({
  plugins: [react()],
  base: '/repo-name/'
})
```

4. **Deploy:**
```bash
npm run deploy
```

---

### Option 4: Firebase Hosting

**Steps:**

1. **Install Firebase CLI:**
```bash
npm install -g firebase-tools
```

2. **Login:**
```bash
firebase login
```

3. **Initialize:**
```bash
firebase init hosting
```

4. **Configure:**
- Public directory: `dist`
- Single-page app: Yes
- Automatic builds: No

5. **Build and deploy:**
```bash
npm run build
firebase deploy
```

---

### Option 5: AWS S3 + CloudFront

**Steps:**

1. **Build the project:**
```bash
npm run build
```

2. **Create S3 bucket:**
- Enable static website hosting
- Set index.html as index document

3. **Upload dist folder to S3**

4. **Create CloudFront distribution:**
- Origin: Your S3 bucket
- Enable HTTPS

5. **Update DNS to point to CloudFront**

---

## ⚙️ Environment Configuration

### For Production:

Create `.env.production`:
```env
VITE_API_URL=https://your-api.com
VITE_GPS_DISTANCE_THRESHOLD=90
```

### Access in code:
```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🔒 Important: HTTPS Required

**Camera and GPS features require HTTPS in production!**

All deployment options above provide HTTPS automatically.

### Local HTTPS Testing:

1. **Install mkcert:**
```bash
# Windows (with Chocolatey)
choco install mkcert

# Mac
brew install mkcert
```

2. **Create certificates:**
```bash
mkcert -install
mkcert localhost
```

3. **Update vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('./localhost-key.pem'),
      cert: fs.readFileSync('./localhost.pem'),
    }
  }
})
```

---

## 📱 Mobile App Considerations

### Progressive Web App (PWA):

1. **Install vite-plugin-pwa:**
```bash
npm install -D vite-plugin-pwa
```

2. **Update vite.config.js:**
```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Driver Trip Management',
        short_name: 'TripManager',
        description: 'Manage driver trips with GPS tracking',
        theme_color: '#3B82F6',
        icons: [
          {
            src: 'icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})
```

---

## 🔧 Build Optimization

### 1. Reduce Bundle Size:

**Analyze bundle:**
```bash
npm run build -- --mode analyze
```

**Code splitting:**
```javascript
// Use dynamic imports
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
```

### 2. Image Optimization:

- Compress photos before storage
- Use WebP format
- Implement lazy loading

### 3. Performance:

```javascript
// Add to vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
})
```

---

## 🌍 Custom Domain

### Vercel:
1. Go to project settings
2. Add custom domain
3. Update DNS records

### Netlify:
1. Go to domain settings
2. Add custom domain
3. Configure DNS

---

## 📊 Analytics (Optional)

### Google Analytics:

1. **Install:**
```bash
npm install react-ga4
```

2. **Initialize in App.jsx:**
```javascript
import ReactGA from 'react-ga4';

ReactGA.initialize('G-XXXXXXXXXX');
```

3. **Track page views:**
```javascript
useEffect(() => {
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}, []);
```

---

## 🔍 SEO Optimization

### 1. Meta Tags (already included):
- Title
- Description
- Theme color
- Viewport

### 2. Add robots.txt:
```
User-agent: *
Allow: /
```

### 3. Add sitemap.xml:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourdomain.com/</loc>
    <lastmod>2026-02-02</lastmod>
    <priority>1.0</priority>
  </url>
</urlset>
```

---

## 🐛 Debugging Production Issues

### Enable Source Maps:

```javascript
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: true
  }
})
```

### Error Tracking:

**Sentry:**
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: "production"
});
```

---

## ✅ Pre-Deployment Checklist

- [ ] Test all features locally
- [ ] Build without errors: `npm run build`
- [ ] Test production build: `npm run preview`
- [ ] Check mobile responsiveness
- [ ] Test camera permissions
- [ ] Test GPS permissions
- [ ] Verify all links work
- [ ] Check console for errors
- [ ] Test on different browsers
- [ ] Optimize images
- [ ] Add meta tags
- [ ] Configure HTTPS
- [ ] Set up error tracking
- [ ] Add analytics (optional)
- [ ] Test on real mobile device

---

## 🚀 Quick Deploy Commands

### Vercel:
```bash
npm run build
vercel --prod
```

### Netlify:
```bash
npm run build
netlify deploy --prod --dir=dist
```

### GitHub Pages:
```bash
npm run deploy
```

### Firebase:
```bash
npm run build
firebase deploy
```

---

## 📱 Testing Deployed App

1. **Open on mobile device**
2. **Test camera access**
3. **Test GPS access**
4. **Complete full trip flow**
5. **Check admin dashboard**
6. **Verify notifications**

---

## 🔄 Continuous Deployment

### GitHub Actions (Vercel):

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 🎯 Post-Deployment

1. **Monitor performance**
2. **Check error logs**
3. **Gather user feedback**
4. **Update documentation**
5. **Plan improvements**

---

## 🆘 Troubleshooting

### Camera not working:
- Ensure HTTPS is enabled
- Check browser permissions
- Test on different browsers

### GPS not working:
- Verify HTTPS
- Check location permissions
- Test on mobile device

### Build errors:
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment fails:
- Check build logs
- Verify all dependencies
- Test locally first

---

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

---

**Ready to deploy! 🚀**

Choose your preferred platform and follow the steps above.
