# Vercel Deployment Fix Guide

## Problem
White screen on Vercel deployment caused by missing build configuration.

## Solution Applied

### 1. Created `vercel.json`
Added proper Vercel configuration with SPA routing support.

### 2. Updated `vite.config.js`
- Set `base: './'` for relative paths
- Configured proper build output directory
- Optimized build settings

### 3. Build Verification
The build works locally. Run `npm run build` to verify.

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)
```bash
# Install Vercel CLI globally (if not already installed)
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (from project root)
vercel

# For production deployment
vercel --prod
```

### Option 2: Using Vercel Dashboard
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will auto-detect Vite framework
5. Use these settings:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Click "Deploy"

### Option 3: Push to Git
If you've connected your repo to Vercel:
```bash
git add .
git commit -m "Fix Vercel deployment configuration"
git push
```
Vercel will automatically redeploy.

## Important Notes

1. **The `dist` folder is in `.gitignore`** - This is CORRECT. Vercel builds the app on their servers.
2. **Don't commit the `dist` folder** - Let Vercel build it fresh each time.
3. **Environment Variables** - If you add a backend API later, configure environment variables in Vercel dashboard.

## Troubleshooting

If you still see a white screen:

1. **Check Vercel Build Logs**
   - Go to your Vercel dashboard
   - Click on your deployment
   - Check the "Building" tab for errors

2. **Check Browser Console**
   - Open your deployed site
   - Press F12 to open DevTools
   - Check Console tab for JavaScript errors
   - Check Network tab for failed requests

3. **Verify Build Locally**
   ```bash
   npm run build
   npm run preview
   ```
   Visit http://localhost:4173 to test the production build

## Files Modified
- ✅ Created `vercel.json`
- ✅ Updated `vite.config.js`
- ✅ Verified build works locally

## Next Steps
1. Deploy using one of the options above
2. Test the deployment
3. If issues persist, check the build logs in Vercel dashboard
