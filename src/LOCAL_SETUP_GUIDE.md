# Scheme Saarthi - Local Development Setup Guide

This guide will help you set up and run Scheme Saarthi on your local machine using VS Code.

---

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **VS Code** - [Download here](https://code.visualstudio.com/)

---

## Step-by-Step Setup

### 1. Create a New Vite + React + TypeScript Project

Open your terminal and run:

```bash
npm create vite@latest scheme-saarthi -- --template react-ts
cd scheme-saarthi
```

### 2. Install Dependencies

Install all required packages:

```bash
# Core dependencies
npm install react react-dom
npm install -D typescript @types/react @types/react-dom

# UI and Styling
npm install tailwindcss@next @tailwindcss/vite@next
npm install class-variance-authority clsx tailwind-merge

# Icons and UI Components
npm install lucide-react
npm install sonner@2.0.3
npm install @radix-ui/react-accordion
npm install @radix-ui/react-alert-dialog
npm install @radix-ui/react-avatar
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-collapsible
npm install @radix-ui/react-dialog
npm install @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label
npm install @radix-ui/react-popover
npm install @radix-ui/react-progress
npm install @radix-ui/react-radio-group
npm install @radix-ui/react-scroll-area
npm install @radix-ui/react-select
npm install @radix-ui/react-separator
npm install @radix-ui/react-slider
npm install @radix-ui/react-switch
npm install @radix-ui/react-tabs
npm install @radix-ui/react-toast
npm install @radix-ui/react-tooltip
npm install @radix-ui/react-slot

# Optional: For form handling
npm install react-hook-form@7.55.0

# Optional: For date utilities
npm install date-fns

# Dev dependencies
npm install -D @types/node
```

### 3. Configure Vite

Replace the contents of `vite.config.ts` with:

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
})
```

### 4. Configure TypeScript

Replace `tsconfig.json` with:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Update `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    
    /* Path aliases */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"]
}
```

### 5. Set Up Tailwind CSS v4

Create `src/styles/globals.css` and copy the contents from the provided `globals.css` file.

### 6. Update main.tsx

Replace `src/main.tsx` with:

```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### 7. Copy Project Files

Copy all files from the Figma Make project to your local project:

1. **Copy all components**: 
   - Copy everything from `/components` to `src/components`
   
2. **Copy App.tsx**:
   - Copy `/App.tsx` to `src/App.tsx`
   
3. **Copy styles**:
   - Copy `/styles/globals.css` to `src/styles/globals.css`

### 8. Update Import Paths

You'll need to update some import paths in your components:

**In all component files**, update the import for `ImageWithFallback`:
- Change: `import { ImageWithFallback } from "./figma/ImageWithFallback"`
- To: Regular `<img>` tags OR keep the ImageWithFallback component (it should work fine)

**All other imports** should work as-is since we maintained the same directory structure.

### 9. Fix the utils.ts Import

In `src/components/ui/button.tsx` and other UI components that import from `"./utils"`, make sure the path is correct:

```typescript
import { cn } from "./utils"
```

### 10. Run the Development Server

```bash
npm run dev
```

Open your browser to `http://localhost:5173`

---

## Common Issues and Solutions

### Issue 1: Module not found errors
**Solution**: Make sure all dependencies are installed. Run `npm install` again.

### Issue 2: Tailwind classes not working
**Solution**: 
- Ensure `@tailwindcss/vite` plugin is in `vite.config.ts`
- Make sure `globals.css` is imported in `main.tsx`
- Restart the dev server

### Issue 3: Type errors with Radix UI components
**Solution**: Install the missing `@types` packages:
```bash
npm install -D @types/react @types/react-dom
```

### Issue 4: Images not loading
**Solution**: The `ImageWithFallback` component should work with external URLs. If images fail to load, check your internet connection or replace with local images.

---

## Project Structure

```
scheme-saarthi/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (shadcn-style)
│   │   ├── figma/           # Figma-specific components
│   │   ├── Header.tsx
│   │   ├── HeroSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── SchemeExplorer.tsx
│   │   ├── UserToolsSection.tsx
│   │   ├── EducationResources.tsx
│   │   ├── Footer.tsx
│   │   ├── LoginPage.tsx
│   │   ├── Dashboard.tsx
│   │   ├── DashboardNavbar.tsx
│   │   ├── DashboardCard.tsx
│   │   ├── QuickStats.tsx
│   │   ├── RecommendedActions.tsx
│   │   └── ChatbotModal.tsx
│   ├── styles/
│   │   └── globals.css      # Tailwind v4 + custom CSS variables
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

To preview the production build:

```bash
npm run preview
```

---

## Next Steps

1. **Add a routing library** (optional): Install `react-router-dom` for proper routing instead of state-based navigation
2. **Add a backend**: Connect to a real backend API or set up Supabase
3. **Add authentication**: Implement real authentication (Firebase, Auth0, or Supabase)
4. **Deploy**: Deploy to Vercel, Netlify, or your preferred hosting platform

---

## Useful VS Code Extensions

- **ES7+ React/Redux/React-Native snippets** - Code snippets
- **Tailwind CSS IntelliSense** - Tailwind class autocomplete
- **Prettier** - Code formatter
- **ESLint** - JavaScript linter

---

## Getting Help

If you encounter any issues:
1. Check the browser console for errors
2. Make sure all dependencies are installed
3. Restart the dev server
4. Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

---

**Happy coding! 🚀**
