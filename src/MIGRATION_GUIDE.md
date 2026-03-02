# Scheme Saarthi - Migration Guide from Figma Make to Local Setup

This guide provides step-by-step instructions to migrate your Scheme Saarthi project from Figma Make to a local development environment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Option A: Quick Setup (Recommended)](#option-a-quick-setup-recommended)
3. [Option B: Manual Setup](#option-b-manual-setup)
4. [Key Differences Between Figma Make and Local](#key-differences)
5. [Code Modifications Required](#code-modifications-required)
6. [Testing Your Local Setup](#testing-your-local-setup)
7. [Common Issues](#common-issues)

---

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **VS Code** - [Download](https://code.visualstudio.com/)
- **Git** (optional but recommended)
- Internet connection (for downloading dependencies and images)

Verify your Node.js installation:
```bash
node --version  # Should show v18.0.0 or higher
npm --version   # Should show 9.0.0 or higher
```

---

## Option A: Quick Setup (Recommended)

### Step 1: Create Project Directory

```bash
mkdir scheme-saarthi
cd scheme-saarthi
```

### Step 2: Copy Configuration Files

1. Download or copy all files from the `/local-setup` folder
2. Place them in your project root directory

Your directory should now have:
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- `index.html`
- `.gitignore`

### Step 3: Create Source Directory Structure

```bash
mkdir -p src/components/ui
mkdir -p src/components/figma
mkdir -p src/styles
```

### Step 4: Copy Source Files

Copy the following files from Figma Make to your local project:

**Main App File:**
- Copy `/App.tsx` → `src/App.tsx`

**Styles:**
- Copy `/styles/globals.css` → `src/styles/globals.css`

**All Components:**
- Copy `/components/*.tsx` → `src/components/`
- Copy `/components/ui/*.tsx` → `src/components/ui/`
- Copy `/components/ui/*.ts` → `src/components/ui/`
- Copy `/components/figma/*.tsx` → `src/components/figma/`

**Main Entry Point:**
- The `src/main.tsx` is already included in `/local-setup/src/main.tsx`

### Step 5: Install Dependencies

```bash
npm install
```

This will install all ~45 packages (takes 2-5 minutes depending on your internet speed).

### Step 6: Run Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:3000` 🎉

---

## Option B: Manual Setup

### Step 1: Create Vite React TypeScript Project

```bash
npm create vite@latest scheme-saarthi -- --template react-ts
cd scheme-saarthi
```

### Step 2: Install Dependencies

```bash
# Core styling
npm install tailwindcss@next
npm install -D @tailwindcss/vite@next
npm install class-variance-authority clsx tailwind-merge

# Icons
npm install lucide-react

# Radix UI components
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip

# Toast notifications
npm install sonner@2.0.3

# Forms
npm install react-hook-form@7.55.0

# Utilities
npm install date-fns

# Dev dependencies
npm install -D @types/node
```

### Step 3: Update vite.config.ts

Replace the contents of `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
```

### Step 4: Update tsconfig Files

See the config files in `/local-setup` folder for the complete TypeScript configuration.

### Step 5: Copy All Source Files

Follow Step 4 from Option A above.

---

## Key Differences Between Figma Make and Local

| Feature | Figma Make | Local Setup |
|---------|-----------|-------------|
| **Package Management** | Automatic | Manual (`npm install`) |
| **Hot Reload** | Built-in | Vite (very fast) |
| **Asset Imports** | Special `figma:asset` scheme | Standard URLs or local files |
| **Build Tool** | Custom | Vite |
| **Port** | Auto-assigned | 3000 (configurable) |
| **Environment** | Sandboxed | Full Node.js |
| **TypeScript** | Auto-configured | Manual config |
| **Dependencies** | No `package.json` visible | Full control via `package.json` |

---

## Code Modifications Required

### 1. No Changes to Component Imports

Good news! Since we're maintaining the same directory structure, all your component imports will work as-is:

```typescript
// These imports work without modification
import { Header } from "./components/Header";
import { Button } from "./components/ui/button";
```

### 2. Image Handling

The `ImageWithFallback` component already uses standard URLs, so no changes needed. However, if you want to use local images:

**Option A: Keep using Unsplash URLs (current setup)**
```typescript
// This works as-is
<ImageWithFallback
  src="https://images.unsplash.com/photo-123..."
  alt="Description"
/>
```

**Option B: Use local images**
```bash
# Create public folder
mkdir public/images

# Add your images to public/images/
# Then reference them like:
<img src="/images/your-image.jpg" alt="Description" />
```

### 3. Environment Variables (if needed later)

If you add API keys or backend URLs:

Create `.env.local`:
```env
VITE_API_URL=https://your-api.com
VITE_SUPABASE_URL=your-supabase-url
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

### 4. Routing (Optional Enhancement)

The current app uses state-based navigation. For better routing, install `react-router-dom`:

```bash
npm install react-router-dom
```

---

## Testing Your Local Setup

### 1. Verify Development Server

```bash
npm run dev
```

Expected output:
```
  VITE v6.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### 2. Check Each Page

1. **Landing Page** - Should load at `http://localhost:3000`
2. **Login/Signup** - Click "Login / Sign Up" button
3. **Dashboard** - Login and verify dashboard loads

### 3. Test Features

- ✅ Dark mode toggle
- ✅ Mobile responsive menu
- ✅ Chatbot modal
- ✅ All interactive cards
- ✅ Form inputs
- ✅ Navigation between pages

### 4. Check Browser Console

Open DevTools (F12) and check for:
- ❌ No errors in Console
- ✅ All images loading
- ✅ No 404s in Network tab

### 5. Build for Production

```bash
npm run build
```

Should complete without errors and create a `dist/` folder.

Preview the production build:
```bash
npm run preview
```

---

## Common Issues

### Issue 1: "Cannot find module" errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue 2: Tailwind styles not loading

**Symptoms:** No styling, everything looks broken

**Solution:**
1. Check that `globals.css` is in `src/styles/`
2. Verify `src/main.tsx` imports it:
   ```typescript
   import './styles/globals.css'
   ```
3. Check `vite.config.ts` has the Tailwind plugin:
   ```typescript
   import tailwindcss from '@tailwindcss/vite'
   plugins: [react(), tailwindcss()]
   ```
4. Restart dev server: `npm run dev`

### Issue 3: TypeScript errors

**Solution:**
1. Make sure all `@types` packages are installed
2. Check `tsconfig.app.json` includes `"src"`
3. Restart VS Code TypeScript server:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "TypeScript: Restart TS Server"

### Issue 4: Port 3000 already in use

**Solution:**

Change port in `vite.config.ts`:
```typescript
server: {
  port: 3001, // or any available port
  open: true,
}
```

Or kill the process using port 3000:
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill
```

### Issue 5: Images not loading

**Symptoms:** Broken image icons

**Possible causes:**
1. No internet connection (Unsplash images require internet)
2. Unsplash rate limit

**Solutions:**
- Check internet connection
- Replace with local images in `public/images/`
- The `ImageWithFallback` component shows a placeholder SVG if images fail

### Issue 6: "exports is not defined" error

**Solution:**
Check `package.json` has:
```json
{
  "type": "module"
}
```

### Issue 7: React Hook errors in development

**Solution:**
Make sure you're not importing React twice. Check that you don't have duplicate `react` or `react-dom` in `node_modules`.

```bash
npm ls react react-dom
```

Should show only one version of each.

---

## Performance Optimization

### 1. Code Splitting

Vite automatically code-splits, but you can optimize further:

```typescript
// Lazy load pages
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./components/Dashboard'));

// Use with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

### 2. Build Size

Check your build size:
```bash
npm run build
```

Typical size for this app: ~200-300 KB (gzipped)

### 3. Lighthouse Score

Run Lighthouse in Chrome DevTools for performance metrics.

---

## Deployment

Once your local setup works, you can deploy to:

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### GitHub Pages
```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
"deploy": "npm run build && gh-pages -d dist"

# Deploy
npm run deploy
```

---

## Next Steps After Migration

1. **Add React Router** for proper URL-based navigation
2. **Set up environment variables** for API keys
3. **Connect to a real backend** (Supabase, Firebase, custom API)
4. **Add proper authentication** with JWT or OAuth
5. **Set up CI/CD** with GitHub Actions
6. **Add unit tests** with Vitest
7. **Add E2E tests** with Playwright

---

## Getting Help

If you're stuck:

1. **Check the error message** carefully - it usually points to the issue
2. **Read the browser console** - errors show the exact file and line
3. **Check Network tab** - see which requests are failing
4. **Clear everything and reinstall**:
   ```bash
   rm -rf node_modules package-lock.json dist
   npm install
   npm run dev
   ```

---

## Checklist

Before you consider migration complete, verify:

- [ ] Dev server starts without errors
- [ ] All pages load correctly
- [ ] No console errors in browser
- [ ] Dark mode works
- [ ] Mobile responsive design works
- [ ] All images load
- [ ] Forms are functional
- [ ] Navigation works between pages
- [ ] Production build succeeds (`npm run build`)
- [ ] Production preview works (`npm run preview`)

---

**Congratulations! 🎉** 

Your Scheme Saarthi app is now running locally and you have full control over the codebase!

---

## Appendix: File Checklist

Make sure you have all these files:

### Root Files
- [ ] `package.json`
- [ ] `vite.config.ts`
- [ ] `tsconfig.json`
- [ ] `tsconfig.app.json`
- [ ] `tsconfig.node.json`
- [ ] `index.html`
- [ ] `.gitignore`

### Source Files
- [ ] `src/main.tsx`
- [ ] `src/App.tsx`
- [ ] `src/styles/globals.css`

### Components
- [ ] `src/components/Header.tsx`
- [ ] `src/components/HeroSection.tsx`
- [ ] `src/components/FeaturesSection.tsx`
- [ ] `src/components/SchemeExplorer.tsx`
- [ ] `src/components/UserToolsSection.tsx`
- [ ] `src/components/EducationResources.tsx`
- [ ] `src/components/Footer.tsx`
- [ ] `src/components/LoginPage.tsx`
- [ ] `src/components/Dashboard.tsx`
- [ ] `src/components/DashboardNavbar.tsx`
- [ ] `src/components/DashboardCard.tsx`
- [ ] `src/components/QuickStats.tsx`
- [ ] `src/components/RecommendedActions.tsx`
- [ ] `src/components/ChatbotModal.tsx`

### UI Components (all files from `/components/ui/`)
- [ ] All `.tsx` files from `components/ui/`
- [ ] All `.ts` files from `components/ui/`

### Figma Components
- [ ] `src/components/figma/ImageWithFallback.tsx`

---

Total files to copy: **~60-70 files**

---

**Happy coding! 🚀**
