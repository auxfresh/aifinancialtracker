# Deploy Your Personal Finance Tracker to Netlify

## Quick Deployment Steps

### Method 1: Direct Upload (Fastest)
1. Build your app:
   ```bash
   npx vite build --outDir dist/public
   cp _redirects dist/public/
   ```

2. Go to [Netlify](https://app.netlify.com/drop)
3. Drag the `dist/public` folder to the drop zone
4. Your site goes live instantly!

### Method 2: Git Integration
1. Push your code to GitHub
2. Connect repository to Netlify
3. Set build command: `npx vite build --outDir dist/public && cp _redirects dist/public/`
4. Set publish directory: `dist/public`

## Environment Variables Setup
Add these in your Netlify dashboard under Site Settings > Environment Variables:

- **VITE_FIREBASE_API_KEY**: `AIzaSyB2teZUm8NblVJb3JoIu7OGMWFifiXbiIc`
- **VITE_FIREBASE_APP_ID**: `1:470963813326:web:454b26a95670662ff6c99f`  
- **VITE_FIREBASE_PROJECT_ID**: `post-generator-a032e`

## Firebase Setup for Production
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `post-generator-a032e`
3. Go to Authentication > Settings > Authorized domains
4. Add your Netlify domain (e.g., `your-app-name.netlify.app`)

## Files Ready for Deployment
✅ `netlify.toml` - Configuration file
✅ `_redirects` - Single Page App routing
✅ Firebase integration configured
✅ Build process optimized

Your personal finance tracker will work as a fast, secure static site with Firebase handling authentication and data storage.