# Complete Dependencies List for Scheme Saarthi

This is the complete list of all npm packages needed to run Scheme Saarthi locally.

---

## Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

---

## UI Framework & Styling

```json
{
  "dependencies": {
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "^4.0.0"
  }
}
```

---

## Icons

```json
{
  "dependencies": {
    "lucide-react": "^0.468.0"
  }
}
```

---

## Radix UI Components (for shadcn/ui)

These are the headless UI components used by the shadcn/ui components:

```json
{
  "dependencies": {
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.1.6"
  }
}
```

---

## Toast Notifications

```json
{
  "dependencies": {
    "sonner": "2.0.3"
  }
}
```

---

## Form Handling (Optional - if you add forms later)

```json
{
  "dependencies": {
    "react-hook-form": "7.55.0"
  }
}
```

---

## Date Utilities (Optional)

```json
{
  "dependencies": {
    "date-fns": "^4.1.0"
  }
}
```

---

## TypeScript & Development

```json
{
  "devDependencies": {
    "typescript": "^5.6.2",
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@types/node": "^22.10.5",
    "@vitejs/plugin-react": "^4.3.4",
    "vite": "^6.0.11"
  }
}
```

---

## Complete package.json

Here's the complete `package.json` file you can use:

```json
{
  "name": "scheme-saarthi",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tailwindcss": "^4.0.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2",
    "lucide-react": "^0.468.0",
    "@radix-ui/react-accordion": "^1.2.2",
    "@radix-ui/react-alert-dialog": "^1.1.4",
    "@radix-ui/react-avatar": "^1.1.2",
    "@radix-ui/react-checkbox": "^1.1.3",
    "@radix-ui/react-collapsible": "^1.1.2",
    "@radix-ui/react-dialog": "^1.1.4",
    "@radix-ui/react-dropdown-menu": "^2.1.4",
    "@radix-ui/react-label": "^2.1.1",
    "@radix-ui/react-popover": "^1.1.4",
    "@radix-ui/react-progress": "^1.1.1",
    "@radix-ui/react-radio-group": "^1.2.2",
    "@radix-ui/react-scroll-area": "^1.2.2",
    "@radix-ui/react-select": "^2.1.4",
    "@radix-ui/react-separator": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.2",
    "@radix-ui/react-slot": "^1.1.1",
    "@radix-ui/react-switch": "^1.1.2",
    "@radix-ui/react-tabs": "^1.1.2",
    "@radix-ui/react-toast": "^1.2.4",
    "@radix-ui/react-tooltip": "^1.1.6",
    "sonner": "2.0.3",
    "react-hook-form": "7.55.0",
    "date-fns": "^4.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.17",
    "@types/react-dom": "^18.3.5",
    "@types/node": "^22.10.5",
    "@vitejs/plugin-react": "^4.3.4",
    "@tailwindcss/vite": "^4.0.0",
    "typescript": "^5.6.2",
    "vite": "^6.0.11"
  }
}
```

---

## Installation Commands

### Install All at Once

Copy the `package.json` above to your project root and run:

```bash
npm install
```

### Install Step-by-Step

If you prefer to install packages one by one:

```bash
# Core
npm install react react-dom

# Tailwind CSS v4
npm install tailwindcss@next
npm install -D @tailwindcss/vite@next

# Utilities
npm install class-variance-authority clsx tailwind-merge

# Icons
npm install lucide-react

# Radix UI (all at once)
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip

# Toast
npm install sonner@2.0.3

# Forms (optional)
npm install react-hook-form@7.55.0

# Date utilities (optional)
npm install date-fns

# Dev dependencies
npm install -D typescript @types/react @types/react-dom @types/node @vitejs/plugin-react vite
```

---

## Package Sizes (Approximate)

Total install size: ~400-500 MB (including node_modules)

Key packages:
- `react` + `react-dom`: ~5 MB
- Radix UI components (all): ~15 MB
- `tailwindcss`: ~25 MB
- `lucide-react`: ~20 MB
- Dev dependencies: ~300 MB

---

## Version Notes

- **Tailwind CSS v4**: We're using the latest v4 which has a different setup than v3
- **sonner**: Must be version 2.0.3 for compatibility
- **react-hook-form**: Must be version 7.55.0
- All other packages can use the latest versions

---

## Troubleshooting

### If `npm install` fails:

1. **Clear npm cache**:
   ```bash
   npm cache clean --force
   ```

2. **Delete lock file and node_modules**:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Use different registry** (if behind a firewall):
   ```bash
   npm config set registry https://registry.npmjs.org/
   ```

4. **Try with --legacy-peer-deps**:
   ```bash
   npm install --legacy-peer-deps
   ```

---

## Alternative: Using Yarn or pnpm

### Yarn
```bash
yarn add [package-name]
```

### pnpm (faster and more efficient)
```bash
pnpm add [package-name]
```

---

**Total packages**: ~35 dependencies + ~10 devDependencies = **45 packages**
