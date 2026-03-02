# 🌉 Sabal — The Complete Government Scheme Delivery Ecosystem

> **Sabal** (Bridge of Support) is a comprehensive, dual-platform ecosystem designed to eliminate the friction in Indian government scheme delivery. It bridges the gap between citizens who need support and the NGOs deployed to help them, using AI-powered eligibility matching, OCR document processing, and spatial gap analysis.

The Sabal ecosystem consists of two interconnected platforms operating within a unified monorepo:

1. **Sabal Setu**: The Citizen-Facing Application Portal.
2. **Sabal AI**: The NGO Intelligence & Analytics Dashboard.

---

## 🏗️ 1. Sabal Setu (Citizen Portal)

A full-stack web application that helps Indian citizens discover, apply for, and track 57+ government schemes using AI.

### ✨ Key Features
- **🔍 AI Scheme Discovery**: Browse 57 real Indian government schemes across 15+ categories. AI matches schemes perfectly to user profiles (age, income, category, state).
- **📋 Smart Application System**: 3-step application wizard with unique reference number generation and status tracking.
- **📄 AI Document Vault (OCR)**: Upload Aadhaar, PAN, and income certificates. Google Gemini Multimodal AI extracts key data and auto-maps it to the user's profile to bypass manual entry.
- **💬 Complaints & Forum**: File priority-based complaints linked to specific schemes or applications and participate in community forums.

---

## 🛰️ 2. Sabal AI (NGO Intelligence Platform)

A high-level analytics dashboard designed for NGOs to identify geographic "blind spots" where citizens are eligible for schemes but failing to apply due to document barriers.

### ✨ Key Features
- **🗺️ Interactive India Heatmap**: Visualizes scheme delivery gaps across India using `react-leaflet`. Zones are color-coded by the severity of unserved populations.
- **📊 Zone Analytics Drawer**: Deep dive into specific zones (e.g., "Jaipur North Ward 12") to see exact demographic breakdowns and the exact documents causing application bottlenecks.
- **🤖 Field Intelligence Briefs**: Live integration with Gemini AI to generate actionable narrative strategies (e.g., "Run mobile Aadhaar update camps in this district") based on raw zone data.
- **🏆 NGO Priority List**: Ranks 25 distinct Indian zones based on a computed **Social ROI Score**, mathematically telling NGOs where their physical deployment will have the highest impact.

---

## 📐 Monorepo Architecture

The project is structured as a monorepo containing 4 distinct services:

```text
sabal-setu/
├── src/                    # 1. Sabal Setu Frontend (Vite + React)
├── server/                 # 2. Sabal Setu Backend (Express + Prisma)
│
├── sabal-ngo/
│   ├── src/                # 3. Sabal AI Frontend (Vite + React)
│   └── server/             # 4. Sabal AI Backend (Express + Prisma)
```

## 📦 Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, React-Leaflet, Recharts
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma 6
- **AI/LLM Engine**: Google Gemini 2.0 Flash (OCR & Intelligence Generation)
- **Authentication**: JWT (jsonwebtoken) + bcryptjs

---

## 🚀 Local Setup & Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)
- Google Gemini API key

### 1. Clone & Install
```bash
git clone <repository-url>
cd sabal-setu

# Install Citizen Frontend
npm install

# Install Citizen Backend
cd server && npm install

# Install NGO Frontend
cd ../sabal-ngo && npm install

# Install NGO Backend
cd server && npm install
```

### 2. Configure Environment Variables
You need `.env` files in both backend directories (`server/.env` and `sabal-ngo/server/.env`):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:6543/postgres?pgbouncer=true"
JWT_SECRET=your_super_secret_key
GEMINI_API_KEY=your_gemini_api_key
```

### 3. Database Seeding (Crucial)
The system relies on robust synthetic data to function. 

```bash
# Terminal 1: Seed Sabal Setu (57 Schemes)
cd server
npx prisma generate
npx tsx prisma/seed.ts

# Terminal 2: Seed Sabal AI (1,125 Synthetic Profiles + 25 Zones)
cd sabal-ngo/server
npx prisma generate
npx tsx src/scripts/generate-sql.ts
# ^ Take the generated `seed.sql` file and run it in your Supabase SQL editor.
```

### 4. Run the Ecosystem
You will need 4 terminal tabs to run the entire suite locally:

```bash
# Tab 1: Citizen Backend (Runs on Port 5000)
cd server && npm run dev

# Tab 2: Citizen Frontend (Runs on Port 3000)
npm run dev

# Tab 3: NGO Backend (Runs on Port 5001)
cd sabal-ngo/server && npm run dev

# Tab 4: NGO Frontend (Runs on Port 5174)
cd sabal-ngo && npm run dev
```

---

## 🌍 Deployment

To deploy this ecosystem to production:
1. Push this monorepo to GitHub.
2. Deploy the `server/` and `sabal-ngo/server/` directories as separate **Render Web Services**.
3. Deploy the root `/` and `sabal-ngo/` directories as separate **Vercel Projects**.

*(See `deployment_guide.md` for exact step-by-step instructions on setting up Render and Vercel).*