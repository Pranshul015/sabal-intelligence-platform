# Scheme Saarthi - Quick Reference Card

## 🚀 5-Minute Setup

```bash
# 1. Create project
mkdir scheme-saarthi && cd scheme-saarthi

# 2. Copy all files from /local-setup to project root

# 3. Create directories
mkdir -p src/components/ui src/components/figma src/styles

# 4. Copy source files:
#    /App.tsx → src/App.tsx
#    /components/* → src/components/*
#    /styles/globals.css → src/styles/globals.css

# 5. Install & run
npm install
npm run dev
```

**Open**: http://localhost:3000

---

## 📦 Essential Commands

```bash
npm install              # Install all dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
```

---

## 🔧 Quick Fixes

### Dev server won't start
```bash
rm -rf node_modules package-lock.json
npm install
```

### Styles not working
Check `src/main.tsx` has:
```typescript
import './styles/globals.css'
```

### TypeScript errors
In VS Code: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"

### Port 3000 in use
Edit `vite.config.ts`:
```typescript
server: { port: 3001 }
```

---

## 📂 File Structure

```
scheme-saarthi/
├── src/
│   ├── components/          # All React components
│   ├── styles/
│   │   └── globals.css     # Tailwind + custom CSS
│   ├── App.tsx             # Main app
│   └── main.tsx            # Entry point
├── package.json            # Dependencies
├── vite.config.ts          # Vite config
├── tsconfig.json           # TypeScript config
└── index.html              # HTML template
```

---

## 📋 Checklist

Before deployment:
- [ ] `npm run dev` works
- [ ] No console errors
- [ ] All pages load
- [ ] Mobile responsive
- [ ] `npm run build` succeeds

---

## 🚢 Deploy to Vercel

```bash
npm install -g vercel
vercel
```

---

## 📚 Documentation

- **Full Setup**: `LOCAL_SETUP_GUIDE.md`
- **Dependencies**: `DEPENDENCIES_LIST.md`
- **Migration**: `MIGRATION_GUIDE.md`
- **Summary**: `LOCAL_DEPLOYMENT_SUMMARY.md`

---

## 💡 Key Points

- ✅ Uses Vite (fast!)
- ✅ Tailwind CSS v4
- ✅ TypeScript
- ✅ 45 packages
- ✅ ~500MB install
- ✅ FREE to use

---

**Need help?** Read the full guides!
