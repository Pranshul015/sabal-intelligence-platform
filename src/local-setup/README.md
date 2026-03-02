# Scheme Saarthi - Local Setup Files

This directory contains all the configuration files needed to run Scheme Saarthi locally in VS Code.

## Quick Start

1. **Create a new directory for your project:**
   ```bash
   mkdir scheme-saarthi
   cd scheme-saarthi
   ```

2. **Copy all files from this `local-setup` folder to your project root**

3. **Copy the source files:**
   - Copy `/App.tsx` to `src/App.tsx`
   - Copy all `/components` to `src/components`
   - Copy `/styles/globals.css` to `src/styles/globals.css`

4. **Install dependencies:**
   ```bash
   npm install
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser to:** `http://localhost:3000`

## File Structure

Your final project should look like this:

```
scheme-saarthi/
├── node_modules/           # Created after npm install
├── src/
│   ├── components/         # Copy from /components
│   │   ├── ui/            # UI components
│   │   ├── figma/         # Figma components
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
│   │   └── globals.css    # Copy from /styles/globals.css
│   ├── App.tsx            # Copy from /App.tsx
│   └── main.tsx           # Already in local-setup/src/
├── index.html             # From local-setup
├── package.json           # From local-setup
├── tsconfig.json          # From local-setup
├── tsconfig.app.json      # From local-setup
├── tsconfig.node.json     # From local-setup
├── vite.config.ts         # From local-setup
└── .gitignore            # From local-setup
```

## Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Configuration Files Included

1. **package.json** - All dependencies and scripts
2. **vite.config.ts** - Vite configuration with React and Tailwind plugins
3. **tsconfig.json** - TypeScript configuration (root)
4. **tsconfig.app.json** - TypeScript configuration for app code
5. **tsconfig.node.json** - TypeScript configuration for Vite config
6. **index.html** - HTML entry point
7. **src/main.tsx** - React entry point
8. **.gitignore** - Git ignore rules

## Notes

- This uses **Tailwind CSS v4** (latest)
- Uses **Vite** as the build tool (faster than Create React App)
- All UI components are from shadcn/ui style components
- Images use Unsplash URLs (requires internet connection)

## Troubleshooting

If you encounter issues, see the **LOCAL_SETUP_GUIDE.md** for detailed troubleshooting steps.

## Next Steps

After setup, you can:
1. Add proper routing with `react-router-dom`
2. Connect to a real backend API
3. Add authentication
4. Deploy to production

---

**Happy coding! 🚀**
