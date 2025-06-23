# Netlify Deployment Guide

## Quick Setup

Your personal finance tracker is ready for Netlify deployment. Follow these steps:

### 1. Build the Application
Run the build command to prepare your files:
```bash
npm run build
```

### 2. Deploy to Netlify

#### Option A: Drag & Drop (Easiest)
1. Go to [Netlify](https://netlify.com)
2. Drag the `dist/public` folder to the deployment area
3. Your site will be live instantly

#### Option B: Git Integration
1. Push your code to GitHub/GitLab
2. Connect your repository to Netlify
3. Use these build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist/public`

### 3. Environment Variables
In your Netlify dashboard, add these environment variables:
- `VITE_FIREBASE_API_KEY`: Your Firebase API key
- `VITE_FIREBASE_APP_ID`: Your Firebase App ID  
- `VITE_FIREBASE_PROJECT_ID`: Your Firebase Project ID

### 4. Firebase Configuration
Since this is a client-side app using Firebase:
1. In Firebase Console, add your Netlify domain to "Authorized domains"
2. Go to Authentication > Settings > Authorized domains
3. Add your new `.netlify.app` domain

## Files Prepared for Deployment

✅ `netlify.toml` - Netlify configuration
✅ `_redirects` - SPA routing rules  
✅ Firebase client-side setup
✅ Build configuration

Your app will work as a static site with Firebase handling all backend functionality.